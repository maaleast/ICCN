import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function FiturSearchKeuangan({ onSearch }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    // Gunakan useEffect untuk memicu pencarian setiap kali ada perubahan input
    useEffect(() => {
        const formattedDate = selectedDate
            ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
            : '';

        // Kirim amount sebagai string
        onSearch({
            date: formattedDate,
            description,
            amount: amount.toString(), // Pastikan amount dikirim sebagai string
        });
    }, [selectedDate, description, amount, onSearch]);

    const handleReset = () => {
        setSelectedDate(null);
        setDescription('');
        setAmount('');
    };

    return (
        <div className="flex items-center gap-4">
            {/* Input Tanggal */}
            <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih tanggal"
                className="p-2 border rounded-lg dark:bg-gray-600 dark:text-gray-300 dark:border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                isClearable
            />

            {/* Input Deskripsi */}
            <input
                type="text"
                placeholder="Cari berdasarkan deskripsi"
                className="p-2 border rounded-lg dark:bg-gray-600 dark:text-gray-300 dark:border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* Input Jumlah */}
            <input
                type="text" // Ubah type menjadi "text" untuk memungkinkan input angka dan string
                placeholder="Cari berdasarkan jumlah"
                className="p-2 border rounded-lg dark:bg-gray-600 dark:text-gray-300 dark:border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            {/* Tombol Reset */}
            <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
            >
                Reset
            </button>
        </div>
    );
}