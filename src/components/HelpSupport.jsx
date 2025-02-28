// src/components/HelpSupport.jsx
import { motion } from 'framer-motion';

export default function HelpSupport() {
    const faqs = [
        {
            question: 'Bagaimana cara mendaftar pelatihan?',
            answer: 'Anda dapat mendaftar pelatihan melalui menu "Pelatihan" di dashboard.'
        },
        {
            question: 'Bagaimana cara menghubungi tim dukungan?',
            answer: 'Anda dapat mengirim pesan melalui formulir di bawah ini.'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-800">Bantuan & Dukungan</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">FAQ</h3>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4">
                            <h4 className="text-lg font-medium text-gray-700">{faq.question}</h4>
                            <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Hubungi Kami</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Nama</label>
                            <input
                                type="text"
                                placeholder="Nama Anda"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                placeholder="Email Anda"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Pesan</label>
                            <textarea
                                placeholder="Tulis pesan Anda"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                rows="4"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Kirim Pesan
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}