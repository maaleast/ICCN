import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPanel from "./pages/AdminPanel";
import LandingPage from "./pages/LandingPage";
import LoggedInPage from "./pages/LoggedInPage";
import Login from "./pages/Login";
import MemberDashboard from "./pages/MemberDashboard";
import PageBerita from "./pages/PageBerita";
import PageEvents from './pages/PageEvents';
import PageGallery from "./pages/PageGallery";
import PageServices from './pages/PageServices';
import PageTeam from './pages/PageTeam';
import PerpanjangMember from "./pages/PerpanjangMember";
import Register from "./pages/Register";

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
        {/* Route untuk landing page tanpa proteksi */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<PageGallery />} />
        <Route path="/berita" element={<PageBerita />} />
        <Route path="/services" element={<PageServices />} />
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