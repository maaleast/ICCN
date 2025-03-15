import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimes, FaLinkedin, FaTwitter, FaEnvelope, FaPhone } from "react-icons/fa";
import { API_BASE_URL } from "../config";
import Navbar from "../components/Navbar";

const PageTeam = () => {
    const [team, setTeam] = useState([]);
    const [filteredTeam, setFilteredTeam] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeDepartment, setActiveDepartment] = useState("All");
    const navigate = useNavigate();

    // Fetch data tim dari API
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/team`);
                const data = await response.json();
                setTeam(data);
                setFilteredTeam(data);
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };
        fetchTeam();
    }, []);

    // Fungsi untuk filter tim berdasarkan departemen
    const filterByDepartment = (department) => {
        setActiveDepartment(department);
        if (department === "All") {
            setFilteredTeam(team);
        } else {
            const filtered = team.filter(member => member.department === department);
            setFilteredTeam(filtered);
        }
    };

    // Fungsi untuk mencari anggota tim
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = team.filter(member =>
            member.name.toLowerCase().includes(query) ||
            member.position.toLowerCase().includes(query) ||
            member.department.toLowerCase().includes(query)
        );
        setFilteredTeam(filtered);
    };

    // Daftar departemen unik
    const departments = ["All", ...new Set(team.map(member => member.department))];

    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem("userData");
        localStorage.removeItem("isVerified");
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">
            <Navbar />

            <main className="pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
                        Tim Kami
                    </h1>

                    {/* Filter dan Search */}
                    <div className="mb-8 flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Cari anggota tim..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={activeDepartment}
                            onChange={(e) => filterByDepartment(e.target.value)}
                            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {departments.map((dept, index) => (
                                <option key={index} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Daftar Tim */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredTeam.map((member, index) => (
                            <motion.div
                                key={member._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors cursor-pointer"
                                onClick={() => setSelectedMember(member)}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        src={`${API_BASE_URL}${member.photo}`}
                                        alt={member.name}
                                        className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white"
                                    />
                                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                    <p className="text-gray-200 text-sm mb-2">{member.position}</p>
                                    <p className="text-gray-200 text-sm mb-4">{member.department}</p>
                                    <div className="flex space-x-4">
                                        {member.socialMedia?.linkedin && (
                                            <a
                                                href={member.socialMedia.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-600"
                                            >
                                                <FaLinkedin className="w-6 h-6" />
                                            </a>
                                        )}
                                        {member.socialMedia?.twitter && (
                                            <a
                                                href={member.socialMedia.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-600"
                                            >
                                                <FaTwitter className="w-6 h-6" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Modal Detail Anggota Tim */}
            {selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full relative p-8">
                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                            onClick={() => setSelectedMember(null)}
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <img
                                src={`${API_BASE_URL}${selectedMember.photo}`}
                                alt={selectedMember.name}
                                className="w-48 h-48 rounded-full object-cover mb-6 border-4 border-blue-100"
                            />
                            <h2 className="text-2xl font-bold text-blue-900 mb-2">
                                {selectedMember.name}
                            </h2>
                            <p className="text-gray-600 font-medium mb-4">
                                {selectedMember.position}
                            </p>
                            <div className="prose text-left">
                                <p className="text-gray-700 mb-4">
                                    {selectedMember.bio}
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <FaEnvelope className="inline-block mr-2" />
                                        {selectedMember.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <FaPhone className="inline-block mr-2" />
                                        {selectedMember.phone}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Department:</span> {selectedMember.department}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-4 mt-6">
                                {selectedMember.socialMedia?.linkedin && (
                                    <a
                                        href={selectedMember.socialMedia.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <FaLinkedin className="w-8 h-8" />
                                    </a>
                                )}
                                {selectedMember.socialMedia?.twitter && (
                                    <a
                                        href={selectedMember.socialMedia.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-600"
                                    >
                                        <FaTwitter className="w-8 h-8" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageTeam;