import React, { useMemo, useState } from "react";
import { Clock, Plus, Pencil, Trash2, Save, X, Search, Download } from "lucide-react";

interface AsetItem {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  lokasi: string;
  tglPerolehan: string; // yyyy-mm-dd
  nilaiPerolehan: number;
  status: "Aktif" | "Non Aktif";
}

const currency = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const GAMasterAsetDashboard: React.FC = () => {
  const [items, setItems] = useState<AsetItem[]>([
    { id: crypto.randomUUID(), kode: "AST-001", nama: "Laptop IT-01", kategori: "Elektronik", lokasi: "Kantor Pusat", tglPerolehan: "2024-08-15", nilaiPerolehan: 12500000, status: "Aktif" },
  ]);
  const [q, setQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AsetItem>({ id: "", kode: "", nama: "", kategori: "", lokasi: "", tglPerolehan: "", nilaiPerolehan: 0, status: "Aktif" });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return items.filter((it) =>
      it.kode.toLowerCase().includes(qq) ||
      it.nama.toLowerCase().includes(qq) ||
      it.kategori.toLowerCase().includes(qq) ||
      it.lokasi.toLowerCase().includes(qq)
    );
  }, [items, q]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ id: crypto.randomUUID(), kode: "", nama: "", kategori: "", lokasi: "", tglPerolehan: "", nilaiPerolehan: 0, status: "Aktif" });
    setIsOpen(true);
  };

  const openEdit = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    setEditingId(id);
    setForm({ ...it });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus aset ini?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const exportCSV = () => {
    const header = ["Kode", "Nama", "Kategori", "Lokasi", "Tgl Perolehan", "Nilai Perolehan", "Status"]; 
    const rows = filtered.map((r) => [r.kode, r.nama, r.kategori, r.lokasi, r.tglPerolehan, r.nilaiPerolehan, r.status]);
    const csv = [header, ...rows]
      .map((row) => row.map((c) => (typeof c === "string" ? `"${c.replace(/"/g, '""')}"` : c)).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MasterAset_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    setItems((prev) => (editingId ? prev.map((x) => (x.id === editingId ? { ...form } : x)) : [{ ...form }, ...prev]));
    setSaving(false);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">GA - Master Aset</h1>
            <div className="text-xs text-gray-600">GA › Master Aset</div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 flex items-center justify-between">
          <div className="space-x-2">
            <button onClick={openAdd} className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" /> Tambah
            </button>
            <button onClick={exportCSV} className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700">
              <Download className="h-4 w-4 mr-1" /> Export CSV
            </button>
          </div>
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari Kode/Nama/Kategori/Lokasi"
              className="w-72 pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left">No</th>
                <th className="px-3 py-2 text-left">Kode</th>
                <th className="px-3 py-2 text-left">Nama</th>
                <th className="px-3 py-2 text-left">Kategori</th>
                <th className="px-3 py-2 text-left">Lokasi</th>
                <th className="px-3 py-2 text-left">Tgl Perolehan</th>
                <th className="px-3 py-2 text-right">Nilai Perolehan</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium text-gray-900">{r.kode}</td>
                  <td className="px-3 py-2 text-gray-800">{r.nama}</td>
                  <td className="px-3 py-2 text-gray-800">{r.kategori}</td>
                  <td className="px-3 py-2 text-gray-800">{r.lokasi}</td>
                  <td className="px-3 py-2 text-gray-800">{new Date(r.tglPerolehan).toLocaleDateString("id-ID")}</td>
                  <td className="px-3 py-2 text-gray-800 text-right">{currency(r.nilaiPerolehan)}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      r.status === "Aktif"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-rose-100 text-rose-800 border-rose-200"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button onClick={() => openEdit(r.id)} className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="inline-flex items-center px-2 py-1 border border-rose-300 text-rose-600 rounded-md hover:bg-rose-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-gray-500">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-lg font-semibold">{editingId ? "Edit" : "Tambah"} Aset</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={saveForm} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kode</label>
                  <input
                    value={form.kode}
                    onChange={(e) => setForm((f) => ({ ...f, kode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    value={form.nama}
                    onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
                  <input
                    value={form.kategori}
                    onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Lokasi</label>
                  <input
                    value={form.lokasi}
                    onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tgl Perolehan</label>
                  <input
                    type="date"
                    value={form.tglPerolehan}
                    onChange={(e) => setForm((f) => ({ ...f, tglPerolehan: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nilai Perolehan</label>
                  <input
                    type="number"
                    value={form.nilaiPerolehan}
                    onChange={(e) => setForm((f) => ({ ...f, nilaiPerolehan: Number(e.target.value || 0) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    min={0}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as AsetItem["status"] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non Aktif">Non Aktif</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" disabled={saving} className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {saving ? (<><Save className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</>) : (<><Save className="h-4 w-4 mr-2" />Simpan</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GAMasterAsetDashboard;
