import React, { useState } from "react";
import {
  Search,
  CalendarDays,
  FileText,
  FileSpreadsheet,
  FileDown,
  Check,
  X,
  Send,
  ShieldCheck,
} from "lucide-react";
import PertanggungJawabanEntryModal from "./PertanggungJawabanEntryModal"; // Import the new modal
import { VoucherEntry, PTJDetailItem } from "../types"; // Only import VoucherEntry
import PTJDetailModal from "./PTJDetailModal";
import ConfirmationModal from "./ConfirmationModal";

const FinanceApprovalPTJVoucherDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherEntry | null>(
    null
  ); // Change type to VoucherEntry | null
  const [isPTJModalOpen, setIsPTJModalOpen] = useState(false);
  const [ptjDetails, setPtjDetails] = useState<PTJDetailItem[]>([]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | "posting" | "verify" | null
  >(null);
  const [selectedEntry, setSelectedEntry] = useState<VoucherEntry | null>(null);
  const [rejectionNote, setRejectionNote] = useState<string>(""); // New state for rejection note

  const voucherData: VoucherEntry[] = [
    {
      no: 1,
      noVoucher: "VCH001",
      noSO: "SO001",
      noSOTurunan: "-",
      namaProject: "Project A",
      namaPemohon: "Abdul Karim",
      tglPengajuanVoucher: "10-01-2025",
      tglPembayaranVoucher: "15-01-2025",
      tglExpired: "25-01-2025",
      tglLaporanExpense: "30-01-2025",
      nominal: "Rp 20,000,000",
      keterangan: "Tugas Luar Kota",
      ptjNominal: "Rp 5,000,000",
      statusPosting: "Sudah Posting",
      ptjDetails: [
        { deskripsi: "Transport", nominal: 3000000 },
        { deskripsi: "Makan", nominal: 2000000 },
      ],
    },
    {
      no: 2,
      noVoucher: "VCH002",
      noSO: "SO002",
      noSOTurunan: "SO002.4",
      namaProject: "Project B",
      namaPemohon: "Juna Saputra",
      tglPengajuanVoucher: "10-01-2025",
      tglPembayaranVoucher: "15-01-2025",
      tglExpired: "25-01-2025",
      tglLaporanExpense: "30-01-2025",
      nominal: "Rp 25,000,000",
      keterangan: "Tugas Luar Kota",
      ptjNominal: "Rp 12,000,000",
      statusPosting: "Belum Posting",
      ptjDetails: [
        { deskripsi: "Hotel", nominal: 7000000 },
        { deskripsi: "BBM", nominal: 5000000 },
      ],
    },
    {
      no: 3,
      noVoucher: "VCH003",
      noSO: "SO003",
      noSOTurunan: "SO003.12",
      namaProject: "Inspeksi Rope Access",
      namaPemohon: "Rizky Andrian",
      tglPengajuanVoucher: "12-02-2025",
      tglPembayaranVoucher: "17-02-2025",
      tglExpired: "27-02-2025",
      tglLaporanExpense: "05-03-2025",
      nominal: "Rp 15,000,000",
      keterangan: "Perjalanan Dinas ke Site",
      ptjNominal: "Rp 0",
      statusPosting: "Sudah Posting",
      ptjDetails: [],
    },
    {
      no: 4,
      noVoucher: "VCH004",
      noSO: "-",
      noSOTurunan: "-",
      namaProject: "Training Keselamatan Kerja",
      namaPemohon: "Hendra Prasetyo",
      tglPengajuanVoucher: "15-02-2025",
      tglPembayaranVoucher: "20-02-2025",
      tglExpired: "01-03-2025",
      tglLaporanExpense: "07-03-2025",
      nominal: "Rp 30,000,000",
      keterangan: "Pelatihan Internal",
      statusPosting: "Belum Posting",
    },
    {
      no: 5,
      noVoucher: "VCH005",
      noSO: "SO005",
      noSOTurunan: "-",
      namaProject: "Audit Sistem Manajemen K3",
      namaPemohon: "Indra Wijaya",
      tglPengajuanVoucher: "18-02-2025",
      tglPembayaranVoucher: "23-02-2025",
      tglExpired: "05-03-2025",
      tglLaporanExpense: "12-03-2025",
      nominal: "Rp 22,000,000",
      keterangan: "Proyek Audit K3",
      statusPosting: "Sudah Posting",
    },
    {
      no: 6,
      noVoucher: "VCH006",
      noSO: "SO006",
      noSOTurunan: "SO006.13",
      namaProject: "Pemeliharaan Struktur Baja",
      namaPemohon: "Doni Saputra",
      tglPengajuanVoucher: "22-02-2025",
      tglPembayaranVoucher: "27-02-2025",
      tglExpired: "10-03-2025",
      tglLaporanExpense: "17-03-2025",
      nominal: "Rp 18,500,000",
      keterangan: "Pemeliharaan Rutin",
      statusPosting: "Belum Posting",
    },
  ];

  const handleViewDetail = (entry: VoucherEntry) => {
    setSelectedVoucher(entry); // Pass the entire VoucherEntry object
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVoucher(null);
  };

  const parseCurrency = (val: string | undefined): number => {
    if (!val) return 0;
    return parseInt(val.replace(/[^0-9]/g, "") || "0", 10);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleOpenPTJ = (entry: VoucherEntry) => {
    setPtjDetails(entry.ptjDetails || []);
    setIsPTJModalOpen(true);
  };

  const handleClosePTJ = () => {
    setIsPTJModalOpen(false);
    setPtjDetails([]);
  };

  const openConfirmation = (
    entry: VoucherEntry,
    action: "approve" | "reject" | "posting" | "verify"
  ) => {
    setSelectedEntry(entry);
    setConfirmAction(action);
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedEntry && confirmAction) {
      if (confirmAction === "reject" && !rejectionNote) {
        alert("Catatan penolakan tidak boleh kosong.");
        return;
      }
      
      if (confirmAction === "posting") {
        console.log("Posting voucher:", selectedEntry.noVoucher);
        alert(`Voucher ${selectedEntry.noVoucher} berhasil di-posting!`);
        // Here you would put your actual posting logic
      } else if (confirmAction === "verify") {
        console.log("Verify Kasir voucher:", selectedEntry.noVoucher);
        alert(`Voucher ${selectedEntry.noVoucher} berhasil diverifikasi oleh Kasir!`);
        // Here you would put your actual verify kasir logic
      } else {
        console.log(
          `${confirmAction.charAt(0).toUpperCase() + confirmAction.slice(1)}d:`,
          selectedEntry.noVoucher
        );
        if (confirmAction === "reject") {
          console.log("Rejection Note:", rejectionNote);
          // Here you would send the rejectionNote along with the reject action
        }
      }
      // Here you would put your actual approve/reject/posting logic
    }
    closeConfirmation();
  };

  const closeConfirmation = () => {
    setIsConfirmModalOpen(false);
    setSelectedEntry(null);
    setConfirmAction(null);
    setRejectionNote(""); // Clear rejection note on close
  };

  return (
    <div className="min-h-screen bg-background text-text p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-text mb-4">
          Approval Pertanggung Jawaban Voucher
        </h1>

        {/* Filter Section */}
        <div className="bg-surface rounded-2xl shadow-lg border border-border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {/* Cari No Voucher */}
            <div>
              <label
                htmlFor="noVoucher"
                className="block text-xs font-medium text-textSecondary mb-1"
              >
                Cari No Voucher
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noVoucher"
                  className="w-full px-3 py-1.5 pr-8 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm text-text bg-background"
                  placeholder="VCH001"
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
              </div>
            </div>
            {/* Cari No SO */}
            <div>
              <label
                htmlFor="noSO"
                className="block text-xs font-medium text-textSecondary mb-1"
              >
                Cari No SO
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noSO"
                  className="w-full px-3 py-1.5 pr-8 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm text-text bg-background"
                  placeholder="SO001"
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
              </div>
            </div>
            {/* Cari No SO Turunan */}
            <div>
              <label
                htmlFor="noSOTurunan"
                className="block text-xs font-medium text-textSecondary mb-1"
              >
                Cari No SO Turunan
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noSOTurunan"
                  className="w-full px-3 py-1.5 pr-8 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm text-text bg-background"
                  placeholder="SO001.12"
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
              </div>
            </div>
            {/* Cari Nama Project */}
            <div>
              <label
                htmlFor="namaProject"
                className="block text-xs font-medium text-textSecondary mb-1"
              >
                Cari Nama Project
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="namaProject"
                  className="w-full px-3 py-1.5 pr-8 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm text-text bg-background"
                  placeholder="Proyek Medco"
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
              </div>
            </div>
            {/* Cari Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-xs font-medium text-textSecondary mb-1"
              >
                Cari Status
              </label>
              <select
                id="status"
                className="w-full px-3 py-1.5 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm text-text bg-background"
              >
                <option>--Pilih Status--</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          {/* Periode and Search Button */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="periodeStart"
                  className="block text-xs font-medium text-textSecondary mb-1"
                >
                  Periode
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="periodeStart"
                    className="w-full px-3 py-1.5 pr-8 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm text-text bg-background"
                    placeholder="03/03/2025"
                  />
                  <CalendarDays className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-textSecondary text-xs md:mt-7">s.d</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="periodeEnd"
                    className="w-full px-3 py-1.5 pr-8 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm text-text bg-background"
                    placeholder="03/03/2025"
                  />
                  <CalendarDays className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
                </div>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-xl shadow-md hover:bg-primary/80 transition-colors duration-300 w-full md:w-auto">
              Search
            </button>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end space-x-2 mb-4">
          <button className="inline-flex items-center px-3 py-1.5 bg-success text-white text-sm font-medium rounded-xl shadow-md hover:bg-success/80 transition-colors duration-300">
            <FileSpreadsheet className="h-3 w-3 mr-2" /> Export Excel
          </button>
          <button className="inline-flex items-center px-3 py-1.5 bg-secondary text-white text-sm font-medium rounded-xl shadow-md hover:bg-secondary/80 transition-colors duration-300">
            <FileText className="h-3 w-3 mr-2" /> Export CSV
          </button>
          <button className="inline-flex items-center px-3 py-1.5 bg-error text-white text-sm font-medium rounded-xl shadow-md hover:bg-error/80 transition-colors duration-300">
            <FileDown className="h-3 w-3 mr-2" /> Export PDF
          </button>
        </div>

        {/* Voucher Table */}
        <div className="bg-surface rounded-2xl shadow-lg border border-border p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 text-textSecondary text-xs">
              <span>Show</span>
              <select className="border border-border rounded-md px-2 py-1 text-xs bg-background text-text">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-surface rounded-xl shadow-sm border border-border whitespace-nowrap">
              <thead>
                <tr className="bg-background border-b border-border text-textSecondary text-xs font-semibold uppercase tracking-wider">
                  <th className="px-3 py-2 text-left">
                    No <span className="text-primary">↑</span>
                  </th>
                  <th className="px-3 py-2 text-left">No Voucher</th>
                  <th className="px-3 py-2 text-left">No SO</th>
                  <th className="px-3 py-2 text-left">No SO Turunan</th>
                  <th className="px-3 py-2 text-left">Nama Project</th>
                  <th className="px-3 py-2 text-left">Nama Pemohon</th>
                  <th className="px-3 py-2 text-left">Tgl Pengajuan Voucher</th>
                  <th className="px-3 py-2 text-left">
                    Tgl Pembayaran Voucher
                  </th>
                  <th className="px-3 py-2 text-left">Tgl Expired</th>
                  <th className="px-3 py-2 text-left">Tgl Laporan Expense</th>
                  <th className="px-3 py-2 text-left">UM</th>
                  <th className="px-3 py-2 text-left">PTJ</th>
                  <th className="px-3 py-2 text-left">Sisa</th>
                  <th className="px-3 py-2 text-left">Keterangan</th>
                  <th className="px-3 py-2 text-left">Status Posting</th>
                  <th className="px-3 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {voucherData.map((entry) => (
                  <tr
                    key={entry.no}
                    className="border-b border-border last:border-b-0 hover:bg-background transition-colors duration-150"
                  >
                    <td className="px-3 py-2 text-xs text-text">{entry.no}</td>
                    <td className="px-3 py-2 text-xs text-text">
                      {entry.noVoucher}
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      {entry.noSO}
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      {entry.noSOTurunan}
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      {entry.namaProject}
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      {entry.namaPemohon}
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      {entry.tglPengajuanVoucher}
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      {entry.tglPembayaranVoucher}
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      {entry.tglExpired}
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      {entry.tglLaporanExpense}
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      {entry.nominal}
                    </td>
                    <td
                      className="px-3 py-2 text-xs text-primary underline cursor-pointer"
                      onClick={() => handleOpenPTJ(entry)}
                    >
                      {entry.ptjNominal ?? "Rp 0"}
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      {formatCurrency(
                        Math.max(
                          parseCurrency(entry.nominal) -
                            parseCurrency(entry.ptjNominal),
                          0
                        )
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      {entry.keterangan}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          entry.statusPosting === "Sudah Posting"
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-warning/10 text-warning border border-warning/20"
                        }`}
                      >
                        {entry.statusPosting || "Belum Posting"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-text">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openConfirmation(entry, "approve")}
                          className="p-1 text-success hover:text-success/80 transition-colors duration-200"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openConfirmation(entry, "reject")}
                          className="p-1 text-error hover:text-error/80 transition-colors duration-200"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openConfirmation(entry, "posting")}
                          className="p-1 text-primary hover:text-primary/80 transition-colors duration-200"
                          title="Posting"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openConfirmation(entry, "verify")}
                          className="p-1 text-purple-600 hover:text-purple-800 transition-colors duration-200"
                          title="Verify Kasir"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-xs text-textSecondary">
            <span>
              Showing 1 to {voucherData.length} of {voucherData.length} entries
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 border border-border rounded-xl hover:bg-background transition-colors duration-200">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors duration-200">
                1
              </button>
              <button className="px-3 py-1.5 border border-border rounded-xl hover:bg-background transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pertanggung Jawaban Entry Modal */}
      <PertanggungJawabanEntryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        voucherData={selectedVoucher}
      />

      <PTJDetailModal
        isOpen={isPTJModalOpen}
        onClose={handleClosePTJ}
        details={ptjDetails}
        title="Detail Pertanggungjawaban"
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirm}
        title={
          confirmAction === "approve"
            ? "Konfirmasi Approval"
            : confirmAction === "reject"
            ? "Konfirmasi Penolakan"
            : confirmAction === "posting"
            ? "Konfirmasi Posting"
            : "Konfirmasi Verify Kasir"
        }
        message={
          confirmAction === "posting"
            ? `Apakah Anda yakin ingin melakukan posting untuk voucher ${selectedEntry?.noVoucher}?`
            : confirmAction === "verify"
            ? `Apakah Anda yakin ingin memverifikasi voucher ${selectedEntry?.noVoucher} oleh Kasir?`
            : `Apakah Anda yakin ingin ${
                confirmAction === "approve" ? "menyetujui" : "menolak"
              } pertanggung jawaban untuk voucher ${selectedEntry?.noVoucher}?`
        }
        confirmText={
          confirmAction === "approve"
            ? "Approve"
            : confirmAction === "reject"
            ? "Reject"
            : confirmAction === "posting"
            ? "Posting"
            : "Verify"
        }
        showNoteInput={confirmAction === "reject"} // Conditionally show note input
        note={rejectionNote}
        onNoteChange={setRejectionNote}
      />
    </div>
  );
};

export default FinanceApprovalPTJVoucherDashboard;
