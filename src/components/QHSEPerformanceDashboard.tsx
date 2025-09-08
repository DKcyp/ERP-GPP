import React, { useMemo, useState } from 'react';
import { Clock, Search, PlusCircle, Download, FileText, Pencil, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface PerformanceItem {
  id: string;
  bulan: string; // e.g., "Januari"
  tahun: number; // e.g., 2025
  lagging: string; // text/score
  leading: string; // text/score
  document?: string; // url or filename
}

const BULAN_OPTIONS = [
  'Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'
];

const TAHUN_OPTIONS = (() => {
  const now = new Date().getFullYear();
  const arr: number[] = [];
  for (let t = now - 3; t <= now + 1; t++) arr.push(t);
  return arr;
})();

const initialData: PerformanceItem[] = [
  { id: '1', bulan: 'Januari', tahun: 2025, lagging: '0 incident', leading: '5 toolbox meeting', document: 'qhse-perf-jan25.pdf' },
  { id: '2', bulan: 'Februari', tahun: 2025, lagging: '1 incident', leading: '4 toolbox meeting', document: undefined },
];

const QHSEPerformanceDashboard: React.FC = () => {
  // table state
  const [rows, setRows] = useState<PerformanceItem[]>(initialData);

  // filters
  const [bulan, setBulan] = useState<string>('');
  const [tahun, setTahun] = useState<string>('');

  // table controls
  const [showEntries, setShowEntries] = useState('10');
  const [page, setPage] = useState(1);

  // modal state
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<'add'|'edit'>('add');
  const [form, setForm] = useState<Partial<PerformanceItem>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const m = !bulan || r.bulan === bulan;
      const y = !tahun || String(r.tahun) === tahun;
      return m && y;
    });
  }, [rows, bulan, tahun]);

  const perPage = Math.max(1, parseInt(showEntries, 10));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const openAdd = () => {
    setMode('add');
    setForm({ bulan: '', tahun: new Date().getFullYear(), lagging: '', leading: '', document: '' });
    setShowForm(true);
  };

  const openEdit = (r: PerformanceItem) => {
    setMode('edit');
    setForm({ ...r });
    setShowForm(true);
  };

  const saveForm = () => {
    if (!form.bulan || !form.tahun || form.lagging === undefined || form.leading === undefined) return;
    if (mode === 'add') {
      const newItem: PerformanceItem = {
        id: String(Date.now()),
        bulan: form.bulan as string,
        tahun: Number(form.tahun),
        lagging: String(form.lagging),
        leading: String(form.leading),
        document: form.document || undefined,
      };
      setRows(prev => [newItem, ...prev]);
    } else if (mode === 'edit' && form.id) {
      setRows(prev => prev.map(p => p.id === form.id ? ({
        id: form.id as string,
        bulan: form.bulan as string,
        tahun: Number(form.tahun),
        lagging: String(form.lagging),
        leading: String(form.leading),
        document: form.document || undefined,
      }) : p));
    }
    setShowForm(false);
  };

  const confirmDelete = () => {
    if (confirmId) setRows(prev => prev.filter(p => p.id !== confirmId));
    setConfirmId(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">QHSE PERFORMANCE</h1>
                <nav className="text-sm text-gray-600">
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                  <span className="mx-2">›</span>
                  <span className="text-blue-600 font-medium">QHSE Performance</span>
                </nav>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
                <div className="relative">
                  <select
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                    value={bulan}
                    onChange={(e) => setBulan(e.target.value)}
                  >
                    <option value="">Pilih bulan...</option>
                    {BULAN_OPTIONS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                <div className="relative">
                  <select
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                  >
                    <option value="">Pilih tahun...</option>
                    {TAHUN_OPTIONS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-end justify-end">
                <div className="flex gap-3">
                  <button
                    onClick={openAdd}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" /> Tambah Data
                  </button>
                  <button
                    onClick={() => setPage(1)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Search className="h-5 w-5 mr-2" /> Cari Data
                  </button>
                </div>
              </div>
            </div>

            {/* Table controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={showEntries}
                  onChange={(e) => { setShowEntries(e.target.value); setPage(1); }}
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
                  onClick={() => alert('Export Excel')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <Download className="h-5 w-5 mr-2" /> Excel
                </button>
                <button
                  onClick={() => alert('Export CSV')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Download className="h-5 w-5 mr-2" /> CSV
                </button>
                <button
                  onClick={() => alert('Export PDF')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  <Download className="h-5 w-5 mr-2" /> PDF
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lagging Indicator</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leading Indicator</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paged.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.bulan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.tahun}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.lagging}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.leading}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {r.document ? (
                          <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                            <FileText className="h-4 w-4 mr-1" /> View Document
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(r)}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setConfirmId(r.id)}
                            className="inline-flex items-center px-2 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                            title="Hapus"
                          >
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
            <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-600">
              <div>
                Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50"
                >Prev</button>
                <span>Page {page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50"
                >Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg p-5">
            <h2 className="text-lg font-semibold mb-4">{mode === 'add' ? 'Tambah Data Performance' : 'Edit Data Performance'}</h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Bulan</label>
                  <select
                    value={form.bulan || ''}
                    onChange={e => setForm(f => ({ ...f, bulan: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Pilih Bulan</option>
                    {BULAN_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tahun</label>
                  <select
                    value={form.tahun?.toString() || ''}
                    onChange={e => setForm(f => ({ ...f, tahun: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Pilih Tahun</option>
                    {TAHUN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Lagging Indicator</label>
                <input
                  type="text"
                  value={form.lagging || ''}
                  onChange={e => setForm(f => ({ ...f, lagging: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Leading Indicator</label>
                <input
                  type="text"
                  value={form.leading || ''}
                  onChange={e => setForm(f => ({ ...f, leading: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Document (opsional)</label>
                <input
                  type="text"
                  value={form.document || ''}
                  onChange={e => setForm(f => ({ ...f, document: e.target.value }))}
                  placeholder="Nama file atau URL"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Batal</button>
              <button onClick={saveForm} className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
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
        message="Apakah Anda yakin ingin menghapus data performance ini?"
        itemName={confirmId ? (() => { const i = rows.find(r => r.id === confirmId); return i ? `${i.bulan} ${i.tahun}` : undefined; })() : undefined}
      />
    </>
  );
};

export default QHSEPerformanceDashboard;
