export default function PriceSetting() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-6 dark:text-gray-100">Pengaturan Harga</h3>
            <form>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Harga Pelatihan CCOP1</label>
                    <input
                        type="number"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                        defaultValue="500000"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Harga Pelatihan CCOP2</label>
                    <input
                        type="number"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                        defaultValue="750000"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    Simpan Perubahan
                </button>
            </form>
        </div>
    );
}