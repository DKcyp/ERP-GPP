import React, { useState } from 'react';
import { Search, Plus, FileSpreadsheet, FileText, Clock, Edit, Trash2, Eye } from 'lucide-react';
import BASerahTerimaModal from './BASerahTerimaModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface BASerahTerimaItem {
  id: string;
  nomorBA: string;
  tanggalBA: string;
  penyerah: string;
  penerima: string;
  namaAsset: string;
  nomorAsset: string;
  kodeAsset: string;
  jumlah: number;
  keterangan: string;
  kondisi: 'Baik' | 'Rusak' | 'Perlu Perbaikan';
  status: 'Draft' | 'Selesai' | 'Pending';
}

const seedData = (): BASerahTerimaItem[] => [
  {
    id: '1',
    nomorBA: 'BA-STA-001/2024',
    tanggalBA: '2024-12-15',
    penyerah: 'John Doe',
    penerima: 'Jane Smith',
    namaAsset: 'Laptop Dell Latitude 5520',
    nomorAsset: 'AST-IT-001',
    kodeAsset: 'LPT-001',
    jumlah: 1,
    keterangan: 'Serah terima laptop untuk karyawan baru',
    kondisi: 'Baik',
    status: 'Selesai'
  },
  {
    id: '2',
    nomorBA: 'BA-STA-002/2024',
    tanggalBA: '2024-12-16',
    penyerah: 'Admin GA',
    penerima: 'Ahmad Rizki',
    namaAsset: 'Kursi Kantor Ergonomis',
    nomorAsset: 'AST-FUR-025',
    kodeAsset: 'CHR-025',
    jumlah: 2,
    keterangan: 'Penggantian kursi lama dengan yang baru',
    kondisi: 'Baik',
    status: 'Selesai'
  },
  {
    id: '3',
    nomorBA: 'BA-STA-003/2024',
    tanggalBA: '2024-12-17',
    penyerah: 'Manager IT',
    penerima: 'Budi Santoso',
    namaAsset: 'Monitor LG 24 inch',
    nomorAsset: 'AST-IT-015',
    kodeAsset: 'MON-015',
    jumlah: 1,
    keterangan: 'Monitor tambahan untuk workstation',
    kondisi: 'Baik',
    status: 'Pending'
  },
  {
    id: '4',
    nomorBA: 'BA-STA-004/2024',
    tanggalBA: '2024-12-18',
    penyerah: 'Supervisor GA',
    penerima: 'Sari Dewi',
    namaAsset: 'Printer Canon',
    nomorAsset: 'AST-IT-008',
    kodeAsset: 'PRT-008',
    jumlah: 1,
    keterangan: 'Printer perlu diperbaiki sebelum diserahkan',
    kondisi: 'Perlu Perbaikan',
    status: 'Draft'
  },
  {
    id: '5',
    nomorBA: 'BA-STA-005/2024',
    tanggalBA: '2024-12-19',
    penyerah: 'IT Support',
    penerima: 'Andi Pratama',
    namaAsset: 'Laptop Asus VivoBook',
    nomorAsset: 'AST-IT-025',
    kodeAsset: 'LPT-025',
    jumlah: 1,
    keterangan: 'Laptop untuk tim sales mobile',
    kondisi: 'Baik',
    status: 'Selesai'
  },
  {
    id: '6',
    nomorBA: 'BA-STA-006/2024',
    tanggalBA: '2024-12-20',
    penyerah: 'GA Officer',
    penerima: 'Lisa Anggraini',
    namaAsset: 'Meja Kerja L-Shape',
    nomorAsset: 'AST-FUR-045',
    kodeAsset: 'DSK-045',
    jumlah: 1,
    keterangan: 'Meja baru untuk ruang HR',
    kondisi: 'Baik',
    status: 'Selesai'
  },
  {
    id: '7',
    nomorBA: 'BA-STA-007/2024',
    tanggalBA: '2024-12-21',
    penyerah: 'IT Admin',
    penerima: 'Rudi Hermawan',
    namaAsset: 'Access Point Ubiquiti',
    nomorAsset: 'AST-NET-012',
    kodeAsset: 'AP-012',
    jumlah: 3,
    keterangan: 'Pemasangan AP untuk area operasional',
    kondisi: 'Baik',
    status: 'Pending'
  },
  {
    id: '8',
    nomorBA: 'BA-STA-008/2024',
    tanggalBA: '2024-12-22',
    penyerah: 'Facility Manager',
    penerima: 'Dina Marlina',
    namaAsset: 'Lemari Arsip 4 Laci',
    nomorAsset: 'AST-FUR-067',
    kodeAsset: 'CAB-067',
    jumlah: 2,
    keterangan: 'Lemari arsip untuk dokumen accounting',
    kondisi: 'Baik',
    status: 'Draft'
  }
];

