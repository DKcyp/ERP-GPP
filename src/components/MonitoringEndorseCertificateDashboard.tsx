import React, { useMemo, useState } from 'react';
import { Search, PlusCircle, Download, Clock, Pencil, Trash2, X } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface Row {
  no: string; // No. Sertifikat
  vendor: string;
  masaBerlaku: string; // ISO end date
}

const initialData: Row[] = [
  { no: 'CERT-001', vendor: 'PT NDT Sejahtera', masaBerlaku: '2026-01-31' },
];

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const MonitoringEndorseCertificateDashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showEntries, setShowEntries] = useState('10');
  const [rows, setRows] = useState<Row[]>(initialData);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({ no: '', vendor: '', masaBerlaku: new Date().toISOString().slice(0,10) });

  // Delete confirm
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const filtered = useMemo(() => rows.filter(r => (
    r.no.toLowerCase().includes(search.toLowerCase()) ||
    r.vendor.toLowerCase().includes(search.toLowerCase())
  )), [search, rows]);

  const displayed = useMemo(() => {
    const n = parseInt(showEntries, 10);
    return filtered.slice(0, isNaN(n) ? filtered.length : n);
  }, [filtered, showEntries]);

  const handleExport = (t: string) => alert(`Export ${t}`);

  const openAdd = () => {
    setEditing(null);
    setForm({ no: '', vendor: '', masaBerlaku: new Date().toISOString().slice(0,10) });
    setShowForm(true);
  };

  const openEdit = (r: Row) => {
    setEditing(r);
    setForm({ ...r });
    setShowForm(true);
  };

  const generateNumber = () => {
    const y = new Date().getFullYear().toString().slice(-2);
    const rnd = Math.floor(Math.random() * 9000) + 1000;
    return `CERT-${y}${rnd}`;
  };

  const saveForm = () => {
    if (!form.vendor.trim()) { alert('Vendor wajib diisi'); return; }
    if (!form.masaBerlaku) { alert('Masa berlaku wajib diisi'); return; }
    if (editing) {
      setRows(prev => prev.map(p => (p.no === editing.no ? { ...form, no: editing.no } : p)));
    } else {
      const no = form.no.trim() || generateNumber();
      if (rows.some(r => r.no === no)) { alert('No. Sertifikat sudah ada.'); return; }
      setRows(prev => [{ ...form, no }, ...prev]);
    }
    setShowForm(false);
  };

  const askDelete = (r: Row) => { setDeleteTarget(r); setShowDelete(true); };
  const confirmDelete = () => {
    if (deleteTarget) setRows(prev => prev.filter(p => p.no !== deleteTarget.no));
    setShowDelete(false);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MONITORING ENDORSE CERTIFICATE</h1>
            <nav className="text-sm text-gray-600">QHSE › Monitoring › Endorse Certificate</nav>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari No. Sertifikat / Vendor</label>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Sertifikat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa Berlaku</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayed.map((r)=> (
                  <tr key={r.no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(r.masaBerlaku)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>openEdit(r)} className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white">
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button onClick={()=>askDelete(r)} className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">
                          <Trash2 className="h-4 w-4 mr-1" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayed.length===0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Tidak ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tambah / Edit */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={()=>setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">{editing ? 'Edit Sertifikat' : 'Tambah Sertifikat'}</h3>
              <button onClick={()=>setShowForm(false)} className="p-1 rounded hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Sertifikat</label>
                  <input
                    value={form.no}
                    onChange={(e)=>setForm(f=>({ ...f, no: e.target.value }))}
                    disabled={!!editing}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="CERT-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                  <input
                    value={form.vendor}
                    onChange={(e)=>setForm(f=>({ ...f, vendor: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nama vendor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Masa Berlaku</label>
                  <input
                    type="date"
                    value={form.masaBerlaku}
                    onChange={(e)=>setForm(f=>({ ...f, masaBerlaku: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button onClick={()=>setShowForm(false)} className="px-4 py-2 rounded-md text-sm border hover:bg-gray-50">Batal</button>
              <button onClick={saveForm} className="px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmDeleteModal
        isOpen={showDelete}
        title="Hapus Sertifikat?"
        message={deleteTarget ? `Apakah Anda yakin ingin menghapus sertifikat ${deleteTarget.no}? Tindakan ini tidak dapat dibatalkan.` : ''}
        onClose={()=>setShowDelete(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default MonitoringEndorseCertificateDashboard;
