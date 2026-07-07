 import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: 96, fontWeight: 800, color: "#dc2626", margin: 0 }}>
        404
      </h1>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginTop: 8, marginBottom: 8 }}>
        Page Not Found
      </h2>
      <p style={{ color: "#6b7280", marginBottom: 24, maxWidth: 400 }}>
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        style={{
          padding: "10px 24px",
          borderRadius: 8,
          background: "#111827",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;