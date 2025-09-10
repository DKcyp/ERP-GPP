import React, { useState, useEffect } from 'react';
import ApproveTimesheetModal, { ApproveTimesheetFormData } from './ApproveTimesheetModal';
import ApproveTimesheetDetailModal from './ApproveTimesheetDetailModal';
import { Plus, ArrowUp } from 'lucide-react';

// Local interface for timesheet data used in this component
interface ApprovalTimesheetPegawaiData {
  id: string;
  no: number;
  nama: string;
  kualifikasi: string[];
  mob: string;
  demob: string;
  durasi: string;
  noSO: string;
  noHPP: string;
  lokasi: string;
  jenisPekerjaan: string;
  status: 'Menunggu Review' | 'Release' | 'Approve' | 'Rejected';
  namaProject: string;
  namaClient: string;
  jamAwalKerja: string;
  jamSelesaiKerja: string;
  overtime: string;
  tunjangan: { namaTunjangan: string; rateTunjangan: string; overtime: string }[];
}

const ApprovalTimesheetDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Renamed for clarity
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // New state
  const [selectedTimesheetForDetail, setSelectedTimesheetForDetail] = useState<ApprovalTimesheetPegawaiData | null>(null); // New state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Removed delete modal logic
  const [sortField, setSortField] = useState<keyof ApprovalTimesheetPegawaiData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the second image, updated with new fields
  const [approvalTimesheetData, setApprovalTimesheetData] = useState<ApprovalTimesheetPegawaiData[]>([
    {
      id: '1',
      no: 1,
      nama: 'Ahmad',
      kualifikasi: ['Welder', 'Fitter'],
      mob: '01-01-2025',
      demob: '05-01-2025',
      durasi: '4 hari',
      noSO: 'SO-001',
      noHPP: 'SO-001.1',
      lokasi: 'Bali',
      jenisPekerjaan: 'On Call',
      status: 'Approve',
      namaProject: 'Proyek Jembatan A',
      namaClient: 'PT Konstruksi Sejahtera',
      jamAwalKerja: '08:00',
      jamSelesaiKerja: '17:00',
      overtime: '2 Jam',
      tunjangan: [
        { namaTunjangan: 'Team Leader - Daily Rate/', rateTunjangan: 'Rp. 750,000', overtime: 'Rp. 187,500 (3 Jam)' },
        { namaTunjangan: 'Team Leader-Daily Basic M', rateTunjangan: 'Rp. 500,000', overtime: '' }
      ]
    },
    {
      id: '2',
      no: 2,
      nama: 'Budi',
      kualifikasi: ['Electrician'],
      mob: '03-02-2025',
      demob: '08-02-2025',
      durasi: '5 hari',
      noSO: 'SO-002',
      noHPP: 'SO-002.1',
      lokasi: 'Jakarta',
      jenisPekerjaan: 'Tender',
      status: 'Menunggu Review',
      namaProject: 'Pembangunan Gedung B',
      namaClient: 'PT Pembangunan Nasional',
      jamAwalKerja: '09:00',
      jamSelesaiKerja: '18:00',
      overtime: '1 Jam',
      tunjangan: [
        { namaTunjangan: 'Electrician Daily Rate', rateTunjangan: 'Rp. 600,000', overtime: 'Rp. 150,000 (1 Jam)' }
      ]
    },
    {
      id: '3',
      no: 3,
      nama: 'Charlie',
      kualifikasi: ['Technician', 'Supervisor'],
      mob: '10-03-2025',
      demob: '15-03-2025',
      durasi: '5 hari',
      noSO: 'SO-003',
      noHPP: 'SO-003.1',
      lokasi: 'Surabaya',
      jenisPekerjaan: 'On Call',
      status: 'Rejected',
      namaProject: 'Instalasi Sistem C',
      namaClient: 'CV Infrastruktur Jaya',
      jamAwalKerja: '07:00',
      jamSelesaiKerja: '16:00',
      overtime: '3 Jam',
      tunjangan: [
        { namaTunjangan: 'Technician Daily Rate', rateTunjangan: 'Rp. 700,000', overtime: 'Rp. 175,000 (2 Jam)' },
        { namaTunjangan: 'Supervisor Allowance', rateTunjangan: 'Rp. 200,000', overtime: '' }
      ]
    },
    {
      id: '4',
      no: 4,
      nama: 'Dewi',
      kualifikasi: ['Supervisor'],
      mob: '05-04-2025',
      demob: '10-04-2025',
      durasi: '5 hari',
      noSO: 'SO-004',
      noHPP: 'SO-004.1',
      lokasi: 'Medan',
      jenisPekerjaan: 'Tender',
      status: 'Approve',
      namaProject: 'Renovasi Kantor D',
      namaClient: 'PT Teknologi Maju',
      jamAwalKerja: '08:30',
      jamSelesaiKerja: '17:30',
      overtime: '0 Jam',
      tunjangan: [
        { namaTunjangan: 'Supervisor Daily Rate', rateTunjangan: 'Rp. 800,000', overtime: '' }
      ]
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddApprovalTimesheet = (formData: ApproveTimesheetFormData) => {
    const newApprovalTimesheet: ApprovalTimesheetPegawaiData = {
      id: (approvalTimesheetData.length + 1).toString(),
      no: approvalTimesheetData.length + 1,
      nama: formData.nama,
      kualifikasi: formData.kualifikasi, // Now an array
      mob: formData.mob,
      demob: formData.demob,
      durasi: formData.durasi,
      noSO: formData.noSO,
      noHPP: formData.noHPP,
      lokasi: formData.lokasi,
      jenisPekerjaan: formData.jenisPekerjaan,
      status: 'Menunggu Review',
      namaProject: formData.namaProject,
      namaClient: formData.namaClient,
      jamAwalKerja: '08:00', // Default or derive from form
      jamSelesaiKerja: '17:00', // Default or derive from form
      overtime: '0 Jam', // Default or derive from form
      tunjangan: formData.tunjangan,
    };

    setApprovalTimesheetData(prev => [newApprovalTimesheet, ...prev.map(a => ({ ...a, no: a.no + 1 }))]);
  };

  const handleSort = (field: keyof ApprovalTimesheetPegawaiData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleApprove = (id: string) => {
    setApprovalTimesheetData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'Approve' as const } : item
      )
    );
    setIsDetailModalOpen(false); // Close modal after action
    setSelectedTimesheetForDetail(null);
  };

  const handleRelease = (id: string) => {
    setApprovalTimesheetData(prev => prev.map(item => (item.id === id ? { ...item, status: 'Release' as const } : item)));
    setIsDetailModalOpen(false);
    setSelectedTimesheetForDetail(null);
  };

  const handleReject = (id: string) => {
    setApprovalTimesheetData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'Rejected' as const } : item
      )
    );
    setIsDetailModalOpen(false); // Close modal after action
    setSelectedTimesheetForDetail(null);
  };

  // Open detail modal (if needed in the future)
  const openDetailModal = (item: ApprovalTimesheetPegawaiData) => {
    setSelectedTimesheetForDetail(item);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approve': return 'bg-green-600 text-white';
      case 'Menunggu Review': return 'bg-yellow-500 text-white';
      case 'Release': return 'bg-blue-600 text-white';
      case 'Rejected': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJenisPekerjaanColor = (jenis: string) => {
    switch (jenis) {
      case 'On Call': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Tender': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter data based on search criteria
  const filteredData = approvalTimesheetData.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.nama.toLowerCase().includes(searchLower) ||
      item.kualifikasi.join(', ').toLowerCase().includes(searchLower) || // Search in joined kualifikasi
      item.noSO.toLowerCase().includes(searchLower) ||
      item.lokasi.toLowerCase().includes(searchLower)
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle string comparison for kualifikasi (array)
    if (sortField === 'kualifikasi') {
      const aKualifikasi = (aValue as string[]).join(', ');
      const bKualifikasi = (bValue as string[]).join(', ');
      if (sortDirection === 'asc') {
        return aKualifikasi > bKualifikasi ? 1 : -1;
      } else {
        return aKualifikasi < bKualifikasi ? 1 : -1;
      }
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Approval Timesheet Pegawai
          </h1>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Approval Timesheet Pegawai
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Controls Section */}
        <div className="flex items-center justify-between">
          {/* Show entries control */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('no')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No</span>
                      {sortField === 'no' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('nama')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama</span>
                      {sortField === 'nama' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('kualifikasi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Kualifikasi</span>
                      {sortField === 'kualifikasi' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('mob')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>MOB</span>
                      {sortField === 'mob' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('demob')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>DEMOB</span>
                      {sortField === 'demob' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('durasi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Durasi (hari)</span>
                      {sortField === 'durasi' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('noSO')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No SO</span>
                      {sortField === 'noSO' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('noHPP')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No HPP</span>
                      {sortField === 'noHPP' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('lokasi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Lokasi</span>
                      {sortField === 'lokasi' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('jenisPekerjaan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Jenis Pekerjaan</span>
                      {sortField === 'jenisPekerjaan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortField === 'status' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{item.no}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.nama}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.kualifikasi.join(', ')}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.mob}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.demob}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.durasi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.noSO}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.noHPP}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.lokasi}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getJenisPekerjaanColor(item.jenisPekerjaan)}`}>
                        {item.jenisPekerjaan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {item.status === 'Menunggu Review' && (
                          <>
                            <button
                              onClick={() => handleRelease(item.id)}
                              className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                              title="Release"
                            >
                              Release
                            </button>
                            <button
                              onClick={() => handleReject(item.id)}
                              className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                              title="Reject"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {item.status === 'Release' && (
                          <>
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                              title="Approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(item.id)}
                              className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                              title="Reject"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {item.status === 'Approve' && (
                          <span className="text-xs text-gray-500">No action</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <button
                  onClick={() => handlePageChange(1)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    currentPage === 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  1
                </button>

                {/* Add more page buttons if needed, similar to the original design */}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Timesheet Modal (existing) */}
      <ApproveTimesheetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddApprovalTimesheet}
      />

      {/* New Approve Timesheet Detail Modal */}
      <ApproveTimesheetDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        timesheetData={selectedTimesheetForDetail}
        onApprove={handleApprove}
        onReject={handleReject}
        onRelease={handleRelease}
      />
    </div>
  );
};

export default ApprovalTimesheetDashboard;
