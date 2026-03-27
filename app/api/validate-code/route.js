import { NextResponse } from "next/server";

const VALID_CODES = {
  "3D15": { percent: 15, maxUses: 5 },
};

export async function POST(req) {
  try {
    const { code } = await req.json();
    const config = VALID_CODES[code];

    if (!config) {
      return NextResponse.json({ valid: false, reason: "invalid" });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // Check if Stripe coupon exists and how many times it's been redeemed
    const couponRes = await fetch(
      `https://api.stripe.com/v1/coupons/${encodeURIComponent(code)}`,
      { headers: { Authorization: `Bearer ${stripeKey}` } }
    );

    if (couponRes.ok) {
      const coupon = await couponRes.json();
      if (coupon.times_redeemed >= config.maxUses) {
        return NextResponse.json({ valid: false, reason: "used_up" });
      }
      return NextResponse.json({
        valid: true,
        percent: config.percent,
        remaining: config.maxUses - coupon.times_redeemed,
      });
    }

    // Coupon doesn't exist yet in Stripe â create it
    const createRes = await fetch("https://api.stripe.com/v1/coupons", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        id: code,
        percent_off: String(config.percent),
        duration: "once",
        max_redemptions: String(config.maxUses),
        name: `${config.percent}% Off - First ${config.maxUses} Orders`,
      }).toString(),
    });

    if (createRes.ok) {
      return NextResponse.json({
        valid: true,
        percent: config.percent,
        remaining: config.maxUses,
      });
    }

    const err = await createRes.json();
    return NextResponse.json({ valid: false, reason: "error", detail: err.error?.message });
  } catch (err) {
    return NextResponse.json({ valid: false, reason: "error" }, { status: 500 });
  }
}
