import React, { useState } from 'react';
import { API_BASE_URL } from '../../config';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DownloadDataButton = ({ pelatihanId }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        setIsLoading(true);
        
        try {
            // Panggil endpoint export
            const response = await axios({
                url: `${API_BASE_URL}/pelatihan/export-peserta/${pelatihanId}`,
                method: 'GET',
                responseType: 'blob',
            });

            // Ekstrak nama file dari header
            const contentDisposition = response.headers['content-disposition'];
            let filename = `Dataset_Pendaftaran_${pelatihanId}.xlsx`;
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+?)"?(;|$)/);
                if (filenameMatch?.[1]) {
                    filename = decodeURIComponent(filenameMatch[1]);
                }
            }

            // Simpan file
            saveAs(new Blob([response.data]), filename);

            // Notifikasi sukses
            toast.success('File berhasil diunduh!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

        } catch (error) {
            console.error('Download error:', error);
            
            // Notifikasi error
            let errorMessage = 'Terjadi kesalahan saat mengunduh data';
            
            if (error.response) {
                errorMessage = error.response.status === 404 
                    ? 'Data tidak ditemukan!' 
                    : `Error ${error.response.status}: ${error.response.data?.message || errorMessage}`;
            } else if (error.request) {
                errorMessage = 'Tidak ada respon dari server';
            }

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
            });

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={handleDownload}
                disabled={isLoading}
                className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200 flex items-center justify-center
                    ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengunduh...
                    </>
                ) : (
                    'Download Data'
                )}
            </button>
        </>
    );
};

export default DownloadDataButton;