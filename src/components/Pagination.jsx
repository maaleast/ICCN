import React from "react";

const Pagination = ({ currentPage, totalPages, goToPage, prevPage, nextPage }) => {
    return (
        <div className="flex justify-center items-center mt-6 space-x-2">
            <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50"
            >
                Awal
            </button>
            <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50"
            >
                ◀
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(currentPage - 2, 0), Math.min(currentPage + 1, totalPages))
                .map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 rounded-md transition ${
                            currentPage === page
                                ? "bg-blue-500 text-white dark:bg-blue-400"
                                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
                        }`}
                    >
                        {page}
                    </button>
                ))}
            <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50"
            >
                ▶
            </button>
            <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50"
            >
                Akhir
            </button>
        </div>
    );
};

export default Pagination;