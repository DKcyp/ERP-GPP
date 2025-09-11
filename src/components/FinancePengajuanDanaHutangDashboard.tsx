import React, { useMemo, useState } from "react";
import { Clock, PlusCircle, Edit, Trash2, FileSpreadsheet, FileDown, Search } from "lucide-react";

type PengajuanRow = {
  id: number;
  tanggal: string; // yyyy-mm-dd
  noPengajuan: string;
  vendor: string;
  keterangan: string;
  dpp: number;
  ppn: number;
  total: number;
  status: "Draft" | "Diajukan" | "Disetujui" | "Ditolak";
};

const FinancePengajuanDanaHutangDashboard: React.FC = () => {
  const today = new Date();
  const [rows, setRows] = useState<PengajuanRow[]>([
    { id: 1, tanggal: "2025-09-07", noPengajuan: "PDH-001", vendor: "PT Jaya", keterangan: "Pembayaran termin 1", dpp: 8000000, ppn: 880000, total: 8880000, status: "Diajukan" },
  ]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PengajuanRow | null>(null);

  const filtered = useMemo(() => rows.filter(r =>
    (statusFilter ? r.status === (statusFilter as any) : true) &&
    ([r.noPengajuan, r.vendor, r.keterangan].join(" ").toLowerCase().includes(search.toLowerCase()))
  ), [rows, statusFilter, search]);

  const startAdd = () => { setEditing({ id: 0, tanggal: new Date().toISOString().split('T')[0], noPengajuan: '', vendor: '', keterangan: '', dpp: 0, ppn: 0, total: 0, status: 'Draft' }); setFormOpen(true); };
  const startEdit = (row: PengajuanRow) => { setEditing(row); setFormOpen(true); };
  const remove = (id: number) => setRows(prev => prev.filter(r => r.id !== id));
  const onSave = (data: PengajuanRow) => {
    data.total = (Number(data.dpp)||0) + (Number(data.ppn)||0);
    if (data.id && rows.some(r => r.id === data.id)) setRows(prev => prev.map(r => r.id === data.id ? data : r));
    else { const newId = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1; setRows(prev => [{ ...data, id: newId }, ...prev]); }
    setFormOpen(false); setEditing(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-wide mb-2">AP - PENGAJUAN DANA HUTANG</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">AP / Pengajuan Dana Hutang</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
              <div className="relative">
                <input value={search} onChange={e => setSearch(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-9" placeholder="No Pengajuan/Vendor/Keterangan" />
                <Search className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none">
                <option value="">Semua</option>
                <option value="Draft">Draft</option>
                <option value="Diajukan">Diajukan</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
            <div className="hidden md:block"></div>
            <div className="flex items-end justify-end gap-2">
              <button onClick={startAdd} className="inline-flex items-center px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700">
                <PlusCircle className="h-5 w-5 mr-2" /> Tambah
              </button>
              <button className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700"><FileSpreadsheet className="h-4 w-4 mr-2" />Export Excel</button>
              <button className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700"><FileDown className="h-4 w-4 mr-2" />Export PDF</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Tanggal</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">No Pengajuan</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Vendor</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Keterangan</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">DPP</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">PPN</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id}>
                    <td className="px-4 py-2 text-sm">{new Date(row.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2 text-sm">{row.noPengajuan}</td>
                    <td className="px-4 py-2 text-sm">{row.vendor}</td>
                    <td className="px-4 py-2 text-sm">{row.keterangan}</td>
                    <td className="px-4 py-2 text-sm text-right">Rp {row.dpp.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-sm text-right">Rp {row.ppn.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">Rp {row.total.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-sm">{row.status}</td>
                    <td className="px-4 py-2 text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => startEdit(row)} className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => remove(row.id)} className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50" title="Hapus"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {formOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-sm font-semibold">{editing.id ? 'Edit' : 'Tambah'} Pengajuan Dana Hutang</h3>
              <button onClick={() => { setFormOpen(false); setEditing(null); }} className="p-1 rounded hover:bg-gray-100" aria-label="Close">✕</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal</label>
                  <input type="date" value={editing.tanggal} onChange={e => setEditing({ ...editing, tanggal: e.target.value })} className="w-full border rounded px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">No Pengajuan</label>
                  <input value={editing.noPengajuan} onChange={e => setEditing({ ...editing, noPengajuan: e.target.value })} className="w-full border rounded px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vendor</label>
                  <input value={editing.vendor} onChange={e => setEditing({ ...editing, vendor: e.target.value })} className="w-full border rounded px-2 py-1.5 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Keterangan</label>
                  <input value={editing.keterangan} onChange={e => setEditing({ ...editing, keterangan: e.target.value })} className="w-full border rounded px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">DPP</label>
                  <input type="number" value={editing.dpp} onChange={e => setEditing({ ...editing, dpp: parseFloat(e.target.value)||0 })} className="w-full border rounded px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PPN</label>
                  <input type="number" value={editing.ppn} onChange={e => setEditing({ ...editing, ppn: parseFloat(e.target.value)||0 })} className="w-full border rounded px-2 py-1.5 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <button onClick={() => { setFormOpen(false); setEditing(null); }} className="px-3 py-1.5 text-xs rounded-md border">Batal</button>
              <button onClick={() => editing && onSave(editing)} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePengajuanDanaHutangDashboard;
