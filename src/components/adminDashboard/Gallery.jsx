import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from '../../config';
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import Pagination from "../Pagination";

export default function Gallery() {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [keterangan, setKeterangan] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const photosPerPage = 8;

    // Fungsi untuk membangun URL gambar lengkap
    const getImageUrl = (filename) => {
        if (!filename) return '';
        // Jika sudah URL lengkap (untuk kompatibilitas dengan data lama)
        if (filename.startsWith('http')) return filename;
        // Bangun URL baru
        return `${API_BASE_URL}/uploads/gallery/${filename}`;
    };

    // Fungsi untuk memformat tanggal
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    // Ambil data foto dari backend
    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/gallery`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (Array.isArray(data)) {
                // Pastikan semua foto memiliki URL yang benar
                const validPhotos = data.map(photo => ({
                    ...photo,
                    image_url: getImageUrl(photo.image_url)
                })).filter(photo => 
                    photo.id && photo.image_url && photo.created_at && photo.keterangan_foto
                );
                
                setPhotos(validPhotos);
            } else {
                console.error("Data yang diterima bukan array:", data);
                setPhotos([]);
            }
        } catch (error) {
            console.error("Gagal mengambil data foto:", error);
            Swal.fire("Error", "Gagal mengambil data foto", "error");
            setPhotos([]);
        }
    };

    const handleDeletePhoto = async (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Foto ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API_BASE_URL}/admin/gallery/delete/${id}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    setPhotos(photos.filter((photo) => photo.id !== id));
                    Swal.fire("Terhapus!", "Foto telah dihapus.", "success");
                } catch (error) {
                    console.error("Gagal menghapus foto:", error);
                    Swal.fire("Error", "Gagal menghapus foto", "error");
                }
            }
        });
    };

    const handleAddPhoto = async (files, keterangan) => {
    if (!files || files.length === 0) {
        Swal.fire("Error", "Tidak ada file yang dipilih", "error");
        return;
    }

    // Cek ukuran file sebelum upload
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
        Swal.fire({
            title: "File Terlalu Besar",
            html: `File <b>${oversizedFiles[0].name}</b> melebihi batas 5MB<br>Ukuran: ${(oversizedFiles[0].size / (1024 * 1024)).toFixed(2)}MB`,
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    const formData = new FormData();
    files.forEach((file) => {
        formData.append("images", file);
    });
    formData.append("keterangan", keterangan);

    try {
        const response = await fetch(`${API_BASE_URL}/admin/gallery/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.message === 'Ukuran file melebihi batas maksimal 5MB') {
                Swal.fire({
                    title: "File Terlalu Besar",
                    text: "Salah satu file melebihi batas maksimal 5MB",
                    icon: "error"
                });
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
            const newPhotos = data.data.map(photo => ({
                ...photo,
                image_url: getImageUrl(photo.image_url)
            }));
            
            setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
            Swal.fire("Berhasil!", "Foto baru telah ditambahkan.", "success");
            setUploadModalOpen(false);
            setSelectedFiles([]);
            setKeterangan('');
        } else {
            throw new Error("Data yang diterima tidak valid");
        }
    } catch (error) {
        console.error("Gagal mengunggah foto:", error);
        Swal.fire("Error", "Gagal mengunggah foto", "error");
    }
};


    const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);
    const maxAllowed = 5 - index;
    const filesToAdd = files.slice(0, maxAllowed);

    // Cek ukuran file
    const oversizedFiles = filesToAdd.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
        Swal.fire({
            title: "File Terlalu Besar",
            html: `File <b>${oversizedFiles[0].name}</b> melebihi batas 5MB<br>Ukuran: ${(oversizedFiles[0].size / (1024 * 1024)).toFixed(2)}MB`,
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    if (filesToAdd.length > 0) {
        const newFiles = [...selectedFiles];
        for (let i = 0; i < filesToAdd.length; i++) {
            newFiles[index + i] = filesToAdd[i];
        }
        setSelectedFiles(newFiles);
    }
};

    const getVisibleBoxes = () => {
        const totalFilled = selectedFiles.filter(file => file).length;
        return Math.min(Math.max(totalFilled + 1, 1), 5);
    };

    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
    };

    const openUploadModal = () => {
        setUploadModalOpen(true);
    };

    const closeUploadModal = () => {
        setUploadModalOpen(false);
        setSelectedFiles([]);
    };

    const openModal = (photo) => {
        if (photo && photo.id && photo.image_url && photo.created_at && photo.keterangan_foto) {
            setSelectedPhoto(photo);
            setIsModalOpen(true);
        } else {
            console.error("Foto tidak valid:", photo);
            Swal.fire("Error", "Foto tidak valid atau data tidak lengkap", "error");
        }
    };

    const closeModal = () => {
        setSelectedPhoto(null);
        setIsModalOpen(false);
    };

    // Pagination logic
    const totalPages = Math.ceil(photos.length / photosPerPage);
    const indexOfLastPhoto = currentPage * photosPerPage;
    const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
    const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

    const goToPage = (page) => setCurrentPage(page);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Galeri Kegiatan</h3>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300"
                    onClick={openUploadModal}
                >
                    Tambah Foto
                </button>
            </div>

            {photos.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">Belum ada foto di galeri</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentPhotos.map((photo) => (
                            <div key={photo.id} className="relative group">
                                <img
                                    src={photo.image_url}
                                    alt={`Kegiatan ${photo.id}`}
                                    className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => openModal(photo)}
                                />
                                <button
                                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePhoto(photo.id);
                                    }}
                                >
                                    <FaTrash size={14} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-sm truncate">
                                        {photo.keterangan_foto}
                                    </p>
                                    <p className="text-xs">
                                        {formatDate(photo.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {photos.length > photosPerPage && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                goToPage={goToPage}
                                prevPage={prevPage}
                                nextPage={nextPage}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Preview Modal */}
            {isModalOpen && selectedPhoto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto relative">
                        <button
                            className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
                            onClick={closeModal}
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                        <img
                            src={selectedPhoto.image_url}
                            alt={`Kegiatan ${selectedPhoto.id}`}
                            className="w-full h-auto rounded-lg mb-4"
                        />
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg dark:text-white">
                                {selectedPhoto.keterangan_foto}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Diposting pada: {formatDate(selectedPhoto.created_at)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {uploadModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold dark:text-white">Upload Foto Baru</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                                onClick={closeUploadModal}
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Keterangan Foto
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={keterangan}
                                    onChange={(e) => setKeterangan(e.target.value)}
                                    placeholder="Deskripsi foto"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Pilih Foto (Maksimal 5)
                                    <br></br>
                                    <p className="text-xs text-red-500 italic">File maksimum 5mb saja</p>
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[...Array(5)].map((_, index) => (
                                        <div key={index} className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                            {selectedFiles[index] ? (
                                                <>
                                                    <img
                                                        src={URL.createObjectURL(selectedFiles[index])}
                                                        alt={`Preview ${index}`}
                                                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                                    />
                                                    <button
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                                        onClick={() => removeFile(index)}
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center cursor-pointer p-2 text-center">
                                                    <FaPlus className="text-gray-400 mb-1" />
                                                    <span className="text-xs text-gray-500">Tambahkan</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e) => handleFileChange(e, index)}
                                                        accept="image/*"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                className={`w-full py-2 px-4 rounded-md text-white ${selectedFiles.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                onClick={() => handleAddPhoto(selectedFiles.filter(Boolean), keterangan)}
                                disabled={selectedFiles.length === 0}
                            >
                                Upload {selectedFiles.length} Foto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}