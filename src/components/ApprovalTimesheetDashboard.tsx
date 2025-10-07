import React, { useState, useEffect } from "react";
import {
  ArrowUp,
} from "lucide-react";

// Define an extended interface for the dashboard table to include all displayed fields
interface DashboardTimesheetItem {
  id: string;
  no: number;
  nama: string;
  kualifikasi: string[];
  tanggalTimesheet: string;
  mob: string;
  demob: string;
  durasi: string;
  overtime: string;
  noSO: string;
  noHPP: string;
  lokasi: string;
  zona: string;
  jenisPekerjaan: string;
  rate: string;
  pegawai: "Freelance" | "Pegawai Tetap";
  status: "Approved" | "Pending" | "Rejected";
  namaProject: string;
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

  // Sample data matching TimesheetPegawaiDashboard structure
  const [timesheetPegawaiData, setTimesheetPegawaiData] = useState<
    DashboardTimesheetItem[]
  >([
    {
      id: "1",
      no: 1,
      nama: "Ahmad",
      kualifikasi: ["Welder", "Fitter"],
      tanggalTimesheet: "2025-01-15",
      mob: "01-01-2025",
      demob: "05-01-2025",
      durasi: "4 Hari",
      overtime: "8 Jam",
      noSO: "SO-001",
      noHPP: "SO-001.1",
      lokasi: "Jakarta",
      zona: "Zona A",
      jenisPekerjaan: "On Call",
      rate: "500,000",
      pegawai: "Freelance",
      status: "Approved",
      namaProject: "Proyek Jembatan A",
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
      nama: "Budi",
      kualifikasi: ["Electrician"],
      tanggalTimesheet: "2025-02-10",
      mob: "03-02-2025",
      demob: "08-02-2025",
      durasi: "5 Hari",
      overtime: "6 Jam",
      noSO: "SO-002",
      noHPP: "SO-002.1",
      lokasi: "Surabaya",
      zona: "Zona B",
      jenisPekerjaan: "Project",
      rate: "400,000",
      pegawai: "Pegawai Tetap",
      status: "Pending",
      namaProject: "Pembangunan Gedung B",
      namaClient: "PT XYZ",
      jamAwalKerja: "07:00",
      jamSelesaiKerja: "16:00",
      tunjangan: [],
    },
    {
      id: "3",
      no: 3,
      nama: "Charlie",
      kualifikasi: ["Technician", "Supervisor"],
      tanggalTimesheet: "2025-03-12",
      mob: "10-03-2025",
      demob: "15-03-2025",
      durasi: "5 Hari",
      overtime: "4 Jam",
      noSO: "SO-003",
      noHPP: "SO-003.1",
      lokasi: "Bandung",
      zona: "Zona C",
      jenisPekerjaan: "Maintenance",
      rate: "350,000",
      pegawai: "Freelance",
      status: "Rejected",
      namaProject: "Instalasi Sistem C",
      namaClient: "PT DEF",
      jamAwalKerja: "08:30",
      jamSelesaiKerja: "17:30",
      tunjangan: [],
    },
    {
      id: "4",
      no: 4,
      nama: "Dewi",
      kualifikasi: ["Supervisor"],
      tanggalTimesheet: "2025-04-08",
      mob: "05-04-2025",
      demob: "10-04-2025",
      durasi: "5 Hari",
      overtime: "2 Jam",
      noSO: "SO-004",
      noHPP: "SO-004.1",
      lokasi: "Medan",
      zona: "Zona D",
      jenisPekerjaan: "Supervision",
      rate: "600,000",
      pegawai: "Pegawai Tetap",
      status: "Approved",
      namaProject: "Renovasi Kantor D",
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

  const getStatusColor = (status: string) => {
    switch (status) {
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
    const matchesNoSO = !searchNoSO || item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesKualifikasi = !searchKualifikasi || item.kualifikasi.some(k => k.toLowerCase().includes(searchKualifikasi.toLowerCase()));
    const matchesSOTurunan = !searchSOTurunan || item.noHPP.toLowerCase().includes(searchSOTurunan.toLowerCase());
    const matchesNamaProject = !searchNamaProject || item.namaProject.toLowerCase().includes(searchNamaProject.toLowerCase());
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    
    return matchesNoSO && matchesKualifikasi && matchesSOTurunan && matchesNamaProject && matchesStatus;
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
                      <span>Durasi (hari)</span>
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
                    onClick={() => handleSort("rate")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Rate</span>
                      {sortField === "rate" && (
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
                      {item.nama}
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.noSO}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.zona}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Rp {item.rate}
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
                        {item.status === "Pending" && (
                          <>
                            <button
                              className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                              title="Approve"
                            >
                              Approve
                            </button>
                            <button
                              className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                              title="Reject"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {item.status === "Approved" && (
                          <span className="text-xs text-green-600 font-medium">
                            Approved
                          </span>
                        )}
                        {item.status === "Rejected" && (
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

      {/* No modals needed for approval timesheet dashboard */}
    </div>
  );
};

export default ApprovalTimesheetDashboard;
