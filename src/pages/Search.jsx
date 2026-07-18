// import { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllMedicines } from "../Reducer/MedicineSlice";
// import { Search as SearchIcon, MapPin, Pill, Tag, ArrowRight } from "lucide-react";
// import { Link } from "react-router-dom";
// import "../assets/custom.css";

// export default function Search() {
//   const dispatch = useDispatch();
//   const { medicines, loading } = useSelector((s) => s.medicine);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");

//   // Fetch on mount (all medicines) and whenever searchTerm changes
//   useEffect(() => {
//     const params = {};
//     if (searchTerm.trim()) params.name = searchTerm.trim();
//     if (selectedCategory !== "all") params.category = selectedCategory;
//     dispatch(getAllMedicines(params));
//   }, [dispatch, searchTerm, selectedCategory]);


//   const categories = ["all", ...new Set(medicines.map((m) => m.category).filter(Boolean))];

//   // Backend already filters — just use returned medicines directly
//   const filteredMedicines = medicines;


//   return (
//     <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}>
//       {/* Header section */}
//       <div style={{ textAlign: "center", marginBottom: "3rem" }}>
//         <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
//           Find Your Medicines
//         </h1>
//         <p style={{ color: "#64748b", marginTop: "8px", fontSize: "1.1rem" }}>
//           Search across certified local pharmacies for instant reservation and pickup.
//         </p>
//       </div>

//       {/* Search and filter controls */}
//       <div style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: "1rem",
//         background: "#fff",
//         padding: "1.5rem",
//         borderRadius: "16px",
//         boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
//         marginBottom: "2.5rem",
//       }}>
//         <div style={{ position: "relative", flex: 1 }}>
//           <SearchIcon style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
//           <input
//             type="text"
//             placeholder="Search by medicine name, symptoms, or category..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="field-input"
//             style={{
//               paddingLeft: "48px",
//               height: "50px",
//               fontSize: "1rem",
//               borderRadius: "12px",
//               margin: 0,
//             }}
//           />
//         </div>

//         {/* Categories */}
//         <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "0.5rem" }}>
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setSelectedCategory(cat)}
//               style={{
//                 padding: "8px 16px",
//                 borderRadius: "20px",
//                 border: selectedCategory === cat ? "none" : "1px solid #e2e8f0",
//                 background: selectedCategory === cat ? "#0d9488" : "#f8fafc",
//                 color: selectedCategory === cat ? "#fff" : "#475569",
//                 fontWeight: 600,
//                 fontSize: "0.875rem",
//                 textTransform: "capitalize",
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//               }}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Results grid */}
//       {loading ? (
//         <div style={{ textAlign: "center", padding: "3rem" }}>
//           <div className="spinner" style={{ margin: "0 auto 1rem" }} />
//           <p style={{ color: "#64748b" }}>Searching catalogs...</p>
//         </div>
//       ) : filteredMedicines.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
//           <Pill size={48} style={{ color: "#cbd5e1", marginBottom: "1rem" }} />
//           <h3>No medicines found</h3>
//           <p>Try searching for a different term or browse other categories.</p>
//         </div>
//       ) : (
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//           gap: "1.5rem",
//         }}>
//           {filteredMedicines.map((med) => (
//             <div
//               key={med._id}
//               className="card"
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//                 padding: "1.25rem",
//                 transition: "transform 0.2s, box-shadow 0.2s",
//                 cursor: "pointer",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = "translateY(-4px)";
//                 e.currentTarget.style.boxShadow = "0 10px 15px -3px rgb(0 0 0 / 0.1)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "translateY(0)";
//                 e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
//               }}
//             >
//               <div>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
//                   <span style={{
//                     background: "#ccfbf1",
//                     color: "#0f766e",
//                     fontSize: "0.75rem",
//                     fontWeight: 700,
//                     padding: "4px 8px",
//                     borderRadius: "6px",
//                     textTransform: "uppercase",
//                   }}>
//                     {med.category || "General"}
//                   </span>
//                   <span style={{
//                     fontSize: "0.75rem",
//                     fontWeight: 600,
//                     color: med.stock > 0 ? "#10b981" : "#ef4444",
//                     background: med.stock > 0 ? "#d1fae5" : "#fee2e2",
//                     padding: "4px 8px",
//                     borderRadius: "6px",
//                   }}>
//                     {med.stock > 0 ? `${med.stock} in stock` : "Out of Stock"}
//                   </span>
//                 </div>

