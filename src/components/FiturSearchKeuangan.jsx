import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';

export default function FiturSearchKeuangan({ onSearch }) {
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        const month = selectedMonth
            ? moment(selectedMonth).format('YYYY-MM')
            : '';

        onSearch({
            month,
            description,
            amount
        });
    }, [selectedMonth, description, amount, onSearch]);

    const handleReset = () => {
        setSelectedMonth(null);
        setDescription('');
        setAmount('');
    };

    return (
        <div className="flex items-center gap-4">
            {/* Month Picker */}
            <DatePicker
                selected={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="Pilih bulan"
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
                type="text"
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