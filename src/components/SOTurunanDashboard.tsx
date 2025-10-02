import React, { useState, useEffect } from "react";
import SOTurunanModal, { SOTurunanFormData } from "./SOTurunanModal";
import RequestSOTurunanModal from "./RequestSOTurunanModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Plus, FileSpreadsheet, FileText, File } from "lucide-react";

interface SOTurunan {
  id: string;
  no: number;
  noSO: string;
  soTurunan: string;
  namaProyek: string; // renamed from namaClient
  mob: string; // tanggal MOB (DD-MM-YYYY)
  demob: string; // tanggal DEMOB (DD-MM-YYYY)
  nilaiKontrak: string;
  hpp: string;
  nilaiProduksi: string;
  actualPenagihan: string;
  delayPenagihan: string; // e.g., "229 Hari"
  status: "Menunggu Review" | "Approve" | "Reject";
  statusDitagihkan: "Sudah Ditagihkan" | "Belum Ditagihkan";
}

interface SOTurunanDashboardProps {
  role?: string;
}

const SOTurunanDashboard: React.FC<SOTurunanDashboardProps> = ({ role }) => {
  const [searchNoSO, setSearchNoSO] = useState("");
  const [searchNamaProject, setSearchNamaProject] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readOnlyModal, setReadOnlyModal] = useState(false);
  const [initialModalData, setInitialModalData] =
    useState<Partial<SOTurunanFormData> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SOTurunan | null>(null);

  // Debug: log current role for this page
  useEffect(() => {
    console.log("[SOTurunanDashboard] role:", role);
  }, [role]);
  // Sample data matching the provided image
  const [soTurunanData, setSOTurunanData] = useState<SOTurunan[]>([
    {
      id: "1",
      no: 1,
      noSO: "SO001",
      soTurunan: "SO001.12",
      namaProyek: "Proyek PHE ONWJ",
      mob: "24-12-2024",
      demob: "24-01-2025",
      nilaiKontrak: "Rp 100.000.000",
      hpp: "Rp 50.000.000",
      nilaiProduksi: "Rp 75.000.000",
      actualPenagihan: "Rp 68.000.000",
      delayPenagihan: "229 Hari",
      status: "Menunggu Review",
      statusDitagihkan: "Belum Ditagihkan",
    },
    {
      id: "2",
      no: 2,
      noSO: "SO002",
      soTurunan: "SO002.22",
      namaProyek: "Proyek OSES",
      mob: "24-12-2024",
      demob: "24-01-2025",
      nilaiKontrak: "Rp 90.000.000",
      hpp: "Rp 45.000.000",
      nilaiProduksi: "Rp 60.000.000",
      actualPenagihan: "Rp 50.000.000",
      delayPenagihan: "229 Hari",
      status: "Approve",
      statusDitagihkan: "Sudah Ditagihkan",
    },
    {
      id: "3",
      no: 3,
      noSO: "SO003",
      soTurunan: "SO003.124",
      namaProyek: "Proyek MEDCO",
      mob: "01-01-2025",
      demob: "20-01-2025",
      nilaiKontrak: "Rp 150.000.000",
      hpp: "Rp 80.000.000",
      nilaiProduksi: "Rp 130.000.000",
      actualPenagihan: "Rp 115.000.000",
      delayPenagihan: "233 Hari",
      status: "Reject",
      statusDitagihkan: "Belum Ditagihkan",
    },
    {
      id: "4",
      no: 4,
      noSO: "SO004",
      soTurunan: "SO004.21",
      namaProyek: "Proyek A",
      mob: "01-01-2025",
      demob: "01-02-2025",
      nilaiKontrak: "Rp 120.000.000",
      hpp: "Rp 60.000.000",
      nilaiProduksi: "Rp 100.000.000",
      actualPenagihan: "Rp 85.000.000",
      delayPenagihan: "252 Hari",
      status: "Menunggu Review",
      statusDitagihkan: "Sudah Ditagihkan",
    },
  ]);

  useEffect(() => {
    // No animation trigger
  }, []);

  const handleAddSOTurunan = (formData: SOTurunanFormData) => {
    const newSOTurunan: SOTurunan = {
      id: (soTurunanData.length + 1).toString(),
      no: soTurunanData.length + 1,
      noSO: formData.soInduk,
      soTurunan: formData.soTurunan,
      namaProyek: formData.namaProyek || formData.namaClient || "",
      mob: formData.tanggalMOB
        ? new Date(formData.tanggalMOB).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "",
      demob: formData.tanggalDemob
        ? new Date(formData.tanggalDemob).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "",
      nilaiKontrak: formData.estimasiSO || "Rp 0",
      hpp: "Rp 0",
      nilaiProduksi: "Rp 0",
      actualPenagihan: "Rp 0",
      delayPenagihan: "0 Hari",
      status: "Menunggu Review",
      statusDitagihkan: formData.statusDitagihkan || "Belum Ditagihkan", // Include new Status Ditagihkan field
    };
    setSOTurunanData((prev) => [
      newSOTurunan,
      ...prev.map((s) => ({ ...s, no: s.no + 1 })),
    ]);
  };

  const openProcess = (item: SOTurunan) => {
    // Open modal to process this SO Turunan
    setReadOnlyModal(false);
    setInitialModalData({
      soInduk: item.noSO,
      soTurunan: item.soTurunan,
      namaProyek: item.namaProyek,
      tanggalMOB: toISODate(item.mob),
      tanggalDemob: toISODate(item.demob),
      estimasiSO: item.nilaiKontrak,
      nomorKontrak: "",
      jenisPekerjaan: "",
      keterangan: "",
      statusDitagihkan: item.statusDitagihkan,
    });
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: SOTurunan["status"]) => {
    switch (status) {
      case "Menunggu Review":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Approve":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Reject":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusDitagihkanBadge = (status: SOTurunan["statusDitagihkan"]) => {
    switch (status) {
      case "Sudah Ditagihkan":
        return "bg-green-100 text-green-800 border-green-200";
      case "Belum Ditagihkan":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDeleteClick = (soTurunan: SOTurunan) => {
    setItemToDelete(soTurunan);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setSOTurunanData((prev) => prev.filter((s) => s.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  // Filter data based on search criteria
  const filteredData = soTurunanData.filter((item) => {
    const matchesNoSO = item.noSO
      .toLowerCase()
      .includes(searchNoSO.toLowerCase());
    const matchesNamaProject = item.namaProyek
      .toLowerCase()
      .includes(searchNamaProject.toLowerCase());

    return matchesNoSO && matchesNamaProject;
  });

  // Sort data
  const sortedData = [...filteredData]; // No sorting for now as handleSort is removed

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / 10); // itemsPerPage is now hardcoded to 10
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  const openAddModal = () => {
    setReadOnlyModal(false);
    setInitialModalData(null);
    setIsModalOpen(true);
  };

  const toISODate = (ddmmyyyy: string) => {
    // input expected 'DD-MM-YYYY'
    const parts = ddmmyyyy.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return ddmmyyyy;
  };

  const openViewModal = (item: SOTurunan) => {
    setReadOnlyModal(true);
    setInitialModalData({
      soInduk: item.noSO,
      soTurunan: item.soTurunan,
      namaProyek: item.namaProyek,
      tanggalMOB: toISODate(item.mob),
      tanggalDemob: toISODate(item.demob),
      estimasiSO: item.nilaiKontrak,
      // Fields not present in list remain empty
      nomorKontrak: "",
      jenisPekerjaan: "",
      keterangan: "",
      statusDitagihkan: item.statusDitagihkan,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR SO TURUNAN
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Operational
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Sales Order
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">SO Turunan</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
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

          {/* Search and Filter Section (compact) */}
          <div className="space-y-3 mb-4 text-xs">
            {/* Inputs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Search No SO */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Cari No SO
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchNoSO}
                    onChange={(e) => {
                      setSearchNoSO(e.target.value);
                      handleSearch();
                    }}
                    className="w-full pl-2 pr-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                    placeholder="SO001"
                  />
                </div>
              </div>

              {/* Search Nama Project */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Cari Nama Project
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchNamaProject}
                    onChange={(e) => {
                      setSearchNamaProject(e.target.value);
                      handleSearch();
                    }}
                    className="w-full pl-2 pr-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                    placeholder="PHE ONWJ"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  />
                </div>
              </div>
            </div>
            {/* Removed explicit search and tambah buttons; filtering triggers on change */}
          </div>
          {role === "operational" && (
            <div className="flex justify-end">
              <button
                onClick={openAddModal}
                className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>
          )}
        </div>
        {/* Quick Export Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
            <div className="flex space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-1.5">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-1.5">
                <File className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-1.5">
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 text-xs">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    No SO
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    SO Turunan
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    Nama Proyek
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    MOB
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    DEMOB
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    Nilai Kontrak
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    HPP
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    Nilai Produksi
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    Actual Penagihan
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    Delay Penagihan
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">
                    Status Ditagihkan
                  </th>
                  <th className="px-2 py-2 text-center font-medium text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="px-2 py-2 text-xs text-gray-900 font-medium">
                      {item.noSO}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900">
                      {item.soTurunan}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900">
                      {item.namaProyek}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-600">
                      {item.mob}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-600">
                      {item.demob}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900 font-medium">
                      {item.nilaiKontrak}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900">
                      {item.hpp}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900">
                      {item.nilaiProduksi}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900">
                      {item.actualPenagihan}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900">
                      {item.delayPenagihan}
                    </td>
                    <td className="px-2 py-2 text-xs">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusDitagihkanBadge(
                          item.statusDitagihkan
                        )}`}
                      >
                        {item.statusDitagihkan}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      {role === "operational" && item.status !== "Approve" && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openProcess(item)}
                            className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="px-2 py-1 bg-rose-600 text-white rounded-lg text-xs hover:bg-rose-700 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                      {role === "operational2" && (
                        <button
                          onClick={() => openViewModal(item)}
                          className="px-2 py-1 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700 transition-colors"
                        >
                          Detail
                        </button>
                      )}
                      {role !== "operational" && role !== "operational2" && (
                        <button
                          onClick={() => openProcess(item)}
                          className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
                        >
                          Proses
                        </button>
                      )}
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
                Showing {currentData.length === 0 ? 0 : startIndex + 1} to{" "}
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
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
                    )
                  )}
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
        {role === "operational" ? (
          <RequestSOTurunanModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddSOTurunan}
          />
        ) : (
          <SOTurunanModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddSOTurunan}
            readOnly={readOnlyModal}
            initialData={initialModalData}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={itemToDelete?.namaProyek}
        />
      </div>
    </div>
  );
};

export default SOTurunanDashboard;
