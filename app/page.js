
      {galleryOpen !== false && <PhotoGallery startIndex={galleryOpen} onClose={() => setGalleryOpen(false)} />}
      "use client";
  const [galleryOpen, setGalleryOpen] = useState(false);
import { useState, useEffect, useRef } from "react";

/*
   NFT23D.COM - Turn Any NFT Into a 3D Collectible
   Featured Launch Collection: Bear Champ by JC Rivera

   HOW TO ADD YOUR PHOTOS:
   1. Upload images to the public/images/ folder in your GitHub repo
   2. Replace src="/images/DSCF5393.JPG" with your real filenames
   3. Commit  Vercel auto-deploys in ~60 seconds

   IMAGE NAMES USED IN THIS FILE (upload these to public/images/):
   - hero-print.jpg ............ Your best 3D print photo (main hero)
   - hero-nft.jpg .............. The original NFT image
   - hero-result.jpg ........... Close-up of finished print
   - bear-champ-collection.jpg . Bear Champ collection showcase
   - daf-collection.jpg ........ Dead As Fuck collection showcase
*/

const PRICING = [
  { size: '3"', price: 40, label: "Mini", desc: "Solid color", time: "~2hrs", category: "solid" },
  { size: '5"', price: 60, label: "Standard", desc: "Solid color", time: "~4hrs", category: "solid" },
  { size: '8"', price: 80, label: "Large", desc: "Solid color", time: "~7hrs", category: "solid" },
  { size: '10"', price: 120, label: "XL", desc: "Solid color", time: "~12hrs", category: "solid" },
  { size: '8"', price: 200, label: "Hand Painted", desc: "Full color detail", time: "~2 weeks", category: "painted" },
  { size: '10"', price: 250, label: "Hand Painted", desc: "Full color detail", time: "~2 weeks", category: "painted" },
];

const COLLECTIONS = [
  { name: "Bear Champ", artist: "JC Rivera", status: "LIVE", accent: "#F5C518", img: "/images/IMG_0718.jpeg" },
  { name: "Dead As Fuck", artist: "JC Rivera", status: "LIVE", accent: "#E53E3E", img: "/images/daf-collection.jpg" },
  { name: "Your Collection", artist: "Apply below", status: "COMING SOON", accent: "#6366f1", img: null },
];

const GALLERY_PHOTOS = [
  "/images/IMG_0718.jpeg",
  "/images/DSCF5393.JPG",
  "/images/DSCF5397.JPG",
  "/images/DSCF5398.JPG",
];

function PhotoGallery({ startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) setIdx(i => Math.min(i + 1, GALLERY_PHOTOS.length - 1));
    if (diff < -50) setIdx(i => Math.max(i - 1, 0));
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: "16px", right: "20px", color: "#fff", fontSize: "28px", cursor: "pointer", zIndex: 10 }} onClick={onClose}>X</div>
      <div onClick={e => e.stopPropagation()} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ width: "100%", maxWidth: "600px", maxHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}>
        <img src={GALLERY_PHOTOS[idx]} alt={"Photo " + (idx+1)} style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: "8px" }} />
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        {GALLERY_PHOTOS.map((_, i) => (
          <div key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }} style={{ width: "10px", height: "10px", borderRadius: "50%", background: i === idx ? "#a855f7" : "rgba(255,255,255,0.3)", cursor: "pointer" }} />
        ))}
      </div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "8px", fontFamily: "'DM Mono', monospace" }}>{idx+1} / {GALLERY_PHOTOS.length} — Swipe or tap dots</div>
    </div>
  );
}

