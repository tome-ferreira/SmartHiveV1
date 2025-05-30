export const createStripeProduct = async (system_id: number, name: string, description: string, currency: string, downpayment: number, monthly: number, yearly: number ) => {
  const response = await fetch(`http://127.0.0.1:54321/functions/v1/create_stripe_product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    },
     body: JSON.stringify({
      system_id,
      name,
      description,
      currency,
      downpayment,
      monthly,
      yearly
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create Stripe product");
  }

  return result;
};
