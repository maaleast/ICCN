import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import { Link as ScrollLink } from "react-scroll";
import about1 from "../assets/about.jpg";
import about2 from "../assets/about2.png";
import LandingBg from "../assets/LandingBg.jpg";
import Logo from "../assets/iccn.png";
import { FaArrowRight, FaMapMarkerAlt, FaPhone, FaEnvelope, FaTimes } from "react-icons/fa";
import uk from "../assets/uk.png";
import ina from "../assets/ina.png";

// Dummy data untuk semua section
const dummyServices = [
    {
        _id: 1,
        title: "Career Counseling",
        shortDescription: "Layanan konsultasi karir profesional untuk membantu pengambilan keputusan",
        image: "https://maukuliah.ap-south-1.linodeobjects.com/job/1701409908-ii2tk3e4w9.jpeg"
    },
    {
        _id: 2,
        title: "Workshop Development",
        shortDescription: "Pelatihan pengembangan keterampilan profesional",
        image: "https://executivevc.unl.edu/sites/unl.edu.executive-vice-chancellor/files/media/image/development-workshops-header.jpg"
    },
    {
        _id: 3,
        title: "Workshop Development",
        shortDescription: "Pelatihan pengembangan keterampilan profesional",
        image: "https://executivevc.unl.edu/sites/unl.edu.executive-vice-chancellor/files/media/image/development-workshops-header.jpg"
    }
];

const dummyEvents = [
    {
        _id: 1,
        title: "PAMERAN KARIER VIRTUAL INDONESIA",
        date: "2024-03-15",
        description: "Salam kenal, dari kami Indonesia Career Center Network (ICCN). ICCN merupakan sebuah asosiasi profesi pengelola pusat karier perguruan tinggi Indonesia. ICCN memiliki tujuan untuk meningkatkan daya saing sumber daya manusia Indonesia melalui standarisasi pelayanan pusat karier perguruan tinggi.",
        image: "https://indonesiacareercenter.id/wp-content/uploads/2023/06/05.png"
    },
    {
        _id: 1,
        title: "Pelatihan CCOP JAWA TIMUR",
        date: "2024-03-15",
        description: "Pelatihan CCOP Yang diselenggarakan di Jawa Timur ",
        image: "https://indonesiacareercenter.id/wp-content/uploads/2023/05/IMG_1470-1-scaled.jpg"
    },
    {
        _id: 1,
        title: "Job Fair Nasional 2024",
        date: "2024-03-15",
        description: "Pameran pekerjaan terbesar tahun ini",
        image: "src/assets/events-1.jpg"
    }
];

const partners = [
    {
        _id: 1,
        name: "Google",
        type: "Abroad",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
        _id: 2,
        name: "Microsoft",
        type: "Abroad",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
        _id: 3,
        name: "Institut Teknologi Bandung",
        type: "University",
        logo: "https://upload.wikimedia.org/wikipedia/id/9/95/Logo_Institut_Teknologi_Bandung.png",
    },
    {
        _id: 4,
        name: "Apple",
        type: "Abroad",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
        _id: 5,
        name: "Universitas Pancasila",
        type: "University",
        logo: "https://upload.wikimedia.org/wikipedia/id/4/46/Logo_Universitas_Pancasila.png",
    },
    {
        _id: 6,
        name: "Amazon",
        type: "Abroad",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
        _id: 7,
        name: "Udinus",
        type: "University",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logo_udinus1.jpg/1200px-Logo_udinus1.jpg",
    },
    {
        _id: 8,
        name: "Telkom Indonesia",
        type: "Local",
        logo: "https://jobtrenurtika.wordpress.com/wp-content/uploads/2015/07/logo-telkom-indonesia-transparent-background.png",
    },
    {
        _id: 9,
        name: "Djarum",
        type: "Local",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFjilzQnXXBYbl2Fx2B-lykZU4m_ZWfWwqqw&s",
    },
    {
        _id: 10,
        name: "Gojek",
        type: "Local",
        logo: "https://solusiprinting.com/wp-content/uploads/2020/08/Logo-Gojek-1280px-x-720px-1024x576.jpg",
    },
];

