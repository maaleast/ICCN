import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    // Contoh sederhana: Cek apakah pengguna adalah admin
    const isAdmin = localStorage.getItem('role') === 'admin';

    if (!isAdmin) {
        // Jika bukan admin, arahkan ke halaman login
        return <Navigate to="/login" replace />;
    }

    // Jika admin, tampilkan halaman yang diminta
    return children;
}