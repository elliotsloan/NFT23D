export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const collection = formData.get("collection") || "Not specified";
    const wallet = formData.get("wallet") || "Not provided";
    const size = formData.get("size") || "Not selected";
    const notes = formData.get("notes") || "None";
    const imageFile = formData.get("image");

    let attachments = [];
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      attachments.push({
        filename: imageFile.name || "nft-image.png",
        content: base64,
      });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">New NFT23D Order</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Collection</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${collection}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Size</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${size}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Wallet</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${wallet}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Notes</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${notes}</td></tr>
        </table>
        ${imageFile && imageFile.size > 0 ? "<p style=\"margin-top: 20px; color: #22c55e;\">NFT image attached to this email.</p>" : "<p style=\"margin-top: 20px; color: #e53e3e;\">No image was uploaded.</p>"}
        <p style="margin-top: 20px; color: #666; font-size: 13px;">Reply to this email to contact the customer at ${email}</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NFT23D Orders <onboarding@resend.dev>",
        to: "info@nft23d.com",
        subject: `New NFT23D Order - ${size}`,
        reply_to: email,
        html: emailHtml,
        attachments,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      return Response.json({ success: true });
    } else {
      console.error("Resend error:", result);
      return Response.json({ success: false, message: "Failed to send" }, { status: 500 });
    }
  } catch (err) {
    console.error("Order API error:", err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
