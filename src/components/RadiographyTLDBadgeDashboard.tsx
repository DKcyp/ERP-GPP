import React, { useMemo, useState } from "react";
import { Clock, Download, PlusCircle, Pencil, Trash2, Search, AlertTriangle } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type TLD = {
  id: string;
  nama: string;
  noBadge: string;
  masaBerlaku: string; // ISO date string
};

const initialData: TLD[] = [
  { id: "TLD-001", nama: "Andi Wijaya", noBadge: "TLD-BA-001", masaBerlaku: "2024-10-15" },
  { id: "TLD-002", nama: "Budi Santoso", noBadge: "TLD-BA-014", masaBerlaku: "2024-12-20" },
  { id: "TLD-003", nama: "Citra Lestari", noBadge: "TLD-BA-027", masaBerlaku: "2025-02-10" },
];

const RadiographyTLDBadgeDashboard: React.FC = () => {
  const [rows, setRows] = useState<TLD[]>(initialData);
  const [searchNama, setSearchNama] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showEntries, setShowEntries] = useState("10");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<TLD | null>(null);
  const [form, setForm] = useState<Partial<TLD>>({ nama: "", noBadge: "", masaBerlaku: "" });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<TLD | null>(null);

  const daysTo = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchNama = r.nama.toLowerCase().includes(searchNama.toLowerCase());
      const masa = new Date(r.masaBerlaku);
      const inStart = !startDate || masa >= new Date(startDate + "T00:00:00");
      const inEnd = !endDate || masa <= new Date(endDate + "T23:59:59");
      return matchNama && inStart && inEnd;
    });
  }, [rows, searchNama, startDate, endDate]);

  const handleExport = (t: string) => alert(`Export ${t} (dummy)`);

  const openAdd = () => {
    setModalMode("add");
    setEditing(null);
    setForm({ nama: "", noBadge: "", masaBerlaku: "" });
    setIsModalOpen(true);
  };
  const openEdit = (row: TLD) => {
    setModalMode("edit");
    setEditing(row);
    setForm({ ...row });
    setIsModalOpen(true);
  };
  const submitForm = () => {
    const nama = form.nama?.trim() ?? "";
    const noBadge = form.noBadge?.trim() ?? "";
    const masaBerlaku = form.masaBerlaku?.trim() ?? "";
    if (!nama || !noBadge || !masaBerlaku) return;
    if (modalMode === "add") {
      const newItem: TLD = { id: String(Date.now()), nama, noBadge, masaBerlaku };
      setRows((prev) => [newItem, ...prev]);
    } else if (modalMode === "edit" && editing) {
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, nama, noBadge, masaBerlaku } : r)));
    }
    setIsModalOpen(false);
  };

  const requestDelete = (row: TLD) => {
    setDeleting(row);
    setIsDeleteOpen(true);
  };
  const confirmDelete = () => {
    if (deleting) setRows((prev) => prev.filter((r) => r.id !== deleting.id));
    setIsDeleteOpen(false);
    setDeleting(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">THERMOLUMINESCENT DOSIMETER (TLD) BADGE</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Radiography</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Nama</label>
              <div className="relative">
                <input
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nama..."
                  value={searchNama}
                  onChange={(e) => setSearchNama(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode Masa Berlaku</label>
              <div className="flex space-x-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end space-x-3">
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Badge
            </button>
            <button
              onClick={() => { /* Search handled by controlled inputs */ }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
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
          <div className="flex space-x-3">
            <button onClick={() => handleExport("Excel")} className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-green-600 hover:bg-green-700">
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button onClick={() => handleExport("CSV")} className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button onClick={() => handleExport("PDF")} className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-red-600 hover:bg-red-700">
              <Download className="h-5 w-5 mr-2" /> PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Badge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa Berlaku</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row) => {
                  const dt = daysTo(row.masaBerlaku);
                  const danger = dt > 30; // custom rule per request
                  return (
                    <tr key={row.id} className={danger ? "bg-red-50 hover:bg-red-100 transition-colors" : "hover:bg-gray-50 transition-colors"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.noBadge}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(row.masaBerlaku).toLocaleDateString("id-ID")}
                        {danger && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> {dt} hari
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(row)} className="inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </button>
                          <button onClick={() => requestDelete(row)} className="inline-flex items-center px-3 py-1.5 rounded-md border border-red-300 text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4 mr-1" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md p-5">
            <h2 className="text-lg font-semibold mb-4">{modalMode === "add" ? "Tambah Badge" : "Edit Badge"}</h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nama</label>
                <input
                  type="text"
                  value={form.nama ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">No. Badge</label>
                <input
                  type="text"
                  value={form.noBadge ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, noBadge: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Masa Berlaku</label>
                <input
                  type="date"
                  value={form.masaBerlaku ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, masaBerlaku: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Batal</button>
              <button onClick={submitForm} className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={deleting?.noBadge}
        title="Konfirmasi Hapus Badge"
        message="Apakah Anda yakin ingin menghapus data badge ini?"
      />
    </div>
  );
};

export default RadiographyTLDBadgeDashboard;