/*  Image Component  shows real image if src provided, placeholder if not  */
function SiteImage({ src, label, width = "100%", height = "280px", style = {} }) {
  if (src) {
    return (
      <img
        src={src}
        alt={label || ""}
        style={{
          width, height, borderRadius: "12px", objectFit: "contain", display: "block", ...style,
        }}
      />
    );
  }
  return (
    <div style={{
      width, height, borderRadius: "12px",
      background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 100%)",
      border: "1px dashed rgba(255,255,255,0.1)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative", ...style,
    }}>
      <div style={{ marginBottom: "8px" }}><PictureFrameIcon size={32} opacity={0.3} /></div>
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)",
        letterSpacing: "1.5px", textTransform: "uppercase", textAlign: "center", padding: "0 12px",
      }}>{label}</div>
      <div style={{
        position: "absolute", bottom: "8px", right: "10px",
        fontFamily: "'DM Mono', monospace", fontSize: "8px", color: "rgba(255,255,255,0.1)", letterSpacing: "1px",
      }}>UPLOAD TO /images/</div>
    </div>
  );
}

/*  Ambient Effects  */
function PictureFrameIcon({ size = 32, opacity = 0.3 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity, color: "#fff" }}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 16l5-5 4 4 4-4 5 5" />
      <circle cx="15" cy="8" r="1.5" />
    </svg>
  );
}

function CheckIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto" }}>
      <circle cx="10" cy="10" r="11" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1.5" />
      <path d="M7 12.5l3 3 7-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GrainOverlay() {
  return <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.03,
    mixBlendMode: "overlay",
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }} />;
}

function Glow({ color, x, y, size = 300, opacity = 0.06 }) {
  return <div style={{
    position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%",
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    opacity, pointerEvents: "none", filter: "blur(30px)",
  }} />;
}

function GridBg() {
  return <div style={{
    position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.02,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
  }} />;
}

/*  Navigation  */
function Nav({ onOrderClick }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "16px 28px",
      background: "rgba(8,8,12,0.85)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "6px",
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 700,
        }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", color: "#fff" }}>3D</span>
        </div>
        <span style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "16px",
          color: "#fff", letterSpacing: "0.5px",
        }}>
          NFT<span style={{ color: "#a855f7" }}>2</span>3D
        </span>
      </div>
      <button
        onClick={onOrderClick}
        style={{
          fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 600,
          padding: "8px 20px",
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer",
          transition: "all 0.3s ease", letterSpacing: "0.5px",
        }}
        onMouseEnter={e => e.target.style.opacity = "0.85"}
        onMouseLeave={e => e.target.style.opacity = "1"}
      >Order a Print</button>
    </nav>
  );
}

/*  Hero  */
function Hero({ onOrderClick }) {
  const [v, setV] = useState(false);
  useEffect(() => { setTimeout(() => setV(true), 150); }, []);
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "48px 20px 32px",
      background: "linear-gradient(160deg, #08080c 0%, #0c0818 40%, #10081a 60%, #08080c 100%)",
    }}>
      <GridBg />
      <Glow color="#6366f1" x="10%" y="20%" size={400} opacity={0.07} />
      <Glow color="#a855f7" x="65%" y="55%" size={350} opacity={0.05} />
      <Glow color="#F5C518" x="80%" y="15%" size={200} opacity={0.04} />
      <div style={{
        maxWidth: "1100px", width: "100%", margin: "0 auto",
        display: "grid", gap: "48px",
        alignItems: "center", position: "relative", zIndex: 1,
      }}>
        {/* Left: Text */}
        <div style={{
          opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(40px)",
          transition: "all 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "5px 14px", borderRadius: "100px",
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
            marginBottom: "24px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#a5b4fc",
              letterSpacing: "1px", textTransform: "uppercase",
            }}>Now accepting orders</span>
          </div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1.05,
            color: "#fff", margin: "0 0 20px",
          }}>
            Turn your NFT into a{" "}
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>3D printed collectible</span>
          </h1>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: "clamp(13px, 1.5vw, 15px)",
            color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: "440px", margin: "0 0 36px",
          }}>
            Upload your NFT from any collection. We convert it to a 3D model, print it on
            pro-grade Bambu Lab printers, and ship it to your door.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={onOrderClick}
              style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 600,
                padding: "16px 36px",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer",
                transition: "all 0.3s ease", boxShadow: "0 4px 24px rgba(99,102,241,0.3)",
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(99,102,241,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(99,102,241,0.3)"; }}
            >Start Your Order</button>
            <button
              onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 500,
                padding: "16px 28px",
                background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
                cursor: "pointer", transition: "all 0.3s ease",
              }}
              onMouseEnter={e => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            >How It Works</button>
          </div>
          <div style={{ display: "flex", gap: "36px", marginTop: "48px" }}>
            {[
              { val: "Any NFT", label: "Collection" },
              { val: "48hr", label: "Print Time" },
              { val: "$40+", label: "Starting At" },
            ].map((s, i) => (
              <div key={i} style={{ opacity: v ? 1 : 0, transition: `all 0.7s ${0.5 + i * 0.12}s ease` }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "20px", color: "#fff" }}>{s.val}</div>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "10px",
                  color: "rgba(255,255,255,0.25)", letterSpacing: "1.5px",
                  textTransform: "uppercase", marginTop: "2px",
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right: Image showcase */}
        </div>
    </section>
  );
}

