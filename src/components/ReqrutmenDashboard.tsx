import React, { useState, useEffect } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import UpdateStatusModal from "./UpdateStatusModal"; // Import the new modal
import TambahRekrutmenModal from "./TambahRekrutmenModal";
import {
  Search,
  FileSpreadsheet,
  FileText,
  File,
  Edit,
  Trash2,
  Eye,
  Plus, // Added Plus icon
  Mail,
  Calendar,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ChevronDown,
  Download,
  Paperclip,
} from "lucide-react";
// Removed unused LamaranData/UpdateStatusFormData import to align with UpdateStatusModal props

// Updated ReqrutmenData interface to be compatible with LamaranData for the modal
interface ReqrutmenData {
  id: string;
  no: number;
  namaPelamar: string;
  email: string;
  posisi?: string;
  fileName?: string;
  fileUrl?: string;
  status:
    | "Pending"
    | "Accepted"
    | "Rejected"
    | "Interview"
    | "Hired"
    | "Negotiation"
    | "Move to Bank Data"; // Extended per filter needs
  keterangan: string; // Added for modal compatibility
}

const ReqrutmenDashboard: React.FC = () => {
  const [searchNamaPelamar, setSearchNamaPelamar] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedNama, setSelectedNama] = useState("");
  const [namaDropdownOpen, setNamaDropdownOpen] = useState(false);
  const [selectedHasilInterview, setSelectedHasilInterview] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ReqrutmenData | null>(null);
  const [sortField, setSortField] = useState<keyof ReqrutmenData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isTambahOpen, setIsTambahOpen] = useState(false);

  // State for Update Status Modal
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [
    selectedReqrutmenForStatusUpdate,
    setSelectedReqrutmenForStatusUpdate,
  ] = useState<ReqrutmenData | null>(null);
  const [isEditableMode, setIsEditableMode] = useState(false); // To control editable/disabled inputs

  // Sample data matching the image, now with updated status and keterangan
  const [reqrutmenData, setReqrutmenData] = useState<ReqrutmenData[]>([
    {
      id: "1",
      no: 1,
      namaPelamar: "Farid Maulana",
      email: "farid.maulana@email.com",
      posisi: "Staff HR",
      status: "Pending",
      keterangan: "Menunggu review HRD.",
    },
    {
      id: "2",
      no: 2,
      namaPelamar: "Rahmat Hidayat",
      email: "rahmat.hidayat@email.com",
      posisi: "Teknisi",
      status: "Accepted",
      keterangan: "Lolos seleksi administrasi, menunggu jadwal interview.",
    },
    {
      id: "3",
      no: 3,
      namaPelamar: "Fauzan Alfarizi",
      email: "fauzan.alfarizi@email.com",
      posisi: "Operator",
      status: "Rejected",
      keterangan: "Kualifikasi tidak sesuai.",
    },
    {
      id: "4",
      no: 4,
      namaPelamar: "Andini Pratiwi",
      email: "andini.pratiwi@email.com",
      posisi: "Admin",
      status: "Interview",
      keterangan: "Jadwal interview tanggal 10 April 2025.",
    },
    {
      id: "5",
      no: 5,
      namaPelamar: "Joko Santoso",
      email: "joko.santoso@email.com",
      posisi: "Supervisor",
      status: "Hired",
      keterangan: "Telah diterima dan mulai bekerja.",
    },
    {
      id: "6",
      no: 6,
      namaPelamar: "Siti Aisyah",
      email: "siti.aisyah@email.com",
      posisi: "QC",
      status: "Accepted",
      keterangan: "Lolos seleksi administrasi, menunggu jadwal interview.",
    },
  ]);

  // Updated status options (includes Negotiation & Move to Bank Data as requested)
  const statusOptions: Array<ReqrutmenData["status"]> = [
    "Pending",
    "Accepted",
    "Rejected",
    "Interview",
    "Hired",
    "Negotiation",
    "Move to Bank Data",
  ];

  // Nama options from current dataset
  const namaOptions = Array.from(
    new Set(reqrutmenData.map((d) => d.namaPelamar))
  );

  // Hasil interview options
  const hasilInterviewOptions = ["Result", "Kualifikasi", "Lainnya"];

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof ReqrutmenData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Helpers to render Hasil Interview badges
  const getInterviewResult = (status: ReqrutmenData["status"]) => {
    switch (status) {
      case "Accepted":
        return { label: "Lolos", cls: "bg-green-100 text-green-800" };
      case "Rejected":
        return { label: "Tidak Lolos", cls: "bg-red-100 text-red-800" };
      case "Interview":
        return { label: "Proses Interview", cls: "bg-blue-100 text-blue-800" };
      case "Hired":
        return { label: "Diterima", cls: "bg-purple-100 text-purple-800" };
      case "Negotiation":
        return { label: "Negosiasi", cls: "bg-orange-100 text-orange-800" };
      case "Move to Bank Data":
        return { label: "Bank Data", cls: "bg-gray-100 text-gray-800" };
      case "Pending":
      default:
        return { label: "Pending", cls: "bg-yellow-100 text-yellow-800" };
    }
  };

  const getInterviewQualification = (keterangan: string) => {
    if (/kualifikasi/i.test(keterangan)) {
      if (/sesuai|lulus|baik/i.test(keterangan)) {
        return {
          label: "Kualifikasi: Sesuai",
          cls: "bg-green-50 text-green-700 border border-green-200",
        };
      }
      if (/tidak|kurang/i.test(keterangan)) {
        return {
          label: "Kualifikasi: Kurang",
          cls: "bg-red-50 text-red-700 border border-red-200",
        };
      }
      return {
        label: "Kualifikasi: Ada catatan",
        cls: "bg-amber-50 text-amber-700 border border-amber-200",
      };
    }
    return {
      label: "Kualifikasi: -",
      cls: "bg-gray-50 text-gray-700 border border-gray-200",
    };
  };

  const handleDeleteClick = (item: ReqrutmenData) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setReqrutmenData((prev) => prev.filter((r) => r.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const getStatusColor = (status: ReqrutmenData["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Accepted":
        return "bg-green-600 text-white";
      case "Rejected":
        return "bg-red-600 text-white";
      case "Interview":
        return "bg-blue-500 text-white";
      case "Hired":
        return "bg-purple-500 text-white";
      case "Negotiation":
        return "bg-orange-500 text-white";
      case "Move to Bank Data":
        return "bg-gray-600 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter data based on search criteria
  const filteredData = reqrutmenData.filter((item) => {
    const matchesNamaPelamar = item.namaPelamar
      .toLowerCase()
      .includes(searchNamaPelamar.toLowerCase());
    const matchesStatus = selectedStatus
      ? item.status === selectedStatus
      : true;
    const matchesNamaDropdown = selectedNama
      ? item.namaPelamar === selectedNama
      : true;
    const matchesHasilInterview = selectedHasilInterview
      ? selectedHasilInterview === "Result"
        ? /lolos|gagal|pending|interview|hire|accept|reject/i.test(
            item.keterangan || ""
          )
        : selectedHasilInterview === "Kualifikasi"
        ? /kualifikasi/i.test(item.keterangan)
        : (item.keterangan || "").length > 0
      : true;

    return (
      matchesNamaPelamar &&
      matchesStatus &&
      matchesNamaDropdown &&
      matchesHasilInterview
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField] as any;
    const bValue = b[sortField] as any;

    // Numeric compare for 'no'
    if (sortField === "no") {
      const aNum = typeof aValue === "number" ? aValue : parseFloat(aValue ?? 0);
      const bNum = typeof bValue === "number" ? bValue : parseFloat(bValue ?? 0);
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
    }

    // String compare for others, safe for undefined
    const aStr = (aValue ?? "").toString().toLowerCase();
    const bStr = (bValue ?? "").toString().toLowerCase();
    const cmp = aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: "base" });
    return sortDirection === "asc" ? cmp : -cmp;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleSendEmail = (email: string) => {
    window.open(`mailto:${email}`, "_blank");
  };

  const handleTambahSave = (data: {
    namaPelamar: string;
    email: string;
    posisi: string;
    fileName?: string;
    fileUrl?: string;
  }) => {
    setReqrutmenData((prev) => {
      const nextNo = prev.length > 0 ? Math.max(...prev.map((p) => p.no)) + 1 : 1;
      const newItem: ReqrutmenData = {
        id: Date.now().toString(),
        no: nextNo,
        namaPelamar: data.namaPelamar,
        email: data.email,
        posisi: data.posisi,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        status: "Pending",
        keterangan: "-",
      };
      return [newItem, ...prev];
    });
    setIsTambahOpen(false);
  };

  // --- Update Status Modal Handlers ---
  const handleOpenUpdateStatusModal = (
    item: ReqrutmenData,
    editable: boolean
  ) => {
    setSelectedReqrutmenForStatusUpdate(item);
    setIsEditableMode(editable);
    setIsUpdateStatusModalOpen(true);
  };

  const handleCloseUpdateStatusModal = () => {
    setIsUpdateStatusModalOpen(false);
    setSelectedReqrutmenForStatusUpdate(null);
    setIsEditableMode(false);
  };

  const handleSaveStatus = (id: string, data: any) => {
    setReqrutmenData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: data.status, keterangan: data.keterangan }
          : item
      )
    );
    console.log(
      `Reqrutmen ID ${id} updated to status: ${data.status}, keterangan: ${data.keterangan}`
    );
    handleCloseUpdateStatusModal();
  };
  // --- End Update Status Modal Handlers ---

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            LIST REKRUTMEN
          </h1>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Search Inputs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Search Nama Pelamar */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Pelamar
                </label>
                <div className="flex space-x-2">
                  <select
                    value={searchNamaPelamar}
                    onChange={(e) => setSearchNamaPelamar(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />

                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Status
                </label>
                <div className="relative">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-sm"
                  >
                    <span
                      className={
                        selectedStatus ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {selectedStatus || "--Pilih Status--"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                        statusDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {statusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setSelectedStatus("");
                          setStatusDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-sm"
                      >
                        --Pilih Status--
                      </button>
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatus(status);
                            setStatusDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Export & Tambah Buttons */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <button
                onClick={() => setIsTambahOpen(true)}
                className="inline-flex items-center space-x-2 rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-cyan-700"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
                <File className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Show entries control */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("no")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No</span>
                      {sortField === "no" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("namaPelamar")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Pelamar</span>
                      {sortField === "namaPelamar" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("posisi" as keyof ReqrutmenData)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Posisi</span>
                      {sortField === ("posisi" as keyof ReqrutmenData) && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      {sortField === "email" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Interview
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Hasil Interview
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    File
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortField === "status" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
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
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.no}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.namaPelamar}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.posisi || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.email}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSendEmail(item.email)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                      >
                        <Mail className="h-3 w-3" />
                        <span>Send Email</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {(() => {
                          const r = getInterviewResult(item.status);
                          return (
                            <span
                              className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${r.cls}`}
                            >
                              Result: {r.label}
                            </span>
                          );
                        })()}
                        {(() => {
                          const q = getInterviewQualification(
                            item.keterangan || ""
                          );
                          return (
                            <span
                              className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${q.cls}`}
                            >
                              {q.label}
                            </span>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.fileUrl ? (
                        <a
                          href={item.fileUrl}
                          download={item.fileName || true}
                          className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          title="File belum diupload"
                          className="inline-flex items-center gap-1 rounded bg-gray-300 px-3 py-1 text-xs font-medium text-white cursor-not-allowed"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() =>
                            handleOpenUpdateStatusModal(item, true)
                          } // Plus icon for editable
                          className="p-1.5 bg-blue-600 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-blue-700"
                          title="Update Status (Edit)"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() =>
                            handleOpenUpdateStatusModal(item, false)
                          } // Eye icon for view-only
                          className="p-1.5 bg-gray-600 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-gray-700"
                          title="View Status"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredData.length)} of{" "}
                {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <button
                  onClick={() => handlePageChange(1)}
                  className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                    currentPage === 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  1
                </button>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaPelamar}
      />

      {/* Tambah Rekrutmen Modal */}
      <TambahRekrutmenModal
        isOpen={isTambahOpen}
        onClose={() => setIsTambahOpen(false)}
        onSave={handleTambahSave}
      />

      {/* Update Status Modal (align with its prop signature) */}
      <UpdateStatusModal
        isOpen={isUpdateStatusModalOpen}
        onClose={handleCloseUpdateStatusModal}
        onSave={(data) => {
          if (selectedReqrutmenForStatusUpdate) {
            handleSaveStatus(selectedReqrutmenForStatusUpdate.id, data as any);
          }
        }}
        currentItem={{
          id: selectedReqrutmenForStatusUpdate?.id || "",
          namaClient: selectedReqrutmenForStatusUpdate?.namaPelamar || "",
          // Map current status to the modal's expected field name
          statusPenawaran: "Minat",
        }}
      />
    </div>
  );
};

export default ReqrutmenDashboard;
