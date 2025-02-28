import { HiOutlineLogout } from 'react-icons/hi';
import { HomeIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Header({ sidebarOpen, setSidebarOpen, activeMenu }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem("role");
        navigate('/login');
    };

    const handleHome = () => {
        navigate('/home');
    };

    return (
        <div className="flex items-center justify-between bg-white dark:bg-background-dark shadow-sm p-4">
            {/* Sidebar Toggle & Nama Menu */}
            <div className="flex items-center space-x-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <svg className="w-6 h-6 text-gray-800 dark:text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-text-dark">{activeMenu}</h2>
            </div>

            {/* Tombol Home, Theme Toggle, Logout */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleHome}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <HomeIcon className="w-6 h-6 text-gray-800 dark:text-text-dark" />
                </button>

                <ThemeToggle />

                <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <HiOutlineLogout className="w-6 h-6 text-gray-800 dark:text-text-dark" />
                </button>
            </div>
        </div>
    );
}
