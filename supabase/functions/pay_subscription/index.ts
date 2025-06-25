import Stripe from 'https://esm.sh/stripe@14?target=denonext'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY')!)
const supabase = createClient(
  Deno.env.get('SB_URL')!,
  Deno.env.get('SB_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders,
    })
  }

  let payload
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON body', {
      status: 400,
      headers: corsHeaders,
    })
  }

  const { systemId, clientId, priceId, billing } = payload

  if (!systemId || !clientId || !priceId) {
    return new Response('Missing parameters', {
      status: 400,
      headers: corsHeaders,
    })
  }

  try {
    // Fetch client
    const { data: customerRecord, error: customerError } = await supabase
      .from('CostumerRecords')
      .select('id, Name, Email, stripe_customer_id')
      .eq('id', clientId)
      .single()

    if (customerError) throw new Error(customerError.message)

    let stripeCustomerId = customerRecord.stripe_customer_id

    // Create Stripe customer if needed
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        name: customerRecord.name,
        email: customerRecord.email,
        metadata: {
          clientId: String(clientId),
        },
      })

      stripeCustomerId = stripeCustomer.id

      const { error: updateCustomerError } = await supabase
        .from('CostumerRecords')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', clientId)

      if (updateCustomerError) throw new Error(updateCustomerError.message)
    }

    console.log("priceId: ", priceId);

    // Create subscription checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId, // Pass the Stripe Price ID directly
          quantity: 1,
        },
      ],
      success_url: `${Deno.env.get("CLIENT_URL")}/payment-success?systemId=${systemId}`,
      cancel_url: `${Deno.env.get("CLIENT_URL")}/payment-cancelled?systemId=${systemId}`,
      metadata: {
        systemId: String(systemId),
        clientId: String(clientId),
        paymentType: "subscription",
        billing, // include whether it's monthly or yearly
      },
    });


    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Subscription Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