const teamMembers = [
    {
        id: 1,
        name: "Teddy Indira Budiwan, S.Psi., MM",
        position: "Presiden ICCN",
        asal: "Binus",
        photo: "https://indonesiacareercenter.id/wp-content/uploads/2024/06/teddy-removebg-preview-295x300.png",
    },
    {
        id: 2,
        name: "Dr. Rosaria Mita Amalia, M.Hum.",
        position: "Wakil Presiden ICCN",
        asal: "Universitas Padjadjaran",
        photo: "https://indonesiacareercenter.id/wp-content/uploads/2022/09/WhatsApp-Image-2022-09-21-at-12.36.51-e1663803429823-256x256.jpeg",
    },
    {
        id: 3,
        name: "Prof. Dr. Elly Munadziroh , drg. MS",
        position: "Sekretaris Jendral ICCN",
        asal: "Universitas Airlangga",
        photo: "https://indonesiacareercenter.id/wp-content/uploads/2022/09/WhatsApp-Image-2022-09-20-at-12.29.34-278x278.jpeg",
    },
];

const dummyBerita = [
    {
        id: 1,
        judul: "Menaker: Aset Indonesia Harus Bertransformasi pada Sumber Daya Manusianya",
        deskripsi: "Menteri Tenaga Kerja Republik Indonesia, Hanif Dhakiri mengatakan bahwa sumber daya manusia di Indonesia merupakan aset yang berharga bagi negeri, jauh nilainya dibandingkan SDM negara lain di ASEAN.",
        gambar: "https://indonesiacareercenter.id/wp-content/uploads/2021/11/6-2-1024x683.jpg",
        waktu_tayang: "2024-02-20",
        status: "branding"
    },
    {
        id: 2,
        judul: "Jalin Kerja Sama guna Kemajuan Bersama",
        deskripsi: "Telah berlangsung seremonial penandatanganan kerja sama antara Indonesian Career Centre Network (ICCN) dengan Himpunan Psikologi Indonesia (HIMPSI)  pada Sabtu (10/4/21). Penandatanganan dilakukan oleh Presiden ICCN, Teddy Indira Budiwan dengan Ketua Umum HIMPSI, Seger Handoyo.",
        gambar: "https://indonesiacareercenter.id/wp-content/uploads/2022/05/Dark-Blue-Aesthetic-Business-Plan-Cover-Page-Presentasi-169-1.png",
        waktu_tayang: "2024-02-20",
        status: "branding"
    },
    {
        id: 3,
        judul: "Menaker: Aset Indonesia Harus Bertransformasi pada Sumber Daya Manusianya",
        deskripsi: "Menteri Tenaga Kerja Republik Indonesia, Hanif Dhakiri mengatakan bahwa sumber daya manusia di Indonesia merupakan aset yang berharga bagi negeri, jauh nilainya dibandingkan SDM negara lain di ASEAN.",
        gambar: "https://indonesiacareercenter.id/wp-content/uploads/2021/11/6-2-1024x683.jpg",
        waktu_tayang: "2024-02-20",
        status: "branding"
    },
];

const dummyGallery = [
    { image_url: "https://indonesiacareercenter.id/wp-content/uploads/2022/06/WhatsApp-Image-2021-03-20-at-10.32.25-1.jpeg", created_at: "2024-02-01" },
    { image_url: "https://indonesiacareercenter.id/wp-content/uploads/2023/05/IMG_1470-1-scaled.jpg", created_at: "2024-02-01" },
    { image_url: "https://indonesiacareercenter.id/wp-content/uploads/2021/11/XiMCvhPwidiH1Vmw4WXJKc5wP8WVVcn4ZkV364hWF2f503mqLIV3MIxkngqRqRo1lOeWJdflfRp78EjTIgs1600.png", created_at: "2024-02-02" }
];

const LandingPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [gallery, setGallery] = useState([]);
    const [berita, setBerita] = useState([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBerita, setSelectedBerita] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const navigate = useNavigate();
    const [selectedPartnerType, setSelectedPartnerType] = useState("All");
    const [services, setServices] = useState([]);
    const [events, setEvents] = useState([]);
    const [team, setTeam] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const googleTranslateElementRef = useRef(null);
    const [language, setLanguage] = useState("id"); // 'id' atau 'en'
    const [isTranslating, setIsTranslating] = useState(false);

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
                    const filteredBerita = data.data.filter(
                        (item) => item.status === "latest" || item.status === "branding"
                    );
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
                setServices(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/events`);
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        const fetchTeam = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/team`);
                const data = await response.json();
                setTeam(data);
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };

        fetchTeam();
        fetchEvents();
        fetchServices();
        checkLoginStatus();
        fetchGallery();
        fetchBerita();
        window.addEventListener("storage", checkLoginStatus);

        return () => window.removeEventListener("storage", checkLoginStatus);
    }, []);

    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
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

    const filteredPartners = partners.filter((partner) => {
        if (selectedPartnerType === "All") return true;
        return partner.type.toLowerCase() === selectedPartnerType.toLowerCase();
    });

    // Fungsi untuk toggle menu burger
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
    return (
        <div>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-10 shadow-lg">
                <div className="relative bg-gray-800 opacity-80 h-full">
                    <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-tr from-gray-950 via-gray-800 to-gray-600 clip-path-trapezoid-reverse"></div>

                    <nav className="w-full px-4 lg:px-10 flex justify-between items-center p-4 relative">
                        {/* Logo */}
                        <div className="z-20 flex items-center">
                            <button onClick={() => navigate("/home")}>
                                <img src={Logo} alt="ICCN Logo" className="h-16 lg:h-20 w-auto max-w-none" />
                            </button>
                        </div>

                        {/* Bagian Kanan (Mobile) */}
                        <div className="lg:hidden flex items-center space-x-4">
                            {/* Hapus div wrapper yang tidak perlu */}
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
                                        <span className="hidden md:inline-block text-sm">
                                            {language === "id" ? "ID" : "EN"}
                                        </span>
                                    </>
                                )}
                            </button>
                            {/* Tombol Burger */}
                            <button
                                className="text-white"
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
                        {/* Menu Desktop */}
                        <ul className="hidden lg:flex space-x-8 font-semibold text-white z-20">
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
                                    to="berita"
                                    smooth={true}
                                    duration={500}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200 cursor-pointer"
                                >
                                    Berita
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
                                    to="contact"
                                    smooth={true}
                                    duration={500}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-orange-600 to-orange-400 hover:scale-105 rounded-md duration-200 cursor-pointer"
                                >
                                    Contact
                                </ScrollLink>
                            </li>
                        </ul>

                        {/* Bagian Kanan (Desktop) */}
                        <div className="hidden lg:flex items-center space-x-6">
                            {/* Tombol Translate */}
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
                                        <span className="hidden md:inline-block text-sm">
                                            {language === "id" ? "ID" : "EN"}
                                        </span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => navigate("/login")}
                                className="text-white px-4 py-1 rounded-xl transition-all shadow-white shadow-md font-bold hover:scale-105 hover:shadow-sm hover:shadow-white hover:shadow-opacity-30 hover:bg-gradient-to-b from-orange-600 to-orange-400 duration-200"
                            >
                                Sign In
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Menu Dropdown */}
                    {isMenuOpen && (
                        <div className="lg:hidden absolute top-16 left-0 right-0 bg-gray-800 w-full flex flex-col items-center space-y-4 py-4 z-20">
                            <ul className="w-full space-y-4">
                                <li>
                                    <ScrollLink
                                        to="home"
                                        smooth={true}
                                        duration={500}
                                        onClick={toggleMenu}
                                        className="block px-4 py-2 text-white hover:bg-orange-600 text-center"
                                    >
                                        Home
                                    </ScrollLink>
                                </li>
                                <li>
                                    <ScrollLink
                                        to="about"
                                        smooth={true}
                                        duration={500}
                                        onClick={toggleMenu}
                                        className="block px-4 py-2 text-white hover:bg-orange-600 text-center"
                                    >
                                        About
                                    </ScrollLink>
                                </li>
                                <li>
                                    <ScrollLink
                                        to="services"
                                        smooth={true}
                                        duration={500}
                                        onClick={toggleMenu}
                                        className="block px-4 py-2 text-white hover:bg-orange-600 text-center"
                                    >
                                        Services
                                    </ScrollLink>
                                </li>
                                <li>
                                    <ScrollLink
                                        to="event"
                                        smooth={true}
                                        duration={500}
                                        onClick={toggleMenu}
                                        className="block px-4 py-2 text-white hover:bg-orange-600 text-center"
                                    >
                                        Event
                                    </ScrollLink>
                                </li>
                                <li>
                                    <ScrollLink
                                        to="partnership"
                                        smooth={true}
                                        duration={500}
                                        onClick={toggleMenu}
                                        className="block px-4 py-2 text-white hover:bg-orange-600 text-center"
                                    >
                                        Partnership
                                    </ScrollLink>
                                </li>
                                <li>
                                    <ScrollLink
                                        to="team"
                                        smooth={true}
                                        duration={500}
                                        onClick={toggleMenu}
                                        className="block px-4 py-2 text-white hover:bg-orange-600 text-center"
                                    >
                                        Our Team
                                    </ScrollLink>
                                </li>
                                <li>
                                    <ScrollLink
                                        to="berita"
                                        smooth={true}
                                        duration={500}
                                        onClick={toggleMenu}
                                        className="block px-4 py-2 text-white hover:bg-orange-600 text-center"
                                    >
                                        Berita
                                    </ScrollLink>
                                </li>
                                <li>
                                    <ScrollLink
                                        to="gallery"
                                        smooth={true}
                                        duration={500}
                                        onClick={toggleMenu}
                                        className="block px-4 py-2 text-white hover:bg-orange-600 text-center"
                                    >
                                        Gallery
                                    </ScrollLink>
                                </li>
                                <li>
                                    <ScrollLink
                                        to="contact"
                                        smooth={true}
                                        duration={500}
                                        onClick={toggleMenu}
                                        className="block px-4 py-2 text-white hover:bg-orange-600 text-center"
                                    >
                                        Contact
                                    </ScrollLink>
                                </li>
                            </ul>

                            {/* Tombol Sign In/Logout Mobile */}
                            <div className="w-full px-4">
                                {isLoggedIn ? (
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            toggleMenu();
                                        }}
                                        className="w-full text-white px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 transition duration-300"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            navigate("/login");
                                            toggleMenu();
                                        }}
                                        className="w-full text-white px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 transition duration-300"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header >

            {/* Main Content */}
            <div main >
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

                    {/* Scroll indicator */}
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
                                <img src={about1} alt="About ICCN" className="rounded-lg shadow-lg w-full max-w-lg" />
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
                                <img src={about2} alt="ICCN Network" className="rounded-lg shadow-lg w-full max-w-lg" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-12 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Our Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {dummyServices.slice(0, 2).map((service, index) => (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                >
                                    <img
                                        src={service.image} // Menggunakan path dari dummy data
                                        alt={service.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{service.title}</h3>
                                        <p className="text-gray-700 line-clamp-3">{service.shortDescription}</p>
                                    </div>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-gray-400 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex items-center justify-center cursor-pointer"
                                onClick={() => navigate("/services")}
                            >
                                <div className="p-6 text-4xl font-bold text-white">+{dummyServices.length - 2}</div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Events Section */}
                <section id="event" className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Events</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {dummyEvents.slice(0, 2).map((event, index) => (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                >
                                    <img
                                        src={event.image}
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
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-gray-400 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex items-center justify-center cursor-pointer"
                                onClick={() => navigate("/events")}
                            >
                                <div className="p-6 text-4xl font-bold text-white">+{dummyEvents.length - 2}</div>
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
                                {["All", "Local", "Abroad", "University"].map((type) => (
                                    <motion.button
                                        key={type}
                                        onClick={() => setSelectedPartnerType(type)}
                                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${selectedPartnerType === type
                                            ? "bg-gradient-to-b from-orange-600 to-orange-400 text-white"
                                            : "bg-white text-blue-900 hover:bg-orange-100"
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
                                            src={partner.logo}
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
                        {/* Judul dan Subjudul */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-blue-900 uppercase">TEAM</h2>
                            <p className="text-lg text-gray-600 mt-2">CHECK OUR TEAM</p>
                        </div>

                        {/* Grid untuk Card Team */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {teamMembers.slice(0, 3).map((member) => (
                                <div
                                    key={member.id}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 text-center"
                                >
                                    {/* Foto Anggota Tim */}
                                    <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                                        <img
                                            src={member.photo}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Nama Anggota Tim */}
                                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                                        {member.name}
                                    </h3>

                                    {/* Posisi/Jabatan */}
                                    <p className="font-bold">{member.position}</p>
                                    <p className="text-gray-700">{member.asal}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tombol More dan Panah */}
                        <div className="flex justify-center mt-12 space-x-4">
                            <button
                                onClick={() => navigate("/team")} // Navigasi ke /team saat tombol diklik
                                className="flex items-center px-6 py-3 bg-blue-900 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
                            >
                                <span>More</span>
                                <svg
                                    className="w-6 h-6 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Berita Section */}
                <section id="berita" className="py-12 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Berita Terbaru</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {dummyBerita.slice(0, 2).map((berita, index) => (
                                <motion.div
                                    key={berita.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                >
                                    <img
                                        src={berita.gambar}
                                        alt={berita.judul}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{berita.judul}</h3>
                                        <p className="text-gray-700 line-clamp-3">{berita.deskripsi}</p>
                                    </div>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-gray-400 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex items-center justify-center cursor-pointer"
                                onClick={() => navigate("/berita")}
                            >
                                <div className="p-6 text-4xl font-bold text-white">+{dummyBerita.length - 2}</div>
                            </motion.div>
                        </div>
                    </div>
                </section>


                {/* Gallery Section */}
                <section id="gallery" className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Foto Kegiatan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {dummyGallery.slice(0, 2).map((gallery, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                >
                                    <img
                                        src={gallery.image_url}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                    />
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-gray-400 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex items-center justify-center cursor-pointer"
                                onClick={() => navigate("/gallery")}
                            >
                                <div className="p-6 text-4xl font-bold text-white">+{dummyGallery.length - 2}</div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Modal Gallery */}
                {
                    isGalleryModalOpen && selectedPhoto && (
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
                    )
                }

                {/* Modal Detail Berita */}
                {
                    showDetailModal && selectedBerita && (
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
                    )
                }

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

                {/* Footer Section */}
                <footer className="bg-gray-800 text-white py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* About Section */}
                            <div className="space-y-4">
                                <h4 className="text-xl font-bold">About ICCN</h4>
                                <p className="text-gray-400">
                                    Indonesia Career Center Network (ICCN) adalah jejaring pusat karir yang bertujuan untuk meningkatkan kualitas SDM Indonesia.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-white">
                                        <i className="bi bi-twitter-x"></i>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white">
                                        <i className="bi bi-facebook"></i>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white">
                                        <i className="bi bi-instagram"></i>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white">
                                        <i className="bi bi-linkedin"></i>
                                    </a>
                                </div>
                            </div>

                            {/* Useful Links Section */}
                            <div className="space-y-4">
                                <h4 className="text-xl font-bold">Useful Links</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <ScrollLink
                                            to="home"
                                            smooth={true}
                                            duration={500}
                                            className="flex items-center text-gray-400 hover:text-white cursor-pointer"
                                        >
                                            <FaArrowRight className="mr-2 text-orange-500" />
                                            <span>Home</span>
                                        </ScrollLink>
                                    </li>
                                    <li>
                                        <ScrollLink
                                            to="about"
                                            smooth={true}
                                            duration={500}
                                            className="flex items-center text-gray-400 hover:text-white cursor-pointer"
                                        >
                                            <FaArrowRight className="mr-2 text-orange-500" />
                                            <span>About</span>
                                        </ScrollLink>
                                    </li>
                                    <li>
                                        <ScrollLink
                                            to="services"
                                            smooth={true}
                                            duration={500}
                                            className="flex items-center text-gray-400 hover:text-white cursor-pointer"
                                        >
                                            <FaArrowRight className="mr-2 text-orange-500" />
                                            <span>Services</span>
                                        </ScrollLink>
                                    </li>
                                    <li>
                                        <ScrollLink
                                            to="event"
                                            smooth={true}
                                            duration={500}
                                            className="flex items-center text-gray-400 hover:text-white cursor-pointer"
                                        >
                                            <FaArrowRight className="mr-2 text-orange-500" />
                                            <span>Event</span>
                                        </ScrollLink>
                                    </li>
                                    <li>
                                        <ScrollLink
                                            to="partnership"
                                            smooth={true}
                                            duration={500}
                                            className="flex items-center text-gray-400 hover:text-white cursor-pointer"
                                        >
                                            <FaArrowRight className="mr-2 text-orange-500" />
                                            <span>Partnership</span>
                                        </ScrollLink>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact Info Section */}
                            <div className="space-y-4">
                                <h4 className="text-xl font-bold">Contact Info</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <FaMapMarkerAlt className="text-orange-400 text-xl" />
                                        <p className="text-gray-400">
                                            Jl. Contoh Alamat No. 123<br />
                                            Kota Bandung, Jawa Barat<br />
                                            Indonesia 40123
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <FaPhone className="text-orange-400 text-xl" />
                                        <p className="text-gray-400">+62 123 4567 890</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <FaEnvelope className="text-orange-400 text-xl" />
                                        <p className="text-gray-400">info@iccn.id</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Copyright Section */}
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                            <p className="text-gray-400">
                                © Copyright <strong className="text-white">ICCN</strong>. All Rights Reserved
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
            <div id="google_translate_element" style={{
                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
                opacity: 0,
                zIndex: -1
            }}></div>
        </div >
    );
};
export default LandingPage;