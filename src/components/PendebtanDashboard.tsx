import React, { useState, useMemo } from 'react';
import { Search, Check, X, Clock, FileSpreadsheet, FileDown } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface PendebtanRow {
  id: number;
  nama: string;
  bank: string;
  rekening: string;
  nominal: number;
  departemen: string;
  keterangan: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const PendebtanDashboard: React.FC = () => {
  const today = new Date();
  const [selectedPeriode, setSelectedPeriode] = useState('2025-09');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<PendebtanRow | null>(null);
  const [rejectionNote, setRejectionNote] = useState<string>('');

  // Data sample pendebetan
  const [pendebtanData, setPendebtanData] = useState<PendebtanRow[]>([
    {
      id: 1,
      nama: 'Ahmad Fauzi',
      bank: 'BCA',
      rekening: '1234567890',
      nominal: 5000000,
      departemen: 'Engineering',
      keterangan: 'Gaji September 2025',
      status: 'Pending',
    },
    {
      id: 2,
      nama: 'Siti Nurhaliza',
      bank: 'Mandiri',
      rekening: '9876543210',
      nominal: 4500000,
      departemen: 'Finance',
      keterangan: 'Gaji September 2025',
      status: 'Pending',
    },
    {
      id: 3,
      nama: 'Budi Santoso',
      bank: 'BNI',
      rekening: '5555666677',
      nominal: 4800000,
      departemen: 'Operations',
      keterangan: 'Gaji September 2025',
      status: 'Approved',
    },
    {
      id: 4,
      nama: 'Dewi Anggraini',
      bank: 'BRI',
      rekening: '1111222233',
      nominal: 5200000,
      departemen: 'Marketing',
      keterangan: 'Gaji September 2025',
      status: 'Pending',
    },
    {
      id: 5,
      nama: 'Rudi Hermawan',
      bank: 'BCA',
      rekening: '9999888877',
      nominal: 6000000,
      departemen: 'IT',
      keterangan: 'Gaji September 2025',
      status: 'Pending',
    },
  ]);

  // Filter data berdasarkan search query
  const filteredData = useMemo(() => {
    return pendebtanData.filter(
      (item) =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.departemen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rekening.includes(searchQuery)
    );
  }, [pendebtanData, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      pending: pendebtanData.filter((item) => item.status === 'Pending').length,
      approved: pendebtanData.filter((item) => item.status === 'Approved').length,
      rejected: pendebtanData.filter((item) => item.status === 'Rejected').length,
      totalNominal: pendebtanData.reduce((sum, item) => sum + item.nominal, 0),
    };
  }, [pendebtanData]);

  const openConfirmation = (entry: PendebtanRow, action: 'approve' | 'reject') => {
    setSelectedEntry(entry);
    setConfirmAction(action);
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedEntry && confirmAction) {
      if (confirmAction === 'reject' && !rejectionNote) {
        alert('Catatan penolakan tidak boleh kosong.');
        return;
      }

      setPendebtanData((prev) =>
        prev.map((item) =>
          item.id === selectedEntry.id
            ? {
                ...item,
                status: confirmAction === 'approve' ? 'Approved' : 'Rejected',
              }
            : item
        )
      );

      console.log(
        `${confirmAction === 'approve' ? 'Approved' : 'Rejected'}:`,
        selectedEntry.nama
      );
      if (confirmAction === 'reject') {
        console.log('Rejection Note:', rejectionNote);
      }
    }
    closeConfirmation();
  };

  const closeConfirmation = () => {
    setIsConfirmModalOpen(false);
    setSelectedEntry(null);
    setConfirmAction(null);
    setRejectionNote('');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
    }
  };

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-wide mb-2">
                Pendebetan Gaji
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  HRD
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Gaji
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Pendebetan</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Nominal</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(stats.totalNominal)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Periode
              </label>
              <input
                type="month"
                value={selectedPeriode}
                onChange={(e) => setSelectedPeriode(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari
              </label>
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama/Departemen/Bank/Rekening"
                />
                <Search className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="flex items-end justify-end gap-2">
              <button
                onClick={exportExcel}
                className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </button>
              <button
                onClick={exportPDF}
                className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Bank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rekening
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nominal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Departemen
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Keterangan
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((row, index) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.nama}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {row.bank}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {row.rekening}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {formatCurrency(row.nominal)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {row.departemen}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {row.keterangan}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                      {row.status === 'Pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openConfirmation(row, 'approve')}
                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors duration-200"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openConfirmation(row, 'reject')}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 italic">
                          {row.status === 'Approved' ? 'Sudah disetujui' : 'Ditolak'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Total Row */}
              <tfoot>
                <tr className="bg-gradient-to-r from-blue-50 to-gray-50 border-t-2 border-blue-200">
                  <td
                    colSpan={4}
                    className="px-4 py-3 text-sm font-bold text-gray-900 text-right"
                  >
                    TOTAL:
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right text-lg">
                    {formatCurrency(
                      filteredData.reduce((sum, item) => sum + item.nominal, 0)
                    )}
                  </td>
                  <td colSpan={4} className="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirm}
        title={
          confirmAction === 'approve'
            ? 'Konfirmasi Approval'
            : 'Konfirmasi Penolakan'
        }
        message={`Apakah Anda yakin ingin ${
          confirmAction === 'approve' ? 'menyetujui' : 'menolak'
        } pendebetan gaji untuk ${selectedEntry?.nama}?`}
        confirmText={confirmAction === 'approve' ? 'Approve' : 'Reject'}
        showNoteInput={confirmAction === 'reject'}
        note={rejectionNote}
        onNoteChange={setRejectionNote}
      />
    </div>
  );
};

export default PendebtanDashboard;
