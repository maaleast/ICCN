import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../config";

const DEFAULT_STRUCTURE = [
    {
        id: 1, // ID Presiden
        position: 'Presiden',
        role: null,
        children: [
            {
                id: 2, // ID Wakil Presiden
                position: "Wakil Presiden",
                role: "Presiden",
                children: [
                    {
                        id: 3, // ID Bendahara Umum
                        position: "Bendahara Umum",
                        role: "Wakil Presiden"
                    },
                    {
                        id: 4, // ID Wakil Bendahara
                        position: "Wakil Bendahara Umum",
                        role: "Wakil Presiden"
                    }
                ]
            },
            {
                id: 5, // ID Sekretaris Jendral
                position: "Sekretaris Jendral",
                role: "Presiden",
                children: [
                    {
                        id: 6, // ID Wakil Sekretaris 1
                        position: "Wakil Sekretaris Jendral",
                        subPosition: "Bidang Keuangan, Sistem Informasi dan Tata Kelola", // Pembeda
                        role: "Sekretaris Jendral"
                    },
                    {
                        id: 7, // ID Wakil Sekretaris 2
                        position: "Wakil Sekretaris Jendral",
                        subPosition: "Bidang Komunikasi Publik, Pendampingan Dan Kerjasama", // Pembeda
                        role: "Sekretaris Jendral"
                    }
                ]
            }
        ]
    }
];

const DEFAULT_DIRECTORATE_STRUCTURE = [
    {
        id: 100,
        position: "Direktorat Organisasi dan Keanggotaan",
        role: null,
        children: [
            {
                id: 101,
                position: "Direktur",
                role: "Direktorat Organisasi dan Keanggotaan",
                name: "",
                affiliation: "",
                photo_url: "",
            },
            {
                id: 102,
                position: "Wakil Direktur",
                role: "Direktorat Organisasi dan Keanggotaan",
                name: "",
                affiliation: "",
                photo_url: "",
            },
        ],
    },
    {
        id: 200,
        position: "Direktorat Komunikasi Publik",
        role: null,
        children: [
            {
                id: 201,
                position: "Direktur",
                role: "Direktorat Komunikasi Publik",
                name: "",
                affiliation: "",
                photo_url: "",
            },
            {
                id: 202,
                position: "Wakil Direktur",
                role: "Direktorat Komunikasi Publik",
                name: "",
                affiliation: "",
                photo_url: "",
            },
        ],
    },
    {
        id: 300,
        position: "Direktorat Sistem Informasi",
        role: null,
        children: [
            {
                id: 301,
                position: "Direktur",
                role: "Direktorat Sistem Informasi",
                name: "",
                affiliation: "",
                photo_url: "",
            },
            {
                id: 302,
                position: "Wakil Direktur",
                role: "Direktorat Sistem Informasi",
                name: "",
                affiliation: "",
                photo_url: "",
            },
        ],
    },
    {
        id: 400,
        position: "Direktorat Kajian Ilmiah",
        role: null,
        children: [
            {
                id: 401,
                position: "Direktur",
                role: "Direktorat Kajian Ilmiah",
                name: "",
                affiliation: "",
                photo_url: "",
            },
            {
                id: 402,
                position: "Wakil Direktur",
                role: "Direktorat Kajian Ilmiah",
                name: "",
                affiliation: "",
                photo_url: "",
            },
        ],
    },
    {
        id: 500,
        position: "Direktorat Pendampingan Pusat Karir",
        role: null,
        children: [
            {
                id: 501,
                position: "Direktur",
                role: "Direktorat Pendampingan Pusat Karir",
                name: "",
                affiliation: "",
                photo_url: "",
            },
            {
                id: 502,
                position: "Wakil Direktur",
                role: "Direktorat Pendampingan Pusat Karir",
                name: "",
                affiliation: "",
                photo_url: "",
            },
        ],
    },
    {
        id: 600,
        position: "Direktorat Sertifikasi dan Akreditasi Pusat Karir",
        role: null,
        children: [
            {
                id: 601,
                position: "Direktur",
                role: "Direktorat Sertifikasi dan Akreditasi Pusat Karir",
                name: "",
                affiliation: "",
                photo_url: "",
            },
            {
                id: 602,
                position: "Wakil Direktur",
                role: "Direktorat Sertifikasi dan Akreditasi Pusat Karir",
                name: "",
                affiliation: "",
                photo_url: "",
            },
        ],
    },
    {
        id: 700,
        position: "Direktorat Kerjasama Industri dan Pemerintahan",
        role: null,
        children: [
            {
                id: 701,
                position: "Direktur",
                role: "Direktorat Kerjasama Industri dan Pemerintahan",
                name: "",
                affiliation: "",
                photo_url: "",
            },
            {
                id: 702,
                position: "Wakil Direktur",
                role: "Direktorat Kerjasama Industri dan Pemerintahan",
                name: "",
                affiliation: "",
                photo_url: "",
            },
        ],
    },
    {
        id: 800,
        position: "Direktorat Kerjasama Internasional",
        role: null,
        children: [
            {
                id: 801,
                position: "Direktur",
                role: "Direktorat Kerjasama Internasional",
                name: "",
                affiliation: "",
                photo_url: "",
            },
            {
                id: 802,
                position: "Wakil Direktur",
                role: "Direktorat Kerjasama Internasional",
                name: "",
                affiliation: "",
                photo_url: "",
            },
        ],
    },
    {
        id: 900,
        position: "Direktorat Pendampingan Konseling Karir",
        role: null,
        children: [
            {
                id: 901,
                position: "Direktur",
                role: "Direktorat Pendampingan Konseling Karir",
                name: "",
                affiliation: "",
                photo_url: "",
            },
            {
                id: 902,
                position: "Wakil Direktur",
                role: "Direktorat Pendampingan Konseling Karir",
                name: "",
                affiliation: "",
                photo_url: "",
            },
        ],
    },
    {
        id: 1000,
        position: "Direktorat Pendampingan Kewirausahaan",
        role: null,
        children: [
            {
                id: 1001,
                position: "Direktur",
                role: "Direktorat Pendampingan Kewirausahaan",
                name: "",
                affiliation: "",
                photo_url: "",
            },
            {
                id: 1002,
                position: "Wakil Direktur",
                role: "Direktorat Pendampingan Kewirausahaan",
                name: "",
                affiliation: "",
                photo_url: "",
            },
        ],
    },
    {
        id: 1100,
        position: "Direktorat Pendampingan Tracer Study",
        role: null,
        children: [
            {
                id: 1101,
                position: "Direktur",
                role: "Direktorat Pendampingan Tracer Study",
                name: "",
                affiliation: "",
                photo_url: "",
            },
            {
                id: 1102,
                position: "Wakil Direktur",
                role: "Direktorat Pendampingan Tracer Study",
                name: "",
                affiliation: "",
                photo_url: "",
            },
        ],
    }
];

