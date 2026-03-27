import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, projectLink, description } = await req.json();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 32px; border-radius: 12px;">
        <h2 style="color: #a855f7; margin-bottom: 24px;">New Collection Application</h2>
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 8px 0;"><strong style="color: #a5b4fc;">Name:</strong> ${name || "Not provided"}</p>
          <p style="margin: 8px 0;"><strong style="color: #a5b4fc;">Email:</strong> ${email || "Not provided"}</p>
          <p style="margin: 8px 0;"><strong style="color: #a5b4fc;">Project Link:</strong> <a href="${projectLink}" style="color: #6366f1;">${projectLink}</a></p>
          ${description ? `<p style="margin: 8px 0;"><strong style="color: #a5b4fc;">Description:</strong> ${description}</p>` : ""}
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NFT23D Applications <orders@nft23d.com>",
        to: "info@nft23d.com",
        subject: `New Collection Application - ${name || "Unknown"}`,
        reply_to: email || undefined,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send");
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
