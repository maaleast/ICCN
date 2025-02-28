import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <header className="relative top-0 left-0 right-0 z-10 shadow-lg">
            <div className="relative bg-white opacity-80 h-full">
                {/* Purple Design Section (Di Sebelah Kanan) */}
                <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 clip-path-trapezoid-reverse"></div>

                {/* Nav Content */}
                <nav className="w-full px-10 flex justify-between items-center p-4 relative">
                    {/* Logo */}
                    <div className="text-4xl font-bold text-blue-700 z-20">
                        <button onClick={() => navigate("/")} >ICCN</button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
