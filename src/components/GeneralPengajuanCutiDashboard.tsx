import React, { useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Clock,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  X,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface CutiRecord {
  id: string;
  nama: string;
  jabatan: string;
  jenisCuti: "Tahunan" | "Sakit" | "Melahirkan" | "Izin" | "Lainnya";
  tanggalMulai: string; // ISO
  tanggalSelesai: string; // ISO
  alasan: string;
  status: "Draft" | "Diajukan" | "Disetujui" | "Ditolak";
}

const initialData: CutiRecord[] = [
  {
    id: "CUTI-001",
    nama: "Andi Wijaya",
    jabatan: "Radiographer",
    jenisCuti: "Tahunan",
    tanggalMulai: "2025-09-10",
    tanggalSelesai: "2025-09-12",
    alasan: "Liburan keluarga",
    status: "Diajukan",
  },
  {
    id: "CUTI-002",
    nama: "Budi Santoso",
    jabatan: "Assistant Radiographer",
    jenisCuti: "Sakit",
    tanggalMulai: "2025-09-03",
    tanggalSelesai: "2025-09-04",
    alasan: "Demam tinggi",
    status: "Draft",
  },
];

const GeneralPengajuanCutiDashboard: React.FC = () => {
  const [rows, setRows] = useState<CutiRecord[]>(initialData);
  const [showEntries, setShowEntries] = useState(10);
  const [filters, setFilters] = useState({
    nama: "",
    jenisCuti: "",
    status: "",
    tglAwal: "",
    tglAkhir: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    jabatan: "",
    jenisCuti: "" as CutiRecord["jenisCuti"] | "",
    tanggalMulai: "",
    tanggalSelesai: "",
    alasan: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CutiRecord | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchNama = filters.nama
        ? r.nama.toLowerCase().includes(filters.nama.toLowerCase())
        : true;
      const matchDept = true;
      const matchJenis = filters.jenisCuti
        ? r.jenisCuti === (filters.jenisCuti as CutiRecord["jenisCuti"])
        : true;
      const matchStatus = filters.status
        ? r.status === (filters.status as CutiRecord["status"])
        : true;
      const startOk = filters.tglAwal
        ? new Date(r.tanggalMulai) >= new Date(filters.tglAwal)
        : true;
      const endOk = filters.tglAkhir
        ? new Date(r.tanggalSelesai) <= new Date(filters.tglAkhir)
        : true;
      return (
        matchNama && matchDept && matchJenis && matchStatus && startOk && endOk
      );
    });
  }, [rows, filters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const openModal = () => {
    // Open as add mode (reset editing state and clear form)
    setEditingId(null);
    setForm({
      nama: "",
      jabatan: "",
      jenisCuti: "",
      tanggalMulai: "",
      tanggalSelesai: "",
      alasan: "",
    });
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const saveForm = () => {
    if (
      !form.nama ||
      !form.jabatan ||
      !form.jenisCuti ||
      !form.tanggalMulai ||
      !form.tanggalSelesai
    )
      return;
    if (editingId) {
      // Update existing item
      setRows((prev) =>
        prev.map((x) =>
          x.id === editingId
            ? {
                ...x,
                nama: form.nama,
                jabatan: form.jabatan,
                jenisCuti: form.jenisCuti as CutiRecord["jenisCuti"],
                tanggalMulai: form.tanggalMulai,
                tanggalSelesai: form.tanggalSelesai,
                alasan: form.alasan,
              }
            : x
        )
      );
    } else {
      // Add new item
      const newItem: CutiRecord = {
        id: `CUTI-${String(rows.length + 1).padStart(3, "0")}`,
        nama: form.nama,
        jabatan: form.jabatan,
        jenisCuti: form.jenisCuti as CutiRecord["jenisCuti"],
        tanggalMulai: form.tanggalMulai,
        tanggalSelesai: form.tanggalSelesai,
        alasan: form.alasan,
        status: "Diajukan",
      };
      setRows((prev) => [newItem, ...prev]);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setForm({
      nama: "",
      jabatan: "",
      jenisCuti: "",
      tanggalMulai: "",
      tanggalSelesai: "",
      alasan: "",
    });
  };

  const editItem = (id: string) => {
    const item = rows.find((x) => x.id === id);
    if (!item) return;
    setEditingId(id);
    setForm({
      nama: item.nama,
      jabatan: item.jabatan,
      jenisCuti: item.jenisCuti,
      tanggalMulai: item.tanggalMulai,
      tanggalSelesai: item.tanggalSelesai,
      alasan: item.alasan,
    });
    setIsModalOpen(true);
  };

  const deleteItem = (id: string) => {
    const item = rows.find((x) => x.id === id) || null;
    setDeleteTarget(item);
    setIsDeleteOpen(true);
  };

  const submitItem = (id: string) => {
    setRows((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "Diajukan" } : x))
    );
  };

  const statusBadge = (s: CutiRecord["status"]) => {
    const map: Record<CutiRecord["status"], string> = {
      Draft: "bg-gray-200 text-gray-800",
      Diajukan: "bg-yellow-500 text-white",
      Disetujui: "bg-green-500 text-white",
      Ditolak: "bg-red-500 text-white",
    };
    return (
      <span
        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${map[s]}`}
      >
        {s}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                PENGAJUAN CUTI
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  General
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Pengajuan Cuti
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                name="nama"
                value={filters.nama}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari nama..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Cuti
              </label>
              <select
                name="jenisCuti"
                value={filters.jenisCuti}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              >
                <option value="">Semua</option>
                <option value="Tahunan">Tahunan</option>
                <option value="Sakit">Sakit</option>
                <option value="Melahirkan">Melahirkan</option>
                <option value="Izin">Izin</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              >
                <option value="">Semua</option>
                <option value="Draft">Draft</option>
                <option value="Diajukan">Diajukan</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai ≥
              </label>
              <input
                type="date"
                name="tglAwal"
                value={filters.tglAwal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai ≤
              </label>
              <input
                type="date"
                name="tglAkhir"
                value={filters.tglAkhir}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm flex items-center justify-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-end mb-6">
            <button
              onClick={openModal}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors text-sm">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Modal Tambah/Edit */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">
                    {editingId
                      ? "Edit Pengajuan Cuti"
                      : "Tambah Pengajuan Cuti"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-md"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama
                    </label>
                    <input
                      name="nama"
                      value={form.nama}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Nama pegawai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jabatan
                    </label>
                    <input
                      name="jabatan"
                      value={form.jabatan}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Jabatan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Cuti
                    </label>
                    <select
                      name="jenisCuti"
                      value={form.jenisCuti}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">Pilih jenis</option>
                      <option value="Tahunan">Tahunan</option>
                      <option value="Sakit">Sakit</option>
                      <option value="Melahirkan">Melahirkan</option>
                      <option value="Izin">Izin</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      name="tanggalMulai"
                      value={form.tanggalMulai}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      name="tanggalSelesai"
                      value={form.tanggalSelesai}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alasan
                    </label>
                    <textarea
                      name="alasan"
                      value={form.alasan}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      rows={3}
                      placeholder="Alasan pengajuan cuti"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    onClick={saveForm}
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Konfirmasi Hapus */}
          <ConfirmDeleteModal
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setDeleteTarget(null);
            }}
            onConfirm={() => {
              if (deleteTarget) {
                setRows((prev) => prev.filter((x) => x.id !== deleteTarget.id));
              }
              setDeleteTarget(null);
            }}
            title="Konfirmasi Hapus Pengajuan Cuti"
            message="Apakah Anda yakin ingin menghapus pengajuan cuti ini?"
            itemName={deleteTarget?.id}
          />

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1"
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jabatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis Cuti
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alasan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.slice(0, showEntries).map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {r.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {r.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {r.jabatan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {r.jenisCuti}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{`${r.tanggalMulai} - ${r.tanggalSelesai}`}</td>
                    <td
                      className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate"
                      title={r.alasan}
                    >
                      {r.alasan || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {statusBadge(r.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editItem(r.id)}
                          className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(r.id)}
                          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {r.status !== "Diajukan" && (
                          <button
                            onClick={() => submitItem(r.id)}
                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                            title="Ajukan"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 flex justify-between items-center text-sm text-gray-600">
              <span>
                Showing 1 to {Math.min(filtered.length, showEntries)} of{" "}
                {filtered.length} entries
              </span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 border border-primary bg-primary text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralPengajuanCutiDashboard;
