import { FullSystemDetails } from "../models/systemDetails";

type BillingType = "monthly" | "yearly";

export const handleSubscription = async (
  system: FullSystemDetails,
  billing: BillingType
) => {
  try {
    const priceId =
      billing === "monthly"
        ? system.monthlypaymentpaymentid
        : system.yearlypaymentpaymentid;

    if (!priceId) {
      throw new Error("Missing Stripe price ID for selected billing type");
    }

    console.log(priceId);

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/pay_subscription`,
      //"http://127.0.0.1:54321/functions/v1/pay_subscription",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          systemId: system.id,
          clientId: system.clientid,
          priceId: priceId,
          billing: billing,
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to create subscription session");

    const data = await response.json();
    window.location.href = data.url;
  } catch (error) {
    console.error("Subscription error:", error);
    alert("Failed to start subscription.");
  }
};
