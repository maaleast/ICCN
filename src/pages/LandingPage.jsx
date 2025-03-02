import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll"; // Import ScrollLink dari react-scroll
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";

const LandingPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [gallery, setGallery] = useState([]);
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");

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

        checkLoginStatus();
        fetchGallery();
        window.addEventListener("storage", checkLoginStatus);

        return () => window.removeEventListener("storage", checkLoginStatus);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem("userData");
        localStorage.removeItem("isVerified");
        navigate('/login');
    };

    const handleGetStarted = () => {
        navigate("/login");
    };

    return (
        <div className="bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-10 shadow-lg">
                <div className="relative bg-white opacity-80 h-full">
                    <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 clip-path-trapezoid-reverse"></div>

                    <nav className="w-full px-10 flex justify-between items-center p-4 relative">
                        <div className="text-4xl font-bold text-blue-700 z-20">ICCN</div>

                        <ul className="flex space-x-8 font-semibold text-gray-700 z-20">
                            <li>
                                <button onClick={() => navigate("/home")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Home
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/services")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Layanan
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/contact")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Hubungi Kami
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/projects")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Proyek Kami
                                </button>
                            </li>
                        </ul>

                        <div className="z-20 relative flex items-center space-x-6">
                            {isLoggedIn ? (
                                <>
                                    <span className="text-purple-600 font-medium">Hi, {userData?.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-gradient-to-b from-blue-600 to-blue-500 text-white px-4 py-1 rounded-xl transition-all shadow-white shadow-md font-bold hover:scale-105 hover:shadow-sm hover:shadow-white hover:shadow-opacity-30 hover:from-blue-700 hover:to-blue-600 duration-200"
                                    >
                                        Logout
                                    </button>
                                </>
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

            {/* Main Content */}
            <main className="pt-28">
                {/* Welcome Section */}
                <section className="flex flex-col items-center justify-center h-screen text-gray-800">
                    <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-5xl text-white font-bold text-center">Selamat Datang di Indonesia Career Center ( ICCN )</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-4 text-lg text-center text-gray-100">Langkah awal menuju karier impian Anda dimulai di sini! Temukan peluang, jelajahi layanan terbaik kami, dan raih masa depan yang lebih cerah mulai hari ini!</motion.p>
                    <button onClick={handleGetStarted} className="mt-6 bg-sky-500 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 duration-200">Jadi Member</button>

                    {/* Tombol Scroll ke Tentang ICCN */}
                    <motion.div
                       initial={{ opacity: 1, y: 0 }} // Pastikan tombol terlihat dari awal
                       animate={{ y: [0, -10, 0] }} // Dari atas ke bawah (negatif = turun)
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="mt-64"
                    >
                        <ScrollLink
                            to="tentang-iccn"
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
                                    className="h-6 w-6 text-blue-600"
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

                {/* About ICCN Section */}
                <section id="tentang-iccn" className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Tentang ICCN</h2>
                        <div className="text-center text-gray-700 max-w-2xl mx-auto">
                            <p className="mb-4">
                                Indonesia Career Center Network (ICCN) merupakan sebuah asosiasi profesi pengelola pusat karier perguruan tinggi Indonesia. ICCN memiliki tujuan untuk meningkatkan daya saing sumber daya manusia Indonesia melalui standarisasi pelayanan pusat karier perguruan tinggi Indonesia.
                            </p>
                            <p className="mb-4">
                                Dengan adanya ICCN, diharapkan pusat karier perguruan tinggi dapat berkolaborasi untuk dapat saling berbagi dan menguatkan satu sama lain. Dalam menjalankan fungsinya sebagai sebuah media atau wadah berbagi informasi di antara pusat karier perguruan tinggi, ICCN memiliki beberapa kegiatan yang dapat bermanfaat bagi para anggotanya. Salah satu kegiatan yang akan diadakan oleh ICCN yang dapat dimanfaatkan oleh anggota pusat karier perguruan tinggi adalah Bootcamp Career.
                            </p>
                            <p className="mb-4">
                                Info lebih lanjut mengenai ICCN:
                            </p>
                            <p className="mb-2">
                                Instagram: <a href="https://www.instagram.com/careercenterid" className="text-blue-600 hover:underline">@careercenterid</a>
                            </p>
                            <p>
                                WhatsApp Admin ICCN: <a href="https://wa.me/6282122227950" className="text-blue-600 hover:underline">+62 821-2222-7950</a>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="py-12 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Foto Kegiatan ICCN</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {gallery.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <img
                                        src={item.image_url}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Partner Section */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        {/* Partner Narasumber */}
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Partner Narasumber</h2>
                        <div className="flex flex-wrap justify-center gap-8 mb-12">
                            {[
                                "https://media.discordapp.net/attachments/1047778291882393620/1345676475344490556/qZBJ8YRKvOw4H5vxEy5aH5ndU1uaMRACrWL4yIRazATsFWVaJCBvQXCgHJlYYQyDemXfB7ATmO0iZhuBZx1nM_Aw1280.png?ex=67c56a61&is=67c418e1&hm=01375c3be7e6a3541b7f691ec0e39737887927114fdee34891e32530f6928668&=&format=webp&quality=lossless&width=676&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345676525734727730/bRtYsm-pd25mTdIuTIoLgyaggtvrDI7xsxrKqg1WZaXMoscgbCIH5kROgmSwt3_330YPsR7P9CfX-vTfh1qqN-Yw1280.png?ex=67c56a6d&is=67c418ed&hm=90588a3d384af3f8cf6f0706fe346b3a237eea1d9220e296325789a000dc7e78&=&format=webp&quality=lossless&width=676&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345676536677929033/S7lRlR8pT6nyWGVWJWWbJEm6FEI9mP41bh6lyHK-wTkubMyudQwm2r3P5-sC-_7ygjbGcPjNhJYC32aWf-ELRJUw1280.png?ex=67c56a6f&is=67c418ef&hm=83827da4e68e8b56de7fdff64ec7e7582897999996f3e7f8c1fdd2e688ca44d5&=&format=webp&quality=lossless&width=676&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345676555564748881/NxTOYRHQ3WIY6zAJyTU1lLKD5TsbMia0xviuJkxKOE7APL8kTrqmaKyRFYS3yTwgP0nxudiSK8Zrp6wcIH9hoy4w1280.png?ex=67c56a74&is=67c418f4&hm=daa4db3a0795d5c0e3d9c522dd42773128a0839c48938b6cf21800d804c872a6&=&format=webp&quality=lossless&width=676&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345676576226021441/AgtLAOGEjDIgjmsQo4vQAS_yJzncL6L_w3VYyE5FZchV8GH8GGORn34t_kZG-zD8l_CRPLkcyT71AXNdB2aKoS4w1280.png?ex=67c56a79&is=67c418f9&hm=a039bd2bf89d35c1ece40bcc5b99cab24af301a5e4cec55727e55a3eb931dc34&=&format=webp&quality=lossless&width=676&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345676594978619434/TteBPy0rX67WeVbX1v56decMSSFf2u87kPXLDsYGnDn4dT63KDPq5GK0P1CmyoaVmxXsAD0w8Bf1_7P4E-nZQxgw1280.png?ex=67c56a7d&is=67c418fd&hm=75974f4882b743d05d95b24c7b5f38222482777a5ed05aa4aaf4b940f7a59b30&=&format=webp&quality=lossless&width=676&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345676624410054706/c-PXeuWUq98RVeTnXsTuIog28VXiK1SCFnxRrAx7B_1QAwbRDshdmtwUIM2tbQ-koKvneeNRif0hdURf8AUYAq4w1280.png?ex=67c56a84&is=67c41904&hm=5c39e5a5c7fe2c9034f799b6055a881fb7cae835753863ee73ac4b607ce9e70d&=&format=webp&quality=lossless&width=676&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345676656421113897/C_IFZjW8Lz4AhKusFCPC5gLZ1OeZ---WHz3DNTx4jQyAivDc6tbF2YPxAarQMRa87gDjoZsihdfXN_tx9NUNsx8w1280.png?ex=67c56a8c&is=67c4190c&hm=d2461206a91d0300d619bdc04dc76417eccb65c8d590c5f08741dd75c6c97ce0&=&format=webp&quality=lossless&width=676&height=676"
                            ].map((imageUrl, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="w-40 h-40 bg-white rounded-lg shadow-md flex items-center justify-center p-4 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Partner Narasumber ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Partner Perguruan Tinggi */}
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Partner Perguruan Tinggi</h2>
                        <div className="flex flex-wrap justify-center gap-8">
                            {[
                                "https://media.discordapp.net/attachments/1047778291882393620/1345677159527878708/maYWwCZQpCI2EVlACXe_HOAn4-A-64vfXSIaXO9Nq2Z3E2na8vaFlNsckgQbftUQqPX4gAPjYlD5AJk100Okg-6lz6BgsmhxkxrJ5GmHa70uwJBmKZkOOGFb8zXEbPoVFQw1280.png?ex=67c56b04&is=67c41984&hm=dabab9701dada09a247686915006f6014a99463b2a4a9fca28d04bc465f396a8&=&format=webp&quality=lossless&width=654&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345677204272451697/b7aXp3OcAOvB7Py8psas6SMubkhVeH8utZAiNgRs4_uvqgfqKbyYeeUW435O7-TnQsQ8c6anF7Smso1FJx3hGxPzrwfEcFG_kFRcpItHWMKR5lep0JktWCw8i1M0RC-4mww1280.png?ex=67c56b0e&is=67c4198e&hm=77fa778d6948888952cacc42eaf7c92327bf8556a15fcb27381d19bd8642a7c6&=&format=webp&quality=lossless&width=654&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345677237583876117/CeQh-nQYPWmPotykzrNPc-S1DSQgYvPKLxdthkd3sj92RAMwITkzeFLJLXHc8gd0r288kAn02W9LaBGztjRp6_KmTDMD02ViLWWU4uvCq2yIZWq3RuG8h0RnvThrQpkkkQw1280.png?ex=67c56b16&is=67c41996&hm=8fed22981345440c64a6068253b8453193515134b9dfc606b345c6ec8148cd3b&=&format=webp&quality=lossless&width=654&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345677279946342493/aYPsgCPAP1JhNSn5thw1UPDyQOrisdDM66tg9z99f_gOqF2dziU1mS_NzWxMZalk32bg4vhL19v6jqe8lZxc2GChgHEcp4d6ieu6eLFKNJRNnneVJFvf7y5NHDITz3UWMAw1280.png?ex=67c56b21&is=67c419a1&hm=ea04c41f0bc4a52f6000cb66137d308c587b1bed98a322d2cc07f46df2e6619a&=&format=webp&quality=lossless&width=654&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345677349307547748/HSbDgJCkcMdvrZFXt7uqiqnicX5JnrXWBFwGPC9HuJ-Kfedaiw3-Rl4fVyknCvjUibbYpm4XUi7UZ8SHAp7SM37rm5PzyoqprAK_atR8x6wP2sPTlxLTjo6Ct_MLB1L-kAw1280.png?ex=67c56b31&is=67c419b1&hm=60c9972c0ee5640e98c80c5b128e7189788b68f6dafbcead76918c748b198027&=&format=webp&quality=lossless&width=339&height=350",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345677367796043888/-5zJfVHcw4lIf2VOpvcbcsxuiyRfodczXP50vx-D7w3IxHlr2Wc4BDyyj3Lu_QB6OFZ7EBDwvgdctVO05z1rY9wRSs35Cig8V9reHS9iuMz_kGsf1oL0KqucGkqLEBvZsgw1280.png?ex=67c56b35&is=67c419b5&hm=a6ded9f878efef54e9ab1d62cf7cb492e278e96760cb190df709a2465b447e72&=&format=webp&quality=lossless&width=654&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345677378403172403/CeQh-nQYPWmPotykzrNPc-S1DSQgYvPKLxdthkd3sj92RAMwITkzeFLJLXHc8gd0r288kAn02W9LaBGztjRp6_KmTDMD02ViLWWU4uvCq2yIZWq3RuG8h0RnvThrQpkkkQw1280.png?ex=67c56b38&is=67c419b8&hm=26664865d49fdc1a0b7ba3116503221a54400c73c0f046a8ea394ba2192abf57&=&format=webp&quality=lossless&width=654&height=676",
                                "https://media.discordapp.net/attachments/1047778291882393620/1345677404320043068/rrAgELzOpC7dqzySHkp2bH2JFLL26b-GxSxP5CR3lJJmYOQR1pkGlQRs_odg-pqX6jWMC6s_aSKwJEyh2yaNsuRMbBC8pFpu30cB-WGpRdZSVIAV0MPKBtp9I7qmGKmbtQw1280.png?ex=67c56b3e&is=67c419be&hm=4dab9823a1f34e3947e2f67422641b46f10446b7abef1bd581717f694b381b87&=&format=webp&quality=lossless&width=654&height=676"
                            ].map((imageUrl, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="w-40 h-40 bg-white rounded-lg shadow-md flex items-center justify-center p-4 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Partner Perguruan Tinggi ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;