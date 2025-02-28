import React from "react";

const Pagination = ({ currentPage, totalPages, goToPage, prevPage, nextPage }) => {
    const showEllipsis = totalPages > 3;
    const renderPages = () => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 2) {
            return [1, 2];
        }

        if (currentPage >= totalPages - 2) {
            return [totalPages - 2, totalPages - 1, totalPages];
        }

        return [currentPage - 1, currentPage, currentPage + 1];
    };

    return (
        <div className="flex justify-center mt-6"> {/* Container utama untuk pagination */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2 inline-block"> {/* Container pagination */}
                <div className="flex items-center space-x-2">
                    {/* Tombol Previous */}
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                    >
                        &lt;
                    </button>

                    {/* Halaman Pertama dan Ellipsis */}
                    {currentPage > 3 && showEllipsis && (
                        <>
                            <button
                                onClick={() => goToPage(1)}
                                className={`px-3 py-1 rounded-md ${1 === currentPage
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                1
                            </button>
                            <span className="text-gray-400">...</span>
                        </>
                    )}

                    {/* Halaman Utama */}
                    {renderPages().map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-1 rounded-md ${page === currentPage
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Halaman Terakhir dan Ellipsis */}
                    {currentPage < totalPages - 2 && showEllipsis && (
                        <>
                            <span className="text-gray-400">...</span>
                            <button
                                onClick={() => goToPage(totalPages)}
                                className={`px-3 py-1 rounded-md ${totalPages === currentPage
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    {/* Tombol Next */}
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;