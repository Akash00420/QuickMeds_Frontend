import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, pharmacies: 0, reservations: 0 });

  const getAuthHeader = () => {
    const stored = sessionStorage.getItem("quickmeds_token");
    const token = stored ? JSON.parse(stored)?.token : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = getAuthHeader();
        const [usersRes, pharmaciesRes, reservationsRes] = await Promise.allSettled([
          axios.get(`${API}admin/users`, { headers }),
          axios.get(`${API}admin/pharmacies`, { headers }),
          axios.get(`${API}admin/reservations`, { headers }),
        ]);

        const usersData = usersRes.status === "fulfilled" ? usersRes.value.data : [];
        const pharmaciesData = pharmaciesRes.status === "fulfilled" ? pharmaciesRes.value.data : [];
        const reservationsData = reservationsRes.status === "fulfilled" ? reservationsRes.value.data : [];

        setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
        setPharmacies(Array.isArray(pharmaciesData) ? pharmaciesData : pharmaciesData.pharmacies || []);
        setReservations(Array.isArray(reservationsData) ? reservationsData : reservationsData.reservations || []);
        setStats({
          users: (Array.isArray(usersData) ? usersData : usersData.users || []).length,
          pharmacies: (Array.isArray(pharmaciesData) ? pharmaciesData : pharmaciesData.pharmacies || []).length,
          reservations: (Array.isArray(reservationsData) ? reservationsData : reservationsData.reservations || []).length,
        });
      } catch (err) {
        console.error("AdminPanel fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API}admin/users/${id}`, { headers: getAuthHeader() });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setStats((s) => ({ ...s, users: s.users - 1 }));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const tabs = [
    { key: "users", label: "Users", icon: "👥" },
    { key: "pharmacies", label: "Pharmacies", icon: "🏥" },
    { key: "reservations", label: "Reservations", icon: "📋" },
  ];

  const statCards = [
    { label: "Total Users", value: stats.users, icon: "👥", color: "#6366f1" },
    { label: "Pharmacies", value: stats.pharmacies, icon: "🏥", color: "#10b981" },
    { label: "Reservations", value: stats.reservations, icon: "📋", color: "#f59e0b" },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <h1 style={styles.headerTitle}>⚕️ QuickMeds Admin</h1>
            <p style={styles.headerSub}>Manage your platform with ease</p>
          </div>
          <button style={styles.backBtn} onClick={() => navigate("/")}>← Back to App</button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Stat Cards */}
        <div style={styles.statsGrid}>
          {statCards.map((card) => (
            <div key={card.label} style={{ ...styles.statCard, borderTop: `4px solid ${card.color}` }}>
              <span style={styles.statIcon}>{card.icon}</span>
              <div>
                <div style={styles.statValue}>{loading ? "…" : card.value}</div>
                <div style={styles.statLabel}>{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={styles.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              style={{ ...styles.tabBtn, ...(activeTab === tab.key ? styles.tabBtnActive : {}) }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.loading}>Loading data…</div>
          ) : activeTab === "users" ? (
            <UserTable users={users} onDelete={handleDeleteUser} />
          ) : activeTab === "pharmacies" ? (
            <PharmacyTable pharmacies={pharmacies} />
          ) : (
            <ReservationTable reservations={reservations} />
          )}
        </div>
      </main>
    </div>
  );
};

/* ──────────── Sub-tables ──────────── */

const UserTable = ({ users, onDelete }) => (
  <div style={styles.tableWrapper}>
    <table style={styles.table}>
      <thead>
        <tr>
          {["Name", "Email", "Role", "Actions"].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr><td colSpan={4} style={styles.empty}>No users found.</td></tr>
        ) : users.map((u) => (
          <tr key={u._id} style={styles.tr}>
            <td style={styles.td}>{u.name || "—"}</td>
            <td style={styles.td}>{u.email || "—"}</td>
            <td style={styles.td}>
              <span style={{ ...styles.badge, background: u.role === "admin" ? "#6366f1" : "#10b981" }}>
                {u.role || "user"}
              </span>
            </td>
            <td style={styles.td}>
              <button style={styles.deleteBtn} onClick={() => onDelete(u._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PharmacyTable = ({ pharmacies }) => (
  <div style={styles.tableWrapper}>
    <table style={styles.table}>
      <thead>
        <tr>
          {["Name", "Address", "Phone", "Status"].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {pharmacies.length === 0 ? (
          <tr><td colSpan={4} style={styles.empty}>No pharmacies found.</td></tr>
        ) : pharmacies.map((p) => (
          <tr key={p._id} style={styles.tr}>
            <td style={styles.td}>{p.name || "—"}</td>
            <td style={styles.td}>{p.address || "—"}</td>
            <td style={styles.td}>{p.phone || "—"}</td>
            <td style={styles.td}>
              <span style={{ ...styles.badge, background: p.isActive !== false ? "#10b981" : "#ef4444" }}>
                {p.isActive !== false ? "Active" : "Inactive"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ReservationTable = ({ reservations }) => (
  <div style={styles.tableWrapper}>
    <table style={styles.table}>
      <thead>
        <tr>
          {["User", "Pharmacy", "Date", "Status"].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {reservations.length === 0 ? (
          <tr><td colSpan={4} style={styles.empty}>No reservations found.</td></tr>
        ) : reservations.map((r) => (
          <tr key={r._id} style={styles.tr}>
            <td style={styles.td}>{r.user?.name || r.userId || "—"}</td>
            <td style={styles.td}>{r.pharmacy?.name || r.pharmacyId || "—"}</td>
            <td style={styles.td}>{r.date ? new Date(r.date).toLocaleDateString() : "—"}</td>
            <td style={styles.td}>
              <span style={{
                ...styles.badge,
                background: r.status === "confirmed" ? "#10b981" : r.status === "cancelled" ? "#ef4444" : "#f59e0b",
              }}>
                {r.status || "pending"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ──────────── Styles ──────────── */
const styles = {
  container: { minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" },
  header: { background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", borderBottom: "1px solid #1e293b", padding: "0" },
  headerInner: { maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { margin: 0, fontSize: "1.75rem", fontWeight: 700, background: "linear-gradient(90deg, #818cf8, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  headerSub: { margin: "0.25rem 0 0", color: "#94a3b8", fontSize: "0.875rem" },
  backBtn: { background: "rgba(99,102,241,0.15)", border: "1px solid #6366f1", color: "#818cf8", padding: "0.5rem 1.25rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" },
  main: { maxWidth: "1200px", margin: "0 auto", padding: "2rem" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" },
  statCard: { background: "#1e293b", borderRadius: "12px", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" },
  statIcon: { fontSize: "2rem" },
  statValue: { fontSize: "2rem", fontWeight: 700, color: "#f1f5f9" },
  statLabel: { color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.25rem" },
  tabBar: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
  tabBtn: { background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", padding: "0.6rem 1.5rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s" },
  tabBtnActive: { background: "linear-gradient(135deg, #6366f1, #818cf8)", border: "1px solid #6366f1", color: "#fff" },
  tableCard: { background: "#1e293b", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "1rem 1.25rem", textAlign: "left", color: "#64748b", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #334155", background: "#0f172a" },
  tr: { borderBottom: "1px solid #1e293b", transition: "background 0.15s" },
  td: { padding: "1rem 1.25rem", color: "#cbd5e1", fontSize: "0.9rem" },
  badge: { display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, color: "#fff", textTransform: "capitalize" },
  deleteBtn: { background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", color: "#ef4444", padding: "0.35rem 0.9rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 },
  empty: { padding: "3rem", textAlign: "center", color: "#64748b" },
  loading: { padding: "3rem", textAlign: "center", color: "#94a3b8", fontSize: "1.1rem" },
};

export default AdminPanel;
