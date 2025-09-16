import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Award, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface TrainingMatrix {
  id: string;
  namaKaryawan: string;
  jabatan: string;
  departemen: string;
  trainingRequired: string[];
  trainingCompleted: string[];
  sertifikatAktif: number;
  sertifikatExpired: number;
  statusKeseluruhan: 'Complete' | 'Incomplete' | 'Expired';
  lastUpdate: string;
}

const MatrixTrainingDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departemenFilter, setDepartemenFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TrainingMatrix | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [trainingMatrix, setTrainingMatrix] = useState<TrainingMatrix[]>([
    {
      id: '1',
      namaKaryawan: 'Ahmad Hidayat',
      jabatan: 'Radiographer',
      departemen: 'QHSE',
      trainingRequired: ['Basic Safety', 'Radiation Safety', 'NDT Level II', 'Emergency Response'],
      trainingCompleted: ['Basic Safety', 'Radiation Safety', 'NDT Level II'],
      sertifikatAktif: 3,
      sertifikatExpired: 0,
      statusKeseluruhan: 'Incomplete',
      lastUpdate: '2024-01-15'
    },
    {
      id: '2',
      namaKaryawan: 'Budi Santoso',
      jabatan: 'Safety Officer',
      departemen: 'QHSE',
      trainingRequired: ['Basic Safety', 'HSE Management', 'Incident Investigation', 'Audit Training'],
      trainingCompleted: ['Basic Safety', 'HSE Management', 'Incident Investigation', 'Audit Training'],
      sertifikatAktif: 4,
      sertifikatExpired: 0,
      statusKeseluruhan: 'Complete',
      lastUpdate: '2024-01-20'
    }
  ]);

  const [formData, setFormData] = useState<Partial<TrainingMatrix>>({
    namaKaryawan: '',
    jabatan: '',
    departemen: '',
    trainingRequired: [],
    trainingCompleted: [],
    sertifikatAktif: 0,
    sertifikatExpired: 0,
    statusKeseluruhan: 'Incomplete'
  });

  const totalEmployees = trainingMatrix.length;
  const completeEmployees = trainingMatrix.filter(emp => emp.statusKeseluruhan === 'Complete').length;
  const incompleteEmployees = trainingMatrix.filter(emp => emp.statusKeseluruhan === 'Incomplete').length;
  const expiredEmployees = trainingMatrix.filter(emp => emp.statusKeseluruhan === 'Expired').length;

  const filteredData = useMemo(() => {
    return trainingMatrix.filter(item => {
      const matchesSearch = 
        item.namaKaryawan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.departemen.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.statusKeseluruhan === statusFilter;
      const matchesDepartemen = departemenFilter === 'All' || item.departemen === departemenFilter;
      
      return matchesSearch && matchesStatus && matchesDepartemen;
    });
  }, [trainingMatrix, searchTerm, statusFilter, departemenFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleInputChange = (field: keyof TrainingMatrix, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setTrainingMatrix(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...formData, lastUpdate: new Date().toISOString().split('T')[0] } as TrainingMatrix : item
      ));
    } else {
      const newItem: TrainingMatrix = {
        id: Date.now().toString(),
        lastUpdate: new Date().toISOString().split('T')[0],
        ...formData as TrainingMatrix
      };
      setTrainingMatrix(prev => [...prev, newItem]);
    }
    
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      namaKaryawan: '',
      jabatan: '',
      departemen: '',
      trainingRequired: [],
      trainingCompleted: [],
      sertifikatAktif: 0,
      sertifikatExpired: 0,
      statusKeseluruhan: 'Incomplete'
    });
  };

  const handleEdit = (item: TrainingMatrix) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data matrix training ini?')) {
      setTrainingMatrix(prev => prev.filter(item => item.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Incomplete': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Incomplete': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Expired': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getCompletionPercentage = (required: string[], completed: string[]) => {
    if (required.length === 0) return 0;
    return Math.round((completed.length / required.length) * 100);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Matrix Training</h1>
        <p className="text-gray-600">Monitoring dan kelola sertifikat pelatihan karyawan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Karyawan</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Complete</p>
              <p className="text-2xl font-bold text-green-600">{completeEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Incomplete</p>
              <p className="text-2xl font-bold text-yellow-600">{incompleteEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-red-600">{expiredEmployees}</p>
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
                  placeholder="Cari berdasarkan nama, jabatan, atau departemen..."
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
                <option value="Complete">Complete</option>
                <option value="Incomplete">Incomplete</option>
                <option value="Expired">Expired</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={departemenFilter}
                onChange={(e) => setDepartemenFilter(e.target.value)}
              >
                <option value="All">Semua Departemen</option>
                <option value="QHSE">QHSE</option>
                <option value="Quality">Quality</option>
                <option value="Operations">Operations</option>
                <option value="Engineering">Engineering</option>
              </select>
              
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Karyawan
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
                  Nama Karyawan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jabatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departemen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress Training
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sertifikat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Update
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => {
                const completionPercentage = getCompletionPercentage(item.trainingRequired, item.trainingCompleted);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.namaKaryawan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.jabatan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.departemen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {item.trainingCompleted.length}/{item.trainingRequired.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">{item.sertifikatAktif} aktif</span>
                        {item.sertifikatExpired > 0 && (
                          <span className="text-red-600">{item.sertifikatExpired} expired</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.statusKeseluruhan)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.statusKeseluruhan)}`}>
                          {item.statusKeseluruhan}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.lastUpdate).toLocaleDateString('id-ID')}
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
                );
              })}
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit Matrix Training' : 'Tambah Matrix Training Baru'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Karyawan *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.namaKaryawan || ''}
                    onChange={(e) => handleInputChange('namaKaryawan', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jabatan *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.jabatan || ''}
                    onChange={(e) => handleInputChange('jabatan', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departemen *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.departemen || ''}
                    onChange={(e) => handleInputChange('departemen', e.target.value)}
                  >
                    <option value="">Pilih Departemen</option>
                    <option value="QHSE">QHSE</option>
                    <option value="Quality">Quality</option>
                    <option value="Operations">Operations</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Keseluruhan
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.statusKeseluruhan || 'Incomplete'}
                    onChange={(e) => handleInputChange('statusKeseluruhan', e.target.value)}
                  >
                    <option value="Incomplete">Incomplete</option>
                    <option value="Complete">Complete</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sertifikat Aktif
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.sertifikatAktif || 0}
                    onChange={(e) => handleInputChange('sertifikatAktif', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sertifikat Expired
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.sertifikatExpired || 0}
                    onChange={(e) => handleInputChange('sertifikatExpired', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setFormData({
                      namaKaryawan: '',
                      jabatan: '',
                      departemen: '',
                      trainingRequired: [],
                      trainingCompleted: [],
                      sertifikatAktif: 0,
                      sertifikatExpired: 0,
                      statusKeseluruhan: 'Incomplete'
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

export default MatrixTrainingDashboard;