const GABASerahTerimaAssetDashboard: React.FC = () => {
  const [data, setData] = useState<BASerahTerimaItem[]>(seedData());
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedItem, setSelectedItem] = useState<BASerahTerimaItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BASerahTerimaItem | null>(null);

  const getStatusBadge = (status: string) => {
    const baseClass = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border";
    switch (status) {
      case 'Selesai': return `${baseClass} bg-green-100 text-green-800 border-green-200`;
      case 'Pending': return `${baseClass} bg-yellow-100 text-yellow-800 border-yellow-200`;
      default: return `${baseClass} bg-gray-100 text-gray-800 border-gray-200`;
    }
  };

  const getKondisiBadge = (kondisi: string) => {
    const baseClass = "inline-flex items-center px-2 py-0.5 rounded-full text-xs text-center font-medium border";
    switch (kondisi) {
      case 'Baik': return `${baseClass} bg-green-100 text-green-800 border-green-200`;
      case 'Rusak': return `${baseClass} bg-red-100 text-red-800 border-red-200`;
      default: return `${baseClass} bg-orange-100 text-orange-800 border-orange-200`;
    }
  };

  // Handler functions
  const handleTambah = () => {
    setModalMode('create');
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: BASerahTerimaItem) => {
    setModalMode('edit');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleView = (item: BASerahTerimaItem) => {
    setModalMode('view');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: BASerahTerimaItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(prev => prev.filter(item => item.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSave = (formData: Partial<BASerahTerimaItem>) => {
    if (modalMode === 'create') {
      const newItem: BASerahTerimaItem = {
        id: Date.now().toString(),
        nomorBA: formData.nomorBA || '',
        tanggalBA: formData.tanggalBA || '',
        penyerah: formData.penyerah || '',
        penerima: formData.penerima || '',
        namaAsset: formData.namaAsset || '',
        nomorAsset: formData.nomorAsset || '',
        kondisi: formData.kondisi || 'Baik',
        status: formData.status || 'Draft'
      };
      setData(prev => [...prev, newItem]);
    } else if (modalMode === 'edit' && selectedItem) {
      setData(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...formData }
          : item
      ));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">BA SERAH TERIMA ASSET</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">GA</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">BA Serah Terima Asset</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16" />

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6">
            <div className="md:col-span-3 lg:col-span-4 space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari BA / Asset / Nama</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Nomor BA, Asset, Penyerah, Penerima"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center justify-center space-x-2 text-xs">
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button 
              onClick={handleTambah}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-2 text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah BA</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-xs">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-2 text-xs">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[1200px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">No</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Nomor BA</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Tanggal</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Penyerah</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Penerima</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Nama Asset</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Kode Asset</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Jumlah</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Keterangan</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Kondisi</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.nomorBA}</td>
                    <td className="px-4 py-3">{new Date(item.tanggalBA).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3">{item.penyerah}</td>
                    <td className="px-4 py-3">{item.penerima}</td>
                    <td className="px-4 py-3">{item.namaAsset}</td>
                    <td className="px-4 py-3 text-blue-600">{item.kodeAsset}</td>
                    <td className="px-4 py-3 text-center">{item.jumlah}</td>
                    <td className="px-4 py-3 max-w-40 truncate text-gray-600" title={item.keterangan}>
                      {item.keterangan || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={getKondisiBadge(item.kondisi)}>
                        {item.kondisi}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={getStatusBadge(item.status)}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => handleView(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-1 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200" 
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200" 
                          title="Delete"
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

      {/* Form Modal */}
      {isModalOpen && (
        <BASerahTerimaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          mode={modalMode}
          data={selectedItem}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          itemName={itemToDelete?.nomorBA || ''}
        />
      )}
    </div>
  );
};

export default GABASerahTerimaAssetDashboard;
