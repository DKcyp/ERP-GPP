import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, FileDown, Search, Filter, Clock } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export type MasterKPI = {
  id: string;
  kode: string;
  nama: string;
  jenis: 'Lagging' | 'Leading';
  deskripsi?: string;
};

const LOCAL_KEY = 'qhse_master_kpi';

const QHSEMasterKPIDashboard: React.FC = () => {
  const [items, setItems] = useState<MasterKPI[]>([]);
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<MasterKPI | null>(null);
  const [form, setForm] = useState<{ kode: string; nama: string; jenis: 'Lagging' | 'Leading' | ''; deskripsi: string }>({
    kode: '',
    nama: '',
    jenis: '',
    deskripsi: '',
  });
  const [deleteTarget, setDeleteTarget] = useState<MasterKPI | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try { setItems(JSON.parse(raw)); } catch { /* ignore */ }
    } else {
      const seed: MasterKPI[] = [
        { id: '1', kode: 'KPI-001', nama: 'Kepatuhan APD', jenis: 'Leading', deskripsi: 'Kepatuhan penggunaan APD di lapangan' },
        { id: '2', kode: 'KPI-002', nama: 'Insiden Kerja', jenis: 'Lagging', deskripsi: 'Jumlah insiden kerja bulanan' },
      ];
      setItems(seed);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(seed));
    }
  }, []);

  const persist = (data: MasterKPI[]) => {
    setItems(data);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  };

  const resetForm = () => {
    setForm({ kode: '', nama: '', jenis: '', deskripsi: '' });
    setEditing(null);
  };

  const openAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (row: MasterKPI) => {
    setEditing(row);
    setForm({ kode: row.kode, nama: row.nama, jenis: row.jenis, deskripsi: row.deskripsi || '' });
    setIsModalOpen(true);
  };

  const saveForm = () => {
    if (!form.kode.trim() || !form.nama.trim() || !form.jenis) return;
    if (editing) {
      const updated = items.map(it => it.id === editing.id ? { ...editing, ...form, jenis: form.jenis as 'Lagging' | 'Leading' } : it);
      persist(updated);
    } else {
      const newItem: MasterKPI = {
        id: String(Date.now()),
        kode: form.kode.trim(),
        nama: form.nama.trim(),
        jenis: form.jenis as 'Lagging' | 'Leading',
        deskripsi: form.deskripsi?.trim() || '',
      };
      persist([newItem, ...items]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const confirmDelete = (row: MasterKPI) => setDeleteTarget(row);
  const onConfirmDelete = () => {
    if (!deleteTarget) return;
    const updated = items.filter(it => it.id !== deleteTarget.id);
    persist(updated);
    setDeleteTarget(null);
  };

  const filtered = useMemo(() => {
    const text = search.toLowerCase();
    return items.filter(it =>
      (!filterJenis || it.jenis === filterJenis) &&
      (!text || it.kode.toLowerCase().includes(text) || it.nama.toLowerCase().includes(text) || (it.deskripsi || '').toLowerCase().includes(text))
    );
  }, [items, search, filterJenis]);

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
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MASTER KPI</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">KPI</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master KPI</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Kode/Nama/Deskripsi</label>
              <div className="relative">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ketik kata kunci..." className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Jenis KPI</label>
              <div className="relative">
                <select value={filterJenis} onChange={e => setFilterJenis(e.target.value)} className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white">
                  <option value="">Semua Jenis</option>
                  <option value="Leading">Leading</option>
                  <option value="Lagging">Lagging</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Kode KPI</th>
                  <th className="px-4 py-3 text-left">Nama KPI</th>
                  <th className="px-4 py-3 text-left">Jenis</th>
                  <th className="px-4 py-3 text-left">Deskripsi</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(row => (
                  <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{row.kode}</td>
                    <td className="px-4 py-3 text-sm">{row.nama}</td>
                    <td className="px-4 py-3 text-sm">{row.jenis}</td>
                    <td className="px-4 py-3 text-sm">{row.deskripsi}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex gap-2">
                        <button onClick={() => openEdit(row)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => confirmDelete(row)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200" title="Hapus">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">Tidak ada data</td>
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
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm mb-1">Kode KPI</label>
                <input value={form.kode} onChange={e => setForm(f => ({ ...f, kode: e.target.value }))} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm mb-1">Nama KPI</label>
                <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm mb-1">Jenis</label>
                <select value={form.jenis} onChange={e => setForm(f => ({ ...f, jenis: e.target.value as any }))} className="w-full px-3 py-2 border rounded bg-white">
                  <option value="">Pilih Jenis</option>
                  <option value="Leading">Leading</option>
                  <option value="Lagging">Lagging</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Deskripsi</label>
                <textarea value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} className="w-full px-3 py-2 border rounded" />
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 border rounded">Batal</button>
              <button onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" disabled={!form.kode || !form.nama || !form.jenis}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        title="Konfirmasi Hapus KPI"
        itemName={deleteTarget?.nama}
      />
    </div>
  );
};

export default QHSEMasterKPIDashboard;
