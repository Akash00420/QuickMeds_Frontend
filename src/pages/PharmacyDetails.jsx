import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMedicineById } from "../Reducer/MedicineSlice";
import { createReservation } from "../Reducer/ReservationSlice";
import { ChevronLeft, Pill, Shield, Clock, MapPin, AlertCircle, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../store/Api";
import "../assets/custom.css";

export default function PharmacyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedMedicine, loading, error } = useSelector((s) => s.medicine);
  const { loading: reservationLoading } = useSelector((s) => s.reservation);

  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");
  const [formError, setFormError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    dispatch(getMedicineById(id));
  }, [dispatch, id]);

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!selectedMedicine) return;

    const pharmacyId =
      typeof selectedMedicine.pharmacy === "object"
        ? selectedMedicine.pharmacy?._id
        : selectedMedicine.pharmacy;

    if (!pharmacyId) {
      setFormError("Could not determine pharmacy for this medicine.");
      return;
    }

    setFormError("");
    setPaymentLoading(true);

    const totalCost = selectedMedicine.sellingPrice * quantity;

    try {
      // ✅ FIX 1: Corrected API Endpoint URL to match backend
      const orderRes = await api.post('/payments/order/create', {
        amount: totalCost,
        items: [
          {
            medicineId: selectedMedicine._id,
            quantity: Number(quantity),
          }
        ]
      });
      
      const { order, message } = orderRes.data;

      const options = {
        key: orderRes.data.keyId, // Backend se aayi hui Razorpay Key use kar rahe hain
        amount: order.amount,
        currency: "INR",
        name: "QuickMeds",
        description: `Reservation for ${selectedMedicine.name}`,
        order_id: order.id,
        
        handler: async function (response) {
          try {
            // ✅ FIX 2: Corrected Verify API Endpoint URL
            const verifyRes = await api.post('/payments/order/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              const result = await dispatch(
                createReservation({
                  pharmacyId,
                  items: [
                    {
                      medicineId: selectedMedicine._id,
                      quantity: Number(quantity),
                    },
                  ],
                })
              );

              if (createReservation.fulfilled.match(result)) {
                setSuccessMsg("Payment successful & Reservation created! Redirecting...");
                setTimeout(() => {
                  navigate("/reservations");
                }, 2000);
              } else if (createReservation.rejected.match(result)) {
                setFormError(result.payload || "Payment successful, but failed to create reservation.");
              }
            }
          } catch (verifyError) {
            setFormError("Payment verification failed.");
            console.error(verifyError);
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#0d9488",
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setFormError("Payment Failed. Please try again.");
        setPaymentLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      setFormError(error.response?.data?.message || "Could not initiate payment. Please try again later.");
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error || !selectedMedicine) {
    return (
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
        <AlertCircle size={48} style={{ color: "#ef4444", marginBottom: "1rem" }} />
        <h2>Error Loading Medicine Details</h2>
        <p style={{ color: "#64748b" }}>{error || "Medicine not found."}</p>
        <Link to="/search" className="tab-btn active" style={{ display: "inline-block", marginTop: "1rem", textDecoration: "none" }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  const inStock = selectedMedicine.quantity > 0;
  const isButtonDisabled = reservationLoading || paymentLoading;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", minHeight: "100vh" }}>
      <Link to="/search" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", marginBottom: "2rem", fontWeight: 600 }}>
        <ChevronLeft size={16} />
        Back to search
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        <div className="card" style={{ padding: "2rem", display: "flex", flexSelf: "start", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{
            width: "120px",
            height: "120px",
            background: "#f1f5f9",
            borderRadius: "16px",
            display: "grid",
            placeItems: "center",
            color: "#0d9488",
          }}>
            <Pill size={48} />
          </div>

          <div style={{ flex: 1, minWidth: "250px" }}>
            <span style={{
              background: "#ccfbf1",
              color: "#0f766e",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "4px 8px",
              borderRadius: "6px",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "0.75rem",
            }}>
              {selectedMedicine.category || "General"}
            </span>

            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem" }}>
              {selectedMedicine.name}
            </h1>

            <p style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.95rem", margin: "0 0 1.5rem" }}>
              <MapPin size={16} />
              <span>Certified Partner Pharmacy</span>
            </p>

            <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
              <div>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Unit Price</span>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0d9488", margin: 0 }}>
                  ₹{selectedMedicine.sellingPrice}
                  {selectedMedicine.mrp > selectedMedicine.sellingPrice && (
                    <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#94a3b8", textDecoration: "line-through", marginLeft: "8px" }}>
                      ₹{selectedMedicine.mrp}
                    </span>
                  )}
                </p>
              </div>
              <div>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Stock Status</span>
                <p style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: inStock ? "#10b981" : "#ef4444",
                  margin: 0,
                  marginTop: "4px",
                }}>
                  {inStock ? `${selectedMedicine.quantity} ${selectedMedicine.unit || "available"}` : "Out of stock"}
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "2rem" }}>
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0d9488", fontWeight: 700, fontSize: "0.875rem", marginBottom: "4px" }}>
                  <Shield size={16} />
                  Verified Pharmacy
                </div>
                <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
                  Quality and authentic medications guaranteed.
                </p>
              </div>
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0d9488", fontWeight: 700, fontSize: "0.875rem", marginBottom: "4px" }}>
                  <Clock size={16} />
                  Instant Pickup
                </div>
                <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
                  Reserve now and collect within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {inStock && (
          <div className="card" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b", margin: "0 0 1rem" }}>
              Reserve Medication
            </h2>

            {successMsg ? (
              <div style={{ background: "#d1fae5", color: "#065f46", padding: "1rem", borderRadius: "8px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                <Shield size={18} />
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleReserve}>
                {formError && (
                  <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <AlertCircle size={16} />
                    {formError}
                  </div>
                )}
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-end", flexWrap: "wrap" }}>
                  <label className="field" style={{ flex: 1, minWidth: "150px" }}>
                    <span className="field-label">Quantity</span>
                    <input
                      type="number"
                      min="1"
                      max={selectedMedicine.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="field-input"
                    />
                  </label>

                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Total Cost</span>
                    <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0, height: "40px", display: "flex", alignItems: "center" }}>
                      ₹{(selectedMedicine.sellingPrice * quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isButtonDisabled}
                    style={{
                      background: isButtonDisabled ? "#94a3b8" : "#0d9488",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontWeight: 600,
                      cursor: isButtonDisabled ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      height: "42px",
                    }}
                  >
                    <ShoppingCart size={18} />
                    {paymentLoading ? "Processing Payment..." : reservationLoading ? "Reserving..." : "Pay & Reserve"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}