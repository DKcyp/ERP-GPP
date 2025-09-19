import React, { useState, useMemo } from 'react';
import { Search, Eye, Pencil, Trash2, PlusCircle, FileText, Calendar, User, Shield, Printer } from 'lucide-react';

interface DoseRecord {
  id: string;
  name: string;
  qualification: string;
  sibNo: string;
  validation: string;
  documentNo: string;
  revisionNo: string;
  dateOfRevision: string;
  dateOfEffective: string;
  page: string;
  doseData: {
    [year: string]: {
      [month: string]: number | null;
    };
  };
  totalByYear: {
    [year: string]: number;
  };
}

const QHSEKartuDosisDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedRecord, setSelectedRecord] = useState<DoseRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<DoseRecord | null>(null);
  const [formData, setFormData] = useState<Partial<DoseRecord>>({});

  const [records, setRecords] = useState<DoseRecord[]>([
    {
      id: '1',
      name: 'Dwi Yuditiya',
      qualification: 'Radiography tk 1 / Radiography tk 2',
      sibNo: '353532.425.01.050421 / 353532.415.00.050824',
      validation: '18-03-2026 / 30-06-2029',
      documentNo: 'GBP-HSE-FM-20',
      revisionNo: '05',
      dateOfRevision: '07 March 2021',
      dateOfEffective: '07 March 2021',
      page: '1 of 1',
      doseData: {
        '2021': { 'March': 0, 'June': 0.23, 'September': 0.21, 'December': 0.5 },
        '2022': { 'March': 0.39, 'June': 0.14, 'September': 0.06, 'December': 0.09 },
        '2023': { 'March': 0.82, 'June': 0.1, 'September': 0.07, 'December': 4.24 },
        '2024': { 'March': 0, 'June': 0, 'September': 0, 'December': 0.06 },
        '2025': { 'March': 0.7, 'June': null, 'September': null, 'December': null }
      },
      totalByYear: {
        '2021': 0.94,
        '2022': 0.68,
        '2023': 5.23,
        '2024': 0.06,
        '2025': 0.7
      }
    },
    {
      id: '2',
      name: 'Ahmad Rizki',
      qualification: 'Radiography tk 1',
      sibNo: '353532.425.01.050422',
      validation: '15-05-2025',
      documentNo: 'GBP-HSE-FM-20',
      revisionNo: '05',
      dateOfRevision: '07 March 2021',
      dateOfEffective: '07 March 2021',
      page: '1 of 1',
      doseData: {
        '2023': { 'March': 0.15, 'June': 0.08, 'September': 0.12, 'December': 0.25 },
        '2024': { 'March': 0.18, 'June': 0.22, 'September': 0.14, 'December': 0.31 },
        '2025': { 'March': 0.19, 'June': null, 'September': null, 'December': null }
      },
      totalByYear: {
        '2023': 0.6,
        '2024': 0.85,
        '2025': 0.19
      }
    }
  ]);

  const years = ['2021', '2022', '2023', '2024', '2025'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  const filteredRecords = useMemo(() => {
    return records.filter(record =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.sibNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  const openAddModal = () => {
    setModalMode('add');
    setSelectedRecord(null);
    setFormData({
      name: '',
      qualification: '',
      sibNo: '',
      validation: '',
      documentNo: 'GBP-HSE-FM-20',
      revisionNo: '05',
      dateOfRevision: '07 March 2021',
      dateOfEffective: '07 March 2021',
      page: '1 of 1',
      doseData: {},
      totalByYear: {}
    });
    setShowModal(true);
  };

  const openViewModal = (record: DoseRecord) => {
    setModalMode('view');
    setSelectedRecord(record);
    setFormData(record);
    setShowModal(true);
  };

  const openEditModal = (record: DoseRecord) => {
    setModalMode('edit');
    setSelectedRecord(record);
    setFormData(record);
    setShowModal(true);
  };

  const openDeleteConfirm = (record: DoseRecord) => {
    setRecordToDelete(record);
    setShowDeleteConfirm(true);
  };

  const handleInputChange = (field: keyof DoseRecord, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDoseChange = (year: string, month: string, value: number | null) => {
    setFormData(prev => ({
      ...prev,
      doseData: {
        ...prev.doseData,
        [year]: {
          ...prev.doseData?.[year],
          [month]: value
        }
      }
    }));
    
    // Recalculate yearly total
    const yearData = { ...formData.doseData?.[year], [month]: value };
    const yearTotal = Object.values(yearData).reduce((sum, val) => (sum || 0) + (val || 0), 0);
    
    setFormData(prev => ({
      ...prev,
      totalByYear: {
        ...prev.totalByYear,
        [year]: yearTotal
      }
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.qualification || !formData.sibNo) {
      alert('Mohon lengkapi data yang wajib diisi');
      return;
    }

    if (modalMode === 'add') {
      const newRecord: DoseRecord = {
        id: Date.now().toString(),
        name: formData.name!,
        qualification: formData.qualification!,
        sibNo: formData.sibNo!,
        validation: formData.validation || '',
        documentNo: formData.documentNo || 'GBP-HSE-FM-20',
        revisionNo: formData.revisionNo || '05',
        dateOfRevision: formData.dateOfRevision || '07 March 2021',
        dateOfEffective: formData.dateOfEffective || '07 March 2021',
        page: formData.page || '1 of 1',
        doseData: formData.doseData || {},
        totalByYear: formData.totalByYear || {}
      };
      
      setRecords(prev => [newRecord, ...prev]);
    } else if (modalMode === 'edit' && selectedRecord) {
      setRecords(prev => prev.map(record => 
        record.id === selectedRecord.id 
          ? { ...record, ...formData } as DoseRecord
          : record
      ));
    }
    
    setShowModal(false);
    setFormData({});
  };

  const handleDelete = () => {
    if (recordToDelete) {
      setRecords(records.filter(record => record.id !== recordToDelete.id));
      setShowDeleteConfirm(false);
      setRecordToDelete(null);
    }
  };

  const handlePrint = (record: DoseRecord) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const printContent = generatePrintContent(record);
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const generatePrintContent = (record: DoseRecord) => {
    const years = Object.keys(record.doseData).sort();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kartu Dosis - ${record.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .company-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .document-info { margin-bottom: 20px; }
          .personal-info { margin-bottom: 20px; border: 1px solid #000; padding: 10px; }
          .dose-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .dose-table th, .dose-table td { border: 1px solid #000; padding: 8px; text-align: center; }
          .dose-table th { background-color: #f0f0f0; font-weight: bold; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
          .signature-box { text-align: center; width: 200px; }
          .signature-line { border-bottom: 1px solid #000; height: 60px; margin-bottom: 5px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>KARTU DOSIS PERORANGAN</h2>
          <h3>PT. GAMMA BUANA PERSADA</h3>
        </div>
        
        <div class="company-info">
          <div>
            <strong>Dokumen No:</strong> ${record.documentNo}<br>
            <strong>Revisi No:</strong> ${record.revisionNo}
          </div>
          <div>
            <strong>Tanggal Revisi:</strong> ${record.dateOfRevision}<br>
            <strong>Tanggal Berlaku:</strong> ${record.dateOfEffective}<br>
            <strong>Halaman:</strong> ${record.page}
          </div>
        </div>
        
        <div class="personal-info">
          <strong>Nama:</strong> ${record.name}<br>
          <strong>Kualifikasi:</strong> ${record.qualification}<br>
          <strong>No. SIB:</strong> ${record.sibNo}<br>
          <strong>Masa Berlaku:</strong> ${record.validation}
        </div>
        
        <table class="dose-table">
          <thead>
            <tr>
              <th rowspan="2">Bulan</th>
              <th colspan="${years.length}">Tahun</th>
            </tr>
            <tr>
              ${years.map(year => `<th>${year}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${months.map(month => `
              <tr>
                <td><strong>${month}</strong></td>
                ${years.map(year => {
                  const value = record.doseData[year]?.[month];
                  return `<td>${value !== null && value !== undefined ? value : '-'}</td>`;
                }).join('')}
              </tr>
            `).join('')}
            <tr style="background-color: #f0f0f0;">
              <td><strong>TOTAL</strong></td>
              ${years.map(year => `<td><strong>${record.totalByYear[year] || 0}</strong></td>`).join('')}
            </tr>
          </tbody>
        </table>
        
        <div class="signature-section">
          <div class="signature-box">
            <div>Petugas Proteksi Radiasi</div>
            <div class="signature-line"></div>
            <div>(.............................)</div>
          </div>
          <div class="signature-box">
            <div>Mengetahui</div>
            <div class="signature-line"></div>
            <div>(.............................)</div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">KARTU DOSIS</h1>
              <nav className="text-sm text-gray-600">
                <span>Dashboard</span> <span className="mx-2">›</span> 
                <span>QHSE</span> <span className="mx-2">›</span> 
                <span>Radiography</span> <span className="mx-2">›</span> 
                <span className="text-blue-600">Kartu Dosis</span>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openAddModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Tambah Kartu Dosis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pencarian</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, kualifikasi, atau No. SIB..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Personil</p>
                <p className="text-2xl font-bold text-gray-900">{records.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif {selectedYear}</p>
                <p className="text-2xl font-bold text-green-600">
                  {records.filter(r => r.doseData[selectedYear]).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rata-rata Dosis</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(records.reduce((sum, r) => sum + (r.totalByYear[selectedYear] || 0), 0) / records.length).toFixed(2)} mSv
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Perlu Update</p>
                <p className="text-2xl font-bold text-red-600">
                  {records.filter(r => {
                    const yearData = r.doseData[selectedYear];
                    if (!yearData) return true;
                    const currentMonth = new Date().getMonth();
                    const monthsToCheck = months.slice(0, currentMonth + 1);
                    return monthsToCheck.some(month => yearData[month] === null);
                  }).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Kartu Dosis Personil</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kualifikasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. SIB</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Dosis {selectedYear}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record, index) => {
                  const totalDose = record.totalByYear[selectedYear] || 0;
                  const status = totalDose > 20 ? 'Melebihi Batas' : totalDose > 15 ? 'Mendekati Batas' : 'Normal';
                  const statusColor = totalDose > 20 ? 'bg-red-100 text-red-800' : 
                                    totalDose > 15 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
                  
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.qualification}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.sibNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.validation}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{totalDose.toFixed(2)} mSv</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openViewModal(record)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Lihat
                          </button>
                          <button
                            onClick={() => handlePrint(record)}
                            className="text-purple-600 hover:text-purple-900 flex items-center gap-1"
                          >
                            <Printer className="h-4 w-4" />
                            Cetak
                          </button>
                          <button
                            onClick={() => openEditModal(record)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(record)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === 'add' ? 'Tambah Kartu Dosis' : 
                 modalMode === 'edit' ? 'Edit Kartu Dosis' : 'Detail Kartu Dosis'}
              </h2>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {(modalMode === 'add' || modalMode === 'edit') && (
                <div className="space-y-6">
                  {/* Basic Information Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Personil *</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan nama personil"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kualifikasi *</label>
                      <input
                        type="text"
                        value={formData.qualification || ''}
                        onChange={(e) => handleInputChange('qualification', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Radiography tk 1 / Radiography tk 2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">No. SIB *</label>
                      <input
                        type="text"
                        value={formData.sibNo || ''}
                        onChange={(e) => handleInputChange('sibNo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="353532.425.01.050421"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Validasi</label>
                      <input
                        type="text"
                        value={formData.validation || ''}
                        onChange={(e) => handleInputChange('validation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="18-03-2026 / 30-06-2029"
                      />
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dokumen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Document No.</label>
                        <input
                          type="text"
                          value={formData.documentNo || 'GBP-HSE-FM-20'}
                          onChange={(e) => handleInputChange('documentNo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Revision No.</label>
                        <input
                          type="text"
                          value={formData.revisionNo || '05'}
                          onChange={(e) => handleInputChange('revisionNo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page</label>
                        <input
                          type="text"
                          value={formData.page || '1 of 1'}
                          onChange={(e) => handleInputChange('page', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dose Data Entry */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Dosis (mSv)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-center font-bold">Month</th>
                            {years.map(year => (
                              <th key={year} className="border border-gray-300 px-3 py-2 text-center font-bold">{year}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {months.map(month => (
                            <tr key={month}>
                              <td className="border border-gray-300 px-3 py-2 font-medium">{month}</td>
                              {years.map(year => {
                                const value = formData.doseData?.[year]?.[month];
                                return (
                                  <td key={`${year}-${month}`} className="border border-gray-300 px-2 py-1">
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={value || ''}
                                      onChange={(e) => handleDoseChange(year, month, e.target.value ? parseFloat(e.target.value) : null)}
                                      className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 rounded"
                                      placeholder="0.00"
                                    />
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                          <tr className="bg-gray-100 font-bold">
                            <td className="border border-gray-300 px-3 py-2 text-center">TOTAL</td>
                            {years.map(year => (
                              <td key={year} className="border border-gray-300 px-3 py-2 text-center">
                                {(formData.totalByYear?.[year] || 0).toFixed(2)}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {modalMode === 'view' && selectedRecord && (
                <div className="space-y-6">
                  {/* Document Header */}
                  <div className="border border-gray-300">
                    <div className="bg-gray-100 p-4 border-b border-gray-300">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <h3 className="text-xl font-bold text-center">FORM</h3>
                          <h2 className="text-2xl font-bold text-center mt-2">DOSIS CARD</h2>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex"><span className="w-24">Document No.</span><span>{selectedRecord.documentNo}</span></div>
                          <div className="flex"><span className="w-24">Revision No.</span><span>{selectedRecord.revisionNo}</span></div>
                          <div className="flex"><span className="w-24">Date of Revision</span><span>{selectedRecord.dateOfRevision}</span></div>
                          <div className="flex"><span className="w-24">Date of Effective</span><span>{selectedRecord.dateOfEffective}</span></div>
                          <div className="flex"><span className="w-24">Page</span><span>{selectedRecord.page}</span></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Personal Info */}
                    <div className="p-4 space-y-2 text-sm">
                      <div className="flex"><span className="w-24 font-medium">Name</span><span>: {selectedRecord.name}</span></div>
                      <div className="flex"><span className="w-24 font-medium">Qualification</span><span>: {selectedRecord.qualification}</span></div>
                      <div className="flex"><span className="w-24 font-medium">SIB No.</span><span>: {selectedRecord.sibNo}</span></div>
                      <div className="flex"><span className="w-24 font-medium">Validation</span><span>: {selectedRecord.validation}</span></div>
                    </div>

                    {/* Dose Evaluation Table */}
                    <div className="p-4">
                      <h4 className="text-center font-bold mb-4 bg-gray-200 py-2">Hasil Evaluasi Dosis (mSv)</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-3 py-2 text-center font-bold">Month</th>
                              {years.map(year => (
                                <th key={year} className="border border-gray-300 px-3 py-2 text-center font-bold">{year}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {months.map(month => (
                              <tr key={month}>
                                <td className="border border-gray-300 px-3 py-2 font-medium">{month}</td>
                                {years.map(year => {
                                  const value = selectedRecord.doseData[year]?.[month];
                                  return (
                                    <td key={`${year}-${month}`} className="border border-gray-300 px-3 py-2 text-center">
                                      {value !== null && value !== undefined ? value : '-'}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                            <tr className="bg-gray-100 font-bold">
                              <td className="border border-gray-300 px-3 py-2 text-center">TOTAL</td>
                              {years.map(year => (
                                <td key={year} className="border border-gray-300 px-3 py-2 text-center">
                                  {selectedRecord.totalByYear[year] || 0}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Signature Section - Only show in view mode */}
                      {modalMode === 'view' && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-6">Tanda Tangan</h4>
                          <div className="flex justify-between items-end">
                            <div className="text-center">
                              <div className="mb-2 text-sm font-medium text-gray-700">Petugas Proteksi Radiasi</div>
                              <div className="w-48 h-20 border-b-2 border-gray-400 mb-2"></div>
                              <div className="text-sm text-gray-600">(.............................)</div>
                            </div>
                            <div className="text-center">
                              <div className="mb-2 text-sm font-medium text-gray-700">Mengetahui</div>
                              <div className="w-48 h-20 border-b-2 border-gray-400 mb-2"></div>
                              <div className="text-sm text-gray-600">(.............................)</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {modalMode === 'view' ? 'Tutup' : 'Batal'}
              </button>
              {modalMode === 'view' && selectedRecord && (
                <button
                  onClick={() => handlePrint(selectedRecord)}
                  className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Kartu Dosis
                </button>
              )}
              {(modalMode === 'add' || modalMode === 'edit') && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  {modalMode === 'add' ? 'Tambah' : 'Simpan'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus kartu dosis untuk <strong>{recordToDelete.name}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEKartuDosisDashboard;
