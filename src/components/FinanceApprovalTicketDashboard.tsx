import React, { useMemo, useState } from "react";
import {
  Clock,
  FileSpreadsheet,
  FileDown,
  Eye,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";

interface PassengerData {
  no: number;
  nama: string;
}

interface TicketRow {
  id: number;
  tanggal: string;
  noTicket: string;
  divisi: string;
  pemohon: string;
  kategori: ("Hotel" | "Travel" | "Pesawat")[];
  prioritas: "Low" | "Medium" | "High" | "Urgent";
  judul: string;
  deskripsi: string;
  status: "Submitted" | "Approved" | "Rejected";
  tanggalApproval?: string;
  approver?: string;
  catatan?: string;
  attachmentFileName?: string;
  attachmentFileSize?: number;

  // Form Header Info
  noDokumen?: string;
  noRevisi?: string;
  tanggalRevisi?: string;
  tanggalBerlaku?: string;
  halaman?: string;

  // Basic Info
  dept?: string;
  soTurunan?: string;

  // Ticket Booking - Keberangkatan
  tanggalBerangkat?: string;
  tujuanBerangkat?: string;
  jamBerangkat?: string;
  maskapaiBerangkat?: string;
  hargaBerangkat?: number;
  jenisTicketBerangkat?: string;

  // Ticket Booking - Kepulangan
  tanggalPulang?: string;
  tujuanPulang?: string;
  jamPulang?: string;
  maskapaipulang?: string;
  hargaPulang?: number;
  jenisTicketPulang?: string;

  // Travel Booking - Keberangkatan
  tanggalBerangkatTravel?: string;
  tujuanBerangkatTravel?: string;
  jamBerangkatTravel?: string;
  namaTravelBerangkat?: string;
  hargaBerangkatTravel?: number;
  jenisTicketBerangkatTravel?: string;

  // Travel Booking - Kepulangan
  tanggalPulangTravel?: string;
  tujuanPulangTravel?: string;
  jamPulangTravel?: string;
  namaTravelPulang?: string;
  hargaPulangTravel?: number;
  jenisTicketPulangTravel?: string;

  // Passenger List
  passengers?: PassengerData[];

  // Hotel Booking
  tanggalCheckIn?: string;
  tanggalCheckOut?: string;
  lokasiHotel?: string;
  namaHotel?: string;
  jumlahHari?: number;
  hargaTotalHotel?: number;

  // Billing Section
  ditagihkanKe?: "Client" | "Perusahaan" | "";

  // Approval Section
  managerTerkait?: string;
  managerFinance?: string;
  direkturOPS?: string;
}

const FinanceApprovalTicketDashboard: React.FC = () => {
  const today = new Date();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketRow | null>(null);
  const [approvalNote, setApprovalNote] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const [searchNo, setSearchNo] = useState("");
  const [searchPemohon, setSearchPemohon] = useState("");
  const [filterKategori, setFilterKategori] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPrioritas] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const kategoriOptions = ["Hotel", "Travel", "Pesawat"];

  const [rows, setRows] = useState<TicketRow[]>([
    {
      id: 1,
      tanggal: "2025-09-20",
      noTicket: "TKT-2025-09-001",
      divisi: "IT",
      pemohon: "Andi Pratama",
      kategori: ["Pesawat"],
      prioritas: "High",
      judul: "Pemesanan Tiket Dinas ke Jakarta",
      deskripsi: "Perjalanan dinas untuk meeting dengan client di Jakarta",
      status: "Submitted",
      noDokumen: "GBP-HG-FM-23",
      noRevisi: "01",
      tanggalRevisi: "2025-09-20",
      tanggalBerlaku: "2025-09-20",
      halaman: "1 dari 1",
      dept: "IT",
      soTurunan: "SO00123.001",
      tanggalBerangkat: "2025-10-01",
      tujuanBerangkat: "Jakarta",
      jamBerangkat: "08:00",
      maskapaiBerangkat: "Garuda Indonesia",
      hargaBerangkat: 1500000,
      jenisTicketBerangkat: "Ekonomi",
      tanggalPulang: "2025-10-03",
      tujuanPulang: "Surabaya",
      jamPulang: "16:00",
      maskapaipulang: "Lion Air",
      hargaPulang: 1200000,
      jenisTicketPulang: "Ekonomi",
      passengers: [{ no: 1, nama: "Andi Pratama" }],
      tanggalCheckIn: "2025-10-01",
      tanggalCheckOut: "2025-10-03",
      lokasiHotel: "Jakarta",
      namaHotel: "Hotel Santika",
      jumlahHari: 2,
      hargaTotalHotel: 800000,
      ditagihkanKe: "Client",
    },
    {
      id: 2,
      tanggal: "2025-09-21",
      noTicket: "TKT-2025-09-002",
      divisi: "GA",
      pemohon: "Siti Nurhaliza",
      kategori: ["Hotel"],
      prioritas: "Medium",
      judul: "Perjalanan Dinas ke Bali",
      deskripsi: "Kunjungan ke cabang Bali untuk audit operasional",
      status: "Submitted",
      attachmentFileName: "proposal_perjalanan_bali.pdf",
      attachmentFileSize: 350000,
      noDokumen: "GBP-HG-FM-23",
      noRevisi: "01",
      tanggalRevisi: "2025-09-21",
      tanggalBerlaku: "2025-09-21",
      halaman: "1 dari 1",
      dept: "GA",
      soTurunan: "SO00123.002",
      tanggalBerangkat: "2025-10-05",
      tujuanBerangkat: "Bali",
      jamBerangkat: "09:30",
      maskapaiBerangkat: "Citilink",
      hargaBerangkat: 2000000,
      jenisTicketBerangkat: "Ekonomi",
      tanggalPulang: "2025-10-08",
      tujuanPulang: "Surabaya",
      jamPulang: "18:00",
      maskapaipulang: "Batik Air",
      hargaPulang: 1800000,
      jenisTicketPulang: "Ekonomi",
      passengers: [
        { no: 1, nama: "Siti Nurhaliza" },
        { no: 2, nama: "Ahmad Fauzi" },
      ],
      tanggalCheckIn: "2025-10-05",
      tanggalCheckOut: "2025-10-08",
      lokasiHotel: "Denpasar",
      namaHotel: "Grand Inna Bali Beach",
      jumlahHari: 3,
      hargaTotalHotel: 1500000,
      ditagihkanKe: "Perusahaan",
    },
    {
      id: 3,
      tanggal: "2025-09-22",
      noTicket: "TKT-2025-09-003",
      divisi: "Finance",
      pemohon: "Rudi Hermawan",
      kategori: ["Travel"],
      prioritas: "Urgent",
      judul: "Meeting Budget Q4 di Bandung",
      deskripsi:
        "Pertemuan dengan tim finance regional untuk pembahasan budget Q4",
      status: "Approved",
      tanggalApproval: "2025-09-22",
      approver: "Finance Manager",
      catatan: "Budget approved sesuai dengan proposal yang diajukan",
      noDokumen: "GBP-HG-FM-23",
      noRevisi: "01",
      tanggalRevisi: "2025-09-22",
      tanggalBerlaku: "2025-09-22",
      halaman: "1 dari 1",
      dept: "Finance",
      soTurunan: "SO00123.003",
      tanggalBerangkat: "2025-09-25",
      tujuanBerangkat: "Bandung",
      jamBerangkat: "07:00",
      maskapaiBerangkat: "Sriwijaya Air",
      hargaBerangkat: 800000,
      jenisTicketBerangkat: "Ekonomi",
      tanggalPulang: "2025-09-26",
      tujuanPulang: "Surabaya",
      jamPulang: "19:00",
      maskapaipulang: "Garuda Indonesia",
      hargaPulang: 900000,
      jenisTicketPulang: "Ekonomi",
      passengers: [{ no: 1, nama: "Rudi Hermawan" }],
      tanggalCheckIn: "2025-09-25",
      tanggalCheckOut: "2025-09-26",
      lokasiHotel: "Bandung",
      namaHotel: "Hotel Savoy Homann",
      jumlahHari: 1,
      hargaTotalHotel: 500000,
      ditagihkanKe: "Client",
    },
    {
      id: 4,
      tanggal: "2025-09-23",
      noTicket: "TKT-2025-09-004",
      divisi: "Marketing",
      pemohon: "Budi Santoso",
      kategori: ["Hotel", "Pesawat", "Travel"],
      prioritas: "Medium",
      judul: "Perjalanan Bisnis ke Singapore",
      deskripsi: "Mengikuti pameran dagang di Singapore",
      status: "Submitted",
      noDokumen: "GBP-HG-FM-24",
      noRevisi: "01",
      tanggalRevisi: "2025-09-23",
      tanggalBerlaku: "2025-09-23",
      halaman: "1 dari 1",
      dept: "Marketing",
      soTurunan: "SO00123.004",
      tanggalBerangkat: "2025-11-01",
      tujuanBerangkat: "Singapore",
      jamBerangkat: "09:00",
      maskapaiBerangkat: "Singapore Airlines",
      hargaBerangkat: 3000000,
      jenisTicketBerangkat: "Bisnis",
      tanggalPulang: "2025-11-05",
      tujuanPulang: "Surabaya",
      jamPulang: "18:00",
      maskapaipulang: "Garuda Indonesia",
      hargaPulang: 2500000,
      jenisTicketPulang: "Bisnis",
      tanggalBerangkatTravel: "2025-11-01",
      tujuanBerangkatTravel: "Singapore",
      jamBerangkatTravel: "09:00",
      namaTravelBerangkat: "Traveloka",
      hargaBerangkatTravel: 1000000,
      jenisTicketBerangkatTravel: "Ekonomi",
      tanggalPulangTravel: "2025-11-05",
      tujuanPulangTravel: "Surabaya",
      jamPulangTravel: "18:00",
      namaTravelPulang: "Tiket.com",
      hargaPulangTravel: 800000,
      jenisTicketPulangTravel: "Ekonomi",
      passengers: [
        { no: 1, nama: "Budi Santoso" },
        { no: 2, nama: "Dewi Anggraini" },
      ],
      tanggalCheckIn: "2025-11-01",
      tanggalCheckOut: "2025-11-05",
      lokasiHotel: "Singapore",
      namaHotel: "Marina Bay Sands",
      jumlahHari: 4,
      hargaTotalHotel: 5000000,
      ditagihkanKe: "Perusahaan",
    },
  ]);

  const handleApprove = (ticket: TicketRow) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === ticket.id
          ? {
              ...r,
              status: "Approved",
              tanggalApproval: today.toISOString().split("T")[0],
              approver: "Finance Manager",
              catatan: approvalNote,
              attachmentFileName: attachmentFile?.name,
              attachmentFileSize: attachmentFile?.size,
            }
          : r
      )
    );
    setIsDetailOpen(false);
    setApprovalNote("");
    setAttachmentFile(null);
  };

  const handleReject = (ticket: TicketRow) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === ticket.id
          ? {
              ...r,
              status: "Rejected",
              tanggalApproval: today.toISOString().split("T")[0],
              approver: "Finance Manager",
              catatan: approvalNote,
              attachmentFileName: attachmentFile?.name,
              attachmentFileSize: attachmentFile?.size,
            }
          : r
      )
    );
    setIsDetailOpen(false);
    setApprovalNote("");
    setAttachmentFile(null);
  };

  const handleViewDetail = (ticket: TicketRow) => {
    setSelectedTicket(ticket);
    setApprovalNote(ticket.catatan || "");
    if (ticket.attachmentFileName && ticket.attachmentFileSize) {
      setAttachmentFile(
        new File([], ticket.attachmentFileName, {
          // size: ticket.attachmentFileSize, // Removed as 'size' is a read-only property and not a valid option
        })
      );
    } else {
      setAttachmentFile(null);
    }
    setIsDetailOpen(true);
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const okNo = searchNo
        ? r.noTicket.toLowerCase().includes(searchNo.toLowerCase())
        : true;
      const okPemohon = searchPemohon
        ? r.pemohon.toLowerCase().includes(searchPemohon.toLowerCase())
        : true;
      const okKategori =
        filterKategori.length === 0 ||
        r.kategori.some((k) => filterKategori.includes(k));
      const okStatus = filterStatus ? r.status === filterStatus : true;
      const okPrioritas = filterPrioritas
        ? r.prioritas === filterPrioritas
        : true;
      const okDateFrom = dateFrom
        ? new Date(r.tanggal) >= new Date(dateFrom)
        : true;
      const okDateTo = dateTo ? new Date(r.tanggal) <= new Date(dateTo) : true;
      return (
        okNo &&
        okPemohon &&
        okKategori &&
        okStatus &&
        okPrioritas &&
        okDateFrom &&
        okDateTo
      );
    });
  }, [
    rows,
    searchNo,
    searchPemohon,
    filterKategori,
    filterStatus,
    filterPrioritas,
    dateFrom,
    dateTo,
  ]);

  // Calculate total nominal for filtered tickets
  const totalNominal = useMemo(() => {
    return filtered.reduce((total, row) => {
      const nominal =
        (row.hargaBerangkat || 0) +
        (row.hargaPulang || 0) +
        (row.hargaBerangkatTravel || 0) +
        (row.hargaPulangTravel || 0) +
        (row.hargaTotalHotel || 0);
      return total + nominal;
    }, 0);
  }, [filtered]);

  const exportExcel = () => alert("Export Excel belum diimplementasikan");
  const exportPDF = () => alert("Export PDF belum diimplementasikan");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-700";
      case "Submitted":
        return "text-blue-700";
      case "Rejected":
        return "text-red-700";
      default:
        return "text-gray-600";
    }
  };


  // Statistics
  const stats = {
    pending: rows.filter((r) => r.status === "Submitted").length,
    approved: rows.filter((r) => r.status === "Approved").length,
    rejected: rows.filter((r) => r.status === "Rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Approval Ticket
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-green-600 cursor-pointer transition-colors">
                  Finance
                </span>
                <span className="mx-2">›</span>
                <span className="text-green-600 font-medium">
                  Approval Ticket
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Approval
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Search className="h-6 w-6 mr-3 text-green-600" />
              Filter
            </h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari No Ticket
                </label>
                <input
                  type="text"
                  value={searchNo}
                  onChange={(e) => setSearchNo(e.target.value)}
                  placeholder="TKT-..."
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all duration-200 hover:border-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pemohon
                </label>
                <input
                  type="text"
                  value={searchPemohon}
                  onChange={(e) => setSearchPemohon(e.target.value)}
                  placeholder="Nama pemohon..."
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all duration-200 hover:border-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  multiple
                  value={filterKategori}
                  onChange={(e) =>
                    setFilterKategori(
                      Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      )
                    )
                  }
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all duration-200 hover:border-green-400"
                >
                  {kategoriOptions.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none transition-all duration-200 hover:border-green-400"
                >
                  <option value="">Semua</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Dari
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all duration-200 hover:border-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Sampai
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all duration-200 hover:border-green-400"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => {
                  /* trigger memo */
                }}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              >
                <Search className="h-4 w-4 mr-2" /> Cari Data
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={exportExcel}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
                </button>
                <button
                  onClick={exportPDF}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                >
                  <FileDown className="h-4 w-4 mr-2" /> Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileSpreadsheet className="h-6 w-6 mr-3 text-green-600" />
                Daftar Ticket untuk Approval
              </h3>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-green-200">
                <span className="text-sm font-medium text-gray-600">Total Data: </span>
                <span className="text-lg font-bold text-green-600">{filtered.length}</span>
              </div>
            </div>
          </div>
          <div className="p-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nama Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Divisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tujuan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Nominal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Keterangan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row, index) => {
                  const nominal =
                    (row.hargaBerangkat || 0) +
                    (row.hargaPulang || 0) +
                    (row.hargaBerangkatTravel || 0) +
                    (row.hargaPulangTravel || 0) +
                    (row.hargaTotalHotel || 0);
                  const tujuan =
                    (row.tujuanBerangkat && row.tujuanPulang
                      ? `Dari: ${row.tujuanBerangkat} - Ke: ${row.tujuanPulang}`
                      : row.tujuanBerangkat) ||
                    (row.tujuanBerangkatTravel && row.tujuanPulangTravel
                      ? `Dari: ${row.tujuanBerangkatTravel} - Ke: ${row.tujuanPulangTravel}`
                      : row.tujuanBerangkatTravel) ||
                    row.lokasiHotel ||
                    "-";
                  const keterangan = row.deskripsi || "-";

                  return (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {row.soTurunan || "-"}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate"
                        title={row.judul}
                      >
                        {row.judul}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.divisi}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate"
                        title={tujuan}
                      >
                        {tujuan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.kategori.join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">{`Rp ${nominal.toLocaleString(
                        "id-ID"
                      )}`}</td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate"
                        title={keterangan}
                      >
                        {keterangan}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(row)}
                          className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-colors duration-150"
                          title="View Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {/* Total Row */}
                <tr className="bg-gradient-to-r from-green-50 to-blue-50 border-t-2 border-green-200">
                  <td colSpan={6} className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    TOTAL NOMINAL:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right text-lg">
                    {`Rp ${totalNominal.toLocaleString("id-ID")}`}
                  </td>
                  <td colSpan={3} className="px-6 py-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">
                Detail Ticket - {selectedTicket.noTicket}
              </h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="p-6 space-y-6">
                {/* Header Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">
                    Informasi Dokumen
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        No Dokumen
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.noDokumen || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        No Revisi
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.noRevisi || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Halaman
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.halaman || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Revisi
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.tanggalRevisi
                          ? new Date(
                              selectedTicket.tanggalRevisi
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Berlaku
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.tanggalBerlaku
                          ? new Date(
                              selectedTicket.tanggalBerlaku
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Informasi Pemohon
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        No Ticket
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.noTicket}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedTicket.tanggal).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Pemohon
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.pemohon}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dept
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.dept || selectedTicket.divisi}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SO Turunan
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.soTurunan || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flight Booking Information */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">
                    Pemesanan Tiket Pesawat
                  </h4>

                  {/* Keberangkatan */}
                  <div className="mb-4">
                    <h5 className="text-md font-medium text-green-800 mb-3">
                      Keberangkatan
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.tanggalBerangkat
                            ? new Date(
                                selectedTicket.tanggalBerangkat
                              ).toLocaleDateString("id-ID")
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tujuan
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.tujuanBerangkat || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jam
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.jamBerangkat || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maskapai
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.maskapaiBerangkat || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harga
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.hargaBerangkat
                            ? `Rp ${selectedTicket.hargaBerangkat.toLocaleString(
                                "id-ID"
                              )}`
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jenis Tiket
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.jenisTicketBerangkat || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kepulangan */}
                  <div>
                    <h5 className="text-md font-medium text-green-800 mb-3">
                      Kepulangan
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.tanggalPulang
                            ? new Date(
                                selectedTicket.tanggalPulang
                              ).toLocaleDateString("id-ID")
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tujuan
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.tujuanPulang || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jam
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.jamPulang || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maskapai
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.maskapaipulang || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harga
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.hargaPulang
                            ? `Rp ${selectedTicket.hargaPulang.toLocaleString(
                                "id-ID"
                              )}`
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jenis Tiket
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.jenisTicketPulang || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Travel Booking Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">
                    Pemesanan Tiket Travel
                  </h4>

                  {/* Keberangkatan Travel */}
                  <div className="mb-4">
                    <h5 className="text-md font-medium text-blue-800 mb-3">
                      Keberangkatan
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.tanggalBerangkatTravel
                            ? new Date(
                                selectedTicket.tanggalBerangkatTravel
                              ).toLocaleDateString("id-ID")
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tujuan
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.tujuanBerangkatTravel || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jam
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.jamBerangkatTravel || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Travel
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.namaTravelBerangkat || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harga
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.hargaBerangkatTravel
                            ? `Rp ${selectedTicket.hargaBerangkatTravel.toLocaleString(
                                "id-ID"
                              )}`
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jenis Tiket
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.jenisTicketBerangkatTravel || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kepulangan Travel */}
                  <div>
                    <h5 className="text-md font-medium text-blue-800 mb-3">
                      Kepulangan
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.tanggalPulangTravel
                            ? new Date(
                                selectedTicket.tanggalPulangTravel
                              ).toLocaleDateString("id-ID")
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tujuan
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.tujuanPulangTravel || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jam
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.jamPulangTravel || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Travel
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.namaTravelPulang || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harga
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.hargaPulangTravel
                            ? `Rp ${selectedTicket.hargaPulangTravel.toLocaleString(
                                "id-ID"
                              )}`
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jenis Tiket
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTicket.jenisTicketPulangTravel || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passenger List */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-yellow-900 mb-4">
                    Daftar Penumpang
                  </h4>
                  <div className="space-y-2">
                    {(selectedTicket.passengers || []).map(
                      (passenger, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-12">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              No
                            </label>
                            <p className="text-sm text-gray-900">
                              {passenger.no}
                            </p>
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nama Penumpang
                            </label>
                            <p className="text-sm text-gray-900">
                              {passenger.nama}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                    {(!selectedTicket.passengers ||
                      selectedTicket.passengers.length === 0) && (
                      <p className="text-sm text-gray-500 italic">
                        Tidak ada data penumpang
                      </p>
                    )}
                  </div>
                </div>

                {/* Billing Section */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">
                    Ditagihkan Ke
                  </h4>
                  <div>
                    <p className="text-sm text-gray-900">
                      {selectedTicket.ditagihkanKe || "-"}
                    </p>
                  </div>
                </div>

                {/* Hotel Booking */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-purple-900 mb-4">
                    Pemesanan Hotel
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Check In
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.tanggalCheckIn
                          ? new Date(
                              selectedTicket.tanggalCheckIn
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Check Out
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.tanggalCheckOut
                          ? new Date(
                              selectedTicket.tanggalCheckOut
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jumlah Hari
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.jumlahHari || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lokasi
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.lokasiHotel || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Hotel
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.namaHotel || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Harga Total
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTicket.hargaTotalHotel
                          ? `Rp ${selectedTicket.hargaTotalHotel.toLocaleString(
                              "id-ID"
                            )}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Billing Section - After Hotel */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">
                    Ditagihkan Ke
                  </h4>
                  <div>
                    <p className="text-sm text-gray-900">
                      {selectedTicket.ditagihkanKe || "-"}
                    </p>
                  </div>
                </div>

                {/* Approval Notes Section */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-red-900 mb-4">
                    Catatan Approval
                  </h4>
                  <textarea
                    value={approvalNote}
                    onChange={(e) => setApprovalNote(e.target.value)}
                    rows={3}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                    placeholder="Masukkan catatan untuk approval/rejection..."
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Tutup
              </button>
              {selectedTicket.status === "Submitted" && (
                <>
                  <button
                    onClick={() => handleReject(selectedTicket)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm inline-flex items-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedTicket)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm inline-flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceApprovalTicketDashboard;
