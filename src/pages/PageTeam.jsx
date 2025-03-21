import React from "react";
import Navbar from "../components/Navbar";
import userImg from "../assets/user.png";

const PageTeam = () => {
    // Data lengkap dengan foto
    const organizationData = {
        badanPengawas: [
            { name: "Dr. Eng Bambang Setia Budi, ST., MT", affiliation: "ITB", photo: userImg },
            { name: "Prof. Dr. Ir. Nuni Gofar, MS", affiliation: "Unsri", photo: userImg },
            { name: "Ir. Wiratno Argo Asmoro, MS", affiliation: "ITS", photo: userImg },
            { name: "Dr. Ayi Ahadiat, SE, MBA", affiliation: "Unila", photo: userImg },
            { name: "Dr. Syarifah Iis Aisyah, M.Agr. Sc", affiliation: "IPB", photo: userImg },
            { name: "Nurhadi Irbath, ST, CEC, LCCC", affiliation: "UGM", photo: userImg },
            { name: "Dr. Widyastuti", affiliation: "ITS", photo: userImg },
            { name: "Ary Tamtama, S.Pi", affiliation: "UM Kendari", photo: userImg },
            { name: "Dewiyani, S.Psi, Psikolog, CGA", affiliation: "Unpar", photo: userImg },
            { name: "Dr. Epy Muhammad Luqman, Drh.", affiliation: "Unair", photo: userImg },
            { name: "Prof. Dr. Kusnandar", affiliation: "UNS", photo: userImg }
        ],

        strukturUtama: {
            position: "Presiden",
            name: "Dr. Rosaria Mita Amalia, S.S., S.IP., M.Hum",
            affiliation: "Universitas Padjadjaran",
            photo: "https://indonesiacareercenter.id/wp-content/uploads/2022/09/WhatsApp-Image-2022-09-21-at-12.36.51-e1663803429823-256x256.jpeg",
            children: [
                {
                    position: "Wakil Presiden",
                    name: "Prof. Dr. Elly Munadziroh, drg. MS",
                    affiliation: "Universitas Airlangga",
                    photo: "https://indonesiacareercenter.id/wp-content/uploads/2022/09/WhatsApp-Image-2022-09-20-at-12.29.34-278x278.jpeg",
                    children: [
                        {
                            position: "Bendahara Umum",
                            name: "Dr. Tiara Nirmala, SE., M.Sc.",
                            affiliation: "Universitas Lampung",
                            photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkTp_Hk6d7FXDJkFFt1fS88yf4yBG7Q7Lw0A&s",
                        },
                        {
                            position: "Wakil Bendahara Umum",
                            name: "Lia Marlia, S.Sos., M.I.Kom.",
                            affiliation: "Universitas Telkom",
                            photo: userImg
                        }
                    ]
                },
                {
                    position: "Sekretaris Jendral",
                    name: "Dr. Teddy Indira Budiwan, S.Psi., M.M",
                    affiliation: "Universitas Bina Nusantara",
                    photo: "https://indonesiacareercenter.id/wp-content/uploads/2024/06/teddy-removebg-preview-295x300.png",
                    children: [
                        {
                            position: "Wakil Sekretaris Jendral",
                            subPosition: "Bidang Keuangan, Sistem Informasi dan Tata Kelola",
                            name: "Dessy Dwi Nurhandayani, S.T., M.M",
                            affiliation: "Universitas Telkom",
                            photo: userImg
                        },
                        {
                            position: "Wakil Sekretaris Jendral",
                            subPosition: "Bidang Komunikasi Publik, Pendampingan Dan Kerjasama",
                            name: "Ir. Petiana Indriati, M.M",
                            affiliation: "Universitas Pancasila",
                            photo: "https://indonesiacareercenter.id/wp-content/uploads/2022/01/0c23d3b5-43a0-4b24-8b46-557097d0ed56-Pramono-Aji-1-255x255.jpg",
                        }
                    ]
                }
            ]
        },

        direktorat: [
            {
                name: "Organisasi dan Keanggotaan",
                direktur: { name: "Dr. Usep Syaipudin, S.E., M.S.Ak.", affiliation: "Universitas Lampung", photo: userImg },
                wakil: { name: "Yuliana Sri Wulandari, S.E", affiliation: "Universitas Katolik Soegijapranata", photo: userImg }
            },
            {
                name: "Komunikasi Publik",
                direktur: { name: "Rici Tri Harpin Pranata, S.KPm., M.Si", affiliation: "Institut Pertanian Bogor", photo: userImg },
                wakil: { name: "Nasty Ramadhania, S.T.", affiliation: "Universitas Al-Azhar Indonesia", photo: userImg }
            },
            {
                name: "Sistem Informasi",
                direktur: { name: "Kusnawi, S.Kom, M.Eng", affiliation: "Universitas Amikom Yogyakarta", photo: userImg },
                wakil: { name: "Dr. Sendi Novianto, S.Kom., M.T.", affiliation: "Universitas Dian Nuswantoro", photo: "https://indonesiacareercenter.id/wp-content/uploads/2022/09/WhatsApp-Image-2022-09-23-at-07.20.36-e1663895747140-166x166.jpeg" }
            },
            {
                name: "Kajian Ilmiah",
                direktur: { name: "Dr. Arifudin, S.P., M.P", affiliation: "Universitas Riau", photo: userImg },
                wakil: { name: "Dr.Ir. Nofialdi, M.Si", affiliation: "Universitas Andalas", photo: userImg }
            },
            {
                name: "Pendampingan Pusat Karir",
                direktur: { name: "Salamah Agung M.A., Ph.D.", affiliation: "UIN Syarif Hidayatullah Jakarta", photo: "https://indonesiacareercenter.id/wp-content/uploads/2022/09/WhatsApp-Image-2022-09-23-at-11.31.54-288x288.jpeg" },
                wakil: { name: "Rusliansyah, SE, M.Si.", affiliation: "Universitas Mulawarman", photo: userImg }
            },
            {
                name: "Sertifikasi dan Akreditasi Pusat Karir",
                direktur: { name: "Sukma Lesmana,SE,MSi,Ph.D", affiliation: "Universitas Muhammadiyah Sumatera Utara", photo: userImg },
                wakil: { name: "Puji Andayani, S.Si., M.Si., M.Sc., MCE", affiliation: "Universitas Internasional Semen Indonesia", photo: userImg }
            },
            {
                name: "Kerjasama Industri dan Pemerintahan",
                direktur: { name: "Lastiko Endi Rahmantyo M.Hum", affiliation: "Universitas Airlangga", photo: userImg },
                wakil: { name: "Dr. Heri Gunawan, S.Pd.I., M.Ag", affiliation: "UIN Sunan Gunung Djati Bandung", photo: userImg }
            },
            {
                name: "Kerjasama Internasional",
                direktur: { name: "Karuniawan Puji Wicaksono, PhD", affiliation: "Universitas Brawijaya", photo: userImg },
                wakil: { name: "Siska, S.Psi.", affiliation: "Praktisi", photo: userImg }
            },
            {
                name: "Pendampingan Konseling Karir",
                direktur: { name: "Dr. Yusi Riksa Yustiana, M.Pd.", affiliation: "Universitas Pendidikan Indonesia", photo: userImg },
                wakil: { name: "Rahma Kusumandari, M.Psi., Psikolog", affiliation: "Universitas 17 Agustus 1945 Surabaya", photo: userImg }
            },
            {
                name: "Pendampingan Kewirausahaan",
                direktur: { name: "Dr. Dwi Prasetyani, SE, M, Si", affiliation: "Universitas Sebelas Maret", photo: userImg },
                wakil: { name: "Atanasius Emillio Gary Waluyohadi, S.Psi., M.Si.", affiliation: "Universitas Ciputra", photo: userImg }
            },
            {
                name: "Pendampingan Tracer Study",
                direktur: { name: "Muchammad Nurif S.E., M.T.", affiliation: "Institut Teknologi Sepuluh Nopember", photo: userImg },
                wakil: { name: "Danial, S.Si., M.T", affiliation: "Institut Teknologi Bandung", photo: userImg }
            }
        ]
    };

    const OrganizationNode = ({ node, isRoot = false, isLast = false, hasSibling = false }) => (
        <div className="flex flex-col items-center relative">
            {/* Garis vertikal ke atas hanya jika memiliki saudara */}
            {!isRoot && hasSibling && (
                <div className="absolute top-0 w-0.5 h-8 bg-white/50 -translate-y-full"></div>
            )}

            {/* Node */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 w-64 text-center relative z-10 shadow-lg">
                <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white">
                    <img src={node.photo} alt={node.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-blue-400 mb-2">{node.position}</h3>
                <p className="text-white font-semibold">{node.name}</p>
                <p className="text-sm text-gray-200 mt-2">{node.affiliation}</p>
            </div>

            {/* Garis dan children */}
            {node.children && (
                <div className="relative">
                    {/* Garis vertikal ke bawah hanya jika ada grandchildren */}
                    {node.children.some(child => child.children) && !isLast && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8"></div>
                    )}

                    <div className="flex relative pt-16">
                        {/* Garis horizontal penghubung */}
                        {node.children.length > 1 && (
                            <>
                                {/* Garis horizontal */}
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[calc(89%-12rem)] h-0.5 bg-white/50"></div>

                                {/* Garis vertikal tengah yang diperpanjang */}
                                <div className="absolute top-[-2rem] left-1/2 -translate-x-1/2 w-0.5 h-[4rem] bg-white/50"></div>
                            </>
                        )}

                        <div className="flex space-x-16">
                            {node.children.map((child, index) => (
                                <div key={index} className="relative">
                                    {/* Garis vertikal antar child */}
                                    {index !== node.children.length - 1 && (
                                        <div ></div>
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
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">
            <Navbar />
            <main className="pt-32 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">Struktur Organisasi</h1>

                    {/* Struktur Utama */}
                    <div className="flex justify-center mb-16">
                        <OrganizationNode node={organizationData.strukturUtama} isRoot={true} />
                    </div>

                    {/* Badan Pengawas */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6">Badan Pengawas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {organizationData.badanPengawas.map((member, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                                    <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white">
                                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-white text-center font-semibold text-sm">{member.name}</p>
                                    <p className="text-xs text-center text-gray-300 mt-1">{member.affiliation}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Direktorat */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {organizationData.direktorat.map((direktorat, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
                                <h3 className="text-lg font-bold text-blue-400 mb-4">Direktorat {direktorat.name}</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-white">
                                            <img src={direktorat.direktur.photo} alt={direktorat.direktur.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Direktur</p>
                                            <p className="text-xs text-gray-200">{direktorat.direktur.name}</p>
                                            <p className="text-xs text-gray-400">{direktorat.direktur.affiliation}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-white">
                                            <img src={direktorat.wakil.photo} alt={direktorat.wakil.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Wakil Direktur</p>
                                            <p className="text-xs text-gray-200">{direktorat.wakil.name}</p>
                                            <p className="text-xs text-gray-400">{direktorat.wakil.affiliation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
export default PageTeam;