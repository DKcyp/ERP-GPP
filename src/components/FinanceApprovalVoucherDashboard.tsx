import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Clock,
  FileSpreadsheet,
  FileDown,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
} from "lucide-react";

interface ApprovalVoucherRow {
  id: number;
  noVoucher: string;
  tglVoucher: string;
  namaDivisi: string;
  noSO: string;
  nominalVoucher: number;
  statusApproval: "Verify" | "Approval 1" | "Approval 2" | "Paid";
  namaKaryawan: string;
  namaAkun: string;
  approver: string;
  levelApproval: number;
  tglSubmit: string;
  tglApproval?: string;
  tglPencairan?: string;
  keterangan: string;
  catatan?: string;
}

const FinanceApprovalVoucherDashboard: React.FC = () => {
  const today = new Date();

  // Filters
  const [filterNoVoucher, setFilterNoVoucher] = useState("");
  const [filterDivisi, setFilterDivisi] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] =
    useState<ApprovalVoucherRow | null>(null);
  const [showVerifModal, setShowVerifModal] = useState(false);
  const [showBayarModal, setShowBayarModal] = useState(false);
  const [verifNotes, setVerifNotes] = useState("");
  const [bayarNotes, setBayarNotes] = useState("");
  const [metodeBayar, setMetodeBayar] = useState<'Kas' | 'Bank' | ''>('');
  const [detailBayar, setDetailBayar] = useState('');
  const [tanggalBayar, setTanggalBayar] = useState<Date | null>(new Date());

  // Dummy data for payment methods
  const kasOptions = ["Kas Kecil Kantor", "Kas Besar Proyek A"];
  const bankOptions = ["BCA Operasional - 123456789", "Mandiri Payroll - 987654321"];

  // Dummy data
  const [rows, setRows] = useState<ApprovalVoucherRow[]>([
    {
      id: 1,
      noVoucher: "VCR-2025-0901",
      tglVoucher: "2025-09-02",
      namaDivisi: "Finance",
      noSO: "SO-001",
      nominalVoucher: 2500000,
      statusApproval: "Verify",
      namaKaryawan: "Budi Santoso",
      namaAkun: "Biaya Operasional",
      approver: "Manajer Finance",
      levelApproval: 1,
      tglSubmit: "2025-09-02",
      keterangan: "Uang muka perjalanan dinas Jakarta",
    },
    {
      id: 2,
      noVoucher: "VCR-2025-0902",
      tglVoucher: "2025-09-05",
      namaDivisi: "Marketing",
      noSO: "SO-015",
      nominalVoucher: 1500000,
      statusApproval: "Approval 1",
      namaKaryawan: "Siti Aminah",
      namaAkun: "Biaya Promosi",
      approver: "Direktur Operasional",
      levelApproval: 2,
      tglSubmit: "2025-09-05",
      tglApproval: "2025-09-09",
      keterangan: "Biaya promosi produk baru",
      catatan: "Disetujui untuk promosi Q4",
    },
    {
      id: 3,
      noVoucher: "VCR-2025-0903",
      tglVoucher: "2025-09-10",
      namaDivisi: "HRD",
      noSO: "SO-020",
      nominalVoucher: 2000000,
      statusApproval: "Approval 2",
      namaKaryawan: "Joko Susilo",
      namaAkun: "Biaya Pelatihan",
      approver: "Direktur HRD",
      levelApproval: 2,
      tglSubmit: "2025-09-10",
      tglApproval: "2025-09-12",
      keterangan: "Pelatihan karyawan baru",
      catatan: "Approved by HRD",
    },
    {
      id: 4,
      noVoucher: "VCR-2025-0904",
      tglVoucher: "2025-09-12",
      namaDivisi: "Accounting",
      noSO: "SO-025",
      nominalVoucher: 3000000,
      statusApproval: "Paid",
      namaKaryawan: "Dewi Lestari",
      namaAkun: "Biaya Pajak",
      approver: "Manajer Accounting",
      levelApproval: 3,
      tglSubmit: "2025-09-12",
      tglApproval: "2025-09-15",
      keterangan: "Pembayaran pajak bulanan",
      catatan: "Sudah dibayar",
    },
  ]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const okNo = filterNoVoucher
          ? r.noVoucher.toLowerCase().includes(filterNoVoucher.toLowerCase())
          : true;
        const okDiv = filterDivisi ? r.namaDivisi === filterDivisi : true;
        const okStat = filterStatus
          ? r.statusApproval === (filterStatus as any)
          : true;
        const okFrom = dari
          ? new Date(r.tglVoucher) >= new Date(`${dari}T00:00:00`)
          : true;
        const okTo = sampai
          ? new Date(r.tglVoucher) <= new Date(`${sampai}T23:59:59`)
          : true;
        return okNo && okDiv && okStat && okFrom && okTo;
      }),
    [rows, filterNoVoucher, filterDivisi, filterStatus, dari, sampai]
  );

  const handleViewDetail = (voucher: ApprovalVoucherRow) => {
    setSelectedVoucher(voucher);
    setShowDetailModal(true);
  };

  const handleVerif = (voucher: ApprovalVoucherRow) => {
    setSelectedVoucher(voucher);
    setVerifNotes("");
    setShowVerifModal(true);
  };

  const handleBayar = (voucher: ApprovalVoucherRow) => {
    setSelectedVoucher(voucher);
    setBayarNotes("");
    setMetodeBayar('');
    setDetailBayar('');
    setTanggalBayar(new Date());
    setShowBayarModal(true);
  };

  const confirmVerif = () => {
    if (!selectedVoucher) return;

    const updatedRows = rows.map((row) => {
      if (row.id === selectedVoucher.id) {
        return {
          ...row,
          statusApproval: "Approval 1" as any,
          tglApproval: new Date().toISOString().split("T")[0],
          catatan: verifNotes || undefined,
        };
      }
      return row;
    });

    setRows(updatedRows);
    setShowVerifModal(false);
    setSelectedVoucher(null);
    setVerifNotes("");
  };

  const confirmBayar = () => {
    if (!selectedVoucher || !metodeBayar || !detailBayar || !tanggalBayar) {
      alert("Harap lengkapi semua field pembayaran.");
      return;
    }

    const catatanPembayaran = `Dibayar melalui ${metodeBayar}: ${detailBayar}. Catatan: ${bayarNotes || '-'}`;

    const updatedRows = rows.map((row) => {
      if (row.id === selectedVoucher.id) {
        return {
          ...row,
          statusApproval: "Paid" as any,
          tglPencairan: tanggalBayar.toISOString().split("T")[0],
          catatan: catatanPembayaran,
        };
      }
      return row;
    });

    setRows(updatedRows);
    setShowBayarModal(false);
    setSelectedVoucher(null);
    setBayarNotes("");
    setMetodeBayar('');
    setDetailBayar('');
    setTanggalBayar(new Date());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verify":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Verify
          </span>
        );
      case "Approval 1":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Approval 1
          </span>
        );
      case "Approval 2":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Approval 2
          </span>
        );
      case "Paid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Paid
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

  const exportExcel = () => alert("Export Excel belum diimplementasikan");
  const exportPDF = () => alert("Export PDF belum diimplementasikan");

  const pendingCount = filtered.filter(
    (r) => r.statusApproval === "Verify"
  ).length;
  const approvedCount = filtered.filter(
    (r) => r.statusApproval === "Paid"
  ).length;
  const rejectedCount = filtered.filter(
    (r) =>
      r.statusApproval === "Approval 1" || r.statusApproval === "Approval 2"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                APPROVAL VOUCHER
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Finance
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Voucher dan Reimburse
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Approval Voucher
                </span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Voucher
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {filtered.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Approval
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {approvedCount}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {rejectedCount}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Filter Approval Voucher
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No Voucher
              </label>
              <input
                type="text"
                value={filterNoVoucher}
                onChange={(e) => setFilterNoVoucher(e.target.value)}
                placeholder="VCR-..."
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Divisi
              </label>
              <select
                value={filterDivisi}
                onChange={(e) => setFilterDivisi(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">Semua</option>
                {[
                  "Marketing",
                  "HRD",
                  "GA",
                  "Procurement",
                  "Project Control",
                  "Operasional",
                  "QHSE",
                  "Finance",
                  "Accounting",
                  "Tax",
                  "Gudang",
                ].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Approval
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">Semua</option>
                <option value="Verify">Verify</option>
                <option value="Approval 1">Approval 1</option>
                <option value="Approval 2">Approval 2</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tgl Voucher Dari
              </label>
              <input
                type="date"
                value={dari}
                onChange={(e) => setDari(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tgl Voucher Sampai
              </label>
              <input
                type="date"
                value={sampai}
                onChange={(e) => setSampai(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Terapkan Filter
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={exportExcel}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button
              onClick={exportPDF}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">
              Daftar Approval Voucher ({filtered.length} items)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No Voucher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tgl Voucher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Divisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Karyawan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nominal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Pencairan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {row.noVoucher}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(row.tglVoucher).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.namaDivisi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.namaKaryawan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {row.nominalVoucher.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(row.statusApproval)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.approver}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.tglPencairan
                        ? new Date(row.tglPencairan).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetail(row)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Detail
                        </button>
                        {row.statusApproval === "Verify" && (
                          <button
                            onClick={() => handleVerif(row)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verif
                          </button>
                        )}
                        {row.statusApproval === "Approval 1" && (
                          <button
                            onClick={() => handleBayar(row)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Bayar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedVoucher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Detail Voucher
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    No Voucher
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedVoucher.noVoucher}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal Voucher
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedVoucher.tglVoucher).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Divisi
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedVoucher.namaDivisi}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    No SO
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedVoucher.noSO}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama Karyawan
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedVoucher.namaKaryawan}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nominal
                  </label>
                  <p className="text-sm text-gray-900">
                    Rp {selectedVoucher.nominalVoucher.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Keterangan
                </label>
                <p className="text-sm text-gray-900">
                  {selectedVoucher.keterangan}
                </p>
              </div>

              {selectedVoucher.tglPencairan && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal Pencairan
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedVoucher.tglPencairan).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                </div>
              )}

              {selectedVoucher.catatan && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Catatan Approval
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedVoucher.catatan}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verif Modal */}
      {showVerifModal && selectedVoucher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Verifikasi Voucher
              </h3>
              <button
                onClick={() => setShowVerifModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">
                  Voucher:{" "}
                  <span className="font-medium">
                    {selectedVoucher.noVoucher}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Nominal:{" "}
                  <span className="font-medium">
                    Rp {selectedVoucher.nominalVoucher.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Verifikasi
                </label>
                <textarea
                  value={verifNotes}
                  onChange={(e) => setVerifNotes(e.target.value)}
                  rows={3}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan catatan verifikasi..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowVerifModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Batal
              </button>
              <button
                onClick={confirmVerif}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-md"
              >
                Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bayar Modal */}
      {showBayarModal && selectedVoucher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Pembayaran Voucher
              </h3>
              <button
                onClick={() => setShowBayarModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metode Kas/Bank
                </label>
                <select
                  value={metodeBayar}
                  onChange={(e) => {
                    setMetodeBayar(e.target.value as any);
                    setDetailBayar(''); // Reset detail on method change
                  }}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih Metode</option>
                  <option value="Kas">Kas</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detail Kas/Bank
                </label>
                <select
                  value={detailBayar}
                  onChange={(e) => setDetailBayar(e.target.value)}
                  disabled={!metodeBayar}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Pilih Detail</option>
                  {(metodeBayar === 'Kas' ? kasOptions : bankOptions).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Bayar
                </label>
                <DatePicker
                  selected={tanggalBayar}
                  onChange={(date) => setTanggalBayar(date)}
                  dateFormat="dd/MM/yyyy"
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Pembayaran
                </label>
                <textarea
                  value={bayarNotes}
                  onChange={(e) => setBayarNotes(e.target.value)}
                  rows={2}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(Opsional)"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowBayarModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Batal
              </button>
              <button
                onClick={confirmBayar}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
              >
                Bayar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceApprovalVoucherDashboard;
