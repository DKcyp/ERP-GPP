import React, { useMemo, useState } from 'react';
import { Search, PlusCircle, Download, Clock, Pencil, Trash2, X } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface Row {
  no: string; // No. CA
  namaPegawai: string;
  jumlah: number;
  tanggal: string; // ISO
  status: 'Draft' | 'Proses' | 'Approved' | 'Rejected';
}

const sampleData: Row[] = [
  { no: 'CA-2025-010', namaPegawai: 'Andi', jumlah: 1500000, tanggal: '2025-08-29', status: 'Proses' },
  { no: 'CA-2025-011', namaPegawai: 'Budi', jumlah: 2000000, tanggal: '2025-08-25', status: 'Approved' },
];

const rupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const StatusBadge: React.FC<{ s: Row['status'] }> = ({ s }) => {
  const map: Record<Row['status'], string> = {
    Draft: 'bg-gray-100 text-gray-700',
    Proses: 'bg-blue-100 text-blue-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[s]}`}>{s}</span>;
};

const MonitoringCADashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  // table data state
  const [rows, setRows] = useState<Row[]>(sampleData);

  // form modal state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({ no: '', namaPegawai: '', jumlah: 0, tanggal: '', status: 'Draft' });

  // delete modal state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const filtered = useMemo(() => rows.filter(r => (
    r.no.toLowerCase().includes(search.toLowerCase()) ||
    r.namaPegawai.toLowerCase().includes(search.toLowerCase())
  )), [rows, search]);

  const displayed = useMemo(() => {
    const n = parseInt(showEntries, 10);
    return filtered.slice(0, isNaN(n) ? filtered.length : n);
  }, [filtered, showEntries]);

  const handleExport = (t: string) => alert(`Export ${t}`);

  // actions
  const openAdd = () => {
    setEditing(null);
    setForm({ no: '', namaPegawai: '', jumlah: 0, tanggal: '', status: 'Draft' });
    setShowForm(true);
  };

  const openEdit = (r: Row) => {
    setEditing(r);
    setForm({ ...r });
    setShowForm(true);
  };

  const genNo = () => {
    const seq = Math.floor(100 + Math.random() * 900);
    const year = new Date().getFullYear();
    return `CA-${year}-${seq}`;
  };

  const saveForm = () => {
    if (editing) {
      setRows(prev => prev.map(p => (p.no === editing.no ? { ...form } : p)));
    } else {
      const no = form.no && form.no.trim() !== '' ? form.no : genNo();
      setRows(prev => [{ ...form, no }, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const askDelete = (r: Row) => {
    setDeleteTarget(r);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setRows(prev => prev.filter(p => p.no !== deleteTarget.no));
      setDeleteTarget(null);
      setShowDelete(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MONITORING CASH ADVANCE (CA)</h1>
            <nav className="text-sm text-gray-600">QHSE › Monitoring › Cash Advance</nav>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari No. CA / Nama Pegawai</label>
              <div className="relative">
                <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Ketik untuk mencari..." className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
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

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select value={showEntries} onChange={(e)=>setShowEntries(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-3">
            <button onClick={()=>handleExport('Excel')} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white shadow"><Download className="h-5 w-5 mr-2"/>Excel</button>
            <button onClick={()=>handleExport('CSV')} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow"><Download className="h-5 w-5 mr-2"/>CSV</button>
            <button onClick={()=>handleExport('PDF')} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white shadow"><Download className="h-5 w-5 mr-2"/>PDF</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. CA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayed.map((r)=> (
                  <tr key={r.no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.namaPegawai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rupiah(r.jumlah)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(r.tanggal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge s={r.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(r)} className="inline-flex items-center px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 text-xs" title="Edit">
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button onClick={() => askDelete(r)} className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 text-xs" title="Hapus">
                          <Trash2 className="h-4 w-4 mr-1" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayed.length===0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Tidak ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Cash Advance' : 'Tambah Cash Advance'}</h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. CA</label>
                  <input
                    type="text"
                    value={form.no}
                    onChange={(e) => setForm(f => ({ ...f, no: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Mis. CA-2025-123"
                    disabled={!!editing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai</label>
                  <input
                    type="text"
                    value={form.namaPegawai}
                    onChange={(e) => setForm(f => ({ ...f, namaPegawai: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Nama pegawai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                  <input
                    type="number"
                    value={form.jumlah}
                    onChange={(e) => setForm(f => ({ ...f, jumlah: Number(e.target.value) }))}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm(f => ({ ...f, tanggal: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value as Row['status'] }))}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Proses">Proses</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Batal</button>
                <button onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Simpan</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        <ConfirmDeleteModal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={confirmDelete}
          title="Konfirmasi Hapus Cash Advance"
          message="Apakah Anda yakin ingin menghapus data Cash Advance ini?"
          itemName={deleteTarget ? `${deleteTarget.no} - ${deleteTarget.namaPegawai}` : undefined}
        />
      </div>
    </div>
  );
};

export default MonitoringCADashboard;
