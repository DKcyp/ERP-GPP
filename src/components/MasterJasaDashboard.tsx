import React, { useState } from 'react';
import { Clock, Search, PlusCircle, Edit, Trash2, Download } from 'lucide-react';
import Modal from './Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface JasaItem {
  id: string;
  kodeJasa: string;
  namaJasa: string;
  kategori: string;
  satuan: string;
  hargaStandar: number;
  deskripsi?: string;
  status: "Aktif" | "Tidak Aktif";
}

const MasterJasaDashboard: React.FC = () => {
  const today = new Date();

  const [dummyData, setDummyData] = useState<JasaItem[]>([
    { id: '1', kodeJasa: 'JSA001', namaJasa: 'Konsultasi IT', kategori: 'Konsultasi', satuan: 'Jam', hargaStandar: 500000, deskripsi: 'Layanan konsultasi teknologi informasi', status: 'Aktif' },
    { id: '2', kodeJasa: 'JSA002', namaJasa: 'Pelatihan Software', kategori: 'Pelatihan', satuan: 'Hari', hargaStandar: 2000000, deskripsi: 'Pelatihan penggunaan software', status: 'Aktif' },
    { id: '3', kodeJasa: 'JSA003', namaJasa: 'Maintenance Server', kategori: 'Maintenance', satuan: 'Bulan', hargaStandar: 5000000, deskripsi: 'Pemeliharaan server bulanan', status: 'Aktif' },
    { id: '4', kodeJasa: 'JSA004', namaJasa: 'Audit Sistem', kategori: 'Audit', satuan: 'Proyek', hargaStandar: 15000000, deskripsi: 'Audit keamanan sistem informasi', status: 'Aktif' },
    { id: '5', kodeJasa: 'JSA005', namaJasa: 'Desain Website', kategori: 'Desain', satuan: 'Halaman', hargaStandar: 1500000, deskripsi: 'Jasa desain halaman website', status: 'Tidak Aktif' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  // State for the generic Jasa Modal (Add/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJasa, setEditingJasa] = useState<JasaItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // State for Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jasaToDelete, setJasaToDelete] = useState<JasaItem | null>(null);

  const availableCategories = Array.from(new Set(dummyData.map(item => item.kategori)));
  const availableSatuan = ['Jam', 'Hari', 'Bulan', 'Proyek', 'Halaman', 'Unit', 'Paket'];

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}, Kategori: ${filterKategori}, Status: ${filterStatus}`);
  };

  const handleAdd = () => {
    setIsEditing(false);
    setEditingJasa({ id: '', kodeJasa: '', namaJasa: '', kategori: '', satuan: '', hargaStandar: 0, deskripsi: '', status: 'Aktif' });
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const jasaToEdit = dummyData.find(item => item.id === id);
    if (jasaToEdit) {
      setIsEditing(true);
      setEditingJasa(jasaToEdit);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJasa(null);
    setIsEditing(false);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingJasa) {
      setEditingJasa(prev => ({ ...prev!, [name]: name === 'hargaStandar' ? parseFloat(value) || 0 : value }));
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJasa) return;

    if (isEditing) {
      setDummyData(prev =>
        prev.map(item => (item.id === editingJasa.id ? editingJasa : item))
      );
      alert(`Jasa ${editingJasa.kodeJasa} berhasil diperbarui.`);
    } else {
      const newId = (Math.max(...dummyData.map(item => parseInt(item.id))) + 1).toString();
      const jasaToAdd = { ...editingJasa, id: newId };
      setDummyData(prev => [...prev, jasaToAdd]);
      alert(`Jasa Baru Ditambahkan: ${jasaToAdd.namaJasa}`);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const jasa = dummyData.find(item => item.id === id);
    if (jasa) {
      setJasaToDelete(jasa);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (jasaToDelete) {
      setDummyData(prev => prev.filter(item => item.id !== jasaToDelete.id));
      alert(`Jasa ${jasaToDelete.kodeJasa} - ${jasaToDelete.namaJasa} berhasil dihapus.`);
      setJasaToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleExport = (type: string) => {
    alert(`Exporting as ${type}`);
  };

  const filteredData = dummyData.filter(item => {
    const matchesSearch = item.kodeJasa.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.namaJasa.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKategori = filterKategori === '' || item.kategori === filterKategori;
    const matchesStatus = filterStatus === '' || item.status === filterStatus;
    return matchesSearch && matchesKategori && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MASTER JASA
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Master</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master Jasa</span>
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
              <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">Cari Kode/Nama Jasa</label>
              <div className="relative">
                <input
                  type="text"
                  id="searchQuery"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Cari kode atau nama jasa..."
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
              </div>
            </div>

            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-2">Filter Status</label>
              <div className="relative">
                <select
                  id="filterStatus"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Jasa
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
                    Kode Jasa
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Jasa
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satuan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga Standar
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((jasa) => (
                  <tr key={jasa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {jasa.kodeJasa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {jasa.namaJasa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {jasa.kategori}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {jasa.satuan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(jasa.hargaStandar)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        jasa.status === 'Aktif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {jasa.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(jasa.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(jasa.id)}
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

      {/* Add/Edit Jasa Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Edit Jasa" : "Tambah Jasa Baru"}>
        <form onSubmit={handleSubmitForm} className="space-y-5">
          <div>
            <label htmlFor="kodeJasa" className="block text-sm font-medium text-gray-700 mb-2">
              Kode Jasa
            </label>
            <input
              type="text"
              id="kodeJasa"
              name="kodeJasa"
              value={editingJasa?.kodeJasa || ''}
              onChange={handleFormInputChange}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Masukkan Kode Jasa"
              required
            />
          </div>
          <div>
            <label htmlFor="namaJasa" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Jasa
            </label>
            <input
              type="text"
              id="namaJasa"
              name="namaJasa"
              value={editingJasa?.namaJasa || ''}
              onChange={handleFormInputChange}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Masukkan Nama Jasa"
              required
            />
          </div>
          <div>
            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              id="kategori"
              name="kategori"
              value={editingJasa?.kategori || ''}
              onChange={handleFormInputChange}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              required
            >
              <option value="" disabled>-- Pilih Kategori --</option>
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value="Konsultasi">Konsultasi</option>
              <option value="Pelatihan">Pelatihan</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Audit">Audit</option>
              <option value="Desain">Desain</option>
            </select>
          </div>
          <div>
            <label htmlFor="satuan" className="block text-sm font-medium text-gray-700 mb-2">
              Satuan
            </label>
            <select
              id="satuan"
              name="satuan"
              value={editingJasa?.satuan || ''}
              onChange={handleFormInputChange}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              required
            >
              <option value="" disabled>-- Pilih Satuan --</option>
              {availableSatuan.map(satuan => (
                <option key={satuan} value={satuan}>{satuan}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hargaStandar" className="block text-sm font-medium text-gray-700 mb-2">
              Harga Standar
            </label>
            <input
              type="number"
              id="hargaStandar"
              name="hargaStandar"
              value={editingJasa?.hargaStandar || 0}
              onChange={handleFormInputChange}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Masukkan Harga Standar"
              required
            />
          </div>
          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={editingJasa?.deskripsi || ''}
              onChange={handleFormInputChange}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Masukkan Deskripsi Jasa"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={editingJasa?.status || 'Aktif'}
              onChange={handleFormInputChange}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              required
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
        itemName={jasaToDelete ? `${jasaToDelete.kodeJasa} - ${jasaToDelete.namaJasa}` : ''}
      />
    </div>
  );
};

export default MasterJasaDashboard;
