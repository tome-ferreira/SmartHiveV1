import Stripe from 'https://esm.sh/stripe@14?target=denonext';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY')!);
const supabase = createClient(
  Deno.env.get('SB_URL')!,
  Deno.env.get('SB_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { 
      status: 405, 
      headers: corsHeaders,
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { 
      status: 400,
      headers: corsHeaders, 
    });
  }

  const { productId, updatedFields } = body;

  try {
    // Update Stripe Product
    await stripe.products.update(productId, {
      name: updatedFields.name,
      description: updatedFields.description,
      active: updatedFields.active,
    });

    // Update Supabase product
    await supabase.from('products').update({
      name: updatedFields.name,
      description: updatedFields.description,
      active: updatedFields.active,
    }).eq('id', productId);

    // Update prices
    if (updatedFields.prices?.length) {
      for (const price of updatedFields.prices) {
        // Fetch old price details from Supabase
        const { data: oldPriceData, error: oldPriceError } = await supabase
          .from("prices")
          .select("*")
          .eq("id", price.id)
          .single();

        if (oldPriceError || !oldPriceData) {
          throw new Error(`Failed to fetch old price data for ${price.id}`);
        }

        // Create a new price with same recurring config and currency
        const newStripePrice = await stripe.prices.create({
          unit_amount: price.amount,
          currency: oldPriceData.currency || "usd", // fallback to 'usd'
          recurring: { interval: oldPriceData.interval }, // { interval: 'month' } or similar
          product: productId,
        });

        // Mark old price inactive (optional)
        await stripe.prices.update(price.id, { active: false });

        // Update Supabase price record
        await supabase
          .from("prices")
          .update({
            id: newStripePrice.id,
            unit_amount: newStripePrice.unit_amount,
            active: true,
          })
          .eq("id", price.id); // Or insert new entry depending on your structure
      }
    }


    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Stripe update error:', err);
    return new Response(`Stripe update failed: ${err.message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
