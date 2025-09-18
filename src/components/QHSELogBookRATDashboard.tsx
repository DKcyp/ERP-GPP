import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Download, Upload, Calendar, 
  User, MapPin, FileText, Clock, CheckCircle, XCircle,
  AlertTriangle, Eye, Edit, Trash2, BookOpen, Users,
  Building, Hash, UserCheck, ArrowRight, Bell
} from 'lucide-react';

interface LogBookRATEntry {
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

const QHSELogBookRATDashboard: React.FC = () => {
  const [entries, setEntries] = useState<LogBookRATEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<LogBookRATEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterJenis, setFilterJenis] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [editingEntry, setEditingEntry] = useState<LogBookRATEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<LogBookRATEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState<Partial<LogBookRATEntry>>({});

  // Mock data
  useEffect(() => {
    const mockData: LogBookRATEntry[] = [
      {
        id: '1',
        no: 1,
        namaPersonil: 'Ahmad Rizki',
        namaProject: 'RT Inspection PHE ONWJ',
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
        namaProject: 'RT Inspection Medco Corridor',
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

  // CRUD Handlers
  const handleAddEntry = () => {
    setModalMode('add');
    setEditingEntry(null);
    setFormData({
      namaPersonil: '',
      namaProject: '',
      noSO: '',
      jenisLogBook: 'Operator',
      tglKeluar: '',
      tglMasuk: '',
      qhseValidationKeluar: false,
      qhseValidationMasuk: false,
      mobDemobId: ''
    });
    setShowModal(true);
  };

  const handleEditEntry = (entry: LogBookRATEntry) => {
    setModalMode('edit');
    setEditingEntry(entry);
    setFormData(entry);
    setShowModal(true);
  };

  const handleViewEntry = (entry: LogBookRATEntry) => {
    setModalMode('view');
    setEditingEntry(entry);
    setFormData(entry);
    setShowModal(true);
  };

  const handleDeleteEntry = (entry: LogBookRATEntry) => {
    setDeletingEntry(entry);
    setShowDeleteModal(true);
  };

  const handleSaveEntry = () => {
    if (modalMode === 'add') {
      const newEntry: LogBookRATEntry = {
        id: Date.now().toString(),
        no: entries.length + 1,
        namaPersonil: formData.namaPersonil || '',
        namaProject: formData.namaProject || '',
        noSO: formData.noSO || '',
        jenisLogBook: formData.jenisLogBook || 'Operator',
        tglKeluar: formData.tglKeluar || '',
        tglMasuk: formData.tglMasuk || '',
        status: formData.tglMasuk ? 'Sudah Kembali' : 'Belum Kembali',
        qhseValidationKeluar: formData.qhseValidationKeluar || false,
        qhseValidationMasuk: formData.qhseValidationMasuk || false,
        mobDemobId: formData.mobDemobId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setEntries(prev => [...prev, newEntry]);
    } else if (modalMode === 'edit' && editingEntry) {
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntry.id 
          ? {
              ...entry,
              namaPersonil: formData.namaPersonil || entry.namaPersonil,
              namaProject: formData.namaProject || entry.namaProject,
              noSO: formData.noSO || entry.noSO,
              jenisLogBook: formData.jenisLogBook || entry.jenisLogBook,
              tglKeluar: formData.tglKeluar || entry.tglKeluar,
              tglMasuk: formData.tglMasuk || entry.tglMasuk,
              status: formData.tglMasuk ? 'Sudah Kembali' : 'Belum Kembali',
              qhseValidationKeluar: formData.qhseValidationKeluar ?? entry.qhseValidationKeluar,
              qhseValidationMasuk: formData.qhseValidationMasuk ?? entry.qhseValidationMasuk,
              mobDemobId: formData.mobDemobId || entry.mobDemobId,
              updatedAt: new Date().toISOString()
            }
          : entry
      ));
    }
    setShowModal(false);
    setFormData({});
  };

  const handleConfirmDelete = () => {
    if (deletingEntry) {
      setEntries(prev => prev.filter(entry => entry.id !== deletingEntry.id));
      setShowDeleteModal(false);
      setDeletingEntry(null);
    }
  };

  const handleInputChange = (field: keyof LogBookRATEntry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const getJenisBadge = (jenis: string) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        jenis === 'Operator' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-purple-100 text-purple-800'
      }`}>
        {jenis}
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
                <BookOpen className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                  Log in Log Out Log Book RAT
                </h1>
              </div>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  QHSE
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Log Book RAT</span>
              </nav>
              <p className="text-gray-600 mt-2">Monitoring log book personil RAT dengan integrasi Mob-Demob dan validasi QHSE</p>
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
                <p className="text-sm font-medium text-gray-600">Total Log Book</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
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
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Jenis</option>
                <option value="Operator">Operator</option>
                <option value="Trainer">Trainer</option>
              </select>
              
              <button
                onClick={handleAddEntry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambah Log Book
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Log Book RAT Entries
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Daftar log in/out personil untuk pekerjaan RAT
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
                          onClick={() => handleViewEntry(entry)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === 'add' ? 'Tambah Log Book RAT' : 
                   modalMode === 'edit' ? 'Edit Log Book RAT' : 'Detail Log Book RAT'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Personil
                  </label>
                  <input
                    type="text"
                    value={formData.namaPersonil || ''}
                    onChange={(e) => handleInputChange('namaPersonil', e.target.value)}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Masukkan nama personil"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Project
                  </label>
                  <input
                    type="text"
                    value={formData.namaProject || ''}
                    onChange={(e) => handleInputChange('namaProject', e.target.value)}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Masukkan nama project"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No SO
                  </label>
                  <input
                    type="text"
                    value={formData.noSO || ''}
                    onChange={(e) => handleInputChange('noSO', e.target.value)}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Masukkan nomor SO"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Log Book
                  </label>
                  <select
                    value={formData.jenisLogBook || 'Operator'}
                    onChange={(e) => handleInputChange('jenisLogBook', e.target.value as 'Operator' | 'Trainer')}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="Operator">Operator</option>
                    <option value="Trainer">Trainer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Keluar
                  </label>
                  <input
                    type="date"
                    value={formData.tglKeluar || ''}
                    onChange={(e) => handleInputChange('tglKeluar', e.target.value)}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Masuk
                  </label>
                  <input
                    type="date"
                    value={formData.tglMasuk || ''}
                    onChange={(e) => handleInputChange('tglMasuk', e.target.value)}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mob-Demob ID
                  </label>
                  <input
                    type="text"
                    value={formData.mobDemobId || ''}
                    onChange={(e) => handleInputChange('mobDemobId', e.target.value)}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Masukkan Mob-Demob ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    QHSE Validation
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.qhseValidationKeluar || false}
                        onChange={(e) => handleInputChange('qhseValidationKeluar', e.target.checked)}
                        disabled={modalMode === 'view'}
                        className="mr-2"
                      />
                      <span className="text-sm">Keluar</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.qhseValidationMasuk || false}
                        onChange={(e) => handleInputChange('qhseValidationMasuk', e.target.checked)}
                        disabled={modalMode === 'view'}
                        className="mr-2"
                      />
                      <span className="text-sm">Masuk</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {modalMode !== 'view' && (
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveEntry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {modalMode === 'add' ? 'Tambah' : 'Simpan'}
                  </button>
                </div>
              )}
              
              {modalMode === 'view' && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Hapus Log Book RAT
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus log book untuk <strong>{deletingEntry.namaPersonil}</strong>?
                  <br />
                  Project: <strong>{deletingEntry.namaProject}</strong>
                  <br />
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSELogBookRATDashboard;
