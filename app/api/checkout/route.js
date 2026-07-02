import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { size, label, price, shipping, name, email, collection, discountCode } = await req.json();
    const shipAmount = Number.isFinite(shipping) ? shipping : 15;

    // Build checkout session params
    const params = {
      "mode": "payment",
      "success_url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://sloancraft.com"}?payment=success`,
      "cancel_url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://sloancraft.com"}?payment=cancelled`,
      "customer_email": email,
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(price * 100),
      "line_items[0][price_data][product_data][name]": `Sloan Craft Print - ${size} ${label}`,
      "line_items[0][price_data][product_data][description]": `Hand-finished 3D print (${collection || "Custom"})`,
      "line_items[0][quantity]": "1",
      "metadata[customer_name]": name || "",
      "metadata[collection]": collection || "",
      "metadata[size]": `${size} ${label}`,
      "shipping_address_collection[allowed_countries][0]": "US",
      "shipping_address_collection[allowed_countries][1]": "CA",
      "shipping_address_collection[allowed_countries][2]": "GB",
      "shipping_address_collection[allowed_countries][3]": "AU",
      "shipping_options[0][shipping_rate_data][type]": "fixed_amount",
      "shipping_options[0][shipping_rate_data][fixed_amount][amount]": String(shipAmount * 100),
      "shipping_options[0][shipping_rate_data][fixed_amount][currency]": "usd",
      "shipping_options[0][shipping_rate_data][display_name]": "Shipping",
    };

    // Apply discount coupon if provided
    if (discountCode) {
      params["discounts[0][coupon]"] = discountCode;
      params["metadata[discount_code]"] = discountCode;
    }

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params).toString(),
    });

    const session = await res.json();
    if (!res.ok) throw new Error(session.error?.message || "Stripe error");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