//                 <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e293b", margin: "0 0 0.5rem" }}>
//                   {med.name}
//                 </h3>

//                 <p style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.875rem", margin: "0 0 1rem" }}>
//                   <MapPin size={14} />
//                   <span>Available at local pharmacies</span>
//                 </p>
//               </div>

//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginTop: "1rem" }}>
//                 <div>
//                   <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Price</span>
//                   <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
//                     ₹{med.price}
//                   </p>
//                 </div>

//                 {med.stock > 0 ? (
//                   <Link
//                     to={`/pharmacy/${med._id}`}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "6px",
//                       background: "#0d9488",
//                       color: "#fff",
//                       textDecoration: "none",
//                       padding: "8px 16px",
//                       borderRadius: "8px",
//                       fontWeight: 600,
//                       fontSize: "0.875rem",
//                       transition: "background 0.2s",
//                     }}
//                   >
//                     Reserve
//                     <ArrowRight size={14} />
//                   </Link>
//                 ) : (
//                   <button
//                     disabled
//                     style={{
//                       background: "#cbd5e1",
//                       color: "#94a3b8",
//                       border: "none",
//                       padding: "8px 16px",
//                       borderRadius: "8px",
//                       fontWeight: 600,
//                       fontSize: "0.875rem",
//                       cursor: "not-allowed",
//                     }}
//                   >
//                     Unavailable
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMedicines } from "../Reducer/MedicineSlice";
import { 
  Search as SearchIcon, 
  MapPin, 
  Pill, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import "../assets/custom.css";

export default function Search() {
  const dispatch = useDispatch();
  const { medicines, loading } = useSelector((s) => s.medicine);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch on mount and whenever searchTerm/category changes
  useEffect(() => {
    const params = {};
    if (searchTerm.trim()) params.name = searchTerm.trim();
    if (selectedCategory !== "all") params.category = selectedCategory;
    dispatch(getAllMedicines(params));
  }, [dispatch, searchTerm, selectedCategory]);

  const categories = ["all", ...new Set(medicines.map((m) => m.category).filter(Boolean))];
  const filteredMedicines = medicines;

  // Helper function for discount percentage
  const calculateDiscount = (mrp, sellingPrice) => {
    if (!mrp || !sellingPrice || mrp <= sellingPrice) return 0;
    return Math.round(((mrp - sellingPrice) / mrp) * 100);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1280px", margin: "0 auto", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "3rem", marginTop: "1rem" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
          Find Your Medicines
        </h1>
        <p style={{ color: "#64748b", marginTop: "12px", fontSize: "1.125rem", maxWidth: "600px", margin: "12px auto 0" }}>
          Search across certified local pharmacies for instant reservation, authentic medicines, and quick pickup.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        background: "#ffffff",
        padding: "1.5rem",
        borderRadius: "20px",
        boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.01)",
        marginBottom: "3rem",
        border: "1px solid #f1f5f9"
      }}>
        <div style={{ position: "relative", flex: 1 }}>
          <SearchIcon style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} size={22} />
          <input
            type="text"
            placeholder="Search by medicine name, generic name, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field-input"
            style={{
              width: "100%",
              paddingLeft: "56px",
              height: "56px",
              fontSize: "1.05rem",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              outline: "none",
              transition: "all 0.2s ease"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#0d9488";
              e.target.style.backgroundColor = "#fff";
              e.target.style.boxShadow = "0 0 0 4px rgba(13, 148, 136, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.backgroundColor = "#f8fafc";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "8px 18px",
                borderRadius: "100px",
                border: selectedCategory === cat ? "1px solid #0d9488" : "1px solid #e2e8f0",
                background: selectedCategory === cat ? "#0d9488" : "#ffffff",
                color: selectedCategory === cat ? "#ffffff" : "#475569",
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "capitalize",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: selectedCategory === cat ? "0 4px 6px -1px rgba(13, 148, 136, 0.2)" : "none"
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat) {
                  e.target.style.background = "#f8fafc";
                  e.target.style.borderColor = "#cbd5e1";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat) {
                  e.target.style.background = "#ffffff";
                  e.target.style.borderColor = "#e2e8f0";
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem", width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #0d9488", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#64748b", fontWeight: 500 }}>Fetching latest catalog...</p>
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0", background: "#f8fafc", borderRadius: "24px", border: "1px dashed #cbd5e1" }}>
          <div style={{ background: "#e2e8f0", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <Pill size={40} style={{ color: "#64748b" }} />
          </div>
          <h3 style={{ fontSize: "1.5rem", color: "#0f172a", marginBottom: "0.5rem" }}>No medicines found</h3>
          <p style={{ color: "#64748b" }}>We couldn't find any medicine matching your search criteria.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "2rem",
        }}>
          {filteredMedicines.map((med) => {
            const discount = calculateDiscount(med.mrp, med.sellingPrice);
            const isOutOfStock = med.quantity === 0;
            const isLowStock = !isOutOfStock && med.quantity <= (med.lowStockThreshold || 5);

            return (
              <div
                key={med._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#ffffff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  position: "relative",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                {/* Image Placeholder / Thumbnail */}
                <div style={{ height: "160px", background: "#f8fafc", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #f1f5f9" }}>
                  {med.image?.url ? (
                    <img src={med.image.url} alt={med.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "1rem" }} />
                  ) : (
                    <Pill size={64} color="#cbd5e1" strokeWidth={1} />
                  )}
                  
                  {/* Prescription Badge */}
                  {med.requiresPrescription && (
                    <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(4px)", color: "#b91c1c", padding: "6px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                      <FileText size={14} />
                      Rx Required
                    </div>
                  )}

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div style={{ position: "absolute", top: "12px", left: "12px", background: "#ef4444", color: "#ffffff", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                      {discount}% OFF
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  
                  {/* Category & Dosage Form */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ color: "#0d9488", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", background: "#ccfbf1", padding: "4px 8px", borderRadius: "6px" }}>
                      {med.category}
                    </span>
                    <span style={{ color: "#64748b", fontSize: "0.8rem", textTransform: "capitalize", display: "flex", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#cbd5e1" }} />
                      {med.dosageForm}
                    </span>
                  </div>

                  {/* Title & Info */}
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: "0 0 4px", lineHeight: 1.3 }}>
                    {med.name} <span style={{ color: "#64748b", fontWeight: 500, fontSize: "1.1rem" }}>{med.strength}</span>
                  </h3>
                  
                  <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Building2 size={14} />
                    {med.manufacturer || med.genericName || "Generic Manufacturer"}
                  </p>

                  <div style={{ marginTop: "auto" }}>
                    {/* Stock Status Indicator */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px", fontSize: "0.875rem", fontWeight: 600 }}>
                      {isOutOfStock ? (
                        <><XCircle size={16} color="#ef4444" /><span style={{ color: "#ef4444" }}>Out of Stock</span></>
                      ) : isLowStock ? (
                        <><AlertTriangle size={16} color="#f59e0b" /><span style={{ color: "#f59e0b" }}>Only {med.quantity} left in stock</span></>
                      ) : (
                        <><CheckCircle2 size={16} color="#10b981" /><span style={{ color: "#10b981" }}>Available in stock</span></>
                      )}
                    </div>

                    {/* Price and Action Section */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                      <div>
                        {discount > 0 && (
                          <span style={{ fontSize: "0.85rem", color: "#94a3b8", textDecoration: "line-through", display: "block", marginBottom: "2px" }}>
                            ₹{med.mrp}
                          </span>
                        )}
                        <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "baseline" }}>
                          ₹{med.sellingPrice}
                          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b", marginLeft: "4px" }}>
                            /{med.unit === 'strips' ? 'strip' : med.unit}
                          </span>
                        </p>
                      </div>

                      {isOutOfStock ? (
                        <button disabled style={{ background: "#f1f5f9", color: "#94a3b8", border: "none", padding: "10px 16px", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", cursor: "not-allowed" }}>
                          Unavailable
                        </button>
                      ) : (
                        <Link
                          to={`/pharmacy/${med._id}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "#0f172a",
                            color: "#ffffff",
                            textDecoration: "none",
                            padding: "10px 18px",
                            borderRadius: "10px",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            transition: "background 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#0d9488"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#0f172a"}
                        >
                          Reserve <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
