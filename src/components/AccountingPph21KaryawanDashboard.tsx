import React, { useMemo, useState } from "react";
import { Plus, Edit, Trash2, Search, Download, Clock, X, Save } from "lucide-react";

interface Pph21KaryawanItem {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  gajiBruto: number;
  ptkp: number;
  pkp: number;
  pph21: number;
  keterangan?: string;
  tanggal?: string; // yyyy-mm-dd (untuk filter bulan)
}

const seed: Pph21KaryawanItem[] = [
  { id: "kry-001", nip: "EMP-001", nama: "Andi", jabatan: "Staff", gajiBruto: 8_000_000, ptkp: 4_500_000, pkp: 3_500_000, pph21: 175_000, keterangan: "Tetap", tanggal: "2025-09-10" },
  { id: "kry-002", nip: "EMP-002", nama: "Budi", jabatan: "Supervisor", gajiBruto: 12_000_000, ptkp: 4_500_000, pkp: 7_500_000, pph21: 375_000, tanggal: "2025-09-15" },
];

const AccountingPph21KaryawanDashboard: React.FC = () => {
  const [rows, setRows] = useState<Pph21KaryawanItem[]>(seed);
  const [q, setQ] = useState("");
  const [month, setMonth] = useState<string>(""); // YYYY-MM
  const [show, setShow] = useState("10");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Pph21KaryawanItem>({
    id: "",
    nip: "",
    nama: "",
    jabatan: "",
    gajiBruto: 0,
    ptkp: 0,
    pkp: 0,
    pph21: 0,
    keterangan: "",
    tanggal: new Date().toISOString().slice(0,10),
  });

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return rows.filter(r => {
      const matchesText = r.nip.toLowerCase().includes(qq) || r.nama.toLowerCase().includes(qq) || r.jabatan.toLowerCase().includes(qq);
      const matchesMonth = month ? (r.tanggal ? r.tanggal.slice(0,7) === month : false) : true;
      return matchesText && matchesMonth;
    });
  }, [rows, q, month]);

  const pageSize = Number(show);
  const pageData = filtered.slice(0, pageSize);
  const total = filtered.length;

  const openAdd = () => {
    setEditingId(null);
    setForm({ id: crypto.randomUUID(), nip: "", nama: "", jabatan: "", gajiBruto: 0, ptkp: 0, pkp: 0, pph21: 0, keterangan: "", tanggal: new Date().toISOString().slice(0,10) });
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
    if (!confirm("Hapus data PPh21 karyawan ini?")) return;
    setRows(prev => prev.filter(x => x.id !== id));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nip || !form.nama) {
      alert("NIP dan Nama wajib diisi");
      return;
    }
    if (form.gajiBruto < 0 || form.ptkp < 0 || form.pkp < 0 || form.pph21 < 0) {
      alert("Nilai tidak boleh negatif");
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 250));
    setRows(prev => editingId ? prev.map(x => x.id === editingId ? { ...form } : x) : [{ ...form }, ...prev]);
    setSaving(false);
    setIsOpen(false);
  };

  const sum = (key: keyof Pph21KaryawanItem) => pageData.reduce((s, r) => s + (Number(r[key]) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide">PPH 21 - Karyawan</h1>
            <div className="text-xs text-gray-600">Accounting › PPH Unifikasi › PPH 21 › Karyawan</div>
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
              <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Cari NIP / Nama / Jabatan" className="w-72 pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400"/>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-700">Bulan</span>
              <input type="month" value={month} onChange={(e)=>setMonth(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-blue-500 focus:border-blue-500"/>
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
                  <th className="px-3 py-2 text-left">NIP</th>
                  <th className="px-3 py-2 text-left">Nama</th>
                  <th className="px-3 py-2 text-left">Jabatan</th>
                  <th className="px-3 py-2 text-right">Gaji Bruto</th>
                  <th className="px-3 py-2 text-right">PTKP</th>
                  <th className="px-3 py-2 text-right">PKP</th>
                  <th className="px-3 py-2 text-right">PPh 21</th>
                  <th className="px-3 py-2 text-left">Keterangan</th>
                  <th className="px-3 py-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageData.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{idx+1}</td>
                    <td className="px-3 py-2 font-medium">{r.nip}</td>
                    <td className="px-3 py-2">{r.nama}</td>
                    <td className="px-3 py-2">{r.jabatan}</td>
                    <td className="px-3 py-2 text-right">Rp {r.gajiBruto.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2 text-right">Rp {r.ptkp.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2 text-right">Rp {r.pkp.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2 text-right">Rp {r.pph21.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2">{r.keterangan||'-'}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button onClick={()=>openEdit(r.id)} className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50"><Edit className="h-4 w-4"/></button>
                      <button onClick={()=>onDelete(r.id)} className="inline-flex items-center px-2 py-1 border border-rose-300 text-rose-600 rounded-md hover:bg-rose-50"><Trash2 className="h-4 w-4"/></button>
                    </td>
                  </tr>
                ))}
                {pageData.length===0 && (
                  <tr>
                    <td colSpan={10} className="px-3 py-8 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-3 py-2" colSpan={4}>Total</td>
                  <td className="px-3 py-2 text-right">Rp {sum('gajiBruto').toLocaleString('id-ID')}</td>
                  <td className="px-3 py-2 text-right">Rp {sum('ptkp').toLocaleString('id-ID')}</td>
                  <td className="px-3 py-2 text-right">Rp {sum('pkp').toLocaleString('id-ID')}</td>
                  <td className="px-3 py-2 text-right">Rp {sum('pph21').toLocaleString('id-ID')}</td>
                  <td className="px-3 py-2" colSpan={2}></td>
                </tr>
              </tfoot>
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
              <h2 className="text-lg font-semibold">{editingId? 'Edit':'Tambah'} PPh21 Karyawan</h2>
              <button onClick={()=>setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">NIP</label>
                  <input value={form.nip} onChange={(e)=>setForm(f=>({...f, nip:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama</label>
                  <input value={form.nama} onChange={(e)=>setForm(f=>({...f, nama:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal</label>
                  <input type="date" value={form.tanggal} onChange={(e)=>setForm(f=>({...f, tanggal:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Jabatan</label>
                  <input value={form.jabatan} onChange={(e)=>setForm(f=>({...f, jabatan:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gaji Bruto</label>
                  <input type="number" min={0} value={form.gajiBruto} onChange={(e)=>setForm(f=>({...f, gajiBruto:Number(e.target.value||0)}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PTKP</label>
                  <input type="number" min={0} value={form.ptkp} onChange={(e)=>setForm(f=>({...f, ptkp:Number(e.target.value||0)}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PKP</label>
                  <input type="number" min={0} value={form.pkp} onChange={(e)=>setForm(f=>({...f, pkp:Number(e.target.value||0)}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PPh 21</label>
                  <input type="number" min={0} value={form.pph21} onChange={(e)=>setForm(f=>({...f, pph21:Number(e.target.value||0)}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
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

export default AccountingPph21KaryawanDashboard;
