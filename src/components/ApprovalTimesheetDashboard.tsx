import React, { useState, useEffect } from "react";
import ApproveTimesheetModal, {
  ApproveTimesheetFormData,
} from "./ApproveTimesheetModal";
import ApproveTimesheetDetailModal from "./ApproveTimesheetDetailModal";
import { ArrowUp } from "lucide-react";

// Local interface for timesheet data mirrored from Operation
interface ApprovalTimesheetPegawaiData {
  id: string;
  no: number;
  tanggal: string;
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  namaPegawai: string;
  kualifikasi: string[];
  mob: string;
  demob: string;
  durasi: string;
  zona: string;
  nilaiTimesheet: string;
  statusApproval: 'Approve by HRD' | 'Approve by Manager OPS' | 'Pending' | 'Rejected' | 'Released';
}

const ApprovalTimesheetDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [animateRows, setAnimateRows] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Renamed for clarity
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // New state
  const [selectedTimesheetForDetail, setSelectedTimesheetForDetail] =
    useState<ApprovalTimesheetPegawaiData | null>(null); // New state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Removed delete modal logic
  const [sortField, setSortField] = useState<
    keyof ApprovalTimesheetPegawaiData | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sample data mirrored from Operation timesheet structure
  const [approvalTimesheetData, setApprovalTimesheetData] = useState<
    ApprovalTimesheetPegawaiData[]
  >([
    {
      id: "1",
      no: 1,
      tanggal: "2025-01-15",
      noSO: "SO-001",
      noSOTurunan: "SO-001.1",
      namaProyek: "Proyek Jembatan A",
      namaPegawai: "Ahmad",
      kualifikasi: ["Welder", "Fitter"],
      mob: "01-01-2025",
      demob: "05-01-2025",
      durasi: "4 hari",
      zona: "Zona A",
      nilaiTimesheet: "Rp 3.000.000",
      statusApproval: "Approve by HRD",
    },
    {
      id: "2",
      no: 2,
      tanggal: "2025-02-10",
      noSO: "SO-002",
      noSOTurunan: "SO-002.1",
      namaProyek: "Pembangunan Gedung B",
      namaPegawai: "Budi",
      kualifikasi: ["Electrician"],
      mob: "03-02-2025",
      demob: "08-02-2025",
      durasi: "5 hari",
      zona: "Zona B",
      nilaiTimesheet: "Rp 2.500.000",
      statusApproval: "Pending",
    },
    {
      id: "3",
      no: 3,
      tanggal: "2025-03-12",
      noSO: "SO-003",
      noSOTurunan: "SO-003.1",
      namaProyek: "Instalasi Sistem C",
      namaPegawai: "Charlie",
      kualifikasi: ["Technician", "Supervisor"],
      mob: "10-03-2025",
      demob: "15-03-2025",
      durasi: "5 hari",
      zona: "Zona C",
      nilaiTimesheet: "Rp 3.500.000",
      statusApproval: "Rejected",
    },
    {
      id: "4",
      no: 4,
      tanggal: "2025-04-08",
      noSO: "SO-004",
      noSOTurunan: "SO-004.1",
      namaProyek: "Renovasi Kantor D",
      namaPegawai: "Dewi",
      kualifikasi: ["Supervisor"],
      mob: "05-04-2025",
      demob: "10-04-2025",
      durasi: "5 hari",
      zona: "Zona D",
      nilaiTimesheet: "Rp 4.000.000",
      statusApproval: "Approve by Manager OPS",
    },
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddApprovalTimesheet = (formData: ApproveTimesheetFormData) => {
    const newApprovalTimesheet: ApprovalTimesheetPegawaiData = {
      id: (approvalTimesheetData.length + 1).toString(),
      no: approvalTimesheetData.length + 1,
      tanggal: new Date().toISOString().split('T')[0],
      noSO: formData.noSO || '',
      noSOTurunan: formData.noSO + '.1' || '',
      namaProyek: formData.namaProject || '',
      namaPegawai: formData.nama || '',
      kualifikasi: formData.kualifikasi || [],
      mob: formData.mob || '',
      demob: formData.demob || '',
      durasi: formData.durasi || '',
      zona: formData.lokasi || '',
      nilaiTimesheet: 'Rp 0',
      statusApproval: "Pending",
    };

    setApprovalTimesheetData((prev) => [
      newApprovalTimesheet,
      ...prev.map((a) => ({ ...a, no: a.no + 1 })),
    ]);
  };

  const handleSort = (field: keyof ApprovalTimesheetPegawaiData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleApprove = (id: string) => {
    setApprovalTimesheetData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, statusApproval: "Approve by HRD" as const } : item
      )
    );
    setIsDetailModalOpen(false); // Close modal after action
    setSelectedTimesheetForDetail(null);
  };

  const handleReject = (id: string) => {
    setApprovalTimesheetData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, statusApproval: "Rejected" as const } : item
      )
    );
    setIsDetailModalOpen(false);
    setSelectedTimesheetForDetail(null);
  };

  const handleRelease = (id: string) => {
    setApprovalTimesheetData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, statusApproval: "Released" as const } : item
      )
    );
    setIsDetailModalOpen(false);
    setSelectedTimesheetForDetail(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approve by HRD":
        return "bg-green-600 text-white";
      case "Approve by Manager OPS":
        return "bg-blue-600 text-white";
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Rejected":
        return "bg-red-600 text-white";
      case "Released":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter data based on search criteria
  const filteredData = approvalTimesheetData.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.namaPegawai.toLowerCase().includes(searchLower) ||
      item.kualifikasi.join(", ").toLowerCase().includes(searchLower) || // Search in joined kualifikasi
      item.noSO.toLowerCase().includes(searchLower) ||
      item.namaProyek.toLowerCase().includes(searchLower) ||
      item.zona.toLowerCase().includes(searchLower)
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search..."
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
                    onClick={() => handleSort("namaPegawai")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama</span>
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.noSO}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.zona}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.nilaiTimesheet}
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
                              onClick={() => { setSelectedTimesheetForDetail(item); setIsDetailModalOpen(true); }}
                              className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                              title="Approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => { setSelectedTimesheetForDetail(item); setIsDetailModalOpen(true); }}
                              className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                              title="Reject"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(item.statusApproval === "Approve by HRD" || item.statusApproval === "Approve by Manager OPS") && (
                          <span className="text-xs text-gray-500">
                            Approved
                          </span>
                        )}
                        {item.statusApproval === "Rejected" && (
                          <span className="text-xs text-red-500">
                            Rejected
                          </span>
                        )}
                        {item.statusApproval === "Released" && (
                          <span className="text-xs text-blue-500">
                            Released
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

      {/* Add Timesheet Modal (existing) */}
      <ApproveTimesheetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddApprovalTimesheet}
      />

      {/* New Approve Timesheet Detail Modal */}
      <ApproveTimesheetDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        timesheetData={selectedTimesheetForDetail as any}
        onApprove={handleApprove}
        onReject={handleReject}
        onRelease={handleRelease}
      />
    </div>
  );
};

export default ApprovalTimesheetDashboard;
