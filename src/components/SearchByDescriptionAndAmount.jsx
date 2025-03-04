import React, { useState } from 'react';

export default function SearchByDescriptionAndAmount({ onSearch }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleSearch = () => {
        onSearch({ description, amount });
    };

    return (
        <div className="flex items-center gap-4">
            <input
                type="text"
                placeholder="Cari berdasarkan deskripsi"
                className="p-2 border rounded dark:text-gray-800"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="number"
                placeholder="Cari berdasarkan jumlah"
                className="p-2 border rounded dark:text-gray-800"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
                Cari
            </button>
        </div>
    );
}