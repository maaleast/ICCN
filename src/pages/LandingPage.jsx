import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";
import { FaTimes } from "react-icons/fa"; // Import ikon Times
import Swal from "sweetalert2"; // Import SweetAlert2
import { Link as ScrollLink } from "react-scroll";
import aboutImage from "../assets/images.jpg";
import LandingBg from "../assets/LandingBg.jpg";
import { AnimatePresence } from "framer-motion";
import Logo from "../assets/iccn.png";

const LandingPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [gallery, setGallery] = useState([]);
    const [berita, setBerita] = useState([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBerita, setSelectedBerita] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null); // State untuk foto yang dipilih
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false); // State untuk modal gallery
    const [partners, setPartners] = useState([]);
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");
    const [selectedPartnerType, setSelectedPartnerType] = useState("All");
    const [services, setServices] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [team, setTeam] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    // Cek status login dan ambil data gallery
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem("authToken");
            const user = JSON.parse(localStorage.getItem("userData"));
            const verificationStatus = localStorage.getItem("isVerified");

            if (token && user) {
                setIsLoggedIn(true);
                setUserData(user);
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }

            setIsVerified(verificationStatus === "verified");
        };

        const fetchGallery = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/gallery`);
                const data = await response.json();
                setGallery(data);
            } catch (error) {
                console.error("Error fetching gallery data:", error);
            }
        };

        const fetchBerita = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/berita/all-berita`);
                const data = await response.json();
                if (data.success) {
                    // Filter berita yang hanya memiliki status 'latest' atau 'branding'
                    const filteredBerita = data.data.filter(
                        (item) => item.status === "latest" || item.status === "branding"
                    );
                    // Urutkan berita: 'branding' lebih diutamakan
                    const sortedBerita = filteredBerita.sort((a, b) => {
                        if (a.status === "branding" && b.status !== "branding") return -1;
                        if (a.status !== "branding" && b.status === "branding") return 1;
                        return 0;
                    });
                    setBerita(sortedBerita);
                }
            } catch (error) {
                console.error("Error fetching berita:", error);
            }
        };

        const fetchServices = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/services`);
                const data = await response.json();
                setServices(data); // Simpan data ke state
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/events`);
                const data = await response.json();
                setEvents(data); // Simpan data ke state
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        const fetchTeam = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/team`);
                const data = await response.json();
                setTeam(data); // Simpan data ke state
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };

        fetchTeam();
        fetchEvents();
        fetchServices(); // Panggil fungsi fetc
        checkLoginStatus();
        fetchGallery();
        fetchBerita();
        fetchPartners();
        window.addEventListener("storage", checkLoginStatus);

        return () => window.removeEventListener("storage", checkLoginStatus);
    }, []);

    const fetchPartners = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/partner/partners`);
            const data = await response.json();
            if (data.success) {
                setPartners(data.data);
            }
        } catch (error) {
            console.error("Error fetching partners data:", error);
        }
    };

    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem("userData");
        localStorage.removeItem("isVerified");
        navigate('/login');
    };

    // Fungsi untuk memeriksa status pendaftaran member berdasarkan role
    const handleGetStarted = async () => {
        navigate("/login");
    };

    // Handle tampilkan detail berita
    const handleShowDetail = (berita) => {
        setSelectedBerita(berita);
        setShowDetailModal(true);
    };

    // Fungsi untuk membuka modal gallery
    const openGalleryModal = (photo) => {
        setSelectedPhoto(photo);
        setIsGalleryModalOpen(true);
    };

    // Fungsi untuk menutup modal gallery
    const closeGalleryModal = () => {
        setSelectedPhoto(null);
        setIsGalleryModalOpen(false);
    };

    // Fungsi untuk memformat tanggal
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const filteredPartners = partners.filter(partner => {
        if (selectedPartnerType === "All") return true;
        return partner.type.toLowerCase() === selectedPartnerType.toLowerCase();
    });


    return (
        <div>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-10 shadow-lg">
                <div className="relative bg-gray-800 opacity-80 h-full">
                    <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-tr from-gray-950 via-gray-800 to-gray-600 clip-path-trapezoid-reverse"></div>

                    <nav className="w-full px-10 flex justify-between items-center p-4 relative">
                        <div className="z-20 flex items-center">
                            <button onClick={() => navigate("/home")}>
                                <img src={Logo} alt="ICCN Logo" className="h-20 w-auto max-w-none" />
                            </button>
                        </div>

                        <ul className="flex space-x-8 font-semibold text-white z-20">
                            <li>
                                <ScrollLink
                                    to="home"
                                    smooth={true}
                                    duration={500}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200 cursor-pointer"
                                >
                                    Home
                                </ScrollLink>
                            </li>
                            <li>
                                <ScrollLink
                                    to="about"
                                    smooth={true}
                                    duration={500}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200 cursor-pointer"
                                >
                                    About
                                </ScrollLink>
                            </li>
                            <li>
                                <ScrollLink
                                    to="services"
                                    smooth={true}
                                    duration={500}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200 cursor-pointer"
                                >
                                    Services
                                </ScrollLink>
                            </li>
                            <li>
                                <ScrollLink
                                    to="event"
                                    smooth={true}
                                    duration={500}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200 cursor-pointer"
                                >
                                    Event
                                </ScrollLink>
                            </li>
                            <li>
                                <ScrollLink
                                    to="partnership"
                                    smooth={true}
                                    duration={500}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200 cursor-pointer"
                                >
                                    Partnership
                                </ScrollLink>
                            </li>
                            <li>
                                <ScrollLink
                                    to="team"
                                    smooth={true}
                                    duration={500}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200 cursor-pointer"
                                >
                                    Our Team
                                </ScrollLink>
                            </li>
                            <li>
                                <ScrollLink
                                    to="contact"
                                    smooth={true}
                                    duration={500}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200 cursor-pointer"
                                >
                                    Contact
                                </ScrollLink>
                            </li>
                            <li>
                                <ScrollLink
                                    to="gallery"
                                    smooth={true}
                                    duration={500}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200 cursor-pointer"
                                >
                                    Gallery
                                </ScrollLink>
                            </li>
                            <li>
                                <ScrollLink
                                    to="berita"
                                    smooth={true}
                                    duration={500}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200 cursor-pointer"
                                >
                                    Berita
                                </ScrollLink>
                            </li>
                        </ul>

                        <div className="z-20 relative flex items-center space-x-6">
                            {isLoggedIn ? (
                                <button onClick={handleLogout} className="text-white px-4 py-1 rounded-xl transition-all shadow-white shadow-md font-bold hover:scale-105 hover:shadow-sm hover:shadow-white hover:shadow-opacity-30 hover:bg-gradient-to-b from-orange-600 to-orange-500 duration-200">
                                    Logout
                                </button>
                            ) : (
                                <button onClick={() => navigate("/login")} className="text-white px-4 py-1 rounded-xl transition-all shadow-white shadow-md font-bold hover:scale-105 hover:shadow-sm hover:shadow-white hover:shadow-opacity-30 hover:bg-gradient-to-b from-orange-600 to-orange-400 duration-200">
                                    Sign In
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <section
                    id="home"
                    className="flex flex-col items-center justify-center h-screen text-gray-800 bg-cover bg-center pt-48"
                    style={{ backgroundImage: `url(${LandingBg})` }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl text-white font-bold text-center"
                    >
                        Selamat Datang di Indonesia Career Center (ICCN)
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 text-lg text-center text-gray-100"
                    >
                        Langkah awal menuju karier impian Anda dimulai di sini! Temukan peluang, jelajahi layanan terbaik kami, dan raih masa depan yang lebih cerah mulai hari ini!
                    </motion.p>
                    <button
                        onClick={handleGetStarted}
                        className="mt-6 bg-gradient-to-r from-orange-600 to-orange-400 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 duration-200"
                    >
                        Jadi Member
                    </button>

                    <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="mt-64"
                    >
                        <ScrollLink
                            to="about"
                            smooth={true}
                            duration={500}
                            className="cursor-pointer"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-orange-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </motion.div>
                        </ScrollLink>
                    </motion.div>
                </section>

                <section id="about" className="py-12 bg-white mt-24 mb-24">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
                            Tentang ICCN
                        </h2>

                        {/* Baris pertama (Gambar kiri, teks kanan) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                            <motion.div
                                className="flex justify-center"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <img src={aboutImage} alt="About ICCN" className="rounded-lg shadow-lg w-full max-w-lg" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="font-bold mb-2">
                                    INDONESIA CAREER CENTER NETWORK, MENEPIS BATAS PRIMORDIALISME, MERAJUT SOLUSI PERMASALAHAN SDM NASIONAL.
                                </h3>
                                <p className="mb-4">
                                    Saat ini di Indonesia telah tumbuh dan berkembang pusat-pusat karir yang berada di sebuah institusi perguruan tinggi. Meski jumlahnya masih relatif sedikit, perkembangan pusat karir tampak semakin lama semakin baik.
                                </p>
                                <p className="mb-4">
                                    Di antara pusat karir tersebut, ada yang sudah mapan, cukup mapan, baru berdiri, atau bahkan baru direncanakan akan berdiri. Berawal dari gagasan untuk saling berkomunikasi, menjalin silaturahmi, saling memberi, mendukung, berbagi dan menguatkan, hingga suatu saat dapat membuat agenda bersama yang lebih konkrit dalam skala nasional, maka beberapa pertemuan telah digelar sejak di ITB untuk pertama kalinya pada tanggal 12 Desember 2015 (diikuti oleh 10 pusat karir), di ITS tanggal 14 Januari 2016 (20 pusat karir), dan di IPB tanggal 21 Januari 2016 (31 pusat karir), jejaring ini lahir, dibentuk dan disepakati dengan nama Indonesia Career Center Network (ICCN).
                                </p>
                            </motion.div>
                        </div>

                        {/* Baris kedua (Teks kiri, gambar kanan) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 items-center mt-12">
                            <motion.div
                                className="text-gray-700 md:order-1 order-2"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <p className="mb-4">
                                    Kehadiran jejaring ini menjadi wadah atau sarana berbagi pengetahuan, pengalaman, konsultasi dan mencari solusi permasalahan dalam mengelola pusat karir di perguruan tinggi. Dengan jejaring ini juga diharapkan adanya percepatan dalam peningkatan peran, layanan dan profesionalisme pengelolaan pusat karir yang disesuaikan dengan karakter perguruan tinggi masing-masing. Lebih dari itu, jejaring ini juga menjadi sebuah konsekuensi dan kebutuhan sekaligus harapan untuk dapat menjawab tantangan di masa depan yang dihadapi oleh pusat karir itu sendiri khususnya, dan SDM lulusan perguruan tinggi pada umumnya.
                                </p>
                                <p className="mb-4">
                                    Melalui jejaring ini diharapkan menjadi sarana bertemunya semua stakeholder yang berkaitan dengan SDM di Indonesia, baik dari unsur pemerintah di lintas kementerian, perguruan tinggi, perusahaan sebagai pengguna lulusan, berbagai asosiasi profesi, para mahasiswa dan alumni perguruan tinggi dan para pencari kerja itu sendiri. Tujuan akhirnya adalah peningkatan SDM di Indonesia.
                                </p>
                                <p className="mb-4">
                                    ICCN merupakan sebuah era baru dimana persaingan atau kompetisi antar-perguruan tinggi sudah selayaknya ditinggalkan, khususnya dalam lingkup peningkatan kualitas SDM/lulusannya. Upaya kerjasama dan saling menguatkan perlu dikedepankan untuk masa depan SDM Indonesia yang lebih baik dan berkualitas, menuju persaingan Masyarakat Ekonomi ASEAN (MEA).
                                </p>
                            </motion.div>

                            <motion.div
                                className="flex justify-center md:order-2 order-1"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <img src={aboutImage} alt="ICCN Network" className="rounded-lg shadow-lg w-full max-w-lg" />
                            </motion.div>
                        </div>
                    </div>
                </section>


                {/* Services Section */}
                <section id="services" className="py-12 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Our Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {services.slice(0, 2).map((service, index) => (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => setSelectedService(service)}
                                >
                                    <img
                                        src={`${API_BASE_URL}${service.image}`}
                                        alt={service.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{service.title}</h3>
                                        <p className="text-gray-700 line-clamp-3">{service.shortDescription}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {/* Tombol + untuk menuju PageServices */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-gray-400 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex items-center justify-center cursor-pointer"
                                onClick={() => navigate("/services")}
                            >
                                <div className="p-6 text-4xl font-bold text-white">+{services.length - 2}</div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Events Section */}
                <section id="events" className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Upcoming Events</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {events.slice(0, 2).map((event, index) => (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <img
                                        src={`${API_BASE_URL}${event.image}`}
                                        alt={event.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{event.title}</h3>
                                        <p className="text-gray-700 line-clamp-3">{event.description}</p>
                                        <p className="text-sm text-gray-500 mt-4">
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                            {/* Tombol + untuk menuju PageEvents */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-gray-400 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex items-center justify-center cursor-pointer"
                                onClick={() => navigate("/events")}
                            >
                                <div className="p-6 text-4xl font-bold text-white">+{events.length - 2}</div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <AnimatePresence>
                    {/* Partnership Section */}
                    <section id="partnership" className="py-12 bg-gray-100">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Our Partners</h2>

                            {/* Filter Navigation */}
                            <motion.div
                                className="flex justify-center mb-8 gap-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {['All', 'Local', 'Abroad', 'University'].map((type) => (
                                    <motion.button
                                        key={type}
                                        onClick={() => setSelectedPartnerType(type)}
                                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${selectedPartnerType === type
                                            ? 'bg-gradient-to-b from-orange-600 to-orange-400 text-white'
                                            : 'bg-white text-blue-900 hover:bg-orange-100'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {type}
                                    </motion.button>
                                ))}
                            </motion.div>

                            {/* Partner Logos Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                                {filteredPartners.map((partner, index) => (
                                    <motion.div
                                        key={partner._id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <img
                                            src={`${API_BASE_URL}${partner.logo}`}
                                            alt={partner.name}
                                            className="w-full h-24 object-contain object-center"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </AnimatePresence>

                {/* Team Section */}
                <section id="team" className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Our Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {team.slice(0, 3).map((member, index) => (
                                <motion.div
                                    key={member._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => setSelectedMember(member)}
                                >
                                    <img
                                        src={`${API_BASE_URL}${member.photo}`}
                                        alt={member.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{member.name}</h3>
                                        <p className="text-gray-700">{member.position}</p>
                                        <p className="text-sm text-gray-500 mt-4">{member.department}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {/* Tombol + untuk menuju PageTeam */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-gray-400 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex items-center justify-center cursor-pointer"
                                onClick={() => navigate("/team")}
                            >
                                <div className="p-6 text-4xl font-bold text-white">+{team.length - 3}</div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Berita Section */}
                <section id="berita" className="py-12 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Berita Terbaru</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {berita.slice(0, 4).map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => handleShowDetail(item)}
                                >
                                    {item.gambar && (
                                        <img
                                            src={`${API_BASE_URL}/uploads/berita/${item.gambar}`}
                                            alt={item.judul}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{item.judul}</h3>
                                        <p className="text-gray-700 line-clamp-3">{item.deskripsi}</p>
                                        <p className="text-sm text-gray-500 mt-4">
                                            {new Date(item.waktu_tayang).toLocaleDateString()}
                                        </p>
                                        {item.status === "branding" && (
                                            <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded-full text-xs mt-2">
                                                Hot!
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {/* Tombol + untuk menuju PageBerita */}
                            {berita.length > 4 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="bg-gray-400 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex items-center justify-center cursor-pointer"
                                    onClick={() => navigate("/page-berita")}
                                >
                                    <div className="p-6 text-4xl font-bold text-white">+{berita.length - 4}</div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section id="gallery" className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Foto Kegiatan ICCN</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {gallery.slice(0, 7).map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                    onClick={() => openGalleryModal(item)} // Buka modal saat gambar diklik
                                >
                                    <img
                                        src={item.image_url}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                    />
                                </motion.div>
                            ))}
                            {/* Tombol (+angka) untuk melihat lebih banyak */}
                            {gallery.length > 7 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-400 transition-shadow duration-300 flex items-center justify-center bg-gray-300 cursor-pointer"
                                    onClick={() => navigate("/gallery")}
                                >
                                    <div className="text-white text-2xl font-bold">
                                        +{gallery.length - 7}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Modal Gallery */}
                {isGalleryModalOpen && selectedPhoto && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 relative">
                            <button
                                className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
                                onClick={closeGalleryModal}
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                            <img
                                src={selectedPhoto.image_url}
                                alt={`Gallery Full`}
                                className="w-full h-auto rounded-lg"
                            />
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
                                Foto Kegiatan ICCN ({formatDate(selectedPhoto.created_at)})
                            </p>
                        </div>
                    </div>
                )}

                {/* Modal Detail Berita */}
                {showDetailModal && selectedBerita && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
                            <h3 className="text-2xl font-bold mb-4">{selectedBerita.judul}</h3>
                            {selectedBerita.gambar && (
                                <img
                                    src={`${API_BASE_URL}/uploads/berita/${selectedBerita.gambar}`}
                                    alt={selectedBerita.judul}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                            )}
                            <div className="max-h-96 overflow-y-auto">
                                <p className="text-sm text-gray-600 whitespace-pre-line">
                                    {selectedBerita.deskripsi}
                                </p>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">
                                {new Date(selectedBerita.waktu_tayang).toLocaleDateString()}
                            </p>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Section */}
                <section id="contact" className="py-12 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Contact Us</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Form Kontak */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Nama Lengkap"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Alamat Email"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Nomor Telepon"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Subjek Pesan"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <textarea
                                            placeholder="Isi Pesan"
                                            rows="4"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
                                    >
                                        Kirim Pesan
                                    </button>
                                </form>
                            </div>

                            {/* Peta dan Info Kontak */}
                            <div className="space-y-6">
                                <div className="bg-white p-4 rounded-lg shadow-md h-96">
                                    <iframe
                                        title="Lokasi ICCN"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.786478979469!2d107.6107393143171!3d-6.903890769347851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e64a2c5bfb7f%3A0xae3d92b5868c8c77!2sBandung%20City!5e0!3m2!1sen!2sid!4v1629876543210!5m2!1sen!2sid"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                    ></iframe>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-gray-700">
                                            Jl. Contoh Alamat No. 123<br />
                                            Kota Bandung, Jawa Barat<br />
                                            Indonesia 40123
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <p className="text-gray-700">+62 123 4567 890</p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-700">info@iccn.id</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;