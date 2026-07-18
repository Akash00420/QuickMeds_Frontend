import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Navbar          from "./pages/Navbar";
import Home            from "./pages/Home";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import Search          from "./pages/Search";
import PharmacyDetails from "./pages/PharmacyDetails";
import Reservations    from "./pages/Reservations";
import Emergency       from "./pages/Emergency";
import Profile         from "./pages/Profile";
import Vendor          from "./pages/Vendor";
import Dashboard       from "./pages/Dashboard";
import AdminPanel      from "./pages/AdminPanel";
import NotFound        from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import NotifyPanel    from "./components/NotifyPanel";

import { getAllNotifications } from "./Reducer/NotificationSlice";

// NOTE: adjust this key to whatever your Login.jsx actually stores the auth
// payload under (e.g. "quickmeds_token", "energy_token", etc.)
const AUTH_STORAGE_KEY = "quickmeds_token";

const getToken = () => {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored)?.token : null;
};

const getRole = () => {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored)?.role : null;
};

// Simple admin gate built on top of your ProtectedRoute component.
// Swap this out if you already have a dedicated AdminRoute.jsx.
const AdminGate = ({ children }) => {
  const token = getToken();
  const role = getRole();
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;
  return children;
};

const AppLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [notifyOpen, setNotifyOpen] = useState(false);
  const { notifications } = useSelector((s) => s.notification);

  const hideNavbarRoutes = ["/", "/login", "/register", "/admin", "/dashboard"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  const handleNotifyOpen = () => {
    dispatch(getAllNotifications()); // ensure notifications are fresh
    setNotifyOpen(true);
  };

  return (
    <>
      {!hideNavbar && <Navbar onNotifyOpen={handleNotifyOpen} />}

      <NotifyPanel
        notifications={notifications}
        open={notifyOpen}
        onClose={() => setNotifyOpen(false)}
      />

      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/search" element={
          <ProtectedRoute><Search /></ProtectedRoute>
        } />
        <Route path="/pharmacy/:id" element={
          <ProtectedRoute><PharmacyDetails /></ProtectedRoute>
        } />
        <Route path="/reservations" element={
          <ProtectedRoute><Reservations /></ProtectedRoute>
        } />
        <Route path="/emergency" element={
          <ProtectedRoute><Emergency /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/vendor" element={
          <ProtectedRoute><Vendor /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/admin" element={
          <AdminGate><AdminPanel /></AdminGate>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;