import React, { useState } from 'react';

const Translator = () => {
    const [inputText, setInputText] = useState('');
    const [targetLang, setTargetLang] = useState('id'); // Default: Indonesia
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Daftar bahasa yang didukung (contoh)
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'id', name: 'Indonesia' },
    ];

    const handleTranslate = async () => {
        if (!inputText) return;

        setIsLoading(true);

        try {
            const response = await fetch('https://libretranslate.com/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: inputText,
                    source: 'auto', // Deteksi bahasa otomatis
                    target: targetLang,
                    format: 'text',
                }),
            });

            const data = await response.json();
            setTranslatedText(data.translatedText);
        } catch (error) {
            console.error('Gagal menerjemahkan:', error);
            setTranslatedText('Terjadi kesalahan saat menerjemahkan!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
            {/* Input Text */}
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Masukkan teks..."
                className="w-full p-2 mb-4 border rounded-md"
                rows="4"
            />

            {/* Pilih Bahasa */}
            <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full p-2 mb-4 border rounded-md"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>

            {/* Tombol Terjemahkan */}
            <button
                onClick={handleTranslate}
                disabled={isLoading}
                className={`w-full p-2 text-white rounded-md ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
            >
                {isLoading ? 'Menerjemahkan...' : 'Terjemahkan'}
            </button>

            {/* Hasil Terjemahan */}
            {translatedText && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-800">{translatedText}</p>
                </div>
            )}
        </div>
    );
};

export default Translator;