import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Download, Upload, Calendar, 
  User, MapPin, FileText, Clock, CheckCircle, XCircle,
  AlertTriangle, Eye, Edit, Trash2, CreditCard, Users,
  Building, Hash, UserCheck, ArrowRight, Bell, Zap
} from 'lucide-react';

interface LogBookTLDEntry {
  id: string;
  no: number;
  namaPersonil: string;
  namaProject: string;
  noSO: string;
  tglKeluar: string;
  tglMasuk: string;
  ketPeriodeTLD: string; // Periode TLD (misal: Jan-Mar 2025)
  status: 'Sudah Kembali' | 'Belum Kembali';
  qhseValidationKeluar: boolean;
  qhseValidationMasuk: boolean;
  mobDemobId?: string;
  createdAt: string;
  updatedAt: string;
}

const QHSELogBookTLDDashboard: React.FC = () => {
  const [entries, setEntries] = useState<LogBookTLDEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<LogBookTLDEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterPeriode, setFilterPeriode] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LogBookTLDEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data
  useEffect(() => {
    const mockData: LogBookTLDEntry[] = [
      {
        id: '1',
        no: 1,
        namaPersonil: 'Ahmad Rizki',
        namaProject: 'RT Inspection PHE ONWJ',
        noSO: 'SO-2024-001',
        tglKeluar: '2024-01-15',
        tglMasuk: '2024-01-20',
        ketPeriodeTLD: 'Jan-Mar 2024',
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
        namaProject: 'RT Inspection Medco Corridor',
        noSO: 'SO-2024-002',
        tglKeluar: '2024-01-18',
        tglMasuk: '',
        ketPeriodeTLD: 'Jan-Mar 2024',
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
        namaProject: 'RT Inspection ENI Muara Bakau',
        noSO: 'SO-2024-003',
        tglKeluar: '2024-02-01',
        tglMasuk: '2024-02-05',
        ketPeriodeTLD: 'Apr-Jun 2024',
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
      const matchesProject = filterProject === 'all' || entry.namaProject.includes(filterProject);
      const matchesPeriode = filterPeriode === 'all' || entry.ketPeriodeTLD.includes(filterPeriode);
      
      return matchesSearch && matchesStatus && matchesProject && matchesPeriode;
    });
    
    setFilteredEntries(filtered);
    setCurrentPage(1);
  }, [entries, searchTerm, filterStatus, filterProject, filterPeriode]);

  // Statistics
  const stats = {
    total: entries.length,
    sudahKembali: entries.filter(e => e.status === 'Sudah Kembali').length,
    belumKembali: entries.filter(e => e.status === 'Belum Kembali').length,
    needValidation: entries.filter(e => !e.qhseValidationKeluar || !e.qhseValidationMasuk).length
  };

  // Get unique periods for filter
  const uniquePeriods = [...new Set(entries.map(e => e.ketPeriodeTLD))];

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = filteredEntries.slice(startIndex, endIndex);

  const handleAddEntry = () => {
    setEditingEntry(null);
    setShowModal(true);
  };

  const handleEditEntry = (entry: LogBookTLDEntry) => {
    setEditingEntry(entry);
    setShowModal(true);
  };

  const handleQHSEValidation = (entryId: string, type: 'keluar' | 'masuk') => {
    setEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { 
            ...entry, 
            [type === 'keluar' ? 'qhseValidationKeluar' : 'qhseValidationMasuk']: true,
            updatedAt: new Date().toISOString()
          }
        : entry
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sudah Kembali':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Sudah Kembali
        </span>;
      case 'Belum Kembali':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Belum Kembali
        </span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
          {status}
        </span>;
    }
  };

  const getPeriodeBadge = (periode: string) => {
    return (
      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center gap-1">
        <CreditCard className="w-3 h-3" />
        {periode}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                  Log In Log Out TLD
                </h1>
              </div>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  QHSE
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Log Book TLD</span>
              </nav>
              <p className="text-gray-600 mt-2">Monitoring log book TLD personil RT dengan integrasi Mob-Demob dan validasi QHSE</p>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Log Book TLD</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sudah Kembali</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sudahKembali}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Belum Kembali</p>
                <p className="text-2xl font-bold text-gray-900">{stats.belumKembali}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Perlu Validasi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.needValidation}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan No / Nama Personil / Project / No SO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="Sudah Kembali">Sudah Kembali</option>
                <option value="Belum Kembali">Belum Kembali</option>
              </select>
              
              <select
                value={filterPeriode}
                onChange={(e) => setFilterPeriode(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Periode</option>
                {uniquePeriods.map(periode => (
                  <option key={periode} value={periode}>{periode}</option>
                ))}
              </select>
              
              <button
                onClick={handleAddEntry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambah Log Book TLD
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Personil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No SO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Keluar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Masuk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode TLD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validasi QHSE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{entry.namaPersonil}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.namaProject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.noSO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.tglKeluar ? new Date(entry.tglKeluar).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.tglMasuk ? new Date(entry.tglMasuk).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getPeriodeBadge(entry.ketPeriodeTLD)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(entry.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${entry.qhseValidationKeluar ? 'bg-green-500' : 'bg-red-500'}`} title={`Keluar: ${entry.qhseValidationKeluar ? 'Validated' : 'Not Validated'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${entry.qhseValidationMasuk ? 'bg-green-500' : 'bg-red-500'}`} title={`Masuk: ${entry.qhseValidationMasuk ? 'Validated' : 'Not Validated'}`}></div>
                        {(!entry.qhseValidationKeluar || !entry.qhseValidationMasuk) && (
                          <button
                            onClick={() => handleQHSEValidation(entry.id, entry.qhseValidationKeluar ? 'masuk' : 'keluar')}
                            className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200"
                          >
                            Validasi
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
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

export default QHSELogBookTLDDashboard;
