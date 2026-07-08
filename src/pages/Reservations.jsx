import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReservations, cancelReservation } from "../Reducer/ReservationSlice";
import { Pill, Clock, AlertCircle, Trash2, Shield, Calendar, MapPin } from "lucide-react";
import "../assets/custom.css";

export default function Reservations() {
  const dispatch = useDispatch();
  const { reservations, loading, error } = useSelector((s) => s.reservation);

  useEffect(() => {
    dispatch(getAllReservations());
  }, [dispatch]);

  const handleCancel = (id) => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      dispatch(cancelReservation(id));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return {
          background: "#d1fae5",
          color: "#065f46",
          badge: "Approved",
        };
      case "rejected":
        return {
          background: "#fee2e2",
          color: "#991b1b",
          badge: "Rejected",
        };
      case "pending":
        return {
          background: "#fef3c7",
          color: "#92400e",
          badge: "Pending Approval",
        };
      default:
        return {
          background: "#f1f5f9",
          color: "#334155",
          badge: status,
        };
    }
  };

  if (loading && reservations.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", minHeight: "100vh" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>My Reservations</h1>
        <p style={{ color: "#64748b", margin: "8px 0 0" }}>
          Track and manage your reserved medications from local pharmacies.
        </p>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "80px", height: "80px", background: "#f1f5f9", borderRadius: "50%", display: "grid", placeItems: "center", color: "#64748b" }}>
            <Clock size={36} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>No Reservations Yet</h2>
          <p style={{ color: "#64748b", maxWidth: "400px", margin: 0 }}>
            You haven't made any reservations. Find local pharmacies and reserve your medications to see them here.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
          {reservations.map((res) => {
            const statusConfig = getStatusStyle(res.status);
            return (
              <div key={res._id} className="card" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                  <div style={{ width: "56px", height: "56px", background: "#f1f5f9", borderRadius: "12px", display: "grid", placeItems: "center", color: "#0d9488", flexShrink: 0 }}>
                    <Pill size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
                      {res.medicineName}
                    </h3>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#64748b" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <strong>Qty:</strong> {res.quantity}
                      </span>
                      {res.createdAt && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Calendar size={13} />
                          {new Date(res.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      {res.pharmacyName && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={13} />
                          {res.pharmacyName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                  <span style={{
                    background: statusConfig.background,
                    color: statusConfig.color,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    padding: "6px 12px",
                    borderRadius: "20px",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}>
                    <Shield size={12} />
                    {statusConfig.badge}
                  </span>

                  {res.status === "pending" && (
                    <button
                      onClick={() => handleCancel(res._id)}
                      style={{
                        background: "none",
                        border: "1px solid #fee2e2",
                        color: "#ef4444",
                        borderRadius: "8px",
                        padding: "8px 14px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fee2e2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "none";
                      }}
                    >
                      <Trash2 size={14} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
