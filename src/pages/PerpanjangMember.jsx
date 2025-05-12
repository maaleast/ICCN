import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import { FaArrowLeft } from "react-icons/fa";
import { API_BASE_URL } from "../config";
import { useLocation } from 'react-router-dom';

const PerpanjangMember = () => {
    const location = useLocation();
    const userInfo = location.state;
    // console.log(userInfo);
    const [formData, setFormData] = useState({
        name: userInfo?.userInfo.nama,
        receiptName: "",
        transferAmount: "",
        buktiPembayaran: null,
    });
    // console.log(formData.name);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAllowed, setIsAllowed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkVerificationStatus = async () => {
            const user_id = localStorage.getItem("user_id");
            if (!user_id) {
                Swal.fire({
                    icon: "error",
                    title: "Akses Ditolak",
                    text: "Anda harus login terlebih dahulu.",
                });
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/members/checkVerificationStatus/${user_id}`);
                const data = await response.json();

                if (data.status === 'PERPANJANG') {
                    setIsAllowed(true);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Akses Ditolak",
                        text: "Anda tidak diizinkan mengakses halaman ini.",
                    });
                    navigate("/home");
                }
            } catch (error) {
                console.error("Error fetching verification status:", error);
                Swal.fire({
                    icon: "error",
                    title: "Terjadi Kesalahan",
                    text: "Gagal memeriksa status verifikasi.",
                });
                navigate("/home");
            }
        };

        checkVerificationStatus();
    }, [navigate]);

    if (!isAllowed) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, buktiPembayaran: e.target.files[0] });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.receiptName.trim()) newErrors.receiptName = "Nama pada Kuitansi wajib diisi!";
        if (!formData.transferAmount.trim()) newErrors.transferAmount = "Jumlah Transfer wajib diisi!";
        if (!formData.buktiPembayaran) newErrors.buktiPembayaran = "Bukti Pembayaran wajib diupload!";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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

    const submitForm = async () => {
        setIsSubmitting(true);

        const formDataToSend = new FormData();
        const user_id = localStorage.getItem("user_id");

        formDataToSend.append("user_id", user_id);
        formDataToSend.append("nama", formData.name);
        formDataToSend.append("nama_kuitansi", formData.receiptName);
        formDataToSend.append("nominal_transfer", formData.transferAmount);
        formDataToSend.append("bukti_pembayaran_perpanjang", formData.buktiPembayaran);
        if (!formData.buktiPembayaran) {
            Swal.fire({
                icon: "warning",
                title: "Peringatan",
                text: "Silakan unggah bukti pembayaran terlebih dahulu.",
            });
            setIsSubmitting(false);
            return;
        }

        try {
            // Kirim data perpanjangan member
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

            // Catat pendapatan dari perpanjangan
            await fetch(`${API_BASE_URL}/keuangan/tambah`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "MASUK",
                    jumlah: parseInt(formData.transferAmount),
                    deskripsi: `Perpanjangan Member - ${formData.receiptName}`,
                    tanggal: new Date().toISOString().split('T')[0],
                }),
            });

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Permohonan perpanjangan member berhasil, menunggu verifikasi",
            }).then(() => {
                navigate("/member");
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">
            <Navbar />
            <div className="flex items-center justify-center min-h-screen p-20 pt-28">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-7xl bg-white shadow-lg rounded-xl flex overflow-hidden"
                >
                    {/* Bagian Kiri */}
                    <div className="w-2/5 p-8 bg-orange-600 text-white flex flex-col justify-center relative">
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
                            {/* Nama member */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Nama</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300 ${errors.name ? "border-red-500" : ""
                                        }`}
                                    placeholder="Nama yang muncul di kuitansi"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>
                            
                            {/* Nama pada Kuitansi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Nama pada Kuitansi</label>
                                <input
                                    type="text"
                                    name="receiptName"
                                    value={formData.receiptName}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300 ${errors.receiptName ? "border-red-500" : ""
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
                                    className={`mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300 ${errors.transferAmount ? "border-red-500" : ""
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
                                    className={`mt-1 block w-full p-3 text-gray-400 border rounded-md focus:ring focus:ring-blue-300 ${errors.buktiPembayaran ? "border-red-500" : ""
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
                                className="w-full py-3 mt-6 text-white bg-orange-600 rounded-md hover:shadow-lg hover:scale-105 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
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