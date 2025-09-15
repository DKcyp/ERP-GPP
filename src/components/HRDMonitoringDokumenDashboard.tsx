import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit, Trash2, X, ArrowUp } from "lucide-react";

interface DokumenHRDItem {
  id: string;
  noDokumen: string;
  namaDokumen: string;
  tglPengesahan: string; // ISO yyyy-mm-dd
  tglBerlakuAwal: string; // ISO
  tglBerlakuAkhir: string; // ISO
  fileName?: string; // for display only
}

const initialData: DokumenHRDItem[] = [
  {
    id: "DOC-001",
    noDokumen: "HRD/001/2025",
    namaDokumen: "Peraturan Perusahaan",
    tglPengesahan: "2025-01-10",
    tglBerlakuAwal: "2025-01-15",
    tglBerlakuAkhir: "2026-01-14",
    fileName: "peraturan-perusahaan.pdf",
  },
  {
    id: "DOC-002",
    noDokumen: "HRD/002/2025",
    namaDokumen: "SOP Rekrutmen",
    tglPengesahan: "2025-02-01",
    tglBerlakuAwal: "2025-02-05",
    tglBerlakuAkhir: "2025-12-31",
    fileName: "sop-rekrutmen.pdf",
  },
];

const HRDMonitoringDokumenDashboard: React.FC = () => {
  const [rows, setRows] = useState<DokumenHRDItem[]>(initialData);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof DokumenHRDItem | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [animateRows, setAnimateRows] = useState(false);

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    noDokumen: string;
    namaDokumen: string;
    tglPengesahan: string;
    tglBerlakuAwal: string;
    tglBerlakuAkhir: string;
    file: File | null;
  }>({
    noDokumen: "",
    namaDokumen: "",
    tglPengesahan: "",
    tglBerlakuAwal: "",
    tglBerlakuAkhir: "",
    file: null,
  });

  const openAdd = () => {
    setEditingId(null);
    setForm({
      noDokumen: "",
      namaDokumen: "",
      tglPengesahan: "",
      tglBerlakuAwal: "",
      tglBerlakuAkhir: "",
      file: null,
    });
    setIsOpen(true);
  };

  const openEdit = (item: DokumenHRDItem) => {
    setEditingId(item.id);
    setForm({
      noDokumen: item.noDokumen,
      namaDokumen: item.namaDokumen,
      tglPengesahan: item.tglPengesahan,
      tglBerlakuAwal: item.tglBerlakuAwal,
      tglBerlakuAkhir: item.tglBerlakuAkhir,
      file: null,
    });
    setIsOpen(true);
  };

  const save = () => {
    if (!form.noDokumen || !form.namaDokumen) return;

    if (editingId) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                noDokumen: form.noDokumen,
                namaDokumen: form.namaDokumen,
                tglPengesahan: form.tglPengesahan,
                tglBerlakuAwal: form.tglBerlakuAwal,
                tglBerlakuAkhir: form.tglBerlakuAkhir,
                fileName: form.file ? form.file.name : r.fileName,
              }
            : r
        )
      );
    } else {
      const id = `DOC-${String(rows.length + 1).padStart(3, "0")}`;
      setRows((prev) => [
        {
          id,
          noDokumen: form.noDokumen,
          namaDokumen: form.namaDokumen,
          tglPengesahan: form.tglPengesahan,
          tglBerlakuAwal: form.tglBerlakuAwal,
          tglBerlakuAkhir: form.tglBerlakuAkhir,
          fileName: form.file ? form.file.name : undefined,
        },
        ...prev,
      ]);
    }

    setIsOpen(false);
  };

  const remove = (id: string) => {
    if (!confirm("Hapus dokumen ini?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 120);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    let data = rows.filter(
      (r) =>
        r.noDokumen.toLowerCase().includes(s) ||
        r.namaDokumen.toLowerCase().includes(s)
    );
    if (sortField) {
      data = data.sort((a, b) => {
        const va = String(a[sortField] ?? "");
        const vb = String(b[sortField] ?? "");
        if (va === vb) return 0;
        const res = va > vb ? 1 : -1;
        return sortDir === "asc" ? res : -res;
      });
    }
    return data;
  }, [rows, search, sortField, sortDir]);

  const onSort = (field: keyof DokumenHRDItem) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Monitoring Dokumen HRD</h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari No. Dokumen / Nama Dokumen"
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-80"
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Tambah
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => onSort("noDokumen")}
                  >
                    <div className="flex items-center gap-1">
                      <span>No. Document</span>
                      {sortField === "noDokumen" && (
                        <ArrowUp
                          className={`h-3 w-3 ${sortDir === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => onSort("namaDokumen")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Nama Dokumen</span>
                      {sortField === "namaDokumen" && (
                        <ArrowUp
                          className={`h-3 w-3 ${sortDir === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal Pengesahan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal Berlaku (Awal s.d Akhir)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Upload Dokumen</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 ${
                      animateRows ? "animate-in fade-in slide-in-from-bottom-2" : "opacity-0"
                    }`}
                    style={{
                      animationDelay: animateRows ? `${idx * 60}ms` : undefined,
                      animationFillMode: "forwards",
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{item.noDokumen}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaDokumen}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.tglPengesahan ? new Date(item.tglPengesahan).toLocaleDateString("id-ID") : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.tglBerlakuAwal && item.tglBerlakuAkhir
                        ? `${new Date(item.tglBerlakuAwal).toLocaleDateString("id-ID")} s.d ${new Date(
                            item.tglBerlakuAkhir
                          ).toLocaleDateString("id-ID")}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600">
                      {item.fileName ? (
                        <span className="underline cursor-pointer" title={item.fileName}>
                          {item.fileName}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit" : "Tambah"} Dokumen HRD
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-md">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Document</label>
                <input
                  value={form.noDokumen}
                  onChange={(e) => setForm((p) => ({ ...p, noDokumen: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="HRD/001/2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dokumen</label>
                <input
                  value={form.namaDokumen}
                  onChange={(e) => setForm((p) => ({ ...p, namaDokumen: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="SOP / Peraturan / Kebijakan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengesahan</label>
                <input
                  type="date"
                  value={form.tglPengesahan}
                  onChange={(e) => setForm((p) => ({ ...p, tglPengesahan: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berlaku (Awal)</label>
                <input
                  type="date"
                  value={form.tglBerlakuAwal}
                  onChange={(e) => setForm((p) => ({ ...p, tglBerlakuAwal: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berlaku (Akhir)</label>
                <input
                  type="date"
                  value={form.tglBerlakuAkhir}
                  onChange={(e) => setForm((p) => ({ ...p, tglBerlakuAkhir: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Dokumen</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setForm((p) => ({ ...p, file: e.target.files && e.target.files[0] ? e.target.files[0] : null }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                {form.file && (
                  <div className="mt-1 text-xs text-gray-600">File dipilih: {form.file.name}</div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-lg">
                Batal
              </button>
              <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDMonitoringDokumenDashboard;
