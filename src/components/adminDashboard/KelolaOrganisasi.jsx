import React, { useState, useEffect } from "react";
import { FiEdit2, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../config';

Modal.setAppElement('#root');
Modal.defaultStyles.overlay.zIndex = 1000;
Modal.defaultStyles.content.zIndex = 1001;

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

const KelolaOrganisasi = () => {
    const [data, setData] = useState({
        struktur: DEFAULT_STRUCTURE,
        badanPengawas: [],
        direktorat: DEFAULT_DIRECTORATE_STRUCTURE,
    });

    const [editModal, setEditModal] = useState({
        show: false,
        type: '', // 'photo', 'name', atau 'affiliation'
        current: null // Data yang sedang diedit
    });

    const [addModal, setAddModal] = useState({
        show: false,
        type: '' // 'badanPengawas' atau 'direktorat'
    });

    const [addAnggotaModal, setAddAnggotaModal] = useState({
        show: false,
        direktoratPosition: null
    });

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/organisasi?ts=${Date.now()}`);
            const result = await response.json();

            if (!result.success) throw new Error('Gagal memuat data');

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
            const direktorat = DEFAULT_DIRECTORATE_STRUCTURE.map(mapStructure);

            setData({
                struktur,
                badanPengawas: result.data.filter(item => item.jenis === 'badanpengawas'),
                direktorat,
            });
        } catch (error) {
            toast.error('Gagal memuat data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = async (formData) => {
        try {
            const node = editModal.current;

            if (node.id < 0) {
                const response = await fetch(
                    `${API_BASE_URL}/organisasi?position=${node.position}&role=${node.role || ''}`
                );
                const result = await response.json();

                if (!result.success || result.data.length === 0) {
                    throw new Error('Data tidak ditemukan');
                }
                node.id = result.data[0].id;
            }

            const response = await fetch(`${API_BASE_URL}/organisasi/edit/${node.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) throw new Error('Gagal mengupdate data');

            await fetchData();
            setEditModal({ show: false, type: '', current: null });
            toast.success('Data berhasil diupdate');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_BASE_URL}/organisasi/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error('Gagal menghapus data');

                toast.success('Data berhasil dihapus');
                fetchData();
            } catch (error) {
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    const OrganizationNode = ({ node, isRoot = false, isLast = false, hasSibling = false }) => {
        const isEmpty = !node.name && !node.affiliation;
        const hasPhoto = node.photo_url && node.photo_url !== '/default-avatar.png';

        return (
            <div className="flex flex-col items-center relative">
                {!isRoot && hasSibling && (
                    <div className="absolute top-0 w-0.5 h-8 dark:bg-white/50 bg-black/50 -translate-y-full"></div>
                )}

                <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 w-64 text-center relative z-10 shadow-lg ${isEmpty ? 'border-2 border-dashed border-white/30' : ''}`}>
                    <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-2 border-black dark:border-white group">
                        <img
                            src={node.photo_url || '/default-avatar.png'}
                            alt={node.name}
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={() => setEditModal({ show: true, type: 'photo', current: node })}
                            className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${hasPhoto ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                        >
                            {hasPhoto ? (
                                <FiEdit2 className="text-white dark:text-black text-2xl" />
                            ) : (
                                <FiPlusCircle className="text-black dark:text-white text-2xl" />
                            )}
                        </button>
                    </div>

                    <h3 className="text-lg font-bold text-blue-400 mb-2">
                        {node.position}
                    </h3>
                    {node.subPosition && (
                        <p className="text-sm text-black dark:text-white mb-2">{node.subPosition}</p>
                    )}

                    <div className="relative flex items-center justify-center gap-1">
                        <p
                            className={`text-black dark:text-white font-semibold ${isEmpty ? 'text-black dark:text-white/50 italic' : ''} cursor-pointer`}
                            onClick={() => setEditModal({ show: true, type: 'name', current: node })}
                        >
                            {node.name || 'Klik untuk mengisi nama'}
                        </p>
                        <button
                            onClick={() => setEditModal({ show: true, type: 'name', current: node })}
                        >
                            {node.name ? (
                                <FiEdit2 className="text-black dark:text-white text-sm" />
                            ) : (
                                <FiPlusCircle className="text-black dark:text-white text-sm" />
                            )}
                        </button>
                    </div>

                    <div className="relative flex items-center justify-center gap-1 mt-2 dark:text-gray-200">
                        <p
                            className={`text-sm ${isEmpty ? 'text-gray-400 italic' : ''} cursor-pointer`}
                            onClick={() => setEditModal({ show: true, type: 'affiliation', current: node })}
                        >
                            {node.affiliation || 'Klik untuk mengisi afiliasi'}
                        </p>
                        <button
                            onClick={() => setEditModal({ show: true, type: 'affiliation', current: node })}
                        >
                            {node.affiliation ? (
                                <FiEdit2 className="text-black dark:text-white text-sm" />
                            ) : (
                                <FiPlusCircle className="text-black dark:text-white text-sm" />
                            )}
                        </button>
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
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[calc(89%-12rem)] h-0.5 dark:bg-white/50 bg-black/50"></div>
                                    <div className="absolute top-[-2rem] left-1/2 -translate-x-1/2 w-0.5 h-[4rem] dark:bg-white/50 bg-black/50"></div>
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
        const hasPhoto = item.photo_url && item.photo_url !== '/default-avatar.png';

        return (
            <div key={item.id} className="bg-white/10 p-4 rounded-lg relative group">
                <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 text-red-400"
                >
                    <FiTrash2 />
                </button>
                <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-black dark:border-white">
                    <img
                        src={item.photo_url || '/default-avatar.png'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={() => setEditModal({ show: true, type: 'photo', current: item })}
                        className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${hasPhoto ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                    >
                        {hasPhoto ? (
                            <FiEdit2 className="text-white dark:text-black text-xl" />
                        ) : (
                            <FiPlusCircle className="text-black dark:text-white text-xl" />
                        )}
                    </button>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <p
                        className="text-black dark:text-white font-semibold cursor-pointer"
                        onClick={() => setEditModal({ show: true, type: 'name', current: item })}
                    >
                        {item.name}
                    </p>
                    <button
                        onClick={() => setEditModal({ show: true, type: 'name', current: item })}
                    >
                        {item.name ? (
                            <FiEdit2 className="text-black dark:text-white text-sm" />
                        ) : (
                            <FiPlusCircle className="text-black dark:text-white text-sm" />
                        )}
                    </button>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <p
                        className="text-black dark:text-white text-sm cursor-pointer"
                        onClick={() => setEditModal({ show: true, type: 'affiliation', current: item })}
                    >
                        {item.affiliation}
                    </p>
                    <button
                        onClick={() => setEditModal({ show: true, type: 'affiliation', current: item })}
                    >
                        {item.affiliation ? (
                            <FiEdit2 className="text-black dark:text-white text-sm" />
                        ) : (
                            <FiPlusCircle className="text-black dark:text-white text-sm" />
                        )}
                    </button>
                </div>
            </div>
        );
    };


    const DirectorateSection = ({ directorate }) => {
        const { position, children } = directorate;

        return (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full text-left shadow-lg">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">{position}</h2>
                <div className="space-y-4">
                    {children.map((child, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-black dark:border-white">
                                <img
                                    src={child.photo_url || '/default-avatar.png'}
                                    alt={child.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => setEditModal({ show: true, type: 'photo', current: child })}
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                                >
                                    <FiEdit2 className="text-black dark:text-white text-xl" />
                                </button>
                            </div>
                            <div className="flex-1">
                                {/* Tambahkan position dari children di sini */}
                                <p className="text-sm text-black dark:text-white font-bold mb-1">
                                    {child.position} {/* Menampilkan position dari children */}
                                </p>
                                <div className="flex items-center gap-1">
                                    <p
                                        className="text-black dark:text-white cursor-pointer"
                                        onClick={() => setEditModal({ show: true, type: 'name', current: child })}
                                    >
                                        {child.name || 'Klik untuk mengisi nama'}
                                    </p>
                                    <button
                                        onClick={() => setEditModal({ show: true, type: 'name', current: child })}
                                    >
                                        {child.name ? (
                                            <FiEdit2 className="text-black dark:text-white text-sm" />
                                        ) : (
                                            <FiPlusCircle className="text-black dark:text-white text-sm" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center gap-1">
                                    <p
                                        className="text-black dark:text-white text-sm cursor-pointer"
                                        onClick={() => setEditModal({ show: true, type: 'affiliation', current: child })}
                                    >
                                        {child.affiliation || 'Klik untuk mengisi afiliasi'}
                                    </p>
                                    <button
                                        onClick={() => setEditModal({ show: true, type: 'affiliation', current: child })}
                                    >
                                        {child.affiliation ? (
                                            <FiEdit2 className="text-black dark:text-white text-sm" />
                                        ) : (
                                            <FiPlusCircle className="text-black dark:text-white text-sm" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 p-6 rounded-lg shadow-md mb-6 ">
            <main className="pt-32 pb-12 px-4 md:px-8">
                {/* Struktur Organisasi */}
                <div className="max-w-7xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-black dark:text-white mb-8 text-center">Struktur Organisasi</h1>
                    <div className="flex justify-center">
                        {data.struktur.map((node) => (
                            <OrganizationNode key={node.id} node={node} isRoot={true} />
                        ))}
                    </div>
                </div>

                {/* Badan Pengawas */}
                <div className="max-w-7xl mx-auto mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-black dark:text-white">Badan Pengawas</h2>
                        <button
                            onClick={() => setAddModal({ show: true, type: 'badanPengawas' })}
                            className="text-black dark:text-white flex items-center gap-1"
                        >
                            <FiPlusCircle className="text-xl" />
                            <span>Tambah</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data.badanPengawas.map((item) => (
                            <BadanPengawasNode key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* Direktorat */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-black dark:text-white">Direktorat</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.direktorat.map((directorate) => (
                            <DirectorateSection key={directorate.id} directorate={directorate} />
                        ))}
                    </div>
                </div>

                {/* Modal untuk Edit Data */}
                <Modal
                    isOpen={editModal.show}
                    onRequestClose={() => setEditModal({ show: false, type: '', current: null })}
                    className="bg-white dark:bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 rounded-lg p-6 max-w-md mx-auto"
                    overlayClassName="fixed inset-0 bg-black/50 z-[1000]"
                >
                    <h2 className="text-xl font-bold mb-4">
                        {editModal.current?.id < 0 ? 'Tambah' : 'Edit'} {editModal.type}
                    </h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData();
                            const node = editModal.current;

                            switch (editModal.type) {
                                case 'photo':
                                    const fileInput = e.target.querySelector('input[type="file"]');
                                    if (fileInput.files[0]) {
                                        formData.append('photo', fileInput.files[0]);
                                    }
                                    break;
                                case 'name':
                                    formData.append('name', e.target.name.value);
                                    break;
                                case 'affiliation':
                                    formData.append('affiliation', e.target.affiliation.value);
                                    break;
                            }

                            handleEdit(formData);
                        }}
                    >
                        {editModal.type === 'photo' && (
                            <input
                                type="file"
                                name="photo"
                                accept="image/*"
                                required={editModal.current?.id < 0}
                                className="mb-4"
                            />
                        )}

                        {editModal.type === 'name' && (
                            <input
                                type="text"
                                name="name"
                                defaultValue={editModal.current?.name || ''}
                                className="w-full p-2 border rounded mb-4 dark:text-black"
                                placeholder="Masukkan nama"
                                required
                            />
                        )}

                        {editModal.type === 'affiliation' && (
                            <input
                                type="text"
                                name="affiliation"
                                defaultValue={editModal.current?.affiliation || ''}
                                className="w-full p-2 border rounded mb-4 dark:text-black"
                                placeholder="Masukkan afiliasi"
                                required
                            />
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setEditModal({ show: false, type: '', current: null })}
                                className="px-4 py-2 text-gray-300 bg-gray-800 rounded"
                            >
                                Batal
                            </button>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                                Simpan
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Modal untuk Tambah Data */}
                <Modal
                    isOpen={addModal.show}
                    onRequestClose={() => setAddModal({ show: false, type: '' })}
                    className="bg-white rounded-lg p-6 max-w-md mx-auto"
                    overlayClassName="fixed inset-0 bg-black/50 z-[1000]"
                >
                    <h2 className="text-xl font-bold mb-4">
                        Tambah {addModal.type === 'badanPengawas' ? 'Badan Pengawas' : 'Direktorat'}
                    </h2>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData();

                        // Hanya tambahkan field yang diharapkan
                        formData.append("name", e.target.name.value);
                        formData.append("affiliation", e.target.affiliation.value);
                        formData.append("jenis", addModal.type.toLowerCase());

                        // Field position hanya untuk Direktorat
                        if (addModal.type === "direktorat") {
                            formData.append("position", e.target.position.value);
                        }

                        // Field photo harus memiliki nama 'photo'
                        const fileInput = e.target.querySelector('input[type="file"]');
                        if (fileInput.files[0]) {
                            formData.append("photo", fileInput.files[0]);
                        }

                        try {
                            const response = await fetch(`${API_BASE_URL}/organisasi`, {
                                method: "POST",
                                body: formData,
                            });

                            if (!response.ok) throw new Error("Gagal menambahkan data");
                            toast.success("Data berhasil ditambahkan");
                            fetchData();
                            setAddModal({ show: false, type: "" });
                        } catch (error) {
                            toast.error(error.message);
                        }
                    }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nama lengkap"
                            className="w-full p-2 border rounded mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="affiliation"
                            placeholder="Afiliasi/Universitas"
                            className="w-full p-2 border rounded mb-2"
                            required
                        />
                        {addModal.type === "direktorat" && (
                            <input
                                type="text"
                                name="position"
                                placeholder="Jabatan"
                                className="w-full p-2 border rounded mb-2"
                                required
                            />
                        )}
                        <input type="file" name="photo" className="mb-4" /> {/* Pastikan name="photo" */}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setAddModal({ show: false, type: "" })}
                                className="px-4 py-2 text-gray-500"
                            >
                                Batal
                            </button>
                            <button type="submit" className="px-4 py-2 bg-green-500 text-black dark:text-white rounded">
                                Tambah
                            </button>
                        </div>
                    </form>
                </Modal>
            </main >
        </div >
    );
};

export default KelolaOrganisasi;