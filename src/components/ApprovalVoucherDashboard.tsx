import React, { useState } from 'react';
import { Clock, Search, Calendar, FileText, FileSpreadsheet, FileDown, Eye, ThumbsUp, ThumbsDown, CreditCard, Building2 } from 'lucide-react';
import DetailApprovalVoucherModal from './DetailApprovalVoucherModal';
import { ApprovalVoucherDetailData } from '../types';

const ApprovalVoucherDashboard: React.FC = () => {
  const [searchNoVoucher, setSearchNoVoucher] = useState('VCH001');
  const [searchNoSO, setSearchNoSO] = useState('SO011');
  const [startDate, setStartDate] = useState('01/01/2025');
  const [endDate, setEndDate] = useState('01/01/2025');
  const [showEntries, setShowEntries] = useState(10);

  // State for Detail Approval Voucher Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVoucherDetail, setSelectedVoucherDetail] = useState<ApprovalVoucherDetailData | null>(null);

  // State for Payment Method Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedVoucherForPayment, setSelectedVoucherForPayment] = useState<ApprovalVoucherDetailData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'kas' | 'bank'>('kas');
  const [selectedKasBank, setSelectedKasBank] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  // Kas/Bank Options Data
  const kasOptions = [
    { id: 'kas-001', name: 'Kas Kecil Operasional', location: 'Kantor Pusat - Lantai 2', balance: 5000000 },
    { id: 'kas-002', name: 'Kas Proyek Site A', location: 'Site A - Container Office', balance: 3000000 },
    { id: 'kas-003', name: 'Kas Proyek Site B', location: 'Site B - Field Office', balance: 2500000 },
  ];

  const bankOptions = [
    { id: 'bank-001', name: 'Bank Mandiri Operasional', account: '1400098765432', branch: 'KCP Mandiri Operasional', balance: 150000000 },
    { id: 'bank-002', name: 'Bank BCA Operasional', account: '5430012345678', branch: 'KCP BCA Sudirman', balance: 85000000 },
    { id: 'bank-003', name: 'Bank BNI Payroll', account: '0987654321098', branch: 'KCP BNI Gatot Subroto', balance: 45000000 },
  ];

  const data: ApprovalVoucherDetailData[] = [
    {
      id: 'vch-001',
      noVoucher: 'VCH001',
      tanggalPengajuan: '01-01-2025',
      noSO: 'SO0101',
      jumlahNominal: 55_000_000,
      dataPegawai: [
        { no: 1, kodePegawai: 'K-0120', namaPegawai: 'Bagas', departemen: 'Finance', nip: '123456' },
        { no: 2, kodePegawai: 'K-0121', namaPegawai: 'Ani', departemen: 'HRD', nip: '123457' },
        { no: 3, kodePegawai: 'K-0122', namaPegawai: 'Rudi', departemen: 'IT', nip: '123458' },
        { no: 4, kodePegawai: 'K-0123', namaPegawai: 'Siti', departemen: 'Marketing', nip: '123459' },
        { no: 5, kodePegawai: 'K-0124', namaPegawai: 'Budi', departemen: 'Operasional', nip: '123460' },
      ],
      keterangan: 'Voucher untuk perjalanan dinas proyek Jakarta-Surabaya.',
      pemesananTiketPesawat: {
        keberangkatan: {
          tanggal: '30-12-2024',
          tujuan: 'Jakarta',
          jam: '08:00',
          maskapai: 'Garuda Indonesia',
          harga: 1_500_000,
          jenisTiket: 'Ekonomi',
        },
        kepulangan: {
          tanggal: '05-01-2025',
          tujuan: 'Surabaya',
          jam: '10:00',
          maskapai: 'Lion Air',
          hargaTotal: 3_000_000,
          jenisTiket: 'Bisnis',
        },
        ditagihkanKe: 'Client',
        note: 'Harap memastikan tiket sesuai jadwal.',
      },
      status: 'Pending',
    },
    {
      id: 'vch-002',
      noVoucher: 'VCH002',
      tanggalPengajuan: '05-01-2025',
      noSO: 'SO0102',
      jumlahNominal: 12_000_000,
      dataPegawai: [
        { no: 1, kodePegawai: 'K-0125', namaPegawai: 'Dewi', departemen: 'Finance', nip: '123461' },
      ],
      keterangan: 'Voucher untuk akomodasi hotel di Bandung.',
      pemesananHotel: {
        namaHotel: 'Hotel Bintang',
        checkIn: '10-01-2025',
        checkOut: '12-01-2025',
        jumlahMalam: 2,
        hargaPerMalam: 1_000_000,
        totalHarga: 2_000_000,
        ditagihkanKe: 'Perusahaan',
        note: 'Termasuk sarapan.',
      },
      status: 'Approved',
    },
    {
      id: 'vch-003',
      noVoucher: 'VCH003',
      tanggalPengajuan: '10-01-2025',
      noSO: 'SO0103',
      jumlahNominal: 7_500_000,
      dataPegawai: [
        { no: 1, kodePegawai: 'K-0126', namaPegawai: 'Fajar', departemen: 'Marketing', nip: '123462' },
      ],
      keterangan: 'Voucher untuk biaya transportasi lokal.',
      biayaTravel: {
        jenisBiaya: 'Transportasi Lokal',
        deskripsi: 'Biaya taksi dan tol selama kunjungan klien.',
        jumlah: 3,
        satuan: 'Hari',
        totalHarga: 1_500_000,
        ditagihkanKe: 'Client',
        note: 'Lampirkan struk.',
      },
      status: 'Rejected',
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

  const handleViewDetails = (voucher: ApprovalVoucherDetailData) => {
    setSelectedVoucherDetail(voucher);
    setIsDetailModalOpen(true);
  };

  // Payment Method Handlers
  const handlePaymentMethod = (voucher: ApprovalVoucherDetailData) => {
    setSelectedVoucherForPayment(voucher);
    setPaymentMethod('kas');
    setSelectedKasBank('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedVoucherForPayment(null);
    setSelectedKasBank('');
  };

  const handleConfirmPayment = () => {
    if (!selectedKasBank || !paymentDate) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const selectedOption = paymentMethod === 'kas' 
      ? kasOptions.find(k => k.id === selectedKasBank)
      : bankOptions.find(b => b.id === selectedKasBank);

    if (selectedVoucherForPayment && selectedOption) {
      // Here you would normally update the voucher status and create payment record
      alert(`Pembayaran berhasil!\n\nVoucher: ${selectedVoucherForPayment.noVoucher}\nMetode: ${paymentMethod === 'kas' ? 'Kas' : 'Bank'}\nDetail: ${selectedOption.name}\nTanggal Bayar: ${new Date(paymentDate).toLocaleDateString('id-ID')}\nJumlah: ${formatCurrency(selectedVoucherForPayment.jumlahNominal)}`);
      handleClosePaymentModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                APPROVAL VOUCHER
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Approval</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Approval Voucher</span>
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
            {/* Cari No Voucher */}
            <div>
              <label htmlFor="noVoucher" className="block text-sm font-medium text-gray-700 mb-2">
                Cari No Voucher
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noVoucher"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchNoVoucher}
                  onChange={(e) => setSearchNoVoucher(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 bg-blue-500 rounded-r-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Cari No SO */}
            <div>
              <label htmlFor="noSO" className="block text-sm font-medium text-gray-700 mb-2">
                Cari No SO
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noSO"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchNoSO}
                  onChange={(e) => setSearchNoSO(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 bg-blue-500 rounded-r-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Placeholder for other filter if needed */}
            <div></div> {/* To maintain grid layout */}
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
                    No Voucher <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Tanggal Pengajuan <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    No SO <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Jumlah Nominal <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Status Approval <span className="ml-1">↑↓</span>
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
                      {row.no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.noVoucher}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.tanggalPengajuan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.noSO}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(row.jumlahNominal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewDetails(row)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleViewDetails(row)}
                          className="text-green-600 hover:text-green-900 transition-colors duration-200"
                          title="Approve"
                        >
                          <ThumbsUp className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleViewDetails(row)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          title="Reject"
                        >
                          <ThumbsDown className="h-5 w-5" />
                        </button>
                        {row.status === 'Approved' && (
                          <button
                            onClick={() => handlePaymentMethod(row)}
                            className="text-purple-600 hover:text-purple-900 transition-colors duration-200"
                            title="Metode Kas/Bank"
                          >
                            <CreditCard className="h-5 w-5" />
                          </button>
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

      {/* Detail Approval Voucher Modal */}
      <DetailApprovalVoucherModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        voucherData={selectedVoucherDetail}
      />

      {/* Payment Method Modal */}
      {isPaymentModalOpen && selectedVoucherForPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center">
                    <CreditCard className="w-6 h-6 mr-2" />
                    Metode Kas/Bank
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Voucher: {selectedVoucherForPayment.noVoucher} - {formatCurrency(selectedVoucherForPayment.jumlahNominal)}
                  </p>
                </div>
                <button
                  onClick={handleClosePaymentModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pilih Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setPaymentMethod('kas');
                      setSelectedKasBank('');
                    }}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      paymentMethod === 'kas'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-300 text-gray-700'
                    }`}
                  >
                    <Building2 className="w-6 h-6 mr-2" />
                    <span className="font-medium">Kas</span>
                  </button>
                  <button
                    onClick={() => {
                      setPaymentMethod('bank');
                      setSelectedKasBank('');
                    }}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      paymentMethod === 'bank'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-300 text-gray-700'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mr-2" />
                    <span className="font-medium">Bank</span>
                  </button>
                </div>
              </div>

              {/* Kas/Bank Detail Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pilih Detail {paymentMethod === 'kas' ? 'Kas' : 'Bank'}
                </label>
                <select
                  value={selectedKasBank}
                  onChange={(e) => setSelectedKasBank(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">-- Pilih {paymentMethod === 'kas' ? 'Kas' : 'Bank'} --</option>
                  {(paymentMethod === 'kas' ? kasOptions : bankOptions).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} - {'account' in option ? option.account : option.location} 
                      (Saldo: {formatCurrency(option.balance)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tanggal Bayar
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Selected Details Preview */}
              {selectedKasBank && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Detail Pembayaran:</h4>
                  {(() => {
                    const selectedOption = paymentMethod === 'kas' 
                      ? kasOptions.find(k => k.id === selectedKasBank)
                      : bankOptions.find(b => b.id === selectedKasBank);
                    
                    return selectedOption ? (
                      <div className="text-sm text-gray-600">
                        <p><strong>Nama:</strong> {selectedOption.name}</p>
                        <p><strong>{'account' in selectedOption ? 'No. Rekening' : 'Lokasi'}:</strong> {'account' in selectedOption ? selectedOption.account : selectedOption.location}</p>
                        {'branch' in selectedOption && <p><strong>Cabang:</strong> {selectedOption.branch}</p>}
                        <p><strong>Saldo Tersedia:</strong> {formatCurrency(selectedOption.balance)}</p>
                        <p><strong>Tanggal Bayar:</strong> {new Date(paymentDate).toLocaleDateString('id-ID')}</p>
                      </div>
                    ) : null;
                  })()} 
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleClosePaymentModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={!selectedKasBank || !paymentDate}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Konfirmasi Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalVoucherDashboard;