/*  Featured Collections  */
function FeaturedCollections({ onPhotoClick }) {
  return (
    <section style={{
      padding: "48px 20px", position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #08080c, #0a0610, #08080c)",
    }}>
      <Glow color="#F5C518" x="5%" y="30%" size={300} opacity={0.04} />
      <Glow color="#E53E3E" x="70%" y="60%" size={250} opacity={0.03} />
      <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "3px",
            color: "#a855f7", textTransform: "uppercase",
          }}>Launch Collections</span>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 44px)", color: "#fff", marginTop: "10px",
          }}>Featured Collections</h2>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: "13px",
            color: "rgba(255,255,255,0.3)", marginTop: "8px",
            maxWidth: "500px", margin: "8px auto 0",
          }}>
            Launching with JC Rivera's Bear Champ universe. More collections coming soon.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {COLLECTIONS.map((col, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${col.status === "LIVE" ? `${col.accent}22` : "rgba(255,255,255,0.04)"}`,
                borderRadius: "16px", overflow: "hidden", transition: "all 0.4s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = `${col.accent}44`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = col.status === "LIVE" ? `${col.accent}22` : "rgba(255,255,255,0.04)"; }}
            >
              <div onClick={() => { if (col.img && GALLERY_PHOTOS.includes(col.img)) onPhotoClick(0); }} style={{ cursor: col.img ? "pointer" : "default" }}>
                <SiteImage
                  src={col.img}
                  label={col.status === "LIVE" ? `${col.name} collection artwork` : "Your NFT collection here"}
                  height="280px"
                  style={{ borderRadius: 0, border: "none" }}
                />
              </div>
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff", margin: 0 }}>{col.name}</h3>
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "1.5px",
                    padding: "3px 10px", borderRadius: "100px",
                    background: col.status === "LIVE" ? `${col.accent}18` : "rgba(255,255,255,0.04)",
                    color: col.status === "LIVE" ? col.accent : "rgba(255,255,255,0.25)",
                    border: `1px solid ${col.status === "LIVE" ? `${col.accent}33` : "rgba(255,255,255,0.06)"}`,
                  }}>{col.status}</span>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>by {col.artist}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/*  How It Works  */
function HowItWorks() {
  const steps = [
    { num: "01", title: "Upload Your NFT", desc: "Drop your NFT image from any collection on any blockchain. We handle the rest." },
    { num: "02", title: "We Build the 3D Model", desc: "Our team converts your 2D NFT into a detailed, printable 3D model using AI + manual refinement." },
    { num: "03", title: "Choose Your Specs", desc: "Pick your size, color finish, and any custom requests. We'll match your NFT's colors to real filament." },
    { num: "04", title: "Print, Finish & Ship", desc: "Printed on Bambu Lab pro printers, hand-finished, and shipped to your door." },
  ];
  return (
    <section id="how" style={{
      padding: "48px 20px", position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #08080c, #0c0610, #08080c)",
    }}>
      <GridBg />
      <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "3px",
            color: "#a855f7", textTransform: "uppercase",
          }}>The Process</span>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 44px)", color: "#fff", marginTop: "10px",
          }}>How It Works</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: "14px", padding: "32px 24px", transition: "all 0.4s ease",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"; e.currentTarget.style.background = "rgba(99,102,241,0.03)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.background = "rgba(255,255,255,0.015)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{
                position: "absolute", top: "-15px", right: "-5px",
                fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "80px",
                color: "rgba(99,102,241,0.04)", lineHeight: 1,
              }}>{step.num}</div>
              <div style={{ fontSize: "28px", marginBottom: "14px" }}>{step.icon}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "16px", color: "#fff", margin: "0 0 8px" }}>{step.title}</h3>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/*  Pricing  */
