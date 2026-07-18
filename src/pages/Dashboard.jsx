import { useState, useEffect, useRef } from "react";
import "../assets/qm-dashboard.css";

/* ─────────────────────────────────────────────────────────────────
   MOCK DATA  –  swap with Redux / API calls as needed
───────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "vitamins",      label: "Vitamins",       emoji: "💊", color: "#FFF3E0", accent: "#FF6F00" },
  { id: "skincare",      label: "Skin Care",      emoji: "🧴", color: "#FCE4EC", accent: "#E91E63" },
  { id: "diabetes",      label: "Diabetes",       emoji: "🩸", color: "#E8F5E9", accent: "#2E7D32" },
  { id: "cardiac",       label: "Cardiac",        emoji: "❤️", color: "#FFEBEE", accent: "#C62828" },
  { id: "liver",         label: "Liver Care",     emoji: "🫀", color: "#F3E5F5", accent: "#7B1FA2" },
  { id: "immunity",      label: "Immunity",       emoji: "🛡️", color: "#E3F2FD", accent: "#1565C0" },
  { id: "pain",          label: "Pain Relief",    emoji: "🤕", color: "#FFF8E1", accent: "#F57F17" },
  { id: "eye",           label: "Eye Care",       emoji: "👁️", color: "#E0F7FA", accent: "#006064" },
];

const BANNER_OFFERS = [
  {
    id: "b1",
    tag: "UP TO 30% OFF",
    title: "Medicines at\nYour Doorstep",
    sub: "Free delivery on orders above ₹299",
    cta: "Order Now",
    bg: "linear-gradient(135deg, #FF6F61 0%, #FF8E53 100%)",
    emoji: "💊",
  },
  {
    id: "b2",
    tag: "FLAT 25% OFF",
    title: "Lab Tests at\nHome",
    sub: "500+ tests • NABL certified labs",
    cta: "Book Test",
    bg: "linear-gradient(135deg, #10B190 0%, #0D8ACB 100%)",
    emoji: "🧬",
  },
  {
    id: "b3",
    tag: "CONSULT FOR ₹99",
    title: "Talk to a Doctor\n24 × 7",
    sub: "General • Specialist • Ayurveda",
    cta: "Consult Now",
    bg: "linear-gradient(135deg, #486AAE 0%, #7C5AC9 100%)",
    emoji: "👨‍⚕️",
  },
];

const PRODUCTS = [
  { id: "p1", name: "Limcee Vitamin C",    pack: "Chewable Tabs, 60s",    mrp: 120,  price: 90,  rating: 4.5, reviews: 2340, tag: "BESTSELLER",   emoji: "🟡", bg: "#FFFDE7" },
  { id: "p2", name: "Zincovit Syrup",      pack: "200 ml",               mrp: 210,  price: 162, rating: 4.3, reviews: 1120, tag: "15% OFF",       emoji: "🔵", bg: "#E3F2FD" },
  { id: "p3", name: "Becosules Capsules",  pack: "Multivitamin, 30 caps", mrp: 180,  price: 144, rating: 4.6, reviews: 4890, tag: "TATA CHOICE",   emoji: "🟢", bg: "#E8F5E9" },
  { id: "p4", name: "Pantocid 40mg",       pack: "Strip of 15 Tabs",     mrp: 95,   price: 73,  rating: 4.1, reviews: 678,  tag: "",             emoji: "🟠", bg: "#FFF3E0" },
  { id: "p5", name: "Allegra 120mg",       pack: "Anti-Allergy, 10 Tabs",mrp: 230,  price: 185, rating: 4.4, reviews: 3100, tag: "20% OFF",       emoji: "🟣", bg: "#F3E5F5" },
  { id: "p6", name: "Dolo 650 Paracetamol",pack: "Strip of 15 Tabs",     mrp: 30,   price: 26,  rating: 4.7, reviews: 9870, tag: "BESTSELLER",   emoji: "🔴", bg: "#FFEBEE" },
];

const LAB_TESTS = [
  { id: "lt1", name: "Full Body Checkup",   tests: "78 tests", price: 1999, originalPrice: 5500, discount: "64% off", tat: "Reports in 24 hrs" },
  { id: "lt2", name: "Diabetes Panel",      tests: "10 tests", price: 699,  originalPrice: 1800, discount: "61% off", tat: "Reports in 6 hrs"  },
  { id: "lt3", name: "Thyroid Profile",     tests: "3 tests",  price: 399,  originalPrice: 1200, discount: "67% off", tat: "Reports in 6 hrs"  },
  { id: "lt4", name: "Vitamin D & B12",     tests: "2 tests",  price: 849,  originalPrice: 2400, discount: "65% off", tat: "Reports in 24 hrs" },
];

const MY_ORDERS = [
  { id: "o1", name: "Dolo 650 + Limcee",  date: "12 Jul 2026", status: "Delivered",  statusColor: "#2E7D32", statusBg: "#E8F5E9" },
  { id: "o2", name: "Thyroid Profile Test",date: "15 Jul 2026", status: "In Transit", statusColor: "#F57F17", statusBg: "#FFF8E1" },
  { id: "o3", name: "Becosules Capsules",  date: "16 Jul 2026", status: "Processing", statusColor: "#1565C0", statusBg: "#E3F2FD" },
];

const HEALTH_FEED = [
  { id: "h1", icon: "📖", title: "Monsoon Wellness Tips",     tag: "Article",  time: "5 min read"  },
  { id: "h2", icon: "🎥", title: "Managing Diabetes Daily",   tag: "Video",    time: "8 min watch" },
  { id: "h3", icon: "💡", title: "Why Vitamin D Matters",     tag: "Article",  time: "4 min read"  },
];

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [search, setSearch]         = useState("");
  const [bannerIdx, setBannerIdx]   = useState(0);
  const [wishlist, setWishlist]     = useState(new Set());
  const [cart, setCart]             = useState({});
  const [activeTab, setActiveTab]   = useState("all");
  const autoRef                     = useRef(null);

  /* Auto-rotate banner */
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setBannerIdx((i) => (i + 1) % BANNER_OFFERS.length);
    }, 4000);
    return () => clearInterval(autoRef.current);
  }, []);

  const totalCartItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const toggleWishlist = (id) =>
    setWishlist((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const addToCart = (id) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const removeFromCart = (id) =>
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });

  const filteredProducts =
    search.trim() === ""
      ? PRODUCTS
      : PRODUCTS.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );

  const banner = BANNER_OFFERS[bannerIdx];

  return (
    <div className="qmd-root">
      {/* ══════════════════ TOP BAR ══════════════════ */}
      <header className="qmd-topbar">
        <div className="qmd-topbar-inner">
          {/* Brand */}
          <div className="qmd-brand">
            <span className="qmd-brand-icon">⚕️</span>
            <span className="qmd-brand-name">QuickMeds</span>
          </div>

          {/* Search */}
          <div className="qmd-search-wrap">
            <span className="qmd-search-icon">🔍</span>
            <input
              id="qmd-search-input"
              className="qmd-search-input"
              type="text"
              placeholder="Search medicines, vitamins, lab tests…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="qmd-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="qmd-topbar-actions">
            <button id="qmd-cart-btn" className="qmd-action-btn" aria-label="Cart">
              🛒
              {totalCartItems > 0 && (
                <span className="qmd-badge">{totalCartItems}</span>
              )}
            </button>
            <button id="qmd-notify-btn" className="qmd-action-btn" aria-label="Notifications">
              🔔
              <span className="qmd-badge" style={{ background: "#FF6F61" }}>3</span>
            </button>
            <div className="qmd-avatar" aria-label="User profile">
              <img src="https://i.pravatar.cc/40?img=47" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main className="qmd-main">

        {/* ══════════════════ LOCATION STRIP ══════════════════ */}
        <div className="qmd-location-strip">
          <span className="qmd-loc-icon">📍</span>
          <span className="qmd-loc-text">Deliver to&nbsp;<strong>Kolkata, 700001</strong></span>
          <button className="qmd-loc-change">Change</button>
        </div>

        {/* ══════════════════ HERO BANNER CAROUSEL ══════════════════ */}
        <section className="qmd-banner-section" aria-label="Promotional banners">
          <div
            className="qmd-banner"
            style={{ background: banner.bg }}
            key={banner.id}
          >
            <div className="qmd-banner-text">
              <span className="qmd-banner-tag">{banner.tag}</span>
              <h1 className="qmd-banner-title">
                {banner.title.split("\n").map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </h1>
              <p className="qmd-banner-sub">{banner.sub}</p>
              <button id={`qmd-banner-cta-${banner.id}`} className="qmd-banner-cta">
                {banner.cta} →
              </button>
            </div>
            <div className="qmd-banner-emoji" aria-hidden="true">
              {banner.emoji}
            </div>
          </div>

          {/* Dots */}
          <div className="qmd-dots">
            {BANNER_OFFERS.map((_, i) => (
              <button
                key={i}
                id={`qmd-dot-${i}`}
                className={`qmd-dot ${i === bannerIdx ? "active" : ""}`}
                onClick={() => {
                  clearInterval(autoRef.current);
                  setBannerIdx(i);
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ══════════════════ QUICK LINKS ══════════════════ */}
        <section className="qmd-section">
          <div className="qmd-quick-links">
            {[
              { id: "ql-order",    icon: "🛒", label: "Order\nMedicines" },
              { id: "ql-lab",      icon: "🧬", label: "Lab\nTests" },
              { id: "ql-consult",  icon: "👨‍⚕️", label: "Consult\nDoctor" },
              { id: "ql-upload",   icon: "📋", label: "Upload\nPrescription" },
              { id: "ql-insurance",icon: "🏥", label: "Health\nInsurance" },
              { id: "ql-emergency",icon: "🚑", label: "Emergency\nHelp" },
            ].map((q) => (
              <button key={q.id} id={q.id} className="qmd-quick-btn">
                <span className="qmd-quick-icon">{q.icon}</span>
                <span className="qmd-quick-label">
                  {q.label.split("\n").map((l, i) => <span key={i}>{l}</span>)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════════ CATEGORIES ══════════════════ */}
        <section className="qmd-section">
          <div className="qmd-section-head">
            <h2 className="qmd-section-title">Shop by Category</h2>
            <a href="#" className="qmd-view-all">View All →</a>
          </div>
          <div className="qmd-categories">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                id={`qmd-cat-${c.id}`}
                className="qmd-category-btn"
                style={{ "--cat-bg": c.color, "--cat-accent": c.accent }}
              >
                <span className="qmd-cat-emoji">{c.emoji}</span>
                <span className="qmd-cat-label">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════════ PRODUCTS ══════════════════ */}
        <section className="qmd-section">
          <div className="qmd-section-head">
            <h2 className="qmd-section-title">
              {search ? `Results for "${search}"` : "Best Sellers"}
            </h2>
            {!search && <a href="#" className="qmd-view-all">See All →</a>}
          </div>

          {/* Filter tabs */}
          {!search && (
            <div className="qmd-tabs">
              {["all", "vitamins", "ayurvedic", "personal care"].map((t) => (
                <button
                  key={t}
                  id={`qmd-tab-${t.replace(" ", "-")}`}
                  className={`qmd-tab-btn ${activeTab === t ? "active" : ""}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          )}

          <div className="qmd-products-grid">
            {filteredProducts.map((p) => {
              const discountPct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
              const qty = cart[p.id] || 0;
              return (
                <div key={p.id} id={`qmd-prod-${p.id}`} className="qmd-product-card">
                  {/* Wishlist */}
                  <button
                    className={`qmd-wishlist-btn ${wishlist.has(p.id) ? "active" : ""}`}
                    onClick={() => toggleWishlist(p.id)}
                    aria-label={`Toggle wishlist for ${p.name}`}
                  >
                    {wishlist.has(p.id) ? "♥" : "♡"}
                  </button>

                  {/* Tag */}
                  {p.tag && <span className="qmd-prod-tag">{p.tag}</span>}

                  {/* Image area */}
                  <div className="qmd-prod-img" style={{ background: p.bg }}>
                    <span className="qmd-prod-emoji">{p.emoji}</span>
                  </div>

                  {/* Info */}
                  <div className="qmd-prod-info">
                    <p className="qmd-prod-name">{p.name}</p>
                    <p className="qmd-prod-pack">{p.pack}</p>
                    <div className="qmd-prod-rating">
                      <span className="qmd-star">★</span>
                      <span className="qmd-rating-val">{p.rating}</span>
                      <span className="qmd-rating-cnt">({p.reviews.toLocaleString()})</span>
                    </div>
                    <div className="qmd-prod-price-row">
                      <span className="qmd-prod-price">₹{p.price}</span>
                      <span className="qmd-prod-mrp">₹{p.mrp}</span>
                      <span className="qmd-prod-discount">{discountPct}% off</span>
                    </div>
                  </div>

                  {/* Cart control */}
                  {qty === 0 ? (
                    <button
                      className="qmd-add-btn"
                      onClick={() => addToCart(p.id)}
                      id={`qmd-add-${p.id}`}
                    >
                      ADD
                    </button>
                  ) : (
                    <div className="qmd-qty-ctrl">
                      <button
                        className="qmd-qty-btn"
                        onClick={() => removeFromCart(p.id)}
                        aria-label="Decrease"
                      >−</button>
                      <span className="qmd-qty-val">{qty}</span>
                      <button
                        className="qmd-qty-btn"
                        onClick={() => addToCart(p.id)}
                        aria-label="Increase"
                      >+</button>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <p className="qmd-empty">No medicines found for "{search}"</p>
            )}
          </div>
        </section>

        {/* ══════════════════ LAB TESTS ══════════════════ */}
        <section className="qmd-section qmd-lab-section">
          <div className="qmd-section-head">
            <h2 className="qmd-section-title">Book Lab Tests at Home</h2>
            <a href="#" className="qmd-view-all">View All →</a>
          </div>
          <div className="qmd-lab-grid">
            {LAB_TESTS.map((t) => (
              <div key={t.id} id={`qmd-lab-${t.id}`} className="qmd-lab-card">
                <div className="qmd-lab-icon-wrap">🧬</div>
                <p className="qmd-lab-name">{t.name}</p>
                <p className="qmd-lab-tests">{t.tests} included</p>
                <div className="qmd-lab-price-row">
                  <span className="qmd-lab-price">₹{t.price}</span>
                  <span className="qmd-lab-original">₹{t.originalPrice}</span>
                  <span className="qmd-lab-discount">{t.discount}</span>
                </div>
                <p className="qmd-lab-tat">🕐 {t.tat}</p>
                <button className="qmd-lab-btn" id={`qmd-book-${t.id}`}>
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════ CONSULT BANNER ══════════════════ */}
        <section className="qmd-consult-banner">
          <div className="qmd-consult-text">
            <p className="qmd-consult-tag">AVAILABLE 24×7</p>
            <h2 className="qmd-consult-title">Consult a Doctor Online</h2>
            <p className="qmd-consult-sub">
              General Physician · Specialists · Nutritionist
            </p>
            <button id="qmd-consult-cta" className="qmd-consult-cta">
              Consult Now
            </button>
          </div>
          <div className="qmd-consult-emoji" aria-hidden="true">👨‍⚕️</div>
        </section>

        {/* ══════════════════ MY ORDERS ══════════════════ */}
        <section className="qmd-section">
          <div className="qmd-section-head">
            <h2 className="qmd-section-title">My Recent Orders</h2>
            <a href="/reservations" className="qmd-view-all">View All →</a>
          </div>
          <div className="qmd-orders-list">
            {MY_ORDERS.map((o) => (
              <div key={o.id} id={`qmd-order-${o.id}`} className="qmd-order-card">
                <div className="qmd-order-icon">📦</div>
                <div className="qmd-order-info">
                  <p className="qmd-order-name">{o.name}</p>
                  <p className="qmd-order-date">{o.date}</p>
                </div>
                <span
                  className="qmd-order-status"
                  style={{ color: o.statusColor, background: o.statusBg }}
                >
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════ HEALTH FEED ══════════════════ */}
        <section className="qmd-section">
          <div className="qmd-section-head">
            <h2 className="qmd-section-title">Health Articles & Videos</h2>
            <a href="#" className="qmd-view-all">More →</a>
          </div>
          <div className="qmd-health-feed">
            {HEALTH_FEED.map((h) => (
              <div key={h.id} id={`qmd-health-${h.id}`} className="qmd-health-card">
                <div className="qmd-health-icon">{h.icon}</div>
                <div className="qmd-health-body">
                  <span className="qmd-health-tag">{h.tag}</span>
                  <p className="qmd-health-title">{h.title}</p>
                  <p className="qmd-health-time">{h.time}</p>
                </div>
                <span className="qmd-health-arrow">›</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════ TRUST STRIP ══════════════════ */}
        <div className="qmd-trust-strip">
          {[
            { icon: "🚚", label: "Free Delivery", sub: "Above ₹299" },
            { icon: "✅", label: "Genuine Meds",  sub: "100% Authentic" },
            { icon: "↩️", label: "Easy Returns",  sub: "7-day policy" },
            { icon: "🔒", label: "Secure Pay",    sub: "SSL Encrypted" },
          ].map((t) => (
            <div key={t.label} className="qmd-trust-item">
              <span className="qmd-trust-icon">{t.icon}</span>
              <div>
                <p className="qmd-trust-label">{t.label}</p>
                <p className="qmd-trust-sub">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* ══════════════════ BOTTOM NAV (mobile) ══════════════════ */}
      <nav className="qmd-bottom-nav" aria-label="Main navigation">
        {[
          { id: "nav-home",    icon: "🏠", label: "Home"    },
          { id: "nav-orders",  icon: "📦", label: "Orders"  },
          { id: "nav-consult", icon: "👨‍⚕️", label: "Consult" },
          { id: "nav-profile", icon: "👤", label: "Profile" },
        ].map((n) => (
          <button key={n.id} id={n.id} className="qmd-bottom-btn">
            <span className="qmd-bottom-icon">{n.icon}</span>
            <span className="qmd-bottom-label">{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}