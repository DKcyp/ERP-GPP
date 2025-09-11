import React, { useMemo, useState } from "react";
import { Search, PlusCircle, Download, Clock, Pencil, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface MCURecord {
  nama: string; // Nama Personil
  posisi: string; // Posisi / Jabatan
  tglMCU?: string; // Tgl MCU Personil
  expiry: string; // Tgl Expired MCU Tahunan (ISO)
  masaBerlakuReview?: string; // Masa berlaku MCU review user
  paketMCU?: string; // Paket MCU
  keterangan?: string; // Keterangan (P1-P7)
  provider?: string; // Provider MCU (back-compat)
  providerMCU?: string; // Provider MCU (preferred)
  statusProses?: "Permintaan Ops" | "Pengajuan" | "Proses" | "Selesai"; // Status
}

const sampleData: MCURecord[] = [
  {
    nama: "Andi Wijaya",
    posisi: "Radiographer",
    provider: "RS Medika Sejahtera",
    expiry: "2025-01-15",
    tglMCU: "2024-01-15",
    masaBerlakuReview: "1 Tahun",
    paketMCU: "Paket A",
    keterangan: "P1",
    statusProses: "Selesai",
  },
  {
    nama: "Budi Santoso",
    posisi: "Assistant Radiographer",
    provider: "Klinik Prima",
    expiry: "2024-10-20",
    tglMCU: "2023-10-20",
    masaBerlakuReview: "1 Tahun",
    paketMCU: "Paket B",
    keterangan: "P3",
    statusProses: "Proses",
  },
  {
    nama: "Citra Lestari",
    posisi: "QHSE Officer",
    provider: "RSU Harapan",
    expiry: "2025-12-31",
    tglMCU: "2024-12-31",
    masaBerlakuReview: "1 Tahun",
    paketMCU: "Paket C",
    keterangan: "P2",
    statusProses: "Pengajuan",
  },
  {
    nama: "Dewi Puspita",
    posisi: "Technician",
    provider: "Klinik Mitra",
    expiry: "2024-11-05",
    tglMCU: "2023-11-05",
    masaBerlakuReview: "1 Tahun",
    paketMCU: "Paket A",
    keterangan: "P4",
    statusProses: "Permintaan Ops",
  },
  {
    nama: "Eko Prasetyo",
    posisi: "Supervisor",
    provider: "RS Duta",
    expiry: "2024-12-10",
    tglMCU: "2023-12-10",
    masaBerlakuReview: "1 Tahun",
    paketMCU: "Paket D",
    keterangan: "P1",
    statusProses: "Selesai",
  },
];

// rows state will be the source of truth; positions derived from it

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const daysUntil = (iso: string) => {
  const today = new Date();
  const target = new Date(iso);
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();
  const end = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  ).getTime();
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

const MedicalCheckUpDashboard: React.FC = () => {
  const [searchNama, setSearchNama] = useState("");
  const [filterPosisi, setFilterPosisi] = useState("");
  const [showEntries, setShowEntries] = useState<string>("10");
  const [rows, setRows] = useState<MCURecord[]>(sampleData);

  // modal & delete states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [form, setForm] = useState<Partial<MCURecord>>({});
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const positions = useMemo(
    () => Array.from(new Set(rows.map((d) => d.posisi))),
    [rows]
  );

  const filteredData = useMemo(() => {
    return rows.filter((row) => {
      const byNama = row.nama.toLowerCase().includes(searchNama.toLowerCase());
      const byPosisi = filterPosisi ? row.posisi === filterPosisi : true;
      return byNama && byPosisi;
    });
  }, [rows, searchNama, filterPosisi]);

  const displayedData = useMemo(() => {
    const limit = parseInt(showEntries, 10);
    return filteredData.slice(0, isNaN(limit) ? filteredData.length : limit);
  }, [filteredData, showEntries]);

  const handleSearch = () => {
    // set pagination or trigger fetch if needed; kept as placeholder
  };

  const openAdd = () => {
    setModalMode("add");
    setForm({
      nama: "",
      posisi: "",
      tglMCU: "",
      expiry: "",
      masaBerlakuReview: "",
      paketMCU: "",
      keterangan: "",
      providerMCU: "",
      statusProses: undefined,
    });
    setModalOpen(true);
  };
  const openEdit = (item: MCURecord) => {
    setModalMode("edit");
    setForm({ ...item });
    const idx = rows.findIndex((r) => r === item);
    setEditIndex(idx >= 0 ? idx : null);
    setModalOpen(true);
  };
  const saveForm = () => {
    if (!form.nama || !form.posisi || !form.expiry) return;
    if (modalMode === "add") {
      const newItem: MCURecord = {
        nama: String(form.nama),
        posisi: String(form.posisi),
        tglMCU: form.tglMCU ? String(form.tglMCU) : undefined,
        expiry: String(form.expiry),
        masaBerlakuReview: form.masaBerlakuReview
          ? String(form.masaBerlakuReview)
          : undefined,
        paketMCU: form.paketMCU ? String(form.paketMCU) : undefined,
        keterangan: (form.keterangan ?? "").toString(),
        providerMCU: form.providerMCU ? String(form.providerMCU) : undefined,
        provider: form.provider ? String(form.provider) : undefined,
        statusProses: form.statusProses as MCURecord["statusProses"],
      };
      setRows((prev) => [newItem, ...prev]);
    } else if (modalMode === "edit" && editIndex !== null) {
      setRows((prev) =>
        prev.map((p, i) =>
          i === editIndex
            ? {
                nama: String(form.nama),
                posisi: String(form.posisi),
                tglMCU: form.tglMCU ? String(form.tglMCU) : undefined,
                expiry: String(form.expiry),
                masaBerlakuReview: form.masaBerlakuReview
                  ? String(form.masaBerlakuReview)
                  : undefined,
                paketMCU: form.paketMCU ? String(form.paketMCU) : undefined,
                keterangan: (form.keterangan ?? "").toString(),
                providerMCU: form.providerMCU
                  ? String(form.providerMCU)
                  : p.providerMCU,
                provider: form.provider ? String(form.provider) : p.provider,
                statusProses: form.statusProses as MCURecord["statusProses"],
              }
            : p
        )
      );
    }
    setModalOpen(false);
  };
  const confirmDelete = () => {
    if (confirmId !== null)
      setRows((prev) => prev.filter((_, idx) => idx !== confirmId));
    setConfirmId(null);
  };
  const handleExport = (type: string) => alert(`Export ${type}`);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section (mirror MCU style) */}
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                  MEDICAL CHECK UP (MCU)
                </h1>
                <nav className="text-sm text-gray-600">
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">
                    Monitoring Personnel
                  </span>
                  <span className="mx-2">›</span>
                  <span className="text-blue-600 font-medium">
                    Medical Check Up
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
                  Cari Nama Pegawai
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Masukkan nama pegawai..."
                    value={searchNama}
                    onChange={(e) => setSearchNama(e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posisi / Jabatan
                </label>
                <div className="relative">
                  <select
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                    value={filterPosisi}
                    onChange={(e) => setFilterPosisi(e.target.value)}
                  >
                    <option value="">Semua Posisi</option>
                    {positions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-180" />
                </div>
              </div>

              {/* Empty placeholders to keep grid identical to MCU on lg */}
              <div className="hidden lg:block" />
              <div className="hidden lg:block" />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={openAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Tambah MCU
              </button>
              <button
                onClick={handleSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Personil</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi / Jabatan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl MCU Personil</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Expired MCU Tahunan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa berlaku MCU review user</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paket MCU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan (P1-P7)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider MCU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedData.map((row, idx) => {
                    const remaining = daysUntil(row.expiry);
                    const expiringSoon = remaining <= 60; // Rule: highlight merah if <= 60 days remaining
                    const expired = remaining < 0;
                    return (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.nama}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.posisi}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.tglMCU ? formatDate(row.tglMCU) : '-'}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${expiringSoon || expired ? 'text-red-700 bg-red-50' : 'text-gray-500'}`}>
                          <div className="flex flex-col">
                            <span className="font-medium">{formatDate(row.expiry)}</span>
                            <span className="text-xs">{remaining >= 0 ? `${remaining} hari lagi` : `${Math.abs(remaining)} hari lewat`}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.masaBerlakuReview ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.paketMCU ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.keterangan ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.providerMCU ?? row.provider ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {row.statusProses ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              row.statusProses === 'Selesai'
                                ? 'bg-green-100 text-green-800'
                                : row.statusProses === 'Proses'
                                ? 'bg-yellow-100 text-yellow-800'
                                : row.statusProses === 'Pengajuan'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {row.statusProses}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(row)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                setConfirmId(rows.findIndex((r) => r === row))
                              }
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
                  {displayedData.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg p-5">
            <h2 className="text-lg font-semibold mb-4">
              {modalMode === "add" ? "Tambah Data MCU" : "Edit Data MCU"}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nama Personil</label>
                <input
                  type="text"
                  value={form.nama || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nama: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Posisi / Jabatan
                </label>
                <select
                  value={form.posisi || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, posisi: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Pilih Posisi</option>
                  {positions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tgl MCU Personil</label>
                <input
                  type="date"
                  value={form.tglMCU || ""}
                  onChange={(e) => setForm((f) => ({ ...f, tglMCU: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tgl Expired MCU Tahunan
                </label>
                <input
                  type="date"
                  value={form.expiry || ""}
                  onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Masa berlaku MCU review user</label>
                <input
                  type="text"
                  value={form.masaBerlakuReview || ""}
                  onChange={(e) => setForm((f) => ({ ...f, masaBerlakuReview: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Paket MCU</label>
                <input
                  type="text"
                  value={form.paketMCU || ""}
                  onChange={(e) => setForm((f) => ({ ...f, paketMCU: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Keterangan (P1-P7)
                </label>
                <textarea
                  value={form.keterangan || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, keterangan: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Catatan tambahan..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Provider MCU</label>
                <input
                  type="text"
                  value={form.providerMCU || form.provider || ""}
                  onChange={(e) => setForm((f) => ({ ...f, providerMCU: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={form.statusProses || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      statusProses: (e.target.value || undefined) as MCURecord["statusProses"],
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Pilih Status</option>
                  <option value="Permintaan Ops">Permintaan Ops</option>
                  <option value="Pengajuan">Pengajuan</option>
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={saveForm}
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
        isOpen={confirmId !== null}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus data MCU ini?"
        itemName={confirmId !== null ? rows[confirmId]?.nama : undefined}
      />
    </>
  );
};

export default MedicalCheckUpDashboard;
