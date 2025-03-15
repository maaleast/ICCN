import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        userType: "",
        institutionName: "",
        websiteLink: "",
        address: "",
        region: "",
        personalName: "",
        transferAmount: "",
        whatsappGroupNumber: "",
        receiptName: "",
        additional_members_info: "",
        file_sk: null,
        bukti_pembayaran: null,
        logo: null,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const isNextDisabled = !formData.username || !formData.email || !formData.password;
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
    };

    const handleNext = () => {
        setStep(2);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key]) {
                formDataToSend.append(key, formData[key] || "");
            }
        });

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register-member`, {
                method: "POST",
                body: formDataToSend,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Registrasi gagal!");
            }

            Swal.fire({ icon: "success", title: "Pendaftaran Berhasil!", text: "Silakan tunggu verifikasi." });
            setTimeout(() => navigate("/login"), 5000);
        } catch (error) {
            Swal.fire({ icon: "error", title: "Gagal", text: error.message || "Terjadi kesalahan." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">

            <div className="flex items-center justify-center h-screen">
                {step === 1 ? (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-xl w-96 border border-white/30"
                    >
                        <button
                            onClick={() => navigate("/login")}
                            className="absolute top-4 left-4 text-white hover:text-blue-300 transition-all"
                        >
                            <FaArrowLeft size={20} />
                        </button>

                        <h2 className="text-3xl font-bold text-center text-white mb-6">Daftar</h2>

                        <form className="space-y-4">
                            <input type="text" name="username" placeholder="Username" className="input w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300" onChange={handleChange} />
                            <input type="email" name="email" placeholder="Email" className="input w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300" onChange={handleChange} />
                            <input type="password" name="password" placeholder="Password" className="input w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300" onChange={handleChange} />
                            <motion.button
                                whileHover={!isNextDisabled ? { scale: 1.05 } : {}}
                                whileTap={!isNextDisabled ? { scale: 0.95 } : {}}
                                className={`w-full py-2 text-white font-semibold rounded-lg transition-transform ${isNextDisabled ? "bg-gradient-to-b from-orange-600 to-orange-400  cursor-not-allowed" : "bg-gradient-to-b from-orange-600 to-orange-400 hover:shadow-lg hover:scale-105"
                                    }`}
                                onClick={handleNext}
                                disabled={isNextDisabled}
                            >
                                Register
                            </motion.button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-7xl bg-white shadow-lg rounded-xl flex overflow-hidden"
                    >
                        <div className="w-2/5 p-8 bg-blue-700 text-white flex flex-col justify-center relative">
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
                        <div className="w-3/5 p-8">
                            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Formulir Pendaftaran Membership</h2>
                            <form className="space-y-5" onSubmit={handleRegister} encType="multipart/form-data">
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
                                            <option value="Mahasiswa">Mahasiswa</option>
                                            <option value="Perusahaan">Perusahaan</option>
                                            <option value="Individu">Individu/Pribadi</option>
                                        </select>
                                        {errors.userType && <p className="text-red-500 text-sm mt-1">{errors.userType}</p>}
                                        {errors.userType && <p className="text-red-500 text-sm mt-1">{errors.userType}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Nama Institusi / Perusahaan / Individu</label>
                                        <input
                                            type="text"
                                            name="institutionName"
                                            value={formData.institutionName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                                            placeholder="Masukkan nama institusi, perusahaan, atau individu"
                                        />
                                        {errors.institutionName && <p className="text-red-500 text-sm mt-1">{errors.institutionName}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Link Website</label>
                                        <input
                                            type="text"
                                            name="websiteLink"
                                            value={formData.websiteLink}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                                            placeholder="contoh@email.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Alamat</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                                            placeholder="Alamat lengkap institusi/perusahaan"
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Wilayah</label>
                                        <input
                                            type="text"
                                            name="region"
                                            value={formData.region}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                                            placeholder="Provinsi/Kota"
                                        />
                                        {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Nama Personal <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-gray-500 mb-2">
                                        Nama Personal yang dibayarkan iuran keanggotaan ICCN
                                    </p>
                                    <input
                                        type="text"
                                        name="personalName"
                                        value={formData.personalName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                                        placeholder="Masukkan nama Anda"
                                    />
                                    {errors.personalName && <p className="text-red-500 text-sm mt-1">{errors.personalName}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Nama pada Kuitansi</label>
                                        <input
                                            type="text"
                                            name="receiptName"
                                            value={formData.receiptName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                                            placeholder="Nama yang muncul di kuitansi"
                                        />
                                        {errors.receiptName && <p className="text-red-500 text-sm mt-1">{errors.receiptName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Jumlah Transfer</label>
                                        <input
                                            type="text"
                                            name="transferAmount"
                                            value={formData.transferAmount}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                                            placeholder="Rp 0"
                                        />
                                        {errors.transferAmount && <p className="text-red-500 text-sm mt-1">{errors.transferAmount}</p>}
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
                                        <input
                                            type="text"
                                            name="whatsappGroupNumber"
                                            value={formData.whatsappGroupNumber}
                                            onChange={handleChange}
                                            className="mt-6 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                                            placeholder="Contoh: 081234567890"
                                        />
                                        {errors.whatsappGroupNumber && <p className="text-red-500 text-sm mt-1">{errors.whatsappGroupNumber}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">
                                            Pendaftaran Tambahan (Opsional) <span className="text-red-500">*</span>
                                        </label>
                                        <p className="text-xs text-gray-500 mb-2">
                                            Silahkan diisi jika mendaftar lebih dari satu. Nama yang ditulis pada kuitansi atas nama siapa?
                                        </p>
                                        <input
                                            type="text"
                                            name="additionalRegistrations"
                                            value={formData.additionalRegistrations}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                                            placeholder="Nama tambahan jika ada"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Upload Dokumen</label>
                                    <p className="text-xs text-gray-500 mb-2">
                                        Upload SK Pengelola Pusat Karir / Surat Tugas / Surat Pernyataan / SK Delegasi dari Perusahaan
                                    </p>
                                    <input
                                        type="file"
                                        name="file_sk"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full p-3 text-gray-400 border rounded-md focus:ring focus:ring-blue-300"
                                    />
                                    {errors.documentFile && <p className="text-red-500 text-sm mt-1">{errors.documentFile}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Upload Bukti Pembayaran</label>
                                    <p className="text-xs text-gray-500 mb-2">
                                        Silahkan Upload Bukti Pembayaran Yang Sudah Anda Lakukan!
                                    </p>
                                    <input
                                        type="file"
                                        name="bukti_pembayaran"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full p-3 text-gray-400 border rounded-md focus:ring focus:ring-blue-300"
                                    />
                                    {errors.pembayaranBukti && <p className="text-red-500 text-sm mt-1">{errors.pembayaranBukti}</p>}
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
                                            name="logo"
                                            onChange={handleFileChange}
                                            className="mt-1 block w-full p-3 text-gray-400 border rounded-md focus:ring focus:ring-blue-300"
                                        />
                                        {errors.logoFile && <p className="text-red-500 text-sm mt-1">{errors.logoFile}</p>}
                                    </div>
                                )}

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full py-2 text-white font-semibold bg-blue-700 rounded-lg hover:shadow-lg transition-transform"
                                    disabled={loading}
                                >
                                    {loading ? "Mengirim..." : "Lengkapi Berkas"}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}