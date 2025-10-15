import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface TunjanganItem {
  id: string;
  namaTunjangan: string;
  jenisTunjangan: "Tetap" | "Variabel" | "Khusus";
  nominal: number;
  keterangan: string;
  status: "Aktif" | "Tidak Aktif";
  createdAt: string;
}

const MasterTunjanganHRDDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TunjanganItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TunjanganItem | null>(null);

  // Sample data (initial)
  const initialData: TunjanganItem[] = [
    {
      id: "1",
      namaTunjangan: "Tunjangan Transport",
      jenisTunjangan: "Tetap",
      nominal: 2000000,
      keterangan: "Tunjangan transportasi bulanan untuk semua karyawan",
      status: "Aktif",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      namaTunjangan: "Tunjangan Makan",
      jenisTunjangan: "Tetap",
      nominal: 1500000,
      keterangan: "Tunjangan makan harian karyawan",
      status: "Aktif",
      createdAt: "2024-01-15",
    },
    {
      id: "3",
      namaTunjangan: "Tunjangan Kinerja",
      jenisTunjangan: "Variabel",
      nominal: 5000000,
      keterangan: "Tunjangan berdasarkan pencapaian target kinerja",
      status: "Aktif",
      createdAt: "2024-01-20",
    },
    {
      id: "4",
      namaTunjangan: "Tunjangan Lembur",
      jenisTunjangan: "Variabel",
      nominal: 100000,
      keterangan: "Tunjangan per jam lembur",
      status: "Aktif",
      createdAt: "2024-01-25",
    },
    {
      id: "5",
      namaTunjangan: "Tunjangan Jabatan",
      jenisTunjangan: "Khusus",
      nominal: 3000000,
      keterangan: "Tunjangan khusus untuk posisi managerial",
      status: "Aktif",
      createdAt: "2024-02-01",
    },
  ];

  const [tunjanganData, setTunjanganData] = useState<TunjanganItem[]>(initialData);

  // Filter data
  const filteredData = tunjanganData.filter((item) => {
    const matchesSearch =
      item.namaTunjangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJenis =
      filterJenis === "" || item.jenisTunjangan === filterJenis;
    const matchesStatus = filterStatus === "" || item.status === filterStatus;

    return matchesSearch && matchesJenis && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    return status === "Aktif"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getJenisColor = (jenis: string) => {
    switch (jenis) {
      case "Tetap":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Variabel":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Khusus":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Handlers
  const openAddModal = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item: TunjanganItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const saveForm = (data: Omit<TunjanganItem, "id" | "createdAt"> & { id?: string; createdAt?: string }) => {
    if (editingItem) {
      // Edit existing
      setTunjanganData((prev) =>
        prev.map((it) => (it.id === editingItem.id ? { ...it, ...data } : it))
      );
    } else {
      // Add new
      const newItem: TunjanganItem = {
        id: Date.now().toString(),
        namaTunjangan: data.namaTunjangan,
        jenisTunjangan: data.jenisTunjangan,
        nominal: data.nominal,
        keterangan: data.keterangan,
        status: data.status,
        createdAt: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      };
      setTunjanganData((prev) => [newItem, ...prev]);
    }
    closeFormModal();
  };

  const openDeleteConfirm = (item: TunjanganItem) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setTunjanganData((prev) => prev.filter((it) => it.id !== itemToDelete.id));
    }
    setIsDeleteOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              MASTER TUNJANGAN
            </h1>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari tunjangan..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Jenis */}
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
            >
              <option value="">Semua Jenis</option>
              <option value="Tetap">Tetap</option>
              <option value="Variabel">Variabel</option>
              <option value="Khusus">Khusus</option>
            </select>

            {/* Filter Status */}
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>

            {/* Search Button */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Search className="h-4 w-4" />
              Cari
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mb-6">
            <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Tunjangan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nominal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keterangan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Dibuat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.namaTunjangan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getJenisColor(
                          item.jenisTunjangan
                        )}`}
                      >
                        {item.jenisTunjangan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">
                      {formatRupiah(item.nominal)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {item.keterangan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => openDeleteConfirm(item)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredData.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredData.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingItem ? "Edit Tunjangan" : "Tambah Tunjangan"}</h2>
              <button
                onClick={closeFormModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Nama Tunjangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tunjangan</label>
                <input
                  type="text"
                  defaultValue={editingItem?.namaTunjangan || ""}
                  onChange={(e) => setEditingItem((prev) => ({ ...(prev || { id: "", namaTunjangan: "", jenisTunjangan: "Tetap", nominal: 0, keterangan: "", status: "Aktif", createdAt: "" }), namaTunjangan: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Jenis Tunjangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
                <select
                  defaultValue={editingItem?.jenisTunjangan || "Tetap"}
                  onChange={(e) => setEditingItem((prev) => ({ ...(prev || { id: "", namaTunjangan: "", jenisTunjangan: "Tetap", nominal: 0, keterangan: "", status: "Aktif", createdAt: "" }), jenisTunjangan: e.target.value as TunjanganItem["jenisTunjangan"] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tetap">Tetap</option>
                  <option value="Variabel">Variabel</option>
                  <option value="Khusus">Khusus</option>
                </select>
              </div>

              {/* Nominal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nominal</label>
                <input
                  type="number"
                  defaultValue={editingItem?.nominal ?? 0}
                  onChange={(e) => setEditingItem((prev) => ({ ...(prev || { id: "", namaTunjangan: "", jenisTunjangan: "Tetap", nominal: 0, keterangan: "", status: "Aktif", createdAt: "" }), nominal: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea
                  defaultValue={editingItem?.keterangan || ""}
                  onChange={(e) => setEditingItem((prev) => ({ ...(prev || { id: "", namaTunjangan: "", jenisTunjangan: "Tetap", nominal: 0, keterangan: "", status: "Aktif", createdAt: "" }), keterangan: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  defaultValue={editingItem?.status || "Aktif"}
                  onChange={(e) => setEditingItem((prev) => ({ ...(prev || { id: "", namaTunjangan: "", jenisTunjangan: "Tetap", nominal: 0, keterangan: "", status: "Aktif", createdAt: "" }), status: e.target.value as TunjanganItem["status"] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={closeFormModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() =>
                  saveForm({
                    namaTunjangan: editingItem?.namaTunjangan || "",
                    jenisTunjangan: editingItem?.jenisTunjangan || "Tetap",
                    nominal: editingItem?.nominal || 0,
                    keterangan: editingItem?.keterangan || "",
                    status: editingItem?.status || "Aktif",
                  })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.namaTunjangan}
      />
    </div>
  );
};

export default MasterTunjanganHRDDashboard;
