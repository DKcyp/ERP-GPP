import React, { useMemo, useState } from "react";
import { Search, PlusCircle, Download, Clock, Pencil, Trash2, X } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface DokumenInternal {
  namaDokumen: string;
  nomorDokumen: string;
  jenisDokumen: string;
  tglDibuat: string; // ISO date
  noRevisi: string;
  tglRevisi?: string; // ISO date
  tglBerlaku?: string; // ISO date
  masaBerlaku?: string; // e.g. "1 Tahun"
  lokasiFisik?: string;
  lokasiElectronic?: string;
}

const sampleData: DokumenInternal[] = [
  {
    namaDokumen: "Prosedur Operasional Standar K3",
    nomorDokumen: "SOP-K3-001",
    jenisDokumen: "SOP",
    tglDibuat: "2024-01-10",
    noRevisi: "0",
    tglRevisi: "",
    tglBerlaku: "2024-02-01",
    masaBerlaku: "2 Tahun",
    lokasiFisik: "Lemari Arsip QHSE",
    lokasiElectronic: "SharePoint/QHSE/ISO/SOP",
  },
];

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

const ISOSystemDaftarIndukDokumenInternalDashboard: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [showEntries, setShowEntries] = useState<string>("10");

  const [data, setData] = useState<DokumenInternal[]>(sampleData);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DokumenInternal | null>(null);
  const [form, setForm] = useState<DokumenInternal>({
    namaDokumen: "",
    nomorDokumen: "",
    jenisDokumen: "",
    tglDibuat: "",
    noRevisi: "",
    tglRevisi: "",
    tglBerlaku: "",
    masaBerlaku: "",
    lokasiFisik: "",
    lokasiElectronic: "",
  });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DokumenInternal | null>(null);

  const jenisOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.jenisDokumen).filter(Boolean))),
    [data]
  );

  const filtered = useMemo(() => {
    return data.filter((row) => {
      const byText =
        row.namaDokumen.toLowerCase().includes(searchText.toLowerCase()) ||
        row.nomorDokumen.toLowerCase().includes(searchText.toLowerCase());
      const byJenis = filterJenis ? row.jenisDokumen === filterJenis : true;
      return byText && byJenis;
    });
  }, [data, searchText, filterJenis]);

  const displayed = useMemo(() => {
    const limit = parseInt(showEntries, 10);
    return filtered.slice(0, isNaN(limit) ? filtered.length : limit);
  }, [filtered, showEntries]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      namaDokumen: "",
      nomorDokumen: "",
      jenisDokumen: "",
      tglDibuat: "",
      noRevisi: "",
      tglRevisi: "",
      tglBerlaku: "",
      masaBerlaku: "",
      lokasiFisik: "",
      lokasiElectronic: "",
    });
    setShowForm(true);
  };

  const openEdit = (row: DokumenInternal) => {
    setEditing(row);
    setForm(row);
    setShowForm(true);
  };

  const saveForm = () => {
    const payload: DokumenInternal = {
      namaDokumen: form.namaDokumen.trim(),
      nomorDokumen: form.nomorDokumen.trim(),
      jenisDokumen: form.jenisDokumen.trim(),
      tglDibuat: form.tglDibuat,
      noRevisi: form.noRevisi.trim(),
      tglRevisi: form.tglRevisi || "",
      tglBerlaku: form.tglBerlaku || "",
      masaBerlaku: form.masaBerlaku || "",
      lokasiFisik: form.lokasiFisik || "",
      lokasiElectronic: form.lokasiElectronic || "",
    };

    if (!payload.namaDokumen || !payload.nomorDokumen || !payload.jenisDokumen || !payload.tglDibuat || !payload.noRevisi) {
      alert("Nama/Nomor/Jenis/Tgl Dibuat/No Revisi wajib diisi");
      return;
    }

    if (editing) {
      setData((prev) => prev.map((r) => (r === editing ? payload : r)));
    } else {
      setData((prev) => [payload, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const askDelete = (row: DokumenInternal) => {
    setDeleteTarget(row);
    setShowDelete(true);
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((r) => r !== deleteTarget));
    setShowDelete(false);
    setDeleteTarget(null);
  };

  const handleExport = (type: string) => alert(`Export ${type}`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">ISO SYSTEM</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Daftar Induk Dokumen Internal</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Dokumen</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nama/nomor dokumen..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Dokumen</label>
              <div className="relative">
                <select
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm appearance-none"
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                >
                  <option value="">Semua</option>
                  {jenisOptions.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* grid spacer */}
            <div className="hidden lg:block" />
            <div className="hidden lg:block" />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Dokumen
            </button>
            <button
              onClick={() => { /* trigger filter (placeholder) */ }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Controls */}
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

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Dibuat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Revisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Revisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Berlaku</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa Berlaku</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi Fisik</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi Electronic</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayed.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.namaDokumen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.nomorDokumen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.jenisDokumen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(row.tglDibuat)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.noRevisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(row.tglRevisi)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(row.tglBerlaku)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.masaBerlaku || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.lokasiFisik || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.lokasiElectronic || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => openEdit(row)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => askDelete(row)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayed.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination placeholder (client-side showEntries already applied) */}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">{editing ? "Edit Dokumen" : "Tambah Dokumen"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dokumen</label>
                  <input value={form.namaDokumen} onChange={(e) => setForm({ ...form, namaDokumen: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Dokumen</label>
                  <input value={form.nomorDokumen} onChange={(e) => setForm({ ...form, nomorDokumen: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Dokumen</label>
                  <input value={form.jenisDokumen} onChange={(e) => setForm({ ...form, jenisDokumen: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Dibuat</label>
                  <input type="date" value={form.tglDibuat} onChange={(e) => setForm({ ...form, tglDibuat: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No Revisi</label>
                  <input value={form.noRevisi} onChange={(e) => setForm({ ...form, noRevisi: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Revisi</label>
                  <input type="date" value={form.tglRevisi} onChange={(e) => setForm({ ...form, tglRevisi: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Berlaku</label>
                  <input type="date" value={form.tglBerlaku} onChange={(e) => setForm({ ...form, tglBerlaku: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Masa Berlaku</label>
                  <input value={form.masaBerlaku} onChange={(e) => setForm({ ...form, masaBerlaku: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Penyimpanan Fisik</label>
                  <input value={form.lokasiFisik} onChange={(e) => setForm({ ...form, lokasiFisik: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Penyimpanan Electronic</label>
                  <input value={form.lokasiElectronic} onChange={(e) => setForm({ ...form, lokasiElectronic: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">Batal</button>
              <button onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmDeleteModal
        isOpen={showDelete}
        title="Hapus Dokumen?"
        message={deleteTarget ? `Apakah Anda yakin ingin menghapus dokumen ${deleteTarget.namaDokumen} (Nomor: ${deleteTarget.nomorDokumen})?` : ""}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ISOSystemDaftarIndukDokumenInternalDashboard;
