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
    // Create installation product
    const installationProduct = await stripe.products.create({
      name: `${name} - Installation`,
      description: `Installation fee for ${description}`,
      metadata: { system_id: String(system_id), type: 'installation' },
    })

    // Create maintenance product (set as inactive)
    const maintenanceProduct = await stripe.products.create({
      name: `${name} - Maintenance`,
      description: `Maintenance plan for ${description}`,
      metadata: { system_id: String(system_id), type: 'maintenance' },
      active: true, 
    })

    // Create prices
    const [down, month, year] = await Promise.all([
      // Installation one-time
      stripe.prices.create({
        unit_amount: Number(downpayment) * 100,
        currency: currency.toLowerCase(),
        product: installationProduct.id,
      }),
      // Maintenance - monthly
      stripe.prices.create({
        unit_amount: Number(monthly) * 100,
        currency: currency.toLowerCase(),
        recurring: { interval: 'month' },
        product: maintenanceProduct.id,
      }),
      // Maintenance - yearly
      stripe.prices.create({
        unit_amount: Number(yearly) * 100,
        currency: currency.toLowerCase(),
        recurring: { interval: 'year' },
        product: maintenanceProduct.id,
      }),
    ])

    // Insert products into Supabase
    const { error: installProductError } = await supabase
      .from('products')
      .insert({
        id: installationProduct.id,
        name: installationProduct.name,
        description: installationProduct.description,
        active: installationProduct.active,
        metadata: installationProduct.metadata,
        stripe_product_id: installationProduct.id
      })

    const { error: maintenanceProductError } = await supabase
      .from('products')
      .insert({
        id: maintenanceProduct.id,
        name: maintenanceProduct.name,
        description: maintenanceProduct.description,
        active: false,
        metadata: maintenanceProduct.metadata,
        stripe_product_id: maintenanceProduct.id
      })

    if (installProductError || maintenanceProductError) {
      await supabase.from('Systems').delete().eq('id', system_id)
      throw new Error(`Failed to insert product(s): ${installProductError?.message || ''} ${maintenanceProductError?.message || ''}`)
    }

    // Insert prices into Supabase
    const { error: pricesError } = await supabase.from('prices').insert([
      {
        id: down.id,
        product_id: installationProduct.id,
        active: down.active,
        description: down.nickname ?? 'Installation Fee',
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
        product_id: maintenanceProduct.id,
        active: month.active,
        description: month.nickname ?? 'Monthly Maintenance',
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
        product_id: maintenanceProduct.id,
        active: year.active,
        description: year.nickname ?? 'Yearly Maintenance',
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
      // Rollback
      await supabase.from('products').delete().eq('id', installationProduct.id)
      await supabase.from('products').delete().eq('id', maintenanceProduct.id)
      await supabase.from('Systems').delete().eq('id', system_id)
      throw new Error(`Failed to insert prices: ${pricesError.message}`)
    }

    // Update system with both product IDs and mark maintenance as inactive
    const { error: updateSystemError } = await supabase
      .from('Systems')
      .update({
        installation_product_id: installationProduct.id,
        maintenance_product_id: maintenanceProduct.id,
        maintenance_active: false,
      })
      .eq('id', system_id)

    if (updateSystemError) {
      // Rollback
      await supabase.from('prices').delete().in('product_id', [installationProduct.id, maintenanceProduct.id])
      await supabase.from('products').delete().eq('id', installationProduct.id)
      await supabase.from('products').delete().eq('id', maintenanceProduct.id)
      await supabase.from('Systems').delete().eq('id', system_id)
      throw new Error(`Failed to update system: ${updateSystemError.message}`)
    }

    // Sucess return
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
