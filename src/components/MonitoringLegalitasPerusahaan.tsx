import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, FileSpreadsheet, FileText, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface LegalitasItem {
  id: string;
  noDokumen: string;
  jenisDokumen: string;
  masaBerlaku: string; // YYYY-MM-DD
  uploadNames: string[]; // store selected file names
  uploadUrls?: string[]; // store object URLs for download
  status: "Pengajuan" | "Proses" | "Closed";
  keterangan?: string;
}

const MonitoringLegalitasPerusahaan: React.FC = () => {
  const [items, setItems] = useState<LegalitasItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [animateRows, setAnimateRows] = useState(false);

  // modal state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LegalitasItem | null>(null);
  const [form, setForm] = useState<LegalitasItem>({
    id: "",
    noDokumen: "",
    jenisDokumen: "",
    masaBerlaku: "",
    uploadNames: [],
    uploadUrls: [],
    status: "Pengajuan",
    keterangan: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LegalitasItem, string>>>({});

  // delete state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LegalitasItem | null>(null);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  // Seed dummy data on first load
  useEffect(() => {
    const dummy: LegalitasItem[] = [
      { id: "D1", noDokumen: "AKTA-001/2023", jenisDokumen: "Akta Pendirian", masaBerlaku: "2026-12-31", uploadNames: ["akta_pendirian.pdf"], uploadUrls: ["data:text/plain;charset=utf-8,Dokumen%20AKTA-001"], status: "Closed", keterangan: "Dokumen lengkap" },
      { id: "D2", noDokumen: "SIUP-002/2024", jenisDokumen: "SIUP", masaBerlaku: "2025-11-30", uploadNames: ["siup.pdf", "lampiran.pdf"], uploadUrls: ["data:text/plain;charset=utf-8,SIUP%20002","data:text/plain;charset=utf-8,Lampiran%20SIUP%20002"], status: "Proses", keterangan: "Perpanjangan" },
      { id: "D3", noDokumen: "NIB-003/2022", jenisDokumen: "NIB", masaBerlaku: "2027-01-15", uploadNames: ["nib.pdf"], uploadUrls: ["data:text/plain;charset=utf-8,NIB%20003"], status: "Closed", keterangan: "Aktif" },
      { id: "D4", noDokumen: "NPWP-004/2020", jenisDokumen: "NPWP", masaBerlaku: "2030-05-20", uploadNames: [], uploadUrls: [], status: "Closed", keterangan: "Tetap" },
      { id: "D5", noDokumen: "TDP-005/2021", jenisDokumen: "TDP", masaBerlaku: "2026-08-10", uploadNames: ["tdp.pdf"], uploadUrls: ["data:text/plain;charset=utf-8,TDP%20005"], status: "Pengajuan", keterangan: "Update alamat" },
      { id: "D6", noDokumen: "IZLOC-006/2024", jenisDokumen: "Izin Lokasi", masaBerlaku: "2025-12-31", uploadNames: ["izin_lokasi.pdf"], uploadUrls: ["data:text/plain;charset=utf-8,Izin%20Lokasi%20006"], status: "Proses", keterangan: "Menunggu verifikasi" },
      { id: "D7", noDokumen: "IZUSAHA-007/2023", jenisDokumen: "Izin Usaha", masaBerlaku: "2026-03-31", uploadNames: ["izin_usaha.pdf"], uploadUrls: ["data:text/plain;charset=utf-8,Izin%20Usaha%20007"], status: "Closed", keterangan: "Aktif" },
      { id: "D8", noDokumen: "MHKM-008/2022", jenisDokumen: "SK Menkumham", masaBerlaku: "2032-09-01", uploadNames: ["sk_menkumham.pdf"], uploadUrls: ["data:text/plain;charset=utf-8,SK%20Menkumham%20008"], status: "Closed", keterangan: "Perubahan direksi" },
      { id: "D9", noDokumen: "HALAL-009/2024", jenisDokumen: "Sertifikat Halal", masaBerlaku: "2025-07-01", uploadNames: ["sertifikat_halal.pdf"], uploadUrls: ["data:text/plain;charset=utf-8,Sertifikat%20Halal%20009"], status: "Proses", keterangan: "Audit dijadwalkan" },
      { id: "D10", noDokumen: "ISO-010/2023", jenisDokumen: "ISO 9001", masaBerlaku: "2026-10-05", uploadNames: ["iso9001.pdf"], uploadUrls: ["data:text/plain;charset=utf-8,ISO%209001%20010"], status: "Closed", keterangan: "Re-sertifikasi" },
      { id: "D11", noDokumen: "PKP-011/2019", jenisDokumen: "PKP", masaBerlaku: "2030-01-01", uploadNames: [], uploadUrls: [], status: "Closed", keterangan: "Tetap" },
      { id: "D12", noDokumen: "NDA-012/2025", jenisDokumen: "Perjanjian/NDA", masaBerlaku: "2026-02-28", uploadNames: ["nda_vendor.pdf"], uploadUrls: ["data:text/plain;charset=utf-8,NDA%20012"], status: "Pengajuan", keterangan: "Vendor baru" },
    ];
    setItems(dummy);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(
      (it) =>
        it.noDokumen.toLowerCase().includes(q) ||
        it.jenisDokumen.toLowerCase().includes(q) ||
        (it.keterangan || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const startIndex = (page - 1) * perPage;
  const current = filtered.slice(startIndex, startIndex + perPage);

  const openAdd = () => {
    setEditing(null);
    setForm({ id: "", noDokumen: "", jenisDokumen: "", masaBerlaku: "", uploadNames: [], status: "Pengajuan", keterangan: "" });
    setErrors({});
    setShowForm(true);
  };
  const openEdit = (item: LegalitasItem) => {
    setEditing(item);
    setForm({ ...item });
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const e: Partial<Record<keyof LegalitasItem, string>> = {};
    if (!form.noDokumen.trim()) e.noDokumen = "Wajib diisi";
    if (!form.jenisDokumen.trim()) e.jenisDokumen = "Wajib diisi";
    if (!form.masaBerlaku) e.masaBerlaku = "Wajib diisi";
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
  };

  const askDelete = (item: LegalitasItem) => {
    setDeleteTarget(item);
    setShowDelete(true);
  };
  const confirmDelete = () => {
    if (deleteTarget) setItems((prev) => prev.filter((it) => it.id !== deleteTarget.id));
    setDeleteTarget(null);
    setShowDelete(false);
  };

  const handleExportCSV = () => {
    const headers = ["No Dokumen", "Jenis Dokumen", "Masa Berlaku", "Upload", "Status", "Keterangan"];
    const rows = filtered.map((it) => [
      it.noDokumen,
      it.jenisDokumen,
      it.masaBerlaku,
      it.uploadNames.join("; "),
      it.status,
      it.keterangan || "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((x) => `"${(x ?? "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "monitoring_legalitas_perusahaan.csv";
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
              <h1 className="text-2xl font-semibold text-gray-900 tracking-wide mb-1">Monitoring Dokumen - Legalitas Perusahaan</h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600">Monitoring</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Legalitas Perusahaan</span>
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
                placeholder="No Dokumen / Jenis Dokumen / Keterangan"
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
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No Dokumen</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Jenis Dokumen</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Masa Berlaku</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Dokumen</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Keterangan</th>
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
                    <td className="px-3 py-2 font-medium text-gray-900">{it.noDokumen}</td>
                    <td className="px-3 py-2">{it.jenisDokumen}</td>
                    <td className="px-3 py-2">{new Date(it.masaBerlaku).toLocaleDateString("id-ID")}</td>
                    <td className="px-3 py-2">
                      {it.uploadNames.length > 0 ? (
                        <div className="space-y-1">
                          {it.uploadNames.map((name, i) => (
                            it.uploadUrls && it.uploadUrls[i] ? (
                              <div key={i}>
                                <a href={it.uploadUrls[i]} download={name} className="text-blue-700 hover:underline inline-flex items-center gap-1">
                                  <FileText className="h-3.5 w-3.5" /> {name}
                                </a>
                              </div>
                            ) : (
                              <div key={i} className="text-gray-600">{name}</div>
                            )
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{it.status}</td>
                    <td className="px-3 py-2">{it.keterangan || "-"}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <label className="text-green-700 hover:underline cursor-pointer">
                          Upload
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              const files = e.target.files ? Array.from(e.target.files) : [];
                              const names = files.map((f) => f.name);
                              const urls = files.map((f) => URL.createObjectURL(f));
                              setItems((prev) => prev.map((row) => row.id === it.id ? { ...row, uploadNames: names, uploadUrls: urls } : row));
                            }}
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
              <h3 className="text-lg font-semibold text-gray-900">{editing ? "Edit" : "Tambah"} Legalitas</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">No. Dokumen <span className="text-red-500">*</span></label>
                  <input value={form.noDokumen} onChange={(e) => { setForm((f) => ({ ...f, noDokumen: e.target.value })); if (errors.noDokumen) setErrors((pr) => ({ ...pr, noDokumen: undefined })); }} className={`w-full px-3 py-2 border rounded-lg ${errors.noDokumen ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Masukkan No Dokumen" />
                  {errors.noDokumen && <p className="text-xs text-red-600 mt-1">{errors.noDokumen}</p>}
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Jenis Dokumen <span className="text-red-500">*</span></label>
                  <input value={form.jenisDokumen} onChange={(e) => { setForm((f) => ({ ...f, jenisDokumen: e.target.value })); if (errors.jenisDokumen) setErrors((pr) => ({ ...pr, jenisDokumen: undefined })); }} className={`w-full px-3 py-2 border rounded-lg ${errors.jenisDokumen ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Akta, SIUP, NIB, dll" />
                  {errors.jenisDokumen && <p className="text-xs text-red-600 mt-1">{errors.jenisDokumen}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Masa Berlaku <span className="text-red-500">*</span></label>
                  <input type="date" value={form.masaBerlaku} onChange={(e) => { setForm((f) => ({ ...f, masaBerlaku: e.target.value })); if (errors.masaBerlaku) setErrors((pr) => ({ ...pr, masaBerlaku: undefined })); }} className={`w-full px-3 py-2 border rounded-lg ${errors.masaBerlaku ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                  {errors.masaBerlaku && <p className="text-xs text-red-600 mt-1">{errors.masaBerlaku}</p>}
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Upload Dokumen</label>
                  <input type="file" accept="image/*,.pdf" multiple onChange={(e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    const names = files.map((f) => f.name);
                    const urls = files.map((f) => URL.createObjectURL(f));
                    setForm((f) => ({ ...f, uploadNames: names, uploadUrls: urls }));
                  }} className="w-full px-3 py-2 border rounded-lg border-gray-200" />
                  {form.uploadNames.length > 0 && (
                    <ul className="mt-1 space-y-1">
                      {form.uploadNames.map((n, i) => (
                        <li key={i} className="text-[11px] text-gray-500">• {n}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as LegalitasItem["status"] }))} className="w-full px-3 py-2 border rounded-lg border-gray-200">
                    <option value="Pengajuan">Pengajuan</option>
                    <option value="Proses">Proses</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Keterangan</label>
                  <input value={form.keterangan || ""} onChange={(e) => setForm((f) => ({ ...f, keterangan: e.target.value }))} className="w-full px-3 py-2 border rounded-lg border-gray-200" placeholder="Opsional" />
                </div>
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
        title="Konfirmasi Hapus Legalitas"
        message="Apakah Anda yakin ingin menghapus data ini?"
        itemName={deleteTarget ? `${deleteTarget.noDokumen} (${deleteTarget.jenisDokumen})` : undefined}
      />
    </div>
  );
};

export default MonitoringLegalitasPerusahaan;
