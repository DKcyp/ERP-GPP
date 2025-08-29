import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FileText, AlertTriangle, Clock, Search, PlusCircle, Download } from 'lucide-react';

interface MCUPegawai {
  id: string;
  namaPegawai: string;
  jenisMCU: string;
  masaBerlaku: string;
  documentUrl: string;
}

const MonitoringMCUDashboard: React.FC = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to midnight for accurate date comparison

  const dummyData: MCUPegawai[] = [
    {
      id: 'MCU001',
      namaPegawai: 'Budi Santoso',
      jenisMCU: 'General Check-up',
      masaBerlaku: '2024-08-20', // Contoh: Expired jika hari ini setelah 20 Agustus 2024
      documentUrl: '#'
    },
    {
      id: 'MCU002',
      namaPegawai: 'Siti Aminah',
      jenisMCU: 'Medical Fitness',
      masaBerlaku: '2025-03-10', // Contoh: Tidak expired, tidak expiring soon (jika hari ini Oct/Nov 2024)
      documentUrl: '#'
    },
    {
      id: 'MCU003',
      namaPegawai: 'Joko Susilo',
      jenisMCU: 'General Check-up',
      masaBerlaku: '2024-07-01', // Contoh: Expired
      documentUrl: '#'
    },
    {
      id: 'MCU004',
      namaPegawai: 'Dewi Lestari',
      jenisMCU: 'Medical Fitness',
      masaBerlaku: '2025-01-25', // Contoh: Expiring Soon (jika hari ini Oct/Nov 2024)
      documentUrl: '#'
    },
    {
      id: 'MCU005',
      namaPegawai: 'Rudi Hartono',
      jenisMCU: 'General Check-up',
      masaBerlaku: '2024-09-15', // Contoh: Expired
      documentUrl: '#'
    },
  ];

  const isExpiringSoon = (masaBerlakuDate: string): boolean => {
    const expiryDate = new Date(masaBerlakuDate);
    expiryDate.setHours(0, 0, 0, 0); // Normalize expiry date to midnight
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 90 && diffDays > 0; // Expiring soon, but not today or in the past
  };

  const isExpired = (masaBerlakuDate: string): boolean => {
    const expiryDate = new Date(masaBerlakuDate);
    expiryDate.setHours(0, 0, 0, 0); // Normalize expiry date to midnight
    return expiryDate.getTime() < today.getTime();
  };

  // State for search and filter
  const [searchNamaPegawai, setSearchNamaPegawai] = useState('');
  const [jenisMCUFilter, setJenisMCUFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showEntries, setShowEntries] = useState('10');

  const handleSearch = () => {
    alert(`Searching for Nama Pegawai: ${searchNamaPegawai}, Jenis MCU: ${jenisMCUFilter}, Start Date: ${startDate?.toLocaleDateString()}, End Date: ${endDate?.toLocaleDateString()}`);
    // Implement actual search logic here
  };

  const handleAddMCU = () => {
    alert('Tambah MCU Pegawai');
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
                MONITORING MCU
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring MCU</span>
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
              <label htmlFor="jenisMCUFilter" className="block text-sm font-medium text-gray-700 mb-2">Pilih Jenis MCU</label>
              <div className="relative">
                <select
                  id="jenisMCUFilter"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={jenisMCUFilter}
                  onChange={(e) => setJenisMCUFilter(e.target.value)}
                >
                  <option value="">Pilih jenis...</option>
                  <option value="General Check-up">General Check-up</option>
                  <option value="Medical Fitness">Medical Fitness</option>
                  {/* Add more options as needed */}
                </select>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-180" /> {/* Chevron down */}
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
              onClick={handleAddMCU}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah MCU
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
                    Jenis MCU
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masa Berlaku
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyData.map((mcu) => {
                  const expired = isExpired(mcu.masaBerlaku);
                  const expiringSoon = !expired && isExpiringSoon(mcu.masaBerlaku); // Only show if not already expired

                  return (
                    <tr
                      key={mcu.id}
                      className={
                        expired
                          ? 'bg-red-50 hover:bg-red-100 transition-colors'
                          : expiringSoon
                          ? 'bg-yellow-50 hover:bg-yellow-100 transition-colors'
                          : 'hover:bg-gray-50 transition-colors'
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {mcu.namaPegawai}
                        {expired && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Expired
                          </span>
                        )}
                        {!expired && expiringSoon && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Expiring Soon
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mcu.jenisMCU}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(mcu.masaBerlaku).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href={mcu.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                          <FileText className="h-4 w-4 mr-1" /> View Document
                        </a>
                      </td>
                    </tr>
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

export default MonitoringMCUDashboard;
