import React, { useMemo, useState } from "react";
import { CheckCircle, XCircle, Edit, Trash2, Search, FileSpreadsheet, FileText, Clock, X, Save } from "lucide-react";

type Status = "Pengajuan" | "Proses" | "Selesai";
interface ApprovalDriverItem {
  id: string;
  tanggal: string; // yyyy-mm-dd
  namaDriver: string;
  tujuan: string;
  kendaraan: string;
  status: Status;
  catatan?: string;
}

const seed: ApprovalDriverItem[] = [
  { id: crypto.randomUUID(), tanggal: "2025-09-02", namaDriver: "Andi", tujuan: "Gudang A", kendaraan: "Mobil B", status: "Proses", catatan: "Perlu konfirmasi user" },
];

const GeneralKendaraanApprovalDriver: React.FC = () => {
  const [rows, setRows] = useState<ApprovalDriverItem[]>(seed);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ApprovalDriverItem>({ id: "", tanggal: "", namaDriver: "", tujuan: "", kendaraan: "", status: "Pengajuan", catatan: "" });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return rows.filter(r => (
      (!statusFilter || r.status === statusFilter) &&
      (r.namaDriver.toLowerCase().includes(qq) || r.tujuan.toLowerCase().includes(qq) || r.kendaraan.toLowerCase().includes(qq))
    ));
  }, [rows, q, statusFilter]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ id: crypto.randomUUID(), tanggal: "", namaDriver: "", tujuan: "", kendaraan: "", status: "Pengajuan", catatan: "" });
    setIsOpen(true);
  };
  const openEdit = (id: string) => {
    const r = rows.find(x => x.id === id);
    if (!r) return;
    setEditingId(id);
    setForm({ ...r });
    setIsOpen(true);
  };
  const onDelete = (id: string) => {
    if (!confirm("Hapus data ini?")) return;
    setRows(prev => prev.filter(x => x.id !== id));
  };
  const approve = (id: string) => setRows(prev => prev.map(x => x.id === id ? { ...x, status: "Selesai" } : x));
  const reject = (id: string) => setRows(prev => prev.map(x => x.id === id ? { ...x, status: "Pengajuan" } : x));
  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    setRows(prev => editingId ? prev.map(x => x.id === editingId ? { ...form } : x) : [{ ...form }, ...prev]);
    setSaving(false);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">General - Kendaraan - Approval Driver</h1>
            <div className="text-xs text-gray-600">General › Kendaraan › Approval Driver</div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 flex items-center justify-between">
          <div className="space-x-2">
            <button onClick={openAdd} className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700">Tambah</button>
            <button className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700"><FileSpreadsheet className="h-4 w-4 mr-1"/>Export</button>
            <button className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-rose-600 text-white hover:bg-rose-700"><FileText className="h-4 w-4 mr-1"/>PDF</button>
          </div>
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)} className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white">
              <option value="">Semua Status</option>
              <option value="Pengajuan">Pengajuan</option>
              <option value="Proses">Proses</option>
              <option value="Selesai">Selesai</option>
            </select>
            <div className="relative">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari Driver/Tujuan/Kendaraan" className="w-72 pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400"/>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left">No</th>
                <th className="px-3 py-2 text-left">Tanggal</th>
                <th className="px-3 py-2 text-left">Nama Driver</th>
                <th className="px-3 py-2 text-left">Tujuan</th>
                <th className="px-3 py-2 text-left">Kendaraan</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Catatan</th>
                <th className="px-3 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                  <td className="px-3 py-2">{idx+1}</td>
                  <td className="px-3 py-2">{new Date(r.tanggal).toLocaleDateString("id-ID")}</td>
                  <td className="px-3 py-2 font-medium text-gray-900">{r.namaDriver}</td>
                  <td className="px-3 py-2">{r.tujuan}</td>
                  <td className="px-3 py-2">{r.kendaraan}</td>
                  <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-[10px] border ${r.status==='Pengajuan'?'bg-amber-100 text-amber-800 border-amber-200':r.status==='Proses'?'bg-blue-100 text-blue-800 border-blue-200':'bg-green-100 text-green-800 border-green-200'}`}>{r.status}</span></td>
                  <td className="px-3 py-2">{r.catatan||'-'}</td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button onClick={()=>approve(r.id)} title="Approve" className="inline-flex items-center px-2 py-1 border border-emerald-300 text-emerald-700 rounded-md hover:bg-emerald-50"><CheckCircle className="h-4 w-4"/></button>
                    <button onClick={()=>reject(r.id)} title="Reject" className="inline-flex items-center px-2 py-1 border border-rose-300 text-rose-600 rounded-md hover:bg-rose-50"><XCircle className="h-4 w-4"/></button>
                    <button onClick={()=>openEdit(r.id)} className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50"><Edit className="h-4 w-4"/></button>
                    <button onClick={()=>onDelete(r.id)} className="inline-flex items-center px-2 py-1 border border-rose-300 text-rose-600 rounded-md hover:bg-rose-50"><Trash2 className="h-4 w-4"/></button>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-500">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e)=> e.target===e.currentTarget && setIsOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-lg font-semibold">{editingId? 'Edit':'Tambah'} Approval</h2>
              <button onClick={()=>setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={saveForm} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal</label>
                  <input type="date" value={form.tanggal} onChange={e=>setForm(f=>({...f, tanggal:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama Driver</label>
                  <input value={form.namaDriver} onChange={e=>setForm(f=>({...f, namaDriver:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tujuan</label>
                  <input value={form.tujuan} onChange={e=>setForm(f=>({...f, tujuan:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kendaraan</label>
                  <input value={form.kendaraan} onChange={e=>setForm(f=>({...f, kendaraan:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e=>setForm(f=>({...f, status:e.target.value as Status}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                    <option value="Pengajuan">Pengajuan</option>
                    <option value="Proses">Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Catatan</label>
                  <textarea value={form.catatan} onChange={e=>setForm(f=>({...f, catatan:e.target.value}))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"/>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button type="button" onClick={()=>setIsOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" disabled={saving} className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{saving? (<><Save className="h-4 w-4 mr-2 animate-spin"/>Menyimpan...</>) : (<><Save className="h-4 w-4 mr-2"/>Simpan</>)}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralKendaraanApprovalDriver;
