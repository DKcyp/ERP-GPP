import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock, Search, Download, Plus, Edit, Trash2 } from "lucide-react";
import Modal from "./Modal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface AssetItem {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  tanggalPerolehan: string; // yyyy-mm-dd
  nilaiPerolehan: number;
  lokasi: string;
  status: "Aktif" | "Nonaktif" | "Dipinjam";
}

const AssetDashboard: React.FC = () => {
  const today = new Date();

  const [data, setData] = useState<AssetItem[]>([
    {
      id: "AST-001",
      kode: "AST-2025-001",
      nama: "Laptop Engineer A",
      kategori: "Elektronik",
      tanggalPerolehan: today.toISOString().slice(0, 10),
      nilaiPerolehan: 17500000,
      lokasi: "Kantor Pusat",
      status: "Aktif",
    },
    {
      id: "AST-002",
      kode: "AST-2025-002",
      nama: "Mesin Las 5KVA",
      kategori: "Peralatan",
      tanggalPerolehan: today.toISOString().slice(0, 10),
      nilaiPerolehan: 8200000,
      lokasi: "Workshop",
      status: "Dipinjam",
    },
  ]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showEntries, setShowEntries] = useState("10");

  const filteredData = useMemo(() => {
    return data.filter((it) => {
      const matchesSearch =
        it.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.lokasi.toLowerCase().includes(searchQuery.toLowerCase());
      const entryDate = new Date(it.tanggalPerolehan);
      const matchesDate =
        (!startDate || entryDate >= startDate) && (!endDate || entryDate <= endDate);
      return matchesSearch && matchesDate;
    });
  }, [data, searchQuery, startDate, endDate]);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AssetItem>({
    id: "",
    kode: "",
    nama: "",
    kategori: "",
    tanggalPerolehan: today.toISOString().slice(0, 10),
    nilaiPerolehan: 0,
    lokasi: "",
    status: "Aktif",
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AssetItem | null>(null);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      id: "",
      kode: "",
      nama: "",
      kategori: "",
      tanggalPerolehan: today.toISOString().slice(0, 10),
      nilaiPerolehan: 0,
      lokasi: "",
      status: "Aktif",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (entry: AssetItem) => {
    setEditingId(entry.id);
    setForm({ ...entry });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.kode || !form.nama) {
      alert("Kode dan Nama Aset wajib diisi");
      return;
    }

    if (editingId) {
      setData((prev) => prev.map((it) => (it.id === editingId ? { ...form, id: it.id } : it)));
    } else {
      setData((prev) => [{ ...form, id: `${Date.now()}` }, ...prev]);
    }
    setIsFormOpen(false);
  };

  const requestDelete = (entry: AssetItem) => {
    setItemToDelete(entry);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData((prev) => prev.filter((d) => d.id !== itemToDelete.id));
      setItemToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  const handleExport = (type: string) => {
    alert(`Export ${type}`);
  };

  // Pagination (simple slice)
  const total = filteredData.length;
  const pageSize = Number(showEntries);
  const pageData = filteredData.slice(0, pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">ASSET</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Asset</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters & actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Asset</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Cari kode, nama, kategori, lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode Perolehan</label>
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="relative flex-1">
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah Asset
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => handleExport("Excel")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> Excel
              </button>
              <button
                onClick={() => handleExport("CSV")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> CSV
              </button>
              <button
                onClick={() => handleExport("PDF")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Perolehan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Perolehan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageData.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.kode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entry.tanggalPerolehan).toLocaleDateString("id-ID")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Rp {entry.nilaiPerolehan.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.lokasi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.status === "Aktif"
                          ? "bg-green-100 text-green-800"
                          : entry.status === "Dipinjam"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-200 text-gray-700"
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(entry)}
                          className="px-2 py-1 text-xs rounded-md bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 inline-flex items-center gap-1"
                        >
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => requestDelete(entry)}
                          className="px-2 py-1 text-xs rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-sm text-gray-700">
            Showing 1 to {Math.min(pageSize, total)} of {total} entries
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? "Edit Asset" : "Tambah Asset"} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode</label>
              <input
                type="text"
                value={form.kode}
                onChange={(e) => setForm((f) => ({ ...f, kode: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <input
                type="text"
                value={form.kategori}
                onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Perolehan</label>
              <input
                type="date"
                value={form.tanggalPerolehan}
                onChange={(e) => setForm((f) => ({ ...f, tanggalPerolehan: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Perolehan (Rp)</label>
              <input
                type="number"
                value={form.nilaiPerolehan}
                onChange={(e) => setForm((f) => ({ ...f, nilaiPerolehan: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input
                type="text"
                value={form.lokasi}
                onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as AssetItem["status"] }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
                <option value="Dipinjam">Dipinjam</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.nama}
      />
    </div>
  );
};

export default AssetDashboard;
