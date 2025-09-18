import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Download, Upload, Calendar, 
  User, MapPin, FileText, Clock, CheckCircle, XCircle,
  AlertTriangle, Eye, Edit, Trash2, Wrench, Users,
  Building, Hash, UserCheck, ArrowRight, Bell
} from 'lucide-react';

interface LogBookTKPKEntry {
  id: string;
  no: number;
  namaPersonil: string;
  namaProject: string;
  noSO: string;
  jenisLogBook: 'Operator' | 'Trainer';
  tglKeluar: string;
  tglMasuk: string;
  status: 'Sudah Kembali' | 'Belum Kembali';
  qhseValidationKeluar: boolean;
  qhseValidationMasuk: boolean;
  mobDemobId?: string;
  createdAt: string;
  updatedAt: string;
}

const QHSELogBookTKPKDashboard: React.FC = () => {
  const [entries, setEntries] = useState<LogBookTKPKEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<LogBookTKPKEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterJenis, setFilterJenis] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LogBookTKPKEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data
  useEffect(() => {
    const mockData: LogBookTKPKEntry[] = [
      {
        id: '1',
        no: 1,
        namaPersonil: 'Ahmad Rizki',
        namaProject: 'TKPK Inspection PHE ONWJ',
        noSO: 'SO-2024-001',
        jenisLogBook: 'Operator',
        tglKeluar: '2024-01-15',
        tglMasuk: '2024-01-20',
        status: 'Sudah Kembali',
        qhseValidationKeluar: true,
        qhseValidationMasuk: true,
        mobDemobId: 'MD-001',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-20T17:00:00Z'
      },
      {
        id: '2',
        no: 2,
        namaPersonil: 'Budi Santoso',
        namaProject: 'TKPK Inspection Medco Corridor',
        noSO: 'SO-2024-002',
        jenisLogBook: 'Trainer',
        tglKeluar: '2024-01-18',
        tglMasuk: '',
        status: 'Belum Kembali',
        qhseValidationKeluar: true,
        qhseValidationMasuk: false,
        mobDemobId: 'MD-002',
        createdAt: '2024-01-18T07:30:00Z',
        updatedAt: '2024-01-18T07:30:00Z'
      },
      {
        id: '3',
        no: 3,
        namaPersonil: 'Citra Dewi',
        namaProject: 'TKPK Inspection ENI Muara Bakau',
        noSO: 'SO-2024-003',
        jenisLogBook: 'Operator',
        tglKeluar: '2024-02-01',
        tglMasuk: '2024-02-05',
        status: 'Sudah Kembali',
        qhseValidationKeluar: true,
        qhseValidationMasuk: true,
        mobDemobId: 'MD-003',
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-02-05T16:30:00Z'
      }
    ];
    setEntries(mockData);
    setFilteredEntries(mockData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = entries.filter(entry => {
      const matchesSearch = 
        entry.namaPersonil.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.no.toString().includes(searchTerm) ||
        entry.namaProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.noSO.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
      const matchesJenis = filterJenis === 'all' || entry.jenisLogBook === filterJenis;
      const matchesProject = filterProject === 'all' || entry.namaProject.includes(filterProject);
      
      return matchesSearch && matchesStatus && matchesJenis && matchesProject;
    });
    
    setFilteredEntries(filtered);
    setCurrentPage(1);
  }, [entries, searchTerm, filterStatus, filterJenis, filterProject]);

  // Statistics
  const stats = {
    total: entries.length,
    sudahKembali: entries.filter(e => e.status === 'Sudah Kembali').length,
    belumKembali: entries.filter(e => e.status === 'Belum Kembali').length,
    needValidation: entries.filter(e => !e.qhseValidationKeluar || !e.qhseValidationMasuk).length
  };

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = filteredEntries.slice(startIndex, endIndex);

  // Handlers
  const handleAddEntry = () => {
    setEditingEntry(null);
    setShowModal(true);
  };

  const handleEditEntry = (entry: LogBookTKPKEntry) => {
    setEditingEntry(entry);
    setShowModal(true);
  };

  const handleQHSEValidation = (entryId: string, type: 'keluar' | 'masuk') => {
    setEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, [`qhseValidation${type.charAt(0).toUpperCase() + type.slice(1)}`]: true }
        : entry
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sudah Kembali':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sudah Kembali
          </span>
        );
      case 'Belum Kembali':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Belum Kembali
          </span>
        );
      default:
        return null;
    }
  };

  const getJenisBadge = (jenis: string) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        jenis === 'Operator' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
      }`}>
        {jenis}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Log Book TKPK</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Monitoring log in/out personil untuk pekerjaan TKPK (Teknik Keselamatan Penanganan Konstruksi)
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddEntry}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Entry
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Personnel</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Sudah Kembali</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.sudahKembali}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Belum Kembali</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.belumKembali}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Perlu Validasi</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.needValidation}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Cari personil, project, SO..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="filterStatus"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="Sudah Kembali">Sudah Kembali</option>
                  <option value="Belum Kembali">Belum Kembali</option>
                </select>
              </div>

              <div>
                <label htmlFor="filterJenis" className="block text-sm font-medium text-gray-700">
                  Jenis Log Book
                </label>
                <select
                  id="filterJenis"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                >
                  <option value="all">Semua Jenis</option>
                  <option value="Operator">Operator</option>
                  <option value="Trainer">Trainer</option>
                </select>
              </div>

              <div>
                <label htmlFor="filterProject" className="block text-sm font-medium text-gray-700">
                  Project
                </label>
                <select
                  id="filterProject"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                >
                  <option value="all">Semua Project</option>
                  <option value="PHE ONWJ">PHE ONWJ</option>
                  <option value="Medco Corridor">Medco Corridor</option>
                  <option value="ENI Muara Bakau">ENI Muara Bakau</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Log Book TKPK Entries
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Daftar log in/out personil untuk pekerjaan TKPK
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Personil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No SO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tgl Keluar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tgl Masuk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QHSE Validation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{entry.namaPersonil}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{entry.namaProject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{entry.noSO}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getJenisBadge(entry.jenisLogBook)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {new Date(entry.tglKeluar).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {entry.tglMasuk ? new Date(entry.tglMasuk).toLocaleDateString('id-ID') : '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(entry.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-1">Out:</span>
                          {entry.qhseValidationKeluar ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <button
                              onClick={() => handleQHSEValidation(entry.id, 'keluar')}
                              className="h-4 w-4 text-red-500 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-1">In:</span>
                          {entry.qhseValidationMasuk ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <button
                              onClick={() => handleQHSEValidation(entry.id, 'masuk')}
                              className="h-4 w-4 text-red-500 hover:text-red-700"
                              disabled={!entry.tglMasuk}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
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
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredEntries.length)}</span> of{' '}
                  <span className="font-medium">{filteredEntries.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
    </div>
  );
};

export default QHSELogBookTKPKDashboard;
