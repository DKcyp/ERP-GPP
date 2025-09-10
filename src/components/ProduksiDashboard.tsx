import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { FileSpreadsheet, FileText, File, ArrowUp } from "lucide-react";

interface ProduksiData {
  id: string;
  no: number;
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  mob: string;
  demob: string;
  tglPenerimaanReportTeknisi: string;
  tglPenerimaanFinalReport: string;
  nilaiProduksi: string;
  statusReport: "Approved" | "Pending" | "Revisi";
}

const ProduksiDashboard: React.FC = () => {
  const auth = useAuth() as any;
  const user = auth?.user as { username: string; role: string } | undefined;
  const [searchSO, setSearchSO] = useState("");
  const [searchSOTurunan, setSearchSOTurunan] = useState("");
  const [searchNamaProject, setSearchNamaProject] = useState("");
  const [selectedStatusReport, setSelectedStatusReport] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ProduksiData | null>(null);
  const [sortField, setSortField] = useState<keyof ProduksiData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  // CRUD form state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProduksiData | null>(null);
  const [form, setForm] = useState<Omit<ProduksiData, "id" | "no">>({
    noSO: "",
    noSOTurunan: "",
    namaProyek: "",
    mob: "",
    demob: "",
    tglPenerimaanReportTeknisi: "",
    tglPenerimaanFinalReport: "",
    nilaiProduksi: "",
    statusReport: "Pending",
  });

  const handleAdd = () => {
    setEditingItem(null);
    setForm({
      noSO: "",
      noSOTurunan: "",
      namaProyek: "",
      mob: "",
      demob: "",
      tglPenerimaanReportTeknisi: "",
      tglPenerimaanFinalReport: "",
      nilaiProduksi: "",
      statusReport: "Pending",
    });
    setShowFormModal(true);
  };

  const handleEditClick = (item: ProduksiData) => {
    setEditingItem(item);
    setForm({
      noSO: item.noSO,
      noSOTurunan: item.noSOTurunan,
      namaProyek: item.namaProyek,
      mob: item.mob,
      demob: item.demob,
      tglPenerimaanReportTeknisi: item.tglPenerimaanReportTeknisi,
      tglPenerimaanFinalReport: item.tglPenerimaanFinalReport,
      nilaiProduksi: item.nilaiProduksi,
      statusReport: item.statusReport,
    });
    setShowFormModal(true);
  };

  const handleSave = () => {
    // basic validation
    if (!form.noSO || !form.noSOTurunan || !form.namaProyek) {
      alert("Mohon lengkapi No SO, No SO Turunan, dan Nama Proyek.");
      return;
    }

    if (editingItem) {
      setProduksiData((prev) =>
        prev.map((p) =>
          p.id === editingItem.id
            ? ({ ...editingItem, ...form } as ProduksiData)
            : p
        )
      );
    } else {
      // generate new id and sequential number
      const newId = `${Date.now()}`;
      const maxNo = produksiData.reduce((acc, cur) => Math.max(acc, cur.no), 0);
      const newItem: ProduksiData = {
        id: newId,
        no: maxNo + 1,
        ...form,
      };
      setProduksiData((prev) => [newItem, ...prev]);
    }
    setShowFormModal(false);
    setEditingItem(null);
  };

  // Sample data matching the first image
  const [produksiData, setProduksiData] = useState<ProduksiData[]>([
    {
      id: "1",
      no: 1,
      noSO: "SO101",
      noSOTurunan: "SO101.12",
      namaProyek: "Proyek A",
      mob: "01-02-2025",
      demob: "20-02-2025",
      tglPenerimaanReportTeknisi: "22-02-2025",
      tglPenerimaanFinalReport: "25-02-2025",
      nilaiProduksi: "Rp 80,000,000",
      statusReport: "Approved",
    },
    {
      id: "2",
      no: 2,
      noSO: "SO102",
      noSOTurunan: "SO102.33",
      namaProyek: "Proyek B",
      mob: "05-02-2025",
      demob: "25-02-2025",
      tglPenerimaanReportTeknisi: "27-02-2025",
      tglPenerimaanFinalReport: "-",
      nilaiProduksi: "Rp 30,000,000",
      statusReport: "Pending",
    },
    {
      id: "3",
      no: 3,
      noSO: "SO103",
      noSOTurunan: "SO103.12",
      namaProyek: "Proyek C",
      mob: "10-02-2025",
      demob: "28-02-2025",
      tglPenerimaanReportTeknisi: "02-03-2025",
      tglPenerimaanFinalReport: "06-03-2025",
      nilaiProduksi: "Rp 45,000,000",
      statusReport: "Approved",
    },
    {
      id: "4",
      no: 4,
      noSO: "SO104",
      noSOTurunan: "SO104.87",
      namaProyek: "Proyek D",
      mob: "15-02-2025",
      demob: "05-03-2025",
      tglPenerimaanReportTeknisi: "07-03-2025",
      tglPenerimaanFinalReport: "-",
      nilaiProduksi: "Rp 10,000,000",
      statusReport: "Revisi",
    },
  ]);

  const statusReportOptions = ["Approved", "Pending", "Revisi"];

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleDeleteClick = (produksi: ProduksiData) => {
    setItemToDelete(produksi);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setProduksiData((prev) => prev.filter((p) => p.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof ProduksiData) => {
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
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Revisi":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }

    // Filter data based on search criteria
    const filteredData = produksiData.filter((item) => {
      const matchesSO = item.noSO
        .toLowerCase()
        .includes(searchSO.toLowerCase());
      const matchesSOTurunan = item.noSOTurunan
        .toLowerCase()
        .includes(searchSOTurunan.toLowerCase());
      const matchesNamaProject = item.namaProyek
        .toLowerCase()
        .includes(searchNamaProject.toLowerCase());
      const matchesStatus = selectedStatusReport
        ? item.statusReport === selectedStatusReport
        : true;

      return (
        matchesSO && matchesSOTurunan && matchesNamaProject && matchesStatus
      );
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

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              DAFTAR PRODUKSI
            </h1>

            {/* Search and Filter Section */}
            <div className="space-y-4 mb-6">
              {/* First Row - Search Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Search SO */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cari SO
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={searchSO}
                      onChange={(e) => setSearchSO(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                      placeholder="SO001"
                    />
                    <button
                      onClick={handleSearch}
                      className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors text-sm"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Search SO Turunan */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cari SO Turunan
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
                      className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors text-sm"
                    >
                      Search
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
                      placeholder="Proyek Medco"
                    />
                    <button
                      onClick={handleSearch}
                      className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors text-sm"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Status Report Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pilih Status Report
                  </label>
                  <select
                    value={selectedStatusReport}
                    onChange={(e) => setSelectedStatusReport(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  >
                    <option value="">--Pilih Status Report--</option>
                    {statusReportOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
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

                {/* Search and Tambah Buttons (below Status Report) */}
                <div className="flex items-end lg:col-start-4">
                  <div className="w-full flex items-center gap-2 justify-end">
                    <button
                      onClick={handleSearch}
                      className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-sm"
                    >
                      Search
                    </button>
                    {user?.role === "operational" && (
                      <button
                        onClick={handleAdd}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors text-sm"
                      >
                        Tambah
                      </button>
                    )}
                  </div>
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

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={itemToDelete?.namaProyek}
        />

        {/* Add/Edit Form Modal */}
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? "Edit Produksi" : "Tambah Produksi"}
                </h2>
                <button
                  onClick={() => {
                    setShowFormModal(false);
                    setEditingItem(null);
                  }}
                  className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 text-sm"
                >
                  Tutup
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No SO
                  </label>
                  <input
                    type="text"
                    value={form.noSO}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, noSO: e.target.value }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                    placeholder="SO101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No SO Turunan
                  </label>
                  <input
                    type="text"
                    value={form.noSOTurunan}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, noSOTurunan: e.target.value }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                    placeholder="SO101.12"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Proyek
                  </label>
                  <input
                    type="text"
                    value={form.namaProyek}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, namaProyek: e.target.value }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                    placeholder="Masukkan nama proyek"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MOB
                  </label>
                  <input
                    type="text"
                    value={form.mob}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, mob: e.target.value }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DEMOB
                  </label>
                  <input
                    type="text"
                    value={form.demob}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, demob: e.target.value }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tgl Penerimaan Report Teknisi
                  </label>
                  <input
                    type="text"
                    value={form.tglPenerimaanReportTeknisi}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        tglPenerimaanReportTeknisi: e.target.value,
                      }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tgl Penerimaan Final Report
                  </label>
                  <input
                    type="text"
                    value={form.tglPenerimaanFinalReport}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        tglPenerimaanFinalReport: e.target.value,
                      }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                    placeholder="dd-mm-yyyy atau '-'"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nilai Produksi
                  </label>
                  <input
                    type="text"
                    value={form.nilaiProduksi}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nilaiProduksi: e.target.value }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                    placeholder="Rp 0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Report
                  </label>
                  <select
                    value={form.statusReport}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        statusReport: e.target
                          .value as ProduksiData["statusReport"],
                      }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Revisi">Revisi</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setShowFormModal(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
};

export default ProduksiDashboard;
