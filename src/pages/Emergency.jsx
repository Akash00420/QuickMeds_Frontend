import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEmergencyRequests,
  createEmergencyRequest,
  getNearbyEmergencyPharmacies,
} from "../Reducer/EmergencySlice";

const Emergency = () => {
  const dispatch = useDispatch();
  const { requests, nearbyPharmacies, loading, error } = useSelector(
    (s) => s.emergency
  );

  const [medicineName, setMedicineName] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    dispatch(getAllEmergencyRequests());

    // Try to get the user's location for nearby pharmacy lookup
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          dispatch(getNearbyEmergencyPharmacies({ lat: latitude, lng: longitude }));
        },
        () => {
          // Silently ignore — user can still submit a request without geolocation
        }
      );
    }
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    setSubmitting(true);
    try {
      await dispatch(
        createEmergencyRequest({
          medicineName: medicineName.trim(),
          location: location.trim() || null,
          lat: coords?.lat,
          lng: coords?.lng,
        })
      ).unwrap();
      setMedicineName("");
      setLocation("");
    } catch {
      // error is already captured in slice state
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Emergency Medicine Request
      </h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Can't find a medicine nearby? Submit an emergency request and we'll
        alert nearby pharmacies.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          marginBottom: 32,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            Medicine Name
          </label>
          <input
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="e.g. Insulin, EpiPen, Paracetamol"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            Location (optional — auto-detected if you allow location access)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Howrah, West Bengal"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        {coords && (
          <p style={{ fontSize: 12, color: "#16a34a", marginBottom: 16 }}>
            Location detected — nearby pharmacies will be notified.
          </p>
        )}

        {error && (
          <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 16 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 8,
            border: "none",
            background: submitting ? "#f87171" : "#dc2626",
            color: "#fff",
            fontWeight: 600,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Emergency Request"}
        </button>
      </form>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        Nearby Pharmacies
      </h2>
      {nearbyPharmacies?.length ? (
        <ul style={{ marginBottom: 32 }}>
          {nearbyPharmacies.map((p) => (
            <li key={p._id} style={{ marginBottom: 6 }}>
              {p.name} — {p.distance ? `${p.distance} km away` : p.address}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#6b7280", marginBottom: 32 }}>
          {coords ? "No nearby pharmacies found." : "Enable location access to see nearby pharmacies."}
        </p>
      )}

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        Your Emergency Requests
      </h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : requests?.length ? (
        <ul>
          {requests.map((r) => (
            <li key={r._id} style={{ marginBottom: 6 }}>
              {r.medicineName} — <strong>{r.status}</strong>
              {r.location ? ` (${r.location})` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#6b7280" }}>No emergency requests yet.</p>
      )}
    </div>
  );
};

export default Emergency;