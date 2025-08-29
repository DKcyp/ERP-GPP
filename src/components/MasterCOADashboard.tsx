import React, { useState } from 'react';
import { Clock, Search, PlusCircle, Edit, Trash2, Download } from 'lucide-react';
import Modal from './Modal'; // Import the Modal component
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Import the ConfirmDeleteModal component

interface COAItem {
  id: string;
  kodeCOA: string;
  namaCOA: string;
  kategori: string;
}

const MasterCOADashboard: React.FC = () => {
  const today = new Date();

  const [dummyData, setDummyData] = useState<COAItem[]>([
    { id: '1', kodeCOA: '1101', namaCOA: 'Kas Besar', kategori: 'Aset Lancar' },
    { id: '2', kodeCOA: '1102', namaCOA: 'Kas Kecil', kategori: 'Aset Lancar' },
    { id: '3', kodeCOA: '1110', namaCOA: 'Bank BCA', kategori: 'Aset Lancar' },
    { id: '4', kodeCOA: '1111', namaCOA: 'Bank Mandiri', kategori: 'Aset Lancar' },
    { id: '5', kodeCOA: '1201', namaCOA: 'Piutang Usaha', kategori: 'Aset Lancar' },
    { id: '6', kodeCOA: '1301', namaCOA: 'Persediaan Barang Dagang', kategori: 'Aset Lancar' },
    { id: '7', kodeCOA: '2101', namaCOA: 'Utang Usaha', kategori: 'Liabilitas Jangka Pendek' },
    { id: '8', kodeCOA: '2102', namaCOA: 'Utang Gaji', kategori: 'Liabilitas Jangka Pendek' },
    { id: '9', kodeCOA: '3101', namaCOA: 'Modal Disetor', kategori: 'Ekuitas' },
    { id: '10', kodeCOA: '4101', namaCOA: 'Pendapatan Penjualan', kategori: 'Pendapatan' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  // State for the generic COA Modal (Add/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCOA, setEditingCOA] = useState<COAItem | null>(null); // Stores the COA item being edited, or null for adding
  const [isEditing, setIsEditing] = useState(false); // True if editing, false if adding

  // State for Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [coaToDelete, setCoaToDelete] = useState<COAItem | null>(null);

  const availableCategories = Array.from(new Set(dummyData.map(item => item.kategori)));

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}, Kategori: ${filterKategori}`);
    // Implement actual search logic here
  };

  const handleAdd = () => {
    setIsEditing(false);
    setEditingCOA({ id: '', kodeCOA: '', namaCOA: '', kategori: 'Aset Lancar' }); // Initialize with empty values
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const coaToEdit = dummyData.find(item => item.id === id);
    if (coaToEdit) {
      setIsEditing(true);
      setEditingCOA(coaToEdit);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCOA(null); // Clear editing COA data
    setIsEditing(false); // Reset editing state
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingCOA) {
      setEditingCOA(prev => ({ ...prev!, [name]: value }));
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCOA) return; // Should not happen if form is properly managed

    if (isEditing) {
      // Update existing COA
      setDummyData(prev =>
        prev.map(item => (item.id === editingCOA.id ? editingCOA : item))
      );
      alert(`COA ${editingCOA.id} berhasil diperbarui.`);
    } else {
      // Add new COA
      const newId = (Math.max(...dummyData.map(item => parseInt(item.id))) + 1).toString();
      const coaToAdd = { ...editingCOA, id: newId };
      setDummyData(prev => [...prev, coaToAdd]);
      alert(`COA Baru Ditambahkan: ${JSON.stringify(coaToAdd)}`);
    }
    handleCloseModal(); // Close modal after submission
  };

  const handleDelete = (id: string) => {
    const coa = dummyData.find(item => item.id === id);
    if (coa) {
      setCoaToDelete(coa);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (coaToDelete) {
      setDummyData(prev => prev.filter(item => item.id !== coaToDelete.id));
      alert(`COA ${coaToDelete.kodeCOA} - ${coaToDelete.namaCOA} berhasil dihapus.`);
      setCoaToDelete(null); // Clear the item to delete
      setIsDeleteModalOpen(false); // Close the modal
    }
  };

  const handleExport = (type: string) => {
    alert(`Exporting as ${type}`);
    // Implement export logic here
  };

  const filteredData = dummyData.filter(item => {
    const matchesSearch = item.kodeCOA.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.namaCOA.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKategori = filterKategori === '' || item.kategori === filterKategori;
    return matchesSearch && matchesKategori;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MASTER COA
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master COA</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">Cari Kode/Nama COA</label>
              <div className="relative">
                <input
                  type="text"
                  id="searchQuery"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Cari kode atau nama COA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="filterKategori" className="block text-sm font-medium text-gray-700 mb-2">Filter Kategori</label>
              <div className="relative">
                <select
                  id="filterKategori"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-180" /> {/* Chevron down */}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah COA
            </button>
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleExport('Excel')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> PDF
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode COA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama COA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((coa) => (
                  <tr key={coa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {coa.kodeCOA}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coa.namaCOA}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coa.kategori}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(coa.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coa.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit COA Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Edit COA" : "Tambah COA Baru"}>
        <form onSubmit={handleSubmitForm} className="space-y-5">
          <div>
            <label htmlFor="kodeCOA" className="block text-sm font-medium text-text mb-2">
              Kode COA
            </label>
            <input
              type="text"
              id="kodeCOA"
              name="kodeCOA"
              value={editingCOA?.kodeCOA || ''}
              onChange={handleFormInputChange}
              className="block w-full border border-border rounded-lg px-4 py-2 focus:ring-primary focus:border-primary text-sm bg-surface text-text"
              placeholder="Masukkan Kode COA"
              required
            />
          </div>
          <div>
            <label htmlFor="namaCOA" className="block text-sm font-medium text-text mb-2">
              Nama COA
            </label>
            <input
              type="text"
              id="namaCOA"
              name="namaCOA"
              value={editingCOA?.namaCOA || ''}
              onChange={handleFormInputChange}
              className="block w-full border border-border rounded-lg px-4 py-2 focus:ring-primary focus:border-primary text-sm bg-surface text-text"
              placeholder="Masukkan Nama COA"
              required
            />
          </div>
          <div>
            <label htmlFor="kategori" className="block text-sm font-medium text-text mb-2">
              Kategori
            </label>
            <select
              id="kategori"
              name="kategori"
              value={editingCOA?.kategori || 'Aset Lancar'}
              onChange={handleFormInputChange}
              className="block w-full border border-border rounded-lg px-4 py-2 focus:ring-primary focus:border-primary text-sm bg-surface text-text appearance-none"
              required
            >
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md shadow-sm text-textSecondary bg-surface hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              {isEditing ? (
                <>
                  <Edit className="h-5 w-5 mr-2" /> Simpan Perubahan
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5 mr-2" /> Tambah
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={coaToDelete ? `${coaToDelete.kodeCOA} - ${coaToDelete.namaCOA}` : ''}
      />
    </div>
  );
};

export default MasterCOADashboard;
