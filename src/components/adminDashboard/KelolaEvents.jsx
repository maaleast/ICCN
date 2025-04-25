import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Pagination from "../Pagination";

const KelolaEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    judul: '',
    deskripsi_singkat: '',
    deskripsi: '',
    tanggal: '',
    image: null,
    imagePreview: '',
    image_old: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/events/all`);
        const data = await response.json();
        if (data.success) {
          setEvents(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        Swal.fire('Error', 'Failed to fetch events', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle search with null checks
  const filteredEvents = events.filter(event => {
    const title = event.judul ? event.judul.toLowerCase() : '';
    const shortDesc = event.deskripsi_singkat ? event.deskripsi_singkat.toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    
    return title.includes(search) || shortDesc.includes(search);
  });

  // Get current events for pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Handle page change
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      judul: '',
      deskripsi_singkat: '',
      deskripsi: '',
      tanggal: '',
      image: null,
      imagePreview: '',
      image_old: ''
    });
    setIsEditMode(false);
  };

  // Open modal for adding new event
  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  // Open modal for editing event
  const openEditModal = (event) => {
    setFormData({
      id: event.id,
      judul: event.judul,
      deskripsi_singkat: event.deskripsi_singkat || '',
      deskripsi: event.deskripsi,
      tanggal: event.tanggal,
      image: null,
      imagePreview: event.gambar ? `${API_BASE_URL}/uploads/events/${event.gambar}` : '',
      image_old: event.gambar || ''
    });
    setIsEditMode(true);
    setModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.judul || !formData.deskripsi || !formData.tanggal) {
      Swal.fire('Error', 'Judul, deskripsi, dan tanggal wajib diisi', 'error');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.judul);
    formDataToSend.append('shortDescription', formData.deskripsi_singkat);
    formDataToSend.append('description', formData.deskripsi);
    formDataToSend.append('date', formData.tanggal);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    if (formData.image_old) {
      formDataToSend.append('image_old', formData.image_old);
    }

    try {
      const url = isEditMode 
        ? `${API_BASE_URL}/events/update/${formData.id}`
        : `${API_BASE_URL}/events/create`;
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (data.success) {
        Swal.fire('Success', isEditMode ? 'Event berhasil diperbarui' : 'Event berhasil dibuat', 'success');
        // Refresh events
        const eventsResponse = await fetch(`${API_BASE_URL}/events/all`);
        const eventsData = await eventsResponse.json();
        if (eventsData.success) {
          setEvents(eventsData.data);
        }
        setModalOpen(false);
        resetForm();
      } else {
        Swal.fire('Error', data.message || 'Operasi gagal', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire('Error', 'Terjadi kesalahan', 'error');
    }
  };

  // Handle delete event
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/events/delete/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
          Swal.fire('Deleted!', 'Event telah dihapus.', 'success');
          // Refresh events
          const eventsResponse = await fetch(`${API_BASE_URL}/events/all`);
          const eventsData = await eventsResponse.json();
          if (eventsData.success) {
            setEvents(eventsData.data);
          }
        } else {
          Swal.fire('Error', data.message || 'Gagal menghapus event', 'error');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        Swal.fire('Error', 'Gagal menghapus event', 'error');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kelola Events</h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Cari event..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-3 text-gray-400"
          />
        </div>
        <button
          onClick={openAddModal}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Tambah Event
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : currentEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Tidak ada data event</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi Singkat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{event.judul}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600 line-clamp-2">{event.deskripsi_singkat || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-gray-600">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      {formatDate(event.tanggal)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(event)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredEvents.length > eventsPerPage && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </div>
      )}

      {/* Modal for Add/Edit Event */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {isEditMode ? 'Edit Event' : 'Tambah Event Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  {/* Judul */}
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="judul">
                      Judul <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="judul"
                      name="judul"
                      value={formData.judul}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Deskripsi Singkat */}
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="deskripsi_singkat">
                      Deskripsi Singkat
                    </label>
                    <input
                      type="text"
                      id="deskripsi_singkat"
                      name="deskripsi_singkat"
                      value={formData.deskripsi_singkat}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Deskripsi */}
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="deskripsi">
                      Deskripsi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Tanggal */}
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="tanggal">
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="tanggal"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Image Upload */}
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="image">
                      Gambar Event
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.imagePreview && (
                      <div className="mt-4">
                        <img 
                          src={formData.imagePreview} 
                          alt="Preview" 
                          className="max-h-40 rounded-lg border border-gray-200"
                        />
                        <p className="text-sm text-gray-500 mt-1">Pratinjau Gambar</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isEditMode ? 'Update Event' : 'Simpan Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaEvents;