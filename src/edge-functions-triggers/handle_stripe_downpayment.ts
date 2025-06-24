import { FullSystemDetails } from "../models/systemDetails";

export const handleDownpayment = async (system: FullSystemDetails) => {
    try {
        //const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/pay_downpayment`, {
        const response = await fetch(`http://127.0.0.1:54321/functions/v1/pay_downpayment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                systemId: system.id,
                clientId: system.clientid,
                amount: system.downpayment,
                currency: system.currency,
            }),
        });

        if (!response.ok) throw new Error("Failed to create checkout session");

        const data = await response.json();
        window.location.href = data.url;
    } catch (error) {
        console.error("Stripe error:", error);
        alert("Failed to initiate payment.");
    }
};
