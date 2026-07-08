import { useDispatch } from "react-redux";
import { markNotificationRead, markAllNotificationsRead, deleteNotification } from "../Reducer/NotificationSlice";
import { X, Trash2, Check, Bell, AlertTriangle, Clock, AlertCircle } from "lucide-react";
import "../assets/custom.css";

export default function NotifyPanel({ notifications = [], open, onClose }) {
  const dispatch = useDispatch();

  if (!open) return null;

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "reservation":
        return <Clock size={16} style={{ color: "#0d9488" }} />;
      case "stockout":
      case "lowstock":
        return <AlertTriangle size={16} style={{ color: "#f59e0b" }} />;
      default:
        return <AlertCircle size={16} style={{ color: "#3b82f6" }} />;
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    if (isNaN(date.getTime())) return "";
    
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.3)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease-out",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "420px",
          maxWidth: "100%",
          background: "#fff",
          zIndex: 1001,
          boxShadow: "-10px 0 25px -5px rgba(0, 0, 0, 0.1), -8px 0 10px -6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Bell size={20} style={{ color: "#0d9488" }} />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span
                style={{
                  background: "#0d9488",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "10px",
                }}
              >
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "#64748b",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Panel */}
        {notifications.length > 0 && unreadCount > 0 && (
          <div
            style={{
              padding: "0.75rem 1.5rem",
              background: "#f8fafc",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleMarkAllRead}
              style={{
                background: "none",
                border: "none",
                color: "#0d9488",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "2px 6px",
              }}
            >
              <Check size={14} />
              Mark all as read
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 0" }}>
          {notifications.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "60%",
                padding: "2rem",
                textAlign: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "#f1f5f9",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: "#94a3b8",
                }}
              >
                <Bell size={28} />
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#475569", margin: 0 }}>
                All Caught Up!
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0, maxWidth: "250px" }}>
                You have no notifications right now.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && handleMarkRead(n._id)}
                  style={{
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid #f8fafc",
                    display: "flex",
                    gap: "12px",
                    cursor: n.read ? "default" : "pointer",
                    background: n.read ? "#fff" : "#f0fdfa",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = n.read ? "#fafafa" : "#ecfdf5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = n.read ? "#fff" : "#f0fdfa";
                  }}
                >
                  {/* Unread status dot */}
                  {!n.read && (
                    <div
                      style={{
                        position: "absolute",
                        left: "6px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#0d9488",
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: n.read ? "#f1f5f9" : "#ccfbf1",
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {getIcon(n.type)}
                  </div>

                  {/* Text Details */}
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: n.read ? 500 : 600,
                        color: n.read ? "#475569" : "#0f172a",
                        margin: "0 0 4px",
                        lineHeight: 1.4,
                      }}
                    >
                      {n.message}
                    </p>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      {formatTime(n.createdAt)}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(e, n._id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                      color: "#94a3b8",
                      borderRadius: "6px",
                      alignSelf: "flex-start",
                      display: "grid",
                      placeItems: "center",
                      transition: "color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ef4444";
                      e.currentTarget.style.background = "#fee2e2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#94a3b8";
                      e.currentTarget.style.background = "none";
                    }}
                    title="Delete notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
