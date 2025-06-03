export const updateStripeProduct = async (payload: UpdateStripePayload) => {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/update_stripe_product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Failed to update Stripe: ${message}`);
    }

    return response;
};