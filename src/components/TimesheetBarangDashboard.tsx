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

interface TimesheetBarang {
  id: string;
  no: number;
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  nilaiTimesheet: string;
  mob: string;
  demob: string;
  tanggalPenyerahan: string;
  kondisiBarang: "Baik" | "Rusak";
  status: "Approve by Gudang" | "Approve by QHSE" | "Pending" | "Rejected";
  noManifest?: string;
  detailBarang?: string;
}

const TimesheetBarangDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState("");
  const [searchSOTurunan, setSearchSOTurunan] = useState("");
  const [searchNamaProject, setSearchNamaProject] = useState("");
  const [selectedStatusApproval, setSelectedStatusApproval] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TimesheetBarang | null>(
    null
  );
  const [sortField, setSortField] = useState<keyof TimesheetBarang | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Add Timesheet Barang modal state and form
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    noSO: "",
    noSOTurunan: "",
    namaProyek: "",
    nilaiTimesheet: "",
    mob: "",
    demob: "",
    tanggalPenyerahan: "",
    kondisiBarang: "Baik" as "Baik" | "Rusak",
    status: "Pending" as TimesheetBarang["status"],
    noManifest: "",
    detailBarang: "",
  });
  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.noSO || !addForm.namaProyek) {
      alert("No SO dan Nama Proyek wajib diisi");
      return;
    }
    const nextNo =
      timesheetBarangData.reduce((acc, cur) => Math.max(acc, cur.no), 0) + 1;
    const newItem: TimesheetBarang = {
      id: `${Date.now()}`,
      no: nextNo,
      noSO: addForm.noSO,
      noSOTurunan: addForm.noSOTurunan,
      namaProyek: addForm.namaProyek,
      nilaiTimesheet: addForm.nilaiTimesheet || "Rp 0",
      mob: addForm.mob,
      demob: addForm.demob,
      tanggalPenyerahan: addForm.tanggalPenyerahan,
      kondisiBarang: addForm.kondisiBarang,
      status: addForm.status,
      noManifest: addForm.noManifest,
      detailBarang: addForm.detailBarang,
    };
    setTimesheetBarangData((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
  };

  // Sample data matching the image
  const [timesheetBarangData, setTimesheetBarangData] = useState<
    TimesheetBarang[]
  >([
    {
      id: "1",
      no: 1,
      noSO: "SO001",
      noSOTurunan: "SO001.1",
      namaProyek: "Proyek A",
      nilaiTimesheet: "Rp 500,000,000",
      mob: "02-01-2025",
      demob: "20-01-2025",
      tanggalPenyerahan: "22-01-2025",
      kondisiBarang: "Baik",
      status: "Approve by Gudang",
    },
    {
      id: "2",
      no: 2,
      noSO: "SO002",
      noSOTurunan: "SO002.1",
      namaProyek: "Proyek B",
      nilaiTimesheet: "Rp 750,000,000",
      mob: "05-01-2025",
      demob: "22-01-2025",
      tanggalPenyerahan: "25-01-2025",
      kondisiBarang: "Baik",
      status: "Approve by Gudang",
    },
    {
      id: "3",
      no: 3,
      noSO: "SO003",
      noSOTurunan: "SO003.1",
      namaProyek: "Proyek C",
      nilaiTimesheet: "Rp 600,000,000",
      mob: "07-01-2025",
      demob: "24-01-2025",
      tanggalPenyerahan: "26-01-2025",
      kondisiBarang: "Baik",
      status: "Approve by QHSE",
    },
    {
      id: "4",
      no: 4,
      noSO: "SO004",
      noSOTurunan: "SO004.1",
      namaProyek: "Proyek D",
      nilaiTimesheet: "Rp 900,000,000",
      mob: "10-01-2025",
      demob: "26-01-2025",
      tanggalPenyerahan: "28-01-2025",
      kondisiBarang: "Rusak",
      status: "Approve by QHSE",
    },
    {
      id: "5",
      no: 5,
      noSO: "SO005",
      noSOTurunan: "SO005.1",
      namaProyek: "Proyek E",
      nilaiTimesheet: "Rp 1,200,000,000",
      mob: "12-01-2025",
      demob: "28-01-2025",
      tanggalPenyerahan: "30-01-2025",
      kondisiBarang: "Baik",
      status: "Approve by Gudang",
    },
    {
      id: "6",
      no: 6,
      noSO: "SO006",
      noSOTurunan: "SO006.1",
      namaProyek: "Proyek F",
      nilaiTimesheet: "Rp 800,000,000",
      mob: "15-01-2025",
      demob: "30-01-2025",
      tanggalPenyerahan: "02-02-2025",
      kondisiBarang: "Rusak",
      status: "Approve by Gudang",
    },
    {
      id: "7",
      no: 7,
      noSO: "SO007",
      noSOTurunan: "SO007.1",
      namaProyek: "Proyek G",
      nilaiTimesheet: "Rp 950,000,000",
      mob: "17-01-2025",
      demob: "02-02-2025",
      tanggalPenyerahan: "04-02-2025",
      kondisiBarang: "Rusak",
      status: "Approve by QHSE",
    },
    {
      id: "8",
      no: 8,
      noSO: "SO008",
      noSOTurunan: "SO008.1",
      namaProyek: "Proyek H",
      nilaiTimesheet: "Rp 1,000,000,000",
      mob: "20-01-2025",
      demob: "04-02-2025",
      tanggalPenyerahan: "06-02-2025",
      kondisiBarang: "Baik",
      status: "Approve by QHSE",
    },
    {
      id: "9",
      no: 9,
      noSO: "SO009",
      noSOTurunan: "SO009.1",
      namaProyek: "Proyek I",
      nilaiTimesheet: "Rp 700,000,000",
      mob: "22-01-2025",
      demob: "06-02-2025",
      tanggalPenyerahan: "08-02-2025",
      kondisiBarang: "Baik",
      status: "Approve by Gudang",
    },
    {
      id: "10",
      no: 10,
      noSO: "SO010",
      noSOTurunan: "SO010.1",
      namaProyek: "Proyek J",
      nilaiTimesheet: "Rp 1,100,000,000",
      mob: "25-01-2025",
      demob: "08-02-2025",
      tanggalPenyerahan: "10-02-2025",
      kondisiBarang: "Baik",
      status: "Approve by Gudang",
    },
  ]);

  const statusApprovalOptions = [
    "Approve by Gudang",
    "Approve by QHSE",
    "Pending",
    "Rejected",
  ];

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleDeleteClick = (timesheet: TimesheetBarang) => {
    setItemToDelete(timesheet);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setTimesheetBarangData((prev) =>
        prev.filter((t) => t.id !== itemToDelete.id)
      );
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof TimesheetBarang) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approve by Gudang":
        return "bg-green-600 text-white";
      case "Approve by QHSE":
        return "bg-green-600 text-white";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getKondisiBarangColor = (kondisi: string) => {
    switch (kondisi) {
      case "Baik":
        return "bg-green-600 text-white";
      case "Rusak":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter data based on search criteria
  const filteredData = timesheetBarangData.filter((item) => {
    const matchesNoSO = item.noSO
      .toLowerCase()
      .includes(searchNoSO.toLowerCase());
    const matchesSOTurunan = item.noSOTurunan
      .toLowerCase()
      .includes(searchSOTurunan.toLowerCase());
    const matchesNamaProject = item.namaProyek
      .toLowerCase()
      .includes(searchNamaProject.toLowerCase());
    const matchesStatus = selectedStatusApproval
      ? item.status === selectedStatusApproval
      : true;

    return (
      matchesNoSO && matchesSOTurunan && matchesNamaProject && matchesStatus
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = (a[sortField] ?? "") as any;
    const bValue = (b[sortField] ?? "") as any;

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
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Timesheet Barang
          </h1>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* First Row - Search Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search No SO */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari No SO
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNoSO}
                    onChange={(e) => setSearchNoSO(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="SO001"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search SO Turunan */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari No SO Turunan
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchSOTurunan}
                    onChange={(e) => setSearchSOTurunan(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="SO001.12"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search Nama Project */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Project
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaProject}
                    onChange={(e) => setSearchNamaProject(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Proyek MEDCO"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status Approval Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Status Approval
                </label>
                <div className="relative">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-sm"
                  >
                    <span
                      className={
                        selectedStatusApproval
                          ? "text-gray-900"
                          : "text-gray-500"
                      }
                    >
                      {selectedStatusApproval || "--Pilih Status Approval--"}
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
                          setSelectedStatusApproval("");
                          setStatusDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-sm"
                      >
                        --Pilih Status Approval--
                      </button>
                      {statusApprovalOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatusApproval(status);
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

            {/* Second Row - Date Range and Search Button */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="03/03/2025"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="date"
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
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Tambah + Export Buttons */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <button
                onClick={handleOpenAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
              >
                Tambah
              </button>
            </div>
            <div className="flex space-x-2">
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
                    onClick={() => handleSort("noSO")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No SO</span>
                      {sortField === "noSO" && (
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
                    onClick={() => handleSort("noSOTurunan")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No SO Turunan</span>
                      {sortField === "noSOTurunan" && (
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
                    onClick={() => handleSort("namaProyek")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Proyek</span>
                      {sortField === "namaProyek" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Nilai Timesheet
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    MOB
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    DEMOB
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Tanggal Penyerahan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Kondisi Barang
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
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
                      {item.noSO}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.noSOTurunan}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.namaProyek}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.nilaiTimesheet}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.mob}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.demob}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.tanggalPenyerahan}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getKondisiBarangColor(
                          item.kondisiBarang
                        )}`}
                      >
                        {item.kondisiBarang}
                      </span>
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
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            setTimesheetBarangData((prev) =>
                              prev.map((t) =>
                                t.id === item.id
                                  ? { ...t, status: "Approve by Gudang" }
                                  : t
                              )
                            )
                          }
                          className="px-2.5 py-1 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            setTimesheetBarangData((prev) =>
                              prev.map((t) =>
                                t.id === item.id
                                  ? { ...t, status: "Rejected" }
                                  : t
                              )
                            )
                          }
                          className="px-2.5 py-1 text-sm text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        >
                          Reject
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

                <div className="flex items-center space-x-1">
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
                </div>

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

      {/* Add Timesheet Barang Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">
                Tambah Timesheet Barang
              </h2>
              <button
                onClick={handleCloseAddModal}
                className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 text-sm"
              >
                Tutup
              </button>
            </div>
            <form
              onSubmit={handleAddSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No SO
                </label>
                <input
                  type="text"
                  value={addForm.noSO}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, noSO: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No SO Turunan
                </label>
                <input
                  type="text"
                  value={addForm.noSOTurunan}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, noSOTurunan: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Manifest</label>
                <input
                  type="text"
                  value={addForm.noManifest}
                  onChange={(e) => setAddForm((f) => ({ ...f, noManifest: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="MN-001"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Proyek
                </label>
                <input
                  type="text"
                  value={addForm.namaProyek}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, namaProyek: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Detail Barang</label>
                <textarea
                  value={addForm.detailBarang}
                  onChange={(e) => setAddForm((f) => ({ ...f, detailBarang: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Deskripsikan rincian barang..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nilai Timesheet
                </label>
                <input
                  type="text"
                  value={addForm.nilaiTimesheet}
                  onChange={(e) =>
                    setAddForm((f) => ({
                      ...f,
                      nilaiTimesheet: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MOB
                </label>
                <input
                  type="text"
                  value={addForm.mob}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, mob: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="dd-mm-yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DEMOB
                </label>
                <input
                  type="text"
                  value={addForm.demob}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, demob: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="dd-mm-yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Penyerahan
                </label>
                <input
                  type="text"
                  value={addForm.tanggalPenyerahan}
                  onChange={(e) =>
                    setAddForm((f) => ({
                      ...f,
                      tanggalPenyerahan: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="dd-mm-yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kondisi Barang
                </label>
                <select
                  value={addForm.kondisiBarang}
                  onChange={(e) =>
                    setAddForm((f) => ({
                      ...f,
                      kondisiBarang: e.target.value as any,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="Baik">Baik</option>
                  <option value="Rusak">Rusak</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={addForm.status}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, status: e.target.value as any }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                >
                  {statusApprovalOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaProyek}
      />
    </div>
  );
};

export default TimesheetBarangDashboard;
