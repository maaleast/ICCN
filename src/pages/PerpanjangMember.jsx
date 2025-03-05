import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import { FaArrowLeft } from "react-icons/fa";
import { API_BASE_URL } from "../config";

const PerpanjangMember = () => {
    const [formData, setFormData] = useState({
        receiptName: "", // Nama pada kuitansi
        transferAmount: "", // Jumlah transfer
        buktiPembayaran: null, // Bukti pembayaran
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAllowed, setIsAllowed] = useState(false); // State untuk izin akses
    const navigate = useNavigate();

    // Cek status verifikasi sebelum mengizinkan akses
    useEffect(() => {
        const checkVerificationStatus = async () => {
            const user_id = localStorage.getItem("user_id");
            if (!user_id) {
                Swal.fire({
                    icon: "error",
                    title: "Akses Ditolak",
                    text: "Anda harus login terlebih dahulu.",
                });
                navigate("/login"); // Arahkan ke halaman login jika tidak ada user_id
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/members/checkVerificationStatus/${user_id}`);
                const data = await response.json();

                if (data.status === 'PENDING PERPANJANG') {
                    setIsAllowed(true); // Izinkan akses jika status adalah 'PENDING PERPANJANG'
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Akses Ditolak",
                        text: "Anda tidak diizinkan mengakses halaman ini.",
                    });
                    navigate("/home"); // Arahkan ke halaman home jika status tidak sesuai
                }
            } catch (error) {
                console.error("Error fetching verification status:", error);
                Swal.fire({
                    icon: "error",
                    title: "Terjadi Kesalahan",
                    text: "Gagal memeriksa status verifikasi.",
                });
                navigate("/home"); // Arahkan ke halaman home jika terjadi error
            }
        };

        checkVerificationStatus();
    }, [navigate]);

    // Jika tidak diizinkan, tampilkan loading atau null
    if (!isAllowed) {
        return null; // Atau tampilkan loading spinner
    }

    // Handle perubahan input text
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle perubahan file upload
    const handleFileChange = (e) => {
        setFormData({ ...formData, buktiPembayaran: e.target.files[0] });
    };

    // Validasi form
    const validateForm = () => {
        let newErrors = {};
        if (!formData.receiptName.trim()) newErrors.receiptName = "Nama pada Kuitansi wajib diisi!";
        if (!formData.transferAmount.trim()) newErrors.transferAmount = "Jumlah Transfer wajib diisi!";
        if (!formData.buktiPembayaran) newErrors.buktiPembayaran = "Bukti Pembayaran wajib diupload!";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            Swal.fire({
                icon: "warning",
                title: "Form Belum Lengkap!",
                text: "Harap isi semua bidang yang wajib diisi!",
            });
            return;
        }

        Swal.fire({
            title: "Apakah Anda Sudah Yakin?",
            text: "Silahkan periksa kembali jika ada yang salah",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Lanjutkan",
            cancelButtonText: "Cek Kembali",
        }).then((result) => {
            if (result.isConfirmed) {
                submitForm();
            }
        });
    };

    // Fungsi submitForm() untuk mengirimkan data
    const submitForm = async () => {
        setIsSubmitting(true);

        const formDataToSend = new FormData();
        const user_id = localStorage.getItem("user_id");

        formDataToSend.append("user_id", user_id);
        formDataToSend.append("nama_kuitansi", formData.receiptName);
        formDataToSend.append("nominal_transfer", formData.transferAmount);
        formDataToSend.append("bukti_pembayaran_perpanjang", formData.buktiPembayaran);

        try {
            const response = await fetch(`${API_BASE_URL}/members/request-perpanjang`, {
                method: "POST",
                body: formDataToSend,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal mengajukan perpanjangan");
            }

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Permohonan perpanjangan member berhasil, menunggu verifikasi",
            }).then(() => {
                navigate("/home");
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat mengajukan perpanjangan",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-800 to-blue-500">
            <Navbar />
            <div className="flex items-center justify-center min-h-screen p-20 pt-28">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-7xl bg-white shadow-lg rounded-xl flex overflow-hidden"
                >
                    {/* Bagian Kiri */}
                    <div className="w-2/5 p-8 bg-blue-700 text-white flex flex-col justify-center relative">
                        <button
                            onClick={() => navigate("/home")}
                            className="absolute top-4 left-4 flex items-center text-white hover:text-blue-300 transition-all"
                        >
                            <FaArrowLeft size={20} className="mr-2" />
                        </button>

                        {/* Bagian Atas - Nomor Rekening */}
                        <div className="mt-15">
                            <h3 className="text-xl font-bold mb-4">Transfer ke Rekening ICCN:</h3>
                            <div className="bg-white/10 p-4 rounded-lg">
                                <p className="font-mono text-lg mb-2">BCA: 123 456 7890</p>
                                <p className="font-mono text-lg">Mandiri: 098 765 4321</p>
                            </div>
                            <p className="mt-4 text-sm">
                                Pastikan transfer sesuai nominal yang tertera di formulir
                            </p>
                        </div>
                    </div>

                    {/* Bagian Kanan */}
                    <div className="w-3/5 p-8">
                        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                            Formulir Perpanjangan Membership
                        </h2>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Nama pada Kuitansi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Nama pada Kuitansi</label>
                                <input
                                    type="text"
                                    name="receiptName"
                                    value={formData.receiptName}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300 ${
                                        errors.receiptName ? "border-red-500" : ""
                                    }`}
                                    placeholder="Nama yang muncul di kuitansi"
                                />
                                {errors.receiptName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.receiptName}</p>
                                )}
                            </div>

                            {/* Jumlah Transfer */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Jumlah Transfer</label>
                                <input
                                    type="text"
                                    name="transferAmount"
                                    value={formData.transferAmount}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300 ${
                                        errors.transferAmount ? "border-red-500" : ""
                                    }`}
                                    placeholder="Contoh: 500000"
                                />
                                {errors.transferAmount && (
                                    <p className="text-red-500 text-sm mt-1">{errors.transferAmount}</p>
                                )}
                            </div>

                            {/* Upload Bukti Pembayaran */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Upload Bukti Pembayaran</label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Silahkan Upload Bukti Pembayaran Yang Sudah Anda Lakukan!
                                </p>
                                <input
                                    type="file"
                                    name="buktiPembayaran"
                                    onChange={handleFileChange}
                                    className={`mt-1 block w-full p-3 text-gray-400 border rounded-md focus:ring focus:ring-blue-300 ${
                                        errors.buktiPembayaran ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.buktiPembayaran && (
                                    <p className="text-red-500 text-sm mt-1">{errors.buktiPembayaran}</p>
                                )}
                            </div>

                            {/* Tombol Perpanjang Sekarang */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 mt-6 text-white bg-blue-700 rounded-md hover:bg-sky-800 hover:scale-105 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Mengirim..." : "Perpanjang Sekarang"}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PerpanjangMember;