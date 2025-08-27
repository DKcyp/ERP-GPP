import React, { useState } from 'react';
import { Clock, Search, Calendar, FileText, FileSpreadsheet, FileDown, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import DetailInvoiceModal from './DetailInvoiceModal';
import ApprovalActionModal from './ApprovalActionModal';
import { InvoiceDetailData, ApprovalActionData } from '../types';

const ApprovalInvoiceDashboard: React.FC = () => {
  const [searchKodeBarang, setSearchKodeBarang] = useState('BRG001');
  const [searchNamaBarang, setSearchNamaBarang] = useState('Excavator');
  const [sumberBarang, setSumberBarang] = useState('Timesheet');
  const [startDate, setStartDate] = useState('03/03/2025');
  const [endDate, setEndDate] = useState('03/03/2025');
  const [showEntries, setShowEntries] = useState(10);

  // State for Detail Invoice Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<InvoiceDetailData | null>(null);

  // State for Approval Action Modal
  const [isApprovalActionModalOpen, setIsApprovalActionModalOpen] = useState(false);
  const [selectedInvoiceForAction, setSelectedInvoiceForAction] = useState<string | null>(null);
  const [approvalActionType, setApprovalActionType] = useState<'approve' | 'reject' | null>(null);

  const data = [
    {
      id: 'inv-01',
      no: 1,
      noSO: 'SOO10',
      soTurunan: 'SOO10.1',
      namaProject: 'Maintenance Machine Learning',
      noInvoice: 'INV-01',
      tanggalInvoice: '22-01-2025',
      jumlah: 5_000_000,
      status: 'Approved',
      approver: 'Manajer Marketing',
      keterangan: 'Disetujui',
      items: [
        { no: 1, kodeBarang: 'EQP001', namaBarang: 'Excavator', jumlah: 3, satuan: 'Unit', harga: 120_000_000 },
        { no: 2, kodeBarang: 'EQP002', namaBarang: 'Crane 50 Ton', jumlah: 3, satuan: 'Unit', harga: 20_000_000 },
      ],
    },
    {
      id: 'inv-111',
      no: 2,
      noSO: 'SOO11',
      soTurunan: 'SOO11.9',
      namaProject: 'Pengecekan Machine Learning',
      noInvoice: 'INV-111',
      tanggalInvoice: '15-01-2025',
      jumlah: 10_000_000,
      status: 'Rejected',
      approver: 'Manajer Marketing',
      keterangan: 'Data Tidak Lengkap',
      items: [
        { no: 1, kodeBarang: 'SRV001', namaBarang: 'Jasa Konsultasi', jumlah: 1, satuan: 'Paket', harga: 5_000_000 },
      ],
    },
    {
      id: 'inv-99',
      no: 3,
      noSO: 'SO121',
      soTurunan: 'SO121.21',
      namaProject: 'Pengelasan',
      noInvoice: 'INV-99',
      tanggalInvoice: '10-01-2025',
      jumlah: 5_000_000,
      status: 'Pending',
      approver: 'Manajer Marketing',
      keterangan: 'Menunggu Persetujuan',
      items: [
        { no: 1, kodeBarang: 'MAT001', namaBarang: 'Besi Baja', jumlah: 100, satuan: 'Kg', harga: 15_000 },
        { no: 2, kodeBarang: 'MAT002', namaBarang: 'Kawat Las', jumlah: 50, satuan: 'Meter', harga: 5_000 },
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

  const handleViewDetails = (invoice: typeof data[0]) => {
    setSelectedInvoiceDetail({
      id: invoice.id,
      noSO: invoice.noSO,
      namaProject: invoice.namaProject,
      hppSO: invoice.soTurunan, // Mapping soTurunan to hppSO for the modal
      noInvoice: invoice.noInvoice,
      tanggalInvoice: invoice.tanggalInvoice,
      jumlah: invoice.jumlah,
      status: invoice.status,
      approver: invoice.approver,
      keterangan: invoice.keterangan,
      items: invoice.items,
    });
    setIsDetailModalOpen(true);
  };

  const handleOpenApprovalActionModal = (invoiceId: string, action: 'approve' | 'reject') => {
    setSelectedInvoiceForAction(invoiceId);
    setApprovalActionType(action);
    setIsApprovalActionModalOpen(true);
  };

  const handleConfirmApprovalAction = (actionData: ApprovalActionData) => {
    console.log('Approval Action Confirmed:', actionData);
    // Here you would typically send this data to your backend
    // For now, we'll just log it.
    alert(`Invoice ${actionData.invoiceId} ${actionData.action}d with comment: "${actionData.keterangan}"`);
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
                APPROVAL INVOICE
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Approval</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Approval Invoice</span>
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
            {/* Cari Kode Barang */}
            <div>
              <label htmlFor="kodeBarang" className="block text-sm font-medium text-gray-700 mb-2">
                Cari Kode Barang
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="kodeBarang"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchKodeBarang}
                  onChange={(e) => setSearchKodeBarang(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 bg-blue-500 rounded-r-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Cari Nama Barang */}
            <div>
              <label htmlFor="namaBarang" className="block text-sm font-medium text-gray-700 mb-2">
                Cari Nama Barang
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="namaBarang"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchNamaBarang}
                  onChange={(e) => setSearchNamaBarang(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 bg-blue-500 rounded-r-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Pilih Sumber Barang */}
            <div>
              <label htmlFor="sumberBarang" className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Sumber Barang
              </label>
              <select
                id="sumberBarang"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={sumberBarang}
                onChange={(e) => setSumberBarang(e.target.value)}
              >
                <option>Timesheet</option>
                <option>Invoice</option>
                <option>PO Training</option>
              </select>
            </div>
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
                    No SO <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    SO Turunan <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Nama Project <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    No Invoice <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Tanggal Invoice <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Jumlah <span className="ml-1">↑↓</span>
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
                  <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.noSO}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.soTurunan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.namaProject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.noInvoice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.tanggalInvoice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(row.jumlah)}
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

      {/* Detail Invoice Modal */}
      <DetailInvoiceModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        invoiceData={selectedInvoiceDetail}
      />

      {/* Approval Action Modal */}
      <ApprovalActionModal
        isOpen={isApprovalActionModalOpen}
        onClose={() => setIsApprovalActionModalOpen(false)}
        onConfirm={handleConfirmApprovalAction}
        invoiceId={selectedInvoiceForAction}
        actionType={approvalActionType}
      />
    </div>
  );
};

export default ApprovalInvoiceDashboard;
