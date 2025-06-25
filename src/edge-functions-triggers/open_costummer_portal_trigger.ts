export const openCustomerPortal = async (clientId: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create_customer_portal`, {
    //const res = await fetch("http://127.0.0.1:54321/functions/v1/create_customer_portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ clientId }),
    });

    if (!res.ok) throw new Error("Failed to open portal");

    const { url } = await res.json();
    window.location.href = url;
  } catch (error) {
    console.error("Portal Error:", error);
    alert("Failed to open billing portal.");
  }
};
