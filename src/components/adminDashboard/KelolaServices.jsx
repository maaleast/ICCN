import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLightbulb, faBriefcase, faGraduationCap, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Pagination from "../Pagination";
import Select from 'react-select';

// Fungsi helper untuk memformat tanggal
const formatDate = (dateString) => {
    if (!dateString) return '--/--/---- --:--';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '--/--/---- --:--';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '--/--/---- --:--';
    }
};

const Services = () => {
    const [services, setServices] = useState([]);
    const [filter, setFilter] = useState({ value: 'all', label: 'Semua' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [newService, setNewService] = useState({
        title: '',
        description: '',
        icon: 'briefcase',
        image: null,
        is_featured: false,
        link: ''
    });
    const [editService, setEditService] = useState({
        id: '',
        title: '',
        description: '',
        icon: 'briefcase',
        image: null,
        image_old: '',
        is_featured: false,
        link: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 6;

    const filterOptions = [
        { value: 'all', label: 'Semua' },
        { value: 'featured', label: 'Featured' },
        { value: 'regular', label: 'Regular' }
    ];

    const iconOptions = [
        { value: 'briefcase', label: 'Briefcase', icon: faBriefcase },
        { value: 'graduation-cap', label: 'Graduation Cap', icon: faGraduationCap },
        { value: 'users', label: 'Users', icon: faUsers },
        { value: 'chart-line', label: 'Chart Line', icon: faChartLine },
        { value: 'lightbulb', label: 'Lightbulb', icon: faLightbulb }
    ];

    // Fetch semua layanan
    const fetchServices = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/services/all`);
            const data = await response.json();
            if (data.success) {
                setServices(data.data);
                setTotalPages(Math.ceil(data.data.length / itemsPerPage));
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    // Fetch layanan berdasarkan filter
    const fetchFilteredServices = async (filterType) => {
        try {
            const endpoint = filterType === 'featured' 
                ? `${API_BASE_URL}/services/featured` 
                : `${API_BASE_URL}/services/regular`;
            
            const response = await fetch(endpoint);
            const data = await response.json();
            if (data.success) {
                setServices(data.data);
                setTotalPages(Math.ceil(data.data.length / itemsPerPage));
            }
        } catch (error) {
            console.error('Error fetching filtered services:', error);
        }
    };

    useEffect(() => {
        if (filter.value === 'all') {
            fetchServices();
        } else {
            fetchFilteredServices(filter.value);
        }
    }, [filter]);

    // Handle tambah layanan
    const handleAddService = async () => {
        if (!newService.title || !newService.description) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Judul dan deskripsi wajib diisi',
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', newService.title);
        formData.append('description', newService.description);
        formData.append('icon', newService.icon);
        formData.append('is_featured', newService.is_featured);
        formData.append('link', newService.link);
        if (newService.image) {
            formData.append('image', newService.image);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/services/create`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                await fetchServices();
                setShowAddForm(false);
                setNewService({ 
                    title: '', 
                    description: '', 
                    icon: 'briefcase', 
                    image: null, 
                    is_featured: false,
                    link: '' 
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Layanan berhasil ditambahkan',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message,
                });
            }
        } catch (error) {
            console.error('Error adding service:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan pada server',
            });
        }
    };

    // Handle edit layanan
    const handleEditService = async () => {
        if (!editService.title || !editService.description) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Judul dan deskripsi wajib diisi',
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', editService.title);
        formData.append('description', editService.description);
        formData.append('icon', editService.icon);
        formData.append('is_featured', editService.is_featured);
        formData.append('link', editService.link);
        if (editService.image) {
            formData.append('image', editService.image);
        }
        if (editService.image_old) {
            formData.append('image_old', editService.image_old);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/services/update/${editService.id}`, {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                await fetchServices();
                setShowEditForm(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Layanan berhasil diperbarui',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message,
                });
            }
        } catch (error) {
            console.error('Error updating service:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan pada server',
            });
        }
    };

    // Handle hapus layanan
    const handleDeleteService = async (id) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Tidak'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_BASE_URL}/services/delete/${id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    await fetchServices();
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Layanan berhasil dihapus',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: data.message,
                    });
                }
            } catch (error) {
                console.error('Error deleting service:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Terjadi kesalahan pada server',
                });
            }
        }
    };

    // Handle buka modal edit
    const handleOpenEditModal = (service) => {
        setEditService({
            id: service.id,
            title: service.title,
            description: service.description,
            icon: service.icon,
            image: null,
            image_old: service.image || '',
            is_featured: service.is_featured,
            link: service.link || ''
        });
        setShowEditForm(true);
    };

    // Handle tampilkan detail layanan
    const handleShowDetail = (service) => {
        setSelectedService(service);
        setShowDetailModal(true);
    };

    // Pagination functions
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter layanan berdasarkan search query
    const filteredServices = services.filter((item) => {
        return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item.description.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Calculate the current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

    // Dapatkan ikon berdasarkan nilai
    const getIcon = (iconValue) => {
        const option = iconOptions.find(opt => opt.value === iconValue);
        return option ? option.icon : faBriefcase;
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Kelola Layanan Career Center</h2>

            {/* Card Penjelasan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-100 dark:border-gray-600">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">Featured Services</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Layanan unggulan yang akan ditampilkan lebih menonjol di halaman utama.
                    </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg border border-green-100 dark:border-gray-600">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">Regular Services</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Layanan reguler yang tersedia untuk semua pengguna Career Center.
                    </p>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Cari layanan..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="flex-grow md:w-48">
                    <Select
                        options={filterOptions}
                        value={filter}
                        onChange={setFilter}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                            control: (provided, state) => ({
                                ...provided,
                                backgroundColor: localStorage.getItem('darkMode') === 'true' ? '#374151' : 'white',
                                borderColor: localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#D1D5DB',
                                minHeight: '42px'
                            }),
                            singleValue: (provided) => ({
                                ...provided,
                                color: localStorage.getItem('darkMode') === 'true' ? 'white' : '#111827'
                            }),
                            input: (provided) => ({
                                ...provided,
                                color: localStorage.getItem('darkMode') === 'true' ? 'white' : '#111827'
                            }),
                            menu: (provided) => ({
                                ...provided,
                                backgroundColor: localStorage.getItem('darkMode') === 'true' ? '#374151' : 'white'
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected 
                                    ? (localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#E5E7EB')
                                    : state.isFocused
                                    ? (localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#F3F4F6')
                                    : 'transparent',
                                color: localStorage.getItem('darkMode') === 'true' ? 'white' : '#111827',
                                ':active': {
                                    backgroundColor: localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#E5E7EB'
                                }
                            })
                        }}
                    />
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                >
                    <FaPlus />
                    <span>Tambah Layanan</span>
                </button>
            </div>

            {/* Daftar layanan dalam grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((item) => (
                    <div 
                        key={item.id} 
                        className={`p-5 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg 
                            ${item.is_featured ? 'border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-gray-700 dark:to-gray-800' : 'bg-white dark:bg-gray-700'}`}
                    >
                        <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-full ${item.is_featured ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-600'}`}>
                                <FontAwesomeIcon 
                                    icon={getIcon(item.icon)} 
                                    className={`text-xl ${item.is_featured ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}`} 
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold dark:text-white">{item.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                    {item.description}
                                </p>
                                {item.link && (
                                    <a 
                                        href={item.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-500 hover:underline mt-2 inline-block"
                                    >
                                        {item.link}
                                    </a>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                            <span className={`text-xs px-2 py-1 rounded ${item.is_featured ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'}`}>
                                {item.is_featured ? 'Featured' : 'Regular'}
                            </span>
                            
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleShowDetail(item)}
                                    className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                                    title="Detail"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    onClick={() => handleOpenEditModal(item)}
                                    className="p-2 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                                    title="Edit"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDeleteService(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                                    title="Hapus"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    prevPage={prevPage}
                    nextPage={nextPage}
                />
            </div>

            {/* Modal Tambah Layanan */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Tambah Layanan Baru</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Judul Layanan *</label>
                                <input
                                    type="text"
                                    value={newService.title}
                                    onChange={(e) => setNewService({...newService, title: e.target.value})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    placeholder="Contoh: Konsultasi Karir"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Deskripsi *</label>
                                <textarea
                                    value={newService.description}
                                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    placeholder="Deskripsi singkat tentang layanan ini"
                                    rows="4"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ikon</label>
                                <Select
                                    options={iconOptions}
                                    value={iconOptions.find(opt => opt.value === newService.icon)}
                                    onChange={(selected) => setNewService({...newService, icon: selected.value})}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    formatOptionLabel={(option) => (
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={option.icon} className="mr-2" />
                                            <span>{option.label}</span>
                                        </div>
                                    )}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            backgroundColor: localStorage.getItem('darkMode') === 'true' ? '#374151' : 'white',
                                            borderColor: localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#D1D5DB',
                                            minHeight: '42px'
                                        }),
                                        singleValue: (provided) => ({
                                            ...provided,
                                            color: localStorage.getItem('darkMode') === 'true' ? 'white' : '#111827'
                                        }),
                                        input: (provided) => ({
                                            ...provided,
                                            color: localStorage.getItem('darkMode') === 'true' ? 'white' : '#111827'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            backgroundColor: localStorage.getItem('darkMode') === 'true' ? '#374151' : 'white'
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected 
                                                ? (localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#E5E7EB')
                                                : state.isFocused
                                                ? (localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#F3F4F6')
                                                : 'transparent',
                                            color: localStorage.getItem('darkMode') === 'true' ? 'white' : '#111827',
                                            ':active': {
                                                backgroundColor: localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#E5E7EB'
                                            }
                                        })
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Gambar Layanan</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewService({...newService, image: e.target.files[0]})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Link Tujuan (opsional)</label>
                                <input
                                    type="text"
                                    value={newService.link}
                                    onChange={(e) => setNewService({...newService, link: e.target.value})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    placeholder="https://example.com/layanan"
                                />
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={newService.is_featured}
                                    onChange={(e) => setNewService({...newService, is_featured: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Tampilkan sebagai layanan unggulan
                                </label>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAddService}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                disabled={!newService.title || !newService.description}
                            >
                                Simpan Layanan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Layanan */}
            {showEditForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Edit Layanan</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Judul Layanan *</label>
                                <input
                                    type="text"
                                    value={editService.title}
                                    onChange={(e) => setEditService({...editService, title: e.target.value})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Deskripsi *</label>
                                <textarea
                                    value={editService.description}
                                    onChange={(e) => setEditService({...editService, description: e.target.value})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    rows="4"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ikon</label>
                                <Select
                                    options={iconOptions}
                                    value={iconOptions.find(opt => opt.value === editService.icon)}
                                    onChange={(selected) => setEditService({...editService, icon: selected.value})}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    formatOptionLabel={(option) => (
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={option.icon} className="mr-2" />
                                            <span>{option.label}</span>
                                        </div>
                                    )}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            backgroundColor: localStorage.getItem('darkMode') === 'true' ? '#374151' : 'white',
                                            borderColor: localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#D1D5DB',
                                            minHeight: '42px'
                                        }),
                                        singleValue: (provided) => ({
                                            ...provided,
                                            color: localStorage.getItem('darkMode') === 'true' ? 'white' : '#111827'
                                        }),
                                        input: (provided) => ({
                                            ...provided,
                                            color: localStorage.getItem('darkMode') === 'true' ? 'white' : '#111827'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            backgroundColor: localStorage.getItem('darkMode') === 'true' ? '#374151' : 'white'
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected 
                                                ? (localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#E5E7EB')
                                                : state.isFocused
                                                ? (localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#F3F4F6')
                                                : 'transparent',
                                            color: localStorage.getItem('darkMode') === 'true' ? 'white' : '#111827',
                                            ':active': {
                                                backgroundColor: localStorage.getItem('darkMode') === 'true' ? '#4B5563' : '#E5E7EB'
                                            }
                                        })
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Gambar Layanan</label>
                                {editService.image_old && (
                                    <div className="mb-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gambar saat ini:</p>
                                        <img 
                                            src={`${API_BASE_URL}/uploads/services/${editService.image_old}`} 
                                            alt="Current" 
                                            className="w-32 h-32 object-cover rounded-lg border dark:border-gray-600"
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditService({...editService, image: e.target.files[0]})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Link Tujuan (opsional)</label>
                                <input
                                    type="text"
                                    value={editService.link}
                                    onChange={(e) => setEditService({...editService, link: e.target.value})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    placeholder="https://example.com/layanan"
                                />
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="edit-featured"
                                    checked={editService.is_featured}
                                    onChange={(e) => setEditService({...editService, is_featured: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="edit-featured" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Tampilkan sebagai layanan unggulan
                                </label>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleEditService}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                disabled={!editService.title || !editService.description}
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal detail layanan */}
            {showDetailModal && selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold dark:text-white">{selectedService.title}</h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3">
                                {selectedService.image ? (
                                    <img
                                        src={`${API_BASE_URL}/uploads/services/${selectedService.image}`}
                                        alt={selectedService.title}
                                        className="w-full h-auto rounded-lg border dark:border-gray-600"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon 
                                            icon={getIcon(selectedService.icon)} 
                                            className="text-4xl text-gray-400 dark:text-gray-500" 
                                        />
                                    </div>
                                )}
                                
                                <div className="mt-4 flex items-center justify-between">
                                    <span className={`text-sm px-3 py-1 rounded-full ${selectedService.is_featured ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'}`}>
                                        {selectedService.is_featured ? 'Featured' : 'Regular'}
                                    </span>
                                    
                                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                                        <FontAwesomeIcon icon={getIcon(selectedService.icon)} className="text-lg" />
                                        <span className="text-sm">{iconOptions.find(opt => opt.value === selectedService.icon)?.label}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="md:w-2/3">
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Deskripsi Layanan</h4>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                        {selectedService.description}
                                    </p>
                                </div>
                                
                                {selectedService.link && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Link Tujuan</h4>
                                        <a 
                                            href={selectedService.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline break-all"
                                        >
                                            {selectedService.link}
                                        </a>
                                    </div>
                                )}
                                
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Dibuat pada: {formatDate(selectedService.created_at)}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Terakhir diperbarui: {formatDate(selectedService.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;