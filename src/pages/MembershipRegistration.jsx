import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import { FaArrowLeft } from "react-icons/fa";
import { API_BASE_URL } from "../config";

const MembershipRegistration = () => {
    const [formData, setFormData] = useState({
        userType: "",
        institutionName: "",
        websiteLink: "",
        email: "",
        address: "",
        region: "",
        personalName: "",
        transferAmount: "",
        transferAmountRaw: "",
        whatsappGroupNumber: "",
        receiptName: "",
        additionalRegistrations: "",
        documentFile: null,
        pembayaranBukti: null,
        logoFile: null,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, documentFile: e.target.files[0] });
    };

    const handleBuktiBayar = (e) => {
        setFormData({ ...formData, pembayaranBukti: e.target.files[0] });
    };

    const handleLogoChange = (e) => {
        setFormData({ ...formData, logoFile: e.target.files[0] });
    };

    const handleMoneyChange = (e) => {
        let rawValue = e.target.value.replace(/[^\d]/g, "");
        if (!rawValue) {
            setFormData({ ...formData, transferAmount: "", transferAmountRaw: "" });
            return;
        }

        const numericValue = parseInt(rawValue, 10);
        const formattedValue = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numericValue);

        setFormData({ ...formData, transferAmount: formattedValue, transferAmountRaw: rawValue });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.userType) newErrors.userType = "Tipe Keanggotaan wajib diisi!";
        if (!formData.institutionName) newErrors.institutionName = "Nama Institusi wajib diisi!";
        if (!formData.email) newErrors.email = "Email wajib diisi!";
        if (!formData.address) newErrors.address = "Alamat wajib diisi!";
        if (!formData.region) newErrors.region = "Wilayah wajib diisi!";
        if (!formData.personalName) newErrors.personalName = "Nama Personal wajib diisi!";
        if (!formData.transferAmountRaw) newErrors.transferAmount = "Jumlah Transfer wajib diisi!";
        if (!formData.whatsappGroupNumber) newErrors.whatsappGroupNumber = "Nomor WhatsApp wajib diisi!";
        if (!formData.receiptName) newErrors.receiptName = "Nama pada Kuitansi wajib diisi!";
        if (!formData.documentFile) newErrors.documentFile = "Dokumen SK wajib diupload!";
        if (!formData.pembayaranBukti) newErrors.pembayaranBukti = "Bukti Pembayaran wajib diupload!";
        if (["Universitas", "Perusahaan"].includes(formData.userType) && !formData.logoFile) {
            newErrors.logoFile = "Logo wajib diupload untuk tipe keanggotaan ini!";
        }

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
        formDataToSend.append("tipe_keanggotaan", formData.userType);
        formDataToSend.append("institusi", formData.institutionName);
        formDataToSend.append("website", formData.websiteLink);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("alamat", formData.address);
        formDataToSend.append("wilayah", formData.region);
        formDataToSend.append("nama_pembayar", formData.personalName);
        formDataToSend.append("nominal_transfer", formData.transferAmountRaw);
        formDataToSend.append("nomor_wa", formData.whatsappGroupNumber);
        formDataToSend.append("nama_kuitansi", formData.receiptName);
        formDataToSend.append("additional_members_info", formData.additionalRegistrations || "");
        formDataToSend.append("file_sk", formData.documentFile);
        formDataToSend.append("bukti_pembayaran", formData.pembayaranBukti);
        if (formData.logoFile) {
            formDataToSend.append("logo", formData.logoFile);
        }

        try {
            // Kirim data pendaftaran membership
            const response = await fetch(`${API_BASE_URL}/members/register-member`, {
                method: "POST",
                body: formDataToSend,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal mendaftar member");
            }

            // Kirim data pemasukan ke endpoint keuangan
            const pemasukanResponse = await fetch(`${API_BASE_URL}/admin/keuangan/tambah`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    status: 'MASUK',
                    jumlah: parseFloat(formData.transferAmountRaw),
                    deskripsi: `Pendaftaran Membership dari ${formData.institutionName}`,
                }),
            });

            if (!pemasukanResponse.ok) {
                throw new Error("Gagal menyimpan pemasukan");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Pendaftaran member berhasil, menunggu verifikasi",
            });

            navigate("/member", { state: { membershipData: data } });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat mendaftar",
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

                        <div className="mb-24">
                            <h2 className="text-3xl font-extrabold mb-4">Bergabung Sekarang!</h2>
                            <p className="text-lg leading-relaxed mb-4">
                                Daftarkan institusi atau perusahaan Anda dan dapatkan akses eksklusif ke komunitas kami!
                            </p>
                            <div className="px-28 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition inline-block">
                                Isi Formulir di samping ya!
                            </div>
                        </div>

                        <div className="mt-24">
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
                            Formulir Pendaftaran Membership
                        </h2>
                        <form className="space-y-5">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Tipe Keanggotaan</label>
                                    <select
                                        name="userType"
                                        value={formData.userType}
                                        onChange={handleChange}
                                        className="mt-1 block w-full p-3 text-gray-400 border rounded-md focus:ring focus:ring-blue-300"
                                    >
                                        <option value="">Pilih...</option>
                                        <option value="Universitas">Universitas</option>
                                        <option value="Perusahaan">Perusahaan</option>
                                        <option value="Individu">Individu/Pribadi</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Nama Institusi / Perusahaan / Individu</label>
                                    <input type="text" name="institutionName" value={formData.institutionName} onChange={handleChange} className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300" placeholder="Masukkan nama institusi, perusahaan, atau individu" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Link Website</label>
                                    <input type="text" name="websiteLink" value={formData.websiteLink} onChange={handleChange} className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300" placeholder="https://example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300" placeholder="contoh@email.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Alamat</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300" placeholder="Alamat lengkap institusi/perusahaan" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Wilayah</label>
                                    <input type="text" name="region" value={formData.region} onChange={handleChange} className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300" placeholder="Provinsi/Kota" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Nama Personal <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Nama Personal yang dibayarkan iuran keanggotaan ICCN
                                </p>
                                <input type="text" name="personalName" value={formData.personalName} onChange={handleChange} className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300" placeholder="Masukkan nama Anda" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Nama pada Kuitansi</label>
                                    <input type="text" name="receiptName" value={formData.receiptName} onChange={handleChange} className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300" placeholder="Nama yang muncul di kuitansi" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Jumlah Transfer</label>
                                    <input
                                        type="text"
                                        name="transferAmount"
                                        value={formData.transferAmount}
                                        onChange={handleMoneyChange}
                                        className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                                        placeholder="Rp 0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Nomor Whatsapp <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-gray-500 mb-2">
                                        yang akan dimasukkan kedalam group WA
                                    </p>
                                    <input type="text" name="whatsappGroupNumber" value={formData.whatsappGroupNumber} onChange={handleChange} className="mt-6 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300" placeholder="Contoh: 081234567890" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Pendaftaran Tambahan (Opsional) <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-gray-500 mb-2">
                                        Silahkan diisi jika mendaftar lebih dari satu. Nama yang ditulis pada kuitansi atas nama siapa?
                                    </p>
                                    <input type="text" name="additionalRegistrations" value={formData.additionalRegistrations} onChange={handleChange} className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300" placeholder="Nama tambahan jika ada" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">Upload Dokumen</label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Upload SK Pengelola Pusat Karir / Surat Tugas / Surat Pernyataan / SK Delegasi dari Perusahaan
                                </p>
                                <input
                                    type="file"
                                    name="documentFile"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full p-3 text-gray-400 border rounded-md focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">Upload Bukti Pembayaran</label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Silahkan Upload Bukti Pembayaran Yang Sudah Anda Lakukan!
                                </p>
                                <input
                                    type="file"
                                    name="pembayaranBukti"
                                    onChange={handleBuktiBayar}
                                    className="mt-1 block w-full p-3 text-gray-400 border rounded-md focus:ring focus:ring-blue-300"
                                />
                            </div>

                            {/* Conditional Rendering untuk Upload Logo */}
                            {["Universitas", "Perusahaan"].includes(formData.userType) && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Upload Logo</label>
                                    <p className="text-xs text-gray-500 mb-2">
                                        Silahkan Upload Logo Institusi/Perusahaan Anda (Format: PNG/JPG)
                                    </p>
                                    <input
                                        type="file"
                                        name="logoFile"
                                        onChange={handleLogoChange}
                                        className="mt-1 block w-full p-3 text-gray-400 border rounded-md focus:ring focus:ring-blue-300"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-3 mt-6 text-white bg-blue-700 rounded-md hover:bg-sky-800 hover:scale-105 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Mengirim..." : "Daftar Sekarang"}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MembershipRegistration;