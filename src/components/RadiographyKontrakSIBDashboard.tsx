import React, { useMemo, useState } from "react";
import { Clock, Download, PlusCircle, Pencil, Trash2, Search, Calendar } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type Kontrak = {
  id: string;
  noKontrak: string;
  vendor: string;
  tglMulai: string; // ISO date
  tglAkhir: string; // ISO date
};

const initialData: Kontrak[] = [
  { id: "KON-001", noKontrak: "SIB/2024/001", vendor: "PT Radiasi Sejahtera", tglMulai: "2024-01-15", tglAkhir: "2025-01-14" },
  { id: "KON-002", noKontrak: "SIB/2024/017", vendor: "CV Protek Nusantara", tglMulai: "2024-06-01", tglAkhir: "2024-10-05" },
  { id: "KON-003", noKontrak: "SIB/2023/112", vendor: "PT GuardSafe", tglMulai: "2023-11-20", tglAkhir: "2024-09-25" },
];

const RadiographyKontrakSIBDashboard: React.FC = () => {
  const [rows, setRows] = useState<Kontrak[]>(initialData);
  const [query, setQuery] = useState("");
  const [startEndFrom, setStartEndFrom] = useState<string>("");
  const [startEndTo, setStartEndTo] = useState<string>("");
  const [showEntries, setShowEntries] = useState("10");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<Kontrak | null>(null);
  const [form, setForm] = useState<Partial<Kontrak>>({
    noKontrak: "",
    vendor: "",
    tglMulai: "",
    tglAkhir: "",
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Kontrak | null>(null);

  const daysTo = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = query.toLowerCase();
      const matchQ = !q || r.noKontrak.toLowerCase().includes(q) || r.vendor.toLowerCase().includes(q);
      const end = new Date(r.tglAkhir);
      const inFrom = !startEndFrom || end >= new Date(startEndFrom + "T00:00:00");
      const inTo = !startEndTo || end <= new Date(startEndTo + "T23:59:59");
      return matchQ && inFrom && inTo;
    });
  }, [rows, query, startEndFrom, startEndTo]);

  const handleExport = (t: string) => alert(`Export ${t} (dummy)`);

  const openAdd = () => {
    setModalMode("add");
    setForm({ noKontrak: "", vendor: "", tglMulai: "", tglAkhir: "" });
    setEditing(null);
    setIsModalOpen(true);
  };
  const openEdit = (k: Kontrak) => {
    setModalMode("edit");
    setEditing(k);
    setForm({ ...k });
    setIsModalOpen(true);
  };
  const submitForm = () => {
    const noKontrak = form.noKontrak?.trim() ?? "";
    const vendor = form.vendor?.trim() ?? "";
    const tglMulai = form.tglMulai?.trim() ?? "";
    const tglAkhir = form.tglAkhir?.trim() ?? "";
    if (!noKontrak || !vendor || !tglMulai || !tglAkhir) return;

    if (modalMode === "add") {
      const newItem: Kontrak = { id: String(Date.now()), noKontrak, vendor, tglMulai, tglAkhir };
      setRows((prev) => [newItem, ...prev]);
    } else if (modalMode === "edit" && editing) {
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, noKontrak, vendor, tglMulai, tglAkhir } : r)));
    }
    setIsModalOpen(false);
  };

  const requestDelete = (k: Kontrak) => {
    setDeleting(k);
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
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">KONTRAK SIB</h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari No. Kontrak / Vendor</label>
              <div className="relative">
                <input
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan kata kunci..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode Tanggal Berakhir</label>
              <div className="flex space-x-4">
                <input
                  type="date"
                  value={startEndFrom}
                  onChange={(e) => setStartEndFrom(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={startEndTo}
                  onChange={(e) => setStartEndTo(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={openAdd} className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-green-600 hover:bg-green-700">
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Kontrak
            </button>
            <button onClick={() => {}} className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Kontrak SIB</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Mulai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Berakhir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row) => {
                  const sisa = daysTo(row.tglAkhir);
                  const danger = sisa <= 60;
                  return (
                    <tr key={row.id} className={danger ? "bg-red-50 hover:bg-red-100 transition-colors" : "hover:bg-gray-50 transition-colors"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.noKontrak}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.vendor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(row.tglMulai).toLocaleDateString("id-ID")}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="inline-flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(row.tglAkhir).toLocaleDateString("id-ID")}
                        </span>
                        {danger && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {sisa} hari
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
            <h2 className="text-lg font-semibold mb-4">{modalMode === "add" ? "Tambah Kontrak" : "Edit Kontrak"}</h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">No. Kontrak</label>
                <input
                  type="text"
                  value={form.noKontrak ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, noKontrak: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Vendor</label>
                <input
                  type="text"
                  value={form.vendor ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  value={form.tglMulai ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, tglMulai: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tanggal Berakhir</label>
                <input
                  type="date"
                  value={form.tglAkhir ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, tglAkhir: e.target.value }))}
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
        itemName={deleting?.noKontrak}
        title="Konfirmasi Hapus Kontrak"
        message="Apakah Anda yakin ingin menghapus data kontrak ini?"
      />
    </div>
  );
};

export default RadiographyKontrakSIBDashboard;
