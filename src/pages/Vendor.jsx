import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMedicines, addMedicine, updateMedicine, deleteMedicine } from "../Reducer/MedicineSlice";
import { getAllReservations, updateReservationStatus } from "../Reducer/ReservationSlice";
import { Plus, Trash2, Edit2, Check, X, Package, Clock, DollarSign, AlertCircle } from "lucide-react";
import "../assets/custom.css";

export default function Vendor() {
  const dispatch = useDispatch();
  const { medicines, loading: medLoading } = useSelector((s) => s.medicine);
  const { reservations, loading: resLoading } = useSelector((s) => s.reservation);

  const [activeTab, setActiveTab] = useState("inventory");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Add form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  // Edit fields
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    dispatch(getAllMedicines());
    dispatch(getAllReservations());
  }, [dispatch]);

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!name || !category || !stock || !price) return;
    dispatch(
      addMedicine({
        name,
        category,
        stock: Number(stock),
        price: Number(price),
      })
    );
    // Reset form
    setName("");
    setCategory("");
    setStock("");
    setPrice("");
    setShowAddForm(false);
  };

  const handleStartEdit = (med) => {
    setEditingId(med._id);
    setEditStock(med.stock);
    setEditPrice(med.price);
  };

  const handleSaveEdit = (medId) => {
    dispatch(
      updateMedicine({
        id: medId,
        updates: {
          stock: Number(editStock),
          price: Number(editPrice),
        },
      })
    );
    setEditingId(null);
  };

  const handleDelete = (medId) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      dispatch(deleteMedicine(medId));
    }
  };

  const handleUpdateResStatus = (resId, status) => {
    dispatch(updateReservationStatus({ id: resId, status }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="badge badge-success">Approved</span>;
      case "rejected":
        return <span className="badge badge-danger">Rejected</span>;
      case "pending":
        return <span className="badge badge-warning">Pending</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <div className="dashboard" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Title section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>Vendor Portal</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0" }}>Manage your pharmacy inventory and customer reservations.</p>
        </div>
        <div className="tabs">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`tab-btn ${activeTab === "inventory" ? "active" : ""}`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`tab-btn ${activeTab === "reservations" ? "active" : ""}`}
          >
            Reservations
          </button>
        </div>
      </div>

      {activeTab === "inventory" ? (
        <div className="card">
          <div className="card-header row" style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 className="card-title">Medicine Inventory</h2>
              <p className="card-subtitle">List of available products in your store</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#0d9488",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Plus size={16} />
              Add Medicine
            </button>
          </div>

          <div className="card-content">
            {showAddForm && (
              <form
                onSubmit={handleAddMedicine}
                style={{
                  background: "#f8fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  marginBottom: "1.5rem",
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  alignItems: "end",
                }}
              >
                <label className="field">
                  <span className="field-label">Medicine Name</span>
                  <input
                    type="text"
                    required
                    placeholder="Paracetamol 500mg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field-input"
                  />
                </label>
                <label className="field">
                  <span className="field-label">Category</span>
                  <input
                    type="text"
                    required
                    placeholder="Analgesic"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="field-input"
                  />
                </label>
                <label className="field">
                  <span className="field-label">Stock Quantity</span>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="100"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="field-input"
                  />
                </label>
                <label className="field">
                  <span className="field-label">Price (INR)</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="45"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="field-input"
                  />
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      background: "#0d9488",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    style={{
                      background: "#e2e8f0",
                      color: "#475569",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 16px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {medLoading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>Loading inventory...</div>
            ) : medicines.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                <Package size={48} style={{ marginBottom: "1rem", color: "#94a3b8" }} />
                <p>No medicines found in your inventory. Add some to get started!</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med) => (
                      <tr key={med._id}>
                        <td className="medicine">{med.name}</td>
                        <td>{med.category || "General"}</td>
                        <td>
                          {editingId === med._id ? (
                            <input
                              type="number"
                              min="0"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                              className="field-input"
                              style={{ width: "80px", margin: 0 }}
                            />
                          ) : (
                            <span style={{ fontWeight: 600, color: med.stock < 10 ? "#ef4444" : "#0f172a" }}>
                              {med.stock} {med.stock < 10 && "(Low Stock)"}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingId === med._id ? (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="field-input"
                              style={{ width: "80px", margin: 0 }}
                            />
                          ) : (
                            <span>₹{med.price}</span>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            {editingId === med._id ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(med._id)}
                                  style={{
                                    background: "#10b981",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "6px",
                                    cursor: "pointer",
                                  }}
                                  title="Save Changes"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  style={{
                                    background: "#e2e8f0",
                                    color: "#475569",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "6px",
                                    cursor: "pointer",
                                  }}
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartEdit(med)}
                                  style={{
                                    background: "#f1f5f9",
                                    color: "#475569",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "6px",
                                    cursor: "pointer",
                                  }}
                                  title="Edit"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(med._id)}
                                  style={{
                                    background: "#fee2e2",
                                    color: "#ef4444",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "6px",
                                    cursor: "pointer",
                                  }}
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header" style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
            <h2 className="card-title">Customer Reservations</h2>
            <p className="card-subtitle">Approve or reject reservation requests</p>
          </div>
          <div className="card-content">
            {resLoading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>Loading reservations...</div>
            ) : reservations.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                <Clock size={48} style={{ marginBottom: "1rem", color: "#94a3b8" }} />
                <p>No customer reservations found.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Customer</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <tr key={res._id}>
                        <td className="medicine">{res.medicineName}</td>
                        <td>{res.userName || "Guest User"}</td>
                        <td>{res.quantity}</td>
                        <td>{getStatusBadge(res.status)}</td>
                        <td style={{ textAlign: "right" }}>
                          {res.status === "pending" && (
                            <div style={{ display: "inline-flex", gap: "8px" }}>
                              <button
                                onClick={() => handleUpdateResStatus(res._id, "approved")}
                                style={{
                                  background: "#d1fae5",
                                  color: "#047857",
                                  border: "none",
                                  borderRadius: "6px",
                                  padding: "6px 12px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateResStatus(res._id, "rejected")}
                                style={{
                                  background: "#fee2e2",
                                  color: "#b91c1c",
                                  border: "none",
                                  borderRadius: "6px",
                                  padding: "6px 12px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
