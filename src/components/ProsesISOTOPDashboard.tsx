import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Download,
  Pencil,
  Trash2,
  AlertTriangle,
  Activity,
  Clock,
  Calendar,
  User,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface ISOTOP {
  id: string;
  kodeISOTOP: string;
  jenisISOTOP: string;
  aktivitas: number; // in Ci (Curie)
  tanggalProduksi: string;
  tanggalKadaluarsa: string;
  lokasi: string;
  status: "Active" | "Expired" | "Maintenance" | "Disposed";
  penanggungJawab: string;
  sertifikatNo: string;
  keterangan?: string;
  history: {
    tanggal: string;
    aktivitas: string;
    keterangan: string;
  }[];
}

interface ModalState {
  open: boolean;
  mode: "add" | "edit";
  data?: Partial<ISOTOP> & { id?: string };
}

const initialData: ISOTOP[] = [
  {
    id: "1",
    kodeISOTOP: "IR-192-001",
    jenisISOTOP: "Iridium-192",
    aktivitas: 50.5,
    tanggalProduksi: "2024-01-15",
    tanggalKadaluarsa: "2024-07-15",
    lokasi: "Storage Room A",
    status: "Active",
    penanggungJawab: "Ahmad Radiographer",
    sertifikatNo: "CERT-IR192-2024-001",
    keterangan: "For industrial radiography",
    history: [
      { tanggal: "2024-01-15", aktivitas: "Initial: 50.5 Ci", keterangan: "ISOTOP received" },
      { tanggal: "2024-02-01", aktivitas: "Current: 48.2 Ci", keterangan: "Monthly decay calculation" },
    ],
  },
  {
    id: "2",
    kodeISOTOP: "CO-60-002",
    jenisISOTOP: "Cobalt-60",
    aktivitas: 25.0,
    tanggalProduksi: "2023-12-01",
    tanggalKadaluarsa: "2024-12-01",
    lokasi: "Storage Room B",
    status: "Active",
    penanggungJawab: "Sari Radiographer",
    sertifikatNo: "CERT-CO60-2023-002",
    keterangan: "For gamma radiography",
    history: [
      { tanggal: "2023-12-01", aktivitas: "Initial: 25.0 Ci", keterangan: "ISOTOP received" },
    ],
  },
];

const ProsesISOTOPDashboard: React.FC = () => {
  const [rows, setRows] = useState<ISOTOP[]>(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showEntries, setShowEntries] = useState("10");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalState>({ open: false, mode: "add" });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchSearch = 
        r.kodeISOTOP.toLowerCase().includes(search.toLowerCase()) ||
        r.jenisISOTOP.toLowerCase().includes(search.toLowerCase()) ||
        r.penanggungJawab.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  const perPage = Math.max(1, parseInt(showEntries, 10));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const daysUntil = (dateStr: string): number => {
    const today = new Date();
    const target = new Date(dateStr);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const resetModal = () => setModal({ open: false, mode: "add", data: undefined });

  const onSubmit = () => {
    if (!modal.data) return;
    const { id, kodeISOTOP, jenisISOTOP, aktivitas, tanggalProduksi, tanggalKadaluarsa, lokasi, penanggungJawab, sertifikatNo, keterangan } = modal.data as ISOTOP;

    if (!kodeISOTOP || !jenisISOTOP || !aktivitas || !tanggalProduksi || !tanggalKadaluarsa) return;

    if (modal.mode === "add") {
      const newItem: ISOTOP = {
        id: String(Date.now()),
        kodeISOTOP,
        jenisISOTOP,
        aktivitas,
        tanggalProduksi,
        tanggalKadaluarsa,
        lokasi: lokasi || "",
        status: "Active",
        penanggungJawab: penanggungJawab || "",
        sertifikatNo: sertifikatNo || "",
        keterangan,
        history: [{
          tanggal: new Date().toISOString().split('T')[0],
          aktivitas: `Initial: ${aktivitas} Ci`,
          keterangan: "ISOTOP registered"
        }],
      };
      setRows((prev) => [newItem, ...prev]);
    } else if (modal.mode === "edit" && id) {
      setRows((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, kodeISOTOP, jenisISOTOP, aktivitas, tanggalProduksi, tanggalKadaluarsa, lokasi: lokasi || "", penanggungJawab: penanggungJawab || "", sertifikatNo: sertifikatNo || "", keterangan }
            : p
        )
      );
    }
    resetModal();
  };

  const openAdd = () => setModal({
    open: true,
    mode: "add",
    data: {
      kodeISOTOP: "",
      jenisISOTOP: "",
      aktivitas: 0,
      tanggalProduksi: "",
      tanggalKadaluarsa: "",
      lokasi: "",
      penanggungJawab: "",
      sertifikatNo: "",
      keterangan: "",
    },
  });

  const openEdit = (r: ISOTOP) => setModal({ open: true, mode: "edit", data: { ...r } });

  const confirmDelete = () => {
    if (confirmId) setRows((prev) => prev.filter((p) => p.id !== confirmId));
    setConfirmId(null);
  };

  const getStatusColor = (status: ISOTOP["status"]) => {
    switch (status) {
      case "Active": return "bg-green-50 text-green-700 border-green-200";
      case "Expired": return "bg-red-50 text-red-700 border-red-200";
      case "Maintenance": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Disposed": return "bg-gray-50 text-gray-700 border-gray-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                  Proses ISOTOP
                </h1>
                <nav className="text-sm text-gray-600">
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                  <span className="mx-2">›</span>
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">Radiography</span>
                  <span className="mx-2">›</span>
                  <span className="text-blue-600 font-medium">Proses ISOTOP</span>
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search ISOTOP</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari kode, jenis, atau PJ..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Disposed">Disposed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Show Entries</label>
                <select
                  value={showEntries}
                  onChange={(e) => setShowEntries(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={openAdd}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add ISOTOP
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={showEntries}
                  onChange={(e) => setShowEntries(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
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
                  onClick={() => alert("Export Excel")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <Download className="h-5 w-5 mr-2" /> Excel
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode ISOTOP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktivitas (Ci)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Produksi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Kadaluarsa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paged.map((r: ISOTOP) => {
                    const daysLeft = daysUntil(r.tanggalKadaluarsa);
                    const isExpiring = daysLeft <= 30;
                    const isExpired = daysLeft <= 0;
                    
                    return (
                      <tr key={r.id} className={`hover:bg-gray-50 transition-colors ${isExpired ? 'bg-red-50' : isExpiring ? 'bg-yellow-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {r.kodeISOTOP}
                          {isExpired && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" /> Expired
                            </span>
                          )}
                          {!isExpired && isExpiring && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <AlertTriangle className="h-3 w-3 mr-1" /> Expiring Soon
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.jenisISOTOP}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.aktivitas}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(r.tanggalProduksi).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(r.tanggalKadaluarsa).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.lokasi}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(r.status)}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(r)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setConfirmId(r.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-red-700 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-600">
              <div>
                Showing {(page - 1) * perPage + 1} to{" "}
                {Math.min(page * perPage, filtered.length)} of {filtered.length}{" "}
                entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <span>Page {page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={resetModal} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl p-5">
            <h2 className="text-lg font-semibold mb-4">
              {modal.mode === "add" ? "Add ISOTOP" : "Edit ISOTOP"}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Kode ISOTOP</label>
                  <input
                    type="text"
                    value={modal.data?.kodeISOTOP ?? ""}
                    onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, kodeISOTOP: e.target.value } }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Jenis ISOTOP</label>
                  <select
                    value={modal.data?.jenisISOTOP ?? ""}
                    onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, jenisISOTOP: e.target.value } }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Type</option>
                    <option value="Iridium-192">Iridium-192</option>
                    <option value="Cobalt-60">Cobalt-60</option>
                    <option value="Selenium-75">Selenium-75</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Aktivitas (Ci)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={modal.data?.aktivitas ?? 0}
                    onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, aktivitas: parseFloat(e.target.value) } }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={modal.data?.lokasi ?? ""}
                    onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, lokasi: e.target.value } }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tanggal Produksi</label>
                  <input
                    type="date"
                    value={modal.data?.tanggalProduksi ?? ""}
                    onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, tanggalProduksi: e.target.value } }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tanggal Kadaluarsa</label>
                  <input
                    type="date"
                    value={modal.data?.tanggalKadaluarsa ?? ""}
                    onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, tanggalKadaluarsa: e.target.value } }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={modal.data?.penanggungJawab ?? ""}
                    onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, penanggungJawab: e.target.value } }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sertifikat No</label>
                  <input
                    type="text"
                    value={modal.data?.sertifikatNo ?? ""}
                    onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, sertifikatNo: e.target.value } }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Keterangan</label>
                <textarea
                  rows={3}
                  value={modal.data?.keterangan ?? ""}
                  onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, keterangan: e.target.value } }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={resetModal}
                className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this ISOTOP?"
        itemName={confirmId ? rows.find((x) => x.id === confirmId)?.kodeISOTOP : undefined}
      />
    </>
  );
};

export default ProsesISOTOPDashboard;
