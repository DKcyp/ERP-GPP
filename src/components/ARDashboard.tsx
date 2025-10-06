import React, { useState } from 'react';
import {
  Clock,
  BarChart2,
  Users,
  AlertTriangle,
  Calculator,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

interface TransactionDetail {
  id: number;
  tanggal: string;
  customer: string;
  noInvoice: string;
  deskripsi: string;
  nominal: number;
  status: 'Outstanding' | 'Paid' | 'Overdue';
  jatuhTempo: string;
}

const ARDashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetail[]>([]);

  // KPI dummy data (can be replaced with API data)
  const totalPiutangUsaha = 1850000000; // Rp
  const jumlahCustomerTerutang = 42; // customers
  const totalPiutangJatuhTempo = 480000000; // Rp

  // Aging Report dummy data
  const agingData = [
    { bucket: 'Belum jatuh tempo', nilai: 680_000_000 },
    { bucket: '1 - 30 hari', nilai: 420_000_000 },
    { bucket: '31 - 60 hari', nilai: 280_000_000 },
    { bucket: '61 - 90 hari', nilai: 180_000_000 },
    { bucket: '> 90 hari', nilai: 120_000_000 },
  ];

  // Trend Penerimaan 6 bulan terakhir
  const trendData = [
    { bulan: 'Apr', terima: 180_000_000 },
    { bulan: 'Mei', terima: 145_000_000 },
    { bulan: 'Jun', terima: 210_000_000 },
    { bulan: 'Jul', terima: 165_000_000 },
    { bulan: 'Agu', terima: 225_000_000 },
    { bulan: 'Sep', terima: 195_000_000 },
  ];

  // Sample transaction details for different chart segments
  const getTransactionDetails = (
    chartType: string,
    period?: string
  ): TransactionDetail[] => {
    const baseTransactions: TransactionDetail[] = [
      {
        id: 1,
        tanggal: '2024-07-01',
        customer: 'PT Global Manufacturing',
        noInvoice: 'INV-2024-001',
        deskripsi: 'Penjualan Produk Steel Grade A',
        nominal: 20000000,
        status: 'Outstanding',
        jatuhTempo: '2024-07-31',
      },
      {
        id: 2,
        tanggal: '2024-07-02',
        customer: 'CV Maju Konstruksi',
        noInvoice: 'INV-2024-002',
        deskripsi: 'Jasa Instalasi Sistem IT',
        nominal: 8000000,
        status: 'Paid',
        jatuhTempo: '2024-08-01',
      },
      {
        id: 3,
        tanggal: '2024-07-03',
        customer: 'UD Sejahtera Equipment',
        noInvoice: 'INV-2024-003',
        deskripsi: 'Sewa Alat Berat Konstruksi',
        nominal: 5000000,
        status: 'Outstanding',
        jatuhTempo: '2024-07-20',
      },
      {
        id: 4,
        tanggal: '2024-07-04',
        customer: 'PT Abadi Logistics',
        noInvoice: 'INV-2024-004',
        deskripsi: 'Langganan Layanan Transportasi',
        nominal: 10000000,
        status: 'Paid',
        jatuhTempo: '2024-07-15',
      },
      {
        id: 5,
        tanggal: '2024-07-05',
        customer: 'PT Sentosa Office',
        noInvoice: 'INV-2024-005',
        deskripsi: 'Penjualan Produk Office Supplies',
        nominal: 1800000,
        status: 'Overdue',
        jatuhTempo: '2024-08-05',
      },
      {
        id: 6,
        tanggal: '2024-07-06',
        customer: 'CV Cepat Teknik',
        noInvoice: 'INV-2024-006',
        deskripsi: 'Perbaikan Sistem Produksi',
        nominal: 6000000,
        status: 'Paid',
        jatuhTempo: '2024-07-25',
      },
      {
        id: 7,
        tanggal: '2024-07-07',
        customer: 'PT Indah Development',
        noInvoice: 'INV-2024-007',
        deskripsi: 'Proyek Pengembangan Software',
        nominal: 70000000,
        status: 'Outstanding',
        jatuhTempo: '2024-07-10',
      },
      {
        id: 8,
        tanggal: '2024-07-08',
        customer: 'UD Makmur Konsultan',
        noInvoice: 'INV-2024-008',
        deskripsi: 'Biaya Konsultasi Manajemen',
        nominal: 1200000,
        status: 'Paid',
        jatuhTempo: '2024-08-08',
      },
    ];

    // Filter based on chart type and period
    if (chartType === 'trend' && period) {
      // For trend chart - filter by month
      return baseTransactions.filter((t) => t.tanggal.includes('2024-07'));
    } else if (chartType === 'aging') {
      // For aging chart - filter by aging bucket
      return baseTransactions;
    }
    return baseTransactions;
  };

  const dummyTableData = [
    {
      id: 1,
      tglInvoice: '2024-07-01',
      noInvoice: 'INV-2024-001',
      namaCustomer: 'PT Global Manufacturing',
      keterangan: 'Penjualan Produk Steel Grade A',
      nominal: 20000000,
      tglJatuhTempo: '2024-07-31',
      status: 'Outstanding',
    },
    {
      id: 2,
      tglInvoice: '2024-07-02',
      noInvoice: 'INV-2024-002',
      namaCustomer: 'CV Maju Konstruksi',
      keterangan: 'Jasa Instalasi Sistem IT',
      nominal: 8000000,
      tglJatuhTempo: '2024-08-01',
      status: 'Paid',
    },
    {
      id: 3,
      tglInvoice: '2024-07-03',
      noInvoice: 'INV-2024-003',
      namaCustomer: 'UD Sejahtera Equipment',
      keterangan: 'Sewa Alat Berat Konstruksi',
      nominal: 5000000,
      tglJatuhTempo: '2024-07-20',
      status: 'Outstanding',
    },
    {
      id: 4,
      tglInvoice: '2024-07-04',
      noInvoice: 'INV-2024-004',
      namaCustomer: 'PT Abadi Logistics',
      keterangan: 'Langganan Layanan Transportasi',
      nominal: 10000000,
      tglJatuhTempo: '2024-07-15',
      status: 'Paid',
    },
    {
      id: 5,
      tglInvoice: '2024-07-05',
      noInvoice: 'INV-2024-005',
      namaCustomer: 'PT Sentosa Office',
      keterangan: 'Penjualan Produk Office Supplies',
      nominal: 1800000,
      tglJatuhTempo: '2024-08-05',
      status: 'Overdue',
    },
    {
      id: 6,
      tglInvoice: '2024-07-06',
      noInvoice: 'INV-2024-006',
      namaCustomer: 'CV Cepat Teknik',
      keterangan: 'Perbaikan Sistem Produksi',
      nominal: 6000000,
      tglJatuhTempo: '2024-07-25',
      status: 'Paid',
    },
    {
      id: 7,
      tglInvoice: '2024-07-07',
      noInvoice: 'INV-2024-007',
      namaCustomer: 'PT Indah Development',
      keterangan: 'Proyek Pengembangan Software',
      nominal: 70000000,
      tglJatuhTempo: '2024-07-10',
      status: 'Outstanding',
    },
    {
      id: 8,
      tglInvoice: '2024-07-08',
      noInvoice: 'INV-2024-008',
      namaCustomer: 'UD Makmur Konsultan',
      keterangan: 'Biaya Konsultasi Manajemen',
      nominal: 1200000,
      tglJatuhTempo: '2024-08-08',
      status: 'Paid',
    },
    {
      id: 9,
      tglInvoice: '2024-07-09',
      noInvoice: 'INV-2024-009',
      namaCustomer: 'PT Jaya Services',
      keterangan: 'Pajak Penjualan Bulanan',
      nominal: 7000000,
      tglJatuhTempo: '2024-07-30',
      status: 'Outstanding',
    },
    {
      id: 10,
      tglInvoice: '2024-07-10',
      noInvoice: 'INV-2024-010',
      namaCustomer: 'CV Harmoni Training',
      keterangan: 'Pelatihan Karyawan & Sertifikasi',
      nominal: 3000000,
      tglJatuhTempo: '2024-08-10',
      status: 'Paid',
    },
  ];

  // Handle chart click events
  const handleChartClick = (data: any, chartType: 'aging' | 'trend') => {
    if (data && data.activePayload && data.activePayload[0]) {
      const payload = data.activePayload[0].payload;
      setSelectedData(payload);

      if (chartType === 'aging') {
        setModalTitle(`Detail Transaksi - ${payload.bucket}`);
        setTransactionDetails(getTransactionDetails('aging', payload.bucket));
      } else {
        setModalTitle(`Detail Transaksi - ${payload.bulan} 2024`);
        setTransactionDetails(getTransactionDetails('trend', payload.bulan));
      }

      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedData(null);
    setTransactionDetails([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                AR DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">AR</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Dashboard</span>
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
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Piutang Usaha (terupdate)
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  Rp {totalPiutangUsaha.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Jumlah Customer Terutang
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {jumlahCustomerTerutang}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Piutang Usaha Jatuh Tempo
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  Rp {totalPiutangJatuhTempo.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Aging Report Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Aging Report (Umur Piutang)
              </h3>
              <BarChart2 className="h-5 w-5 text-gray-500" />
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agingData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  onClick={(data) => handleChartClick(data, 'aging')}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `Rp ${v / 1_000_000}jt`} />
                  <Tooltip
                    formatter={(value: number) => [
                      `Rp ${value.toLocaleString('id-ID')}`,
                      'Nilai',
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="nilai"
                    name="Nilai"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-gray-600 mt-3">
              Bucket: Belum jatuh tempo, 1 - 30 hari, 31 - 60 hari, 61 - 90
              hari, &gt; 90 hari
            </div>
          </div>

          {/* Trend Penerimaan Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Trend Penerimaan Piutang Usaha Bulanan
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Menunjukkan nilai penerimaan dari customer selama 6 bulan terakhir.
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  onClick={(data) => handleChartClick(data, 'trend')}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `Rp ${v / 1_000_000}jt`} />
                  <Tooltip
                    formatter={(value: number) => [
                      `Rp ${value.toLocaleString('id-ID')}`,
                      'Penerimaan',
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="terima"
                    name="Penerimaan"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4, cursor: 'pointer' }}
                    activeDot={{ r: 6, cursor: 'pointer' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Receipts Mapping Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Receipts Mapping
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tgl Invoice
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No. Invoice
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Keterangan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nominal
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tgl Jatuh Tempo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyTableData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.tglInvoice).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.noInvoice}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.namaCustomer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.keterangan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                      Rp {item.nominal.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.tglJatuhTempo).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'Outstanding'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{modalTitle}</h3>
                  {selectedData && (
                    <p className="text-blue-100 text-sm mt-1">
                      {'bucket' in selectedData
                        ? `Total Nilai: Rp ${
                            selectedData.nilai?.toLocaleString('id-ID') || '0'
                          }`
                        : `Total Penerimaan: Rp ${
                            selectedData.terima?.toLocaleString('id-ID') || '0'
                          }`}
                    </p>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Summary Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600">Total Transaksi</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {transactionDetails.length}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600">Total Nilai</div>
                  <div className="text-2xl font-bold text-green-900">
                    Rp{' '}
                    {transactionDetails
                      .reduce((sum, t) => sum + t.nominal, 0)
                      .toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-sm text-yellow-600">Outstanding</div>
                  <div className="text-2xl font-bold text-yellow-900">
                    {
                      transactionDetails.filter((t) => t.status === 'Outstanding')
                        .length
                    }
                  </div>
                </div>
              </div>

              {/* Transaction Details Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Detail Transaksi
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No. Invoice
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deskripsi
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nominal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jatuh Tempo
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactionDetails.map((transaction, index) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {new Date(transaction.tanggal).toLocaleDateString(
                              'id-ID'
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {transaction.customer}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.noInvoice}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {transaction.deskripsi}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                            Rp {transaction.nominal.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {new Date(
                              transaction.jatuhTempo
                            ).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction.status === 'Paid'
                                  ? 'bg-green-100 text-green-800'
                                  : transaction.status === 'Outstanding'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARDashboard;
