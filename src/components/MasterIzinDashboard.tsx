import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, FileDown, FileText, ChevronDown, Save, X } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface MasterIzinEntry {
  id: string;
  no: number;
  kodeIzin: string;
  namaIzin: string;
  keterangan?: string;
  aktif: boolean;
}

const MasterIzinDashboard: React.FC = () => {
  const [data, setData] = useState<MasterIzinEntry[]>([
    { id: "1", no: 1, kodeIzin: "IZN001", namaIzin: "Izin Sakit", keterangan: "Izin karena sakit", aktif: true },
    { id: "2", no: 2, kodeIzin: "IZN002", namaIzin: "Izin Pribadi", keterangan: "Urusan keluarga", aktif: true },
  ]);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateRows, setAnimateRows] = useState(false);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<MasterIzinEntry | null>(null);
  const [form, setForm] = useState<{ kodeIzin: string; namaIzin: string; keterangan: string; aktif: boolean }>({ kodeIzin: "", namaIzin: "", keterangan: "", aktif: true });
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<MasterIzinEntry | null>(null);

  useEffect(() => { setTimeout(() => setAnimateRows(true), 100); }, []);

  const filtered = data.filter(d =>
    d.kodeIzin.toLowerCase().includes(search.toLowerCase()) ||
    d.namaIzin.toLowerCase().includes(search.toLowerCase()) ||
    (d.keterangan || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = filtered.slice(startIndex, endIndex);

  const openAdd = () => { setEditing(null); setForm({ kodeIzin: "", namaIzin: "", keterangan: "", aktif: true }); setIsFormOpen(true); };
  const openEdit = (row: MasterIzinEntry) => { setEditing(row); setForm({ kodeIzin: row.kodeIzin, namaIzin: row.namaIzin, keterangan: row.keterangan || "", aktif: row.aktif }); setIsFormOpen(true); };

  const saveForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.kodeIzin.trim() || !form.namaIzin.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    if (editing) {
      setData(prev => prev.map(x => x.id === editing.id ? { ...x, kodeIzin: form.kodeIzin.trim(), namaIzin: form.namaIzin.trim(), keterangan: form.keterangan.trim(), aktif: form.aktif } : x));
    } else {
      const newId = (data.length + 1).toString();
      const newRow: MasterIzinEntry = { id: newId, no: 1, kodeIzin: form.kodeIzin.trim(), namaIzin: form.namaIzin.trim(), keterangan: form.keterangan.trim(), aktif: form.aktif };
      setData(prev => [newRow, ...prev.map(x => ({ ...x, no: x.no + 1 }))]);
    }
    setSaving(false);
    setIsFormOpen(false);
    setEditing(null);
  };

  const requestDelete = (row: MasterIzinEntry) => { setToDelete(row); setDeleteOpen(true); };
  const confirmDelete = () => {
    if (!toDelete) return;
    setData(prev => prev.filter(x => x.id !== toDelete.id).map((x, i) => ({ ...x, no: i + 1 })));
    setToDelete(null);
    setDeleteOpen(false);
  };

  const handleExportExcel = () => {};
  const handleExportPDF = () => {};

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Master Izin</h1>

        {/* Filters + Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Show</span>
              <div className="relative">
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="block w-24 appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ChevronDown className="h-4 w-4" /></div>
              </div>
              <span className="text-gray-700">entries</span>
            </div>
            <div className="flex-1" />
            <div>
              <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Cari kode/nama/keterangan" className="px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex space-x-3">
              <button onClick={handleExportExcel} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"><FileDown className="h-4 w-4 mr-2" />Cetak Excel</button>
              <button onClick={handleExportPDF} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"><FileText className="h-4 w-4 mr-2" />Cetak PDF</button>
              <button onClick={openAdd} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"><Plus className="h-4 w-4 mr-2" />Tambah</button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Izin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Izin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktif</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageData.map((row, index) => (
                  <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"} ${animateRows ? "animate-in fade-in slide-in-from-bottom-2" : "opacity-0"}`} style={{ animationDelay: animateRows ? `${index * 100}ms` : "0ms", animationFillMode: "forwards" }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{row.kodeIzin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaIzin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keterangan || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${row.aktif ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>{row.aktif ? 'Aktif' : 'Nonaktif'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEdit(row)} className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => requestDelete(row)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} entries</div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">{currentPage}</button>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
            </nav>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit' : 'Tambah'} Master Izin</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={saveForm} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kode Izin <span className="text-red-500">*</span></label>
                <input value={form.kodeIzin} onChange={(e) => setForm(prev => ({ ...prev, kodeIzin: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contoh: IZN001" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Izin <span className="text-red-500">*</span></label>
                <input value={form.namaIzin} onChange={(e) => setForm(prev => ({ ...prev, namaIzin: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contoh: Izin Sakit" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                <input value={form.keterangan} onChange={(e) => setForm(prev => ({ ...prev, keterangan: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Opsional" />
              </div>
              <div className="flex items-center gap-2">
                <input id="aktif" type="checkbox" checked={form.aktif} onChange={(e) => setForm(prev => ({ ...prev, aktif: e.target.checked }))} className="h-4 w-4" />
                <label htmlFor="aktif" className="text-sm text-gray-700">Aktif</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2 disabled:opacity-50">
                  {saving ? <Save className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />} Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} itemName={toDelete?.namaIzin} />
    </div>
  );
};

export default MasterIzinDashboard;
