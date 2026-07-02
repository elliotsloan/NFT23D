"use client";
import { useState, useEffect, useRef } from "react";

/*
  SLOANCRAFT.COM — 3D Prints by Elliot Sloan
  - Ramp Catalog (unpainted prints, 3 sizes each)
  - Gallery (past work / capability samples — route to custom)
  - Custom Piece requests (hand painted, 6"-12")
  Order + payment engine (/api/order, /api/checkout, /api/validate-code,
  PayPal / Venmo / XRP / ETH) carried over from the previous build.

  Images live in public/images/. Logo: sloancraft_logo_transparent.svg
*/

/* ---------- Theme ---------- */
const RED = "#E01B1B", RED2 = "#b71414";
const INK = "#0b0b0b", INK2 = "#161616";
const CREAM = "#f2f2f2", DIM = "#bdbdbd", MUTE = "#7d7d7d";
const LINE = "rgba(255,255,255,0.10)";

/* ---------- Data ---------- */
const RAMP_SIZES = [
  { size: "Small", label: "Desk display", price: 50 },
  { size: "Mid", label: "", price: 100 },
  { size: "Full", label: "Tech deck size", price: 180 },
];

const CUSTOM_SIZES = [
  { size: '6"', label: "Hand Painted", price: 300 },
  { size: '8"', label: "Hand Painted", price: 350 },
  { size: '10"', label: "Hand Painted", price: 400 },
  { size: '12"', label: "Hand Painted", price: 450 },
];

const RAMPS = [
  { slug: "animal-chin", name: "Animal Chin Ramp", img: "/images/animal-chin.jpg", thumbs: ["/images/animal-chin.jpg", "/images/animal-chin-2.jpg", "/images/animal-chin-3.jpg"], desc: "A scaled tribute to the legendary ramp from the Bones Brigade era — the one every skate kid wanted to find. Printed and finished with the details that made it iconic." },
  { slug: "monster-dc", name: "Monster x DC Ramp", img: "/images/monster-dc.jpg", thumbs: ["/images/monster-dc.jpg", "/images/monster-dc-2.jpg", "/images/monster-dc-3.jpg"], desc: "A miniature of the Monster x DC ramp build — bold branding, big transitions, rendered down to a collectible you can put on your desk." },
  { slug: "mega-park", name: "Sloanyard Mega Park", img: "/images/mega-park.jpg", thumbs: ["/images/mega-park.jpg", "/images/mega-park-2.jpg", "/images/mega-park-3.jpg"], desc: "My own backyard mega setup in Vista, scaled down. The park that's hosted the X Games — now a piece you can hold." },
  { slug: "vert-ramp", name: "Sloanyard Vert Ramp", img: "/images/vert-ramp.jpg", thumbs: ["/images/vert-ramp.jpg", "/images/vert-ramp-2.jpg"], desc: "The Sloanyard vert ramp, replicated in miniature. Clean coping, true transitions, scaled to your shelf." },
];

const GALLERY = [
  { id: "bayc", name: "Bored Ape Yacht Club", tag: "NFT print", photos: ["/images/gal-bayc-1.jpg", "/images/gal-bayc-2.jpg", "/images/gal-bayc-3.jpg"] },
  { id: "mutant", name: "Mutant Ape", tag: "NFT print", photos: ["/images/gal-mutant-ape.jpg"] },
  { id: "bchamp", name: "Bear Champ", tag: "NFT print", photos: ["/images/gal-bchamp-1.jpg", "/images/gal-bchamp-2.jpg", "/images/gal-bchamp-3.jpg", "/images/gal-bchamp-4.jpg", "/images/gal-bchamp-5.jpg"] },
  { id: "daf", name: "Dead As Fuck", tag: "NFT print", photos: ["/images/gal-daf-1.jpg", "/images/gal-daf-2.jpg"] },
  { id: "hawk", name: "Tony Hawk Skull", tag: "Custom sculpture", photos: ["/images/gal-hawk-skull-1.jpg", "/images/gal-hawk-skull-2.jpg", "/images/gal-hawk-skull-3.jpg", "/images/gal-hawk-skull-4.jpg", "/images/gal-hawk-skull-5.jpg"] },
  { id: "mcgill", name: "Mike McGill Skull", tag: "Custom sculpture", photos: ["/images/gal-mcgill-skull-1.jpg", "/images/gal-mcgill-skull-2.jpg", "/images/gal-mcgill-skull-3.jpg"] },
  { id: "cab", name: "Steve Cab Dragon", tag: "Custom sculpture", photos: ["/images/gal-cab-dragon-1.jpg", "/images/gal-cab-dragon-2.jpg", "/images/gal-cab-dragon-3.jpg", "/images/gal-cab-dragon-4.jpg"] },
  { id: "g-animal-chin", name: "Animal Chin Ramp", tag: "Ramp Series", shop: "animal-chin", photos: ["/images/animal-chin.jpg", "/images/animal-chin-2.jpg", "/images/animal-chin-3.jpg"] },
  { id: "g-monster-dc", name: "Monster x DC Ramp", tag: "Ramp Series", shop: "monster-dc", photos: ["/images/monster-dc.jpg", "/images/monster-dc-2.jpg", "/images/monster-dc-3.jpg"] },
  { id: "g-mega-park", name: "Sloanyard Mega Park", tag: "Ramp Series", shop: "mega-park", photos: ["/images/mega-park.jpg", "/images/mega-park-2.jpg", "/images/mega-park-3.jpg"] },
  { id: "g-vert-ramp", name: "Sloanyard Vert Ramp", tag: "Ramp Series", shop: "vert-ramp", photos: ["/images/vert-ramp.jpg", "/images/vert-ramp-2.jpg"] },
];

