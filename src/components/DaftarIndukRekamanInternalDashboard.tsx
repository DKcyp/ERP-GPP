import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, FileText, Clock, Shield, Database, Archive } from 'lucide-react';

interface RekamanInternal {
  id: string;
  kodeRekaman: string;
  namaRekaman: string;
  jenisRekaman: 'Laporan' | 'Formulir' | 'Checklist' | 'Sertifikat' | 'Foto/Video' | 'Data Monitoring';
  departemenPemilik: string;
  tanggalDibuat: string;
  tanggalUpdate: string;
  periodeRetensi: number; // dalam tahun
  tanggalJatuhTempoRetensi: string;
  statusRekaman: 'Active' | 'Archived' | 'Disposed' | 'Under Review';
  tingkatKerahasiaan: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  lokasiFisik: string;
  lokasiDigital: string;
  formatRekaman: 'Hard Copy' | 'Digital' | 'Both';
  picPengelola: string;
  aksesLevel: string;
  keterangan: string;
}

const DaftarIndukRekamanInternalDashboard: React.FC = () => {
  const [rekamanList, setRekamanList] = useState<RekamanInternal[]>([]);
  const [filteredList, setFilteredList] = useState<RekamanInternal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RekamanInternal | null>(null);

  // Sample data
  useEffect(() => {
    const sampleData: RekamanInternal[] = [
      {
        id: '1',
        kodeRekaman: 'INT-RPT-001',
        namaRekaman: 'Laporan Inspeksi K3 Bulanan',
        jenisRekaman: 'Laporan',
        departemenPemilik: 'QHSE',
        tanggalDibuat: '2024-01-01',
        tanggalUpdate: '2024-01-15',
        periodeRetensi: 7,
        tanggalJatuhTempoRetensi: '2031-01-01',
        statusRekaman: 'Active',
        tingkatKerahasiaan: 'Internal',
        lokasiFisik: 'Filing Cabinet QHSE-A',
        lokasiDigital: '/records/qhse/inspeksi-k3/',
        formatRekaman: 'Both',
        picPengelola: 'Ahmad Rizki',
        aksesLevel: 'QHSE Team',
        keterangan: 'Laporan inspeksi rutin bulanan'
      },
      {
        id: '2',
        kodeRekaman: 'INT-FORM-002',
        namaRekaman: 'Formulir Pelaporan Insiden',
        jenisRekaman: 'Formulir',
        departemenPemilik: 'QHSE',
        tanggalDibuat: '2024-01-10',
        tanggalUpdate: '2024-01-20',
        periodeRetensi: 10,
        tanggalJatuhTempoRetensi: '2034-01-10',
        statusRekaman: 'Active',
        tingkatKerahasiaan: 'Confidential',
        lokasiFisik: 'Safe Box QHSE',
        lokasiDigital: '/records/qhse/incident-reports/',
        formatRekaman: 'Digital',
        picPengelola: 'Siti Nurhaliza',
        aksesLevel: 'Manager Level',
        keterangan: 'Formulir untuk pelaporan insiden kerja'
      },
      {
        id: '3',
        kodeRekaman: 'INT-CERT-003',
        namaRekaman: 'Sertifikat Training K3 Karyawan',
        jenisRekaman: 'Sertifikat',
        departemenPemilik: 'HRD',
        tanggalDibuat: '2023-06-15',
        tanggalUpdate: '2024-01-05',
        periodeRetensi: 5,
        tanggalJatuhTempoRetensi: '2028-06-15',
        statusRekaman: 'Active',
        tingkatKerahasiaan: 'Internal',
        lokasiFisik: 'Rak HRD-C',
        lokasiDigital: '/records/hrd/training-certificates/',
        formatRekaman: 'Both',
        picPengelola: 'Budi Santoso',
        aksesLevel: 'HRD Team',
        keterangan: 'Sertifikat training K3 untuk semua karyawan'
      }
    ];
    setRekamanList(sampleData);
    setFilteredList(sampleData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = rekamanList.filter(item => {
      const matchesSearch = item.namaRekaman.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.kodeRekaman.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.departemenPemilik.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesJenis = filterJenis === '' || item.jenisRekaman === filterJenis;
      const matchesStatus = filterStatus === '' || item.statusRekaman === filterStatus;
      
      return matchesSearch && matchesJenis && matchesStatus;
    });
    
    setFilteredList(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterJenis, filterStatus, rekamanList]);

  // Check for records approaching retention expiry (within 1 year)
  const getExpiringRecords = () => {
    const today = new Date();
    const oneYearFromNow = new Date(today.getTime() + (365 * 24 * 60 * 60 * 1000));
    
    return rekamanList.filter(record => {
      const expiryDate = new Date(record.tanggalJatuhTempoRetensi);
      return expiryDate <= oneYearFromNow && expiryDate > today;
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredList.slice(startIndex, endIndex);

  // Statistics
  const totalRekaman = rekamanList.length;
  const activeRekaman = rekamanList.filter(item => item.statusRekaman === 'Active').length;
  const archivedRekaman = rekamanList.filter(item => item.statusRekaman === 'Archived').length;
  const expiringRekaman = getExpiringRecords().length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Archived': return 'bg-blue-100 text-blue-800';
      case 'Disposed': return 'bg-red-100 text-red-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKerahasiaanColor = (kerahasiaan: string) => {
    switch (kerahasiaan) {
      case 'Public': return 'bg-green-100 text-green-800';
      case 'Internal': return 'bg-blue-100 text-blue-800';
      case 'Confidential': return 'bg-yellow-100 text-yellow-800';
      case 'Restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isRetentionExpiringSoon = (tanggalJatuhTempo: string) => {
    const today = new Date();
    const expiryDate = new Date(tanggalJatuhTempo);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 365 && diffDays > 0;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Induk Rekaman Internal</h1>
        <p className="text-gray-600">Kelola rekaman internal dengan tracking retensi dan kontrol akses</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Rekaman</p>
              <p className="text-2xl font-bold text-gray-900">{totalRekaman}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeRekaman}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Archive className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Archived</p>
              <p className="text-2xl font-bold text-gray-900">{archivedRekaman}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{expiringRekaman}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari rekaman, kode, atau departemen..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
              >
                <option value="">Semua Jenis</option>
                <option value="Laporan">Laporan</option>
                <option value="Formulir">Formulir</option>
                <option value="Checklist">Checklist</option>
                <option value="Sertifikat">Sertifikat</option>
                <option value="Foto/Video">Foto/Video</option>
                <option value="Data Monitoring">Data Monitoring</option>
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
                <option value="Disposed">Disposed</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </button>
              <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Rekaman
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Rekaman</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retensi Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kerahasiaan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.kodeRekaman}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="max-w-xs truncate">{item.namaRekaman}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.jenisRekaman}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.departemenPemilik}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {isRetentionExpiringSoon(item.tanggalJatuhTempoRetensi) && (
                        <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                      )}
                      {new Date(item.tanggalJatuhTempoRetensi).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.statusRekaman)}`}>
                      {item.statusRekaman}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-gray-400 mr-1" />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKerahasiaanColor(item.tingkatKerahasiaan)}`}>
                        {item.tingkatKerahasiaan}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.formatRekaman}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.picPengelola}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
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
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredList.length)}</span> of{' '}
                <span className="font-medium">{filteredList.length}</span> results
              </p>
              <select
                className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaftarIndukRekamanInternalDashboard;
