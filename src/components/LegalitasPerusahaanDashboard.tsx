import React, { useState, useMemo } from "react";
import {
  PlusCircle,
  Search,
  Download,
  Pencil,
  Trash2,
  AlertTriangle,
  FileText,
  Clock,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface Sertifikat {
  id: string;
  no: number; // No urut
  noSertifikat: string; // No Sertifikat
  nama: string; // Nama Sertifikat
  vendor: string; // Vendor
  tanggalTerbit: string; // Tgl Terbit Sertifikat (ISO yyyy-mm-dd)
  tanggalExp: string; // Tgl Exp Sertifikat (ISO yyyy-mm-dd)
  uploadFile?: string; // Upload File (filename/url)
  approval?: string; // Approval (nama/keputusan)
  approvedByDirector: boolean; // Approved by Director
  status: "Pengajuan" | "Proses" | "Tersertifikasi"; // Status
  keterangan?: string; // Keterangan
}

interface ModalState {
  open: boolean;
  mode: "add" | "edit";
  data?: Partial<Sertifikat> & { id?: string };
}

// jenisOptions removed as the table no longer uses "jenis"

const initialData: Sertifikat[] = [
  {
    id: "1",
    no: 1,
    noSertifikat: "ISO-2024-001",
    nama: "ISO 9001:2015",
    vendor: "TUV Rheinland",
    tanggalTerbit: "2024-01-10",
    tanggalExp: "2025-01-09",
    uploadFile: "iso9001.pdf",
    approval: "QHSE Manager",
    approvedByDirector: true,
    status: "Tersertifikasi",
    keterangan: "Sertifikasi mutu",
  },
  {
    id: "2",
    no: 2,
    noSertifikat: "K3-2024-002",
    nama: "Sertifikat K3 Migas",
    vendor: "SKKMigas",
    tanggalTerbit: "2024-06-01",
    tanggalExp: "2024-12-01",
    uploadFile: "",
    approval: "",
    approvedByDirector: false,
    status: "Proses",
    keterangan: "Menunggu approval direktur",
  },
];

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const LegalitasPerusahaanDashboard: React.FC = () => {
  const [rows, setRows] = useState<Sertifikat[]>(initialData);

  const [search, setSearch] = useState("");
  // jenis filter removed
  const [startDate, setStartDate] = useState<string>(""); // yyyy-mm-dd
  const [endDate, setEndDate] = useState<string>(""); // yyyy-mm-dd

  const [showEntries, setShowEntries] = useState("10");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState<ModalState>({ open: false, mode: "add" });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchName =
        r.nama.toLowerCase().includes(search.toLowerCase()) ||
        r.vendor.toLowerCase().includes(search.toLowerCase());
      const withinRange = (() => {
        if (!startDate && !endDate) return true;
        const d = new Date(r.tanggalExp);
        d.setHours(0, 0, 0, 0);
        if (startDate) {
          const f = new Date(startDate);
          f.setHours(0, 0, 0, 0);
          if (d < f) return false;
        }
        if (endDate) {
          const t = new Date(endDate);
          t.setHours(0, 0, 0, 0);
          if (d > t) return false;
        }
        return true;
      })();
      return matchName && withinRange;
    });
  }, [rows, search, startDate, endDate]);

  const perPage = Math.max(1, parseInt(showEntries, 10));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString();



  // action helpers (optional) can be added later if needed

  const resetModal = () =>
    setModal({ open: false, mode: "add", data: undefined });

  const onSubmit = () => {
    if (!modal.data) return;
    const { id, noSertifikat, nama, vendor, tanggalTerbit, tanggalExp, keterangan, approval, uploadFile, status, approvedByDirector } =
      modal.data as Sertifikat;

    if (!nama || !tanggalTerbit || !tanggalExp || !vendor || !status) return;

    if (modal.mode === "add") {
      const newItem: Sertifikat = {
        id: String(Date.now()),
        no: rows.length + 1,
        noSertifikat: noSertifikat || '',
        nama,
        vendor,
        tanggalTerbit,
        tanggalExp,
        uploadFile,
        approval,
        approvedByDirector: approvedByDirector || false,
        status,
        keterangan,
      };
      setRows((prev) => [newItem, ...prev]);
    } else if (modal.mode === "edit" && id) {
      setRows((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, nama, vendor, tanggalTerbit, tanggalExp, keterangan, approval, uploadFile, status, approvedByDirector: approvedByDirector || false }
            : p
        )
      );
    }
    resetModal();
  };

  const openAdd = () =>
    setModal({
      open: true,
      mode: "add",
      data: {
        no: rows.length + 1,
        noSertifikat: "",
        nama: "",
        vendor: "",
        tanggalTerbit: "",
        tanggalExp: "",
        uploadFile: "",
        approval: "",
        approvedByDirector: false,
        status: "Pengajuan",
        keterangan: "",
      },
    });
  const openEdit = (r: Sertifikat) =>
    setModal({ open: true, mode: "edit", data: { ...r } });

  const confirmDelete = () => {
    if (confirmId) setRows((prev) => prev.filter((p) => p.id !== confirmId));
    setConfirmId(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section (match MCU) */}
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                  Kompetensi Perusahaan
                </h1>
                <nav className="text-sm text-gray-600">
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">
                    QHSE
                  </span>
                  <span className="mx-2">›</span>
                  <span className="text-blue-600 font-medium">
                    Kompetensi Perusahaan
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
          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Nama Sertifikat
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Masukkan nama sertifikat..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode Masa Berlaku
                </label>
                <div className="flex space-x-4">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={openAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Tambah Legalitas
              </button>
              <button
                onClick={() => setPage(1)}
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
                onChange={(e) => {
                  setShowEntries(e.target.value);
                  setPage(1);
                }}
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
                onClick={() => alert("Export Excel")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> Excel
              </button>
              <button
                onClick={() => alert("Export CSV")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> CSV
              </button>
              <button
                onClick={() => alert("Export PDF")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> PDF
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Sertifikat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Sertifikat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Terbit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Exp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload File</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paged.map((r: Sertifikat) => {
                    const sisaHari = daysUntil(r.tanggalExp);
                    const expired = sisaHari <= 0;
                    const expiringSoon = !expired && sisaHari < 90;
                    const computedStatus = r.status; // keep provided status
                    return (
                      <tr
                        key={r.id}
                        className={
                          expired
                            ? "bg-red-50 hover:bg-red-100 transition-colors"
                            : expiringSoon
                            ? "bg-yellow-50 hover:bg-yellow-100 transition-colors"
                            : "hover:bg-gray-50 transition-colors"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {r.no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {r.noSertifikat}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {r.nama}
                          {expired && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" /> Expired
                            </span>
                          )}
                          {!expired && expiringSoon && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />{" "}
                              Expiring Soon
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {r.vendor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {fmtDate(r.tanggalTerbit)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {fmtDate(r.tanggalExp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {r.uploadFile ? (
                            <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <FileText className="h-4 w-4 mr-1" /> {r.uploadFile}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border " +
                              (computedStatus === "Pengajuan"
                                ? "bg-gray-50 text-gray-700 border-gray-200"
                                : computedStatus === "Proses"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-green-50 text-green-700 border-green-200")
                            }
                          >
                            {computedStatus}
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
                              title="Hapus"
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
            {/* Pagination */}
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
                <span>
                  Page {page} / {totalPages}
                </span>
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

      {/* Add/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={resetModal} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg p-5">
            <h2 className="text-lg font-semibold mb-4">{modal.mode === "add" ? "Tambah Sertifikat" : "Edit Sertifikat"}</h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    No Sertifikat
                  </label>
                  <input
                    type="text"
                    value={modal.data?.noSertifikat ?? ""}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, noSertifikat: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Vendor
                  </label>
                  <input
                    type="text"
                    value={modal.data?.vendor ?? ""}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, vendor: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Nama Sertifikat
                </label>
                <input
                  type="text"
                  value={modal.data?.nama ?? ""}
                  onChange={(e) =>
                    setModal((m) => ({
                      ...m,
                      data: { ...m.data, nama: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Tgl Terbit
                  </label>
                  <input
                    type="date"
                    value={modal.data?.tanggalTerbit ?? ""}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, tanggalTerbit: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Tgl Exp
                  </label>
                  <input
                    type="date"
                    value={modal.data?.tanggalExp ?? ""}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, tanggalExp: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Keterangan</label>
                <textarea
                  rows={3}
                  value={modal.data?.keterangan ?? ""}
                  onChange={(e) =>
                    setModal((m) => ({
                      ...m,
                      data: { ...m.data, keterangan: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Approval</label>
                  <input
                    type="text"
                    value={modal.data?.approval ?? ""}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, approval: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Status</label>
                  <select
                    value={modal.data?.status ?? "Pengajuan"}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, status: e.target.value as any },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Pengajuan">Pengajuan</option>
                    <option value="Proses">Proses</option>
                    <option value="Tersertifikasi">Tersertifikasi</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Upload File</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: {
                          ...m.data,
                          uploadFile: e.currentTarget.files && e.currentTarget.files[0]
                            ? e.currentTarget.files[0].name
                            : m.data?.uploadFile,
                        },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Director Approval</label>
                  <select
                    value={modal.data?.approvedByDirector ? "true" : "false"}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, approvedByDirector: e.target.value === "true" },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="false">Belum Disetujui</option>
                    <option value="true">Disetujui Direktur</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={resetModal}
                className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={onSubmit}
                className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus sertifikat ini?"
        itemName={
          confirmId ? rows.find((x) => x.id === confirmId)?.nama : undefined
        }
      />
    </>
  );
};

export default LegalitasPerusahaanDashboard;