function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// One representative photo per print, for the hero slideshow (no repeats)
const HERO_PHOTOS = shuffle(GALLERY.map(g => g.photos[0]));

function HeroSlideshow() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setI(p => (p + 1) % HERO_PHOTOS.length), 2000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: "18px", overflow: "hidden", border: `1px solid ${LINE}`, background: "#111", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
      {HERO_PHOTOS.map((p, idx) => (
        <img key={idx} src={p} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: idx === i ? 1 : 0, transition: "opacity 0.9s ease" }} />
      ))}
    </div>
  );
}

/* ---------- Small UI ---------- */
function CheckIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto" }}>
      <circle cx="10" cy="10" r="11" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1.5" />
      <path d="M7 12.5l3 3 7-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GrainOverlay() {
  return <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.03, mixBlendMode: "overlay", background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />;
}
function Glow({ color, x, y, size = 300, opacity = 0.06 }) {
  return <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity, pointerEvents: "none", filter: "blur(30px)" }} />;
}

/* ---------- Header ---------- */
function Nav({ go, route }) {
  const link = (name, label) => (
    <span onClick={() => go(name)} style={{ fontFamily: "'Archivo', sans-serif", fontSize: "14px", fontWeight: 600, color: route === name ? CREAM : DIM, cursor: "pointer", transition: "color .2s" }}
      onMouseEnter={e => e.currentTarget.style.color = CREAM} onMouseLeave={e => e.currentTarget.style.color = route === name ? CREAM : DIM}>{label}</span>
  );
  return (
    <nav className="hdr" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "12px 24px", background: "rgba(11,11,11,0.9)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
      <div className="brand" onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: "13px", cursor: "pointer" }}>
        <img src="/images/sloancraft_logo_transparent.svg" alt="Sloan Craft" style={{ height: "34px", width: "auto", display: "block" }} />
        <span className="tagline-hide" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "1.5px", color: MUTE, textTransform: "uppercase", paddingLeft: "13px", borderLeft: `1px solid ${LINE}` }}>3D prints by Elliot Sloan</span>
      </div>
      <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div className="nav-links" style={{ display: "flex", gap: "22px", alignItems: "center" }}>
          {link("catalog", "Ramp Catalog")}
          {link("gallery", "Gallery")}
          {link("about", "About")}
        </div>
        <button className="nav-cta" onClick={() => go("custom")} style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13px", padding: "10px 18px", background: RED, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap", transition: "background .2s" }}
          onMouseEnter={e => e.currentTarget.style.background = RED2} onMouseLeave={e => e.currentTarget.style.background = RED}>Request a Custom Piece</button>
      </div>
    </nav>
  );
}

/* ---------- Home ---------- */
function Home({ go }) {
  const [v, setV] = useState(false);
  useEffect(() => { setTimeout(() => setV(true), 120); }, []);
  return (
    <div>
      <section style={{ padding: "132px 20px 72px", position: "relative", overflow: "hidden", background: `radial-gradient(1000px 520px at 78% -8%, rgba(224,27,27,0.18), transparent 60%), ${INK}` }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", position: "relative", zIndex: 1, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "44px", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "100px", background: "rgba(224,27,27,0.08)", border: "1px solid rgba(224,27,27,0.3)", marginBottom: "26px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#37d67a", boxShadow: "0 0 8px #37d67a" }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: RED, letterSpacing: "2px", textTransform: "uppercase" }}>Now taking orders · Vista, California</span>
              </div>
              <img src="/images/sloancraft_logo_transparent.svg" alt="Sloan Craft" style={{ width: "min(620px, 100%)", height: "auto", display: "block", margin: "0 0 6px -4px", filter: "drop-shadow(0 6px 30px rgba(224,27,27,0.25))" }} />
              <div className="hero-slide-mobile"><HeroSlideshow /></div>
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(18px,2.4vw,26px)", letterSpacing: "1px", color: RED, textTransform: "uppercase", margin: "12px 0 22px" }}>3D Prints by Elliot Sloan</div>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(15px,1.6vw,18px)", lineHeight: 1.65, color: DIM, maxWidth: "560px", marginBottom: "34px" }}>
                Custom collectible sculptures and miniature replicas of the ramps that built skateboarding — designed, printed, and hand-painted in Vista, California.
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <button onClick={() => go("catalog")} style={btn(RED, "#fff")}>Shop Prints</button>
                <button onClick={() => go("custom")} style={btnGhost()}>Request a Custom Piece</button>
              </div>
            </div>
            <div className="hero-slide-desktop"><HeroSlideshow /></div>
          </div>
        </div>
      </section>

      <section style={{ padding: "76px 20px", borderTop: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={eyebrow()}>Two ways in</div>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px" }}>
            <div onClick={() => go("catalog")} style={pathCard()} onMouseEnter={hoverLift} onMouseLeave={unLift}>
              <h3 style={pathH()}>Shop the Catalog</h3>
              <p style={pathP()}>Ready-to-ship prints, including the inaugural Ramp Series — scaled replicas of iconic ramps and my own backyard setup at the Sloanyard. Pick your size, we ship it.</p>
              <span style={{ fontWeight: 700, color: RED, fontSize: "14px" }}>Browse the Ramp Catalog →</span>
            </div>
            <div onClick={() => go("custom")} style={pathCard()} onMouseEnter={hoverLift} onMouseLeave={unLift}>
              <h3 style={pathH()}>Request a Custom Piece</h3>
              <p style={pathP()}>Want something specific? Send a reference and a few details and I'll quote a one-off build — collectibles, your own ramp, whatever you've got in mind. Hand-painted to order.</p>
              <span style={{ fontWeight: 700, color: RED, fontSize: "14px" }}>Start a custom request →</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "76px 20px", borderTop: `1px solid ${LINE}`, background: INK2 }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(30px,5vw,52px)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "22px" }}>No factory. No warehouse. Just me.</h2>
          <p style={{ color: DIM, fontSize: "17px", lineHeight: 1.75 }}>Every piece is printed and finished in-house in Vista, California. No mass production, no overseas warehouse — just a skater with a 3D printer and an obsession with getting the details right. When you order, it's me making it.</p>
        </div>
      </section>
    </div>
  );
}

