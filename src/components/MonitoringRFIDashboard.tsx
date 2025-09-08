import React, { useMemo, useState } from 'react';
import { Search, PlusCircle, Download, Clock, Pencil, Trash2, X } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface Row {
  no: string; // No. RFI
  namaBarang: string;
  lokasi: string;
  status: 'Draft' | 'Proses' | 'Approved' | 'Rejected';
}

const sampleData: Row[] = [
  { no: 'RFI-2025-001', namaBarang: 'Valve Gate DN50', lokasi: 'Gudang A', status: 'Proses' },
  { no: 'RFI-2025-002', namaBarang: 'Pipa Seamless 2"', lokasi: 'Gudang B', status: 'Approved' },
  { no: 'RFI-2025-003', namaBarang: 'Safety Gloves', lokasi: 'Workshop 1', status: 'Draft' },
];

const StatusBadge: React.FC<{ s: Row['status'] }> = ({ s }) => {
  const map: Record<Row['status'], string> = {
    Draft: 'bg-gray-100 text-gray-700',
    Proses: 'bg-blue-100 text-blue-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[s]}`}>{s}</span>;
};

const MonitoringRFIDashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  // Data & UI state
  const [data, setData] = useState<Row[]>(sampleData);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({ no: '', namaBarang: '', lokasi: '', status: 'Draft' });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const filtered = useMemo(
    () =>
      data.filter((r) => {
        const q = search.toLowerCase();
        return (
          r.no.toLowerCase().includes(q) ||
          r.namaBarang.toLowerCase().includes(q) ||
          r.lokasi.toLowerCase().includes(q)
        );
      }),
    [search, data]
  );

  const displayed = useMemo(() => {
    const n = parseInt(showEntries, 10);
    return filtered.slice(0, isNaN(n) ? filtered.length : n);
  }, [filtered, showEntries]);

  const handleExport = (t: string) => alert(`Export ${t}`);

  // Helpers
  const genNo = () => {
    const y = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    return `RFI-${y}-${rand}`;
  };

  // Handlers
  const openAdd = () => {
    setEditing(null);
    setForm({ no: '', namaBarang: '', lokasi: '', status: 'Draft' });
    setShowForm(true);
  };

  const openEdit = (row: Row) => {
    setEditing(row);
    setForm(row);
    setShowForm(true);
  };

  const saveForm = () => {
    const payload: Row = { ...form, no: form.no.trim() || genNo() };
    if (!payload.namaBarang || !payload.lokasi) {
      alert('Nama Barang dan Lokasi wajib diisi');
      return;
    }
    if (editing) {
      setData(prev => prev.map(r => (r.no === editing.no ? payload : r)));
    } else {
      setData(prev => [payload, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const askDelete = (row: Row) => {
    setDeleteTarget(row);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setData(prev => prev.filter(r => r.no !== deleteTarget.no));
    setShowDelete(false);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MONITORING RFI</h1>
            <nav className="text-sm text-gray-600">QHSE › Monitoring Gudang › RFI</nav>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari No. RFI / Nama Barang / Lokasi</label>
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ketik untuk mencari..."
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={openAdd} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white shadow">
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow">
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Export + Show Entries */}
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
              onClick={() => handleExport('Excel')}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white shadow"
            >
              <Download className="h-5 w-5 mr-2" />Excel
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow"
            >
              <Download className="h-5 w-5 mr-2" />CSV
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white shadow"
            >
              <Download className="h-5 w-5 mr-2" />PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. RFI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayed.map((r) => (
                  <tr key={r.no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.namaBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.lokasi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge s={r.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => openEdit(r)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => askDelete(r)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayed.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah/Edit */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit RFI' : 'Tambah RFI'}</h2>
                <button onClick={()=>setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. RFI</label>
                    <input
                      value={form.no}
                      onChange={(e)=>setForm(prev=>({...prev, no: e.target.value}))}
                      disabled={!!editing}
                      placeholder="RFI-YYYY-XXX"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                    <input
                      value={form.namaBarang}
                      onChange={(e)=>setForm(prev=>({...prev, namaBarang: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                    <input
                      value={form.lokasi}
                      onChange={(e)=>setForm(prev=>({...prev, lokasi: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e)=>setForm(prev=>({...prev, status: e.target.value as Row['status']}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Proses">Proses</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
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
          title="Hapus RFI?"
          message={deleteTarget ? `Apakah Anda yakin ingin menghapus RFI ${deleteTarget.no}? Tindakan ini tidak dapat dibatalkan.` : ''}
          onClose={()=>setShowDelete(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

export default MonitoringRFIDashboard;
