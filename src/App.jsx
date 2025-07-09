import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import MemberDashboard from "./pages/MemberDashboard";
import LoggedInPage from "./pages/LoggedInPage";
import PageGallery from "./pages/PageGallery";
import PerpanjangMember from "./pages/PerpanjangMember";
import PageBerita from "./pages/PageBerita";
import PageServices from './pages/PageServices';
import PageEvents from './pages/PageEvents';
import PageTeam from './pages/PageTeam';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DetailWordServices from './pages/DetailWordServices';
import DetailWordEvents from "./pages/DetailWordEvents";


function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isVerified = parseInt(localStorage.getItem("is_verified"), 10);

  // if (!token) return <Navigate to="/login" replace />;
  // if (isVerified === 0) return <Navigate to="/login" replace />;
  // if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/home" replace />;

  console.log("ProtectedRoute - Token:", token); // Debugging
  console.log("ProtectedRoute - Role:", userRole); // Debugging
  console.log("ProtectedRoute - Allowed Roles:", allowedRoles); // Debugging

  // Jika tidak ada token atau belum terverifikasi, redirect ke /login
  if (!token || isVerified === 0) {
    console.log("Redirecting to /login"); // Debugging
    return <Navigate to="/login" replace />;
  }

  // Jika role tidak diizinkan, redirect ke /home
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log("Redirecting to /home"); // Debugging
    return <Navigate to="/home" replace />;
  }

  return children;
}


function RouteGuard({ children }) {
  const token = localStorage.getItem("token");

  // Jika sudah login, redirect ke /home
  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Route untuk landing page dengan proteksi */}
        <Route path="/" element={
          <RouteGuard>
            <LandingPage />
          </RouteGuard>
        } />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<PageGallery />} />
        <Route path="/berita" element={<PageBerita />} />
        <Route path="/services" element={<PageServices />} />
        <Route path="/services/detail/:id" element={<DetailWordServices />} />
        <Route path="/events/word/:id" element={<DetailWordEvents />} />
        <Route path="/events" element={<PageEvents />} />
        <Route path="/team" element={<PageTeam />} />

        <Route path="/perpanjang" element={
          <ProtectedRoute>
            <PerpanjangMember />
          </ProtectedRoute>
        } />

        <Route path="/home" element={
          <ProtectedRoute>
            <LoggedInPage />
          </ProtectedRoute>
        } />

        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRoles={["member", "admin"]}>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;