import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from '../../config'; // Import API_BASE_URL dari config.js
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa"; // Import ikon sampah, plus, dan close dari FontAwesome
import Pagination from "../Pagination";

export default function Gallery() {
    const [photos, setPhotos] = useState([]); // Inisialisasi dengan array kosong
    const [selectedPhoto, setSelectedPhoto] = useState(null); // State untuk menyimpan foto yang dipilih
    const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol tampilan modal
    const [uploadModalOpen, setUploadModalOpen] = useState(false); // State untuk mengontrol tampilan modal upload
    const [selectedFiles, setSelectedFiles] = useState([]); // State untuk menyimpan file yang dipilih

    // Fungsi untuk memformat tanggal
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options); // Format tanggal Indonesia
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

            // Pastikan data adalah array
            if (Array.isArray(data)) {
                setPhotos(data);
            } else {
                console.error("Data yang diterima bukan array:", data);
                setPhotos([]); // Set ke array kosong jika data tidak valid
            }
        } catch (error) {
            console.error("Gagal mengambil data foto:", error);
            Swal.fire("Error", "Gagal mengambil data foto", "error");
            setPhotos([]); // Set ke array kosong jika terjadi error
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

    const handleAddPhoto = async (files) => {
        if (!files || files.length === 0) {
            Swal.fire("Error", "Tidak ada file yang dipilih", "error");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images", file); // Append setiap file ke FormData
        });

        try {
            const response = await fetch(`${API_BASE_URL}/admin/gallery/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setPhotos(prevPhotos => [...prevPhotos, ...data.data]); // Tambahkan foto baru ke state
            Swal.fire("Berhasil!", "Foto baru telah ditambahkan.", "success");
            setUploadModalOpen(false); // Tutup modal setelah upload
            setSelectedFiles([]); // Reset selected files
        } catch (error) {
            console.error("Gagal mengunggah foto:", error);
            Swal.fire("Error", "Gagal mengunggah foto", "error");
        }
    };

    const handleFileChange = (e, index) => {
        const files = Array.from(e.target.files);
        const maxAllowed = 5 - index;
        const filesToAdd = files.slice(0, maxAllowed);

        if (filesToAdd.length > 0) {
            const newFiles = [...selectedFiles];

            // Isi file mulai dari index yang dipilih
            for (let i = 0; i < filesToAdd.length; i++) {
                newFiles[index + i] = filesToAdd[i];
            }

            setSelectedFiles(newFiles);
        }
    };

    // Fungsi untuk menghitung jumlah kotak yang harus ditampilkan
    const getVisibleBoxes = () => {
        const totalFilled = selectedFiles.filter(file => file).length;
        return Math.min(Math.max(totalFilled + 1, 1), 5);
    };

    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index); // Hapus file berdasarkan index
        setSelectedFiles(newFiles);
    };

    const openUploadModal = () => {
        setUploadModalOpen(true);
    };

    const closeUploadModal = () => {
        setUploadModalOpen(false);
        setSelectedFiles([]); // Reset selected files saat modal ditutup
    };

    // Fungsi untuk membuka modal dan menyimpan foto yang dipilih
    const openModal = (photo) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal
    const closeModal = () => {
        setSelectedPhoto(null);
        setIsModalOpen(false);
    };

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const photosPerPage = 8; // Jumlah foto per halaman
    const totalPages = Math.ceil(photos.length / photosPerPage);

    // Pagination functions
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const indexOfLastPhoto = currentPage * photosPerPage;
    const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
    const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);


    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Galeri Kegiatan</h3>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 cursor-pointer"
                    onClick={openUploadModal}
                >
                    Tambah Foto
                </button>
            </div>

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
                            onClick={() => handleDeletePhoto(photo.id)}
                        >
                            <FaTrash />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-sm">Foto Kegiatan ICCN ({formatDate(photo.created_at)})</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal untuk menampilkan foto secara jelas */}
            {isModalOpen && selectedPhoto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 relative">
                        <button
                            className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
                            onClick={closeModal}
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                        <img
                            src={selectedPhoto.image_url}
                            alt={`Kegiatan ${selectedPhoto.id}`}
                            className="w-full h-auto rounded-lg"
                        />
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Foto Kegiatan ICCN ({formatDate(selectedPhoto.created_at)})
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {photos.length > photosPerPage && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    prevPage={prevPage}
                    nextPage={nextPage}
                />
            )}

            {/* Modal untuk upload multiple foto */}
            {uploadModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 relative">
                        <button
                            className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                            onClick={closeUploadModal}
                        >
                            &times;
                        </button>
                        <h2 className="font-bold text-gray-600">
                            Upload Foto <span className="text-red-500">*</span>
                        </h2>
                        <p className="text-xs text-gray-500 mb-2">
                            Maksimal upload 5 foto
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {[...Array(getVisibleBoxes())].map((_, index) => (
                                <div key={index} className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    {selectedFiles[index] ? (
                                        <div className="relative">
                                            <img
                                                src={URL.createObjectURL(selectedFiles[index])}
                                                alt={`Preview ${index}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                                                onClick={() => removeFile(index)}
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <FaPlus className="text-gray-400" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, index)}
                                                accept="image/*"
                                                multiple // Tambahkan atribut multiple di sini
                                            />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 cursor-pointer mt-4"
                            onClick={() => handleAddPhoto(selectedFiles.filter(file => file))}
                            disabled={selectedFiles.filter(file => file).length === 0}
                        >
                            Upload {selectedFiles.filter(file => file).length} Foto
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}