import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/iccn.png";
import { API_BASE_URL } from "../config";
import uk from "../assets/uk.png"; // Import flag UK
import ina from "../assets/ina.png"; // Import flag Indonesia

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [language, setLanguage] = useState("id"); // 'id' atau 'en'
    const [isTranslating, setIsTranslating] = useState(false);
    const navigate = useNavigate();

    // Fungsi untuk memeriksa status login
    const checkLoginStatus = () => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token && role) {
            setIsLoggedIn(true);
            setUserRole(role);
        } else {
            setIsLoggedIn(false);
            setUserRole(null);
        }
    };

    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setUserRole(null);
        navigate("/login");
    };

    const toggleLanguage = () => {
        const newLang = language === 'id' ? 'en' : 'id';
        // Set cookie untuk terjemahan
        if (newLang === 'en') {
            document.cookie = `googtrans=/id/en; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/`;
        } else {
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
        setLanguage(newLang);
        window.location.reload();
    };

    useEffect(() => {
        // Cek cookie untuk menentukan bahasa awal
        const cookies = document.cookie.split(';');
        let lang = 'id';
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'googtrans') {
                lang = value === '/id/en' ? 'en' : 'id';
                break;
            }
        }
        setLanguage(lang);

        // Hapus script sebelumnya jika ada
        const existingScript = document.querySelector('script[src*="translate.google.com"]');
        if (existingScript) {
            existingScript.remove();
        }

        // Inisialisasi widget Google Translate
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'id',
                    includedLanguages: 'en,id',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                },
                'google_translate_element'
            );
        };

        const script = document.createElement('script');
        script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Gunakan useEffect untuk memeriksa status login saat komponen dimuat
    useEffect(() => {
        checkLoginStatus();
    }, []);

    // Tambahkan event listener untuk memantau perubahan di localStorage
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "token" || event.key === "role") {
                checkLoginStatus();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Fungsi untuk navigasi
    const handleNavigation = (path) => {
        if (isLoggedIn) {
            navigate(path);
        } else {
            navigate("/");
        }
    };

    // Fungsi untuk toggle menu mobile
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 shadow-lg">
            <div className="relative bg-gray-800 opacity-80 h-full">
                <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-tr from-gray-950 via-gray-800 to-gray-600 clip-path-trapezoid-reverse"></div>

                <nav className="w-full px-10 flex justify-between items-center p-4 relative z-50">
                    {/* Logo di sebelah kiri */}
                    <div className="z-20 flex items-center">
                        <button onClick={() => handleNavigation("/home")}>
                            <img src={Logo} alt="ICCN Logo" className="h-20 w-auto max-w-none" />
                        </button>
                    </div>

                    {/* Menu Tengah untuk Desktop */}
                    <ul className="hidden lg:flex flex-grow justify-center gap-10 font-semibold text-white z-20">
                        <li>
                            <button
                                onClick={() => handleNavigation(isLoggedIn ? "/home" : "/")}
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                            >
                                Home
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleNavigation(isLoggedIn ? "/home" : "/")}
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                            >
                                About
                            </button>
                        </li>
                        <li>
                            <Link
                                to="/services"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                            >
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/events"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                            >
                                Events
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={() => handleNavigation(isLoggedIn ? "/home" : "/")}
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                            >
                                Partnership
                            </button>
                        </li>
                        <li>
                            <Link
                                to="/team"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                            >
                                Our Team
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={() => handleNavigation(isLoggedIn ? "/home" : "/")}
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                            >
                                Contact
                            </button>
                        </li>
                        <li>
                            <Link
                                to="/gallery"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                            >
                                Gallery
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/berita"
                                className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                            >
                                Berita
                            </Link>
                        </li>
                    </ul>

                    {/* Bagian Kanan */}
                    <div className="flex items-center gap-4 z-20">
                        {/* Tombol Translate (Desktop) */}
                        <div className="hidden lg:block">
                            <button
                                onClick={toggleLanguage}
                                disabled={isTranslating}
                                className="text-white px-4 py-2 rounded-xl transition-all shadow-lg font-bold hover:scale-105 hover:shadow-md hover:bg-gradient-to-b from-orange-600 to-orange-400 duration-300 flex items-center gap-2 group"
                            >
                                {isTranslating ? (
                                    <div className="animate-spin h-6 w-6 flex items-center justify-center">
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative w-8 h-8 overflow-hidden rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
                                            <img
                                                src={language === "id" ? ina : uk}
                                                alt="Language Flag"
                                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                                            />
                                        </div>
                                        <span className="text-sm">
                                            {language === "id" ? "ID" : "EN"}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Tombol Translate (Mobile) */}
                        <div className="lg:hidden">
                            <button
                                onClick={toggleLanguage}
                                disabled={isTranslating}
                                className="text-white p-2 rounded-lg transition-all shadow-md font-bold hover:scale-105 hover:bg-gradient-to-b from-orange-600 to-orange-400 duration-300"
                            >
                                {isTranslating ? (
                                    <div className="animate-spin h-6 w-6 flex items-center justify-center">
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    </div>
                                ) : (
                                    <div className="relative w-6 h-6 overflow-hidden rounded-full">
                                        <img
                                            src={language === "id" ? ina : uk}
                                            alt="Language Flag"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Tombol Login/Logout Desktop */}
                        <div className="hidden lg:block">
                            {isLoggedIn && (userRole === "member" || userRole === "admin") ? (
                                <button
                                    onClick={handleLogout}
                                    className="text-white px-4 py-1 rounded-xl transition-all shadow-white shadow-md font-bold hover:scale-105 hover:shadow-sm hover:bg-gradient-to-b from-orange-600 to-orange-500 duration-200"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-white px-4 py-1 rounded-xl transition-all shadow-white shadow-md font-bold hover:scale-105 hover:shadow-sm hover:bg-gradient-to-b from-orange-600 to-orange-400 duration-200"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        {/* Burger Menu */}
                        <button
                            className="lg:hidden text-white"
                            onClick={toggleMenu}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                ></path>
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-800 py-4 z-20 w-full">
                            <ul className="flex flex-col items-center space-y-6 text-white">
                                <li>
                                    <button
                                        onClick={() => {
                                            handleNavigation(isLoggedIn ? "/home" : "/");
                                            toggleMenu();
                                        }}
                                        className="px-4 py-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                                    >
                                        Home
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            handleNavigation(isLoggedIn ? "/home" : "/");
                                            toggleMenu();
                                        }}
                                        className="px-4 py-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                                    >
                                        About
                                    </button>
                                </li>
                                <li>
                                    <Link
                                        to="/services"
                                        onClick={toggleMenu}
                                        className="px-4 py-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                                    >
                                        Services
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/events"
                                        onClick={toggleMenu}
                                        className="px-4 py-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                                    >
                                        Events
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            handleNavigation(isLoggedIn ? "/home" : "/");
                                            toggleMenu();
                                        }}
                                        className="px-4 py-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                                    >
                                        Partnership
                                    </button>
                                </li>
                                <li>
                                    <Link
                                        to="/team"
                                        onClick={toggleMenu}
                                        className="px-4 py-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                                    >
                                        Our Team
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            handleNavigation(isLoggedIn ? "/home" : "/");
                                            toggleMenu();
                                        }}
                                        className="px-4 py-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                                    >
                                        Contact
                                    </button>
                                </li>
                                <li>
                                    <Link
                                        to="/gallery"
                                        onClick={toggleMenu}
                                        className="px-4 py-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                                    >
                                        Gallery
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/berita"
                                        onClick={toggleMenu}
                                        className="px-4 py-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200"
                                    >
                                        Berita
                                    </Link>
                                </li>
                                <li>
                                    {isLoggedIn ? (
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                toggleMenu();
                                            }}
                                            className="text-white px-6 py-2 rounded-xl transition-all shadow-white shadow-md font-bold hover:scale-105 hover:shadow-sm hover:bg-gradient-to-b from-orange-600 to-orange-500 duration-200"
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                navigate("/login");
                                                toggleMenu();
                                            }}
                                            className="text-white px-6 py-2 rounded-xl transition-all shadow-white shadow-md font-bold hover:scale-105 hover:shadow-sm hover:bg-gradient-to-b from-orange-600 to-orange-400 duration-200"
                                        >
                                            Sign In
                                        </button>
                                    )}
                                </li>
                            </ul>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;