import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import MemberDashboard from "./pages/MemberDashboard";
import MembershipRegistration from "./pages/MembershipRegistration";
import LoggedInPage from "./pages/LoggedInPage";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isVerified = parseInt(localStorage.getItem("is_verified"), 10);

  if (!token) return <Navigate to="/login" replace />;
  if (isVerified === 0) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/home" replace />;

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />


        <Route path="/membership-registration" element={
          <ProtectedRoute>
            <MembershipRegistration />
          </ProtectedRoute>
        } />

        <Route path="/home" element={
          <ProtectedRoute>
            <LoggedInPage />
          </ProtectedRoute>
        } />

        <Route path="/member" element={
          <ProtectedRoute allowedRoles={["member", "admin"]}>
            <MemberDashboard />
          </ProtectedRoute>
        } />


        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
