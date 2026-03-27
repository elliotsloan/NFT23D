import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { size, label, price, name, email, collection } = await req.json();

    // Create a Stripe Checkout Session using the API directly
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "payment",
        "success_url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://nft23d.com"}?payment=success`,
        "cancel_url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://nft23d.com"}?payment=cancelled`,
        "customer_email": email,
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][unit_amount]": String(price * 100),
        "line_items[0][price_data][product_data][name]": `NFT23D Print - ${size} ${label}`,
        "line_items[0][price_data][product_data][description]": `3D printed NFT collectible (${collection || "Custom"})`,
        "line_items[0][quantity]": "1",
        "metadata[customer_name]": name || "",
        "metadata[collection]": collection || "",
        "metadata[size]": `${size} ${label}`,
        "shipping_address_collection[allowed_countries][0]": "US",
        "shipping_address_collection[allowed_countries][1]": "CA",
        "shipping_address_collection[allowed_countries][2]": "GB",
        "shipping_address_collection[allowed_countries][3]": "AU",
      }).toString(),
    });

    const session = await res.json();
    if (!res.ok) throw new Error(session.error?.message || "Stripe error");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
