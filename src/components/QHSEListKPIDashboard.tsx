import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, FileDown, Search, Filter, Clock } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import type { MasterKPI } from './QHSEMasterKPIDashboard';

const MASTER_LOCAL_KEY = 'qhse_master_kpi';
const LIST_LOCAL_KEY = 'qhse_list_kpi';

type ListKPI = {
  id: string;
  bulan: string; // 1-12
  tahun: number;
  kpiId: string; // reference to MasterKPI.id
  target: number;
  realisasi: number;
};

const bulanOptions = [
  { value: '1', label: 'Januari' },
  { value: '2', label: 'Februari' },
  { value: '3', label: 'Maret' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mei' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'Agustus' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

const QHSEListKPIDashboard: React.FC = () => {
  const [master, setMaster] = useState<MasterKPI[]>([]);
  const [rows, setRows] = useState<ListKPI[]>([]);
  const [search, setSearch] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterNama, setFilterNama] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ListKPI | null>(null);
  const [form, setForm] = useState<{ bulan: string; tahun: string; kpiId: string; target: string; realisasi: string }>({ bulan: '', tahun: String(new Date().getFullYear()), kpiId: '', target: '', realisasi: '' });
  const [deleteTarget, setDeleteTarget] = useState<ListKPI | null>(null);

  useEffect(() => {
    const m = localStorage.getItem(MASTER_LOCAL_KEY);
    if (m) {
      try { setMaster(JSON.parse(m)); } catch {}
    }
    const l = localStorage.getItem(LIST_LOCAL_KEY);
    if (l) {
      try { setRows(JSON.parse(l)); } catch {}
    }
  }, []);

  const persist = (data: ListKPI[]) => {
    setRows(data);
    localStorage.setItem(LIST_LOCAL_KEY, JSON.stringify(data));
  };

  const resetForm = () => {
    setForm({ bulan: '', tahun: String(new Date().getFullYear()), kpiId: '', target: '', realisasi: '' });
    setEditing(null);
  };

  const openAdd = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (r: ListKPI) => {
    setEditing(r);
    setForm({ bulan: r.bulan, tahun: String(r.tahun), kpiId: r.kpiId, target: String(r.target), realisasi: String(r.realisasi) });
    setIsModalOpen(true);
  };

  const saveForm = () => {
    if (!form.bulan || !form.tahun || !form.kpiId || form.target === '' || form.realisasi === '') return;
    const payload: ListKPI = {
      id: editing ? editing.id : String(Date.now()),
      bulan: form.bulan,
      tahun: Number(form.tahun),
      kpiId: form.kpiId,
      target: Number(form.target),
      realisasi: Number(form.realisasi),
    };
    if (editing) {
      persist(rows.map(r => r.id === editing.id ? payload : r));
    } else {
      persist([payload, ...rows]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const confirmDelete = (r: ListKPI) => setDeleteTarget(r);
  const onConfirmDelete = () => {
    if (!deleteTarget) return;
    persist(rows.filter(r => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const nameById = (id: string) => master.find(m => m.id === id)?.nama || '-';
  const jenisById = (id: string) => master.find(m => m.id === id)?.jenis || '';

  const filtered = useMemo(() => {
    const t = search.toLowerCase();
    return rows.filter(r =>
      (!filterBulan || r.bulan === filterBulan) &&
      (!filterTahun || String(r.tahun) === filterTahun) &&
      (!filterNama || r.kpiId === filterNama) &&
      (!filterJenis || jenisById(r.kpiId) === filterJenis) &&
      (!t || nameById(r.kpiId).toLowerCase().includes(t))
    );
  }, [rows, search, filterBulan, filterTahun, filterNama, filterJenis, master]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section (MCU style) */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">LIST KPI</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">KPI</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">List KPI</span>
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
        {/* Search and Filter Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Nama KPI</label>
              <div className="relative">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ketik kata kunci..." className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Bulan</label>
              <div className="relative">
                <select value={filterBulan} onChange={e => setFilterBulan(e.target.value)} className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white">
                  <option value="">Semua Bulan</option>
                  {bulanOptions.map(b => (<option key={b.value} value={b.value}>{b.label}</option>))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
              <input value={filterTahun} onChange={e => setFilterTahun(e.target.value)} placeholder="Tahun" className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis KPI</label>
              <select value={filterJenis} onChange={e => setFilterJenis(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                <option value="">Semua Jenis</option>
                <option value="Leading">Leading</option>
                <option value="Lagging">Lagging</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama KPI</label>
              <select value={filterNama} onChange={e => setFilterNama(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                <option value="">Semua KPI</option>
                {master.map(m => (<option key={m.id} value={m.id}>{m.nama}</option>))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={openAdd} className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 text-sm">
              <Plus className="h-5 w-5 mr-2" /> Tambah KPI
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 text-sm">
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select value={String(pageSize)} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 text-sm">
              <FileDown className="h-5 w-5 mr-2" /> Excel
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 text-sm">
              <FileDown className="h-5 w-5 mr-2" /> CSV
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 text-sm">
              <FileDown className="h-5 w-5 mr-2" /> PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Bulan</th>
                  <th className="px-4 py-3 text-left">Tahun</th>
                  <th className="px-4 py-3 text-left">Nama KPI</th>
                  <th className="px-4 py-3 text-right">Target</th>
                  <th className="px-4 py-3 text-right">Realisasi</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(r => {
                  const achieved = r.realisasi >= r.target;
                  return (
                  
  <tr key={r.id} className={`border-t border-gray-100 hover:bg-gray-50 ${achieved ? '' : 'bg-red-50/40'}`}>
                      <td className="px-4 py-3 text-sm">{bulanOptions.find(b => b.value === r.bulan)?.label || r.bulan}</td>
                      <td className="px-4 py-3 text-sm">{r.tahun}</td>
                      <td className="px-4 py-3 text-sm">{nameById(r.kpiId)}</td>
                      <td className="px-4 py-3 text-sm text-right">{r.target}</td>
                      <td className="px-4 py-3 text-sm text-right">{r.realisasi}</td>
                      <td className="px-4 py-3 text-center text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${achieved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {achieved ? 'Tercapai' : 'Tidak Tercapai'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex gap-2">
                          <button onClick={() => openEdit(r)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => confirmDelete(r)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200" title="Hapus">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 text-sm">
            <div>Menampilkan {pageItems.length} dari {filtered.length} data</div>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <span>Hal {page}/{totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b font-semibold">{editing ? 'Edit KPI' : 'Tambah KPI'}</div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Bulan</label>
                <select value={form.bulan} onChange={e => setForm(f => ({ ...f, bulan: e.target.value }))} className="w-full px-3 py-2 border rounded bg-white">
                  <option value="">Pilih Bulan</option>
                  {bulanOptions.map(b => (<option key={b.value} value={b.value}>{b.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Tahun</label>
                <input value={form.tahun} onChange={e => setForm(f => ({ ...f, tahun: e.target.value }))} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Nama KPI</label>
                <select value={form.kpiId} onChange={e => setForm(f => ({ ...f, kpiId: e.target.value }))} className="w-full px-3 py-2 border rounded bg-white">
                  <option value="">Pilih KPI</option>
                  {master.map(m => (<option key={m.id} value={m.id}>{m.nama} ({m.jenis})</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Target</label>
                <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm mb-1">Realisasi</label>
                <input type="number" value={form.realisasi} onChange={e => setForm(f => ({ ...f, realisasi: e.target.value }))} className="w-full px-3 py-2 border rounded" />
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 border rounded">Batal</button>
              <button onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" disabled={!form.bulan || !form.tahun || !form.kpiId || form.target === '' || form.realisasi === ''}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        title="Konfirmasi Hapus KPI"
        itemName={deleteTarget ? `${bulanOptions.find(b => b.value === deleteTarget.bulan)?.label} ${deleteTarget.tahun} - ${nameById(deleteTarget.kpiId)}` : undefined}
      />
    </div>
  );
};

export default QHSEListKPIDashboard;
