import React, { useState } from 'react';
import {
  Search, Plus, Edit, Eye, Trash2,
  Download, ChevronLeft, ChevronRight,
  X, Save, AlertCircle,
  Clock, User, CreditCard,
  XCircle, AlertTriangle,
  Home, FileText, Calendar
} from 'lucide-react';

interface MCURecord {
  year: number;
  tanggalKesimpulan: string;
  status: "Fit" | "Fit*" | "Unfit" | "Pending";
}

interface PersonnelHealthData {
  id: string;
  no: number;
  nama: string;
  kualifikasi: string;
  nomorSIB: string;
  masaBerlakuSIB: string;
  mcuHistory: MCURecord[];
}

const QHSEKartuPemantauanKesehatanDashboard: React.FC = () => {
  const [personnelData, setPersonnelData] = useState<PersonnelHealthData[]>([
    {
      id: "1",
      no: 1,
      nama: "Defi Pramesti",
      kualifikasi: "Radiation Protection Officer",
      nomorSIB: "050794.113.03.100323",
      masaBerlakuSIB: "28-05-2026",
      mcuHistory: [
        { year: 2020, tanggalKesimpulan: "23-10-2020", status: "Fit" },
        { year: 2021, tanggalKesimpulan: "19-12-2021", status: "Fit" },
        { year: 2022, tanggalKesimpulan: "22-12-2022", status: "Fit" },
        { year: 2023, tanggalKesimpulan: "20-12-2023", status: "Fit*" },
        { year: 2024, tanggalKesimpulan: "19-11-2024", status: "Fit" },
      ]
    },
    {
      id: "2",
      no: 2,
      nama: "OR YULI ANTONI",
      kualifikasi: "Operator Radiografi",
      nomorSIB: "050794.114.03.100324",
      masaBerlakuSIB: "15-06-2025",
      mcuHistory: [
        { year: 2020, tanggalKesimpulan: "15-09-2020", status: "Fit" },
        { year: 2021, tanggalKesimpulan: "20-10-2021", status: "Fit*" },
        { year: 2022, tanggalKesimpulan: "18-11-2022", status: "Fit" },
        { year: 2023, tanggalKesimpulan: "25-10-2023", status: "Fit" },
        { year: 2024, tanggalKesimpulan: "30-09-2024", status: "Fit" },
      ]
    },
    {
      id: "3",
      no: 3,
      nama: "AR SUTOPO BIMA VICTOR",
      kualifikasi: "Assistant Radiographer",
      nomorSIB: "050794.115.03.100325",
      masaBerlakuSIB: "20-03-2025",
      mcuHistory: [
        { year: 2020, tanggalKesimpulan: "10-08-2020", status: "Fit" },
        { year: 2021, tanggalKesimpulan: "15-09-2021", status: "Fit" },
        { year: 2022, tanggalKesimpulan: "12-08-2022", status: "Unfit" },
        { year: 2023, tanggalKesimpulan: "28-07-2023", status: "Fit*" },
        { year: 2024, tanggalKesimpulan: "22-08-2024", status: "Fit" },
      ]
    },
    {
      id: "4",
      no: 4,
      nama: "PPR EKA SURYA FACHRIZA",
      kualifikasi: "Pekerja Radiasi",
      nomorSIB: "050794.116.03.100326",
      masaBerlakuSIB: "10-12-2025",
      mcuHistory: [
        { year: 2020, tanggalKesimpulan: "05-11-2020", status: "Fit" },
        { year: 2021, tanggalKesimpulan: "12-12-2021", status: "Fit" },
        { year: 2022, tanggalKesimpulan: "08-11-2022", status: "Fit" },
        { year: 2023, tanggalKesimpulan: "15-11-2023", status: "Fit" },
        { year: 2024, tanggalKesimpulan: "Pending", status: "Pending" },
      ]
    },
    {
      id: "5",
      no: 5,
      nama: "OR SLAMET PARYANTO",
      kualifikasi: "Operator Radiografi",
      nomorSIB: "050794.117.03.100327",
      masaBerlakuSIB: "25-08-2024",
      mcuHistory: [
        { year: 2020, tanggalKesimpulan: "18-07-2020", status: "Fit" },
        { year: 2021, tanggalKesimpulan: "22-08-2021", status: "Fit" },
        { year: 2022, tanggalKesimpulan: "30-07-2022", status: "Fit*" },
        { year: 2023, tanggalKesimpulan: "25-08-2023", status: "Fit" },
        { year: 2024, tanggalKesimpulan: "20-08-2024", status: "Fit" },
      ]
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelHealthData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fit":
        return "bg-green-500 text-white";
      case "Fit*":
        return "bg-yellow-500 text-black";
      case "Unfit":
        return "bg-red-500 text-white";
      case "Pending":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  // Get SIB expiry status
  const getSIBExpiryStatus = (date: string) => {
    const expDate = new Date(date);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "expired", color: "text-red-600", bgColor: "bg-red-100" };
    } else if (diffDays <= 90) {
      return { status: "expiring", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    } else {
      return { status: "valid", color: "text-green-600", bgColor: "bg-green-100" };
    }
  };

  // Filter data based on search
  const filteredData = personnelData.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kualifikasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nomorSIB.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Modal handlers
  const openDetailModal = (personnel: PersonnelHealthData) => {
    setSelectedPersonnel(personnel);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedPersonnel(null);
  };

  // Statistics
  const stats = {
    totalPersonnel: personnelData.length,
    fitPersonnel: personnelData.filter(p => 
      p.mcuHistory.length > 0 && p.mcuHistory[p.mcuHistory.length - 1].status === "Fit"
    ).length,
    fitWithCondition: personnelData.filter(p => 
      p.mcuHistory.length > 0 && p.mcuHistory[p.mcuHistory.length - 1].status === "Fit*"
    ).length,
    pendingMCU: personnelData.filter(p => 
      p.mcuHistory.length > 0 && p.mcuHistory[p.mcuHistory.length - 1].status === "Pending"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Home className="h-4 w-4" />
                <span>/</span>
                <span>QHSE</span>
                <span>/</span>
                <span>Radiography</span>
                <span>/</span>
                <span className="text-blue-600 font-medium">Kartu Pemantauan Kesehatan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Kartu Pemantauan Kesehatan</h1>
                <p className="text-blue-100">Monitoring kesehatan personil radiografi</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Personil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Personil</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPersonnel}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fit</p>
                <p className="text-2xl font-bold text-gray-900">{stats.fitPersonnel}</p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fit*</p>
                <p className="text-2xl font-bold text-gray-900">{stats.fitWithCondition}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending MCU</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingMCU}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari nama, kualifikasi, atau nomor SIB..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kualifikasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor SIB</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa Berlaku SIB</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status MCU Terakhir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item) => {
                  const sibStatus = getSIBExpiryStatus(item.masaBerlakuSIB);
                  const latestMCU = item.mcuHistory.length > 0 ? item.mcuHistory[item.mcuHistory.length - 1] : null;
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.no}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openDetailModal(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          {item.nama}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kualifikasi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nomorSIB}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sibStatus.bgColor} ${sibStatus.color}`}>
                          {item.masaBerlakuSIB}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {latestMCU && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(latestMCU.status)}`}>
                            {latestMCU.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openDetailModal(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowEditModal(true)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(item.id);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Hapus"
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
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of{' '}
                  <span className="font-medium">{filteredData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
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
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal - 5 Year MCU History */}
      {showDetailModal && selectedPersonnel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Kartu Pemantauan Kesehatan - {selectedPersonnel.nama}
              </h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Personnel Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama</label>
                    <p className="text-sm text-gray-900">{selectedPersonnel.nama}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kualifikasi</label>
                    <p className="text-sm text-gray-900">{selectedPersonnel.kualifikasi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor SIB</label>
                    <p className="text-sm text-gray-900">{selectedPersonnel.nomorSIB}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Masa Berlaku SIB</label>
                    <p className="text-sm text-gray-900">{selectedPersonnel.masaBerlakuSIB}</p>
                  </div>
                </div>
              </div>

              {/* MCU History Table */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2">
                  <h4 className="font-medium text-gray-900">MCU</h4>
                </div>
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">Ket</th>
                      {selectedPersonnel.mcuHistory.map((record) => (
                        <th key={record.year} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase border-r">
                          {record.year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-r">
                        Tanggal Kesimpulan
                      </td>
                      {selectedPersonnel.mcuHistory.map((record) => (
                        <td key={`date-${record.year}`} className="px-4 py-2 text-sm text-center border-r">
                          {record.tanggalKesimpulan}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-r">
                        Status
                      </td>
                      {selectedPersonnel.mcuHistory.map((record) => (
                        <td key={`status-${record.year}`} className="px-4 py-2 text-center border-r">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEKartuPemantauanKesehatanDashboard;
