import React, { useState, useEffect } from "react";
import termsPdf from "../../Folder/term&condition.pdf";
import PenawaranTwoStepModal, {
  PenawaranTwoStepFormData,
} from "./PenawaranTwoStepModal";
import PenawaranDetailModal from "./PenawaranDetailModal";
import UpdateStatusModal, { UpdateStatusFormData } from "./UpdateStatusModal";
import HistoryPenawaranModal from "./HistoryPenawaranModal";
import { PenawaranDetailData } from "../types";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  Search,
  Plus,
  FileSpreadsheet,
  FileText,
  File,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ChevronDown,
  Calendar,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  Lock,
  Printer,
} from "lucide-react";

interface PenawaranTender {
  id: string;
  no: number;
  noPenawaran: string;
  namaClient: string;
  pic: string;
  namaSales: string;
  jenisPekerjaan: string;
  lokasiKerja: string;
  terakhirUpdate: string;
  statusPenawaran:
    | "Minat"
    | "Register"
    | "Pra-kualifikasi"
    | "Evaluasi"
    | "Tender"
    | "Deal"
    | "Cancel";
  statusDokumen: "Open" | "Close";
  // Fields for new table columns
  judulTender?: string;
  oeHps?: string;
  durasiKontrak?: string;
  masaBerlakuPenawaran?: string;
  tanggalSubmit?: string;
  sow?: string;
}

const PenawaranTenderDashboard: React.FC = () => {
  const [searchNoPenawaran, setSearchNoPenawaran] = useState("");
  const [searchNamaClient, setSearchNamaClient] = useState(""); // Added for new search field
  const [searchPIC, setSearchPIC] = useState(""); // Kept for data, removed from UI
  const [searchSales, setSearchSales] = useState(""); // Kept for data, removed from UI
  const [searchJenisPekerjaan, setSearchJenisPekerjaan] = useState("");
  const [searchLokasiKerja, setSearchLokasiKerja] = useState("");
  const [selectedStatusPenawaran, setSelectedStatusPenawaran] = useState("");
  const [selectedStatusDokumen, setSelectedStatusDokumen] = useState("");
  const [periodeDari, setPeriodeDari] = useState("");
  const [periodeSampai, setPeriodeSampai] = useState("");
  const [statusPenawaranDropdownOpen, setStatusPenawaranDropdownOpen] =
    useState(false);
  const [jenisPekerjaanDropdownOpen, setJenisPekerjaanDropdownOpen] =
    useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedPenawaranForDetail, setSelectedPenawaranForDetail] =
    useState<PenawaranDetailData | null>(null);
  const [selectedItemForStatusUpdate, setSelectedItemForStatusUpdate] =
    useState<{
      id: string;
      namaClient: string;
      statusPenawaran: string;
    } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PenawaranTender | null>(
    null
  );
  const [goToPageInput, setGoToPageInput] = useState<string>("");

  // Sample data
  const [penawaranTender, setPenawaranTender] = useState<PenawaranTender[]>([
    {
      id: "1",
      no: 1,
      noPenawaran: "PNW-001",
      namaClient: "PT Konstruksi Besar",
      pic: "Michael Johnson",
      namaSales: "Rina Sari",
      jenisPekerjaan: "Project Based",
      lokasiKerja: "Jakarta",
      terakhirUpdate: "15-01-2025",
      statusPenawaran: "Minat",
      statusDokumen: "Close",
      judulTender: "Pengadaan Jasa Konstruksi A",
      oeHps: "Rp 1.200.000.000",
      durasiKontrak: "12 bulan",
      masaBerlakuPenawaran: "60 hari",
      tanggalSubmit: "20-01-2025",
      sow: "Pekerjaan konstruksi sipil",
    },
    {
      id: "2",
      no: 2,
      noPenawaran: "PNW-002",
      namaClient: "CV Infrastruktur Jaya",
      pic: "Sarah Wilson",
      namaSales: "Dedi Kurniawan",
      jenisPekerjaan: "On Call",
      lokasiKerja: "Surabaya",
      terakhirUpdate: "14-01-2025",
      statusPenawaran: "Register",
      statusDokumen: "Open",
      judulTender: "Pemeliharaan Jalan Utama",
      oeHps: "Rp 850.000.000",
      durasiKontrak: "6 bulan",
      masaBerlakuPenawaran: "45 hari",
      tanggalSubmit: "18-01-2025",
      sow: "Perbaikan dan pemeliharaan jalan",
    },
    {
      id: "3",
      no: 3,
      noPenawaran: "PNW-003",
      namaClient: "PT Pembangunan Utama",
      pic: "David Brown",
      namaSales: "Lina Maharani",
      jenisPekerjaan: "Maintenance",
      lokasiKerja: "Bandung",
      terakhirUpdate: "13-01-2025",
      statusPenawaran: "Pra-kualifikasi",
      statusDokumen: "Close",
      judulTender: "Jasa Maintenance Pabrik",
      oeHps: "Rp 2.500.000.000",
      durasiKontrak: "24 bulan",
      masaBerlakuPenawaran: "90 hari",
      tanggalSubmit: "25-01-2025",
      sow: "Maintenance mechanical & electrical",
    },
    {
      id: "4",
      no: 4,
      noPenawaran: "PNW-004",
      namaClient: "UD Tender Sukses",
      pic: "Emma Davis",
      namaSales: "Ahmad Rizki",
      jenisPekerjaan: "Project Based",
      lokasiKerja: "Medan",
      terakhirUpdate: "12-01-2025",
      statusPenawaran: "Evaluasi",
      statusDokumen: "Open",
      judulTender: "Pembangunan Gudang Bahan Baku",
      oeHps: "Rp 3.000.000.000",
      durasiKontrak: "10 bulan",
      masaBerlakuPenawaran: "60 hari",
      tanggalSubmit: "22-01-2025",
      sow: "Struktur dan arsitektur",
    },
    {
      id: "5",
      no: 5,
      noPenawaran: "PNW-005",
      namaClient: "PT Proyek Nasional",
      pic: "James Miller",
      namaSales: "Sari Dewi",
      jenisPekerjaan: "On Call",
      lokasiKerja: "Yogyakarta",
      terakhirUpdate: "11-01-2025",
      statusPenawaran: "Tender",
      statusDokumen: "Close",
      judulTender: "Pengadaan Material Baja",
      oeHps: "Rp 600.000.000",
      durasiKontrak: "3 bulan",
      masaBerlakuPenawaran: "30 hari",
      tanggalSubmit: "19-01-2025",
      sow: "Supply & delivery material",
    },
    {
      id: "6",
      no: 6,
      noPenawaran: "PNW-006",
      namaClient: "PT Mega Proyek",
      pic: "Irfan Pratama",
      namaSales: "Budi Santoso",
      jenisPekerjaan: "Project Based",
      lokasiKerja: "Semarang",
      terakhirUpdate: "10-01-2025",
      statusPenawaran: "Deal",
      statusDokumen: "Open",
      judulTender: "Instalasi Pipa Industri",
      oeHps: "Rp 1.800.000.000",
      durasiKontrak: "8 bulan",
      masaBerlakuPenawaran: "60 hari",
      tanggalSubmit: "17-01-2025",
      sow: "Pengelasan dan instalasi pipa",
    },
    {
      id: "7",
      no: 7,
      noPenawaran: "PNW-007",
      namaClient: "CV Nusantara Abadi",
      pic: "Siti Aminah",
      namaSales: "Dedi Kurniawan",
      jenisPekerjaan: "Maintenance",
      lokasiKerja: "Malang",
      terakhirUpdate: "09-01-2025",
      statusPenawaran: "Cancel",
      statusDokumen: "Close",
      judulTender: "Perawatan Mesin Produksi",
      oeHps: "Rp 400.000.000",
      durasiKontrak: "4 bulan",
      masaBerlakuPenawaran: "30 hari",
      tanggalSubmit: "16-01-2025",
      sow: "Preventive & corrective maintenance",
    },
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddPenawaran = (formData: PenawaranTwoStepFormData) => {
    const newPenawaran: PenawaranTender = {
      id: (penawaranTender.length + 1).toString(),
      no: penawaranTender.length + 1,
      noPenawaran: formData.noPenawaran,
      namaClient: formData.namaCustomer,
      pic: formData.nama,
      namaSales: formData.namaSales,
      jenisPekerjaan: formData.jenisPekerjaan,
      lokasiKerja: formData.alamat, // Using alamat as a placeholder for lokasiKerja
      terakhirUpdate: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      statusPenawaran: "Minat" as
        | "Minat"
        | "Register"
        | "Pra-kualifikasi"
        | "Evaluasi"
        | "Tender"
        | "Deal"
        | "Cancel",
      statusDokumen: "Open" as "Open" | "Close",
    };

    setPenawaranTender((prev) => [
      newPenawaran,
      ...prev.map((p) => ({ ...p, no: p.no + 1 })),
    ]);
  };

  const handleViewDetail = (item: PenawaranTender) => {
    const detailData: PenawaranDetailData = {
      kategoriPajak: "Pajak Barang Mewah",
      noRefReq: "REG2025112",
      kodeCustomer: "CUST01",
      namaCustomer: item.namaClient,
      pajak: "PPN (10%)",
      noPenawaran: item.noPenawaran,
      tanggalPenawaran: "01/12/2024",
      tanggalPenawaranEnd: "15/01/2025",
      tanggalKirim: "03/01/2025",
      tanggalKirimEnd: "15/01/2025",
      statusDok: "Status 1",
      namaDivisi: "Welding",
      jenisPenawaran: "Pilih Jenis Penawaran",
      kodeBarang: "BA-001",
      statusSO: "Pilih Status SO",
      statusPenawaran: item.statusPenawaran,
      jenisPekerjaan: item.jenisPekerjaan,
      statusKOM: "Open",
    };

    setSelectedPenawaranForDetail(detailData);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = (item: PenawaranTender) => {
    setSelectedItemForStatusUpdate({
      id: item.id,
      namaClient: item.namaClient,
      statusPenawaran: item.statusPenawaran,
    });
    setIsUpdateStatusModalOpen(true);
  };

  const handleSaveStatusUpdate = (formData: UpdateStatusFormData) => {
    if (selectedItemForStatusUpdate) {
      setPenawaranTender((prev) =>
        prev.map((item) =>
          item.id === selectedItemForStatusUpdate.id
            ? {
                ...item,
                statusPenawaran: formData.status as
                  | "Minat"
                  | "Register"
                  | "Pra-kualifikasi"
                  | "Evaluasi"
                  | "Tender"
                  | "Deal"
                  | "Cancel",
              }
            : item
        )
      );
    }
    setSelectedItemForStatusUpdate(null);
  };

  const handleDeleteClick = (item: PenawaranTender) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setPenawaranTender((prev) =>
        prev.filter((p) => p.id !== itemToDelete.id)
      );
      setItemToDelete(null);
    }
  };

  const handleExportPDF = () => {
    const link = document.createElement("a");
    link.href = termsPdf;
    link.setAttribute("download", "term&condition.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getStatusPenawaranColor = (status: string) => {
    switch (status) {
      case "Minat":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Register":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Pra-kualifikasi":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Evaluasi":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Tender":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Deal":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancel":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "Minat":
        return "bg-blue-500";
      case "Register":
        return "bg-indigo-500";
      case "Pra-kualifikasi":
        return "bg-amber-500";
      case "Evaluasi":
        return "bg-yellow-500";
      case "Tender":
        return "bg-purple-500";
      case "Deal":
        return "bg-green-500";
      case "Cancel":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusDokumenColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800 border-green-200";
      case "Close":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const statusPenawaranOptions = [
    "Minat",
    "Register",
    "Pra-kualifikasi",
    "Evaluasi",
    "Tender",
    "Deal",
    "Cancel",
  ];
  const jenisPekerjaanOptions = ["On Call", "Project Based", "Maintenance"];

  // Filter data based on search criteria
  const filteredData = penawaranTender.filter((item) => {
    const matchesNoPenawaran = item.noPenawaran
      .toLowerCase()
      .includes(searchNoPenawaran.toLowerCase());
    const matchesNamaClient = item.namaClient
      .toLowerCase()
      .includes(searchNamaClient.toLowerCase());
    // Removed searchPIC and searchSales from UI, so removing from filter logic as well for consistency
    const matchesJenisPekerjaan = searchJenisPekerjaan
      ? item.jenisPekerjaan === searchJenisPekerjaan
      : true;
    const matchesLokasiKerja = item.lokasiKerja
      .toLowerCase()
      .includes(searchLokasiKerja.toLowerCase());
    const matchesStatusPenawaran = selectedStatusPenawaran
      ? item.statusPenawaran === selectedStatusPenawaran
      : true;

    // Date filtering logic
    const itemDate = new Date(
      item.terakhirUpdate.split("-").reverse().join("-")
    ); // Convert DD-MM-YYYY to YYYY-MM-DD
    const fromDate = periodeDari ? new Date(periodeDari) : null;
    const toDate = periodeSampai ? new Date(periodeSampai) : null;

    const matchesDate =
      (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);

    return (
      matchesNoPenawaran &&
      matchesNamaClient &&
      matchesJenisPekerjaan &&
      matchesLokasiKerja &&
      matchesStatusPenawaran &&
      matchesDate
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (totalPages === 0) return;
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleGoToPage = () => {
    if (!goToPageInput) return;
    const parsed = parseInt(goToPageInput, 10);
    if (!isNaN(parsed)) {
      handlePageChange(parsed);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Monitoring Tender
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Marketing
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Penawaran
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Monitoring Tender
                </span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Cari No Penawaran */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari No Penawaran
              </label>
              <input
                type="text"
                value={searchNoPenawaran}
                onChange={(e) => setSearchNoPenawaran(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                placeholder="Cari No Penawaran..."
              />
            </div>

            {/* Cari Nama Client (NEW) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Nama Client
              </label>
              <input
                type="text"
                value={searchNamaClient}
                onChange={(e) => setSearchNamaClient(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                placeholder="Cari Nama Client..."
              />
            </div>

            {/* Cari Jenis Pekerjaan Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Jenis Pekerjaan
              </label>
              <div className="relative">
                <button
                  onClick={() =>
                    setJenisPekerjaanDropdownOpen(!jenisPekerjaanDropdownOpen)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-xs"
                >
                  <span
                    className={
                      searchJenisPekerjaan ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {searchJenisPekerjaan || "Cari Jenis Pekerjaan..."}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      jenisPekerjaanDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {jenisPekerjaanDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSearchJenisPekerjaan("");
                        setJenisPekerjaanDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-xs"
                    >
                      Semua Jenis Pekerjaan
                    </button>
                    {jenisPekerjaanOptions.map((jenis) => (
                      <button
                        key={jenis}
                        onClick={() => {
                          setSearchJenisPekerjaan(jenis);
                          setJenisPekerjaanDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-xs"
                      >
                        {jenis}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cari Lokasi Kerja */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Lokasi Kerja
              </label>
              <input
                type="text"
                value={searchLokasiKerja}
                onChange={(e) => setSearchLokasiKerja(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                placeholder="Cari Lokasi Kerja..."
              />
            </div>

            {/* Status Penawaran Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Pilih Status Penawaran
              </label>
              <div className="relative">
                <button
                  onClick={() =>
                    setStatusPenawaranDropdownOpen(!statusPenawaranDropdownOpen)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-xs"
                >
                  <span
                    className={
                      selectedStatusPenawaran
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    {selectedStatusPenawaran || "Pilih status penawaran..."}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      statusPenawaranDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {statusPenawaranDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedStatusPenawaran("");
                        setStatusPenawaranDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-xs"
                    >
                      Semua Status
                    </button>
                    {statusPenawaranOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatusPenawaran(status);
                          setStatusPenawaranDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2 text-xs"
                      >
                        <span
                          className={`w-3 h-3 rounded-full ${getStatusDotColor(
                            status
                          )}`}
                        ></span>
                        <span>{status}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Periode Dari */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode Dari
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={periodeDari}
                  onChange={(e) => setPeriodeDari(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Sampai */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode Sampai
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={periodeSampai}
                  onChange={(e) => setPeriodeSampai(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cari Data Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center justify-center space-x-2 text-xs"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-2 text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Monitoring Tender</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-xs">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-2 text-xs">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">No</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Judul Tender</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">No Tender</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Nama Perusahaan</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">OE/HPS</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Durasi Kontrak</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Masa berlaku penawaran</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Tanggal Submit</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">SOW</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Status</th>
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    } ${
                      animateRows
                        ? "animate-in fade-in slide-in-from-bottom-2"
                        : "opacity-0"
                    }`}
                    style={{
                      animationDelay: animateRows ? `${index * 100}ms` : "0ms",
                      animationFillMode: "forwards",
                    }}
                  >
                    <td className="px-2 py-1 text-gray-900">{startIndex + index + 1}</td>
                    <td className="px-2 py-1 font-medium text-gray-900">{item.judulTender || "-"}</td>
                    <td className="px-2 py-1 font-medium text-gray-900">{item.noPenawaran}</td>
                    <td className="px-2 py-1 font-medium text-gray-900">{item.namaClient}</td>
                    <td className="px-2 py-1 text-gray-600">{item.oeHps || "-"}</td>
                    <td className="px-2 py-1 text-gray-600">{item.durasiKontrak || "-"}</td>
                    <td className="px-2 py-1 text-gray-600">{item.masaBerlakuPenawaran || "-"}</td>
                    <td className="px-2 py-1 text-gray-600">{item.tanggalSubmit || "-"}</td>
                    <td className="px-2 py-1 text-gray-600">{item.sow || "-"}</td>
                    <td className="px-2 py-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusPenawaranColor(
                          item.statusPenawaran
                        )}`}
                      >
                        {item.statusPenawaran}
                      </span>
                    </td>
                    <td className="px-2 py-1">
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <button
                          onClick={() => handleViewDetail(item)}
                          className="text-yellow-700 hover:underline"
                        >
                          View
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={handleExportPDF}
                          className="text-purple-700 hover:underline"
                        >
                          Print
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleUpdateStatus(item)}
                          className="text-gray-700 hover:underline"
                        >
                          Update Status
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => setIsHistoryModalOpen(true)}
                          className="text-teal-700 hover:underline"
                        >
                          History
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="text-blue-700 hover:underline"
                        >
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-700 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination/Footer - unified with Sales Order */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Left: info and rows per page */}
              <div className="flex items-center flex-wrap gap-2 text-xs text-gray-700">
                <span>
                  Showing {filteredData.length === 0 ? 0 : startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredData.length)} of{" "}
                  {filteredData.length} entries
                </span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <label className="flex items-center gap-2">
                  <span className="text-gray-600">Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                    className="px-2 py-1 border border-gray-200 rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </label>
              </div>

              {/* Center: pagination controls */}
              <div className="flex items-center justify-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || totalPages === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || totalPages === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow shadow-blue-600/20"
                          : "text-gray-700 hover:bg-white hover:text-blue-600"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>

              {/* Right: go to page */}
              <div className="flex items-center justify-end gap-2 text-xs">
                <span className="text-gray-600">Go to page:</span>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, totalPages)}
                  value={goToPageInput}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleGoToPage();
                    }
                  }}
                  className="w-16 px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleGoToPage}
                  className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs disabled:opacity-50"
                  disabled={totalPages === 0}
                >
                  Go
                </button>
                <span className="text-gray-500">
                  / {Math.max(1, totalPages)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Penawaran Modal */}
      <PenawaranTwoStepModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPenawaran}
        type="tender"
      />

      {/* Penawaran Detail Modal */}
      <PenawaranDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        penawaranData={selectedPenawaranForDetail}
      />

      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={isUpdateStatusModalOpen}
        onClose={() => setIsUpdateStatusModalOpen(false)}
        onSave={handleSaveStatusUpdate}
        currentItem={selectedItemForStatusUpdate}
      />

      {/* History Penawaran Modal */}
      <HistoryPenawaranModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaClient}
      />
    </div>
  );
};

export default PenawaranTenderDashboard;
