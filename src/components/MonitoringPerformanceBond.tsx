import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, FileSpreadsheet, FileText, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface PerformanceBondItem {
  id: string;
  noTender: string;
  noBidbond: string; // mengikuti spesifikasi user
  penerbit: string;
  biaya: number; // Rp
  kollateral: number; // Rp
  masaBerlaku: string; // YYYY-MM-DD
  documentName?: string;
  documentUrl?: string;
}

const MonitoringPerformanceBond: React.FC = () => {
  const [items, setItems] = useState<PerformanceBondItem[]>([
    { id: crypto.randomUUID(), noTender: "TN-010", noBidbond: "PB-2025-001", penerbit: "Bank D", biaya: 3200000, kollateral: 75000000, masaBerlaku: "2026-03-31", documentName: "pb_TN-010.pdf", documentUrl: "data:text/plain;charset=utf-8,Dummy%20Performance%20Bond%20TN-010" },
    { id: crypto.randomUUID(), noTender: "TN-011", noBidbond: "PB-2025-002", penerbit: "Bank E", biaya: 2100000, kollateral: 45000000, masaBerlaku: "2025-11-30", documentName: "pb_TN-011.pdf", documentUrl: "data:text/plain;charset=utf-8,Dummy%20Performance%20Bond%20TN-011" },
    { id: crypto.randomUUID(), noTender: "TN-012", noBidbond: "PB-2025-003", penerbit: "Asuransi F", biaya: 2800000, kollateral: 60000000, masaBerlaku: "2026-01-15", documentName: "pb_TN-012.pdf", documentUrl: "data:text/plain;charset=utf-8,Dummy%20Performance%20Bond%20TN-012" },
  ]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [animateRows, setAnimateRows] = useState(false);

  // modal state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PerformanceBondItem | null>(null);
  const [form, setForm] = useState<PerformanceBondItem>({
    id: "",
    noTender: "",
    noBidbond: "",
    penerbit: "",
    biaya: 0,
    kollateral: 0,
    masaBerlaku: "",
    documentName: undefined,
    documentUrl: undefined,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PerformanceBondItem, string>>>({});
  const [formFile, setFormFile] = useState<File | null>(null);

  // delete state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PerformanceBondItem | null>(null);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(
      (it) =>
        it.noTender.toLowerCase().includes(q) ||
        it.noBidbond.toLowerCase().includes(q) ||
        it.penerbit.toLowerCase().includes(q)
    );
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const startIndex = (page - 1) * perPage;
  const current = filtered.slice(startIndex, startIndex + perPage);

  const openAdd = () => {
    setEditing(null);
    setForm({ id: "", noTender: "", noBidbond: "", penerbit: "", biaya: 0, kollateral: 0, masaBerlaku: "" });
    setErrors({});
    setShowForm(true);
  };
  const openEdit = (item: PerformanceBondItem) => {
    setEditing(item);
    setForm({ ...item });
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const e: Partial<Record<keyof PerformanceBondItem, string>> = {};
    if (!form.noTender.trim()) e.noTender = "Wajib diisi";
    if (!form.noBidbond.trim()) e.noBidbond = "Wajib diisi";
    if (!form.penerbit.trim()) e.penerbit = "Wajib diisi";
    if (!form.masaBerlaku) e.masaBerlaku = "Wajib diisi";
    if (form.biaya < 0) e.biaya = "Tidak boleh negatif";
    if (form.kollateral < 0) e.kollateral = "Tidak boleh negatif";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    if (editing) {
      setItems((prev) => prev.map((it) => (it.id === editing.id ? { ...form, id: editing.id } : it)));
    } else {
      const id = crypto.randomUUID();
      setItems((prev) => [{ ...form, id }, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
    setFormFile(null);
  };

  const onRowUpload = (item: PerformanceBondItem, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, documentName: file.name, documentUrl: url } : it)));
  };

  const askDelete = (item: PerformanceBondItem) => {
    setDeleteTarget(item);
    setShowDelete(true);
  };
  const confirmDelete = () => {
    if (deleteTarget) setItems((prev) => prev.filter((it) => it.id !== deleteTarget.id));
    setDeleteTarget(null);
    setShowDelete(false);
  };

  const handleExportCSV = () => {
    const headers = ["No Tender", "Nama Tender", "Penerbit", "Biaya", "Kollateral", "Masa Berlaku"];
    const rows = filtered.map((it) => [it.noTender, it.noBidbond, it.penerbit, it.biaya, it.kollateral, it.masaBerlaku]);
    const csv = [headers, ...rows]
      .map((r) => r.map((x) => `"${(x ?? "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "monitoring_performance_bond.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-wide mb-1">Monitoring Dokumen - Performance Bond</h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600">Monitoring</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Performance Bond</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Filter & Actions */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="No Tender / Nama Tender / Penerbit"
              />
            </div>
            <div className="space-y-2 flex items-end">
              <button onClick={() => setPage(1)} className="w-full h-[38px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm">
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
            <div className="space-y-2 flex items-end">
              <button onClick={openAdd} className="w-full h-[38px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm">
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 text-sm">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export Excel</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 text-sm">
              <FileText className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No Tender</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nama Tender</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Penerbit</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Biaya (Rp)</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Kollateral (Rp)</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Masa Berlaku</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Dokumen</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {current.map((it, idx) => (
                  <tr
                    key={it.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-25"} ${
                      animateRows ? "animate-in fade-in slide-in-from-bottom-2" : "opacity-0"
                    }`}
                    style={{ animationDelay: animateRows ? `${idx * 100}ms` : "0ms", animationFillMode: "forwards" }}
                  >
                    <td className="px-3 py-2">{startIndex + idx + 1}</td>
                    <td className="px-3 py-2 font-medium text-gray-900">{it.noTender}</td>
                    <td className="px-3 py-2">{it.noBidbond}</td>
                    <td className="px-3 py-2">{it.penerbit}</td>
                    <td className="px-3 py-2">{it.biaya.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2">{it.kollateral.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2">{new Date(it.masaBerlaku).toLocaleDateString("id-ID")}</td>
                    <td className="px-3 py-2">
                      {it.documentUrl ? (
                        <a href={it.documentUrl} download={it.documentName || "performance_bond_document"} className="text-blue-700 hover:underline inline-flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" /> Download
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <label className="text-green-700 hover:underline cursor-pointer">
                          Upload
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => onRowUpload(it, e.target.files ? e.target.files[0] : null)}
                          />
                        </label>
                        <span className="text-gray-300">|</span>
                        <button className="text-blue-700 hover:underline" onClick={() => openEdit(it)}>Edit</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-red-700 hover:underline" onClick={() => askDelete(it)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-700">Showing {startIndex + 1} to {Math.min(startIndex + perPage, filtered.length)} of {filtered.length} results</div>
              <div className="flex items-center space-x-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md disabled:opacity-50">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`px-2.5 py-1.5 text-xs font-medium rounded-md ${page === p ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-white hover:text-blue-600"}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md disabled:opacity-50">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.currentTarget === e.target) setShowForm(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="text-lg font-semibold text-gray-900">{editing ? "Edit" : "Tambah"} Performance Bond</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto text-sm">
              <div>
                <label className="block text-xs text-gray-700 mb-1">No Tender <span className="text-red-500">*</span></label>
                <input value={form.noTender} onChange={(e) => { setForm((f) => ({ ...f, noTender: e.target.value })); if (errors.noTender) setErrors((pr) => ({ ...pr, noTender: undefined })); }} className={`w-full px-3 py-2 border rounded-lg ${errors.noTender ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Masukkan No Tender" />
                {errors.noTender && <p className="text-xs text-red-600 mt-1">{errors.noTender}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Nama Tender <span className="text-red-500">*</span></label>
                  <input value={form.noBidbond} onChange={(e) => { setForm((f) => ({ ...f, noBidbond: e.target.value })); if (errors.noBidbond) setErrors((pr) => ({ ...pr, noBidbond: undefined })); }} className={`w-full px-3 py-2 border rounded-lg ${errors.noBidbond ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Masukkan Nama Tender" />
                  {errors.noBidbond && <p className="text-xs text-red-600 mt-1">{errors.noBidbond}</p>}
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Penerbit <span className="text-red-500">*</span></label>
                  <input value={form.penerbit} onChange={(e) => { setForm((f) => ({ ...f, penerbit: e.target.value })); if (errors.penerbit) setErrors((pr) => ({ ...pr, penerbit: undefined })); }} className={`w-full px-3 py-2 border rounded-lg ${errors.penerbit ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Masukkan Penerbit" />
                  {errors.penerbit && <p className="text-xs text-red-600 mt-1">{errors.penerbit}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Biaya (Rp)</label>
                  <input type="number" value={form.biaya} onChange={(e) => setForm((f) => ({ ...f, biaya: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg border-gray-200" placeholder="0" />
                  {errors.biaya && <p className="text-xs text-red-600 mt-1">{errors.biaya}</p>}
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Kollateral (Rp)</label>
                  <input type="number" value={form.kollateral} onChange={(e) => setForm((f) => ({ ...f, kollateral: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg border-gray-200" placeholder="0" />
                  {errors.kollateral && <p className="text-xs text-red-600 mt-1">{errors.kollateral}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Masa Berlaku <span className="text-red-500">*</span></label>
                <input type="date" value={form.masaBerlaku} onChange={(e) => { setForm((f) => ({ ...f, masaBerlaku: e.target.value })); if (errors.masaBerlaku) setErrors((pr) => ({ ...pr, masaBerlaku: undefined })); }} className={`w-full px-3 py-2 border rounded-lg ${errors.masaBerlaku ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                {errors.masaBerlaku && <p className="text-xs text-red-600 mt-1">{errors.masaBerlaku}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Upload Dokumen (PDF/Gambar)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const f = e.target.files ? e.target.files[0] : null;
                    setFormFile(f);
                    if (f) {
                      setForm((prev) => ({ ...prev, documentName: f.name, documentUrl: URL.createObjectURL(f) }));
                    } else {
                      setForm((prev) => ({ ...prev, documentName: undefined, documentUrl: undefined }));
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg border-gray-200"
                />
                {form.documentName && (
                  <p className="text-[11px] text-gray-500 mt-1">Terpilih: {form.documentName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Batal</button>
              <button onClick={save} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus Performance Bond"
        message="Apakah Anda yakin ingin menghapus data ini?"
        itemName={deleteTarget ? `${deleteTarget.noTender} (${deleteTarget.noBidbond})` : undefined}
      />
    </div>
  );
};

export default MonitoringPerformanceBond;
