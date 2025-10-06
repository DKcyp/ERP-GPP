import React, { useState } from "react";
import {
  Clock,
  BarChart2,
  Users,
  AlertTriangle,
  Calculator,
  X,
} from "lucide-react";
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
} from "recharts";

interface TransactionDetail {
  id: number;
  tanggal: string;
  vendor: string;
  noPO: string;
  deskripsi: string;
  nominal: number;
  status: "Pending" | "Approved" | "Paid";
  jatuhTempo: string;
}

const APDashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [transactionDetails, setTransactionDetails] = useState<
    TransactionDetail[]
  >([]);

  // KPI dummy data (can be replaced with API data)
  const totalUtangUsaha = 1250000000; // Rp
  const jumlahVendorTerutang = 58; // vendors
  const totalUtangJatuhTempo = 320000000; // Rp

  // Aging Report dummy data
  const agingData = [
    { bucket: "Belum jatuh tempo", nilai: 480_000_000 },
    { bucket: "1 - 30 hari", nilai: 260_000_000 },
    { bucket: "31 - 60 hari", nilai: 190_000_000 },
    { bucket: "61 - 90 hari", nilai: 110_000_000 },
    { bucket: "> 90 hari", nilai: 70_000_000 },
  ];

  // Trend Pembayaran 6 bulan terakhir
  const trendData = [
    { bulan: "Apr", bayar: 120_000_000 },
    { bulan: "Mei", bayar: 95_000_000 },
    { bulan: "Jun", bayar: 140_000_000 },
    { bulan: "Jul", bayar: 110_000_000 },
    { bulan: "Agu", bayar: 175_000_000 },
    { bulan: "Sep", bayar: 130_000_000 },
  ];

  // Sample transaction details for different chart segments
  const getTransactionDetails = (
    chartType: string,
    period?: string
  ): TransactionDetail[] => {
    const baseTransactions: TransactionDetail[] = [
      {
        id: 1,
        tanggal: "2024-07-01",
        vendor: "PT ABC Manufacturing",
        noPO: "PO-2024-001",
        deskripsi: "Pembelian Bahan Baku Steel",
        nominal: 15000000,
        status: "Pending",
        jatuhTempo: "2024-07-31",
      },
      {
        id: 2,
        tanggal: "2024-07-02",
        vendor: "CV Jaya Konsultan",
        noPO: "PO-2024-002",
        deskripsi: "Jasa Konsultan IT",
        nominal: 7500000,
        status: "Approved",
        jatuhTempo: "2024-08-01",
      },
      {
        id: 3,
        tanggal: "2024-07-03",
        vendor: "UD Makmur Equipment",
        noPO: "PO-2024-003",
        deskripsi: "Sewa Peralatan Konstruksi",
        nominal: 3000000,
        status: "Pending",
        jatuhTempo: "2024-07-20",
      },
      {
        id: 4,
        tanggal: "2024-07-04",
        vendor: "PT XYZ Logistics",
        noPO: "PO-2024-004",
        deskripsi: "Biaya Operasional Gudang",
        nominal: 10000000,
        status: "Paid",
        jatuhTempo: "2024-07-15",
      },
      {
        id: 5,
        tanggal: "2024-07-05",
        vendor: "PT Sejahtera Office",
        noPO: "PO-2024-005",
        deskripsi: "Pembelian ATK Kantor",
        nominal: 1200000,
        status: "Approved",
        jatuhTempo: "2024-08-05",
      },
      {
        id: 6,
        tanggal: "2024-07-06",
        vendor: "CV Bersama Teknik",
        noPO: "PO-2024-006",
        deskripsi: "Perbaikan Mesin Produksi",
        nominal: 4500000,
        status: "Pending",
        jatuhTempo: "2024-07-25",
      },
      {
        id: 7,
        tanggal: "2024-07-07",
        vendor: "PT Indah Payroll",
        noPO: "PO-2024-007",
        deskripsi: "Gaji Karyawan Bulan Juli",
        nominal: 50000000,
        status: "Paid",
        jatuhTempo: "2024-07-10",
      },
      {
        id: 8,
        tanggal: "2024-07-08",
        vendor: "UD Sentosa Transport",
        noPO: "PO-2024-008",
        deskripsi: "Biaya Transportasi Karyawan",
        nominal: 800000,
        status: "Approved",
        jatuhTempo: "2024-08-08",
      },
    ];

    // Filter based on chart type and period
    if (chartType === "trend" && period) {
      // For trend chart - filter by month
      return baseTransactions.filter((t) => t.tanggal.includes("2024-07"));
    } else if (chartType === "aging") {
      // For aging chart - filter by aging bucket
      return baseTransactions;
    }
    return baseTransactions;
  };

  const dummyTableData = [
    {
      id: 1,
      tglPO: "2024-07-01",
      noPO: "PO-2024-001",
      namaVendor: "PT ABC Manufacturing",
      keterangan: "Pembelian Bahan Baku Steel",
      nominal: 15000000,
      tglSchedulePembayaran: "2024-07-31",
      status: "Pending",
    },
    {
      id: 2,
      tglPO: "2024-07-02",
      noPO: "PO-2024-002",
      namaVendor: "CV Jaya Konsultan",
      keterangan: "Jasa Konsultan IT",
      nominal: 7500000,
      tglSchedulePembayaran: "2024-08-01",
      status: "Approved",
    },
    {
      id: 3,
      tglPO: "2024-07-03",
      noPO: "PO-2024-003",
      namaVendor: "UD Makmur Equipment",
      keterangan: "Sewa Peralatan Konstruksi",
      nominal: 3000000,
      tglSchedulePembayaran: "2024-07-20",
      status: "Pending",
    },
    {
      id: 4,
      tglPO: "2024-07-04",
      noPO: "PO-2024-004",
      namaVendor: "PT XYZ Logistics",
      keterangan: "Biaya Operasional Gudang",
      nominal: 10000000,
      tglSchedulePembayaran: "2024-07-15",
      status: "Paid",
    },
    {
      id: 5,
      tglPO: "2024-07-05",
      noPO: "PO-2024-005",
      namaVendor: "PT Sejahtera Office",
      keterangan: "Pembelian ATK Kantor",
      nominal: 1200000,
      tglSchedulePembayaran: "2024-08-05",
      status: "Approved",
    },
    {
      id: 6,
      tglPO: "2024-07-06",
      noPO: "PO-2024-006",
      namaVendor: "CV Bersama Teknik",
      keterangan: "Perbaikan Mesin Produksi",
      nominal: 4500000,
      tglSchedulePembayaran: "2024-07-25",
      status: "Pending",
    },
    {
      id: 7,
      tglPO: "2024-07-07",
      noPO: "PO-2024-007",
      namaVendor: "PT Indah Payroll",
      keterangan: "Gaji Karyawan Bulan Juli",
      nominal: 50000000,
      tglSchedulePembayaran: "2024-07-10",
      status: "Paid",
    },
    {
      id: 8,
      tglPO: "2024-07-08",
      noPO: "PO-2024-008",
      namaVendor: "UD Sentosa Transport",
      keterangan: "Biaya Transportasi Karyawan",
      nominal: 800000,
      tglSchedulePembayaran: "2024-08-08",
      status: "Approved",
    },
    {
      id: 9,
      tglPO: "2024-07-09",
      noPO: "PO-2024-009",
      namaVendor: "PT Global Services",
      keterangan: "Pajak Bulanan Perusahaan",
      nominal: 6000000,
      tglSchedulePembayaran: "2024-07-30",
      status: "Pending",
    },
    {
      id: 10,
      tglPO: "2024-07-10",
      noPO: "PO-2024-010",
      namaVendor: "CV Abadi Marketing",
      keterangan: "Pemasaran Digital & Promosi",
      nominal: 2500000,
      tglSchedulePembayaran: "2024-08-10",
      status: "Approved",
    },
  ];

  // Handle chart click events
  const handleChartClick = (data: any, chartType: "aging" | "trend") => {
    if (data && data.activePayload && data.activePayload[0]) {
      const payload = data.activePayload[0].payload;
      setSelectedData(payload);

      if (chartType === "aging") {
        setModalTitle(`Detail Transaksi - ${payload.bucket}`);
        setTransactionDetails(getTransactionDetails("aging", payload.bucket));
      } else {
        setModalTitle(`Detail Transaksi - ${payload.bulan} 2024`);
        setTransactionDetails(getTransactionDetails("trend", payload.bulan));
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
                AP DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Finance
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  AP
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Dashboard</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
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
                  Total Utang Usaha (terupdate)
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  Rp {totalUtangUsaha.toLocaleString("id-ID")}
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
                  Jumlah Vendor Terutang
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {jumlahVendorTerutang}
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
                  Total Utang Usaha Jatuh Tempo
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  Rp {totalUtangJatuhTempo.toLocaleString("id-ID")}
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
                Aging Report (Umur Utang)
              </h3>
              <BarChart2 className="h-5 w-5 text-gray-500" />
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agingData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  onClick={(data) => handleChartClick(data, "aging")}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `Rp ${v / 1_000_000}jt`} />
                  <Tooltip
                    formatter={(value: number) => [
                      `Rp ${value.toLocaleString("id-ID")}`,
                      "Nilai",
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

          {/* Trend Pembayaran Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Trend Pembayaran Utang Usaha Bulanan
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Menunjukkan nilai pembayaran ke vendor selama 6 bulan terakhir.
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  onClick={(data) => handleChartClick(data, "trend")}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `Rp ${v / 1_000_000}jt`} />
                  <Tooltip
                    formatter={(value: number) => [
                      `Rp ${value.toLocaleString("id-ID")}`,
                      "Pembayaran",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bayar"
                    name="Pembayaran"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4, cursor: "pointer" }}
                    activeDot={{ r: 6, cursor: "pointer" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Dummy Mapping Pembayaran Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Payments Mapping
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
                    Tgl PO
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No. PO
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama Vendor
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
                    Tgl Schedule Pembayaran
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
                      {new Date(item.tglPO).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.noPO}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.namaVendor}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.keterangan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                      Rp {item.nominal.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.tglSchedulePembayaran).toLocaleDateString(
                        "id-ID"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Approved"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
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
                      {"bucket" in selectedData
                        ? `Total Nilai: Rp ${
                            selectedData.nilai?.toLocaleString("id-ID") || "0"
                          }`
                        : `Total Pembayaran: Rp ${
                            selectedData.bayar?.toLocaleString("id-ID") || "0"
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
                    Rp{" "}
                    {transactionDetails
                      .reduce((sum, t) => sum + t.nominal, 0)
                      .toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-sm text-yellow-600">Pending</div>
                  <div className="text-2xl font-bold text-yellow-900">
                    {
                      transactionDetails.filter((t) => t.status === "Pending")
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
                          Vendor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No. PO
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
                              "id-ID"
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {transaction.vendor}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.noPO}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {transaction.deskripsi}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                            Rp {transaction.nominal.toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {new Date(
                              transaction.jatuhTempo
                            ).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction.status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "Approved"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
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

export default APDashboard;
