import React, { useEffect, useState } from "react";
import { Search, FileSpreadsheet, File, FileText, Plus, Pencil, Trash2, Calendar, DollarSign } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface TripItem {
  id: string;
  no: number;
  namaPegawai: string;
  tujuan: string;
  tanggalBerangkat: string; // ISO date
  tanggalPulang: string; // ISO date
  biaya: number;
  keterangan?: string;
  attachmentName?: string;
  attachmentUrl?: string;
}

const PengajuanPerjalananDinasDashboard: React.FC = () => {
  const [data, setData] = useState<TripItem[]>([
    { id: "1", no: 1, namaPegawai: "Budi Santoso", tujuan: "Surabaya", tanggalBerangkat: "2025-03-05", tanggalPulang: "2025-03-07", biaya: 2500000, keterangan: "Kunjungan klien", attachmentName: "SPD_Budi.pdf", attachmentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    { id: "2", no: 2, namaPegawai: "Siti Aminah", tujuan: "Bandung", tanggalBerangkat: "2025-03-10", tanggalPulang: "2025-03-12", biaya: 1800000, keterangan: "Survey lokasi", attachmentName: "RAB_Siti.xlsx", attachmentUrl: "https://file-examples.com/storage/fe1d6b1a0ec/example.xlsx" },
  ]);

  // Filters
  const [searchNama, setSearchNama] = useState("");
  const [searchTujuan, setSearchTujuan] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Table state
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TripItem | null>(null);
  const [form, setForm] = useState<Omit<TripItem, "id" | "no">>({
    namaPegawai: "",
    tujuan: "",
    tanggalBerangkat: "",
    tanggalPulang: "",
    biaya: 0,
    keterangan: "",
  });

  // Delete confirm
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TripItem | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  const formatIDR = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  const handleSearch = () => setCurrentPage(1);

  const filtered = data.filter((d) => {
    const matchNama = d.namaPegawai.toLowerCase().includes(searchNama.toLowerCase());
    const matchTujuan = d.tujuan.toLowerCase().includes(searchTujuan.toLowerCase());
    const withinDate = (() => {
      const b = new Date(d.tanggalBerangkat).getTime();
      const fromOk = dateFrom ? b >= new Date(dateFrom).getTime() : true;
      const toOk = dateTo ? b <= new Date(dateTo).getTime() : true;
      return fromOk && toOk;
    })();
    return matchNama && matchTujuan && withinDate;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filtered.slice(startIndex, endIndex);

  const openAdd = () => {
    setEditingItem(null);
    setForm({ namaPegawai: "", tujuan: "", tanggalBerangkat: "", tanggalPulang: "", biaya: 0, keterangan: "" });
    setShowFormModal(true);
  };

  const openEdit = (item: TripItem) => {
    setEditingItem(item);
    setForm({
      namaPegawai: item.namaPegawai,
      tujuan: item.tujuan,
      tanggalBerangkat: item.tanggalBerangkat,
      tanggalPulang: item.tanggalPulang,
      biaya: item.biaya,
      keterangan: item.keterangan || "",
    });
    setShowFormModal(true);
  };

  const handleSave = () => {
    if (!form.namaPegawai || !form.tujuan || !form.tanggalBerangkat) {
      alert("Nama pegawai, tujuan, dan tanggal berangkat wajib diisi");
      return;
    }
    if (form.biaya < 0) {
      alert("Biaya tidak boleh negatif");
      return;
    }
    if (editingItem) {
      setData((prev) => prev.map((d) => (d.id === editingItem.id ? { ...editingItem, ...form } as TripItem : d)));
    } else {
      const newItem: TripItem = { id: Date.now().toString(), no: data.length + 1, ...form } as TripItem;
      setData((prev) => [newItem, ...prev.map((p) => ({ ...p, no: p.no + 1 }))]);
    }
    setShowFormModal(false);
    setEditingItem(null);
  };

  const askDelete = (item: TripItem) => {
    setDeleteTarget(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((d) => d.id !== deleteTarget.id).map((d, i) => ({ ...d, no: i + 1 })));
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleExport = (type: string) => alert(`Export ${type}`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Pengajuan Perjalanan Dinas</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Pegawai</label>
              <input value={searchNama} onChange={(e) => setSearchNama(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm" placeholder="Cari nama" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tujuan</label>
              <input value={searchTujuan} onChange={(e) => setSearchTujuan(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm" placeholder="Cari tujuan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Periode Dari</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">s.d</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show</span>
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handleSearch} className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
              <button onClick={openAdd} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end space-x-2">
          <button onClick={() => handleExport("Excel")} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export Excel</span>
          </button>
          <button onClick={() => handleExport("CSV")} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
            <File className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button onClick={() => handleExport("PDF")} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Pegawai</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tujuan</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Berangkat</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Pulang</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Biaya</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Attachment</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Keterangan</th>
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
                    <td className="px-4 py-3 text-sm text-gray-900">{item.tujuan}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">
                      <div className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>{new Date(item.tanggalBerangkat).toLocaleDateString("id-ID")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">
                      <div className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>{new Date(item.tanggalPulang).toLocaleDateString("id-ID")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      <div className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
                        <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                        <span>{formatIDR(item.biaya)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.attachmentName && item.attachmentUrl ? (
                        <a
                          href={item.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={item.attachmentName}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          {item.attachmentName}
                        </a>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.keterangan || "-"}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 text-amber-600 hover:bg-amber-50 rounded transition-all duration-200 hover:scale-110" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => askDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-all duration-200 hover:scale-110" title="Hapus">
                          <Trash2 className="h-4 w-4" />
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
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button onClick={() => setCurrentPage(1)} className={`px-2 py-1 text-sm font-medium rounded transition-colors ${currentPage === 1 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                  1
                </button>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">{editingItem ? "Edit Pengajuan Perjalanan Dinas" : "Tambah Pengajuan Perjalanan Dinas"}</h2>
                <button onClick={() => { setShowFormModal(false); setEditingItem(null); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">×</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai</label>
                  <input value={form.namaPegawai} onChange={(e) => setForm((f) => ({ ...f, namaPegawai: e.target.value }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Nama Pegawai" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
                  <input value={form.tujuan} onChange={(e) => setForm((f) => ({ ...f, tujuan: e.target.value }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Kota Tujuan" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berangkat</label>
                    <input type="date" value={form.tanggalBerangkat} onChange={(e) => setForm((f) => ({ ...f, tanggalBerangkat: e.target.value }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pulang</label>
                    <input type="date" value={form.tanggalPulang} onChange={(e) => setForm((f) => ({ ...f, tanggalPulang: e.target.value }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biaya</label>
                  <input type="number" min={0} value={form.biaya} onChange={(e) => setForm((f) => ({ ...f, biaya: Number(e.target.value) }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea value={form.keterangan} onChange={(e) => setForm((f) => ({ ...f, keterangan: e.target.value }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm h-24" placeholder="Keterangan (opsional)" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                <button onClick={() => { setShowFormModal(false); setEditingItem(null); }} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Batal</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Simpan</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Konfirmasi Hapus Pengajuan Perjalanan Dinas"
          message="Apakah Anda yakin ingin menghapus data ini?"
          itemName={deleteTarget ? `${deleteTarget.namaPegawai} - ${deleteTarget.tujuan}` : undefined}
        />
      </div>
    </div>
  );
};

export default PengajuanPerjalananDinasDashboard;
