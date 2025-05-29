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

  const { system_id, name, description, currency, downpayment, monthly, yearly } = payload

  try {
  // Create Stripe product
  const product = await stripe.products.create({
    name,
    description,
    metadata: {
      system_id: String(system_id),
    },
  })

  // Create Stripe prices
  const [down, month, year] = await Promise.all([
    stripe.prices.create({
      unit_amount: Number(downpayment) * 100,
      currency: currency.toLowerCase(),
      product: product.id,
    }),
    stripe.prices.create({
      unit_amount: Number(monthly) * 100,
      currency: currency.toLowerCase(),
      recurring: { interval: 'month' },
      product: product.id,
    }),
    stripe.prices.create({
      unit_amount: Number(yearly) * 100,
      currency: currency.toLowerCase(),
      recurring: { interval: 'year' },
      product: product.id,
    }),
  ])

  // Insert into 'products'
  const { data: insertedProduct, error: productError } = await supabase
    .from('products')
    .insert({
      id: product.id,
      name,
      description,
      active: product.active,
      metadata: product.metadata,
      strip_product_id: product.id
    })
    .select()

  if (productError) {
    // Rollback: delete system
    await supabase.from('Systems').delete().eq('id', system_id)
    throw new Error(`Failed to insert product: ${productError.message}`)
  }

  // Insert into 'prices'
  const { error: pricesError } = await supabase.from('prices').insert([
    {
      id: down.id,
      product_id: product.id,
      active: down.active,
      description: down.nickname ?? 'Downpayment',
      unit_amount: down.unit_amount,
      currency: down.currency,
      type: down.type,
      interval: null,
      interval_count: null,
      trial_period_days: null,
      metadata: down.metadata,
      strip_price_id: down.id,
    },
    {
      id: month.id,
      product_id: product.id,
      active: month.active,
      description: month.nickname ?? 'Monthly Subscription',
      unit_amount: month.unit_amount,
      currency: month.currency,
      type: month.type,
      interval: month.recurring?.interval,
      interval_count: month.recurring?.interval_count,
      trial_period_days: month.recurring?.trial_period_days ?? null,
      metadata: month.metadata,
      strip_price_id: month.id,
    },
    {
      id: year.id,
      product_id: product.id,
      active: year.active,
      description: year.nickname ?? 'Yearly Subscription',
      unit_amount: year.unit_amount,
      currency: year.currency,
      type: year.type,
      interval: year.recurring?.interval,
      interval_count: year.recurring?.interval_count,
      trial_period_days: year.recurring?.trial_period_days ?? null,
      metadata: year.metadata,
      strip_price_id: year.id,
    }
  ]).select()

  if (pricesError) {
    // Rollback: delete product & system
    await supabase.from('products').delete().eq('id', product.id)
    await supabase.from('Systems').delete().eq('id', system_id)
    throw new Error(`Failed to insert prices: ${pricesError.message}`)
  }

  // ✅ Update system with the created product
  const { error: updateSystemError } = await supabase
    .from('Systems')
    .update({ product_id: product.id })
    .eq('id', system_id)

  if (updateSystemError) {
    // Rollback: delete prices, product & system
    await supabase.from('prices').delete().eq('product_id', product.id)
    await supabase.from('products').delete().eq('id', product.id)
    await supabase.from('Systems').delete().eq('id', system_id)
    throw new Error(`Failed to update system: ${updateSystemError.message}`)
  }

  // 🎉 Success!
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })

} catch (error) {
  console.error('Error:', error)
  return new Response(`Error: ${error.message}`, {
    status: 500,
    headers: corsHeaders,
  })
}

})