/* ---------- Catalog ---------- */
function Catalog({ go }) {
  return (
    <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "104px 24px 0" }}>
      <div style={{ padding: "0 0 20px" }}>
        <div style={eyebrow()}>The Ramp Series</div>
        <h2 style={pageH()}>Ramp Catalog</h2>
        <p style={{ color: DIM, fontSize: "16px", lineHeight: 1.6, maxWidth: "620px", marginTop: "14px" }}>Scaled, hand-finished replicas of the ramps that shaped skateboarding — plus my own backyard setup. Three sizes each. Click any ramp to pick a size.</p>
      </div>
      <div className="card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "22px", padding: "24px 0 80px" }}>
        {RAMPS.map(r => (
          <div key={r.slug} onClick={() => go("product", r.slug)} style={card()} onMouseEnter={cardHover} onMouseLeave={cardUn}>
            <div style={thumb()}><img src={r.img} alt={r.name} loading="lazy" style={imgCover()} /></div>
            <div style={{ padding: "18px 20px" }}>
              <h3 style={cardH()}>{r.name}</h3>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12.5px", color: RED }}>From $50</div>
              <div style={{ fontSize: "13px", color: MUTE, marginTop: "4px" }}>3 sizes · unpainted print</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Product ---------- */
function Product({ slug, go, startOrder }) {
  const r = RAMPS.find(x => x.slug === slug) || RAMPS[0];
  const [big, setBig] = useState(r.img);
  const [sizeIdx, setSizeIdx] = useState(0);
  useEffect(() => { setBig(r.img); setSizeIdx(0); }, [slug]);
  const price = RAMP_SIZES[sizeIdx].price;
  return (
    <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "104px 24px 0" }}>
      <div style={{ padding: "0 0 6px" }}>
        <span onClick={() => go("catalog")} style={{ fontFamily: "'DM Mono', monospace", color: MUTE, fontSize: "12px", cursor: "pointer" }}>← Back to Ramp Catalog</span>
      </div>
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "44px", padding: "24px 0 90px", alignItems: "start" }}>
        <div>
          <div style={{ aspectRatio: "4/3", background: "#111", border: `1px solid ${LINE}`, borderRadius: "18px", overflow: "hidden" }}>
            <img src={big} alt={r.name} style={imgCover()} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginTop: "12px" }}>
            {r.thumbs.map((t, i) => (
              <div key={i} onClick={() => setBig(t)} style={{ aspectRatio: "1/1", background: "#111", border: `1px solid ${big === t ? RED : LINE}`, borderRadius: "12px", overflow: "hidden", cursor: "pointer" }}>
                <img src={t} alt="" style={imgCover()} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(34px,4.5vw,50px)", textTransform: "uppercase", letterSpacing: "1px", lineHeight: 1 }}>{r.name}</h2>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: RED, margin: "12px 0 20px" }}>Ramp Series · collectible replica</div>
          <p style={{ color: DIM, lineHeight: 1.7, fontSize: "15.5px", marginBottom: "28px" }}>{r.desc}</p>

          <label style={fieldLabel()}>Size</label>
          <select value={sizeIdx} onChange={e => setSizeIdx(Number(e.target.value))} style={inputStyle()}>
            {RAMP_SIZES.map((s, i) => <option key={i} value={i}>{s.size}{s.label ? ` — ${s.label}` : ""} · ${s.price}</option>)}
          </select>

          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", margin: "26px 0 20px" }}>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "46px", lineHeight: 1 }}>${price}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: MUTE }}>unpainted print · ships from Vista, CA</div>
          </div>

          <button onClick={() => startOrder({ name: r.name, mode: "ramp", sizes: RAMP_SIZES, initialSize: sizeIdx, image: r.img })} style={{ ...btn(RED, "#fff"), width: "100%" }}>Order this Ramp</button>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#37d67a", marginTop: "14px" }}>In production · made to order</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Gallery ---------- */
function GalleryView({ go }) {
  const [items] = useState(() => shuffle(GALLERY));
  return (
    <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "104px 24px 0" }}>
      <div style={{ padding: "0 0 8px" }}>
        <div style={eyebrow()}>Portfolio</div>
        <h2 style={pageH()}>Gallery</h2>
        <p style={{ color: DIM, fontSize: "16px", lineHeight: 1.6, maxWidth: "620px", marginTop: "14px" }}>Past work and one-off custom builds — shown as capability samples, not catalog items (except for the ramps, which you can shop).</p>
      </div>
      <div style={{ background: "rgba(224,27,27,0.06)", border: "1px solid rgba(224,27,27,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "8px 0 34px", fontSize: "14.5px", color: DIM, lineHeight: 1.6 }}>
        These pieces aren't for sale off the shelf. Want something like one of these? <b style={{ color: RED, cursor: "pointer" }} onClick={() => go("custom")}>Request a custom piece →</b>
      </div>
      <div className="card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "22px", padding: "0 0 80px" }}>
        {items.map(g => (
          <div key={g.id} onClick={() => go("collection", g.id)} style={card()} onMouseEnter={cardHover} onMouseLeave={cardUn}>
            <div style={thumb()}>
              <img src={g.photos[0]} alt={g.name} loading="lazy" style={imgCover()} />
              {g.photos.length > 1 && <span style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(0,0,0,0.72)", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "1px", padding: "3px 9px", borderRadius: "100px", border: `1px solid ${LINE}` }}>{g.photos.length} photos</span>}
            </div>
            <div style={{ padding: "18px 20px" }}>
              <h3 style={{ ...cardH(), fontSize: "18px" }}>{g.name}</h3>
              <div style={{ fontSize: "13px", color: MUTE, marginTop: "4px" }}>{g.tag}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: RED, marginTop: "8px" }}>View prints →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Collection detail ---------- */
function Collection({ id, go, onZoom }) {
  const g = GALLERY.find(x => x.id === id) || GALLERY[0];
  return (
    <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "104px 24px 0" }}>
      <div style={{ padding: "0 0 14px" }}>
        <span onClick={() => go("gallery")} style={{ fontFamily: "'DM Mono', monospace", color: MUTE, fontSize: "12px", cursor: "pointer" }}>← Back to Gallery</span>
        <h2 style={{ ...pageH(), marginTop: "14px" }}>{g.name}</h2>
        <p style={{ fontFamily: "'DM Mono', monospace", color: RED, fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase" }}>{g.tag}{g.shop ? " · in the catalog" : " · sample of past work"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))", gap: "16px" }}>
        {g.photos.map((p, i) => (
          <div key={i} onClick={() => onZoom(p)} style={{ aspectRatio: "3/4", background: "#111", border: `1px solid ${LINE}`, borderRadius: "14px", overflow: "hidden", cursor: "zoom-in" }}>
            <img src={p} alt={g.name} loading="lazy" style={imgCover()} />
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(224,27,27,0.06)", border: "1px solid rgba(224,27,27,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "34px 0 80px", textAlign: "center", color: DIM }}>
        {g.shop
          ? <>This one's in the Ramp Catalog, ready to ship. <b style={{ color: RED, cursor: "pointer" }} onClick={() => go("product", g.shop)}>Shop this ramp →</b></>
          : <>A sample of past work — not sold off the shelf. Want one like it? <b style={{ color: RED, cursor: "pointer" }} onClick={() => go("custom")}>Request a custom piece →</b></>}
      </div>
    </div>
  );
}

/* ---------- Order Form (shared: ramp + custom) — payment engine preserved ---------- */
function OrderForm({ product, go }) {
  const isCustom = product.mode === "custom";
  const SIZES = product.sizes;
  const [size, setSize] = useState(product.initialSize != null ? SIZES[product.initialSize] : null);
  const [fileName, setFileName] = useState("");
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", state: "", zip: "", country: "", notes: "" });
  const [tos, setTos] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountStatus, setDiscountStatus] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [xrpPrice, setXrpPrice] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [paidWithAlt, setPaidWithAlt] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [submittedOrderId, setSubmittedOrderId] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ripple,ethereum&vs_currencies=usd");
        const data = await res.json();
        if (data?.ripple?.usd) setXrpPrice(data.ripple.usd);
        if (data?.ethereum?.usd) setEthPrice(data.ethereum.usd);
      } catch {}
    };
    fetchPrices();
    const iv = setInterval(fetchPrices, 60000);
    return () => clearInterval(iv);
  }, []);

  const isInternational = form.country && form.country.trim() !== "" && !["us", "usa", "united states", "united states of america"].includes(form.country.trim().toLowerCase());
  const shipping = isInternational ? 45 : 15;
  const canSubmit = form.name && form.email && size && (!isCustom || tos) && !submitting;

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountStatus("checking");
    try {
      const res = await fetch("/api/validate-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: discountCode.trim().toUpperCase() }) });
      const data = await res.json();
      if (data.valid) { setDiscountStatus("valid"); setDiscountPercent(data.percent); }
      else if (data.reason === "used_up") { setDiscountStatus("used_up"); setDiscountPercent(0); }
      else { setDiscountStatus("invalid"); setDiscountPercent(0); }
    } catch { setDiscountStatus("invalid"); setDiscountPercent(0); }
  };

  const discountedPrice = discountStatus === "valid" && size ? Math.round(size.price * (1 - discountPercent / 100)) : size?.price;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("collection", isCustom ? "Custom piece" : product.name);
      data.append("address", form.address || "Not provided");
      data.append("city", form.city || "");
      data.append("state", form.state || "");
      data.append("zip", form.zip || "");
      data.append("size", (isCustom ? "Custom " : product.name + " — ") + (size ? size.size + " " + size.label + " - $" + (discountedPrice || size.price) : ""));
      data.append("notes", form.notes || "None");
      data.append("paymentMethod", paymentMethod || "Not specified");
      data.append("shipping", shipping);
      data.append("total", (discountedPrice || size.price) + shipping);
      if (discountStatus === "valid") { data.append("discountCode", discountCode.trim().toUpperCase()); data.append("originalPrice", size.price); data.append("discountedPrice", discountedPrice); }
      const imageFile = fileRef.current?.files?.[0];
      if (imageFile) { data.append("image", imageFile); }
      const res = await fetch("/api/order", { method: "POST", body: data });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
        setSubmittedOrderId(result.orderId);
        requestAnimationFrame(() => requestAnimationFrame(() => { document.getElementById("order")?.scrollIntoView({ behavior: "instant", block: "start" }); }));
      } else { alert("Something went wrong. Please try again."); }
    } catch (err) { alert("Something went wrong. Please try again."); }
    setSubmitting(false);
  };

  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ size: size?.size, label: size?.label, price: size?.price, shipping: shipping, name: form.name, email: form.email, collection: isCustom ? "Custom piece" : product.name, discountCode: discountStatus === "valid" ? discountCode.trim().toUpperCase() : undefined }) });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { alert("Something went wrong creating checkout. Please try PayPal or Venmo."); }
    } catch (err) { alert("Something went wrong. Please try PayPal or Venmo."); }
    setStripeLoading(false);
  };

  if (submitted) {
    const finalPrice = (discountedPrice || size?.price) + shipping;
    const paypalUrl = `https://paypal.me/nft23d/${finalPrice}`;
    const venmoUrl = `https://venmo.com/elliotsloan?txn=pay&amount=${finalPrice}&note=${encodeURIComponent("Sloan Craft print - " + size?.size + " " + size?.label + (discountStatus === "valid" ? " (code: " + discountCode.toUpperCase() + ")" : "") + (submittedOrderId ? " [" + submittedOrderId + "]" : ""))}`;
    const XRP_ADDRESS = "rKydygGZZhmKteEZpEWtHACoTdWZ3c1Bep";
    const xrpAmount = xrpPrice ? (finalPrice / xrpPrice).toFixed(2) : null;
    const xrpQrUrl = xrpAmount ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`xrpl:${XRP_ADDRESS}?amount=${xrpAmount}`)}&bgcolor=0b0b0b&color=ffffff&margin=8` : null;
    const ETH_ADDRESS = "0x72F8305567cd508c38F00A8d0F7a5940d45D6e7b";
    const ethAmount = ethPrice ? (finalPrice / ethPrice).toFixed(6) : null;
    const ethQrUrl = ethAmount ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`ethereum:${ETH_ADDRESS}?value=${ethAmount}`)}&bgcolor=0b0b0b&color=ffffff&margin=8` : null;
    return (
      <section id="order" style={{ padding: "120px 20px 60px", background: INK, textAlign: "center", minHeight: "100vh" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", padding: "56px 32px", background: "rgba(224,27,27,0.05)", border: "1px solid rgba(224,27,27,0.2)", borderRadius: "20px" }}>
          <div style={{ marginBottom: "16px" }}><CheckIcon size={48} /></div>
          <h3 style={{ fontFamily: "'Anton', sans-serif", fontWeight: 400, fontSize: "30px", textTransform: "uppercase", letterSpacing: "1px", color: CREAM, marginBottom: "12px" }}>Order Received!</h3>
          {submittedOrderId && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "3px", color: MUTE, marginBottom: "16px", marginTop: "-4px" }}>ORDER <span style={{ color: RED, fontWeight: 700, fontSize: "14px" }}>{submittedOrderId}</span></div>}
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: DIM, lineHeight: 1.8, marginBottom: "28px" }}>
            Complete your payment below to lock in your {size?.size} {size?.label} {isCustom ? "custom piece" : product.name}{discountStatus === "valid" ? ` at $${finalPrice}` : ""}. {isCustom ? "Complex or oversized pieces may require a custom quote — I'll email you before charging." : "I'll start on it right away!"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            <button onClick={handleStripeCheckout} disabled={stripeLoading} style={{ display: "block", width: "100%", padding: "16px 24px", background: RED, color: "#fff", borderRadius: "10px", border: "none", fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", cursor: stripeLoading ? "wait" : "pointer" }}>{stripeLoading ? "Redirecting to checkout..." : `Pay $${finalPrice} with Card`}</button>
            {discountStatus === "valid" && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#22c55e", marginTop: "6px" }}>{discountPercent}% discount applied! (was ${size?.price})</div>}
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: MUTE, letterSpacing: "1px", textTransform: "uppercase", margin: "4px 0" }}>or pay with</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <a href={paypalUrl} target="_blank" rel="noopener noreferrer" onClick={() => setPaidWithAlt("paypal")} style={altPay("#0070ba")}>PayPal</a>
              <a href={venmoUrl} target="_blank" rel="noopener noreferrer" onClick={() => setPaidWithAlt("venmo")} style={altPay("#3D95CE")}>Venmo</a>
              <button onClick={() => setPaidWithAlt("xrp")} style={{ ...altPay(INK2), border: `1px solid ${LINE}`, cursor: "pointer" }}>XRP</button>
              <button onClick={() => setPaidWithAlt("eth")} style={{ ...altPay(INK2), border: `1px solid ${LINE}`, cursor: "pointer" }}>ETH</button>
            </div>
          </div>
          {(paidWithAlt === "venmo" || paidWithAlt === "paypal") && (
            <div style={{ marginTop: "16px", padding: "16px 20px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px" }}>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", color: "#22c55e", marginBottom: "6px" }}>✓ {paidWithAlt === "paypal" ? "PayPal" : "Venmo"} payment link opened!</p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: DIM, lineHeight: 1.8 }}>Complete your payment there and you're all set. I'll email you a confirmation once payment clears and get started on your print.</p>
            </div>
          )}
          {paidWithAlt === "xrp" && xrpQrUrl && (
            <div style={{ marginTop: "16px", padding: "20px", background: "rgba(224,27,27,0.04)", border: "1px solid rgba(224,27,27,0.15)", borderRadius: "12px" }}>
              <img src={xrpQrUrl} alt="XRP QR Code" style={{ width: 180, height: 180, borderRadius: 8, marginBottom: 12 }} />
              <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "28px", color: CREAM, marginBottom: 2 }}>{xrpAmount} <span style={{ color: RED, fontSize: "16px" }}>XRP</span></p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: DIM, marginBottom: 12 }}>${finalPrice} USD</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
                <code style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: RED, background: "rgba(224,27,27,0.1)", padding: "6px 10px", borderRadius: 6, wordBreak: "break-all" }}>{XRP_ADDRESS}</code>
                <button onClick={() => navigator.clipboard.writeText(XRP_ADDRESS)} style={{ padding: "6px 10px", background: "rgba(224,27,27,0.15)", border: "1px solid rgba(224,27,27,0.3)", borderRadius: 6, color: RED, cursor: "pointer", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>Copy</button>
              </div>
              {submittedOrderId && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: MUTE, marginBottom: 8 }}>Include order <strong style={{ color: RED }}>{submittedOrderId}</strong> in the memo/tag if possible.</p>}
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: MUTE, lineHeight: 1.8 }}>Open Xaman or any XRP wallet, scan the QR or paste the address, and send the exact amount above.</p>
            </div>
          )}
          {paidWithAlt === "eth" && ethQrUrl && (
            <div style={{ marginTop: "16px", padding: "20px", background: "rgba(224,27,27,0.04)", border: "1px solid rgba(224,27,27,0.15)", borderRadius: "12px" }}>
              <img src={ethQrUrl} alt="ETH QR Code" style={{ width: 180, height: 180, borderRadius: 8, marginBottom: 12 }} />
              <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "28px", color: CREAM, marginBottom: 2 }}>{ethAmount} <span style={{ color: "#627eea", fontSize: "16px" }}>ETH</span></p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: DIM, marginBottom: 12 }}>${finalPrice} USD</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
                <code style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#627eea", background: "rgba(98,126,234,0.1)", padding: "6px 10px", borderRadius: 6, wordBreak: "break-all" }}>{ETH_ADDRESS}</code>
                <button onClick={() => navigator.clipboard.writeText(ETH_ADDRESS)} style={{ padding: "6px 10px", background: "rgba(98,126,234,0.15)", border: "1px solid rgba(98,126,234,0.3)", borderRadius: 6, color: "#627eea", cursor: "pointer", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>Copy</button>
              </div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#f59e0b", lineHeight: 1.8, marginBottom: 8 }}>Send only on Ethereum mainnet. Do not send over any other network or funds may be lost.</p>
              {submittedOrderId && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: MUTE, marginBottom: 8 }}>Include order <strong style={{ color: "#627eea" }}>{submittedOrderId}</strong> in the memo/data field if possible.</p>}
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: MUTE, lineHeight: 1.8 }}>Open MetaMask, Coinbase Wallet, or any Ethereum wallet, scan the QR or paste the address, and send the exact amount above.</p>
            </div>
          )}
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: MUTE, lineHeight: 1.8 }}>After payment, you'll get an email confirmation and a print update.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="order" style={{ padding: "104px 20px 60px", position: "relative", overflow: "hidden", background: INK }}>
      <Glow color={RED} x="80%" y="10%" size={320} opacity={0.05} />
      <div style={{ maxWidth: "580px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          {!isCustom && <span onClick={() => go("product", null)} style={{ display: "inline-block", fontFamily: "'DM Mono', monospace", color: MUTE, fontSize: "12px", cursor: "pointer", marginBottom: "12px" }} />}
          <div style={eyebrow(true)}>{isCustom ? "One-off builds" : "Order"}</div>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(30px,5vw,48px)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "8px" }}>{isCustom ? "Request a Custom Piece" : product.name}</h2>
          {isCustom && <p style={{ color: DIM, fontSize: "14px", marginTop: "12px", lineHeight: 1.6 }}>Send a reference and a few details. I'll review it and email you a quote before anything is charged.</p>}
        </div>

        {isCustom && (
          <div style={{ marginBottom: "24px" }}>
            <label style={fieldLabel()}>Reference image</label>
            <div onClick={() => fileRef.current?.click()} style={{ border: `2px dashed ${fileName ? RED : LINE}`, borderRadius: "12px", padding: "38px 20px", textAlign: "center", cursor: "pointer", background: fileName ? "rgba(224,27,27,0.04)" : "transparent" }}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => setFileName(e.target.files?.[0]?.name || "")} />
              <div style={{ marginBottom: "8px" }}>{fileName ? <CheckIcon size={26} /> : null}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: fileName ? RED : MUTE }}>{fileName || "Click to upload — PNG, JPG, SVG"}</div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: "24px" }}>
          <label style={fieldLabel()}>{isCustom ? "Size (hand-painted)" : "Size"}</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            {SIZES.map((t, i) => (
              <div key={i} onClick={() => setSize(t)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderRadius: "10px", cursor: "pointer", background: size?.price === t.price ? "rgba(224,27,27,0.08)" : "rgba(255,255,255,0.015)", border: size?.price === t.price ? `2px solid ${RED}` : `1px solid ${LINE}` }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: CREAM }}>{t.size}{t.label ? " " + t.label : ""}</span>
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "18px", color: size?.price === t.price ? RED : DIM }}>${t.price}</span>
              </div>
            ))}
          </div>
        </div>

        {[{ key: "name", label: "Your Name", ph: "Name" }, { key: "email", label: "Email Address", ph: "you@email.com" }, { key: "address", label: "Street Address", ph: "123 Main St" }].map(f => (
          <div key={f.key} style={{ marginBottom: "20px" }}>
            <label style={fieldLabel()}>{f.label}</label>
            <input type={f.key === "email" ? "email" : "text"} placeholder={f.ph} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle()} />
          </div>
        ))}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          {["city", "state", "zip"].map(k => (
            <div key={k} style={{ flex: 1 }}>
              <label style={fieldLabel()}>{k === "zip" ? "Zip Code" : k[0].toUpperCase() + k.slice(1)}</label>
              <input type="text" placeholder={k === "zip" ? "Zip" : k[0].toUpperCase() + k.slice(1)} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inputStyle()} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={fieldLabel()}>Country</label>
          <input type="text" placeholder="US" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} style={inputStyle()} />
          {isInternational
            ? <p style={{ color: "#f59e0b", fontSize: "13px", marginTop: "6px" }}>International shipping: +$45.00 will be added to your total.</p>
            : <p style={{ color: MUTE, fontSize: "13px", marginTop: "6px" }}>US shipping: +$15.00 will be added to your total.</p>}
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label style={fieldLabel()}>{isCustom ? "What do you want made?" : "Special Requests (optional)"}</label>
          <textarea placeholder={isCustom ? "Describe the piece — a specific ramp, a collectible, colors, any details..." : "Custom colors, finish preference, etc."} value={form.notes} rows={3} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle(), resize: "vertical" }} />
        </div>

        {isCustom && (
          <>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: INK2, border: `1px solid ${LINE}`, borderRadius: "11px", padding: "16px 18px", marginBottom: "14px" }}>
              <input type="checkbox" checked={tos} onChange={e => setTos(e.target.checked)} style={{ width: "18px", height: "18px", flex: "none", marginTop: "2px", accentColor: RED }} />
              <label style={{ fontSize: "13.5px", color: DIM, lineHeight: 1.55 }} onClick={() => setTos(!tos)}>I confirm I have the rights to any images I'm submitting, and that Sloan Craft can use them to produce my custom piece.</label>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12.5px", color: MUTE, lineHeight: 1.6, textAlign: "center", margin: "16px 0" }}>
              <b style={{ color: RED, fontWeight: 500 }}>Complex or oversized pieces may require a custom quote — we'll email you before charging.</b>
            </div>
          </>
        )}

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: MUTE, textTransform: "uppercase", marginBottom: "10px" }}>How are you paying?</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Stripe / Card", "PayPal", "Venmo", "XRP", "ETH"].map(method => (
              <button key={method} type="button" onClick={() => setPaymentMethod(method)} style={{ flex: 1, minWidth: "60px", padding: "10px 6px", fontFamily: "'DM Mono', monospace", fontSize: "11px", borderRadius: "8px", border: paymentMethod === method ? `1px solid ${RED}` : `1px solid ${LINE}`, background: paymentMethod === method ? "rgba(224,27,27,0.12)" : "rgba(255,255,255,0.03)", color: paymentMethod === method ? RED : MUTE, cursor: "pointer" }}>{method}</button>
            ))}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: MUTE, marginTop: "8px", textAlign: "center" }}>Payment options shown instantly after you submit.</div>
        </div>

        <button onClick={handleSubmit} disabled={!canSubmit} style={{ width: "100%", padding: "18px", fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "16px", background: canSubmit ? RED : "rgba(255,255,255,0.04)", color: canSubmit ? "#fff" : "rgba(255,255,255,0.15)", border: "none", borderRadius: "10px", cursor: canSubmit ? "pointer" : "not-allowed" }}>
          {submitting ? "Submitting..." : size ? `Submit Order — $${discountedPrice + shipping}` : "Select a size to continue"}
        </button>
      </div>
    </section>
  );
}

