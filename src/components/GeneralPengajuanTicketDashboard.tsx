import React, { useMemo, useState } from "react";
import {
  Clock,
  PlusCircle,
  FileSpreadsheet,
  FileDown,
  Edit,
  Trash2,
  Search,
  Plus,
  Minus,
  Printer,
  Check,
  X,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useAuth } from "../context/AuthContext";

interface PassengerData {
  no: number;
  nama: string;
}

interface TicketRow {
  id: number;
  tanggal: string; // yyyy-mm-dd
  noTicket: string;
  divisi: string;
  pemohon: string;
  jabatan?: string; // baru
  kategori: ("Hotel" | "Travel" | "Pesawat")[];
  prioritas: "Low" | "Medium" | "High" | "Urgent";
  judul: string;
  deskripsi: string;
  status:
    | "Draft"
    | "Submitted"
    | "In Progress"
    | "Approved"
    | "Rejected"
    | "Completed";

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

  // Perjalanan summary (baru)
  estimasiPerjalanan?: number;
  realisasiPerjalanan?: number;

  // Billing Section
  ditagihkanKe?: "Client" | "Perusahaan" | "";

  // Approval Section
  managerTerkait?: string;
  managerFinance?: string;
  direkturOPS?: string;
}

const GeneralPengajuanTicketDashboard: React.FC = () => {
  const today = new Date();
  const auth = useAuth() as any;
  const user = auth?.user as { role?: string } | undefined;
  const isHRD = /HRD/i.test(user?.role || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Tambah Pengajuan Ticket");
  const [editingData, setEditingData] = useState<TicketRow | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<TicketRow | null>(null);

  const [searchNo, setSearchNo] = useState("");
  const [searchPemohon, setSearchPemohon] = useState("");
  const [filterKategori, setFilterKategori] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPrioritas, setFilterPrioritas] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const kategoriOptions = ["Hotel", "Travel", "Pesawat"];
  const prioritasOptions = ["Low", "Medium", "High", "Urgent"];
  const divisiOptions = [
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
  ];

  const [formData, setFormData] = useState<Partial<TicketRow>>({
    tanggal: today.toISOString().split("T")[0],
    noTicket: `TKT-${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}-001`,
    divisi: "",
    pemohon: "",
    jabatan: "",
    kategori: [],
    prioritas: "Medium",
    judul: "",
    deskripsi: "",
    status: "Draft",

    // Form Header Info
    noDokumen: "GBP-HG-FM-23",
    noRevisi: "01",
    tanggalRevisi: today.toISOString().split("T")[0],
    tanggalBerlaku: today.toISOString().split("T")[0],
    halaman: "1 dari 1",

    // Basic Info
    dept: "",
    soTurunan: "",

    // Ticket Booking - Keberangkatan
    tanggalBerangkat: "",
    tujuanBerangkat: "",
    jamBerangkat: "",
    maskapaiBerangkat: "",
    hargaBerangkat: 0,
    jenisTicketBerangkat: "Ekonomi",

    // Ticket Booking - Kepulangan
    tanggalPulang: "",
    tujuanPulang: "",
    jamPulang: "",
    maskapaipulang: "",
    hargaPulang: 0,
    jenisTicketPulang: "Ekonomi",

    // Travel Booking - Keberangkatan
    tanggalBerangkatTravel: "",
    tujuanBerangkatTravel: "",
    jamBerangkatTravel: "",
    namaTravelBerangkat: "",
    hargaBerangkatTravel: 0,
    jenisTicketBerangkatTravel: "Ekonomi",

    // Travel Booking - Kepulangan
    tanggalPulangTravel: "",
    tujuanPulangTravel: "",
    jamPulangTravel: "",
    namaTravelPulang: "",
    hargaPulangTravel: 0,
    jenisTicketPulangTravel: "Ekonomi",

    // Passenger List
    passengers: [{ no: 1, nama: "" }],

    // Hotel Booking
    tanggalCheckIn: "",
    tanggalCheckOut: "",
    lokasiHotel: "",
    namaHotel: "",
    jumlahHari: 0,
    hargaTotalHotel: 0,

    // Perjalanan summary
    estimasiPerjalanan: 0,
    realisasiPerjalanan: 0,

    // Billing Section
    ditagihkanKe: "",

    // Approval Section
    managerTerkait: "",
    managerFinance: "",
    direkturOPS: "",
  });

  const [rows, setRows] = useState<TicketRow[]>([
    {
      id: 1,
      tanggal: "2025-09-20",
      noTicket: "TKT-2025-09-001",
      divisi: "IT",
      pemohon: "Andi Pratama",
      jabatan: "Supervisor",
      kategori: ["Pesawat"],
      prioritas: "High",
      judul: "Pemesanan Tiket Dinas ke Jakarta",
      deskripsi: "Perjalanan dinas untuk meeting dengan client di Jakarta",
      status: "Submitted",
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
      estimasiPerjalanan: 4500000,
      realisasiPerjalanan: 4200000,
      ditagihkanKe: "Client",
    },
    {
      id: 2,
      tanggal: "2025-09-21",
      noTicket: "TKT-2025-09-002",
      divisi: "GA",
      pemohon: "Siti Nurhaliza",
      jabatan: "Staff",
      kategori: ["Hotel"],
      prioritas: "Medium",
      judul: "Perjalanan Dinas ke Bali",
      deskripsi: "Kunjungan ke cabang Bali untuk audit operasional",
      status: "In Progress",
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
      estimasiPerjalanan: 7000000,
      realisasiPerjalanan: 6800000,
      ditagihkanKe: "Perusahaan",
    },
    {
      id: 3,
      tanggal: "2025-09-22",
      noTicket: "TKT-2025-09-003",
      divisi: "Finance",
      pemohon: "Rudi Hermawan",
      jabatan: "Manager",
      kategori: ["Travel"],
      prioritas: "Urgent",
      judul: "Meeting Budget Q4 di Bandung",
      deskripsi:
        "Pertemuan dengan tim finance regional untuk pembahasan budget Q4",
      status: "Approved",
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
      estimasiPerjalanan: 3000000,
      realisasiPerjalanan: 2950000,
      ditagihkanKe: "Client",
    },
    {
      id: 4,
      tanggal: "2025-09-23",
      noTicket: "TKT-2025-09-004",
      divisi: "Marketing",
      pemohon: "Budi Santoso",
      jabatan: "Marketing Lead",
      kategori: ["Hotel", "Pesawat"],
      prioritas: "Medium",
      judul: "Perjalanan Bisnis ke Singapore",
      deskripsi: "Mengikuti pameran dagang di Singapore",
      status: "Approved",
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
      passengers: [{ no: 1, nama: "Budi Santoso" }],
      tanggalCheckIn: "2025-11-01",
      tanggalCheckOut: "2025-11-05",
      lokasiHotel: "Singapore",
      namaHotel: "Marina Bay Sands",
      jumlahHari: 4,
      hargaTotalHotel: 5000000,
      estimasiPerjalanan: 10500000,
      realisasiPerjalanan: 10250000,
      ditagihkanKe: "Perusahaan",
    },
  ]);

  const handleAdd = () => {
    setEditingData(null);
    setModalTitle("Tambah Pengajuan Ticket");
    setFormData({
      tanggal: today.toISOString().split("T")[0],
      noTicket: `TKT-${new Date().getFullYear()}-${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${String(rows.length + 1).padStart(3, "0")}`,
      divisi: "",
      pemohon: "",
      kategori: [],
      prioritas: "Medium",
      judul: "",
      deskripsi: "",
      status: "Draft",

      // Form Header Info
      noDokumen: "GBP-HG-FM-23",
      noRevisi: "01",
      tanggalRevisi: today.toISOString().split("T")[0],
      tanggalBerlaku: today.toISOString().split("T")[0],
      halaman: "1 dari 1",

      // Basic Info
      dept: "",
      soTurunan: "",

      // Ticket Booking - Keberangkatan
      tanggalBerangkat: "",
      tujuanBerangkat: "",
      jamBerangkat: "",
      maskapaiBerangkat: "",
      hargaBerangkat: 0,
      jenisTicketBerangkat: "Ekonomi",

      // Ticket Booking - Kepulangan
      tanggalPulang: "",
      tujuanPulang: "",
      jamPulang: "",
      maskapaipulang: "",
      hargaPulang: 0,
      jenisTicketPulang: "Ekonomi",

      // Travel Booking - Keberangkatan
      tanggalBerangkatTravel: "",
      tujuanBerangkatTravel: "",
      jamBerangkatTravel: "",
      namaTravelBerangkat: "",
      hargaBerangkatTravel: 0,
      jenisTicketBerangkatTravel: "Ekonomi",

      // Travel Booking - Kepulangan
      tanggalPulangTravel: "",
      tujuanPulangTravel: "",
      jamPulangTravel: "",
      namaTravelPulang: "",
      hargaPulangTravel: 0,
      jenisTicketPulangTravel: "Ekonomi",

      // Passenger List
      passengers: [{ no: 1, nama: "" }],

      // Hotel Booking
      tanggalCheckIn: "",
      tanggalCheckOut: "",
      lokasiHotel: "",
      namaHotel: "",
      jumlahHari: 0,
      hargaTotalHotel: 0,

      // Billing Section
      ditagihkanKe: "",

      // Approval Section
      managerTerkait: "",
      managerFinance: "",
      direkturOPS: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (row: TicketRow) => {
    setEditingData(row);
    setFormData(row);
    setModalTitle("Edit Pengajuan Ticket");
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingData) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingData.id
            ? { ...(formData as TicketRow), id: editingData.id }
            : r
        )
      );
    } else {
      const newId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
      setRows((prev) => [{ ...(formData as TicketRow), id: newId }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (row: TicketRow) => {
    setRowToDelete(row);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      setRows((prev) => prev.filter((r) => r.id !== rowToDelete.id));
      setIsConfirmOpen(false);
      setRowToDelete(null);
    }
  };

  // Approve/Reject modal state
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<"approve" | "reject" | null>(null);
  const [decisionRow, setDecisionRow] = useState<TicketRow | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const openApprove = (row: TicketRow) => {
    setDecisionType("approve");
    setDecisionRow(row);
    setRejectNote("");
    setDecisionOpen(true);
  };
  const openReject = (row: TicketRow) => {
    setDecisionType("reject");
    setDecisionRow(row);
    setRejectNote("");
    setDecisionOpen(true);
  };
  const confirmDecision = () => {
    if (!decisionRow || !decisionType) return;
    setRows(prev => prev.map(r => r.id === decisionRow.id ? {
      ...r,
      status: decisionType === "approve" ? "Approved" : "Rejected",
      deskripsi: decisionType === "reject" && rejectNote ? `${r.deskripsi}\nAlasan reject: ${rejectNote}` : r.deskripsi,
    } : r));
    setDecisionOpen(false);
    setDecisionRow(null);
    setDecisionType(null);
    setRejectNote("");
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
        filterKategori.length > 0
          ? r.kategori.some((k) => filterKategori.includes(k))
          : true;
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

  const exportExcel = () => alert("Export Excel belum diimplementasikan");
  const exportPDF = () => alert("Export PDF belum diimplementasikan");

  const generatePDF = (ticket: TicketRow) => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Formulir Pemesanan Tiket/Hotel - ${ticket.noTicket}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .header-table td, .header-table th { border: 1px solid black; padding: 8px; text-align: center; }
        .logo-cell { width: 100px; }
        .title-cell { font-weight: bold; font-size: 16px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .info-table td, .info-table th { border: 1px solid black; padding: 6px; }
        .section-title { background-color: #f0f0f0; font-weight: bold; text-align: center; }
        .label { font-weight: bold; width: 120px; }
        .passenger-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .passenger-table td, .passenger-table th { border: 1px solid black; padding: 6px; text-align: center; }
        .signature-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .signature-table td { border: 1px solid black; padding: 30px; text-align: center; height: 80px; }
        .note { font-style: italic; text-align: center; margin: 10px 0; }
      </style>
    </head>
    <body>
      <!-- Header -->
      <table class="header-table">
        <tr>
          <td rowspan="5" class="logo-cell">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(45deg, #FFD700, #FFA500); display: flex; align-items: center; justify-content: center; margin: 0 auto;">
              <span style="color: white; font-weight: bold; font-size: 14px;">GBP</span>
            </div>
          </td>
          <td class="title-cell">FORMULIR</td>
          <td class="label">No. Dokumen</td>
          <td>${ticket.noDokumen || "GBP-HG-FM-23"}</td>
        </tr>
        <tr>
          <td rowspan="4" class="title-cell">PEMESANAN TIKET/HOTEL</td>
          <td class="label">No. Revisi</td>
          <td>${ticket.noRevisi || "01"}</td>
        </tr>
        <tr>
          <td class="label">Tanggal Revisi</td>
          <td>${
            ticket.tanggalRevisi
              ? new Date(ticket.tanggalRevisi).toLocaleDateString("id-ID")
              : "04 Juni 2021"
          }</td>
        </tr>
        <tr>
          <td class="label">Tanggal Berlaku</td>
          <td>${
            ticket.tanggalBerlaku
              ? new Date(ticket.tanggalBerlaku).toLocaleDateString("id-ID")
              : "04 Juni 2021"
          }</td>
        </tr>
        <tr>
          <td class="label">Halaman</td>
          <td>${ticket.halaman || "1 dari 1"}</td>
        </tr>
      </table>
      
      <!-- Basic Information -->
      <table class="info-table">
        <tr>
          <td class="label">Nama Pemohon</td>
          <td>${ticket.pemohon || "Supardi"}</td>
        </tr>
        <tr>
          <td class="label">Dept.</td>
          <td>${ticket.dept || ticket.divisi || "IT"}</td>
        </tr>
        <tr>
          <td class="label">SO Turunan</td>
          <td>${ticket.soTurunan || "SO00123.342"}</td>
        </tr>
      </table>
      
      <!-- Flight Booking -->
      <table class="info-table">
        <tr>
          <td colspan="4" class="section-title">PEMESANAN TIKET PESAWAT</td>
        </tr>
        <tr>
          <td colspan="2" class="section-title">KEBERANGKATAN</td>
          <td colspan="2" class="section-title">KEPULANGAN</td>
        </tr>
        <tr>
          <td class="label">Tanggal</td>
          <td>${
            ticket.tanggalBerangkat
              ? new Date(ticket.tanggalBerangkat).toLocaleDateString("id-ID")
              : "05-01-2025"
          }</td>
          <td class="label">Tanggal</td>
          <td>${
            ticket.tanggalPulang
              ? new Date(ticket.tanggalPulang).toLocaleDateString("id-ID")
              : "15-01-2025"
          }</td>
        </tr>
        <tr>
          <td class="label">Tujuan</td>
          <td>${ticket.tujuanBerangkat || "Bali"}</td>
          <td class="label">Tujuan</td>
          <td>${ticket.tujuanPulang || "Jakarta"}</td>
        </tr>
        <tr>
          <td class="label">Jam</td>
          <td>${ticket.jamBerangkat || "08.00"}</td>
          <td class="label">Jam</td>
          <td>${ticket.jamPulang || "16.00"}</td>
        </tr>
        <tr>
          <td class="label">Maskapai *</td>
          <td>${ticket.maskapaiBerangkat || "Lion Air"}</td>
          <td class="label">Maskapai *</td>
          <td>${ticket.maskapaipulang || "Batik"}</td>
        </tr>
        <tr>
          <td class="label">Harga *</td>
          <td>Rp. ${
            ticket.hargaBerangkat
              ? ticket.hargaBerangkat.toLocaleString("id-ID")
              : "6.000.000"
          }</td>
          <td class="label">Harga *</td>
          <td>Rp. ${
            ticket.hargaPulang
              ? ticket.hargaPulang.toLocaleString("id-ID")
              : "8.000.000"
          }</td>
        </tr>
        <tr>
          <td class="label">Jenis Tiket *</td>
          <td>${ticket.jenisTicketBerangkat || "Ekonomi"}</td>
          <td class="label">Jenis Tiket *</td>
          <td>${ticket.jenisTicketPulang || "Bisnis"}</td>
        </tr>
      </table>
      
      <!-- Travel Booking -->
      <table class="info-table">
        <tr>
          <td colspan="4" class="section-title">PEMESANAN TIKET TRAVEL</td>
        </tr>
        <tr>
          <td colspan="2" class="section-title">KEBERANGKATAN</td>
          <td colspan="2" class="section-title">KEPULANGAN</td>
        </tr>
        <tr>
          <td class="label">Tanggal</td>
          <td>${
            ticket.tanggalBerangkatTravel
              ? new Date(ticket.tanggalBerangkatTravel).toLocaleDateString(
                  "id-ID"
                )
              : "05-01-2025"
          }</td>
          <td class="label">Tanggal</td>
          <td>${
            ticket.tanggalPulangTravel
              ? new Date(ticket.tanggalPulangTravel).toLocaleDateString("id-ID")
              : "15-01-2025"
          }</td>
        </tr>
        <tr>
          <td class="label">Tujuan</td>
          <td>${ticket.tujuanBerangkatTravel || "Bali"}</td>
          <td class="label">Tujuan</td>
          <td>${ticket.tujuanPulangTravel || "Jakarta"}</td>
        </tr>
        <tr>
          <td class="label">Jam</td>
          <td>${ticket.jamBerangkatTravel || "08.00"}</td>
          <td class="label">Jam</td>
          <td>${ticket.jamPulangTravel || "16.00"}</td>
        </tr>
        <tr>
          <td class="label">Nama Travel *</td>
          <td>${ticket.namaTravelBerangkat || "Travel XYZ"}</td>
          <td class="label">Nama Travel *</td>
          <td>${ticket.namaTravelPulang || "Travel ABC"}</td>
        </tr>
        <tr>
          <td class="label">Harga *</td>
          <td>Rp. ${
            ticket.hargaBerangkatTravel
              ? ticket.hargaBerangkatTravel.toLocaleString("id-ID")
              : "6.000.000"
          }</td>
          <td class="label">Harga *</td>
          <td>Rp. ${
            ticket.hargaPulangTravel
              ? ticket.hargaPulangTravel.toLocaleString("id-ID")
              : "8.000.000"
          }</td>
        </tr>
        <tr>
          <td class="label">Jenis Tiket *</td>
          <td>${ticket.jenisTicketBerangkatTravel || "Ekonomi"}</td>
          <td class="label">Jenis Tiket *</td>
          <td>${ticket.jenisTicketPulangTravel || "Bisnis"}</td>
        </tr>
      </table>
      
      <!-- Passenger List -->
      <table class="passenger-table">
        <tr>
          <td colspan="2" class="section-title">Keterangan</td>
        </tr>
        <tr>
          <th>No</th>
          <th>Nama Orang</th>
        </tr>
        ${(
          ticket.passengers || [
            { no: 1, nama: "Ahmad Kasim" },
            { no: 2, nama: "Budi Santoso" },
            { no: 3, nama: "Citra Lestari" },
            { no: 4, nama: "Dewi Anggraini" },
            { no: 5, nama: "Eko Prasetyo" },
          ]
        )
          .map(
            (passenger) =>
              `<tr><td>${passenger.no}</td><td>${passenger.nama}</td></tr>`
          )
          .join("")}
      </table>
      <p class="note">ditagihkan ke ${
        ticket.ditagihkanKe === "Client"
          ? "client"
          : ticket.ditagihkanKe === "Perusahaan"
          ? "perusahaan"
          : "client"
      }</p>
      
      <!-- Hotel Booking -->
      <table class="info-table">
        <tr>
          <td colspan="4" class="section-title">PEMESANAN HOTEL</td>
        </tr>
        <tr>
          <td class="label">Tanggal Check In</td>
          <td>${
            ticket.tanggalCheckIn
              ? new Date(ticket.tanggalCheckIn).toLocaleDateString("id-ID")
              : "05-01-2025"
          }</td>
          <td class="label">Nama Hotel</td>
          <td>${ticket.namaHotel || "Hotel Citra"}</td>
        </tr>
        <tr>
          <td class="label">Tanggal Checkout</td>
          <td>${
            ticket.tanggalCheckOut
              ? new Date(ticket.tanggalCheckOut).toLocaleDateString("id-ID")
              : "15-01-2025"
          }</td>
          <td class="label">Jumlah Hari *</td>
          <td>${ticket.jumlahHari || "10"}</td>
        </tr>
        <tr>
          <td class="label">Lokasi *</td>
          <td>${ticket.lokasiHotel || "Bali"}</td>
          <td class="label">Harga Total *</td>
          <td>Rp. ${
            ticket.hargaTotalHotel
              ? ticket.hargaTotalHotel.toLocaleString("id-ID")
              : "15.000.000"
          }</td>
        </tr>
      </table>
      <p class="note">ditagihkan ke ${
        ticket.ditagihkanKe === "Client"
          ? "client"
          : ticket.ditagihkanKe === "Perusahaan"
          ? "perusahaan"
          : "client"
      }</p>
      
      <!-- Approval Section -->
      <table class="signature-table">
        <tr>
          <td><strong>Pemohon</strong></td>
          <td><strong>Manager Terkait</strong></td>
          <td><strong>Manager Finance</strong></td>
          <td><strong>Direktur OPS & MKT</strong></td>
        </tr>
      </table>
      
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-700";
      case "Approved":
        return "text-blue-700";
      case "In Progress":
        return "text-yellow-700";
      case "Submitted":
        return "text-purple-700";
      case "Rejected":
        return "text-red-700";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatIDR = (n: number) => `Rp ${Number(n||0).toLocaleString('id-ID')}`;
  const calcDurasi = (row: TicketRow) => {
    const range = (a?: string, b?: string) => (a && b ? Math.max(1, Math.ceil((new Date(b).getTime()-new Date(a).getTime())/(1000*60*60*24))+1) : 0);
    return (
      range(row.tanggalBerangkat, row.tanggalPulang) ||
      range(row.tanggalBerangkatTravel, row.tanggalPulangTravel) ||
      (row.jumlahHari || 0)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Pengajuan Ticket
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  General
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Pengajuan Ticket
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari No Ticket
              </label>
              <input
                type="text"
                value={searchNo}
                onChange={(e) => setSearchNo(e.target.value)}
                placeholder="TKT-..."
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                multiple
                value={filterKategori}
                onChange={(e) => {
                  const options = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setFilterKategori(options);
                }}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">Semua Kategori</option>
                {kategoriOptions.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioritas
              </label>
              <select
                value={filterPrioritas}
                onChange={(e) => setFilterPrioritas(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">Semua Prioritas</option>
                {prioritasOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
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
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">Semua</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
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
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  /* trigger memo */
                }}
                className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]"
              >
                <Search className="h-4 w-4 mr-2" /> Cari Data
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center space-y-3 md:space-y-0 md:space-x-3 mt-2">
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Ticket
            </button>
            <button
              onClick={exportExcel}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 w-full md:w-auto"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button
              onClick={exportPDF}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 w-full md:w-auto"
            >
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Daftar Pengajuan Ticket
          </h3>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jabatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tujuan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durasi (hari)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Nominal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Estimasi Perjalanan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Realisasi Perjalanan</th>
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

                  return (
                    <tr key={row.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.jabatan || '-'}</td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate"
                        title={tujuan}
                      >
                        {tujuan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.kategori.join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calcDurasi(row)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">{formatIDR(nominal)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{row.estimasiPerjalanan ? formatIDR(row.estimasiPerjalanan) : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{row.realisasiPerjalanan ? formatIDR(row.realisasiPerjalanan) : '-'}</td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate"
                        title={row.deskripsi}
                      >
                        {row.deskripsi}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          {isHRD && (
                            <>
                              <button
                                onClick={() => openApprove(row)}
                                className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openReject(row)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEdit(row)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => generatePDF(row)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                            title="Print PDF"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(row)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">{modalTitle}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="p-6 space-y-8">
                {/* Header Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">
                    Informasi Dokumen
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        No Dokumen
                      </label>
                      <input
                        type="text"
                        value={formData.noDokumen || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            noDokumen: e.target.value,
                          }))
                        }
                        placeholder="GBP-HG-FM-23"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        No Revisi
                      </label>
                      <input
                        type="text"
                        value={formData.noRevisi || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            noRevisi: e.target.value,
                          }))
                        }
                        placeholder="01"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Halaman
                      </label>
                      <input
                        type="text"
                        value={formData.halaman || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            halaman: e.target.value,
                          }))
                        }
                        placeholder="1 dari 1"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Revisi
                      </label>
                      <input
                        type="date"
                        value={formData.tanggalRevisi || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tanggalRevisi: e.target.value,
                          }))
                        }
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Berlaku
                      </label>
                      <input
                        type="date"
                        value={formData.tanggalBerlaku || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tanggalBerlaku: e.target.value,
                          }))
                        }
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        No Ticket
                      </label>
                      <input
                        type="text"
                        value={formData.noTicket || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            noTicket: e.target.value,
                          }))
                        }
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal
                      </label>
                      <input
                        type="date"
                        value={formData.tanggal || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tanggal: e.target.value,
                          }))
                        }
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Pemohon
                      </label>
                      <input
                        type="text"
                        value={formData.pemohon || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            pemohon: e.target.value,
                          }))
                        }
                        placeholder="Supardi"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dept
                      </label>
                      <select
                        value={formData.dept || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            dept: e.target.value,
                          }))
                        }
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none"
                      >
                        <option value="">Pilih Departemen</option>
                        {divisiOptions.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SO Turunan
                      </label>
                      <input
                        type="text"
                        value={formData.soTurunan || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            soTurunan: e.target.value,
                          }))
                        }
                        placeholder="SO00123.342"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Ticket Booking Section */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">
                    Pemesanan Tiket Pesawat
                  </h4>

                  {/* Keberangkatan */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-green-800 mb-3">
                      Keberangkatan
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal
                        </label>
                        <input
                          type="date"
                          value={formData.tanggalBerangkat || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tanggalBerangkat: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tujuan
                        </label>
                        <input
                          type="text"
                          value={formData.tujuanBerangkat || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tujuanBerangkat: e.target.value,
                            }))
                          }
                          placeholder="Bali"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jam
                        </label>
                        <input
                          type="time"
                          value={formData.jamBerangkat || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              jamBerangkat: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maskapai
                        </label>
                        <input
                          type="text"
                          value={formData.maskapaiBerangkat || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              maskapaiBerangkat: e.target.value,
                            }))
                          }
                          placeholder="Lion Air"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Harga (Rp)
                        </label>
                        <input
                          type="number"
                          value={formData.hargaBerangkat || 0}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              hargaBerangkat: Number(e.target.value),
                            }))
                          }
                          placeholder="6000000"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jenis Tiket
                        </label>
                        <select
                          value={formData.jenisTicketBerangkat || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              jenisTicketBerangkat: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none"
                        >
                          <option value="Ekonomi">Ekonomi</option>
                          <option value="Bisnis">Bisnis</option>
                          <option value="First Class">First Class</option>
                        </select>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal
                        </label>
                        <input
                          type="date"
                          value={formData.tanggalPulang || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tanggalPulang: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tujuan
                        </label>
                        <input
                          type="text"
                          value={formData.tujuanPulang || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tujuanPulang: e.target.value,
                            }))
                          }
                          placeholder="Jakarta"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jam
                        </label>
                        <input
                          type="time"
                          value={formData.jamPulang || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              jamPulang: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maskapai
                        </label>
                        <input
                          type="text"
                          value={formData.maskapaipulang || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              maskapaipulang: e.target.value,
                            }))
                          }
                          placeholder="Garuda"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Harga (Rp)
                        </label>
                        <input
                          type="number"
                          value={formData.hargaPulang || 0}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              hargaPulang: Number(e.target.value),
                            }))
                          }
                          placeholder="8000000"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jenis Tiket
                        </label>
                        <select
                          value={formData.jenisTicketPulang || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              jenisTicketPulang: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none"
                        >
                          <option value="Ekonomi">Ekonomi</option>
                          <option value="Bisnis">Bisnis</option>
                          <option value="First Class">First Class</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Travel Booking Section */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">
                    Pemesanan Tiket Travel
                  </h4>

                  {/* Keberangkatan Travel */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-blue-800 mb-3">
                      Keberangkatan
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal
                        </label>
                        <input
                          type="date"
                          value={formData.tanggalBerangkatTravel || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tanggalBerangkatTravel: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tujuan
                        </label>
                        <input
                          type="text"
                          value={formData.tujuanBerangkatTravel || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tujuanBerangkatTravel: e.target.value,
                            }))
                          }
                          placeholder="Bali"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jam
                        </label>
                        <input
                          type="time"
                          value={formData.jamBerangkatTravel || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              jamBerangkatTravel: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Travel
                        </label>
                        <input
                          type="text"
                          value={formData.namaTravelBerangkat || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              namaTravelBerangkat: e.target.value,
                            }))
                          }
                          placeholder="Travel XYZ"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Harga (Rp)
                        </label>
                        <input
                          type="number"
                          value={formData.hargaBerangkatTravel || 0}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              hargaBerangkatTravel: Number(e.target.value),
                            }))
                          }
                          placeholder="6000000"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jenis Tiket
                        </label>
                        <select
                          value={formData.jenisTicketBerangkatTravel || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              jenisTicketBerangkatTravel: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none"
                        >
                          <option value="Ekonomi">Ekonomi</option>
                          <option value="Bisnis">Bisnis</option>
                          <option value="First Class">First Class</option>
                        </select>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal
                        </label>
                        <input
                          type="date"
                          value={formData.tanggalPulangTravel || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tanggalPulangTravel: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tujuan
                        </label>
                        <input
                          type="text"
                          value={formData.tujuanPulangTravel || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tujuanPulangTravel: e.target.value,
                            }))
                          }
                          placeholder="Jakarta"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jam
                        </label>
                        <input
                          type="time"
                          value={formData.jamPulangTravel || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              jamPulangTravel: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Travel
                        </label>
                        <input
                          type="text"
                          value={formData.namaTravelPulang || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              namaTravelPulang: e.target.value,
                            }))
                          }
                          placeholder="Travel XYZ"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Harga (Rp)
                        </label>
                        <input
                          type="number"
                          value={formData.hargaPulangTravel || 0}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              hargaPulangTravel: Number(e.target.value),
                            }))
                          }
                          placeholder="8000000"
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jenis Tiket
                        </label>
                        <select
                          value={formData.jenisTicketPulangTravel || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              jenisTicketPulangTravel: e.target.value,
                            }))
                          }
                          className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none"
                        >
                          <option value="Ekonomi">Ekonomi</option>
                          <option value="Bisnis">Bisnis</option>
                          <option value="First Class">First Class</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passenger List */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-yellow-900">
                      Daftar Penumpang
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newPassengers = [...(formData.passengers || [])];
                        newPassengers.push({
                          no: newPassengers.length + 1,
                          nama: "",
                        });
                        setFormData((prev) => ({
                          ...prev,
                          passengers: newPassengers,
                        }));
                      }}
                      className="inline-flex items-center px-3 py-1 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Tambah Penumpang
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(formData.passengers || []).map((passenger, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-16">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            No
                          </label>
                          <input
                            type="number"
                            value={passenger.no}
                            readOnly
                            className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Penumpang
                          </label>
                          <input
                            type="text"
                            value={passenger.nama}
                            onChange={(e) => {
                              const newPassengers = [
                                ...(formData.passengers || []),
                              ];
                              newPassengers[index].nama = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                passengers: newPassengers,
                              }));
                            }}
                            placeholder="Masukkan nama penumpang"
                            className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        {(formData.passengers || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newPassengers = (
                                formData.passengers || []
                              ).filter((_, i) => i !== index);
                              // Renumber passengers
                              newPassengers.forEach((p, i) => (p.no = i + 1));
                              setFormData((prev) => ({
                                ...prev,
                                passengers: newPassengers,
                              }));
                            }}
                            className="mt-6 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing Section - After Passenger List */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">
                    Ditagihkan Ke
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ditagihkanKe"
                          value="Client"
                          checked={formData.ditagihkanKe === "Client"}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              ditagihkanKe: e.target.value as
                                | "Client"
                                | "Perusahaan",
                            }))
                          }
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Client
                        </span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ditagihkanKe"
                          value="Perusahaan"
                          checked={formData.ditagihkanKe === "Perusahaan"}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              ditagihkanKe: e.target.value as
                                | "Client"
                                | "Perusahaan",
                            }))
                          }
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Perusahaan
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Hotel Booking Section */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-purple-900 mb-4">
                    Pemesanan Hotel
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Check In
                      </label>
                      <input
                        type="date"
                        value={formData.tanggalCheckIn || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tanggalCheckIn: e.target.value,
                          }))
                        }
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Check Out
                      </label>
                      <input
                        type="date"
                        value={formData.tanggalCheckOut || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tanggalCheckOut: e.target.value,
                          }))
                        }
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Hari
                      </label>
                      <input
                        type="number"
                        value={formData.jumlahHari || 0}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            jumlahHari: Number(e.target.value),
                          }))
                        }
                        placeholder="10"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi
                      </label>
                      <input
                        type="text"
                        value={formData.lokasiHotel || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            lokasiHotel: e.target.value,
                          }))
                        }
                        placeholder="Bali"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Hotel
                      </label>
                      <input
                        type="text"
                        value={formData.namaHotel || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            namaHotel: e.target.value,
                          }))
                        }
                        placeholder="Hotel Citra"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga Total (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.hargaTotalHotel || 0}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            hargaTotalHotel: Number(e.target.value),
                          }))
                        }
                        placeholder="15000000"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Section */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">
                    Ditagihkan Ke
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ditagihkanKe"
                          value="Client"
                          checked={formData.ditagihkanKe === "Client"}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              ditagihkanKe: e.target.value as
                                | "Client"
                                | "Perusahaan",
                            }))
                          }
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Client
                        </span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ditagihkanKe"
                          value="Perusahaan"
                          checked={formData.ditagihkanKe === "Perusahaan"}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              ditagihkanKe: e.target.value as
                                | "Client"
                                | "Perusahaan",
                            }))
                          }
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Perusahaan
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Approval Section */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-red-900 mb-4">
                    Persetujuan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manager Terkait
                      </label>
                      <input
                        type="text"
                        value={formData.managerTerkait || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            managerTerkait: e.target.value,
                          }))
                        }
                        placeholder="Nama Manager Terkait"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manager Finance
                      </label>
                      <input
                        type="text"
                        value={formData.managerFinance || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            managerFinance: e.target.value,
                          }))
                        }
                        placeholder="Nama Manager Finance"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Direktur OPS & MKT
                      </label>
                      <input
                        type="text"
                        value={formData.direkturOPS || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            direkturOPS: e.target.value,
                          }))
                        }
                        placeholder="Nama Direktur OPS & MKT"
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Tutup
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={rowToDelete?.noTicket}
        message="Apakah Anda yakin ingin menghapus Pengajuan Ticket ini?"
      />
      {/* Approve/Reject Modal (HRD) */}
      {decisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-white flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{decisionType === 'approve' ? 'Konfirmasi Approve' : 'Konfirmasi Reject'}</h3>
              <button className="text-gray-500" onClick={() => setDecisionOpen(false)}>Tutup</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-700">Anda yakin ingin {decisionType === 'approve' ? 'menyetujui' : 'menolak'} ticket {decisionRow?.noTicket} - {decisionRow?.pemohon}?</p>
              {decisionType === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea value={rejectNote} onChange={(e)=>setRejectNote(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Alasan penolakan" />
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end gap-2">
              <button onClick={() => setDecisionOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={confirmDecision} className={`px-4 py-2 text-white rounded-lg text-sm ${decisionType==='approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>{decisionType==='approve' ? 'Approve' : 'Reject'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralPengajuanTicketDashboard;
