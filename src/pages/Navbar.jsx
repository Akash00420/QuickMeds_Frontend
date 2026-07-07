import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";

const AUTH_STORAGE_KEY = "quickmeds_token";

const getUser = () => {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

const Navbar = ({ onNotifyOpen }) => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    navigate("/login");
  };

  const navLinks = [
    { to: "/search", label: "Search" },
    { to: "/reservations", label: "Reservations" },
    { to: "/emergency", label: "Emergency" },
  ];

  if (user?.role === "vendor") {
    navLinks.push({ to: "/vendor", label: "Vendor" });
    navLinks.push({ to: "/dashboard", label: "Dashboard" });
  }

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#111827",
          textDecoration: "none",
        }}
      >
        QuickMeds
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: "#374151",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {link.label}
          </Link>
        ))}

        <button
          onClick={onNotifyOpen}
          aria-label="Notifications"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 6,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Bell size={20} color="#374151" />
        </button>

        <Link
          to="/profile"
          aria-label="Profile"
          style={{ display: "flex", alignItems: "center", color: "#374151" }}
        >
          <User size={20} />
        </Link>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#f3f4f6",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            cursor: "pointer",
            fontSize: 14,
            color: "#111827",
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;