/* ---------- About ---------- */
function About() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "112px 24px 90px" }}>
      <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(38px,6vw,60px)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "30px" }}>About Sloan Craft</h2>
      {["Sloan Craft started the way most of my projects do — I got obsessed with something and couldn't stop.",
        "I'm Elliot Sloan. Most people know me as a vert and mega ramp skater — 16-time X Games medalist, seven of them gold, and a backyard park in Vista called the Sloanyard where we hosted the 2022 and 2023 X Games. But off the board, I've always been a collector. When I got my first 3D printer, that itch found a new outlet.",
        "I started designing and printing some of the most iconic ramps in vert skateboarding. Alongside those, I do custom collectible sculptures, including hand-painted pieces commissioned one at a time.",
        "Everything here is made by me, by hand, in California. It's a small operation on purpose. You're not buying off a shelf in a warehouse — you're getting something I designed, printed, and painted because I genuinely think it's cool. If that sounds like your kind of thing, take a look around."
      ].map((p, i) => <p key={i} style={{ color: DIM, fontSize: "17px", lineHeight: 1.8, marginBottom: "22px" }}>{p}</p>)}
      <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "22px", color: CREAM, letterSpacing: "1px" }}>— Elliot</p>
    </div>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer style={{ padding: "44px 20px 40px", background: "#100e0c", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
      <img src="/images/sloancraft_logo_transparent.svg" alt="Sloan Craft" style={{ height: "30px", width: "auto", opacity: 0.9 }} />
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: MUTE, marginTop: "10px" }}>3D prints by Elliot Sloan · Vista, California</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(242,242,242,0.25)", marginTop: "12px", letterSpacing: "1px" }}>@elliotsloan · info@sloancraft.com</div>
    </footer>
  );
}

