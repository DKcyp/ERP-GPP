import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

// Define an extended interface for the dashboard table to include all displayed fields
interface DashboardTimesheetItem {
  id: string;
  no: number;
  tanggal: string;
  noSO: string;
  noSoTurunan: string;
  namaProyek: string;
  namaPegawai: string;
  kualifikasi: string[];
  mob: string;
  demob: string;
  durasi: string;
  overtime: string;
  lokasi: string;
  zona: string;
  jenisPekerjaan: string;
  baseRate: string;
  nilaiTimesheet: string;
  pegawai: "Freelance" | "Pegawai Tetap";
  statusApproval: "Approved" | "Pending" | "Rejected";
  namaClient: string;
  jamAwalKerja: string;
  jamSelesaiKerja: string;
  tunjangan: Array<{
    namaTunjangan: string;
    rateTunjangan: string;
    overtime: string;
  }>;
}

const ApprovalTimesheetDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState("");
  const [searchKualifikasi, setSearchKualifikasi] = useState("");
  const [searchSOTurunan, setSearchSOTurunan] = useState("");
  const [searchNamaProject, setSearchNamaProject] = useState("");
  const [searchTanggal, setSearchTanggal] = useState(""); // New search state for Tanggal
  const [searchNamaPegawai, setSearchNamaPegawai] = useState(""); // New search state for Nama Pegawai
  const [searchZona, setSearchZona] = useState(""); // New search state for Zona
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<
    keyof DashboardTimesheetItem | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DashboardTimesheetItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Sample data matching TimesheetPegawaiDashboard structure
  const [timesheetPegawaiData, setTimesheetPegawaiData] = useState<
    DashboardTimesheetItem[]
  >([
    {
      id: "1",
      no: 1,
      tanggal: "2025-01-15",
      noSO: "SO-001",
      noSoTurunan: "SO-001.1",
      namaProyek: "Proyek Jembatan A",
      namaPegawai: "Ahmad",
      kualifikasi: ["Welder", "Fitter"],
      mob: "01-01-2025",
      demob: "05-01-2025",
      durasi: "4 Hari",
      overtime: "8 Jam",
      lokasi: "Jakarta",
      zona: "Zona A",
      jenisPekerjaan: "On Call",
      baseRate: "500,000",
      nilaiTimesheet: "550,000",
      pegawai: "Freelance",
      statusApproval: "Approved",
      namaClient: "PT ABC",
      jamAwalKerja: "08:00",
      jamSelesaiKerja: "17:00",
      tunjangan: [
        { namaTunjangan: "Makan", rateTunjangan: "50,000", overtime: "" },
      ],
    },
    {
      id: "2",
      no: 2,
      tanggal: "2025-02-10",
      noSO: "SO-002",
      noSoTurunan: "SO-002.1",
      namaProyek: "Pembangunan Gedung B",
      namaPegawai: "Budi",
      kualifikasi: ["Electrician"],
      mob: "03-02-2025",
      demob: "08-02-2025",
      durasi: "5 Hari",
      overtime: "6 Jam",
      lokasi: "Surabaya",
      zona: "Zona B",
      jenisPekerjaan: "Project",
      baseRate: "400,000",
      nilaiTimesheet: "400,000",
      pegawai: "Pegawai Tetap",
      statusApproval: "Pending",
      namaClient: "PT XYZ",
      jamAwalKerja: "07:00",
      jamSelesaiKerja: "16:00",
      tunjangan: [],
    },
    {
      id: "3",
      no: 3,
      tanggal: "2025-03-12",
      noSO: "SO-003",
      noSoTurunan: "SO-003.1",
      namaProyek: "Instalasi Sistem C",
      namaPegawai: "Charlie",
      kualifikasi: ["Technician", "Supervisor"],
      mob: "10-03-2025",
      demob: "15-03-2025",
      durasi: "5 Hari",
      overtime: "4 Jam",
      lokasi: "Bandung",
      zona: "Zona C",
      jenisPekerjaan: "Maintenance",
      baseRate: "350,000",
      nilaiTimesheet: "350,000",
      pegawai: "Freelance",
      statusApproval: "Rejected",
      namaClient: "PT DEF",
      jamAwalKerja: "08:30",
      jamSelesaiKerja: "17:30",
      tunjangan: [],
    },
    {
      id: "4",
      no: 4,
      tanggal: "2025-04-08",
      noSO: "SO-004",
      noSoTurunan: "SO-004.1",
      namaProyek: "Renovasi Kantor D",
      namaPegawai: "Dewi",
      kualifikasi: ["Supervisor"],
      mob: "05-04-2025",
      demob: "10-04-2025",
      durasi: "5 Hari",
      overtime: "2 Jam",
      lokasi: "Medan",
      zona: "Zona D",
      jenisPekerjaan: "Supervision",
      baseRate: "600,000",
      nilaiTimesheet: "700,000",
      pegawai: "Pegawai Tetap",
      statusApproval: "Approved",
      namaClient: "PT GHI",
      jamAwalKerja: "07:30",
      jamSelesaiKerja: "16:30",
      tunjangan: [
        { namaTunjangan: "Transport", rateTunjangan: "100,000", overtime: "" },
      ],
    },
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSearch = () => {
    // Search functionality - filter is already applied in filteredData
    setCurrentPage(1);
  };

  const handleSort = (field: keyof DashboardTimesheetItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (statusApproval: string) => {
    switch (statusApproval) {
      case "Approved":
        return "bg-green-600 text-white";
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter data based on search criteria
  const filteredData = timesheetPegawaiData.filter((item) => {
    const matchesNoSO =
      !searchNoSO || item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesKualifikasi =
      !searchKualifikasi ||
      item.kualifikasi.some((k) =>
        k.toLowerCase().includes(searchKualifikasi.toLowerCase())
      );
    const matchesSOTurunan =
      !searchSOTurunan ||
      item.noSoTurunan.toLowerCase().includes(searchSOTurunan.toLowerCase());
    const matchesNamaProject =
      !searchNamaProject ||
      item.namaProyek.toLowerCase().includes(searchNamaProject.toLowerCase());
    const matchesTanggal =
      !searchTanggal ||
      item.tanggal.toLowerCase().includes(searchTanggal.toLowerCase());
    const matchesNamaPegawai =
      !searchNamaPegawai ||
      item.namaPegawai.toLowerCase().includes(searchNamaPegawai.toLowerCase());
    const matchesZona =
      !searchZona || item.zona.toLowerCase().includes(searchZona.toLowerCase());
    const matchesStatus =
      !selectedStatus || item.statusApproval === selectedStatus;

    return (
      matchesNoSO &&
      matchesKualifikasi &&
      matchesSOTurunan &&
      matchesNamaProject &&
      matchesTanggal &&
      matchesNamaPegawai &&
      matchesZona &&
      matchesStatus
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle string comparison for kualifikasi (array)
    if (sortField === "kualifikasi") {
      const aKualifikasi = (aValue as string[]).join(", ");
      const bKualifikasi = (bValue as string[]).join(", ");
      if (sortDirection === "asc") {
        return aKualifikasi > bKualifikasi ? 1 : -1;
      } else {
        return aKualifikasi < bKualifikasi ? 1 : -1;
      }
    }

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

  const handleApproveClick = (item: DashboardTimesheetItem) => {
    setSelectedItem(item);
    setSelectedItemId(item.id);
    setShowApprovalModal(true);
  };

  const handleApprove = () => {
    if (selectedItemId) {
      setTimesheetPegawaiData((prevData) =>
        prevData.map((item) =>
          item.id === selectedItemId ? { ...item, statusApproval: "Approved" } : item
        )
      );
      setShowApprovalModal(false);
      setSelectedItem(null);
      setSelectedItemId(null);
    }
  };

  const handleRejectClick = (id: string) => {
    setSelectedItemId(id);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (selectedItemId && rejectionReason.trim() !== "") {
      setTimesheetPegawaiData((prevData) =>
        prevData.map((item) =>
          item.id === selectedItemId
            ? { ...item, statusApproval: "Rejected" }
            : item
        )
      );
      setShowRejectModal(false);
      setSelectedItemId(null);
      setRejectionReason("");
    } else if (rejectionReason.trim() === "") {
      alert("Alasan penolakan tidak boleh kosong.");
    }
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedItemId(null);
    setRejectionReason("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Approval Timesheet Pegawai
          </h1>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Approval Timesheet Pegawai
            </h2>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Controls Section */}
        <div className="flex items-center justify-between">
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

          {/* Search */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Search:</span>
            <input
              type="text"
              value={searchNoSO}
              onChange={(e) => setSearchNoSO(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search No SO..."
            />
            <input
              type="text"
              value={searchSOTurunan}
              onChange={(e) => setSearchSOTurunan(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search No SO Turunan..."
            />
            <input
              type="text"
              value={searchNamaProject}
              onChange={(e) => setSearchNamaProject(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search Nama Proyek..."
            />
            <input
              type="text"
              value={searchNamaPegawai}
              onChange={(e) => setSearchNamaPegawai(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search Nama Pegawai..."
            />
            <input
              type="text"
              value={searchKualifikasi}
              onChange={(e) => setSearchKualifikasi(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search Kualifikasi..."
            />
            <input
              type="date"
              value={searchTanggal}
              onChange={(e) => setSearchTanggal(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search Tanggal..."
            />
            <input
              type="text"
              value={searchZona}
              onChange={(e) => setSearchZona(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search Zona..."
            />
          </div>
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
                    onClick={() => handleSort("tanggal")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal</span>
                      {sortField === "tanggal" && (
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
                    onClick={() => handleSort("noSoTurunan")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No SO Turunan</span>
                      {sortField === "noSoTurunan" && (
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
                    onClick={() => handleSort("kualifikasi")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Kualifikasi</span>
                      {sortField === "kualifikasi" && (
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
                    onClick={() => handleSort("mob")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>MOB</span>
                      {sortField === "mob" && (
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
                    onClick={() => handleSort("demob")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>DEMOB</span>
                      {sortField === "demob" && (
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
                    onClick={() => handleSort("durasi")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Durasi</span>
                      {sortField === "durasi" && (
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
                    onClick={() => handleSort("zona")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Zona</span>
                      {sortField === "zona" && (
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
                    onClick={() => handleSort("nilaiTimesheet")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nilai Timesheet</span>
                      {sortField === "nilaiTimesheet" && (
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
                    onClick={() => handleSort("statusApproval")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status Approval</span>
                      {sortField === "statusApproval" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Actions
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
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.tanggal}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.noSO}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.noSoTurunan}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.namaProyek}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.namaPegawai}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.kualifikasi.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.mob}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.demob}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.durasi}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.zona}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Rp {item.nilaiTimesheet}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          item.statusApproval
                        )}`}
                      >
                        {item.statusApproval}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {item.statusApproval === "Pending" && (
                          <>
                            <button
                              className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                              title="Approve"
                              onClick={() => handleApproveClick(item)}
                            >
                              Approve
                            </button>
                            <button
                              className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                              title="Reject"
                              onClick={() => handleRejectClick(item.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {item.statusApproval === "Approved" && (
                          <span className="text-xs text-green-600 font-medium">
                            Approved
                          </span>
                        )}
                        {item.statusApproval === "Rejected" && (
                          <span className="text-xs text-red-600 font-medium">
                            Rejected
                          </span>
                        )}
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
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    currentPage === 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  1
                </button>

                {/* Add more page buttons if needed, similar to the original design */}

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

      {/* Approval Modal with Timesheet Details */}
      {showApprovalModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Tambah Timesheet Barang/Pegawai
              </h3>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Header Info */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No SO
                  </label>
                  <input
                    type="text"
                    value={selectedItem.noSO}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No SO Turunan
                  </label>
                  <input
                    type="text"
                    value={selectedItem.noSoTurunan}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Proyek
                  </label>
                  <input
                    type="text"
                    value={selectedItem.namaProyek}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nilai Timesheet
                  </label>
                  <input
                    type="text"
                    value={selectedItem.nilaiTimesheet}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MOB
                  </label>
                  <input
                    type="text"
                    value={selectedItem.mob}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DEMOB
                  </label>
                  <input
                    type="text"
                    value={selectedItem.demob}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              {/* List Pegawai */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    List Pegawai
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Nama
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Kualifikasi
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Zona
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Durasi
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Actual
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Rate
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Start Kerja
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Finish Kerja
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Overtime
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                          Upload
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {selectedItem.namaPegawai}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {selectedItem.kualifikasi.join(", ")}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {selectedItem.zona}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {selectedItem.durasi}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">0</td>
                        <td className="px-3 py-2 text-sm text-gray-900">0</td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {selectedItem.mob}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {selectedItem.demob}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {selectedItem.overtime}
                        </td>
                        <td className="px-3 py-2 text-sm">
                          <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                            timesheet_report.pdf
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
            <h3 className="text-lg font-bold mb-4">
              Alasan Penolakan Timesheet
            </h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={4}
              placeholder="Masukkan alasan penolakan..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={handleCloseRejectModal}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={handleConfirmReject}
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalTimesheetDashboard;