const PageTeam = () => {
    const [organizationData, setOrganizationData] = useState({
        struktur: DEFAULT_STRUCTURE,
        badanPengawas: [],
        direktorat: DEFAULT_DIRECTORATE_STRUCTURE,
    });

    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/organisasi?ts=${Date.now()}`);
                const result = await response.json();

                if (!result.success) throw new Error('Gagal memuat data');

                // Format data sesuai struktur default
                const mapStructure = (defaultNode) => {
                    const savedData = result.data.find(item =>
                        item.id === defaultNode.id
                    );

                    return {
                        ...defaultNode,
                        ...(savedData || {}),
                        children: defaultNode.children ?
                            defaultNode.children.map(mapStructure) :
                            undefined
                    };
                };

                const struktur = DEFAULT_STRUCTURE.map(mapStructure);
                const badanPengawas = result.data.filter(item => item.jenis === 'badanpengawas');
                const direktorat = DEFAULT_DIRECTORATE_STRUCTURE.map(mapStructure);

                setOrganizationData({
                    struktur,
                    badanPengawas,
                    direktorat,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fungsi untuk menampilkan gambar dalam modal
    const handleImageClick = (imageUrl) => {
        if (imageUrl && imageUrl !== '/default-avatar.png') {
            setSelectedImage(imageUrl);
        }
    };

    // Fungsi untuk menutup modal
    const closeModal = () => {
        setSelectedImage(null);
    };

    const OrganizationNode = ({ node, isRoot = false, isLast = false, hasSibling = false }) => {
        const isEmpty = !node.name && !node.affiliation;
        const hasPhoto = node.photo_url && node.photo_url !== '/default-avatar.png';

        return (
            <div className="flex flex-col items-center relative">
                {!isRoot && hasSibling && (
                    <div className="absolute top-0 w-0.5 h-8 bg-white/50 -translate-y-full"></div>
                )}

                <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 w-64 text-center relative z-10 shadow-lg ${isEmpty ? 'border-2 border-dashed border-white/30' : ''}`}>
                    <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white">
                        <img
                            src={node.photo_url || '/default-avatar.png'}
                            alt={node.name}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handleImageClick(node.photo_url)}
                        />
                    </div>

                    <h3 className="text-lg font-bold text-blue-400 mb-2">
                        {node.position}
                    </h3>
                    {node.subPosition && (
                        <p className="text-sm text-white mb-2">{node.subPosition}</p>
                    )}

                    <div className="relative flex items-center justify-center gap-1">
                        <p className={`text-white font-semibold ${isEmpty ? 'text-white/50 italic' : ''}`}>
                            {node.name || 'Nama belum diisi'}
                        </p>
                    </div>

                    <div className="relative flex items-center justify-center gap-1 mt-2">
                        <p className={`text-sm ${isEmpty ? 'text-gray-400 italic' : 'text-white'}`}>
                            {node.affiliation || 'Afiliasi belum diisi'}
                        </p>
                    </div>
                </div>

                {node.children && (
                    <div className="relative">
                        {node.children.some(child => child.children) && !isLast && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8"></div>
                        )}

                        <div className="flex relative pt-16">
                            {node.children.length > 1 && (
                                <>
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[calc(89%-12rem)] h-0.5 bg-white/50"></div>
                                    <div className="absolute top-[-2rem] left-1/2 -translate-x-1/2 w-0.5 h-[4rem] bg-white/50"></div>
                                </>
                            )}

                            <div className="flex space-x-16">
                                {node.children.map((child, index) => (
                                    <div key={index} className="relative">
                                        {index !== node.children.length - 1 && (
                                            <div className="absolute right-0 top-1/2 w-8 h-0.5"></div>
                                        )}
                                        <OrganizationNode
                                            node={child}
                                            isLast={index === node.children.length - 1}
                                            hasSibling={node.children.length > 1}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const BadanPengawasNode = ({ item }) => {
        return (
            <div className="bg-white/10 p-4 rounded-lg relative group">
                <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white">
                    <img
                        src={item.photo_url || '/default-avatar.png'}
                        alt={item.name}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleImageClick(item.photo_url)}
                    />
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-white font-semibold">
                        {item.name}
                    </p>
                    <p className="text-white text-sm">
                        {item.affiliation}
                    </p>
                </div>
            </div>
        );
    };

    const DirectorateSection = ({ directorate }) => {
        const { position, children = [] } = directorate;

        return (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full text-left shadow-lg">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">{position}</h2>
                <div className="space-y-4">
                    {children.map((child, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                                <img
                                    src={child.photo_url || '/default-avatar.png'}
                                    alt={child.name}
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => handleImageClick(child.photo_url)}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-white font-bold mb-1">
                                    {child.position}
                                </p>
                                <p className="text-white">
                                    {child.name || 'Nama belum diisi'}
                                </p>
                                <p className="text-white text-sm">
                                    {child.affiliation || 'Afiliasi belum diisi'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">
            <Navbar />
            <main className="pt-32 pb-12 px-4 md:px-8">
                {/* Struktur Organisasi */}
                <div className="max-w-7xl mx-auto mb-16">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Tim Kami</h1>
                    <h1 className="text-2xl font-bold text-white mb-8 text-center">Struktur Organisasi</h1>
                    <div className="flex justify-center">
                        {organizationData.struktur.map((node) => (
                            <OrganizationNode key={node.id} node={node} isRoot={true} />
                        ))}
                    </div>
                </div>

                {/* Badan Pengawas */}
                <div className="max-w-7xl mx-auto mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6">Badan Pengawas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {organizationData.badanPengawas.map((item) => (
                            <BadanPengawasNode key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* Direktorat */}
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">Direktorat</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {organizationData.direktorat.map((directorate) => (
                            <DirectorateSection key={directorate.id} directorate={directorate} />
                        ))}
                    </div>
                </div>

                {/* Modal untuk menampilkan gambar */}
                {selectedImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={closeModal}>
                        <div className="relative max-w-full max-h-full">
                            <img
                                src={selectedImage}
                                alt="Selected"
                                className="max-w-[90vw] max-h-[90vh]"
                            />
                            <button
                                className="absolute top-4 right-4 text-red-800 font-bold text-4xl"
                                onClick={closeModal}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PageTeam;