/* ---------- Lightbox ---------- */
function Lightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px", cursor: "zoom-out" }}>
      <span style={{ position: "absolute", top: "18px", right: "26px", color: "#fff", fontSize: "34px", cursor: "pointer" }}>×</span>
      <img src={src} alt="" style={{ maxWidth: "92%", maxHeight: "92%", borderRadius: "10px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }} />
    </div>
  );
}

/* ---------- App ---------- */
export default function SloanCraft() {
  const [route, setRoute] = useState("home");
  const [param, setParam] = useState(null);
  const [orderCtx, setOrderCtx] = useState(null);
  const [zoom, setZoom] = useState(null);

  const go = (name, p = null) => { setRoute(name); setParam(p); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" }); };
  const startOrder = (product) => { setOrderCtx(product); go("order"); };

  const CUSTOM_PRODUCT = { name: "Custom Piece", mode: "custom", sizes: CUSTOM_SIZES, initialSize: null };

  return (
    <div style={{ background: INK, color: CREAM, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${INK}; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(224,27,27,0.35); color: #fff; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18); }
        input:focus, textarea:focus, select:focus { border-color: rgba(224,27,27,0.5) !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${INK}; }
        ::-webkit-scrollbar-thumb { background: rgba(224,27,27,0.3); border-radius: 3px; }
        .hero-slide-mobile { display: none; }
        @media (max-width: 820px) {
          .hdr { flex-wrap: wrap; justify-content: center; gap: 4px 14px; padding: 10px 14px; }
          .brand { width: 100%; justify-content: center; }
          .tagline-hide { display: none !important; }
          .nav-right { gap: 0 !important; }
          .nav-links { display: flex !important; gap: 20px; font-size: 13.5px; }
          .nav-cta { display: none !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-slide-desktop { display: none !important; }
          .hero-slide-mobile { display: block !important; margin: 18px 0 6px; }
        }
      `}</style>
      <GrainOverlay />
      <Nav go={go} route={route} />
      {route === "home" && <Home go={go} />}
      {route === "catalog" && <Catalog go={go} />}
      {route === "product" && <Product slug={param} go={go} startOrder={startOrder} />}
      {route === "gallery" && <GalleryView go={go} />}
      {route === "collection" && <Collection id={param} go={go} onZoom={setZoom} />}
      {route === "order" && orderCtx && <OrderForm product={orderCtx} go={go} />}
      {route === "custom" && <OrderForm product={CUSTOM_PRODUCT} go={go} />}
      {route === "about" && <About />}
      <Footer />
      <Lightbox src={zoom} onClose={() => setZoom(null)} />
    </div>
  );
}

/* ---------- style helpers ---------- */
function btn(bg, color) { return { fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", padding: "15px 30px", background: bg, color, border: "none", borderRadius: "8px", cursor: "pointer", transition: "transform .2s, background .2s" }; }
function btnGhost() { return { fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", padding: "15px 30px", background: "transparent", color: CREAM, border: `1px solid ${LINE}`, borderRadius: "8px", cursor: "pointer" }; }
function eyebrow(center) { return { fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: MUTE, marginBottom: "12px", ...(center ? { display: "inline-block" } : {}) }; }
function pageH() { return { fontFamily: "'Anton', sans-serif", fontSize: "clamp(38px,6vw,64px)", textTransform: "uppercase", letterSpacing: "1px" }; }
function pathCard() { return { background: INK2, border: `1px solid ${LINE}`, borderRadius: "18px", padding: "38px 34px", cursor: "pointer", transition: "transform .25s, border-color .25s" }; }
function pathH() { return { fontFamily: "'Anton', sans-serif", fontSize: "30px", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: "14px" }; }
function pathP() { return { color: DIM, lineHeight: 1.65, fontSize: "15.5px", marginBottom: "22px" }; }
function card() { return { background: INK2, border: `1px solid ${LINE}`, borderRadius: "16px", overflow: "hidden", cursor: "pointer", transition: "transform .25s, border-color .25s" }; }
function cardH() { return { fontFamily: "'Anton', sans-serif", fontSize: "21px", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: "6px" }; }
function thumb() { return { aspectRatio: "4/3", background: "#111", position: "relative", overflow: "hidden", borderBottom: `1px solid ${LINE}` }; }
function imgCover() { return { width: "100%", height: "100%", objectFit: "cover", display: "block" }; }
function fieldLabel() { return { fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: MUTE, display: "block", marginBottom: "9px" }; }
function inputStyle() { return { width: "100%", padding: "13px 15px", background: INK, border: `1px solid ${LINE}`, borderRadius: "9px", color: CREAM, fontFamily: "'Archivo', sans-serif", fontSize: "15px", outline: "none", boxSizing: "border-box", transition: "border-color .2s" }; }
function altPay(bg) { return { display: "block", padding: "14px 16px", background: bg, color: "#fff", borderRadius: "10px", textDecoration: "none", fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", textAlign: "center" }; }
function hoverLift(e) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(224,27,27,0.4)"; }
function unLift(e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = LINE; }
function cardHover(e) { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "rgba(224,27,27,0.45)"; }
function cardUn(e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = LINE; }
