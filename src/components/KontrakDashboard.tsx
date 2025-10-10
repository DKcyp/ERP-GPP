import React, { useState, useEffect } from "react";
import KontrakModal, { KontrakFormData } from "./KontrakModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ApprovalActionModal from "./ApprovalActionModal"; // Import ApprovalActionModal
import MPPModal from "./MPPModal";
import { ApprovalActionData } from "../types"; // Assuming you have this type defined
import {
  Search,
  Plus,
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
  Check, // Import Check icon for approve
  Users,
} from "lucide-react";

interface Kontrak {
  id: string;
  no: number;
  namaOrang: string;
  kualifikasi: string;
  projectName: string;
  mob: string;
  demob: string;
  durasi: string;
}

const KontrakDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState("");
  const [searchNamaClient, setSearchNamaClient] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Kontrak | null>(null);
  const [sortField, setSortField] = useState<keyof Kontrak | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // State for Approval Modal
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedKontrakIdForApproval, setSelectedKontrakIdForApproval] =
    useState<string | null>(null);
  const [approvalActionType, setApprovalActionType] = useState<
    "approve" | "reject" | null
  >(null);

  // State for MPP Modal
  const [isMPPModalOpen, setIsMPPModalOpen] = useState(false);
  const [selectedKontrakForMPP, setSelectedKontrakForMPP] = useState<Kontrak | null>(null);

  // Sample data with new structure
  const [kontrakData, setKontrakData] = useState<Kontrak[]>([
    {
      id: "1",
      no: 1,
      namaOrang: "Ahmad Fauzi",
      kualifikasi: "Senior Engineer",
      projectName: "Jakarta Tank Terminal Project",
      mob: "01-01-2025",
      demob: "01-06-2025",
      durasi: "5 Bulan",
    },
    {
      id: "2",
      no: 2,
      namaOrang: "Siti Nurhaliza",
      kualifikasi: "Project Manager",
      projectName: "Surabaya Shipping Lines",
      mob: "15-02-2025",
      demob: "15-08-2025",
      durasi: "6 Bulan",
    },
    {
      id: "3",
      no: 3,
      namaOrang: "Budi Santoso",
      kualifikasi: "Technical Lead",
      projectName: "Bandung Logistics System",
      mob: "01-03-2025",
      demob: "01-09-2025",
      durasi: "6 Bulan",
    },
    {
      id: "4",
      no: 4,
      namaOrang: "Dewi Anggraini",
      kualifikasi: "Site Supervisor",
      projectName: "Medan Cargo Express",
      mob: "10-04-2025",
      demob: "10-10-2025",
      durasi: "6 Bulan",
    },
    {
      id: "5",
      no: 5,
      namaOrang: "Rudi Hermawan",
      kualifikasi: "QA Engineer",
      projectName: "Semarang Port Services",
      mob: "01-05-2025",
      demob: "01-11-2025",
      durasi: "6 Bulan",
    },
    {
      id: "6",
      no: 6,
      namaOrang: "Rina Setiawati",
      kualifikasi: "Safety Officer",
      projectName: "Makassar Infrastructure",
      mob: "15-06-2025",
      demob: "15-12-2025",
      durasi: "6 Bulan",
    },
    {
      id: "7",
      no: 7,
      namaOrang: "Wahyudi Hidayat",
      kualifikasi: "Electrical Engineer",
      projectName: "Palembang Power Plant",
      mob: "01-07-2025",
      demob: "01-01-2026",
      durasi: "6 Bulan",
    },
    {
      id: "8",
      no: 8,
      namaOrang: "Siti Aminah",
      kualifikasi: "Civil Engineer",
      projectName: "Balikpapan Bridge Construction",
      mob: "20-08-2025",
      demob: "20-02-2026",
      durasi: "6 Bulan",
    },
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddKontrak = (formData: KontrakFormData) => {
    const newKontrak: Kontrak = {
      id: (kontrakData.length + 1).toString(),
      no: kontrakData.length + 1,
      namaOrang: formData.namaClient || "New Person",
      kualifikasi: "Staff",
      projectName: "New Project",
      mob: new Date(formData.tanggalAwal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      demob: new Date(formData.tanggalAkhir).toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      ),
      durasi: "6 Bulan",
    };

    setKontrakData((prev) => [
      newKontrak,
      ...prev.map((k) => ({ ...k, no: k.no + 1 })),
    ]);
  };

  const handleDeleteClick = (kontrak: Kontrak) => {
    setItemToDelete(kontrak);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setKontrakData((prev) => prev.filter((k) => k.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof Kontrak) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter data based on search criteria
  const filteredData = kontrakData.filter((item) => {
    const matchesNamaOrang = item.namaOrang
      .toLowerCase()
      .includes(searchNoSO.toLowerCase());
    const matchesProject = item.projectName
      .toLowerCase()
      .includes(searchNamaClient.toLowerCase());

    return matchesNamaOrang && matchesProject;
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
    setCurrentPage(1); // Reset to first page when searching
  };

  // No totals calculation needed for new structure

  // Handle Approve Kontrak button click
  const handleApproveKontrakClick = (kontrakId: string) => {
    setSelectedKontrakIdForApproval(kontrakId);
    setApprovalActionType("approve");
    setIsApprovalModalOpen(true);
  };

  // Handle confirmation from ApprovalActionModal
  const handleApprovalConfirm = (data: ApprovalActionData) => {
    console.log("Kontrak Approved:", data);
    // Here you would typically update the status of the kontrak in your state or send to API
    // For demonstration, we'll just log it.
    setIsApprovalModalOpen(false);
    setSelectedKontrakIdForApproval(null);
    setApprovalActionType(null);
  };

  // Handle MPP Modal
  const handleMPPClick = (kontrak: Kontrak) => {
    setSelectedKontrakForMPP(kontrak);
    setIsMPPModalOpen(true);
  };

  const handleMPPSave = (data: any) => {
    console.log("MPP Data Saved:", data);
    setIsMPPModalOpen(false);
    setSelectedKontrakForMPP(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Title - Moved to the top */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
          DASHBOARD KONTRAK
        </h1>
        <nav className="text-sm text-gray-600">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            Finance
          </span>
          <span className="mx-2">›</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            Kontrak
          </span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 font-medium">Dashboard</span>
        </nav>
      </div>

      {/* Header Section (now without the h1) */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Inputs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Search Nama Orang */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Orang
                </label>
                <input
                  type="text"
                  value={searchNoSO}
                  onChange={(e) => setSearchNoSO(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Ahmad Fauzi"
                />
              </div>

              {/* Search Project Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Project Name
                </label>
                <input
                  type="text"
                  value={searchNamaClient}
                  onChange={(e) => setSearchNamaClient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Jakarta Tank Terminal"
                />
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              {/* Full-width Button */}
              <div className="space-y-2">
                <button
                  onClick={handleSearch}
                  className="w-full px-3 py-2 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-sm"
                >
                  <Search className="h-5 w-5" />
                  Cari Data
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Pencapaian On Call</h3>
              <p className="text-xl font-bold">40%</p>
            </div>
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Nominal On Call</h3>
              <p className="text-xl font-bold">Rp 50.000.000</p>
            </div>
            <div className="bg-green-600 text-white p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Pencapaian Tender</h3>
              <p className="text-xl font-bold">60%</p>
            </div>
            <div className="bg-green-600 text-white p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Nominal Tender</h3>
              <p className="text-xl font-bold">Rp 90.000.000</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Export Bar */}
        <div className="flex items-center justify-between">
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
                    onClick={() => handleSort("namaOrang")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Orang</span>
                      {sortField === "namaOrang" && (
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Project Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    MOB
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    DEMOB
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Durasi
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
                      {item.namaOrang}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.kualifikasi}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.projectName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.mob}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.demob}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.durasi}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleMPPClick(item)}
                        className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded transition-colors"
                        title="MPP"
                      >
                        <Users className="h-3.5 w-3.5 mr-1" />
                        MPP
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                  <td className="px-4 py-3 text-sm text-gray-900" colSpan={7}>
                    Total Records: {kontrakData.length}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900"></td>
                </tr>
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
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
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

      {/* Kontrak Modal */}
      <KontrakModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddKontrak}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaOrang}
      />

      {/* Approval Action Modal for Kontrak */}
      <ApprovalActionModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleApprovalConfirm}
        invoiceId={selectedKontrakIdForApproval} // Renamed to invoiceId in modal, but used for kontrakId here
        actionType={approvalActionType}
      />

      {/* MPP Modal */}
      <MPPModal
        isOpen={isMPPModalOpen}
        onClose={() => {
          setIsMPPModalOpen(false);
          setSelectedKontrakForMPP(null);
        }}
        onSave={handleMPPSave}
        kontrak={selectedKontrakForMPP}
      />
    </div>
  );
};

export default KontrakDashboard;
