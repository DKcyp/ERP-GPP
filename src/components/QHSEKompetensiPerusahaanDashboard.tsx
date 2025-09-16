import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, Award, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface KompetensiPerusahaan {
  id: number;
  noUrut: string;
  namaSertifikat: string;
  tanggalTerbit: string;
  masaBerlaku: string;
  tempatPengurusan: string;
  keterangan: 'Aktif' | 'Non Aktif';
  approval: 'Pending' | 'Approved' | 'Rejected';
  dokumenSertifikat?: string;
  statusProses: 'Pengajuan' | 'Proses' | 'Selesai';
}

const QHSEKompetensiPerusahaanDashboard: React.FC = () => {
  const [data, setData] = useState<KompetensiPerusahaan[]>([]);
  const [filteredData, setFilteredData] = useState<KompetensiPerusahaan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KompetensiPerusahaan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    namaSertifikat: '',
    tanggalTerbit: '',
    masaBerlaku: '',
    tempatPengurusan: '',
    keterangan: 'Aktif' as 'Aktif' | 'Non Aktif',
    dokumenSertifikat: '',
  });

  useEffect(() => {
    const sampleData: KompetensiPerusahaan[] = [
      {
        id: 1,
        noUrut: 'KP001',
        namaSertifikat: 'ISO 9001:2015 Quality Management System',
        tanggalTerbit: '2024-01-15',
        masaBerlaku: '2027-01-15',
        tempatPengurusan: 'PT. Surveyor Indonesia',
        keterangan: 'Aktif',
        approval: 'Approved',
        statusProses: 'Selesai',
        dokumenSertifikat: 'iso-9001-certificate.pdf'
      },
      {
        id: 2,
        noUrut: 'KP002',
        namaSertifikat: 'ISO 14001:2015 Environmental Management',
        tanggalTerbit: '2024-02-10',
        masaBerlaku: '2027-02-10',
        tempatPengurusan: 'Bureau Veritas',
        keterangan: 'Aktif',
        approval: 'Pending',
        statusProses: 'Proses'
      }
    ];
    setData(sampleData);
    setFilteredData(sampleData);
  }, []);

  useEffect(() => {
    let filtered = data.filter(item => {
      const matchesSearch = item.namaSertifikat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tempatPengurusan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.statusProses === statusFilter;
      const matchesApproval = approvalFilter === 'all' || item.approval === approvalFilter;
      return matchesSearch && matchesStatus && matchesApproval;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, searchTerm, statusFilter, approvalFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: KompetensiPerusahaan = {
      id: editingItem ? editingItem.id : Date.now(),
      noUrut: editingItem ? editingItem.noUrut : `KP${String(data.length + 1).padStart(3, '0')}`,
      namaSertifikat: formData.namaSertifikat,
      tanggalTerbit: formData.tanggalTerbit,
      masaBerlaku: formData.masaBerlaku,
      tempatPengurusan: formData.tempatPengurusan,
      keterangan: formData.keterangan,
      approval: editingItem ? editingItem.approval : 'Pending',
      dokumenSertifikat: formData.dokumenSertifikat,
      statusProses: editingItem ? editingItem.statusProses : 'Pengajuan',
    };

    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setData([...data, newItem]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      namaSertifikat: '',
      tanggalTerbit: '',
      masaBerlaku: '',
      tempatPengurusan: '',
      keterangan: 'Aktif',
      dokumenSertifikat: '',
    });
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleEdit = (item: KompetensiPerusahaan) => {
    setEditingItem(item);
    setFormData({
      namaSertifikat: item.namaSertifikat,
      tanggalTerbit: item.tanggalTerbit,
      masaBerlaku: item.masaBerlaku,
      tempatPengurusan: item.tempatPengurusan,
      keterangan: item.keterangan,
      dokumenSertifikat: item.dokumenSertifikat || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pengajuan': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'Proses': { color: 'bg-blue-100 text-blue-800', icon: AlertTriangle },
      'Selesai': { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || Clock;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getApprovalBadge = (approval: string) => {
    const approvalConfig = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800' },
      'Approved': { color: 'bg-green-100 text-green-800' },
      'Rejected': { color: 'bg-red-100 text-red-800' }
    };
    const config = approvalConfig[approval as keyof typeof approvalConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color}`}>
        {approval}
      </span>
    );
  };

  const totalSertifikat = data.length;
  const aktiveSertifikat = data.filter(item => item.keterangan === 'Aktif').length;
  const pendingApproval = data.filter(item => item.approval === 'Pending').length;
  const selesaiProses = data.filter(item => item.statusProses === 'Selesai').length;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kompetensi Perusahaan</h1>
          <p className="text-gray-600">Kelola sertifikat dan kompetensi perusahaan</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sertifikat</p>
                <p className="text-2xl font-semibold text-gray-900">{totalSertifikat}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sertifikat Aktif</p>
                <p className="text-2xl font-semibold text-gray-900">{aktiveSertifikat}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingApproval}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Proses Selesai</p>
                <p className="text-2xl font-semibold text-gray-900">{selesaiProses}</p>
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
                    placeholder="Cari sertifikat..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="Pengajuan">Pengajuan</option>
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={approvalFilter}
                  onChange={(e) => setApprovalFilter(e.target.value)}
                >
                  <option value="all">Semua Approval</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Sertifikat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Urut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Sertifikat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Terbit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa Berlaku</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempat Pengurusan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.noUrut}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.namaSertifikat}</div>
                      <div className="text-sm text-gray-500">{getStatusBadge(item.statusProses)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggalTerbit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.masaBerlaku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tempatPengurusan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.keterangan === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.keterangan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getApprovalBadge(item.approval)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {item.dokumenSertifikat && (
                          <button className="text-green-600 hover:text-green-900">
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sertifikat *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.namaSertifikat}
                    onChange={(e) => setFormData({ ...formData, namaSertifikat: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Terbit *</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.tanggalTerbit}
                      onChange={(e) => setFormData({ ...formData, tanggalTerbit: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Masa Berlaku *</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.masaBerlaku}
                      onChange={(e) => setFormData({ ...formData, masaBerlaku: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Pengurusan *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.tempatPengurusan}
                    onChange={(e) => setFormData({ ...formData, tempatPengurusan: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value as 'Aktif' | 'Non Aktif' })}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non Aktif">Non Aktif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dokumen Sertifikat</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFormData({ ...formData, dokumenSertifikat: e.target.files?.[0]?.name || '' })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: PDF, JPG, JPEG, PNG (Max: 5MB)</p>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingItem ? 'Update' : 'Simpan'}
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

export default QHSEKompetensiPerusahaanDashboard;