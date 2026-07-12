import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMedicines } from "../Reducer/MedicineSlice";
import { Search as SearchIcon, MapPin, Pill, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "../assets/custom.css";

export default function Search() {
  const dispatch = useDispatch();
  const { medicines, loading } = useSelector((s) => s.medicine);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch on mount (all medicines) and whenever searchTerm changes
  useEffect(() => {
    const params = {};
    if (searchTerm.trim()) params.name = searchTerm.trim();
    if (selectedCategory !== "all") params.category = selectedCategory;
    dispatch(getAllMedicines(params));
  }, [dispatch, searchTerm, selectedCategory]);


  const categories = ["all", ...new Set(medicines.map((m) => m.category).filter(Boolean))];

  // Backend already filters — just use returned medicines directly
  const filteredMedicines = medicines;


  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}>
      {/* Header section */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Find Your Medicines
        </h1>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "1.1rem" }}>
          Search across certified local pharmacies for instant reservation and pickup.
        </p>
      </div>

      {/* Search and filter controls */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        background: "#fff",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        marginBottom: "2.5rem",
      }}>
        <div style={{ position: "relative", flex: 1 }}>
          <SearchIcon style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
          <input
            type="text"
            placeholder="Search by medicine name, symptoms, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field-input"
            style={{
              paddingLeft: "48px",
              height: "50px",
              fontSize: "1rem",
              borderRadius: "12px",
              margin: 0,
            }}
          />
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "0.5rem" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: selectedCategory === cat ? "none" : "1px solid #e2e8f0",
                background: selectedCategory === cat ? "#0d9488" : "#f8fafc",
                color: selectedCategory === cat ? "#fff" : "#475569",
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "capitalize",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          <p style={{ color: "#64748b" }}>Searching catalogs...</p>
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
          <Pill size={48} style={{ color: "#cbd5e1", marginBottom: "1rem" }} />
          <h3>No medicines found</h3>
          <p>Try searching for a different term or browse other categories.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {filteredMedicines.map((med) => (
            <div
              key={med._id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "1.25rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgb(0 0 0 / 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <span style={{
                    background: "#ccfbf1",
                    color: "#0f766e",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "4px 8px",
                    borderRadius: "6px",
                    textTransform: "uppercase",
                  }}>
                    {med.category || "General"}
                  </span>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: med.stock > 0 ? "#10b981" : "#ef4444",
                    background: med.stock > 0 ? "#d1fae5" : "#fee2e2",
                    padding: "4px 8px",
                    borderRadius: "6px",
                  }}>
                    {med.stock > 0 ? `${med.stock} in stock` : "Out of Stock"}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e293b", margin: "0 0 0.5rem" }}>
                  {med.name}
                </h3>

                <p style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.875rem", margin: "0 0 1rem" }}>
                  <MapPin size={14} />
                  <span>Available at local pharmacies</span>
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginTop: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Price</span>
                  <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    ₹{med.price}
                  </p>
                </div>

                {med.stock > 0 ? (
                  <Link
                    to={`/pharmacy/${med._id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#0d9488",
                      color: "#fff",
                      textDecoration: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      transition: "background 0.2s",
                    }}
                  >
                    Reserve
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <button
                    disabled
                    style={{
                      background: "#cbd5e1",
                      color: "#94a3b8",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: "not-allowed",
                    }}
                  >
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
