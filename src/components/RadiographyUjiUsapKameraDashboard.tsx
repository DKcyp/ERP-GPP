import React, { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Download,
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type UjiUsap = {
  id: string;
  noKamera: string;
  hasilUji: string; // e.g., "Lulus" | "Tidak Lulus"
  masaBerlaku: string; // ISO date string
};

const initialData: UjiUsap[] = [
  {
    id: "UU-001",
    noKamera: "KAM-001",
    hasilUji: "Lulus",
    masaBerlaku: "2024-10-10",
  },
  {
    id: "UU-002",
    noKamera: "KAM-014",
    hasilUji: "Lulus",
    masaBerlaku: "2024-12-25",
  },
  {
    id: "UU-003",
    noKamera: "KAM-027",
    hasilUji: "Tidak Lulus",
    masaBerlaku: "2025-02-05",
  },
];

export default function RadiographyUjiUsapKameraDashboard() {
  const [rows, setRows] = useState<UjiUsap[]>(initialData);
  const [searchNoKamera, setSearchNoKamera] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showEntries, setShowEntries] = useState("10");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<UjiUsap | null>(null);
  const [form, setForm] = useState<Partial<UjiUsap>>({
    noKamera: "",
    hasilUji: "",
    masaBerlaku: "",
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<UjiUsap | null>(null);

  // Expiration alerts (<= 60 hari)
  const [expiringAlerts, setExpiringAlerts] = useState<
    { id: string; noKamera: string; daysLeft: number }[]
  >([]);
  const [showAlerts, setShowAlerts] = useState(true);

  const daysTo = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Build alert list for items expiring within 60 days
  useEffect(() => {
    const alerts = rows
      .map((r) => ({
        id: r.id,
        noKamera: r.noKamera,
        daysLeft: daysTo(r.masaBerlaku),
      }))
      .filter((a) => a.daysLeft <= 60 && a.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
    setExpiringAlerts(alerts);
  }, [rows]);

  const getAlertSeverity = (daysLeft: number) => {
    if (daysLeft <= 7) return "bg-red-50 border-red-200 text-red-800";
    if (daysLeft <= 30) return "bg-amber-50 border-amber-200 text-amber-800";
    return "bg-blue-50 border-blue-200 text-blue-800"; // 31-60 hari
  };

  const getAlertIcon = (daysLeft: number) => {
    if (daysLeft <= 7)
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (daysLeft <= 30)
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    return <Clock className="h-5 w-5 text-blue-500" />;
  };

  const getAlertMessage = (item: { noKamera: string; daysLeft: number }) => {
    if (item.daysLeft === 0)
      return `Uji Usap ${item.noKamera} kedaluwarsa hari ini!`;
    if (item.daysLeft === 1)
      return `Uji Usap ${item.noKamera} kedaluwarsa besok!`;
    return `Uji Usap ${item.noKamera} akan kedaluwarsa dalam ${item.daysLeft} hari`;
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchNo = r.noKamera
        .toLowerCase()
        .includes(searchNoKamera.toLowerCase());
      const masa = new Date(r.masaBerlaku);
      const inStart = !startDate || masa >= new Date(startDate + "T00:00:00");
      const inEnd = !endDate || masa <= new Date(endDate + "T23:59:59");
      return matchNo && inStart && inEnd;
    });
  }, [rows, searchNoKamera, startDate, endDate]);

  const handleExport = (t: string) => alert(`Export ${t} (dummy)`);

  const openAdd = () => {
    setModalMode("add");
    setEditing(null);
    setForm({ noKamera: "", hasilUji: "", masaBerlaku: "" });
    setIsModalOpen(true);
  };
  const openEdit = (row: UjiUsap) => {
    setModalMode("edit");
    setEditing(row);
    setForm({ ...row });
    setIsModalOpen(true);
  };
  const submitForm = () => {
    const noKamera = form.noKamera?.trim() ?? "";
    const hasilUji = form.hasilUji?.trim() ?? "";
    const masaBerlaku = form.masaBerlaku?.trim() ?? "";
    if (!noKamera || !hasilUji || !masaBerlaku) return;
    if (modalMode === "add") {
      const newItem: UjiUsap = {
        id: String(Date.now()),
        noKamera,
        hasilUji,
        masaBerlaku,
      };
      setRows((prev) => [newItem, ...prev]);
    } else if (modalMode === "edit" && editing) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editing.id ? { ...r, noKamera, hasilUji, masaBerlaku } : r
        )
      );
    }
    setIsModalOpen(false);
  };

  const requestDelete = (row: UjiUsap) => {
    setDeleting(row);
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
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Uji Usap Kamera
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  QHSE
                </span>
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

      {/* Expiration Alerts (<=60 hari) */}
      {expiringAlerts.length > 0 && showAlerts && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="flex items-center justify-between bg-white border rounded-lg shadow-sm p-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  Pemberitahuan Masa Berlaku Uji Usap Kamera (≤ 60 hari)
                </h3>
                <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {expiringAlerts.length} peringatan
                </span>
              </div>
              <div className="mt-2 space-y-2">
                {expiringAlerts.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center text-sm p-2 rounded-md ${getAlertSeverity(
                      item.daysLeft
                    )}`}
                  >
                    <div className="flex-shrink-0 mr-2">
                      {getAlertIcon(item.daysLeft)}
                    </div>
                    <div className="flex-1">{getAlertMessage(item)}</div>
                  </div>
                ))}
                {expiringAlerts.length > 3 && (
                  <div className="text-sm text-gray-500 mt-1">
                    + {expiringAlerts.length - 3} peringatan lainnya...
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowAlerts(false)}
              className="text-gray-400 hover:text-gray-500 ml-4"
            >
              <span className="sr-only">Tutup</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari No. Kamera
              </label>
              <div className="relative">
                <input
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan No. Kamera..."
                  value={searchNoKamera}
                  onChange={(e) => setSearchNoKamera(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode Masa Berlaku
              </label>
              <div className="flex space-x-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end space-x-3">
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Data
            </button>
            <button
              onClick={() => {
                /* Search handled by controlled inputs */
              }}
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
              className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button
              onClick={() => handleExport("CSV")}
              className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button
              onClick={() => handleExport("PDF")}
              className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-red-600 hover:bg-red-700"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Kamera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hasil Uji
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masa Berlaku
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row) => {
                  const dt = daysTo(row.masaBerlaku);
                  const isExpired = dt < 0;
                  const isWarning = dt >= 0 && dt <= 60;
                  return (
                    <tr
                      key={row.id}
                      className={
                        isExpired
                          ? "bg-red-50 hover:bg-red-100 transition-colors"
                          : isWarning
                          ? "bg-amber-50 hover:bg-amber-100 transition-colors"
                          : "hover:bg-gray-50 transition-colors"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.noKamera}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {row.hasilUji}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(row.masaBerlaku).toLocaleDateString("id-ID")}
                        {(isExpired || isWarning) && (
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isExpired
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />{" "}
                            {dt >= 0
                              ? `${dt} hari`
                              : `Expired ${Math.abs(dt)} hari`}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(row)}
                            className="inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => requestDelete(row)}
                            className="inline-flex items-center px-3 py-1.5 rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                          >
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
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md p-5">
            <h2 className="text-lg font-semibold mb-4">
              {modalMode === "add"
                ? "Tambah Data Uji Usap"
                : "Edit Data Uji Usap"}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  No. Kamera
                </label>
                <input
                  type="text"
                  value={form.noKamera ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, noKamera: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Hasil Uji
                </label>
                <select
                  value={form.hasilUji ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, hasilUji: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Pilih hasil</option>
                  <option value="Lulus">Lulus</option>
                  <option value="Tidak Lulus">Tidak Lulus</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Masa Berlaku
                </label>
                <input
                  type="date"
                  value={form.masaBerlaku ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, masaBerlaku: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={submitForm}
                className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={deleting?.noKamera}
        title="Konfirmasi Hapus Data"
        message="Apakah Anda yakin ingin menghapus data uji usap ini?"
      />
    </div>
  );
}