function Pricing({ onOrder }) {
  return (
    <section style={{
      padding: "48px 20px", position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #08080c, #0a0614, #08080c)",
    }}>
      <Glow color="#6366f1" x="50%" y="40%" size={500} opacity={0.04} />
      <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "3px",
            color: "#a855f7", textTransform: "uppercase",
          }}></span>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: "clamp(36px, 5.5vw, 56px)", color: "#fff", marginTop: "10px",
          }}>Free Shipping on All Orders</h2>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: "13px",
            color: "rgba(255,255,255,0.3)", marginTop: "8px",
          }}>Free shipping included on all orders</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
          {PRICING.map((tier, i) => {
            const pop = i === 2;
            return (
              <div
                key={i}
                onClick={onOrder}
                style={{
                  background: pop ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.015)",
                  border: pop ? "2px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "14px", padding: "32px 20px", textAlign: "center",
                  cursor: "pointer", transition: "all 0.3s ease", position: "relative",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(99,102,241,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {pop && <div style={{
                  position: "absolute", top: "-11px", left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff",
                  fontFamily: "'DM Mono', monospace", fontSize: "9px", fontWeight: 700,
                  letterSpacing: "2px", padding: "4px 14px", borderRadius: "100px", textTransform: "uppercase",
                }}>Popular</div>}
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: tier.category === "painted" ? "#F5C518" : "rgba(255,255,255,0.4)", marginBottom: "6px" }}>{tier.size} {tier.label}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "42px", color: "#fff", lineHeight: 1 }}>${tier.price}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "6px" }}>{tier.desc}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(99,102,241,0.5)", marginTop: "10px" }}>Print time: {tier.time}</div>
              </div>
            );
          })}
        </div>
        <div style={{
          textAlign: "center", marginTop: "32px",
          fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.2)",
        }}>
          Custom sizes and bulk orders available  reach out for a quote
        </div>
      </div>
    </section>
  );
}

