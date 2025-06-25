import Stripe from 'https://esm.sh/stripe@14?target=denonext';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY')!);
const supabase = createClient(
  Deno.env.get('SB_URL')!,
  Deno.env.get('SB_SERVICE_ROLE_KEY')!
);

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

Deno.serve(async (req) => {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type, stripe-signature',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let event;

  try {
    if (!sig) throw new Error("Missing Stripe signature");
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400,
      headers: corsHeaders,
    });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.mode !== 'subscription') {
      return new Response("Not a subscription session", {
        status: 200,
        headers: corsHeaders,
      });
    }

    const subscriptionId = session.subscription;
    const clientId = session.metadata?.clientId;
    const systemId = session.metadata?.systemId;
    const billing = session.metadata?.billing;

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);

      const insertResult = await supabase.from("Subscriptions").insert({
        client_id: parseInt(clientId || "0"),
        system_id: parseInt(systemId || "0"),
        stripe_subscription_id: subscription.id,
        price_id: subscription.items.data[0]?.price?.id || "",
        billing: billing || "",
        status: subscription.status,
        start_date: new Date(subscription.start_date * 1000).toISOString(),
        end_date: subscription.ended_at
          ? new Date(subscription.ended_at * 1000).toISOString()
          : null,
      });

      if (insertResult.error) {
        throw insertResult.error;
      }

      console.log(" Subscription saved:", subscription.id);
    } catch (error) {
      console.error(" Error saving subscription:", error.message);
      return new Response("Error handling subscription", {
        status: 500,
        headers: corsHeaders,
      });
    }
  }

  return new Response("Webhook received", {
    status: 200,
    headers: corsHeaders,
  });
});
