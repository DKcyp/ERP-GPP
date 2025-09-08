import React, { useMemo, useState } from "react";
import {
  Clock,
  Search,
  Download,
  AlertTriangle,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type Person = {
  id: string;
  nama: string;
  kualifikasi: string;
  noSIB: string;
  masaBerlaku: string; // ISO date
};

const initialData: Person[] = [
  {
    id: "P-1",
    nama: "Andi Wijaya",
    kualifikasi: "Operator",
    noSIB: "SIB-001",
    masaBerlaku: "2025-10-01",
  },
  {
    id: "P-2",
    nama: "Budi Santoso",
    kualifikasi: "Pengawas",
    noSIB: "SIB-002",
    masaBerlaku: "2025-01-15",
  },
  {
    id: "P-3",
    nama: "Citra Lestari",
    kualifikasi: "Operator",
    noSIB: "SIB-003",
    masaBerlaku: "2024-09-20",
  },
];

const RadiographySIBPersonnelRadiasiDashboard: React.FC = () => {
  const [rows, setRows] = useState<Person[]>(initialData);
  const [searchNama, setSearchNama] = useState("");
  const [kualifikasi, setKualifikasi] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showEntries, setShowEntries] = useState("10");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<Person | null>(null);
  const [form, setForm] = useState<Partial<Person>>({
    nama: "",
    kualifikasi: "",
    noSIB: "",
    masaBerlaku: "",
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Person | null>(null);

  const kualifikasiOptions = useMemo(
    () => Array.from(new Set(rows.map((d) => d.kualifikasi))),
    [rows]
  );

  const filtered = useMemo(() => {
    return rows.filter((d) => {
      const matchNama = d.nama.toLowerCase().includes(searchNama.toLowerCase());
      const matchKual = !kualifikasi || d.kualifikasi === kualifikasi;
      const masa = new Date(d.masaBerlaku);
      const inStart = !startDate || masa >= new Date(startDate + "T00:00:00");
      const inEnd = !endDate || masa <= new Date(endDate + "T23:59:59");
      return matchNama && matchKual && inStart && inEnd;
    });
  }, [rows, searchNama, kualifikasi, startDate, endDate]);

  const daysTo = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleExport = (t: string) => alert(`Export ${t} (dummy)`);

  const openAdd = () => {
    setModalMode("add");
    setForm({ nama: "", kualifikasi: "", noSIB: "", masaBerlaku: "" });
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: Person) => {
    setModalMode("edit");
    setEditing(p);
    setForm({ ...p });
    setIsModalOpen(true);
  };

  const submitForm = () => {
    const nama = form.nama?.trim() ?? "";
    const kval = form.kualifikasi?.trim() ?? "";
    const noSIB = form.noSIB?.trim() ?? "";
    const masa = form.masaBerlaku?.trim() ?? "";
    if (!nama || !kval || !noSIB || !masa) return;

    if (modalMode === "add") {
      const newItem: Person = {
        id: String(Date.now()),
        nama,
        kualifikasi: kval,
        noSIB,
        masaBerlaku: masa,
      };
      setRows((prev) => [newItem, ...prev]);
    } else if (modalMode === "edit" && editing) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, nama, kualifikasi: kval, noSIB, masaBerlaku: masa }
            : r
        )
      );
    }
    setIsModalOpen(false);
  };

  const requestDelete = (p: Person) => {
    setDeleting(p);
    setIsDeleteOpen(true);
  };
  const confirmDelete = () => {
    if (deleting) setRows((prev) => prev.filter((r) => r.id !== deleting.id));
    setIsDeleteOpen(false);
    setDeleting(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                  SIB PERSONNEL RADIASI
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

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Nama
                </label>
                <div className="relative">
                  <input
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Masukkan nama..."
                    value={searchNama}
                    onChange={(e) => setSearchNama(e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kualifikasi
                </label>
                <select
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={kualifikasi}
                  onChange={(e) => setKualifikasi(e.target.value)}
                >
                  <option value="">Semua</option>
                  {kualifikasiOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
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
            <div className="lg:col-span-4 flex items-end justify-end space-x-3">
              <button
                onClick={openAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Tambah Personel
              </button>
              <button
                onClick={() => { /* Search handled by controlled inputs */ }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Search className="h-5 w-5 mr-2" /> Cari Data
              </button>
            </div>
          </div>

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
                <Download className="h-5 w-5 mr-2" />
                Excel
              </button>
              <button
                onClick={() => handleExport("CSV")}
                className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-5 w-5 mr-2" />
                CSV
              </button>
              <button
                onClick={() => handleExport("PDF")}
                className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <Download className="h-5 w-5 mr-2" />
                PDF
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kualifikasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. SIB
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
                    const danger = dt <= 90;
                    return (
                      <tr
                        key={row.id}
                        className={
                          danger
                            ? "bg-red-50 hover:bg-red-100 transition-colors"
                            : "hover:bg-gray-50 transition-colors"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {row.kualifikasi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {row.noSIB}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(row.masaBerlaku).toLocaleDateString(
                            "id-ID"
                          )}
                          {danger && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" /> {dt}{" "}
                              hari
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
              {modalMode === "add" ? "Tambah Personel" : "Edit Personel"}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nama</label>
                <input
                  type="text"
                  value={form.nama ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nama: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Kualifikasi
                </label>
                <select
                  value={form.kualifikasi ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, kualifikasi: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Pilih</option>
                  {kualifikasiOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  No. SIB
                </label>
                <input
                  type="text"
                  value={form.noSIB ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, noSIB: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
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
        itemName={deleting?.nama}
        title="Konfirmasi Hapus Personel"
        message="Apakah Anda yakin ingin menghapus data personel ini?"
      />
    </>
  );
};

export default RadiographySIBPersonnelRadiasiDashboard;
