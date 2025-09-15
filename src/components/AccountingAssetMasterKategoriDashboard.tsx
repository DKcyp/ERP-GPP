import React, { useMemo, useState } from "react";
import { Plus, Edit, Trash2, Search, Save, X, Clock } from "lucide-react";

interface KategoriAsset {
  id: string;
  nama: string;
  metode: "Garis Lurus" | "Saldo Menurun";
  umurBulan: number; // lama penyusutan dalam bulan
  keterangan?: string;
}

const seed: KategoriAsset[] = [
  { id: crypto.randomUUID(), nama: "Peralatan Kantor", metode: "Garis Lurus", umurBulan: 60, keterangan: "5 tahun" },
  { id: crypto.randomUUID(), nama: "Kendaraan", metode: "Garis Lurus", umurBulan: 48, keterangan: "4 tahun" },
];

const AccountingAssetMasterKategoriDashboard: React.FC = () => {
  const [rows, setRows] = useState<KategoriAsset[]>(seed);
  const [q, setQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<KategoriAsset>({ id: "", nama: "", metode: "Garis Lurus", umurBulan: 12, keterangan: "" });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return rows.filter(r => r.nama.toLowerCase().includes(qq));
  }, [rows, q]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ id: crypto.randomUUID(), nama: "", metode: "Garis Lurus", umurBulan: 12, keterangan: "" });
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
    if (!confirm("Hapus kategori ini?")) return;
    setRows(prev => prev.filter(x => x.id !== id));
  };
  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.umurBulan) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 250));
    setRows(prev => editingId ? prev.map(x => x.id === editingId ? { ...form } : x) : [{ ...form }, ...prev]);
    setSaving(false);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Master Kategori Asset</h1>
            <div className="text-xs text-gray-600">Accounting › Asset › Master Kategori</div>
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
            <button onClick={openAdd} className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700"><Plus className="h-4 w-4 mr-1"/>Tambah</button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari kategori" className="w-72 pl-7 pr-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400"/>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left">No</th>
                <th className="px-3 py-2 text-left">Nama Kategori</th>
                <th className="px-3 py-2 text-left">Metode</th>
                <th className="px-3 py-2 text-left">Umur (bulan)</th>
                <th className="px-3 py-2 text-left">Keterangan</th>
                <th className="px-3 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r, idx) => (
                <tr key={r.id}>
                  <td className="px-3 py-2">{idx+1}</td>
                  <td className="px-3 py-2 font-medium text-gray-900">{r.nama}</td>
                  <td className="px-3 py-2">{r.metode}</td>
                  <td className="px-3 py-2">{r.umurBulan}</td>
                  <td className="px-3 py-2">{r.keterangan || '-'}</td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button onClick={()=>openEdit(r.id)} className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50"><Edit className="h-4 w-4"/></button>
                    <button onClick={()=>onDelete(r.id)} className="inline-flex items-center px-2 py-1 border border-rose-300 text-rose-600 rounded-md hover:bg-rose-50"><Trash2 className="h-4 w-4"/></button>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-500">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e)=> e.target===e.currentTarget && setIsOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-lg font-semibold">{editingId? 'Edit':'Tambah'} Kategori</h2>
              <button onClick={()=>setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={saveForm} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama Kategori</label>
                  <input value={form.nama} onChange={e=>setForm(f=>({...f, nama:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Metode</label>
                  <select value={form.metode} onChange={e=>setForm(f=>({...f, metode:e.target.value as any}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                    <option>Garis Lurus</option>
                    <option>Saldo Menurun</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Umur (bulan)</label>
                  <input type="number" min={1} value={form.umurBulan} onChange={e=>setForm(f=>({...f, umurBulan:Number(e.target.value||0)}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea rows={2} value={form.keterangan} onChange={e=>setForm(f=>({...f, keterangan:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"/>
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

export default AccountingAssetMasterKategoriDashboard;
