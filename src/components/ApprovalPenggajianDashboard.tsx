import React, { useState } from 'react';
import { Clock, Search, Calendar, FileText, FileSpreadsheet, FileDown, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import DetailPenggajianModal from './DetailPenggajianModal';
import ApprovalPenggajianActionModal from './ApprovalPenggajianActionModal';
import { PenggajianDetailData, ApprovalPenggajianActionData } from '../types';

const ApprovalPenggajianDashboard: React.FC = () => {
  const [searchNoPenggajian, setSearchNoPenggajian] = useState('');
  const [searchNamaPegawai, setSearchNamaPegawai] = useState('');
  const [startDate, setStartDate] = useState('01/01/2025');
  const [endDate, setEndDate] = useState('31/01/2025');
  const [showEntries, setShowEntries] = useState(10);

  // State for Detail Penggajian Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPenggajianDetail, setSelectedPenggajianDetail] = useState<PenggajianDetailData | null>(null);

  // State for Approval Action Modal
  const [isApprovalActionModalOpen, setIsApprovalActionModalOpen] = useState(false);
  const [selectedPenggajianForAction, setSelectedPenggajianForAction] = useState<string | null>(null);
  const [approvalActionType, setApprovalActionType] = useState<'approve' | 'reject' | null>(null);

  const data: PenggajianDetailData[] = [
    {
      id: 'pgj-001',
      noPenggajian: 'PGJ-212',
      periode: '01-01-2025 s.d 01-02-2025',
      noPegawai: 'TKN-223',
      namaPegawai: 'Andi',
      nipPegawai: '987650',
      keterangan: 'Gaji bulanan Januari',
      bonusKinerja: 'Bonus target Q1',
      status: 'Pending',
      approver: 'Manajer HRD',
      items: [
        { no: 1, tanggalPenggajian: '01 Januari 2025', gajiPokok: 5_000_000, potonganPPH21: 250_000, potonganBPJS: 200_000, potonganMess: 100_000, uangTunjangan: 500_000, totalGaji: 4_950_000 },
        { no: 2, tanggalPenggajian: '01 Desember 2024', gajiPokok: 4_500_000, potonganPPH21: 225_000, potonganBPJS: 180_000, potonganMess: 100_000, uangTunjangan: 400_000, totalGaji: 4_395_000 },
        { no: 3, tanggalPenggajian: '01 November 2024', gajiPokok: 6_000_000, potonganPPH21: 300_000, potonganBPJS: 240_000, potonganMess: 100_000, uangTunjangan: 600_000, totalGaji: 5_960_000 },
      ],
    },
    {
      id: 'pgj-002',
      noPenggajian: 'PGJ-213',
      periode: '01-01-2025 s.d 01-02-2025',
      noPegawai: 'TKN-224',
      namaPegawai: 'Budi',
      nipPegawai: '987651',
      keterangan: 'Gaji bulanan Januari',
      bonusKinerja: 'Tidak ada',
      status: 'Approved',
      approver: 'Manajer HRD',
      items: [
        { no: 1, tanggalPenggajian: '01 Januari 2025', gajiPokok: 4_000_000, potonganPPH21: 200_000, potonganBPJS: 160_000, potonganMess: 80_000, uangTunjangan: 400_000, totalGaji: 3_960_000 },
      ],
    },
    {
      id: 'pgj-003',
      noPenggajian: 'PGJ-214',
      periode: '01-01-2025 s.d 01-02-2025',
      noPegawai: 'TKN-225',
      namaPegawai: 'Citra',
      nipPegawai: '987652',
      keterangan: 'Gaji bulanan Januari',
      bonusKinerja: 'Bonus lembur',
      status: 'Rejected',
      approver: 'Manajer HRD',
      items: [
        { no: 1, tanggalPenggajian: '01 Januari 2025', gajiPokok: 5_500_000, potonganPPH21: 275_000, potonganBPJS: 220_000, potonganMess: 110_000, uangTunjangan: 550_000, totalGaji: 5_445_000 },
      ],
    },
  ];

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-white';
      case 'Rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handleViewDetails = (penggajian: PenggajianDetailData) => {
    setSelectedPenggajianDetail(penggajian);
    setIsDetailModalOpen(true);
  };

  const handleOpenApprovalActionModal = (penggajianId: string, action: 'approve' | 'reject') => {
    setSelectedPenggajianForAction(penggajianId);
    setApprovalActionType(action);
    setIsApprovalActionModalOpen(true);
  };

  const handleConfirmApprovalAction = (actionData: ApprovalPenggajianActionData) => {
    console.log('Approval Action Confirmed:', actionData);
    // Here you would typically send this data to your backend
    // For now, we'll just log it.
    alert(`Penggajian ${actionData.penggajianId} ${actionData.action}d with comment: "${actionData.keterangan}"`);
    // You might want to update the local 'data' state here to reflect the change
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                APPROVAL PENGGAJIAN
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">HRD</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Approval</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Approval Penggajian</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Cari No Penggajian */}
            <div>
              <label htmlFor="noPenggajian" className="block text-sm font-medium text-gray-700 mb-2">
                Cari No Penggajian
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noPenggajian"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchNoPenggajian}
                  onChange={(e) => setSearchNoPenggajian(e.target.value)}
                  placeholder="PGJ-XXX"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 bg-blue-500 rounded-r-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Cari Nama Pegawai */}
            <div>
              <label htmlFor="namaPegawai" className="block text-sm font-medium text-gray-700 mb-2">
                Cari Nama Pegawai
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="namaPegawai"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchNamaPegawai}
                  onChange={(e) => setSearchNamaPegawai(e.target.value)}
                  placeholder="Nama Pegawai"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 bg-blue-500 rounded-r-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Placeholder for another filter if needed, or leave empty */}
            <div></div>
          </div>

          {/* Periode and Search Button */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-4 mb-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Periode
                </label>
                <div className="relative">
                  <input
                    type="text" // Changed to text for custom date format display
                    id="startDate"
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">s.d</span>
                <div className="relative flex-1">
                  <input
                    type="text" // Changed to text for custom date format display
                    id="endDate"
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm w-full md:w-auto">
              Search
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-3 justify-end mb-6">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm">
              <FileDown className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors text-sm">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1"
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    No <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    No Penggajian <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Periode <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    No Pegawai <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Nama Pegawai <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    NIP Pegawai <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Status Approval <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Approver <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Keterangan <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.noPenggajian.split('-')[1]} {/* Extracting number from PGJ-XXX */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.noPenggajian}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.periode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.noPegawai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.namaPegawai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.nipPegawai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.approver}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.keterangan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(row)}
                          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {row.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleOpenApprovalActionModal(row.id, 'approve')}
                              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleOpenApprovalActionModal(row.id, 'reject')}
                              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 flex justify-between items-center text-sm text-gray-600">
              <span>Showing 1 to {data.length} of {data.length} entries</span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 border border-blue-500 bg-blue-500 text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Penggajian Modal */}
      <DetailPenggajianModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        penggajianData={selectedPenggajianDetail}
      />

      {/* Approval Penggajian Action Modal */}
      <ApprovalPenggajianActionModal
        isOpen={isApprovalActionModalOpen}
        onClose={() => setIsApprovalActionModalOpen(false)}
        onConfirm={handleConfirmApprovalAction}
        penggajianId={selectedPenggajianForAction}
        actionType={approvalActionType}
      />
    </div>
  );
};

export default ApprovalPenggajianDashboard;
