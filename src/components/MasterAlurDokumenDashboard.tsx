import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  ArrowUp,
  FileStack,
  CheckSquare,
} from "lucide-react";

interface StatusDokumen {
  id: string;
  nama: string;
  deskripsi?: string;
}

interface AlurDokumen {
  id: string;
  nama: string;
  deskripsi?: string;
  statusDokumen: StatusDokumen[];
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya",
  cancelText = "Batal",
  confirmButtonColor = "bg-red-600 hover:bg-red-700",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md transition-colors ${confirmButtonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const MasterAlurDokumenDashboard: React.FC = () => {
  const [searchNamaAlur, setSearchNamaAlur] = useState("");
  const [searchDeskripsi, setSearchDeskripsi] = useState("");
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof AlurDokumen | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [alurDokumenData, setAlurDokumenData] = useState<AlurDokumen[]>([
    {
      id: "1",
      nama: "Project PHE ONWJ",
      deskripsi: "Alur dokumen untuk project PHE ONWJ",
      statusDokumen: [
        {
          id: "1-1",
          nama: "open GBP",
          deskripsi: "Status awal untuk project PHE ONWJ",
        },
        {
          id: "1-2",
          nama: "Review Report PHE",
          deskripsi: "Review laporan PHE",
        },
        {
          id: "1-3",
          nama: "Revisi Report GBP",
          deskripsi: "Revisi laporan GBP",
        },
      ],
    },
    {
      id: "2",
      nama: "Project Medco Gresik",
      deskripsi: "Alur dokumen untuk project Medco Gresik",
      statusDokumen: [
        {
          id: "2-1",
          nama: "Review Report",
          deskripsi: "Review laporan project",
        },
        {
          id: "2-2",
          nama: "Submit Report",
          deskripsi: "Submit laporan final",
        },
        {
          id: "2-3",
          nama: "Verifikasi Report BA (EWAN)",
          deskripsi: "Verifikasi oleh BA EWAN",
        },
      ],
    },
  ]);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingStatus, setEditingStatus] = useState<{
    alurId: string;
    statusId: string;
    nama: string;
    deskripsi: string;
  } | null>(null);
  const [showAddAlurModal, setShowAddAlurModal] = useState(false);
  const [showAddStatusModal, setShowAddStatusModal] = useState(false);
  const [selectedAlurId, setSelectedAlurId] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<{
    alurId: string;
    statusId: string;
    nama: string;
  } | null>(null);

  // Form states
  const [alurFormData, setAlurFormData] = useState({
    nama: "",
    deskripsi: "",
  });

  const [statusFormData, setStatusFormData] = useState({
    nama: "",
    deskripsi: "",
  });

  // Animation effect
  useEffect(() => {
    setAnimateRows(true);
  }, []);

  // Filter data
  const filteredData = alurDokumenData.filter((alur) => {
    const matchesNama = alur.nama
      .toLowerCase()
      .includes(searchNamaAlur.toLowerCase());
    const matchesDeskripsi =
      alur.deskripsi?.toLowerCase().includes(searchDeskripsi.toLowerCase()) ||
      false;
    return matchesNama && matchesDeskripsi;
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

  const handleSort = (field: keyof AlurDokumen) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleRowExpansion = (alurId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(alurId)) {
      newExpandedRows.delete(alurId);
    } else {
      newExpandedRows.add(alurId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleAddAlur = () => {
    if (alurFormData.nama.trim()) {
      const newAlur: AlurDokumen = {
        id: Date.now().toString(),
        nama: alurFormData.nama,
        deskripsi: alurFormData.deskripsi,
        statusDokumen: [],
      };
      setAlurDokumenData([...alurDokumenData, newAlur]);
      setAlurFormData({ nama: "", deskripsi: "" });
      setShowAddAlurModal(false);
    }
  };

  const handleAddStatus = () => {
    if (statusFormData.nama.trim() && selectedAlurId) {
      const newStatus: StatusDokumen = {
        id: Date.now().toString(),
        nama: statusFormData.nama,
        deskripsi: statusFormData.deskripsi,
      };

      setAlurDokumenData((prev) =>
        prev.map((alur) =>
          alur.id === selectedAlurId
            ? {
                ...alur,
                statusDokumen: [...alur.statusDokumen, newStatus],
              }
            : alur
        )
      );

      setStatusFormData({ nama: "", deskripsi: "" });
      setShowAddStatusModal(false);
      setSelectedAlurId("");
    }
  };

  const handleEditStatus = (alurId: string, statusId: string) => {
    const alur = alurDokumenData.find((a) => a.id === alurId);
    const status = alur?.statusDokumen.find((s) => s.id === statusId);
    if (status) {
      setEditingStatus({
        alurId,
        statusId,
        nama: status.nama,
        deskripsi: status.deskripsi || "",
      });
    }
  };

  const handleSaveEdit = () => {
    if (editingStatus) {
      setAlurDokumenData((prev) =>
        prev.map((alur) =>
          alur.id === editingStatus.alurId
            ? {
                ...alur,
                statusDokumen: alur.statusDokumen.map((status) =>
                  status.id === editingStatus.statusId
                    ? {
                        ...status,
                        nama: editingStatus.nama,
                        deskripsi: editingStatus.deskripsi,
                      }
                    : status
                ),
              }
            : alur
        )
      );
      setEditingStatus(null);
    }
  };

  const handleDeleteStatus = (
    alurId: string,
    statusId: string,
    nama: string
  ) => {
    setStatusToDelete({ alurId, statusId, nama });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteStatus = () => {
    if (statusToDelete) {
      setAlurDokumenData((prev) =>
        prev.map((alur) =>
          alur.id === statusToDelete.alurId
            ? {
                ...alur,
                statusDokumen: alur.statusDokumen.filter(
                  (status) => status.id !== statusToDelete.statusId
                ),
              }
            : alur
        )
      );
      setShowDeleteConfirm(false);
      setStatusToDelete(null);
    }
  };

  const openAddStatusModal = (alurId: string) => {
    setSelectedAlurId(alurId);
    setShowAddStatusModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Title */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
          MASTER ALUR DOKUMEN
        </h1>
        <nav className="text-sm text-gray-600">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            Operational
          </span>
          <span className="mx-2">›</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            Master
          </span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 font-medium">Alur Dokumen</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Inputs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Search Nama Alur */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Alur
                </label>
                <input
                  type="text"
                  value={searchNamaAlur}
                  onChange={(e) => setSearchNamaAlur(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Project PHE ONWJ"
                />
              </div>

              {/* Search Deskripsi */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Deskripsi
                </label>
                <input
                  type="text"
                  value={searchDeskripsi}
                  onChange={(e) => setSearchDeskripsi(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Alur dokumen untuk project"
                />
              </div>

              {/* Search Button */}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileStack className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Alur Dokumen
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {alurDokumenData.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckSquare className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Status
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {alurDokumenData.reduce(
                      (total, alur) => total + alur.statusDokumen.length,
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Plus className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => setShowAddAlurModal(true)}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Tambah Alur Dokumen
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Klik untuk menambah
                  </p>
                </div>
              </div>
            </div>
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
                    onClick={() => handleSort("nama")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Alur Dokumen</span>
                      {sortField === "nama" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Deskripsi
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("statusDokumen")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Jumlah Status</span>
                      {sortField === "statusDokumen" && (
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
                {currentData.map((alur, index) => (
                  <React.Fragment key={alur.id}>
                    <tr
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      } ${
                        animateRows
                          ? "animate-in fade-in slide-in-from-bottom-2"
                          : "opacity-0"
                      }`}
                      style={{
                        animationDelay: animateRows
                          ? `${index * 100}ms`
                          : "0ms",
                        animationFillMode: "forwards",
                      }}
                    >
                      <td
                        className="px-4 py-3 text-sm text-gray-900 cursor-pointer"
                        onClick={() => toggleRowExpansion(alur.id)}
                      >
                        <div className="flex items-center">
                          {expandedRows.has(alur.id) ? (
                            <ChevronDown className="w-4 h-4 mr-2 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-2 text-gray-400" />
                          )}
                          <span className="font-medium">{alur.nama}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {alur.deskripsi || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {alur.statusDokumen.length}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddStatusModal(alur.id);
                          }}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                          title="Tambah Status"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Tambah Status
                        </button>
                      </td>
                    </tr>
                    {expandedRows.has(alur.id) && (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 bg-gray-50">
                          <div className="ml-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                              <CheckSquare className="w-4 h-4 mr-2 text-gray-500" />
                              Status Dokumen
                            </h4>
                            <div className="space-y-2">
                              {alur.statusDokumen.map((status) => (
                                <div
                                  key={status.id}
                                  className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">
                                      {status.nama}
                                    </div>
                                    {status.deskripsi && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {status.deskripsi}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() =>
                                        handleEditStatus(alur.id, status.id)
                                      }
                                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                      title="Edit Status"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteStatus(
                                          alur.id,
                                          status.id,
                                          status.nama
                                        )
                                      }
                                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                      title="Hapus Status"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {alur.statusDokumen.length === 0 && (
                                <div className="text-sm text-gray-500 italic p-3 text-center">
                                  Belum ada status dokumen
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}

                {/* Total Row */}
                <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                  <td className="px-4 py-3 text-sm text-gray-900" colSpan={3}>
                    Total Records: {alurDokumenData.length}
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

      {/* Add Alur Dokumen Modal */}
      {showAddAlurModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tambah Alur Dokumen
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Alur Dokumen
                </label>
                <input
                  type="text"
                  value={alurFormData.nama}
                  onChange={(e) =>
                    setAlurFormData({ ...alurFormData, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama alur dokumen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={alurFormData.deskripsi}
                  onChange={(e) =>
                    setAlurFormData({
                      ...alurFormData,
                      deskripsi: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Masukkan deskripsi alur dokumen"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddAlurModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddAlur}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Status Dokumen Modal */}
      {showAddStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tambah Status Dokumen
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Status
                </label>
                <input
                  type="text"
                  value={statusFormData.nama}
                  onChange={(e) =>
                    setStatusFormData({
                      ...statusFormData,
                      nama: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama status"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={statusFormData.deskripsi}
                  onChange={(e) =>
                    setStatusFormData({
                      ...statusFormData,
                      deskripsi: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Masukkan deskripsi status"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddStatusModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editingStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Status Dokumen
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Status
                </label>
                <input
                  type="text"
                  value={editingStatus.nama}
                  onChange={(e) =>
                    setEditingStatus({
                      ...editingStatus,
                      nama: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={editingStatus.deskripsi}
                  onChange={(e) =>
                    setEditingStatus({
                      ...editingStatus,
                      deskripsi: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingStatus(null)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteStatus}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus status "${statusToDelete?.nama}"?`}
        confirmText="Hapus"
        cancelText="Batal"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default MasterAlurDokumenDashboard;
