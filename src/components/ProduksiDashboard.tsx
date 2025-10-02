import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Factory, // Icon for Produksi
} from "lucide-react";

interface ProduksiEntry {
  id: string;
  tanggal: string;
  namaProduk: string;
  jumlah: number;
  satuan: string;
  status: "Planned" | "In Progress" | "Completed" | "Cancelled";
  keterangan?: string;
}

const ProduksiDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    ProduksiEntry["status"] | ""
  >("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<ProduksiEntry | null>(null);
  const [formData, setFormData] = useState<Omit<ProduksiEntry, "id">>({
    tanggal: "",
    namaProduk: "",
    jumlah: 0,
    satuan: "",
    status: "Planned",
    keterangan: "",
  });

  const [data, setData] = useState<ProduksiEntry[]>([
    {
      id: "1",
      tanggal: "2025-01-10",
      namaProduk: "Produk A",
      jumlah: 100,
      satuan: "pcs",
      status: "Completed",
      keterangan: "Batch pertama selesai",
    },
    {
      id: "2",
      tanggal: "2025-01-15",
      namaProduk: "Produk B",
      jumlah: 250,
      satuan: "kg",
      status: "In Progress",
      keterangan: "Sedang dalam proses",
    },
    {
      id: "3",
      tanggal: "2025-01-20",
      namaProduk: "Produk C",
      jumlah: 50,
      satuan: "unit",
      status: "Planned",
      keterangan: "Akan dimulai minggu depan",
    },
  ]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.namaProduk.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.keterangan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.satuan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((entry) => entry.status === filterStatus);
    }
    return filtered;
  }, [data, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, filteredData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setCurrentEntry(null);
    setFormData({
      tanggal: new Date().toISOString().split("T")[0],
      namaProduk: "",
      jumlah: 0,
      satuan: "",
      status: "Planned",
      keterangan: "",
    });
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (entry: ProduksiEntry) => {
    setCurrentEntry(entry);
    setFormData({ ...entry });
    setIsAddEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddEditModalOpen(false);
    setCurrentEntry(null);
    setFormData({
      tanggal: "",
      namaProduk: "",
      jumlah: 0,
      satuan: "",
      status: "Planned",
      keterangan: "",
    });
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "jumlah" ? (value === "" ? 0 : parseInt(value, 10)) : value,
    }));
  };

  const handleSave = () => {
    if (currentEntry) {
      // Edit existing entry
      setData((prev) =>
        prev.map((entry) =>
          entry.id === currentEntry.id ? { ...formData, id: entry.id } : entry
        )
      );
    } else {
      // Add new entry
      setData((prev) => [
        ...prev,
        { ...formData, id: String(prev.length + 1) },
      ]);
    }
    handleModalClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setData((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Factory className="h-7 w-7 text-blue-600" />
          Produksi Dashboard
        </h1>

        {/* Filters and Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search product, notes..."
                className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <select
              className="w-full md:w-48 px-4 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as ProduksiEntry["status"] | "")
              }
            >
              <option value="">All Status</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors w-full md:w-auto justify-center"
            onClick={openAddModal}
          >
            <Plus className="h-4 w-4" />
            Tambah Produksi
          </button>
        </div>

        {/* Produksi Table */}
        <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keterangan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTableData.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.tanggal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {entry.namaProduk}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {entry.jumlah}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {entry.satuan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          entry.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : entry.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : entry.status === "Planned"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {entry.keterangan || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => openEditModal(entry)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(entry.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentTableData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded-lg px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentEntry ? "Edit Produksi" : "Tambah Produksi"}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  name="namaProduk"
                  value={formData.namaProduk}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg text-sm"
                  placeholder="e.g., Kemeja, Celana"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah
                </label>
                <input
                  type="number"
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg text-sm"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Satuan
                </label>
                <input
                  type="text"
                  name="satuan"
                  value={formData.satuan}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg text-sm"
                  placeholder="e.g., pcs, kg, unit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg text-sm"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg text-sm"
                  placeholder="Tambahkan keterangan produksi..."
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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

export default ProduksiDashboard;
