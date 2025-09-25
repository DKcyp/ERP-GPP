import React, { useState, useMemo } from "react";
import {
  Clock,
  FileText,
  Download,
  FileSpreadsheet,
  Search,
  Filter,
} from "lucide-react";
import DetailPembayaranHutangModal from "./DetailPembayaranHutangModal";

interface LaporanAPData {
  id: number;
  namaSupplier: string;
  noInvoice: string;
  tglInvoice: string; // Renamed from tglPO
  tglJatuhTempo: string;
  mataUang: string;
  nominalDpp: number;
  nominalPpn: number;
  subTotal: number;
  statusPiutang: "Belum Lunas" | "Sebagian Lunas" | "Lunas" | "Overdue"; // Renamed from statusHutang
  totalOutstandingPiutang: number; // Renamed from totalOutstanding
  belumJatuhTempo: number;
  jatuhTempo0_30: number;
  jatuhTempo31_60: number;
  lebihDari60: number;
  rincianPembayaran: {
    termin: string;
    tanggalBayar: string;
    nominal: number;
  }[];
}

const FinanceLaporanARDashboard: React.FC = () => {
  // Filter states
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterInvoice, setFilterInvoice] = useState("");
  const [filterStatusPiutang, setFilterStatusPiutang] = useState(""); // Renamed from filterStatus
  const [tglInvoiceDari, setTglInvoiceDari] = useState(""); // Renamed from tglPODari
  const [tglInvoiceSampai, setTglInvoiceSampai] = useState(""); // Renamed from tglPOSampai
  const [tglJatuhTempoDari, setTglJatuhTempoDari] = useState("");
  const [tglJatuhTempoSampai, setTglJatuhTempoSampai] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LaporanAPData | null>(null);

  const handleNominalClick = (rowData: LaporanAPData) => {
    setSelectedRow(rowData);
    setIsModalOpen(true);
  };

  const [dummyTableData] = useState<LaporanAPData[]>([
    {
      id: 1,
      namaSupplier: "PT Maju Jaya",
      noInvoice: "INV-001/2025",
      tglInvoice: "2025-08-25", // Renamed from tglPO
      tglJatuhTempo: "2025-09-24",
      mataUang: "IDR",
      nominalDpp: 20000000,
      nominalPpn: 2000000,
      subTotal: 22000000,
      statusPiutang: "Sebagian Lunas", // Renamed from statusHutang
      totalOutstandingPiutang: 12000000, // Renamed from totalOutstanding
      belumJatuhTempo: 12000000,
      jatuhTempo0_30: 0,
      jatuhTempo31_60: 0,
      lebihDari60: 0,
      rincianPembayaran: [
        {
          termin: "Pembayaran ke-1",
          tanggalBayar: "2025-09-01",
          nominal: 10000000,
        },
      ],
    },
    {
      id: 2,
      namaSupplier: "CV Solusi Digital",
      noInvoice: "INV-045/2025",
      tglInvoice: "2025-08-18", // Renamed from tglPO
      tglJatuhTempo: "2025-09-17",
      mataUang: "IDR",
      nominalDpp: 12000000,
      nominalPpn: 1200000,
      subTotal: 13200000,
      statusPiutang: "Overdue", // Renamed from statusHutang
      totalOutstandingPiutang: 5700000, // Renamed from totalOutstanding
      belumJatuhTempo: 0,
      jatuhTempo0_30: 5700000,
      jatuhTempo31_60: 0,
      lebihDari60: 0,
      rincianPembayaran: [
        {
          termin: "Pembayaran ke-1",
          tanggalBayar: "2025-08-30",
          nominal: 5000000,
        },
        {
          termin: "Pembayaran ke-2",
          tanggalBayar: "2025-09-10",
          nominal: 2500000,
        },
      ],
    },
    {
      id: 3,
      namaSupplier: "PT Teknologi Maju",
      noInvoice: "INV-078/2025",
      tglInvoice: "2025-09-01", // Renamed from tglPO
      tglJatuhTempo: "2025-10-01",
      mataUang: "IDR",
      nominalDpp: 15000000,
      nominalPpn: 1500000,
      subTotal: 16500000,
      statusPiutang: "Lunas", // Renamed from statusHutang
      totalOutstandingPiutang: 0, // Renamed from totalOutstanding
      belumJatuhTempo: 0,
      jatuhTempo0_30: 0,
      jatuhTempo31_60: 0,
      lebihDari60: 0,
      rincianPembayaran: [
        {
          termin: "Pembayaran ke-1",
          tanggalBayar: "2025-09-15",
          nominal: 16500000,
        },
      ],
    },
    {
      id: 4,
      namaSupplier: "CV Berkah Mandiri",
      noInvoice: "INV-099/2025",
      tglInvoice: "2025-07-15", // Renamed from tglPO
      tglJatuhTempo: "2025-08-14",
      mataUang: "IDR",
      nominalDpp: 8000000,
      nominalPpn: 800000,
      subTotal: 8800000,
      statusPiutang: "Overdue", // Renamed from statusHutang
      totalOutstandingPiutang: 8800000, // Renamed from totalOutstanding
      belumJatuhTempo: 0,
      jatuhTempo0_30: 0,
      jatuhTempo31_60: 8800000,
      lebihDari60: 0,
      rincianPembayaran: [],
    },
    {
      id: 5,
      namaSupplier: "PT Sinar Abadi",
      noInvoice: "INV-101/2025",
      tglInvoice: "2025-06-10", // Renamed from tglPO
      tglJatuhTempo: "2025-07-10",
      mataUang: "IDR",
      nominalDpp: 30000000,
      nominalPpn: 3000000,
      subTotal: 33000000,
      statusPiutang: "Overdue", // Renamed from statusHutang
      totalOutstandingPiutang: 33000000, // Renamed from totalOutstanding
      belumJatuhTempo: 0,
      jatuhTempo0_30: 0,
      jatuhTempo31_60: 0,
      lebihDari60: 33000000,
      rincianPembayaran: [],
    },
  ]);

  // Filter logic
  const filteredData = useMemo(() => {
    return dummyTableData.filter((item) => {
      const supplierMatch =
        filterSupplier === "" ||
        item.namaSupplier.toLowerCase().includes(filterSupplier.toLowerCase());

      const invoiceMatch =
        filterInvoice === "" ||
        item.noInvoice.toLowerCase().includes(filterInvoice.toLowerCase());

      const statusPiutangMatch =
        filterStatusPiutang === "" ||
        item.statusPiutang === filterStatusPiutang; // Updated status filter

      const tglInvoiceMatch =
        (!tglInvoiceDari ||
          new Date(item.tglInvoice) >= new Date(tglInvoiceDari)) &&
        (!tglInvoiceSampai ||
          new Date(item.tglInvoice) <= new Date(tglInvoiceSampai)); // Updated tglPO filter

      const tglJatuhTempoMatch =
        (!tglJatuhTempoDari ||
          new Date(item.tglJatuhTempo) >= new Date(tglJatuhTempoDari)) &&
        (!tglJatuhTempoSampai ||
          new Date(item.tglJatuhTempo) <= new Date(tglJatuhTempoSampai));

      return (
        supplierMatch &&
        invoiceMatch &&
        statusPiutangMatch &&
        tglInvoiceMatch &&
        tglJatuhTempoMatch
      );
    });
  }, [
    dummyTableData,
    filterSupplier,
    filterInvoice,
    filterStatusPiutang,
    tglInvoiceDari,
    tglInvoiceSampai,
    tglJatuhTempoDari,
    tglJatuhTempoSampai,
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Belum Lunas":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Belum Lunas
          </span>
        );
      case "Sebagian Lunas":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Sebagian Lunas
          </span>
        );
      case "Lunas":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Lunas
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
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
                Laporan AR
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
                <span className="text-blue-600 font-medium">Laporan AP</span>
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
        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="h-6 w-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              Filter Laporan AR
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier
              </label>
              <input
                type="text"
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
                placeholder="Nama/Kode Supplier..."
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No Invoice
              </label>
              <input
                type="text"
                value={filterInvoice}
                onChange={(e) => setFilterInvoice(e.target.value)}
                placeholder="No Invoice..."
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Piutang
              </label>
              <select
                value={filterStatusPiutang}
                onChange={(e) => setFilterStatusPiutang(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">Semua Status</option>
                <option value="Belum Lunas">Belum Lunas</option>
                <option value="Sebagian Lunas">Sebagian Lunas</option>
                <option value="Lunas">Lunas</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Terapkan Filter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tgl Invoice Dari
              </label>
              <input
                type="date"
                value={tglInvoiceDari}
                onChange={(e) => setTglInvoiceDari(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tgl Invoice Sampai
              </label>
              <input
                type="date"
                value={tglInvoiceSampai}
                onChange={(e) => setTglInvoiceSampai(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tgl Jatuh Tempo Dari
              </label>
              <input
                type="date"
                value={tglJatuhTempoDari}
                onChange={(e) => setTglJatuhTempoDari(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tgl Jatuh Tempo Sampai
              </label>
              <input
                type="date"
                value={tglJatuhTempoSampai}
                onChange={(e) => setTglJatuhTempoSampai(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end space-x-3 mb-6">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export PDF</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5" />
            <span>Export Excel</span>
          </button>
        </div>

        {/* Table List View */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Daftar Laporan AR ({filteredData.length} items)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama Supplier
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No Invoice
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tanggal Invoice
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tgl Jatuh Tempo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status Piutang
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mata Uang
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nominal DPP
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nominal PPN
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sub Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Belum Jatuh Tempo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    0 - 30 Hari
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    31 - 60 Hari
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {" "}
                    &gt; 60 Hari
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Outstanding Piutang
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.namaSupplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.noInvoice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.tglInvoice).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.tglJatuhTempo).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.statusPiutang)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.mataUang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {item.nominalDpp.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {item.nominalPpn.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {item.subTotal.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleNominalClick(item)}
                        className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                      >
                        Rp {item.belumJatuhTempo.toLocaleString("id-ID")}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleNominalClick(item)}
                        className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                      >
                        Rp {item.jatuhTempo0_30.toLocaleString("id-ID")}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleNominalClick(item)}
                        className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                      >
                        Rp {item.jatuhTempo31_60.toLocaleString("id-ID")}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleNominalClick(item)}
                        className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                      >
                        Rp {item.lebihDari60.toLocaleString("id-ID")}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      Rp {item.totalOutstandingPiutang.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DetailPembayaranHutangModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedRow}
      />
    </div>
  );
};

export default FinanceLaporanARDashboard;
