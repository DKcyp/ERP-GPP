import React, { useMemo, useState } from "react";
import { Clock, Download, PlusCircle, Search, Pencil, Trash2, X } from "lucide-react";
import ConfirmDeleteModal from './ConfirmDeleteModal';

type Item = {
  id: string;
  noSurveymeter: string;
  masaBerlaku: string; // YYYY-MM-DD
};

const initialData: Item[] = [
  { id: "S-1", noSurveymeter: "SM-1001", masaBerlaku: "2024-11-15" },
  { id: "S-2", noSurveymeter: "SM-1002", masaBerlaku: "2024-09-20" },
  { id: "S-3", noSurveymeter: "SM-1010", masaBerlaku: "2025-02-01" },
];

const daysTo = (dateStr: string) => {
  const today = new Date();
  const target = new Date(dateStr);
  const startOfToday = new Date(today.toDateString());
  return Math.ceil((target.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
};

const RadiographySurveymeterDashboard: React.FC = () => {
  const [rows, setRows] = useState<Item[]>(initialData);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showEntries, setShowEntries] = useState("10");
  const [page, setPage] = useState(1);

  // Modal & CRUD state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState<{ noSurveymeter: string; masaBerlaku: string }>({ noSurveymeter: '', masaBerlaku: '' });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm({ noSurveymeter: '', masaBerlaku: '' });
    setShowForm(true);
  };

  const openEdit = (row: Item) => {
    setEditing(row);
    setForm({ noSurveymeter: row.noSurveymeter, masaBerlaku: row.masaBerlaku });
    setShowForm(true);
  };

  const genId = () => {
    const nums = rows.map(r => Number(r.id.replace(/^[^0-9]*/,'').split('-').pop() || '0')).filter(n=>!isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `S-${next}`;
  };

  const saveForm = () => {
    const payload: Item = {
      id: editing ? editing.id : genId(),
      noSurveymeter: form.noSurveymeter.trim(),
      masaBerlaku: form.masaBerlaku,
    };
    if (!payload.noSurveymeter || !payload.masaBerlaku) {
      alert('No. Surveymeter dan Masa Berlaku wajib diisi');
      return;
    }
    if (isNaN(new Date(payload.masaBerlaku).getTime())) {
      alert('Format tanggal tidak valid');
      return;
    }
    if (editing) {
      setRows(prev => prev.map(r => (r.id === editing.id ? payload : r)));
    } else {
      setRows(prev => [payload, ...prev]);
      setPage(1);
    }
    setShowForm(false);
    setEditing(null);
  };

  const askDelete = (row: Item) => {
    setDeleteTarget(row);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRows(prev => prev.filter(r => r.id !== deleteTarget.id));
    setShowDelete(false);
    setDeleteTarget(null);
  };

  const filtered = useMemo(() => {
    return rows.filter((d) => {
      const masa = new Date(d.masaBerlaku);
      const inStart = !startDate || masa >= new Date(startDate + "T00:00:00");
      const inEnd = !endDate || masa <= new Date(endDate + "T23:59:59");
      return inStart && inEnd;
    });
  }, [rows, startDate, endDate]);

  const perPage = Number(showEntries) || 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * perPage;
  const paged = filtered.slice(startIdx, startIdx + perPage);

  const handleExport = (t: string) => alert(`Export ${t} (dummy)`);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">SURVEYMETER</h1>
                <nav className="text-sm text-gray-600">
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Masa Berlaku - Dari</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Masa Berlaku - Sampai</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
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
              <button onClick={() => handleExport("Excel")} className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-green-600 hover:bg-green-700">
                <Download className="h-5 w-5 mr-2" />Excel
              </button>
              <button onClick={() => handleExport("CSV")} className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <Download className="h-5 w-5 mr-2" />CSV
              </button>
              <button onClick={() => handleExport("PDF")} className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-red-600 hover:bg-red-700">
                <Download className="h-5 w-5 mr-2" />PDF
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Surveymeter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa Berlaku</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paged.map((row) => {
                    const dt = daysTo(row.masaBerlaku);
                    const danger = dt <= 60; // highlight merah jika sisa hari <= 60 (konsisten dengan halaman lain)
                    return (
                      <tr key={row.id} className={danger ? "bg-red-50 hover:bg-red-100 transition-colors" : "hover:bg-gray-50 transition-colors"}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.noSurveymeter}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(row.masaBerlaku).toLocaleDateString("id-ID")}
                          {danger && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {dt < 0 ? `${Math.abs(dt)} hari lewat` : `${dt} hari`}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <div className="inline-flex items-center space-x-2">
                            <button
                              onClick={() => openEdit(row)}
                              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4 mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => askDelete(row)}
                              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                              title="Hapus"
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

          {/* Modal Tambah/Edit */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                  <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Surveymeter' : 'Tambah Surveymeter'}</h2>
                  <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">No. Surveymeter</label>
                      <input
                        value={form.noSurveymeter}
                        onChange={(e)=>setForm(prev=>({...prev, noSurveymeter: e.target.value}))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Contoh: SM-1001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Masa Berlaku</label>
                      <input
                        type="date"
                        value={form.masaBerlaku}
                        onChange={(e)=>setForm(prev=>({...prev, masaBerlaku: e.target.value}))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
                  <button onClick={()=>setShowForm(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">Batal</button>
                  <button onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Simpan</button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Konfirmasi Hapus */}
          <ConfirmDeleteModal
            isOpen={showDelete}
            title="Hapus Data Surveymeter?"
            message={deleteTarget ? `Hapus data ${deleteTarget.noSurveymeter} (berlaku sampai ${new Date(deleteTarget.masaBerlaku).toLocaleDateString('id-ID')})?` : ''}
            onClose={() => setShowDelete(false)}
            onConfirm={confirmDelete}
          />

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {filtered.length === 0 ? 0 : startIdx + 1} to {Math.min(startIdx + perPage, filtered.length)} of {filtered.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-50 bg-white hover:bg-gray-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-50 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RadiographySurveymeterDashboard;
