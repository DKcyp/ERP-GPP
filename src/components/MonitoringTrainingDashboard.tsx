import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FileText, Edit, Trash2, PlusCircle, ChevronDown, ChevronUp, AlertTriangle, Clock, Search, Download } from 'lucide-react';

interface TrainingSertifikat {
  id: string;
  namaSertifikat: string;
  masaBerlaku: string;
  documentUrl: string;
}

interface PegawaiTraining {
  id: string;
  namaPegawai: string;
  jumlahSertifikat: number;
  masaBerlakuTerakhir: string; // This field will no longer be displayed in the main table
  documentUrl: string;
  sertifikatDetails: TrainingSertifikat[];
}

const MonitoringTrainingDashboard: React.FC = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day for accurate date comparison

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const dummyData: PegawaiTraining[] = [
    {
      id: 'PT001',
      namaPegawai: 'Budi Santoso',
      jumlahSertifikat: 3,
      masaBerlakuTerakhir: '2025-06-01',
      documentUrl: '#',
      sertifikatDetails: [
        { id: 'S001', namaSertifikat: 'K3 Umum', masaBerlaku: '2025-06-01', documentUrl: '#' },
        { id: 'S002', namaSertifikat: 'First Aid', masaBerlaku: '2024-08-15', documentUrl: '#' }, // Contoh: Expired
        { id: 'S003', namaSertifikat: 'Fire Safety', masaBerlaku: '2025-01-20', documentUrl: '#' }, // Contoh: Expiring Soon (jika hari ini sebelum 2025-01-20 dan dalam 90 hari)
      ],
    },
    {
      id: 'PT002',
      namaPegawai: 'Siti Aminah',
      jumlahSertifikat: 2,
      masaBerlakuTerakhir: '2024-09-30',
      documentUrl: '#',
      sertifikatDetails: [
        { id: 'S004', namaSertifikat: 'ISO 9001 Auditor', masaBerlaku: '2024-09-30', documentUrl: '#' }, // Contoh: Expired
        { id: 'S005', namaSertifikat: 'Environmental Management', masaBerlaku: '2025-03-10', documentUrl: '#' },
      ],
    },
    {
      id: 'PT003',
      namaPegawai: 'Joko Susilo',
      jumlahSertifikat: 1,
      masaBerlakuTerakhir: '2025-11-05',
      documentUrl: '#',
      sertifikatDetails: [
        { id: 'S006', namaSertifikat: 'Confined Space Entry', masaBerlaku: '2025-11-05', documentUrl: '#' }, // Contoh: Valid
      ],
    },
  ];

  const isMasaBerlakuExpired = (masaBerlakuDate: string): boolean => {
    const expiryDate = new Date(masaBerlakuDate);
    expiryDate.setHours(0, 0, 0, 0);
    return expiryDate.getTime() < today.getTime();
  };

  const isMasaBerlakuExpiringSoon = (masaBerlakuDate: string): boolean => {
    const expiryDate = new Date(masaBerlakuDate);
    expiryDate.setHours(0, 0, 0, 0);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays < 90; // Expiring today or in the next 89 days
  };

  const getPegawaiTrainingRowStatus = (pegawai: PegawaiTraining) => {
    let hasExpiredCert = false;
    let hasExpiringSoonCert = false;

    for (const sertifikat of pegawai.sertifikatDetails) {
      if (isMasaBerlakuExpired(sertifikat.masaBerlaku)) {
        hasExpiredCert = true;
        break; // Jika ada sertifikat yang kadaluarsa, baris pegawai ditandai sebagai expired
      }
      if (isMasaBerlakuExpiringSoon(sertifikat.masaBerlaku)) {
        hasExpiringSoonCert = true;
      }
    }

    if (hasExpiredCert) return 'expired';
    if (hasExpiringSoonCert) return 'expiringSoon';
    return 'valid';
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAddSertifikat = (pegawaiId: string) => {
    alert(`Tambah sertifikat untuk pegawai: ${pegawaiId}`);
    // Implement add logic here
  };

  const handleEditSertifikat = (sertifikatId: string) => {
    alert(`Edit sertifikat: ${sertifikatId}`);
    // Implement edit logic here
  };

  const handleDeleteSertifikat = (sertifikatId: string) => {
    if (confirm(`Are you sure you want to delete sertifikat ${sertifikatId}?`)) {
      alert(`Delete sertifikat: ${sertifikatId}`);
      // Implement delete logic here
    }
  };

  // State for search and filter
  const [searchNamaPegawai, setSearchNamaPegawai] = useState('');
  const [jenisSertifikatFilter, setJenisSertifikatFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showEntries, setShowEntries] = useState('10');

  const handleSearch = () => {
    alert(`Searching for Nama Pegawai: ${searchNamaPegawai}, Jenis Sertifikat: ${jenisSertifikatFilter}, Start Date: ${startDate?.toLocaleDateString()}, End Date: ${endDate?.toLocaleDateString()}`);
    // Implement actual search logic here
  };

  const handleAddTraining = () => {
    alert('Tambah Training Pegawai');
    // Implement add logic here
  };

  const handleExport = (type: string) => {
    alert(`Exporting as ${type}`);
    // Implement export logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MONITORING TRAINING
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring Training</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label htmlFor="searchNamaPegawai" className="block text-sm font-medium text-gray-700 mb-2">Cari Nama Pegawai</label>
              <div className="relative">
                <input
                  type="text"
                  id="searchNamaPegawai"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nama pegawai..."
                  value={searchNamaPegawai}
                  onChange={(e) => setSearchNamaPegawai(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="jenisSertifikatFilter" className="block text-sm font-medium text-gray-700 mb-2">Pilih Jenis Sertifikat</label>
              <div className="relative">
                <select
                  id="jenisSertifikatFilter"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={jenisSertifikatFilter}
                  onChange={(e) => setJenisSertifikatFilter(e.target.value)}
                >
                  <option value="">Pilih jenis...</option>
                  <option value="K3 Umum">K3 Umum</option>
                  <option value="First Aid">First Aid</option>
                  <option value="Fire Safety">Fire Safety</option>
                  <option value="ISO 9001 Auditor">ISO 9001 Auditor</option>
                  {/* Add more options as needed */}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="periode" className="block text-sm font-medium text-gray-700 mb-2">Periode Masa Berlaku</label>
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="relative flex-1">
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleAddTraining}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Training
            </button>
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleExport('Excel')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> PDF
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Pegawai
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Sertifikat
                  </th>
                  {/* Removed Masa Berlaku Terakhir column */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyData.map((pegawai) => {
                  const rowStatus = getPegawaiTrainingRowStatus(pegawai);
                  const rowClass = rowStatus === 'expired'
                    ? 'bg-red-50 hover:bg-red-100'
                    : rowStatus === 'expiringSoon'
                      ? 'bg-yellow-50 hover:bg-yellow-100'
                      : 'hover:bg-gray-50';

                  return (
                    <React.Fragment key={pegawai.id}>
                      <tr
                        className={`transition-colors cursor-pointer ${rowClass}`}
                        onClick={() => toggleRow(pegawai.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pegawai.namaPegawai}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pegawai.jumlahSertifikat}
                        </td>
                        {/* Removed Masa Berlaku Terakhir data cell */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a href={pegawai.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                            <FileText className="h-4 w-4 mr-1" /> View Document
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button className="text-gray-600 hover:text-gray-900">
                            {expandedRows.has(pegawai.id) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </button>
                        </td>
                      </tr>
                      {expandedRows.has(pegawai.id) && (
                        <tr>
                          <td colSpan={4} className="p-0"> {/* Adjusted colSpan from 5 to 4 */}
                            <div className="bg-gray-50 p-4 border-t border-gray-200">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">Sertifikat {pegawai.namaPegawai}</h4>
                                <button
                                  onClick={() => handleAddSertifikat(pegawai.id)}
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                >
                                  <PlusCircle className="h-5 w-5 mr-2" /> Tambah Sertifikat
                                </button>
                              </div>
                              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                      Nama Sertifikat
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                      Masa Berlaku
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                      Document
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                                      Aksi
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {pegawai.sertifikatDetails.map((sertifikat) => {
                                    const isExpired = isMasaBerlakuExpired(sertifikat.masaBerlaku);
                                    const isExpiringSoon = !isExpired && isMasaBerlakuExpiringSoon(sertifikat.masaBerlaku);
                                    const sertifikatRowClass = isExpired
                                      ? 'bg-red-50 hover:bg-red-100'
                                      : isExpiringSoon
                                        ? 'bg-yellow-50 hover:bg-yellow-100'
                                        : 'hover:bg-gray-50';

                                    return (
                                      <tr key={sertifikat.id} className={`transition-colors ${sertifikatRowClass}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {sertifikat.namaSertifikat}
                                          {isExpired && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                              <AlertTriangle className="h-3 w-3 mr-1" /> Expired
                                            </span>
                                          )}
                                          {isExpiringSoon && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                              <AlertTriangle className="h-3 w-3 mr-1" /> Expiring Soon
                                            </span>
                                          )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {new Date(sertifikat.masaBerlaku).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          <a href={sertifikat.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                                            <FileText className="h-4 w-4 mr-1" /> View Document
                                          </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                          <div className="flex justify-center space-x-2">
                                            <button
                                              onClick={() => handleEditSertifikat(sertifikat.id)}
                                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                            >
                                              <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteSertifikat(sertifikat.id)}
                                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringTrainingDashboard;
