import React, { useMemo, useState } from "react";
import {
  Clock,
  Download,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
  X,
  FileText,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface TKDNItem {
  id: string;
  departemen: "finance" | "HRD";
  jenisDokumen: string;
  nomorDokumen: string;
  noSO: string;
  documentUrl: string;
}

const jenisByDept: Record<TKDNItem["departemen"], string[]> = {
  finance: ["PO", "INV", "Surat Ijin", "Bukti Bayar", "CA", "Voucher"],
  HRD: ["Slip Gaji", "KTP", "Kontrak Kerja"],
};

const MonitoringTKDNDashboard: React.FC = () => {
  // Dummy initial data
  const initialData: TKDNItem[] = [
    {
      id: "TKDN-001",
      departemen: "finance",
      jenisDokumen: "PO",
      nomorDokumen: "PO-2025-0001",
      noSO: "SO-10001",
      documentUrl: "#",
    },
    {
      id: "TKDN-002",
      departemen: "finance",
      jenisDokumen: "INV",
      nomorDokumen: "INV-2025-0031",
      noSO: "SO-10021",
      documentUrl: "#",
    },
    {
      id: "TKDN-003",
      departemen: "HRD",
      jenisDokumen: "Kontrak Kerja",
      nomorDokumen: "KK-EMP-7788",
      noSO: "-",
      documentUrl: "#",
    },
  ];

  const [data, setData] = useState<TKDNItem[]>(initialData);
  const [search, setSearch] = useState("");
  const [departemenFilter, setDepartemenFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TKDNItem | null>(null);
  const [form, setForm] = useState<Omit<TKDNItem, "id">>({
    departemen: "finance",
    jenisDokumen: "",
    nomorDokumen: "",
    noSO: "",
    documentUrl: "#",
  });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TKDNItem | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(
      (it) =>
        (departemenFilter
          ? it.departemen === (departemenFilter as TKDNItem["departemen"])
          : true) &&
        (jenisFilter ? it.jenisDokumen === jenisFilter : true) &&
        (it.nomorDokumen.toLowerCase().includes(q) ||
          it.noSO.toLowerCase().includes(q) ||
          it.jenisDokumen.toLowerCase().includes(q))
    );
  }, [data, search, departemenFilter, jenisFilter]);

  const resetForm = () => {
    setForm({
      departemen: "finance",
      jenisDokumen: "",
      nomorDokumen: "",
      noSO: "",
      documentUrl: "#",
    });
  };

  const openAdd = () => {
    setEditing(null);
    resetForm();
    setShowForm(true);
  };

  const openEdit = (item: TKDNItem) => {
    setEditing(item);
    setForm({
      departemen: item.departemen,
      jenisDokumen: item.jenisDokumen,
      nomorDokumen: item.nomorDokumen,
      noSO: item.noSO,
      documentUrl: item.documentUrl,
    });
    setShowForm(true);
  };

  const save = () => {
    if (!form.jenisDokumen || !form.nomorDokumen) return;
    if (editing) {
      setData((prev) =>
        prev.map((it) => (it.id === editing.id ? { ...editing, ...form } : it))
      );
    } else {
      const id = `TKDN-${Math.floor(1000 + Math.random() * 9000)}`;
      setData((prev) => [{ id, ...form }, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const askDelete = (item: TKDNItem) => {
    setDeleteTarget(item);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (deleteTarget)
      setData((prev) => prev.filter((it) => it.id !== deleteTarget.id));
    setDeleteTarget(null);
    setShowDelete(false);
  };

  const handleExport = (type: string) => {
    alert(`Exporting TKDN as ${type}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MONITORING TKDN
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600">Marketing</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Monitoring TKDN
                </span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departemen
              </label>
              <select
                value={departemenFilter}
                onChange={(e) => {
                  setDepartemenFilter(e.target.value);
                  setJenisFilter("");
                }}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua</option>
                <option value="finance">Finance</option>
                <option value="HRD">HRD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Dokumen
              </label>
              <select
                value={jenisFilter}
                onChange={(e) => setJenisFilter(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua</option>
                {(departemenFilter
                  ? jenisByDept[departemenFilter as TKDNItem["departemen"]]
                  : [...jenisByDept.finance, ...jenisByDept.HRD]
                ).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nomor Dokumen / No SO / Jenis Dokumen"
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <div className="flex gap-3 w-full justify-end">
                <button
                  onClick={() => {}}
                  className="inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  <Search className="h-5 w-5 mr-2" /> Cari
                </button>
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => handleExport("Excel")}
              className="inline-flex items-center px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 text-sm"
            >
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button
              onClick={() => handleExport("CSV")}
              className="inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-sm"
            >
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button
              onClick={() => handleExport("PDF")}
              className="inline-flex items-center px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 text-sm"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Judul Dokumen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Departemen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Jenis Dokumen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nomor Dokumen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    No SO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Dokumen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((it) => (
                  <tr
                    key={it.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`${it.jenisDokumen} ${it.nomorDokumen}`.trim()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {it.departemen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {it.jenisDokumen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {it.nomorDokumen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {it.noSO || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <a
                        href={it.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center hover:underline"
                      >
                        <FileText className="h-4 w-4 mr-1" /> Lihat
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.currentTarget === e.target) setShowForm(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? "Edit TKDN" : "Tambah TKDN"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departemen
                  </label>
                  <select
                    value={form.departemen}
                    onChange={(e) => {
                      const dep = e.target.value as TKDNItem["departemen"];
                      setForm((f) => ({
                        ...f,
                        departemen: dep,
                        jenisDokumen: "",
                      }));
                    }}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="finance">Finance</option>
                    <option value="HRD">HRD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Dokumen
                  </label>
                  <select
                    value={form.jenisDokumen}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, jenisDokumen: e.target.value }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Pilih --</option>
                    {jenisByDept[form.departemen].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Dokumen
                  </label>
                  <input
                    value={form.nomorDokumen}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nomorDokumen: e.target.value }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nomor dokumen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No SO
                  </label>
                  <input
                    value={form.noSO}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, noSO: e.target.value }))
                    }
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan No SO (opsional)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tautan Dokumen
                </label>
                <input
                  value={form.documentUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, documentUrl: e.target.value }))
                  }
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="# atau URL dokumen"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Batal
              </button>
              <button
                onClick={save}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      <ConfirmDeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus TKDN"
        message="Apakah Anda yakin ingin menghapus data ini?"
        itemName={
          deleteTarget
            ? `${deleteTarget.departemen} - ${deleteTarget.jenisDokumen} (${deleteTarget.nomorDokumen})`
            : undefined
        }
      />
    </div>
  );
};

export default MonitoringTKDNDashboard;
