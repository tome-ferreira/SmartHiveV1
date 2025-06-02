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
    return new Response(null, { status: 204, headers: corsHeaders })
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

  const { system_id } = payload

  if (!system_id) {
    return new Response('Missing system_id', {
      status: 400,
      headers: corsHeaders,
    })
  }

  try {
    // Fetch system data
    const { data: system, error: fetchError } = await supabase
      .from('Systems')
      .select('installation_product_id, maintenance_product_id')
      .eq('id', system_id)
      .single()

    if (fetchError || !system) {
      return new Response(`System not found: ${fetchError?.message}`, {
        status: 404,
        headers: corsHeaders,
      })
    }

    const { installation_product_id, maintenance_product_id } = system

    const productIdsToDelete = [installation_product_id, maintenance_product_id].filter(Boolean)

    // Delete Stripe products (and cascade delete prices)
    for (const productId of productIdsToDelete) {
      try {
        await stripe.products.update(productId, { active: false })
        await stripe.products.del(productId)
      } catch (stripeError) {
        console.warn(`Failed to delete Stripe product ${productId}:`, stripeError.message)
      }
    }

    // Delete prices from Supabase
    const { error: deletePricesError } = await supabase
      .from('prices')
      .delete()
      .in('product_id', productIdsToDelete)

    if (deletePricesError) {
      throw new Error(`Failed to delete prices: ${deletePricesError.message}`)
    }

    // Delete products from Supabase
    const { error: deleteProductsError } = await supabase
      .from('products')
      .delete()
      .in('id', productIdsToDelete)

    if (deleteProductsError) {
      throw new Error(`Failed to delete products: ${deleteProductsError.message}`)
    }

    // Delete system
    const { error: deleteSystemError } = await supabase
      .from('Systems')
      .delete()
      .eq('id', system_id)

    if (deleteSystemError) {
      throw new Error(`Failed to delete system: ${deleteSystemError.message}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error deleting system:', error)
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: corsHeaders,
    })
  }
})
