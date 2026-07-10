import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../assets/custom.css'

const navLinks = ['Home', 'About', 'Service', 'Contact']

function PharmacyIllustration() {
  return (
    <svg viewBox="0 0 460 400" className="hero-illustration-svg" role="img" aria-label="Pharmacy items illustration">
      {/* soft blob background */}
      <path
        d="M120 60 C220 10 340 30 390 110 C440 190 420 280 340 330 C260 380 150 370 90 310 C30 250 20 110 120 60 Z"
        fill="#d9f1ef"
      />

      {/* decorative hexagons */}
      <polygon
        points="380,20 415,40 415,80 380,100 345,80 345,40"
        fill="none"
        stroke="#bfe6e2"
        strokeWidth="3"
      />
      <polygon
        points="410,140 430,152 430,176 410,188 390,176 390,152"
        fill="none"
        stroke="#bfe6e2"
        strokeWidth="2"
      />

      {/* blister pack */}
      <g transform="translate(60,150) rotate(-10)">
        <rect x="0" y="0" width="110" height="150" rx="14" fill="#ffffff" stroke="#dbe3e6" strokeWidth="2" />
        {Array.from({ length: 4 }).map((_, row) => (
          <g key={row}>
            <circle cx="30" cy={26 + row * 30} r="11" fill={row % 2 === 0 ? '#2fb6c2' : '#f5c451'} />
            <circle cx="80" cy={26 + row * 30} r="11" fill={row % 2 === 0 ? '#f5c451' : '#2fb6c2'} />
          </g>
        ))}
      </g>

      {/* medicine bottle */}
      <g transform="translate(150,60)">
        <rect x="45" y="0" width="90" height="26" rx="6" fill="#c9ced1" />
        <rect x="60" y="20" width="60" height="20" fill="#2fb6c2" />
        <rect x="20" y="38" width="140" height="180" rx="18" fill="#2fb6c2" />
        <rect x="45" y="85" width="90" height="90" rx="8" fill="#ffffff" />
        <rect x="80" y="100" width="20" height="60" rx="4" fill="#2fb6c2" />
        <rect x="60" y="120" width="60" height="20" rx="4" fill="#2fb6c2" />
      </g>

      {/* syringe */}
      <g transform="translate(300,150) rotate(35)">
        <rect x="0" y="0" width="90" height="30" rx="6" fill="#ffffff" stroke="#c9ced1" strokeWidth="3" />
        <rect x="8" y="6" width="45" height="18" rx="3" fill="#2fb6c2" />
        <rect x="90" y="8" width="26" height="14" fill="#c9ced1" />
        <rect x="116" y="12" width="34" height="6" fill="#334155" />
        <rect x="-22" y="8" width="22" height="14" rx="2" fill="#c9ced1" />
      </g>

      {/* loose capsules */}
      <g transform="translate(130,300) rotate(-20)">
        <rect x="0" y="0" width="60" height="24" rx="12" fill="#f5c451" />
        <rect x="0" y="0" width="30" height="24" rx="12" fill="#ffffff" />
      </g>
      <g transform="translate(230,290) rotate(15)">
        <rect x="0" y="0" width="70" height="26" rx="13" fill="#e2593f" />
        <rect x="0" y="0" width="35" height="26" rx="13" fill="#ffffff" />
      </g>

      {/* floating cross */}
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
        <nav className="home-nav">
          <span className="home-logo">YOUR LOGO</span>

          <ul className="home-links">
            {navLinks.map(link => (
              <li key={link}><a href="#">{link}</a></li>
            ))}
          </ul>

          <div className="home-auth">
            <button className="btn-outline" onClick={() => navigate('/register')}>Sign up</button>
            <button className="btn-filled" onClick={() => navigate('/login')}>Sign in</button>
          </div>
        </nav>

        <div className="home-hero">
          <div className="home-hero-text">
            <h1 className="home-heading">
              PHARMACY
              <span>STORE</span>
            </h1>
            <p className="home-copy">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua
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
        </div>
      </div>
    </div>
  )
}