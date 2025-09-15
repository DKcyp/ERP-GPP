import React, { useState, useEffect } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ApprovalResignModal from "./ApprovalResignModal"; // Import the new modal
import {
  Search,
  FileSpreadsheet,
  FileText,
  File,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ChevronDown,
} from "lucide-react";

interface ResignData {
  id: string;
  no: number;
  nik: string;
  namaPegawai: string;
  kelurahan: string;
  tanggalResign: string;
  status: "Pending" | "Approved" | "Rejected";
  attachmentSuratResignName?: string;
  attachmentBAName?: string;
  attachmentECName?: string;
  divisionApproval?: string;
}

const ResignDashboard: React.FC = () => {
  const [searchNamaPegawai, setSearchNamaPegawai] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("03/03/2025");
  const [dateTo, setDateTo] = useState("03/03/2025");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ResignData | null>(null);
  const [sortField, setSortField] = useState<keyof ResignData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // State for Approval Resign Modal
  const [isApprovalResignModalOpen, setIsApprovalResignModalOpen] =
    useState(false);
  const [selectedResignForApproval, setSelectedResignForApproval] =
    useState<ResignData | null>(null);

  // Sample data matching the image
  const [resignData, setResignData] = useState<ResignData[]>([
    {
      id: "1",
      no: 1,
      nik: "1234567890",
      namaPegawai: "Ahmad Fauzi",
      kelurahan: "Kelurahan Sukamaju",
      tanggalResign: "2024-08-15",
      status: "Pending",
    },
    {
      id: "2",
      no: 2,
      nik: "0987654321",
      namaPegawai: "Siti Nurhaliza",
      kelurahan: "Kelurahan Cempaka",
      tanggalResign: "2024-07-20",
      status: "Approved",
    },
    {
      id: "3",
      no: 3,
      nik: "1122334455",
      namaPegawai: "Budi Santoso",
      kelurahan: "Kelurahan Melati",
      tanggalResign: "2024-09-01",
      status: "Rejected",
    },
    {
      id: "4",
      no: 4,
      nik: "5566778899",
      namaPegawai: "Desi Ananda",
      kelurahan: "Kelurahan Anggrek",
      tanggalResign: "2024-08-05",
      status: "Pending",
    },
    {
      id: "5",
      no: 5,
      nik: "6677889900",
      namaPegawai: "Rina Kurnia",
      kelurahan: "Kelurahan Mawar",
      tanggalResign: "2024-07-30",
      status: "Approved",
    },
  ]);

  const statusOptions = ["Pending", "Approved", "Rejected"];

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof ResignData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteClick = (resign: ResignData) => {
    setItemToDelete(resign);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setResignData((prev) => prev.filter((r) => r.id !== itemToDelete.id));
      setItemToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Approved":
        return "bg-green-600 text-white";
      case "Rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter data based on search criteria
  const filteredData = resignData.filter((item) => {
    const matchesNamaPegawai = item.namaPegawai
      .toLowerCase()
      .includes(searchNamaPegawai.toLowerCase());
    const matchesStatus = selectedStatus
      ? item.status === selectedStatus
      : true;

    return matchesNamaPegawai && matchesStatus;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
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

  // --- Approval Resign Modal Handlers ---
  const handleOpenApprovalResignModal = (item: ResignData) => {
    setSelectedResignForApproval(item);
    setIsApprovalResignModalOpen(true);
  };

  const handleCloseApprovalResignModal = () => {
    setIsApprovalResignModalOpen(false);
    setSelectedResignForApproval(null);
  };

  const handleConfirmApproval = (
    id: string,
    approvalDetails: {
      alasanResign: string;
      lampiranSurat: File[];
      lampiranBA?: File[];
      lampiranEC?: File[];
      divisionApproval: string;
    }
  ) => {
    setResignData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Approved" as const,
              attachmentSuratResignName:
                approvalDetails.lampiranSurat &&
                approvalDetails.lampiranSurat[0]
                  ? approvalDetails.lampiranSurat[0].name
                  : item.attachmentSuratResignName,
              attachmentBAName:
                approvalDetails.lampiranBA && approvalDetails.lampiranBA[0]
                  ? approvalDetails.lampiranBA[0].name
                  : item.attachmentBAName,
              attachmentECName:
                approvalDetails.lampiranEC && approvalDetails.lampiranEC[0]
                  ? approvalDetails.lampiranEC[0].name
                  : item.attachmentECName,
              divisionApproval: approvalDetails.divisionApproval || item.divisionApproval,
            }
          : item
      )
    );
    // Here you would typically send approvalDetails (alasanResign, lampiranSurat) to your backend
    console.log(
      `Resign ID ${id} approved with reason: ${
        approvalDetails.alasanResign
      }, surat: ${approvalDetails.lampiranSurat
        .map((f) => f.name)
        .join(", ")}, BA: ${(approvalDetails.lampiranBA || [])
        .map((f) => f.name)
        .join(", ")}`
    );
    handleCloseApprovalResignModal();
  };
  // --- End Approval Resign Modal Handlers ---

  const handleReject = (id: string) => {
    setResignData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Rejected" as const } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Resign</h1>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Search Inputs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Search Nama Pegawai */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Pegawai
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaPegawai}
                    onChange={(e) => setSearchNamaPegawai(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Agus"
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

            {/* Date Range and Search Button Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="03/03/2025"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="text"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="03/03/2025"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 opacity-0">
                  Search
                </label>
                <button
                  onClick={handleSearch}
                  className="w-full px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end space-x-2 mb-6">
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
                    onClick={() => handleSort("nik")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>NIK</span>
                      {sortField === "nik" && (
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
                    onClick={() => handleSort("namaPegawai")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Pegawai</span>
                      {sortField === "namaPegawai" && (
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
                    onClick={() => handleSort("kelurahan")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Kelurahan</span>
                      {sortField === "kelurahan" && (
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
                    onClick={() => handleSort("tanggalResign")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal Resign</span>
                      {sortField === "tanggalResign" && (
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Divisi Approval</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Surat Resign
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">EC</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Aksi
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
                      {item.nik}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.namaPegawai}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.kelurahan}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.tanggalResign}
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
                    <td className="px-4 py-3 text-sm text-gray-900">{item.divisionApproval || '-'}</td>
                    <td className="px-4 py-3 text-sm text-blue-600">
                      {item.attachmentSuratResignName ? (
                        <span
                          className="underline cursor-pointer"
                          title={item.attachmentSuratResignName}
                        >
                          {item.attachmentSuratResignName}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600">
                      {item.attachmentECName ? (
                        <span className="underline cursor-pointer" title={item.attachmentECName}>
                          {item.attachmentECName}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenApprovalResignModal(item)} // Open modal on ThumbsUp click
                          className="p-2 text-cyan-500 hover:bg-cyan-50 rounded transition-all duration-200 hover:scale-110"
                          title="Approve"
                          disabled={item.status === "Approved"}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition-all duration-200 hover:scale-110"
                          title="Reject"
                          disabled={item.status === "Rejected"}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            // Placeholder print logic; integrate actual print/export as needed
                            window.alert(`Mencetak paklaring untuk ${item.namaPegawai}`);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Cetak Paklaring"
                          disabled={!(() => {
                            const today = new Date();
                            const d = new Date(item.tanggalResign);
                            const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
                            return item.status === 'Approved' && diff >= 30;
                          })()}
                        >
                          <FileText className="h-4 w-4" />
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
        itemName={itemToDelete?.namaPegawai}
      />

      {/* Approval Resign Modal */}
      <ApprovalResignModal
        isOpen={isApprovalResignModalOpen}
        onClose={handleCloseApprovalResignModal}
        onApprove={handleConfirmApproval}
        initialData={selectedResignForApproval}
      />
    </div>
  );
};

export default ResignDashboard;
