import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function SearchByDate({ onSearch }) {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (selectedDate) {
            // Format tanggal ke YYYY-MM-DD
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            onSearch(formattedDate);
        } else {
            onSearch('');
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center gap-2">
            <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih tanggal"
                className="p-2 border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                isClearable
            />
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                    Cari
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setSelectedDate(null);
                        onSearch('');
                    }}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                >
                    Reset
                </button>
            </div>
        </form>
    );
}