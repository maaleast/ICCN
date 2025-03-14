import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ScrollLink } from "react-scroll";
import Logo from "../assets/iccn.png";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk status login
    const navigate = useNavigate();

    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem("userData");
        localStorage.removeItem("isVerified");
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-10 shadow-lg">
            <div className="relative bg-white opacity-80 h-full">
                <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 clip-path-trapezoid-reverse"></div>

                <nav className="w-full px-10 flex justify-between items-center p-4 relative">
                    <div className="z-20 flex items-center">
                        <button onClick={() => navigate("/home")}>
                            <img src={Logo} alt="ICCN Logo" className="h-20 w-auto max-w-none" />
                        </button>
                    </div>

                    <ul className="flex space-x-8 font-semibold text-gray-700 z-20">
                        <li>
                            <Link
                                to="/home"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200 cursor-pointer"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200 cursor-pointer"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/services"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200 cursor-pointer"
                            >
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/events"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200 cursor-pointer"
                            >
                                Events
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/team"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200 cursor-pointer"
                            >
                                Our Team
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/gallery"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200 cursor-pointer"
                            >
                                Gallery
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/berita"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200 cursor-pointer"
                            >
                                Berita
                            </Link>
                        </li>
                    </ul>

                    <div className="z-20 relative flex items-center space-x-6">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-b from-blue-600 to-blue-500 text-white px-4 py-1 rounded-xl transition-all shadow-white shadow-md font-bold hover:scale-105 hover:shadow-sm hover:shadow-white hover:shadow-opacity-30 hover:from-blue-700 hover:to-blue-600 duration-200"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-gradient-to-b from-blue-600 to-blue-500 text-white px-4 py-1 rounded-xl transition-all shadow-white shadow-md font-bold hover:scale-105 hover:shadow-sm hover:shadow-white hover:shadow-opacity-30 hover:from-blue-700 hover:to-blue-600 duration-200"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;