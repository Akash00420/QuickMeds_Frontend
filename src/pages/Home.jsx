import { ArrowRight, ChevronLeft, ChevronRight, Search, Clock, ShieldCheck, Phone, Mail, MapPin, Pill, Stethoscope, Truck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../assets/custom.css'

const navLinks = [
  { label: 'Home',    href: '#home' },
  { label: 'About',   href: '#about' },
  { label: 'Service', href: '#service' },
  { label: 'Contact', href: '#contact' },
]

const scrollTo = (id) => {
  const el = document.querySelector(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function PharmacyIllustration() {
  return (
    <svg viewBox="0 0 460 400" className="hero-illustration-svg" role="img" aria-label="Pharmacy items illustration">
      <path d="M120 60 C220 10 340 30 390 110 C440 190 420 280 340 330 C260 380 150 370 90 310 C30 250 20 110 120 60 Z" fill="#d9f1ef" />
      <polygon points="380,20 415,40 415,80 380,100 345,80 345,40" fill="none" stroke="#bfe6e2" strokeWidth="3" />
      <polygon points="410,140 430,152 430,176 410,188 390,176 390,152" fill="none" stroke="#bfe6e2" strokeWidth="2" />
      <g transform="translate(60,150) rotate(-10)">
        <rect x="0" y="0" width="110" height="150" rx="14" fill="#ffffff" stroke="#dbe3e6" strokeWidth="2" />
        {Array.from({ length: 4 }).map((_, row) => (
          <g key={row}>
            <circle cx="30" cy={26 + row * 30} r="11" fill={row % 2 === 0 ? '#2fb6c2' : '#f5c451'} />
            <circle cx="80" cy={26 + row * 30} r="11" fill={row % 2 === 0 ? '#f5c451' : '#2fb6c2'} />
          </g>
        ))}
      </g>
      <g transform="translate(150,60)">
        <rect x="45" y="0" width="90" height="26" rx="6" fill="#c9ced1" />
        <rect x="60" y="20" width="60" height="20" fill="#2fb6c2" />
        <rect x="20" y="38" width="140" height="180" rx="18" fill="#2fb6c2" />
        <rect x="45" y="85" width="90" height="90" rx="8" fill="#ffffff" />
        <rect x="80" y="100" width="20" height="60" rx="4" fill="#2fb6c2" />
        <rect x="60" y="120" width="60" height="20" rx="4" fill="#2fb6c2" />
      </g>
      <g transform="translate(300,150) rotate(35)">
        <rect x="0" y="0" width="90" height="30" rx="6" fill="#ffffff" stroke="#c9ced1" strokeWidth="3" />
        <rect x="8" y="6" width="45" height="18" rx="3" fill="#2fb6c2" />
        <rect x="90" y="8" width="26" height="14" fill="#c9ced1" />
        <rect x="116" y="12" width="34" height="6" fill="#334155" />
        <rect x="-22" y="8" width="22" height="14" rx="2" fill="#c9ced1" />
      </g>
      <g transform="translate(130,300) rotate(-20)">
        <rect x="0" y="0" width="60" height="24" rx="12" fill="#f5c451" />
        <rect x="0" y="0" width="30" height="24" rx="12" fill="#ffffff" />
      </g>
      <g transform="translate(230,290) rotate(15)">
        <rect x="0" y="0" width="70" height="26" rx="13" fill="#e2593f" />
        <rect x="0" y="0" width="35" height="26" rx="13" fill="#ffffff" />
      </g>
      <g transform="translate(10,120)">
        <rect x="10" y="0" width="10" height="30" rx="3" fill="#2fb6c2" />
        <rect x="0" y="10" width="30" height="10" rx="3" fill="#2fb6c2" />
      </g>
    </svg>
  )
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="home-card">
        <div className="home-card-inner">

          {/* ── NAV ── */}
          <nav className="home-nav" id="home">
          <span className="home-logo">QuickMeds</span>

          <ul className="home-links">
            {navLinks.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={e => { e.preventDefault(); scrollTo(link.href) }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="home-auth">
            <button className="btn-outline" onClick={() => navigate('/register')}>Sign up</button>
            <button className="btn-filled" onClick={() => navigate('/login')}>Sign in</button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div className="home-hero">
          <div className="home-hero-text">
            <h1 className="home-heading">
              PHARMACY
              <span>STORE</span>
            </h1>
            <p className="home-copy">
              Order medicines from trusted pharmacies near you. Fast delivery,
              real-time stock updates, and emergency support — all in one place.
            </p>
            <button className="home-cta" onClick={() => navigate('/register')}>
              GET STARTED <ArrowRight size={16} />
            </button>
          </div>

          <div className="home-hero-illustration">
            <PharmacyIllustration />
          </div>

          <div className="home-dots" aria-hidden="true">
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>

          <div className="home-carousel-nav">
            <button className="carousel-arrow" aria-label="Previous slide">
              <ChevronLeft size={16} />
            </button>
            <button className="carousel-arrow filled" aria-label="Next slide">
              <ChevronRight size={16} />
            </button>
          </div>
          </div>{/* end home-hero */}
        </div>{/* end home-card-inner */}
      </div>{/* end home-card */}

      {/* ── ABOUT ── */}
      <section id="about" className="home-section">
        <div className="home-section-inner">
          <div className="home-section-text">
            <span className="home-section-eyebrow">Who We Are</span>
            <h2 className="home-section-title">About QuickMeds</h2>
            <p className="home-section-body">
              QuickMeds is a smart pharmacy platform connecting patients with trusted local
              pharmacies across the country. We make ordering medicines simple, fast, and
              reliable — with real-time stock visibility and doorstep delivery.
            </p>
            <p className="home-section-body">
              Our mission is to ensure every patient gets the medication they need without
              the stress of running store to store. We partner with verified pharmacies and
              use intelligent systems to monitor stock, flag shortages, and predict demand.
            </p>
            <div className="home-about-stats">
              <div className="home-stat"><span className="home-stat-num">500+</span><span className="home-stat-label">Partner Pharmacies</span></div>
              <div className="home-stat"><span className="home-stat-num">50k+</span><span className="home-stat-label">Happy Patients</span></div>
              <div className="home-stat"><span className="home-stat-num">99%</span><span className="home-stat-label">Delivery Success</span></div>
            </div>
          </div>
          <div className="home-about-visual">
            <div className="home-about-card">
              <ShieldCheck size={40} color="#17b0c2" />
              <h3>Verified & Trusted</h3>
              <p>Every pharmacy on our platform is verified, licensed, and regularly audited for quality.</p>
            </div>
            <div className="home-about-card">
              <Clock size={40} color="#17b0c2" />
              <h3>Fast Delivery</h3>
              <p>Get your medicines delivered within hours. Track your order in real time from pharmacy to door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE ── */}
      <section id="service" className="home-section home-section-alt">
        <div className="home-section-inner home-section-center">
          <span className="home-section-eyebrow">What We Offer</span>
          <h2 className="home-section-title">Our Services</h2>
          <p className="home-section-body home-section-body-center">
            From searching medicines to emergency deliveries, QuickMeds has you covered 24/7.
          </p>
          <div className="home-services-grid">
            <div className="home-service-card">
              <div className="home-service-icon"><Search size={28} /></div>
              <h3>Medicine Search</h3>
              <p>Search across hundreds of pharmacies instantly. Filter by location, price, and availability.</p>
            </div>
            <div className="home-service-card">
              <div className="home-service-icon"><Pill size={28} /></div>
              <h3>Prescription Management</h3>
              <p>Upload your prescription and let us handle the rest. Refills, reminders, and history all in one place.</p>
            </div>
            <div className="home-service-card">
              <div className="home-service-icon"><Truck size={28} /></div>
              <h3>Express Delivery</h3>
              <p>Doorstep delivery from the nearest partner pharmacy. Fast, safe, and fully tracked.</p>
            </div>
            <div className="home-service-card">
              <div className="home-service-icon"><Stethoscope size={28} /></div>
              <h3>Emergency Support</h3>
              <p>Critical medicine requests handled with priority. Our emergency team operates around the clock.</p>
            </div>
            <div className="home-service-card">
              <div className="home-service-icon"><Clock size={28} /></div>
              <h3>Reservation System</h3>
              <p>Reserve medicines in advance to guarantee stock availability when you need them most.</p>
            </div>
            <div className="home-service-card">
              <div className="home-service-icon"><ShieldCheck size={28} /></div>
              <h3>Verified Pharmacies</h3>
              <p>Every partner is licensed and verified. Shop with confidence knowing every product is authentic.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="home-section">
        <div className="home-section-inner home-section-center">
          <span className="home-section-eyebrow">Get In Touch</span>
          <h2 className="home-section-title">Contact Us</h2>
          <p className="home-section-body home-section-body-center">
            Have questions or need support? Reach out to our team — we're here to help.
          </p>
          <div className="home-contact-grid">
            <div className="home-contact-info">
              <div className="home-contact-item">
                <Phone size={22} color="#17b0c2" />
                <div>
                  <p className="home-contact-label">Phone</p>
                  <p className="home-contact-value">+91 98765 43210</p>
                </div>
              </div>
              <div className="home-contact-item">
                <Mail size={22} color="#17b0c2" />
                <div>
                  <p className="home-contact-label">Email</p>
                  <p className="home-contact-value">support@quickmeds.in</p>
                </div>
              </div>
              <div className="home-contact-item">
                <MapPin size={22} color="#17b0c2" />
                <div>
                  <p className="home-contact-label">Address</p>
                  <p className="home-contact-value">12 MG Road, Kolkata, West Bengal 700001</p>
                </div>
              </div>
            </div>

            <form className="home-contact-form" onSubmit={e => e.preventDefault()}>
              <input className="home-contact-input" type="text"  placeholder="Your name"    required />
              <input className="home-contact-input" type="email" placeholder="Your email"   required />
              <textarea className="home-contact-input home-contact-textarea" placeholder="Your message" rows={4} required />
              <button type="submit" className="home-contact-btn">Send Message <ArrowRight size={16} /></button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <p>© 2025 QuickMeds. All rights reserved.</p>
        <div className="home-footer-links">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={e => { e.preventDefault(); scrollTo(link.href) }}>
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}