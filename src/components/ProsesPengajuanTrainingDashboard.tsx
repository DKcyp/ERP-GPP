import React, { useState, useEffect } from "react";
import ProsesPengajuanTrainingModal from "./ProsesPengajuanTrainingModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import RealisasiDocumentUploadModal from "./RealisasiDocumentUploadModal"; // Import the new modal
import {
  ProsesPengajuanTrainingFormData,
  RealisasiDocumentUploadFormData,
} from "../types"; // Import the new FormData type
import {
  Search,
  Plus,
  FileSpreadsheet,
  FileText,
  File,
  Edit,
  Trash2,
  ArrowUp,
  CheckCircle,
  FileUp,
} from "lucide-react";

// Updated interface for the dashboard's training data
interface ProsesPengajuanTraining {
  id: string;
  no: number;
  namaPersonil: string;
  jenisPelatihan: string;
  lokasiPelatihan: string;
  tanggalPelaksanaan: string; // ISO date
  pid: "PID" | "TIDAK";
}

interface ProsesPengajuanTrainingDashboardProps {
  role?: string; // Add role prop
}

const ProsesPengajuanTrainingDashboard: React.FC<
  ProsesPengajuanTrainingDashboardProps
> = ({ role }) => {
  const [searchNama, setSearchNama] = useState("");
  const [searchJenis, setSearchJenis] = useState("");
  const [searchLokasi, setSearchLokasi] = useState("");
  const [pidFilter, setPidFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRealisasiModalOpen, setIsRealisasiModalOpen] = useState(false); // New state for Realisasi modal
  const [selectedTrainingForRealisasi, setSelectedTrainingForRealisasi] =
    useState<ProsesPengajuanTraining | null>(null); // To pass data to Realisasi modal
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] =
    useState<ProsesPengajuanTraining | null>(null);
  const [sortField, setSortField] = useState<
    keyof ProsesPengajuanTraining | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sample data matching the new structure
  const [trainingData, setTrainingData] = useState<ProsesPengajuanTraining[]>([
    {
      id: "1",
      no: 1,
      namaPersonil: "Budi Santoso",
      jenisPelatihan: "K3 Dasar",
      lokasiPelatihan: "Jakarta",
      tanggalPelaksanaan: "2025-01-12",
      pid: "PID",
    },
    {
      id: "2",
      no: 2,
      namaPersonil: "Ani Wijaya",
      jenisPelatihan: "Leadership",
      lokasiPelatihan: "Bandung",
      tanggalPelaksanaan: "2025-03-15",
      pid: "TIDAK",
    },
  ]);

  // removed: jenisTrainingOptions (legacy)

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  // Add this useEffect to log the role
  useEffect(() => {
    console.log("Current role in ProsesPengajuanTrainingDashboard:", role);
  }, [role]); // Re-run when role changes

  const handleAddTraining = (data: ProsesPengajuanTrainingFormData) => {
    const newTraining: ProsesPengajuanTraining = {
      id: (trainingData.length + 1).toString(),
      no: trainingData.length + 1,
      namaPersonil: data.namaPersonil,
      jenisPelatihan: data.jenisPelatihan,
      lokasiPelatihan: data.lokasiPelatihan,
      tanggalPelaksanaan: data.tanggalPelaksanaan,
      pid: data.pid,
    };
    setTrainingData((prev) => [
      newTraining,
      ...prev.map((t) => ({ ...t, no: t.no + 1 })),
    ]);
  };

  const handleDeleteClick = (training: ProsesPengajuanTraining) => {
    setItemToDelete(training);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setTrainingData((prev) => prev.filter((t) => t.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof ProsesPengajuanTraining) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handler for opening Realisasi modal
  const handleRealisasiClick = (training: ProsesPengajuanTraining) => {
    setSelectedTrainingForRealisasi(training);
    setIsRealisasiModalOpen(true);
  };

  // Handler for Realisasi document upload
  const handleRealisasiUpload = (data: RealisasiDocumentUploadFormData) => {
    console.log("Realisasi Document Uploaded:", data);
    // Here you would typically send the data to a backend API
    // For now, just log it and close the modal
    setIsRealisasiModalOpen(false);
    setSelectedTrainingForRealisasi(null);
    alert(
      `Dokumen realisasi untuk No Training ${data.noTraining} berhasil diunggah!`
    );
  };

  // Filter data based on search criteria
  const filteredData = trainingData.filter((item) => {
    const matchNama = searchNama
      ? item.namaPersonil.toLowerCase().includes(searchNama.toLowerCase())
      : true;
    const matchJenis = searchJenis
      ? item.jenisPelatihan.toLowerCase().includes(searchJenis.toLowerCase())
      : true;
    const matchLokasi = searchLokasi
      ? item.lokasiPelatihan.toLowerCase().includes(searchLokasi.toLowerCase())
      : true;
    const matchPid = pidFilter
      ? item.pid === (pidFilter as "PID" | "TIDAK")
      : true;
    const matchesDateRange =
      (!dateFrom || item.tanggalPelaksanaan >= dateFrom) &&
      (!dateTo || item.tanggalPelaksanaan <= dateTo);
    return (
      matchNama && matchJenis && matchLokasi && matchPid && matchesDateRange
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    // Fallback for other types or if comparison fails
    return 0;
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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-text">PR Training</h1>
            {/* Conditional rendering for "Tambah" button: hidden for management and HRD roles */}
            {role !== "management" && role !== "hrd" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-success hover:bg-success/80 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-success/25 flex items-center space-x-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            )}
          </div>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* First Row - Search Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-textSecondary">
                  Cari Nama Personil
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNama}
                    onChange={(e) => setSearchNama(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent text-sm bg-surface text-text"
                    placeholder="Budi Santoso"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-3 py-2 bg-secondary text-white rounded-md hover:bg-secondary/80 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-textSecondary">
                  Jenis Pelatihan
                </label>
                <input
                  type="text"
                  value={searchJenis}
                  onChange={(e) => setSearchJenis(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent text-sm bg-surface text-text"
                  placeholder="K3, Leadership"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-textSecondary">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={searchLokasi}
                  onChange={(e) => setSearchLokasi(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent text-sm bg-surface text-text"
                  placeholder="Jakarta"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-textSecondary">
                  PID
                </label>
                <select
                  value={pidFilter}
                  onChange={(e) => setPidFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent text-sm bg-surface text-text"
                >
                  <option value="">Semua</option>
                  <option value="PID">PID</option>
                  <option value="TIDAK">TIDAK</option>
                </select>
              </div>
            </div>

            {/* Second Row - Dropdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-medium text-textSecondary">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent text-sm bg-surface text-text"
                    placeholder="03/03/2025"
                  />
                  <span className="text-sm text-textSecondary">s.d</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent text-sm bg-surface text-text"
                    placeholder="03/03/2025"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-textSecondary opacity-0">
                  Search
                </label>
                <button
                  onClick={handleSearch}
                  className="w-full px-6 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-md font-medium transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end space-x-2 mb-6">
            <button className="bg-success hover:bg-success/80 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-primary hover:bg-primary/80 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <File className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="bg-error hover:bg-error/80 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Show entries control */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-textSecondary">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-1 border border-border rounded text-sm focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-textSecondary">entries</span>
        </div>

        {/* Data Table */}
        <div className="bg-surface rounded-lg shadow border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-textSecondary cursor-pointer hover:bg-border transition-colors"
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
                    className="px-4 py-3 text-left text-sm font-medium text-textSecondary cursor-pointer hover:bg-border transition-colors"
                    onClick={() => handleSort("namaPersonil")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Personil</span>
                      {sortField === "namaPersonil" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-textSecondary">
                    Jenis Pelatihan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-textSecondary">
                    Lokasi
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-textSecondary cursor-pointer hover:bg-border transition-colors"
                    onClick={() => handleSort("tanggalPelaksanaan")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal Pelaksanaan</span>
                      {sortField === "tanggalPelaksanaan" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-textSecondary">
                    PID
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-textSecondary">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-border transition-colors ${
                      index % 2 === 0 ? "bg-surface" : "bg-background"
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
                    <td className="px-4 py-3 text-sm text-text">{item.no}</td>
                    <td className="px-4 py-3 text-sm text-text font-medium">
                      {item.namaPersonil}
                    </td>
                    <td className="px-4 py-3 text-sm text-text">
                      {item.jenisPelatihan}
                    </td>
                    <td className="px-4 py-3 text-sm text-text">
                      {item.lokasiPelatihan}
                    </td>
                    <td className="px-4 py-3 text-sm text-textSecondary">
                      {item.tanggalPelaksanaan}
                    </td>
                    <td className="px-4 py-3 text-sm text-text">{item.pid}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        {/* Conditional rendering for action buttons based on role */}
                        {role === "management" || role === "hrd" ? ( // If role is management OR hrd, show Approve and Realisasi
                          <>
                            <button
                              onClick={() => setIsModalOpen(true)} // This would typically open an approval modal
                              className="p-1.5 text-success hover:bg-success/10 rounded transition-all duration-200 hover:scale-110"
                              title="Approve"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                            {role === "hrd" && ( // Only show Realisasi for HRD
                              <button
                                onClick={() => handleRealisasiClick(item)}
                                className="p-1.5 text-primary hover:bg-primary/10 rounded transition-all duration-200 hover:scale-110"
                                title="Realisasi"
                              >
                                <FileUp className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </>
                        ) : (
                          // Otherwise (for other roles), show Edit and Delete
                          <>
                            <button
                              onClick={() => setIsModalOpen(true)} // For editing, will need to pass item data
                              className="p-1.5 text-primary hover:bg-primary/10 rounded transition-all duration-200 hover:scale-110"
                              title="Edit"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="p-1.5 text-error hover:bg-error/10 rounded transition-all duration-200 hover:scale-110"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-background px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-textSecondary">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredData.length)} of{" "}
                {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-textSecondary hover:text-text hover:bg-border rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                          currentPage === page
                            ? "bg-primary text-white"
                            : "text-textSecondary hover:bg-border"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-textSecondary hover:text-text hover:bg-border rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Modal (for Add/Edit) */}
      <ProsesPengajuanTrainingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTraining}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={
          itemToDelete
            ? `${itemToDelete.namaPersonil} - ${itemToDelete.jenisPelatihan}`
            : undefined
        }
      />

      {/* Realisasi Document Upload Modal */}
      {selectedTrainingForRealisasi && (
        <RealisasiDocumentUploadModal
          isOpen={isRealisasiModalOpen}
          onClose={() => setIsRealisasiModalOpen(false)}
          onUpload={handleRealisasiUpload}
          noTraining={`${selectedTrainingForRealisasi.namaPersonil} - ${selectedTrainingForRealisasi.jenisPelatihan}`}
        />
      )}
    </div>
  );
};

export default ProsesPengajuanTrainingDashboard;