/*  Order Form  */
function OrderForm() {
  const [size, setSize] = useState(null);
  const [fileName, setFileName] = useState("");
  const [form, setForm] = useState({ name: "", email: "", collection: "", wallet: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);
  const canSubmit = form.name && form.email && size;

  if (submitted) {
    const paypalUrl = `https://paypal.me/nft23d/${size?.price}`;
    const venmoUrl = `https://venmo.com/elliotsloan?txn=pay&amount=${size?.price}&note=${encodeURIComponent("NFT 3D Print - " + size?.size + " " + size?.label)}`;
    return (
      <section id="order" style={{ padding: "48px 20px", background: "#08080c", textAlign: "center", minHeight: "100vh" }}>
        <div style={{
          maxWidth: "480px", margin: "0 auto", padding: "56px 32px",
          background: "rgba(99,102,241,0.04)",
          border: "1px solid rgba(99,102,241,0.15)",
          borderRadius: "20px",
        }}>
          <div style={{ marginBottom: "16px" }}>
            <CheckIcon size={48} />
          </div>
          <h3 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "28px",
            color: "#fff", marginBottom: "12px",
          }}>Order Received!</h3>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: "13px",
            color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: "28px",
          }}>
            Complete your payment below to lock in your {size?.size} {size?.label} print. We'll start on your 3D model right away!
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            <a
              href={paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", padding: "16px 24px",
                background: "#0070ba",
                color: "#fff", borderRadius: "10px", textDecoration: "none",
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "15px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
               Pay ${size?.price} with PayPal
            </a>
            <a
              href={venmoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", padding: "16px 24px",
                background: "#3D95CE",
                color: "#fff", borderRadius: "10px", textDecoration: "none",
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "15px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
               Pay ${size?.price} with Venmo
            </a>
          </div>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: "11px",
            color: "rgba(255,255,255,0.2)", lineHeight: 1.8,
          }}>
            After payment, you'll get an email confirmation and a 48hr print update.
          </p>
        </div>
      </section>
    );
  }

  const labelStyle = {
    fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "2px",
    color: "rgba(255,255,255,0.3)", textTransform: "uppercase", display: "block", marginBottom: "8px",
  };
  const inputStyle = {
    width: "100%", padding: "13px 16px",
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "13px",
    outline: "none", transition: "border 0.2s ease", boxSizing: "border-box",
  };

  return (
    <section id="order" style={{
      padding: "48px 20px", position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #08080c, #0a0610, #08080c)",
    }}>
      <Glow color="#a855f7" x="80%" y="15%" size={300} opacity={0.04} />
      <div style={{ maxWidth: "580px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "3px",
            color: "#a855f7", textTransform: "uppercase",
          }}>Order Form</span>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 44px)", color: "#fff", marginTop: "10px",
          }}>Get Your Print</h2>
        </div>

        {/* Upload */}
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>Upload Your NFT Image</label>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${fileName ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "12px", padding: "40px 20px", textAlign: "center",
              cursor: "pointer", background: fileName ? "rgba(99,102,241,0.03)" : "transparent",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => { if (!fileName) e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; }}
            onMouseLeave={e => { if (!fileName) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            <input
              ref={fileRef} type="file" accept="image/*"
              style={{ display: "none" }}
              onChange={e => setFileName(e.target.files?.[0]?.name || "")}
            />
            <div style={{ marginBottom: "8px" }}>{fileName ? <CheckIcon size={28} /> : <PictureFrameIcon size={28} opacity={0.25} />}</div>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "12px",
              color: fileName ? "#a5b4fc" : "rgba(255,255,255,0.25)",
            }}>{fileName || "Click to upload -- PNG, JPG, SVG"}</div>
          </div>
        </div>

        {/* Collection */}
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>NFT Collection Name</label>
          <input
            placeholder="e.g. Bear Champ, Bored Apes, Pudgy Penguins..."
            value={form.collection}
            onChange={e => setForm({ ...form, collection: e.target.value })}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.3)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
          />
        </div>

        {/* Size */}
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>Select Size</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            {PRICING.map((t, i) => (
              <div
                key={i}
                onClick={() => setSize(t)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "13px 16px", borderRadius: "10px", cursor: "pointer",
                  background: size?.size === t.size ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.015)",
                  border: size?.size === t.size ? "2px solid #6366f1" : "1px solid rgba(255,255,255,0.05)",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#fff" }}>{t.size} {t.label}</span>
                <span style={{
                  fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "18px",
                  color: size?.size === t.size ? "#a5b4fc" : "rgba(255,255,255,0.4)",
                }}>${t.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        {[
          { key: "name", label: "Your Name", ph: "Name" },
          { key: "email", label: "Email Address", ph: "you@email.com" },
          { key: "wallet", label: "Wallet Address (optional)", ph: "0x... or r..." },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>{f.label}</label>
            <input
              type={f.key === "email" ? "email" : "text"}
              placeholder={f.ph}
              value={form[f.key]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.3)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
            />
          </div>
        ))}

        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>Special Requests (optional)</label>
          <textarea
            placeholder="Custom colors, specific finish, base engraving, etc."
            value={form.notes}
            rows={3}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.3)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
          />
        </div>

        {/* Payment info */}
        <div style={{
          background: "rgba(99,102,241,0.03)", border: "1px solid rgba(99,102,241,0.1)",
          borderRadius: "12px", padding: "18px 22px", marginBottom: "28px",
        }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "13px",
            color: "#a5b4fc", marginBottom: "6px",
          }}>Payment Methods</div>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: "12px",
            color: "rgba(255,255,255,0.35)", lineHeight: 1.7,
          }}>
            <span style={{ color: "#fff" }}>PayPal</span>{" | "}
            <span style={{ color: "#fff" }}>Venmo</span>
            {" -- Payment link shown instantly after you submit."}
          </div>
        </div>

        <button
          onClick={() => { if (canSubmit) { setSubmitted(true); requestAnimationFrame(() => { requestAnimationFrame(() => { document.getElementById('order')?.scrollIntoView({ behavior: 'instant', block: 'start' }); }); }); } }}
          disabled={!canSubmit}
          style={{
            width: "100%", padding: "18px",
            fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.5px",
            background: canSubmit ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(255,255,255,0.03)",
            color: canSubmit ? "#fff" : "rgba(255,255,255,0.12)",
            border: "none", borderRadius: "10px",
            cursor: canSubmit ? "pointer" : "not-allowed",
            transition: "all 0.3s ease",
            boxShadow: canSubmit ? "0 4px 24px rgba(99,102,241,0.25)" : "none",
          }}
        >
          {size ? `Submit Order  $${size.price}` : "Select a size to continue"}
        </button>
      </div>
    </section>
  );
}

