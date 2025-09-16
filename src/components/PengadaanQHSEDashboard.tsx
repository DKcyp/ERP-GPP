import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Download, Upload, Filter, Calendar, DollarSign, FileText, AlertTriangle } from 'lucide-react';

interface PengadaanItem {
  id: string;
  nomorPengadaan: string;
  tanggalPengadaan: string;
  vendor: string;
  jenisBarang: string;
  jumlah: number;
  hargaSatuan: number;
  totalHarga: number;
  uangMuka: number;
  persentaseUangMuka: number;
  sisaPembayaran: number;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  tanggalDeadline: string;
  keterangan: string;
  dokumen?: string;
}

const PengadaanQHSEDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PengadaanItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample data
  const [pengadaanData, setPengadaanData] = useState<PengadaanItem[]>([
    {
      id: '1',
      nomorPengadaan: 'PGD-QHSE-2024-001',
      tanggalPengadaan: '2024-01-15',
      vendor: 'PT Safety Equipment Indonesia',
      jenisBarang: 'APD Lengkap',
      jumlah: 100,
      hargaSatuan: 250000,
      totalHarga: 25000000,
      uangMuka: 7500000,
      persentaseUangMuka: 30,
      sisaPembayaran: 17500000,
      status: 'Approved',
      tanggalDeadline: '2024-02-15',
      keterangan: 'Pengadaan APD untuk proyek radiography'
    },
    {
      id: '2',
      nomorPengadaan: 'PGD-QHSE-2024-002',
      tanggalPengadaan: '2024-01-20',
      vendor: 'CV Alat Ukur Presisi',
      jenisBarang: 'Dosimeter Digital',
      jumlah: 25,
      hargaSatuan: 1500000,
      totalHarga: 37500000,
      uangMuka: 18750000,
      persentaseUangMuka: 50,
      sisaPembayaran: 18750000,
      status: 'Pending',
      tanggalDeadline: '2024-03-01',
      keterangan: 'Pengadaan dosimeter untuk monitoring radiasi'
    }
  ]);

  const [formData, setFormData] = useState<Partial<PengadaanItem>>({
    nomorPengadaan: '',
    tanggalPengadaan: '',
    vendor: '',
    jenisBarang: '',
    jumlah: 0,
    hargaSatuan: 0,
    totalHarga: 0,
    uangMuka: 0,
    persentaseUangMuka: 0,
    sisaPembayaran: 0,
    status: 'Draft',
    tanggalDeadline: '',
    keterangan: ''
  });

  // Calculate totals
  const totalPengadaan = pengadaanData.reduce((sum, item) => sum + item.totalHarga, 0);
  const totalUangMuka = pengadaanData.reduce((sum, item) => sum + item.uangMuka, 0);
  const totalSisaPembayaran = pengadaanData.reduce((sum, item) => sum + item.sisaPembayaran, 0);

  // Filter and search data
  const filteredData = useMemo(() => {
    return pengadaanData.filter(item => {
      const matchesSearch = 
        item.nomorPengadaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenisBarang.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [pengadaanData, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleInputChange = (field: keyof PengadaanItem, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate fields
      if (field === 'jumlah' || field === 'hargaSatuan') {
        const jumlah = field === 'jumlah' ? value : (updated.jumlah || 0);
        const hargaSatuan = field === 'hargaSatuan' ? value : (updated.hargaSatuan || 0);
        updated.totalHarga = jumlah * hargaSatuan;
        updated.sisaPembayaran = updated.totalHarga - (updated.uangMuka || 0);
      }
      
      if (field === 'uangMuka' || field === 'totalHarga') {
        const uangMuka = field === 'uangMuka' ? value : (updated.uangMuka || 0);
        const totalHarga = field === 'totalHarga' ? value : (updated.totalHarga || 0);
        if (totalHarga > 0) {
          updated.persentaseUangMuka = Math.round((uangMuka / totalHarga) * 100);
        }
        updated.sisaPembayaran = totalHarga - uangMuka;
      }
      
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setPengadaanData(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...formData } as PengadaanItem : item
      ));
    } else {
      const newItem: PengadaanItem = {
        id: Date.now().toString(),
        ...formData as PengadaanItem
      };
      setPengadaanData(prev => [...prev, newItem]);
    }
    
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      nomorPengadaan: '',
      tanggalPengadaan: '',
      vendor: '',
      jenisBarang: '',
      jumlah: 0,
      hargaSatuan: 0,
      totalHarga: 0,
      uangMuka: 0,
      persentaseUangMuka: 0,
      sisaPembayaran: 0,
      status: 'Draft',
      tanggalDeadline: '',
      keterangan: ''
    });
  };

  const handleEdit = (item: PengadaanItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pengadaan ini?')) {
      setPengadaanData(prev => prev.filter(item => item.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengadaan QHSE</h1>
        <p className="text-gray-600">Kelola pengadaan barang dan jasa untuk kebutuhan QHSE</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pengadaan</p>
              <p className="text-2xl font-bold text-gray-900">{pengadaanData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Nilai</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalPengadaan)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Uang Muka</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalUangMuka)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sisa Pembayaran</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalSisaPembayaran)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nomor, vendor, atau jenis barang..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">Semua Status</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
              
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Pengadaan
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Pengadaan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Barang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uang Muka
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.nomorPengadaan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.tanggalPengadaan).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.vendor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.jenisBarang}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.totalHarga)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.uangMuka)}
                    <div className="text-xs text-gray-500">({item.persentaseUangMuka}%)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
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

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-700">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit Pengadaan' : 'Tambah Pengadaan Baru'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Pengadaan *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.nomorPengadaan || ''}
                    onChange={(e) => handleInputChange('nomorPengadaan', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Pengadaan *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tanggalPengadaan || ''}
                    onChange={(e) => handleInputChange('tanggalPengadaan', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.vendor || ''}
                    onChange={(e) => handleInputChange('vendor', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Barang *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.jenisBarang || ''}
                    onChange={(e) => handleInputChange('jenisBarang', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.jumlah || ''}
                    onChange={(e) => handleInputChange('jumlah', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Satuan *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.hargaSatuan || ''}
                    onChange={(e) => handleInputChange('hargaSatuan', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Harga
                  </label>
                  <input
                    type="text"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    value={formatCurrency(formData.totalHarga || 0)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uang Muka
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.uangMuka || ''}
                    onChange={(e) => handleInputChange('uangMuka', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tanggalDeadline || ''}
                    onChange={(e) => handleInputChange('tanggalDeadline', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.status || 'Draft'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keterangan
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.keterangan || ''}
                  onChange={(e) => handleInputChange('keterangan', e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setFormData({
                      nomorPengadaan: '',
                      tanggalPengadaan: '',
                      vendor: '',
                      jenisBarang: '',
                      jumlah: 0,
                      hargaSatuan: 0,
                      totalHarga: 0,
                      uangMuka: 0,
                      persentaseUangMuka: 0,
                      sisaPembayaran: 0,
                      status: 'Draft',
                      tanggalDeadline: '',
                      keterangan: ''
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingItem ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengadaanQHSEDashboard;
