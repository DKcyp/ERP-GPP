import React, { useState, useMemo } from 'react';
import { Search, Check, X, Clock, FileSpreadsheet, FileDown, Plus, ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import PendebtanModal from './PendebtanModal';

interface EmployeeDetail {
  id: number;
  namaPegawai: string;
  bank: string;
  rekening: string;
  nominal: number;
  departemen: string;
  keterangan: string;
}

interface PendebtanPeriod {
  id: number;
  periode: string; // format: YYYY-MM
  total: number;
  employees: EmployeeDetail[];
  status: 'Pending' | 'Approved' | 'Rejected';
}

// Master data pegawai dengan bank, rekening, dan gaji default
const masterPegawai = [
  { nama: 'Ahmad Fauzi', bank: 'BCA', rekening: '1234567890', departemen: 'Engineering', gajiDefault: 5000000 },
  { nama: 'Siti Nurhaliza', bank: 'Mandiri', rekening: '9876543210', departemen: 'Finance', gajiDefault: 4500000 },
  { nama: 'Budi Santoso', bank: 'BNI', rekening: '5555666677', departemen: 'Operations', gajiDefault: 4800000 },
  { nama: 'Dewi Anggraini', bank: 'BRI', rekening: '1111222233', departemen: 'Marketing', gajiDefault: 5200000 },
  { nama: 'Rudi Hermawan', bank: 'BCA', rekening: '9999888877', departemen: 'IT', gajiDefault: 6000000 },
  { nama: 'Rina Setiawati', bank: 'Mandiri', rekening: '4444555566', departemen: 'HR', gajiDefault: 4500000 },
  { nama: 'Wahyudi Hidayat', bank: 'BNI', rekening: '7777888899', departemen: 'Engineering', gajiDefault: 5000000 },
  { nama: 'Siti Aminah', bank: 'BRI', rekening: '3333444455', departemen: 'Finance', gajiDefault: 4000000 },
];

const PendebtanDashboard: React.FC = () => {
  const today = new Date();
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PendebtanPeriod | null>(null);
  const [rejectionNote, setRejectionNote] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<PendebtanPeriod | null>(null);

  // Data sample pendebetan per periode
  const [pendebtanData, setPendebtanData] = useState<PendebtanPeriod[]>([
    {
      id: 1,
      periode: '2025-09',
      total: 25500000,
      status: 'Pending',
      employees: [
        {
          id: 1,
          namaPegawai: 'Ahmad Fauzi',
          bank: 'BCA',
          rekening: '1234567890',
          nominal: 5000000,
          departemen: 'Engineering',
          keterangan: 'Gaji September 2025',
        },
        {
          id: 2,
          namaPegawai: 'Siti Nurhaliza',
          bank: 'Mandiri',
          rekening: '9876543210',
          nominal: 4500000,
          departemen: 'Finance',
          keterangan: 'Gaji September 2025',
        },
        {
          id: 3,
          namaPegawai: 'Budi Santoso',
          bank: 'BNI',
          rekening: '5555666677',
          nominal: 4800000,
          departemen: 'Operations',
          keterangan: 'Gaji September 2025',
        },
        {
          id: 4,
          namaPegawai: 'Dewi Anggraini',
          bank: 'BRI',
          rekening: '1111222233',
          nominal: 5200000,
          departemen: 'Marketing',
          keterangan: 'Gaji September 2025',
        },
        {
          id: 5,
          namaPegawai: 'Rudi Hermawan',
          bank: 'BCA',
          rekening: '9999888877',
          nominal: 6000000,
          departemen: 'IT',
          keterangan: 'Gaji September 2025',
        },
      ],
    },
    {
      id: 2,
      periode: '2025-08',
      total: 18300000,
      status: 'Approved',
      employees: [
        {
          id: 6,
          namaPegawai: 'Ahmad Fauzi',
          bank: 'BCA',
          rekening: '1234567890',
          nominal: 4800000,
          departemen: 'Engineering',
          keterangan: 'Gaji Agustus 2025',
        },
        {
          id: 7,
          namaPegawai: 'Rina Setiawati',
          bank: 'Mandiri',
          rekening: '4444555566',
          nominal: 4500000,
          departemen: 'HR',
          keterangan: 'Gaji Agustus 2025',
        },
        {
          id: 8,
          namaPegawai: 'Wahyudi Hidayat',
          bank: 'BNI',
          rekening: '7777888899',
          nominal: 5000000,
          departemen: 'Engineering',
          keterangan: 'Gaji Agustus 2025',
        },
        {
          id: 9,
          namaPegawai: 'Siti Aminah',
          bank: 'BRI',
          rekening: '3333444455',
          nominal: 4000000,
          departemen: 'Finance',
          keterangan: 'Gaji Agustus 2025',
        },
      ],
    },
  ]);

  // Filter data berdasarkan search query
  const filteredData = useMemo(() => {
    return pendebtanData.filter((item) => {
      const periodeStr = new Date(item.periode + '-01').toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      });
      return periodeStr.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [pendebtanData, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      pending: pendebtanData.filter((item) => item.status === 'Pending').length,
      approved: pendebtanData.filter((item) => item.status === 'Approved').length,
      rejected: pendebtanData.filter((item) => item.status === 'Rejected').length,
      totalNominal: pendebtanData.reduce((sum, item) => sum + item.total, 0),
    };
  }, [pendebtanData]);

  const toggleRow = (id: number) => {
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

  const openConfirmation = (period: PendebtanPeriod, action: 'approve' | 'reject') => {
    setSelectedPeriod(period);
    setConfirmAction(action);
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedPeriod && confirmAction) {
      if (confirmAction === 'reject' && !rejectionNote) {
        alert('Catatan penolakan tidak boleh kosong.');
        return;
      }

      setPendebtanData((prev) =>
        prev.map((item) =>
          item.id === selectedPeriod.id
            ? {
                ...item,
                status: confirmAction === 'approve' ? 'Approved' : 'Rejected',
              }
            : item
        )
      );

      const periodeStr = new Date(selectedPeriod.periode + '-01').toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      });
      console.log(
        `${confirmAction === 'approve' ? 'Approved' : 'Rejected'}:`,
        periodeStr
      );
      if (confirmAction === 'reject') {
        console.log('Rejection Note:', rejectionNote);
      }
    }
    closeConfirmation();
  };

  const closeConfirmation = () => {
    setIsConfirmModalOpen(false);
    setSelectedPeriod(null);
    setConfirmAction(null);
    setRejectionNote('');
  };

  const handleAddPendebetan = () => {
    setEditingPeriod(null);
    setIsModalOpen(true);
  };

  const handleEditPeriod = (period: PendebtanPeriod) => {
    setEditingPeriod(period);
    setIsModalOpen(true);
  };

  const handleDeletePeriod = (period: PendebtanPeriod) => {
    if (window.confirm(`Hapus data pendebetan periode ${new Date(period.periode + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}?`)) {
      setPendebtanData((prev) => prev.filter((item) => item.id !== period.id));
    }
  };

  const handleSavePendebetan = (data: { periode: string; employees: EmployeeDetail[] }) => {
    if (editingPeriod) {
      // Edit existing
      setPendebtanData((prev) =>
        prev.map((item) =>
          item.id === editingPeriod.id
            ? {
                ...item,
                periode: data.periode,
                employees: data.employees,
                total: data.employees.reduce((sum, emp) => sum + emp.nominal, 0),
              }
            : item
        )
      );
    } else {
      // Add new
      const newPeriod: PendebtanPeriod = {
        id: Math.max(...pendebtanData.map((p) => p.id), 0) + 1,
        periode: data.periode,
        total: data.employees.reduce((sum, emp) => sum + emp.nominal, 0),
        employees: data.employees,
        status: 'Pending',
      };
      setPendebtanData((prev) => [newPeriod, ...prev]);
    }
    setIsModalOpen(false);
    setEditingPeriod(null);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const exportPDF = () => {
    const fileId = '1ig-u5Og6tAbyyhxzj9ohj4UHxWimGDMn';
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    window.open(downloadUrl, '_blank');
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
                Cari Periode
              </label>
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cari periode (contoh: September 2025)"
                />
                <Search className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleAddPendebetan}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pendebetan
              </button>
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
                    Periode
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
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
                {filteredData.map((period, index) => (
                  <React.Fragment key={period.id}>
                    {/* Main Period Row */}
                    <tr
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => toggleRow(period.id)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          {expandedRows.has(period.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(period.periode + '-01').toLocaleDateString('id-ID', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                        {formatCurrency(period.total)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                        {getStatusBadge(period.status)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {period.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => openConfirmation(period, 'approve')}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors duration-200"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openConfirmation(period, 'reject')}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEditPeriod(period)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePeriod(period)}
                                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200"
                                title="Hapus"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500 italic">
                              {period.status === 'Approved' ? 'Sudah disetujui' : 'Ditolak'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Employee Details */}
                    {expandedRows.has(period.id) && (
                      <tr>
                        <td colSpan={5} className="px-4 py-0 bg-gray-50">
                          <div className="py-4">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-blue-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                                    Nama Pegawai
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                                    Bank
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                                    Rekening
                                  </th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">
                                    Nominal
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                                    Departemen
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                                    Keterangan
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-100">
                                {period.employees.map((emp) => (
                                  <tr key={emp.id} className="hover:bg-blue-50/30">
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                      {emp.namaPegawai}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                      {emp.bank}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                      {emp.rekening}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                                      {formatCurrency(emp.nominal)}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                      {emp.departemen}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                      {emp.keterangan}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              {/* Total Row */}
              <tfoot>
                <tr className="bg-gradient-to-r from-blue-50 to-gray-50 border-t-2 border-blue-200">
                  <td
                    colSpan={2}
                    className="px-4 py-3 text-sm font-bold text-gray-900 text-right"
                  >
                    TOTAL:
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right text-lg">
                    {formatCurrency(
                      filteredData.reduce((sum, item) => sum + item.total, 0)
                    )}
                  </td>
                  <td colSpan={2} className="px-4 py-3"></td>
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
        } pendebetan gaji periode ${
          selectedPeriod
            ? new Date(selectedPeriod.periode + '-01').toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric',
              })
            : ''
        }?`}
        confirmText={confirmAction === 'approve' ? 'Approve' : 'Reject'}
        showNoteInput={confirmAction === 'reject'}
        note={rejectionNote}
        onNoteChange={setRejectionNote}
      />

      {/* Pendebetan Modal */}
      <PendebtanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPeriod(null);
        }}
        onSave={handleSavePendebetan}
        initialPeriode={editingPeriod?.periode}
        initialEmployees={editingPeriod?.employees}
        masterPegawai={masterPegawai}
      />
    </div>
  );
};

export default PendebtanDashboard;
export type { EmployeeDetail, PendebtanPeriod };
