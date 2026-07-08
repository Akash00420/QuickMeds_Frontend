import { Navigate } from "react-router-dom";

const AUTH_STORAGE_KEY = "quickmeds_token";
const ALT_AUTH_STORAGE_KEY = "energy_token";

export default function ProtectedRoute({ children }) {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(ALT_AUTH_STORAGE_KEY);
  const token = stored ? JSON.parse(stored)?.token : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
