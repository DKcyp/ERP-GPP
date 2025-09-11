import React, { useState, useEffect } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  Search,
  FileSpreadsheet,
  FileText,
  File,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ChevronDown,
} from "lucide-react";

interface HistoryLamaranData {
  id: string;
  no: number;
  nik: string;
  nama: string;
  kelurahan: string;
  minatPekerjaan: string;
  tanggalLamar: string;
  status: "Terima" | "Tolak";
}

const HistoryLamaranDashboard: React.FC = () => {
  const [searchNamaPelamar, setSearchNamaPelamar] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("03/03/2025");
  const [dateTo, setDateTo] = useState("03/03/2025");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HistoryLamaranData | null>(
    null
  );
  const [sortField, setSortField] = useState<keyof HistoryLamaranData | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sample data matching the image
  const [historyLamaranData, setHistoryLamaranData] = useState<
    HistoryLamaranData[]
  >([
    {
      id: "1",
      no: 1,
      nik: "3313154213200001",
      nama: "Nafi",
      kelurahan: "p1",
      minatPekerjaan: "-",
      tanggalLamar: "01-01-2025",
      status: "Terima",
    },
    {
      id: "2",
      no: 2,
      nik: "3313154213200001",
      nama: "Alvian",
      kelurahan: "p1",
      minatPekerjaan: "-",
      tanggalLamar: "02-01-2025",
      status: "Tolak",
    },
    {
      id: "3",
      no: 3,
      nik: "3313154213200001",
      nama: "Dani",
      kelurahan: "p1",
      minatPekerjaan: "-",
      tanggalLamar: "03-01-2025",
      status: "Tolak",
    },
    {
      id: "4",
      no: 4,
      nik: "3313154213200001",
      nama: "Arva",
      kelurahan: "p1",
      minatPekerjaan: "-",
      tanggalLamar: "03-01-2025",
      status: "Tolak",
    },
    {
      id: "5",
      no: 5,
      nik: "3313154213200001",
      nama: "Yohanes",
      kelurahan: "p1",
      minatPekerjaan: "-",
      tanggalLamar: "04-01-2025",
      status: "Terima",
    },
  ]);

  const statusOptions = ["Terima", "Tolak"];

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof HistoryLamaranData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteClick = (item: HistoryLamaranData) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setHistoryLamaranData((prev) =>
        prev.filter((h) => h.id !== itemToDelete.id)
      );
      setItemToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terima":
        return "bg-green-600 text-white";
      case "Tolak":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter data based on search criteria
  const filteredData = historyLamaranData.filter((item) => {
    const matchesNamaPelamar = item.nama
      .toLowerCase()
      .includes(searchNamaPelamar.toLowerCase());
    const matchesStatus = selectedStatus
      ? item.status === selectedStatus
      : true;

    return matchesNamaPelamar && matchesStatus;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            HISTORY LAMARAN
          </h1>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Search Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Search Nama Pelamar */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Pelamar
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaPelamar}
                    onChange={(e) => setSearchNamaPelamar(e.target.value)}
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

            {/* Date Range Row */}
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
                    onClick={() => handleSort("nama")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama</span>
                      {sortField === "nama" && (
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
                      <span>Posisi</span>
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
                    onClick={() => handleSort("minatPekerjaan")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Minat Pekerjaan</span>
                      {sortField === "minatPekerjaan" && (
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
                    onClick={() => handleSort("tanggalLamar")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal Lamar</span>
                      {sortField === "tanggalLamar" && (
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
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.kelurahan}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.minatPekerjaan}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.tanggalLamar}
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
        itemName={itemToDelete?.nama}
      />
    </div>
  );
};

export default HistoryLamaranDashboard;
