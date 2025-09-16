import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Download, FileText, Calendar, Filter, Eye } from 'lucide-react';

interface MonitoringReport {
  id: string;
  nomorReport: string;
  jenisReport: string;
  tanggalReport: string;
  periode: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  createdBy: string;
  approvedBy?: string;
  keterangan: string;
  dokumen?: string;
}

const MonitoringReportDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jenisFilter, setJenisFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MonitoringReport | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sample data
  const [reportData, setReportData] = useState<MonitoringReport[]>([
    {
      id: '1',
      nomorReport: 'MR-QHSE-2024-001',
      jenisReport: 'Safety Performance',
      tanggalReport: '2024-01-15',
      periode: 'January 2024',
      status: 'Approved',
      createdBy: 'Ahmad Hidayat',
      approvedBy: 'Manager QHSE',
      keterangan: 'Laporan kinerja keselamatan bulanan'
    },
    {
      id: '2',
      nomorReport: 'MR-QHSE-2024-002',
      jenisReport: 'Incident Report',
      tanggalReport: '2024-01-20',
      periode: 'January 2024',
      status: 'Submitted',
      createdBy: 'Budi Santoso',
      keterangan: 'Laporan insiden keselamatan kerja'
    },
    {
      id: '3',
      nomorReport: 'MR-QHSE-2024-003',
      jenisReport: 'Environmental Monitoring',
      tanggalReport: '2024-01-25',
      periode: 'January 2024',
      status: 'Draft',
      createdBy: 'Candra Wijaya',
      keterangan: 'Monitoring kualitas lingkungan'
    }
  ]);

  const [formData, setFormData] = useState<Partial<MonitoringReport>>({
    nomorReport: '',
    jenisReport: '',
    tanggalReport: '',
    periode: '',
    status: 'Draft',
    createdBy: '',
    keterangan: ''
  });

  // Calculate statistics
  const totalReports = reportData.length;
  const approvedReports = reportData.filter(item => item.status === 'Approved').length;
  const submittedReports = reportData.filter(item => item.status === 'Submitted').length;
  const draftReports = reportData.filter(item => item.status === 'Draft').length;

  // Filter and search data
  const filteredData = useMemo(() => {
    return reportData.filter(item => {
      const matchesSearch = 
        item.nomorReport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenisReport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesJenis = jenisFilter === 'All' || item.jenisReport === jenisFilter;
      
      return matchesSearch && matchesStatus && matchesJenis;
    });
  }, [reportData, searchTerm, statusFilter, jenisFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleInputChange = (field: keyof MonitoringReport, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setReportData(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...formData } as MonitoringReport : item
      ));
    } else {
      const newItem: MonitoringReport = {
        id: Date.now().toString(),
        ...formData as MonitoringReport
      };
      setReportData(prev => [...prev, newItem]);
    }
    
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      nomorReport: '',
      jenisReport: '',
      tanggalReport: '',
      periode: '',
      status: 'Draft',
      createdBy: '',
      keterangan: ''
    });
  };

  const handleEdit = (item: MonitoringReport) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus report ini?')) {
      setReportData(prev => prev.filter(item => item.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Monitoring Report</h1>
        <p className="text-gray-600">Kelola laporan monitoring QHSE</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Report</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvedReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-blue-600">{submittedReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-600">{draftReports}</p>
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
                  placeholder="Cari berdasarkan nomor report, jenis, atau pembuat..."
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
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={jenisFilter}
                onChange={(e) => setJenisFilter(e.target.value)}
              >
                <option value="All">Semua Jenis</option>
                <option value="Safety Performance">Safety Performance</option>
                <option value="Incident Report">Incident Report</option>
                <option value="Environmental Monitoring">Environmental Monitoring</option>
                <option value="Quality Report">Quality Report</option>
              </select>
              
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Report
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
                  Nomor Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat Oleh
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
                    {item.nomorReport}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.jenisReport}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.tanggalReport).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.periode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.createdBy}
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
                {editingItem ? 'Edit Monitoring Report' : 'Tambah Monitoring Report Baru'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Report *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.nomorReport || ''}
                    onChange={(e) => handleInputChange('nomorReport', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Report *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.jenisReport || ''}
                    onChange={(e) => handleInputChange('jenisReport', e.target.value)}
                  >
                    <option value="">Pilih Jenis Report</option>
                    <option value="Safety Performance">Safety Performance</option>
                    <option value="Incident Report">Incident Report</option>
                    <option value="Environmental Monitoring">Environmental Monitoring</option>
                    <option value="Quality Report">Quality Report</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Report *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tanggalReport || ''}
                    onChange={(e) => handleInputChange('tanggalReport', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Periode *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., January 2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.periode || ''}
                    onChange={(e) => handleInputChange('periode', e.target.value)}
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
                    <option value="Submitted">Submitted</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dibuat Oleh *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.createdBy || ''}
                    onChange={(e) => handleInputChange('createdBy', e.target.value)}
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
                      nomorReport: '',
                      jenisReport: '',
                      tanggalReport: '',
                      periode: '',
                      status: 'Draft',
                      createdBy: '',
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

export default MonitoringReportDashboard;
