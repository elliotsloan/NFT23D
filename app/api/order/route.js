export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = (formData.get("email") || "").trim();
    const collection = formData.get("collection") || "Not specified";
    const wallet = formData.get("wallet") || "Not provided";
    const size = formData.get("size") || "Not selected";
    const notes = formData.get("notes") || "None";
    const paymentMethod = formData.get("paymentMethod") || "Not specified";
    const imageFile = formData.get("image");

    // Extract address fields
    const address = formData.get("address") || "Not provided";
    const city = formData.get("city") || "";
    const state = formData.get("state") || "";
    const zip = formData.get("zip") || "";
    const fullAddress = [address, city, state, zip].filter(Boolean).join(", ");

    // Extract price from form data
    const discountedPrice = formData.get("discountedPrice");
    const originalPrice = formData.get("originalPrice");
    let price = discountedPrice || originalPrice || "0";
    if (price === "0" || !price) {
      const priceMatch = size.match(/\$(\d+)/);
      if (priceMatch) price = priceMatch[1];
    }

    // Generate unique order ID
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    const orderId = `SC-${code}`;

    let attachments = [];
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      attachments.push({
        filename: imageFile.name || "reference-image.png",
        content: base64,
      });
    }

    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #E01B1B; color: #fff; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">New Sloan Craft Order</h1>
    <p style="margin: 8px 0 0; font-size: 18px; font-weight: bold; letter-spacing: 2px;">${orderId}</p>
  </div>
  <div style="background: #f8f9fa; padding: 24px; border-radius: 0 0 12px 12px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; width: 140px; color: #333;">Order ID</td><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-family: monospace; font-size: 16px; color: #E01B1B; font-weight: bold;">${orderId}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Name</td><td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${name}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Email</td><td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${email}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Item</td><td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${size}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Payment Method</td><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; font-size: 15px; color: ${paymentMethod === 'Stripe / Card' ? '#16a34a' : paymentMethod === 'PayPal' ? '#1d4ed8' : paymentMethod === 'XRP' ? '#E01B1B' : paymentMethod === 'ETH' ? '#627eea' : paymentMethod === 'Venmo' ? '#7c3aed' : '#555'};">${paymentMethod}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Price</td><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #22c55e; font-size: 18px;">$${price}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Address</td><td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${fullAddress}</td></tr>
      <tr><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Item / Collection</td><td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${collection}</td></tr>
      <tr><td style="padding: 12px; font-weight: bold; color: #333;">Notes</td><td style="padding: 12px;">${notes}</td></tr>
    </table>
    <p style="margin-top: 16px; color: #666; font-size: 13px;">Reply to this email to contact the customer at ${email}</p>
  </div>
</div>
    `;

    // Also send confirmation email to customer
    const customerEmailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #E01B1B; color: #fff; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">Order Confirmed!</h1>
    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Sloan Craft — 3D Prints by Elliot Sloan</p>
  </div>
  <div style="background: #f8f9fa; padding: 24px; border-radius: 0 0 12px 12px;">
    <p style="font-size: 16px; color: #333;">Hey ${name}! Thanks for your order! Here are your details:</p>
    <div style="background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e0e0e0; margin: 16px 0;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #888;">ORDER REFERENCE</p>
      <p style="margin: 0; font-size: 22px; font-weight: bold; color: #E01B1B; letter-spacing: 2px;">${orderId}</p>
    </div>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Item</td><td style="padding: 8px 0; text-align: right;">${size}</td></tr>
      <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Ship To</td><td style="padding: 8px 0; text-align: right;">${fullAddress}</td></tr>
      <tr><td style="padding: 8px 0; font-weight: bold; color: #333; border-top: 2px solid #e0e0e0; font-size: 18px;">Total</td><td style="padding: 8px 0; text-align: right; border-top: 2px solid #e0e0e0; font-size: 18px; font-weight: bold; color: #22c55e;">$${price}</td></tr>
    </table>
    <div style="margin-top: 20px; padding: 16px; background: #e8f5e9; border-radius: 8px;">
      <p style="margin: 0; font-size: 14px; color: #2e7d32;"><strong>Next Step:</strong> Complete your payment via Card, PayPal, Venmo, XRP, or ETH using the options on the site. Include <strong>${orderId}</strong> in your payment memo so we can match it to your order.</p>
    </div>
    <p style="margin-top: 20px; color: #999; font-size: 12px; text-align: center;">Questions? Reply to this email or DM @elliotsloan</p>
  </div>
</div>
    `;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const replyTo = emailRegex.test(email) ? email : undefined;

    // Send both emails in parallel.
    // NOTE: send-from stays on the verified nft23d.com domain for deliverability.
    // Switch these to @sloancraft.com only AFTER sloancraft.com is verified in Resend.
    const emailPromises = [
      // Admin notification
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Sloan Craft Orders <orders@nft23d.com>",
          to: "info@nft23d.com",
          subject: `New Order ${orderId} - ${size} ($${price})`,
          ...(replyTo && { reply_to: replyTo }),
          html: emailHtml,
          attachments,
        }),
      }),
    ];

    // Send customer confirmation if valid email
    if (replyTo) {
      emailPromises.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Sloan Craft <info@nft23d.com>",
            to: email,
            subject: `Your Sloan Craft Order ${orderId} - Confirmed!`,
            html: customerEmailHtml,
          }),
        })
      );
    }

    try {
      const results = await Promise.all(emailPromises);
      for (const res of results) {
        if (!res.ok) {
          const result = await res.json();
          console.error("Resend error:", result);
        }
      }
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
    }

    return Response.json({ success: true, orderId });
  } catch (err) {
    console.error("Order API error:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
