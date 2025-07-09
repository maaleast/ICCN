import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faFileWord } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Pagination from "../Pagination";

const KelolaEvents = () => {
    const [events, setEvents] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
      title: '',
      shortDescription: '',
      description: '',
      startDate: '',
      endDate: '',
      image: null,
      document: null
  });

    const [editEvent, setEditEvent] = useState({
        id: '',
        title: '',
        shortDescription: '',
        description: '',
        date: '',
        image: null,
        oldImage: '',
        document: null,
        oldDocument: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 6;

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '--/--/----';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '--/--/----';

            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return '--/--/----';
        }
    };

    // Fetch all events
    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/events/all`);
            const data = await response.json();
            if (data.success) {
                setEvents(data.data);
                setTotalPages(Math.ceil(data.data.length / itemsPerPage));
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal memuat data events',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle add event
const handleAddEvent = async () => {
  if (!newEvent.title.trim() || !newEvent.description.trim() || !newEvent.startDate) {
      Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Judul, deskripsi, dan tanggal mulai wajib diisi',
      });
      return;
  }

  const formData = new FormData();
  formData.append('title', newEvent.title);
  formData.append('shortDescription', newEvent.shortDescription);
  formData.append('description', newEvent.description);
  formData.append('startDate', newEvent.startDate);
  formData.append('endDate', newEvent.endDate || newEvent.startDate);
  
  if (newEvent.image) {
      formData.append('image', newEvent.image);
  }
  if (newEvent.document) {
      formData.append('document', newEvent.document);
  }

  setIsLoading(true);
  try {
      const response = await fetch(`${API_BASE_URL}/events/create`, {
          method: 'POST',
          body: formData,
      });
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal menambahkan event');
      }

      await fetchEvents();
      setShowAddForm(false);
      setNewEvent({
          title: '',
          shortDescription: '',
          description: '',
          startDate: '',
          endDate: '',
          image: null,
          document: null
      });
      
      Swal.fire('Berhasil', 'Event berhasil ditambahkan', 'success');
  } catch (error) {
      Swal.fire('Gagal', error.message || 'Terjadi kesalahan pada server', 'error');
  } finally {
      setIsLoading(false);
  }
};

// Handle edit event
const handleEditEvent = async () => {
  if (!editEvent.title.trim() || !editEvent.description.trim() || !editEvent.startDate) {
      Swal.fire('Gagal', 'Judul, deskripsi, dan tanggal mulai wajib diisi', 'error');
      return;
  }

  const formData = new FormData();
  formData.append('title', editEvent.title);
  formData.append('shortDescription', editEvent.shortDescription);
  formData.append('description', editEvent.description);
  formData.append('startDate', editEvent.startDate);
  formData.append('endDate', editEvent.endDate || editEvent.startDate);
  formData.append('old_image', editEvent.oldImage || '');
  formData.append('old_document', editEvent.oldDocument || '');

  if (editEvent.image instanceof File) {
      formData.append('image', editEvent.image);
  }
  if (editEvent.document instanceof File) {
      formData.append('document', editEvent.document);
  }

  setIsLoading(true);
  try {
      const response = await fetch(`${API_BASE_URL}/events/update/${editEvent.id}`, {
          method: 'PUT',
          body: formData,
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal memperbarui event');
      }

      await fetchEvents();
      setShowEditForm(false);
      Swal.fire('Berhasil', 'Event berhasil diperbarui', 'success');
  } catch (error) {
      Swal.fire('Gagal', error.message || 'Terjadi kesalahan saat memperbarui', 'error');
  } finally {
      setIsLoading(false);
  }
};

    // Handle delete event
    const handleDeleteEvent = async (id) => {
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
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/events/delete/${id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    await fetchEvents();
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Event berhasil dihapus',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: data.message || 'Gagal menghapus event',
                    });
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Terjadi kesalahan pada server',
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle show detail event
    const handleShowDetail = (event) => {
        setSelectedEvent(event);
        setShowDetailModal(true);
    };

    // Handle open edit modal
const handleOpenEditModal = (event) => {
  setEditEvent({
      id: event.id,
      title: event.judul || '',
      shortDescription: event.deskripsi_singkat || '',
      description: event.deskripsi || '',
      startDate: event.start_date || event.tanggal || '',
      endDate: event.end_date || event.tanggal || '',
      image: null,
      oldImage: event.gambar || '',
      document: null,
      oldDocument: event.document || ''
  });
  setShowEditForm(true);
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

    // Filter events based on search query
    const filteredEvents = events.filter((item) => {
        const title = item?.judul || '';
        const shortDesc = item?.deskripsi_singkat || '';
        const search = searchQuery.toLowerCase();
        return title.toLowerCase().includes(search) || shortDesc.toLowerCase().includes(search);
    });

    // Calculate the current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

    // Function to view Word document with Google Docs Viewer
    const viewWordDocument = (docName) => {
        if (!docName) return;

        const docUrl = `${API_BASE_URL}/uploads/events/${docName}`;
        const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(docUrl)}&embedded=true`;

        window.open(googleDocsViewerUrl, '_blank');
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Kelola Events</h2>

            {/* Search and Add Section */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan judul atau deskripsi..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:text-gray-600"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 hover:shadow-lg transition-all duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? 'Memproses...' : 'Tambah Event'}
                </button>
            </div>

            {isLoading && !showAddForm && !showEditForm ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Events list in vertical grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentItems.map((item) => (
                            <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow">
                                {item.gambar && (
                                    <img
                                        src={`${API_BASE_URL}/events/uploads/events/${item.gambar}`}
                                        alt={item.judul}
                                        className="w-full h-48 object-cover rounded-lg mb-3"
                                    />
                                )}
                                <h3 className="text-lg font-semibold">{item.judul}</h3>
                                
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                    {formatDate(item.tanggal)}
                                </p>

                                {item.document && (
                                    <div className="mt-2">
                                        <button
                                            onClick={() => viewWordDocument(item.document)}
                                            className="flex items-center text-blue-600 dark:text-blue-400 text-sm"
                                        >
                                            <FontAwesomeIcon icon={faFileWord} className="mr-1" />
                                            Lihat Dokumen
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center mt-3 space-x-2">
                                    <button
                                        onClick={() => handleShowDetail(item)}
                                        className="group flex items-center justify-center w-10 h-10 bg-blue-500 text-white border border-blue-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:w-auto px-3"
                                    >
                                        <FaEye className="text-xl transition-all duration-300" />
                                        <span className="opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto group-hover:ml-2 transition-all duration-300">
                                            Detail
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => handleOpenEditModal(item)}
                                        className="group flex items-center justify-center w-10 h-10 bg-orange-500 text-white border border-orange-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:w-auto px-3"
                                    >
                                        <FaEdit className="text-xl transition-all duration-300" />
                                        <span className="opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto group-hover:ml-2 transition-all duration-300">
                                            Edit
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => handleDeleteEvent(item.id)}
                                        className="group flex items-center justify-center w-10 h-10 bg-red-600 text-white border border-red-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:w-auto px-3"
                                    >
                                        <FaTrash className="text-xl transition-all duration-300" />
                                        <span className="opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto group-hover:ml-2 transition-all duration-300">
                                            Hapus
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {filteredEvents.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                goToPage={goToPage}
                                prevPage={prevPage}
                                nextPage={nextPage}
                            />
                        </div>
                    )}

                    {filteredEvents.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchQuery ? 'Tidak ditemukan event yang sesuai dengan pencarian' : 'Belum ada data event'}
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Modal Tambah Event */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Tambah Event Baru</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Judul Event *</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                    placeholder="Masukkan judul event"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Deskripsi *</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                    placeholder="Masukkan deskripsi event"
                                    rows="5"
                                    required
                                />
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Tanggal Mulai *</label>
                                <input
                                    type="date"
                                    value={newEvent.startDate}
                                    onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            {/* End Date (optional) */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    value={newEvent.endDate}
                                    min={newEvent.startDate}
                                    onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Gambar Event</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewEvent({ ...newEvent, image: e.target.files[0] })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Dokumen Word</label>
                                <input
                                    type="file"
                                    accept=".doc,.docx"
                                    onChange={(e) => setNewEvent({ ...newEvent, document: e.target.files[0] })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">Format yang didukung: .doc, .docx</p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                          <button
                              onClick={() => setShowAddForm(false)}
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                          >
                              Batal
                          </button>
                          <button
                              onClick={handleAddEvent}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                              disabled={!newEvent.title || !newEvent.description || !newEvent.startDate}
                          >
                              Simpan
                          </button>
                      </div>
                  </div>
              </div>
          )}

            {/* Modal Edit Event */}
            {showEditForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Edit Event</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Judul Event *</label>
                            <input
                                type="text"
                                value={editEvent.title}
                                onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Deskripsi *</label>
                            <textarea
                                value={editEvent.description}
                                onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                rows={5}
                                required
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                                <label className="block text-sm font-medium mb-1">Tanggal Mulai *</label>
                                <input
                                    type="date"
                                    value={editEvent.startDate}
                                    onChange={(e) => setEditEvent({ ...editEvent, startDate: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            {/* End Date (optional) */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    value={editEvent.endDate}
                                    onChange={(e) => setEditEvent({ ...editEvent, endDate: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Gambar Event</label>
                            {editEvent.oldImage && (
                                <div className="mb-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Gambar saat ini:</p>
                                    <img
                                        src={`${API_BASE_URL}/events/uploads/events/${editEvent.oldImage}`}
                                        alt="Current"
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditEvent({ ...editEvent, image: e.target.files[0] })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Dokumen Word</label>
                            {editEvent.oldDocument && (
                                <div className="mb-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Dokumen saat ini:</p>
                                    <button
                                        onClick={() => viewWordDocument(editEvent.oldDocument)}
                                        className="flex items-center text-blue-600 dark:text-blue-400 text-sm"
                                    >
                                        <FontAwesomeIcon icon={faFileWord} className="mr-1" />
                                        Lihat Dokumen
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                accept=".doc,.docx"
                                onChange={(e) => setEditEvent({ ...editEvent, document: e.target.files[0] })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                            <p className="text-xs text-gray-500 mt-1">Format yang didukung: .doc, .docx</p>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                disabled={isLoading}
                            >
                                Batal
                            </button>
                            <button
                              onClick={handleEditEvent}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              disabled={isLoading || !editEvent.title || !editEvent.description || !editEvent.startDate}
                            >
                              {isLoading ? 'Memperbarui...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detail Event */}
            {showDetailModal && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">{selectedEvent.judul}</h3>

                        {selectedEvent.gambar && (
                            <img
                                src={`${API_BASE_URL}/uploads/events/${selectedEvent.gambar}`}
                                alt={selectedEvent.judul}
                                className="w-full rounded-lg mb-4"
                            />
                        )}

                        {selectedEvent.deskripsi_singkat && (
                            <div className="mb-4">
                                <h4 className="font-medium mb-2">Deskripsi Singkat:</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {selectedEvent.deskripsi_singkat}
                                </p>
                            </div>
                        )}

                        <div className="mb-4">
                            <h4 className="font-medium mb-2">Deskripsi:</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                                {selectedEvent.deskripsi}
                            </p>
                        </div>

                        {selectedEvent.document && (
                            <div className="mb-4">
                                <button
                                    onClick={() => viewWordDocument(selectedEvent.document)}
                                    className="flex items-center text-blue-600 dark:text-blue-400"
                                >
                                    <FontAwesomeIcon icon={faFileWord} className="mr-2" />
                                    Lihat Dokumen Word
                                </button>
                            </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                            <span>Tanggal: {formatDate(selectedEvent.tanggal)}</span>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KelolaEvents;