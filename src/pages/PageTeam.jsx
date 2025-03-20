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
            photo: userImg,
            children: [
                {
                    position: "Wakil Presiden",
                    name: "Prof. Dr. Elly Munadziroh, drg. MS",
                    affiliation: "Universitas Airlangga",
                    photo: userImg,
                    children: [
                        {
                            position: "Sekretaris Jendral",
                            name: "Dr. Teddy Indira Budiwan, S.Psi., M.M",
                            affiliation: "Universitas Bina Nusantara",
                            photo: userImg,
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
                                    name: "Ir. Petiana, M.M",
                                    affiliation: "Universitas Pancasila",
                                    photo: userImg
                                }
                            ]
                        },
                        {
                            position: "Bendahara Umum",
                            name: "Dr. Tiara Nirmala, SE., M.Sc.",
                            affiliation: "Universitas Lampung",
                            photo: userImg,
                            children: [
                                {
                                    position: "Wakil Bendahara Umum",
                                    name: "Lia Marlia, S.Sos., M.I.Kom.",
                                    affiliation: "Universitas Telkom",
                                    photo: userImg
                                }
                            ]
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
                wakil: { name: "Dr. Sendi Novianto, S.Kom., M.T.", affiliation: "Universitas Dian Nuswantoro", photo: userImg }
            },
            {
                name: "Kajian Ilmiah",
                direktur: { name: "Dr. Arifudin, S.P., M.P", affiliation: "Universitas Riau", photo: userImg },
                wakil: { name: "Dr.Ir. Nofialdi, M.Si", affiliation: "Universitas Andalas", photo: userImg }
            },
            {
                name: "Pendampingan Pusat Karir",
                direktur: { name: "Salamah Agung M.A., Ph.D.", affiliation: "UIN Syarif Hidayatullah Jakarta", photo: userImg },
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

    const OrganizationNode = ({ node, isRoot = false, isLast = false }) => (
        <div className="flex flex-col items-center relative">
            {/* Garis vertikal ke atas kecuali untuk root */}
            {!isRoot && (
                <div className="absolute top-0 w-0.5 h-8 bg-white/50 -translate-y-full"></div>
            )}

            {/* Node */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 w-64 text-center hover:bg-white/20 transition-all relative z-10 shadow-lg">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white">
                    <img src={node.photo} alt={node.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-blue-400 mb-2">{node.position}</h3>
                {node.subPosition && <p className="text-xs text-gray-300 mb-1">{node.subPosition}</p>}
                <p className="text-white font-semibold">{node.name}</p>
                <p className="text-sm text-gray-200 mt-2">{node.affiliation}</p>
            </div>

            {/* Garis dan children */}
            {node.children && (
                <div className="relative">
                    {/* Garis vertikal ke bawah */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-white/50"></div>

                    {/* Container untuk children */}
                    <div className="flex relative pt-16">
                        {/* Garis horizontal penghubung */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] h-0.5 bg-white/50"></div>

                        <div className="flex space-x-16">
                            {node.children.map((child, index) => (
                                <div key={index} className="relative">
                                    {/* Garis vertikal ke node child */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-white/50 -translate-y-8"></div>
                                    <OrganizationNode node={child} isLast={index === node.children.length - 1} />
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
                                    <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white">
                                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-white font-semibold text-sm">{member.name}</p>
                                    <p className="text-xs text-gray-300 mt-1">{member.affiliation}</p>
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
                                        <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-white">
                                            <img src={direktorat.direktur.photo} alt={direktorat.direktur.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Direktur</p>
                                            <p className="text-xs text-gray-200">{direktorat.direktur.name}</p>
                                            <p className="text-xs text-gray-400">{direktorat.direktur.affiliation}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-white">
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