import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Download, FileText, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface HydroTestItem {
  id: string;
  nomorTest: string;
  tanggalTest: string;
  namaAlat: string;
  serialNumber: string;
  tekananTest: number;
  tekananKerja: number;
  hasilTest: 'Pass' | 'Fail' | 'Pending';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Failed';
  teknisi: string;
  lokasi: string;
  tanggalExpiry: string;
  keterangan: string;
  baKerusakanBarang?: string;
  tindakLanjut?: string;
}

const HydroTestDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hasilFilter, setHasilFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<HydroTestItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sample data
  const [hydroTestData, setHydroTestData] = useState<HydroTestItem[]>([
    {
      id: '1',
      nomorTest: 'HT-2024-001',
      tanggalTest: '2024-01-15',
      namaAlat: 'Pressure Vessel Tank A',
      serialNumber: 'PVT-001-2023',
      tekananTest: 150,
      tekananKerja: 100,
      hasilTest: 'Pass',
      status: 'Completed',
      teknisi: 'Ahmad Hidayat',
      lokasi: 'Workshop Area 1',
      tanggalExpiry: '2025-01-15',
      keterangan: 'Test berhasil, alat dalam kondisi baik'
    },
    {
      id: '2',
      nomorTest: 'HT-2024-002',
      tanggalTest: '2024-01-20',
      namaAlat: 'Compressor Tank B',
      serialNumber: 'CT-002-2022',
      tekananTest: 200,
      tekananKerja: 150,
      hasilTest: 'Fail',
      status: 'Failed',
      teknisi: 'Budi Santoso',
      lokasi: 'Workshop Area 2',
      tanggalExpiry: '2024-01-20',
      keterangan: 'Ditemukan kebocoran pada sambungan',
      baKerusakanBarang: 'BA-KRB-2024-001',
      tindakLanjut: 'Perbaikan sambungan dan re-test'
    }
  ]);

  const [formData, setFormData] = useState<Partial<HydroTestItem>>({
    nomorTest: '',
    tanggalTest: '',
    namaAlat: '',
    serialNumber: '',
    tekananTest: 0,
    tekananKerja: 0,
    hasilTest: 'Pending',
    status: 'Scheduled',
    teknisi: '',
    lokasi: '',
    tanggalExpiry: '',
    keterangan: ''
  });

  // Calculate statistics
  const totalTests = hydroTestData.length;
  const passedTests = hydroTestData.filter(item => item.hasilTest === 'Pass').length;
  const failedTests = hydroTestData.filter(item => item.hasilTest === 'Fail').length;
  const pendingTests = hydroTestData.filter(item => item.hasilTest === 'Pending').length;

  // Filter and search data
  const filteredData = useMemo(() => {
    return hydroTestData.filter(item => {
      const matchesSearch = 
        item.nomorTest.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaAlat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.teknisi.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesHasil = hasilFilter === 'All' || item.hasilTest === hasilFilter;
      
      return matchesSearch && matchesStatus && matchesHasil;
    });
  }, [hydroTestData, searchTerm, statusFilter, hasilFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleInputChange = (field: keyof HydroTestItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setHydroTestData(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...formData } as HydroTestItem : item
      ));
    } else {
      const newItem: HydroTestItem = {
        id: Date.now().toString(),
        ...formData as HydroTestItem
      };
      setHydroTestData(prev => [...prev, newItem]);
    }
    
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      nomorTest: '',
      tanggalTest: '',
      namaAlat: '',
      serialNumber: '',
      tekananTest: 0,
      tekananKerja: 0,
      hasilTest: 'Pending',
      status: 'Scheduled',
      teknisi: '',
      lokasi: '',
      tanggalExpiry: '',
      keterangan: ''
    });
  };

  const handleEdit = (item: HydroTestItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data hydro test ini?')) {
      setHydroTestData(prev => prev.filter(item => item.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHasilColor = (hasil: string) => {
    switch (hasil) {
      case 'Pass': return 'bg-green-100 text-green-800';
      case 'Fail': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHasilIcon = (hasil: string) => {
    switch (hasil) {
      case 'Pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Fail': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hydro Test</h1>
        <p className="text-gray-600">Kelola pengujian hidrostatik peralatan bertekanan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Test</p>
              <p className="text-2xl font-bold text-gray-900">{totalTests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Passed</p>
              <p className="text-2xl font-bold text-green-600">{passedTests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{failedTests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingTests}</p>
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
                  placeholder="Cari berdasarkan nomor test, nama alat, serial number, atau teknisi..."
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
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={hasilFilter}
                onChange={(e) => setHasilFilter(e.target.value)}
              >
                <option value="All">Semua Hasil</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Pending">Pending</option>
              </select>
              
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Test
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
                  No. Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Alat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tekanan (bar)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hasil Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teknisi
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
                    {item.nomorTest}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.tanggalTest).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.namaAlat}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.serialNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>Test: {item.tekananTest}</div>
                    <div className="text-xs text-gray-500">Kerja: {item.tekananKerja}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getHasilIcon(item.hasilTest)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHasilColor(item.hasilTest)}`}>
                        {item.hasilTest}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.teknisi}
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit Hydro Test' : 'Tambah Hydro Test Baru'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Test *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.nomorTest || ''}
                    onChange={(e) => handleInputChange('nomorTest', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Test *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tanggalTest || ''}
                    onChange={(e) => handleInputChange('tanggalTest', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Alat *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.namaAlat || ''}
                    onChange={(e) => handleInputChange('namaAlat', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.serialNumber || ''}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tekanan Test (bar) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tekananTest || ''}
                    onChange={(e) => handleInputChange('tekananTest', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tekanan Kerja (bar) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tekananKerja || ''}
                    onChange={(e) => handleInputChange('tekananKerja', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hasil Test
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.hasilTest || 'Pending'}
                    onChange={(e) => handleInputChange('hasilTest', e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.status || 'Scheduled'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teknisi *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.teknisi || ''}
                    onChange={(e) => handleInputChange('teknisi', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.lokasi || ''}
                    onChange={(e) => handleInputChange('lokasi', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Expiry
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tanggalExpiry || ''}
                    onChange={(e) => handleInputChange('tanggalExpiry', e.target.value)}
                  />
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
                      nomorTest: '',
                      tanggalTest: '',
                      namaAlat: '',
                      serialNumber: '',
                      tekananTest: 0,
                      tekananKerja: 0,
                      hasilTest: 'Pending',
                      status: 'Scheduled',
                      teknisi: '',
                      lokasi: '',
                      tanggalExpiry: '',
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

export default HydroTestDashboard;
