import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getPharmacyStats, getActivityFeed, getDemandTrends } from "../Reducer/PharmacySlice";
import { getAllMedicines } from "../Reducer/MedicineSlice";
import { getAllReservations } from "../Reducer/ReservationSlice";
import { getAllNotifications } from "../Reducer/NotificationSlice";

const StatCard = ({ label, value }) => (
  <div style={{
    background: "#fff",
    borderRadius: 12,
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    flex: "1 1 200px",
  }}>
    <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
  </div>
);

const AdminPanel = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState("overview");

  const { stats, activityFeed, demandTrends, loading: pharmacyLoading } =
    useSelector((s) => s.pharmacy);
  const { medicines, loading: medicineLoading } = useSelector((s) => s.medicine);
  const { reservations, loading: reservationLoading } = useSelector((s) => s.reservation);
  const { notifications } = useSelector((s) => s.notification);

  useEffect(() => {
    dispatch(getPharmacyStats());
    dispatch(getActivityFeed());
    dispatch(getDemandTrends());
    dispatch(getAllMedicines());
    dispatch(getAllReservations());
    dispatch(getAllNotifications());
  }, [dispatch]);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "medicines", label: "Medicines" },
    { key: "reservations", label: "Reservations" },
    { key: "activity", label: "Activity" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "32px 40px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Admin Panel</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: tab === t.key ? "#111827" : "#e5e7eb",
              color: tab === t.key ? "#fff" : "#111827",
              fontWeight: 500,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
            <StatCard label="Total Medicines" value={stats?.totalMedicines ?? 0} />
            <StatCard label="Low Stock" value={stats?.lowStock ?? 0} />
            <StatCard label="Critical Stock" value={stats?.criticalStock ?? 0} />
            <StatCard label="Pending Reservations" value={stats?.pendingReservations ?? 0} />
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Demand Trends</h2>
          {pharmacyLoading ? (
            <p>Loading demand trends...</p>
          ) : demandTrends?.length ? (
            <ul>
              {demandTrends.map((d, i) => (
                <li key={i}>
                  {d.medicineName} — {d.demandCount} requests ({d.date})
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#6b7280" }}>No demand data yet.</p>
          )}
        </>
      )}

      {tab === "medicines" && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Medicines</h2>
          {medicineLoading ? (
            <p>Loading medicines...</p>
          ) : medicines?.length ? (
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ padding: 8 }}>Name</th>
                  <th style={{ padding: 8 }}>Stock</th>
                  <th style={{ padding: 8 }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((m) => (
                  <tr key={m._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 8 }}>{m.name}</td>
                    <td style={{ padding: 8 }}>{m.stock}</td>
                    <td style={{ padding: 8 }}>₹{m.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "#6b7280" }}>No medicines found.</p>
          )}
        </div>
      )}

      {tab === "reservations" && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Reservations</h2>
          {reservationLoading ? (
            <p>Loading reservations...</p>
          ) : reservations?.length ? (
            <ul>
              {reservations.map((r) => (
                <li key={r._id}>
                  {r.medicineName} — {r.status} ({r.userName})
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#6b7280" }}>No reservations found.</p>
          )}
        </div>
      )}

      {tab === "activity" && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Recent Activity</h2>
          {activityFeed?.length ? (
            <ul>
              {activityFeed.map((a) => (
                <li key={a.id}>
                  {a.message} — {a.time}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#6b7280" }}>No recent activity.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;