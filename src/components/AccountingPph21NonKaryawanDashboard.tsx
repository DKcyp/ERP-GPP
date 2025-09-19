import React, { useMemo, useState } from "react";
import { Plus, Edit, Trash2, Search, Download, Clock, X, Save } from "lucide-react";

interface Pph21NonKaryawanItem {
  id: string;
  namaCV: string; // Nama CV
  vendor: string; // Vendor
  npwp?: string;  // NPWP
  tanggal: string; // yyyy-mm-dd
}

const seed: Pph21NonKaryawanItem[] = [
  { id: "nk-001", namaCV: "CV Nusantara Abadi", vendor: "PT Sumber Makmur", npwp: "01.234.567.8-901.000", tanggal: "2025-09-05" },
  { id: "nk-002", namaCV: "CV Citra Mandiri", vendor: "PT Elektronik Jaya", npwp: "", tanggal: "2025-09-12" },
];

const AccountingPph21NonKaryawanDashboard: React.FC = () => {
  const [rows, setRows] = useState<Pph21NonKaryawanItem[]>(seed);
  const [q, setQ] = useState("");
  const [month, setMonth] = useState<string>(""); // YYYY-MM for month filter
  const [show, setShow] = useState("10");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Pph21NonKaryawanItem>({
    id: "",
    namaCV: "",
    vendor: "",
    npwp: "",
    tanggal: new Date().toISOString().slice(0,10),
  });

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return rows.filter(r => {
      const matchesText = r.namaCV.toLowerCase().includes(qq) || r.vendor.toLowerCase().includes(qq) || (r.npwp||"").toLowerCase().includes(qq);
      const matchesMonth = month ? r.tanggal.slice(0,7) === month : true;
      return matchesText && matchesMonth;
    });
  }, [rows, q, month]);

  const pageSize = Number(show);
  const pageData = filtered.slice(0, pageSize);
  const total = filtered.length;

  const openAdd = () => {
    setEditingId(null);
    setForm({ id: crypto.randomUUID(), namaCV: "", vendor: "", npwp: "", tanggal: new Date().toISOString().slice(0,10) });
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
    if (!confirm("Hapus data PPh21 non karyawan ini?")) return;
    setRows(prev => prev.filter(x => x.id !== id));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.namaCV || !form.vendor || !form.tanggal) {
      alert("Nama CV, Vendor, dan Tanggal wajib diisi");
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 250));
    setRows(prev => editingId ? prev.map(x => x.id === editingId ? { ...form } : x) : [{ ...form }, ...prev]);
    setSaving(false);
    setIsOpen(false);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide">PPH 21 - Non Karyawan</h1>
            <div className="text-xs text-gray-600">Accounting › PPH Unifikasi › PPH 21 › Non Karyawan</div>
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
              <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Cari Nama CV / Vendor / NPWP" className="w-72 pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
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
                  <th className="px-3 py-2 text-left">Nama CV</th>
                  <th className="px-3 py-2 text-left">Vendor</th>
                  <th className="px-3 py-2 text-left">NPWP</th>
                  <th className="px-3 py-2 text-left">Tanggal</th>
                  <th className="px-3 py-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageData.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{idx+1}</td>
                    <td className="px-3 py-2">{r.namaCV}</td>
                    <td className="px-3 py-2">{r.vendor}</td>
                    <td className="px-3 py-2">{r.npwp||'-'}</td>
                    <td className="px-3 py-2">{new Date(r.tanggal).toLocaleDateString("id-ID")}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button onClick={()=>openEdit(r.id)} className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50"><Edit className="h-4 w-4"/></button>
                      <button onClick={()=>onDelete(r.id)} className="inline-flex items-center px-2 py-1 border border-rose-300 text-rose-600 rounded-md hover:bg-rose-50"><Trash2 className="h-4 w-4"/></button>
                    </td>
                  </tr>
                ))}
                {pageData.length===0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-gray-500">Tidak ada data</td>
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
              <h2 className="text-lg font-semibold">{editingId? 'Edit':'Tambah'} PPh21 Non Karyawan</h2>
              <button onClick={()=>setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama CV</label>
                  <input value={form.namaCV} onChange={(e)=>setForm(f=>({...f, namaCV:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vendor</label>
                  <input value={form.vendor} onChange={(e)=>setForm(f=>({...f, vendor:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">NPWP</label>
                  <input value={form.npwp} onChange={(e)=>setForm(f=>({...f, npwp:e.target.value}))} placeholder="01.234.567.8-901.000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal</label>
                  <input type="date" value={form.tanggal} onChange={(e)=>setForm(f=>({...f, tanggal:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
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

export default AccountingPph21NonKaryawanDashboard;
