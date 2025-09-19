import React, { useMemo, useState } from "react";
import { Plus, Edit, Trash2, Search, Download, Clock, X, Save } from "lucide-react";

interface AnggaranItem {
  id: string;
  tahun: number;
  departemen: string;
  kode: string; // kode anggaran
  nama: string; // nama anggaran
  pagu: number; // total budget
  realisasi: number; // penggunaan sampai saat ini
  keterangan?: string;
}

const seed: AnggaranItem[] = [
  { id: "bud-001", tahun: 2025, departemen: "Finance", kode: "FIN-OPS", nama: "Operasional Finance", pagu: 250_000_000, realisasi: 75_000_000, keterangan: "Q1 berjalan" },
  { id: "bud-002", tahun: 2025, departemen: "HRD", kode: "HR-TRN", nama: "Pelatihan HRD", pagu: 150_000_000, realisasi: 30_000_000, keterangan: "Batch 1 selesai" },
  { id: "bud-003", tahun: 2025, departemen: "GA", kode: "GA-MTN", nama: "Maintenance Sarpras", pagu: 300_000_000, realisasi: 120_000_000 },
];

const MonitoringAnggaranPerusahaanDashboard: React.FC = () => {
  const [rows, setRows] = useState<AnggaranItem[]>(seed);
  const [q, setQ] = useState("");
  const [show, setShow] = useState("10");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<AnggaranItem>({
    id: "",
    tahun: new Date().getFullYear(),
    departemen: "",
    kode: "",
    nama: "",
    pagu: 0,
    realisasi: 0,
    keterangan: "",
  });

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return rows.filter((r) =>
      r.departemen.toLowerCase().includes(qq) ||
      r.kode.toLowerCase().includes(qq) ||
      r.nama.toLowerCase().includes(qq)
    );
  }, [rows, q]);

  const pageSize = Number(show);
  const pageData = filtered.slice(0, pageSize);
  const total = filtered.length;

  const openAdd = () => {
    setEditingId(null);
    setForm({ id: crypto.randomUUID(), tahun: new Date().getFullYear(), departemen: "", kode: "", nama: "", pagu: 0, realisasi: 0, keterangan: "" });
    setIsOpen(true);
  };

  const openEdit = (id: string) => {
    const r = rows.find((x) => x.id === id);
    if (!r) return;
    setEditingId(id);
    setForm({ ...r });
    setIsOpen(true);
  };

  const onDelete = (id: string) => {
    if (!confirm("Hapus anggaran ini?")) return;
    setRows((prev) => prev.filter((x) => x.id !== id));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tahun || !form.departemen || !form.kode || !form.nama) {
      alert("Tahun, Departemen, Kode, dan Nama anggaran wajib diisi");
      return;
    }
    if (form.realisasi > form.pagu) {
      alert("Realisasi tidak boleh melebihi Pagu");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 250));
    setRows((prev) => (editingId ? prev.map((x) => (x.id === editingId ? { ...form } : x)) : [{ ...form }, ...prev]));
    setSaving(false);
    setIsOpen(false);
  };

  const persen = (r: AnggaranItem) => (r.pagu ? Math.min(100, Math.round((r.realisasi / r.pagu) * 100)) : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide">Monitoring Anggaran Perusahaan</h1>
            <div className="text-xs text-gray-600">General › RAP › Monitoring</div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center justify-between">
          <div className="space-x-2">
            <button onClick={openAdd} className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700"><Plus className="h-4 w-4 mr-1"/>Tambah</button>
            <button className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700"><Download className="h-4 w-4 mr-1"/>Export</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Cari Departemen / Kode / Nama Anggaran" className="w-80 pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400"/>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-700">Show</span>
              <select value={show} onChange={(e)=>setShow(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-gray-700">entries</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left">No</th>
                  <th className="px-3 py-2 text-left">Tahun</th>
                  <th className="px-3 py-2 text-left">Departemen</th>
                  <th className="px-3 py-2 text-left">Kode</th>
                  <th className="px-3 py-2 text-left">Nama Anggaran</th>
                  <th className="px-3 py-2 text-right">Pagu</th>
                  <th className="px-3 py-2 text-right">Realisasi</th>
                  <th className="px-3 py-2 text-left">% Realisasi</th>
                  <th className="px-3 py-2 text-left">Keterangan</th>
                  <th className="px-3 py-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageData.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2">{r.tahun}</td>
                    <td className="px-3 py-2">{r.departemen}</td>
                    <td className="px-3 py-2">{r.kode}</td>
                    <td className="px-3 py-2 font-medium text-gray-900">{r.nama}</td>
                    <td className="px-3 py-2 text-right">Rp {r.pagu.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2 text-right">Rp {r.realisasi.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2">
                      <div className="w-32 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className={`h-2 ${persen(r) > 90 ? 'bg-rose-500' : persen(r) > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${persen(r)}%` }} />
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">{persen(r)}%</div>
                    </td>
                    <td className="px-3 py-2">{r.keterangan || '-'}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button onClick={() => openEdit(r.id)} className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50"><Edit className="h-4 w-4"/></button>
                      <button onClick={() => onDelete(r.id)} className="inline-flex items-center px-2 py-1 border border-rose-300 text-rose-600 rounded-md hover:bg-rose-50"><Trash2 className="h-4 w-4"/></button>
                    </td>
                  </tr>
                ))}
                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-3 py-8 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-sm text-gray-700">
            Showing 1 to {Math.min(pageSize, total)} of {total} entries
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e)=> e.target===e.currentTarget && setIsOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-lg font-semibold">{editingId? 'Edit':'Tambah'} Anggaran</h2>
              <button onClick={()=>setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tahun</label>
                  <input type="number" min={2000} max={2100} value={form.tahun} onChange={(e)=>setForm(f=>({...f, tahun:Number(e.target.value||0)}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Departemen</label>
                  <input value={form.departemen} onChange={(e)=>setForm(f=>({...f, departemen:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kode Anggaran</label>
                  <input value={form.kode} onChange={(e)=>setForm(f=>({...f, kode:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama Anggaran</label>
                  <input value={form.nama} onChange={(e)=>setForm(f=>({...f, nama:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pagu</label>
                  <input type="number" min={0} value={form.pagu} onChange={(e)=>setForm(f=>({...f, pagu:Number(e.target.value||0)}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Realisasi</label>
                  <input type="number" min={0} value={form.realisasi} onChange={(e)=>setForm(f=>({...f, realisasi:Number(e.target.value||0)}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea rows={2} value={form.keterangan} onChange={(e)=>setForm(f=>({...f, keterangan:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"/>
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

export default MonitoringAnggaranPerusahaanDashboard;
