import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, FileSpreadsheet, FileText, File, Download, Edit2, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface IzinData {
  id: string;
  no: number;
  namaPegawai: string;
  tanggal: string; // ISO or dd-mm-yyyy
  jenisIzin: "Sakit" | "Cuti" | "Izin";
  durasi: string; // e.g., "1 Hari" / "3 Jam"
  keterangan: string;
  status: "Menunggu Review" | "Disetujui" | "Ditolak";
  fileName?: string;
  fileUrl?: string;
}

interface IzinForm {
  namaPegawai: string;
  tanggal: string;
  jenisIzin: IzinData["jenisIzin"] | "";
  durasi: string;
  keterangan: string;
  file?: File | null;
}

const PengajuanIzinDashboard: React.FC = () => {
  const [data, setData] = useState<IzinData[]>([
    {
      id: "1",
      no: 1,
      namaPegawai: "Agus Santoso",
      tanggal: "2025-09-10",
      jenisIzin: "Sakit",
      durasi: "1 Hari",
      keterangan: "Demam",
      status: "Menunggu Review",
    },
    {
      id: "2",
      no: 2,
      namaPegawai: "Rina Putri",
      tanggal: "2025-09-11",
      jenisIzin: "Cuti",
      durasi: "2 Hari",
      keterangan: "Urusan keluarga",
      status: "Disetujui",
    },
  ]);

  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateRows, setAnimateRows] = useState(false);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<IzinData | null>(null);
  const [form, setForm] = useState<IzinForm>({ namaPegawai: "", tanggal: "", jenisIzin: "", durasi: "", keterangan: "", file: null });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IzinData | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return data.filter(
      (d) =>
        d.namaPegawai.toLowerCase().includes(s) ||
        d.jenisIzin.toLowerCase().includes(s) ||
        d.status.toLowerCase().includes(s)
    );
  }, [data, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filtered.slice(startIndex, endIndex);

  const resetForm = () => {
    setForm({ namaPegawai: "", tanggal: "", jenisIzin: "", durasi: "", keterangan: "", file: null });
    setEditingItem(null);
    setIsEditMode(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditModal = (item: IzinData) => {
    setEditingItem(item);
    setForm({
      namaPegawai: item.namaPegawai,
      tanggal: item.tanggal,
      jenisIzin: item.jenisIzin,
      durasi: item.durasi,
      keterangan: item.keterangan,
      file: null,
    });
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((p) => ({ ...p, file }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.namaPegawai || !form.tanggal || !form.jenisIzin) return;

    const fileName = form.file?.name;
    const fileUrl = form.file ? URL.createObjectURL(form.file) : undefined;

    if (isEditMode && editingItem) {
      setData((prev) =>
        prev.map((d) =>
          d.id === editingItem.id
            ? {
                ...d,
                namaPegawai: form.namaPegawai,
                tanggal: form.tanggal,
                jenisIzin: form.jenisIzin as IzinData["jenisIzin"],
                durasi: form.durasi,
                keterangan: form.keterangan,
                fileName: fileName || d.fileName,
                fileUrl: fileUrl || d.fileUrl,
              }
            : d
        )
      );
    } else {
      const nextNo = data.length > 0 ? Math.max(...data.map((x) => x.no)) + 1 : 1;
      const newItem: IzinData = {
        id: Date.now().toString(),
        no: nextNo,
        namaPegawai: form.namaPegawai,
        tanggal: form.tanggal,
        jenisIzin: form.jenisIzin as IzinData["jenisIzin"],
        durasi: form.durasi,
        keterangan: form.keterangan,
        status: "Menunggu Review",
        fileName,
        fileUrl,
      };
      setData((prev) => [newItem, ...prev]);
    }

    setIsFormOpen(false);
    resetForm();
  };

  const confirmDelete = (item: IzinData) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const doDelete = () => {
    if (!itemToDelete) return;
    setData((prev) => prev.filter((d) => d.id !== itemToDelete.id));
    setItemToDelete(null);
    setDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">PENGAJUAN IZIN</h1>

          {/* Controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Search:</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama / status / jenis"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              />
              <button className="px-3 py-2 bg-cyan-500 text-white rounded-md text-sm flex items-center gap-1">
                <Search className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={openAddModal} className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                <Plus className="h-4 w-4" /> Tambah
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-1">
                <FileSpreadsheet className="h-4 w-4" /> Excel
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-1">
                <File className="h-4 w-4" /> CSV
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-1">
                <FileText className="h-4 w-4" /> PDF
              </button>
            </div>
          </div>

          {/* Show entries */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Jenis Izin</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Durasi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Keterangan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">File</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"} ${
                      animateRows ? "animate-in fade-in slide-in-from-bottom-2" : "opacity-0"
                    }`}
                    style={{ animationDelay: animateRows ? `${index * 80}ms` : "0ms", animationFillMode: "forwards" }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{item.no}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.namaPegawai}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.tanggal}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.jenisIzin}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.durasi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.keterangan}</td>
                    <td className="px-4 py-3">
                      {item.fileUrl ? (
                        <a
                          href={item.fileUrl}
                          download={item.fileName || true}
                          className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          title="File belum diupload"
                          className="inline-flex items-center gap-1 rounded bg-gray-300 px-3 py-1 text-xs font-medium text-white cursor-not-allowed"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          item.status === "Menunggu Review"
                            ? "bg-yellow-500 text-white"
                            : item.status === "Disetujui"
                            ? "bg-green-600 text-white"
                            : item.status === "Ditolak"
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 hover:scale-110 transition"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(item)}
                          className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 hover:scale-110 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">{isEditMode ? "Edit Pengajuan Izin" : "Tambah Pengajuan Izin"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="rounded p-1 text-gray-500 hover:bg-gray-100">✕</button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai</label>
                <input
                  value={form.namaPegawai}
                  onChange={(e) => setForm((p) => ({ ...p, namaPegawai: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm((p) => ({ ...p, tanggal: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Izin</label>
                  <select
                    value={form.jenisIzin}
                    onChange={(e) => setForm((p) => ({ ...p, jenisIzin: e.target.value as any }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Izin">Izin</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi</label>
                  <input
                    value={form.durasi}
                    onChange={(e) => setForm((p) => ({ ...p, durasi: e.target.value }))}
                    placeholder="cth: 1 Hari / 3 Jam"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (opsional)</label>
                  <input type="file" onChange={handleFileChange} className="w-full text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea
                  rows={3}
                  value={form.keterangan}
                  onChange={(e) => setForm((p) => ({ ...p, keterangan: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Batal
                </button>
                <button type="submit" className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={doDelete}
        itemName={itemToDelete?.namaPegawai}
      />
    </div>
  );
};

export default PengajuanIzinDashboard;