/*  Collection Owners CTA  */
function CollectionCTA() {
  return (
    <section style={{
      padding: "80px 20px", position: "relative",
      background: "linear-gradient(180deg, #08080c, #0c0818, #08080c)",
    }}>
      <div style={{
        maxWidth: "700px", margin: "0 auto", textAlign: "center",
        background: "rgba(99,102,241,0.03)", border: "1px solid rgba(99,102,241,0.1)",
        borderRadius: "20px", padding: "56px 32px",
      }}>
        
        <h3 style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "26px",
          color: "#fff", marginBottom: "12px",
        }}>Run an NFT Project?</h3>
        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: "13px",
          color: "rgba(255,255,255,0.4)", lineHeight: 1.8,
          maxWidth: "480px", margin: "0 auto 28px",
        }}>
          Partner with us to offer your holders physical 3D printed collectibles.
          Bulk pricing, custom finishes, and white-label options available.
          Add real-world utility to your collection.
        </p>
        <a
          href="mailto:elliot@nft23d.com"
          style={{
            display: "inline-block",
            fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "14px",
            padding: "14px 32px",
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
            color: "#a5b4fc", borderRadius: "8px", textDecoration: "none",
            transition: "all 0.3s ease",
          }}
        >Get In Touch</a>
      </div>
    </section>
  );
}

/*  Footer  */
function Footer() {
  return (
    <footer style={{
      padding: "40px 20px 32px", background: "#06060a",
      borderTop: "1px solid rgba(255,255,255,0.03)", textAlign: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
        <div style={{
          width: "22px", height: "22px", borderRadius: "5px",
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "9px", color: "#fff", fontWeight: 700 }}>3D</span>
        </div>
        <span style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "14px",
          color: "rgba(255,255,255,0.3)",
        }}>NFT<span style={{ color: "rgba(168,85,247,0.5)" }}>2</span>3D</span>
      </div>
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: "11px",
        color: "rgba(255,255,255,0.12)", marginBottom: "6px",
      }}>Turning digital art into physical collectibles</div>
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.08)",
      }}>Built by @elliotsloan</div>
      <div style={{ marginTop: "16px", display: "flex", gap: "16px", justifyContent: "center" }}>
        {["PayPal", "Venmo"].map(m => (
          <span key={m} style={{
            fontFamily: "'DM Mono', monospace", fontSize: "9px",
            color: "rgba(255,255,255,0.1)", letterSpacing: "1.5px", textTransform: "uppercase",
          }}>{m}</span>
        ))}
      </div>
    </footer>
  );
}

/*  Main App  */
export default function NFT23D() {
  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div style={{ background: "#08080c", color: "#fff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #08080c; }
        ::selection { background: rgba(99,102,241,0.3); color: #fff; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.15); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #08080c; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 3px; }
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <GrainOverlay />
      <Nav onOrderClick={scrollToOrder} />
      <Hero onOrderClick={scrollToOrder} />
      <FeaturedCollections onPhotoClick={(idx) => setGalleryOpen(idx)} />
      <HowItWorks />
      <Pricing onOrder={scrollToOrder} />
      <OrderForm />
      <CollectionCTA />
      <Footer />
    </div>
  );
}
