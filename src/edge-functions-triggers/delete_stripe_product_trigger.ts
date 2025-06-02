export const deleteStripeProduct = async (system_id: number) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/delete_stripe_product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ system_id })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to delete system");
  }

  return result;
};
