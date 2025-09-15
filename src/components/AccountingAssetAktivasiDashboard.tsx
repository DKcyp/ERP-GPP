import React, { useMemo, useState } from "react";
import { Plus, Edit, Trash2, Search, Save, X, Clock, FileSpreadsheet, FileText } from "lucide-react";

interface POItem { id: string; nama: string; qty: number; harga: number }
interface PO { no: string; vendor: string; tanggal: string; items: POItem[] }

interface AktivasiAssetItem {
  id: string;
  tanggal: string; // yyyy-mm-dd
  noPO: string;
  vendor: string;
  barangPOId: string; // id item di PO
  namaBarang: string;
  qty: number;
  harga: number;
  kategori?: string; // optional, bisa dihubungkan ke master kategori
  keterangan?: string;
}

const mockPOs: PO[] = [
  {
    no: "PO-001/2025",
    vendor: "PT Sumber Makmur",
    tanggal: "2025-08-20",
    items: [
      { id: "it-1", nama: "Laptop A", qty: 5, harga: 15000000 },
      { id: "it-2", nama: "Printer B", qty: 2, harga: 3500000 },
    ],
  },
  {
    no: "PO-002/2025",
    vendor: "CV Elektronik Jaya",
    tanggal: "2025-09-01",
    items: [
      { id: "it-3", nama: "Scanner C", qty: 1, harga: 2500000 },
      { id: "it-4", nama: "Kamera D", qty: 1, harga: 8000000 },
    ],
  },
];

const seed: AktivasiAssetItem[] = [];

const AccountingAssetAktivasiDashboard: React.FC = () => {
  const [rows, setRows] = useState<AktivasiAssetItem[]>(seed);
  const [q, setQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<AktivasiAssetItem>({
    id: "",
    tanggal: "",
    noPO: "",
    vendor: "",
    barangPOId: "",
    namaBarang: "",
    qty: 0,
    harga: 0,
    kategori: "",
    keterangan: "",
  });

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return rows.filter(r => (
      r.noPO.toLowerCase().includes(qq) ||
      r.vendor.toLowerCase().includes(qq) ||
      r.namaBarang.toLowerCase().includes(qq)
    ));
  }, [rows, q]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ id: crypto.randomUUID(), tanggal: "", noPO: "", vendor: "", barangPOId: "", namaBarang: "", qty: 0, harga: 0, kategori: "", keterangan: "" });
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
    if (!confirm("Hapus aktivasi asset ini?")) return;
    setRows(prev => prev.filter(x => x.id !== id));
  };

  const onChangePO = (no: string) => {
    const po = mockPOs.find(p => p.no === no);
    setForm(f => ({
      ...f,
      noPO: no,
      vendor: po?.vendor || "",
      barangPOId: "",
      namaBarang: "",
      qty: 0,
      harga: 0,
    }));
  };

  const onChangeBarangPO = (barangId: string) => {
    const po = mockPOs.find(p => p.no === form.noPO);
    const it = po?.items.find(i => i.id === barangId);
    setForm(f => ({
      ...f,
      barangPOId: barangId,
      namaBarang: it?.nama || "",
      qty: it?.qty || 0,
      harga: it?.harga || 0,
    }));
  };

  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.noPO || !form.barangPOId || !form.tanggal) {
      alert("Tanggal, No PO, dan Barang PO wajib diisi");
      return;
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Aktivasi Asset</h1>
            <div className="text-xs text-gray-600">Accounting › Asset › Aktivasi</div>
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
            <button className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700"><FileSpreadsheet className="h-4 w-4 mr-1"/>Export</button>
            <button className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-rose-600 text-white hover:bg-rose-700"><FileText className="h-4 w-4 mr-1"/>PDF</button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari No PO / Vendor / Barang" className="w-72 pl-7 pr-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
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
                <th className="px-3 py-2 text-left">No PO</th>
                <th className="px-3 py-2 text-left">Vendor</th>
                <th className="px-3 py-2 text-left">Barang</th>
                <th className="px-3 py-2 text-right">Qty</th>
                <th className="px-3 py-2 text-right">Harga</th>
                <th className="px-3 py-2 text-left">Kategori</th>
                <th className="px-3 py-2 text-left">Keterangan</th>
                <th className="px-3 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r, idx) => (
                <tr key={r.id}>
                  <td className="px-3 py-2">{idx+1}</td>
                  <td className="px-3 py-2">{new Date(r.tanggal).toLocaleDateString("id-ID")}</td>
                  <td className="px-3 py-2">{r.noPO}</td>
                  <td className="px-3 py-2">{r.vendor}</td>
                  <td className="px-3 py-2 font-medium text-gray-900">{r.namaBarang}</td>
                  <td className="px-3 py-2 text-right">{r.qty.toLocaleString("id-ID")}</td>
                  <td className="px-3 py-2 text-right">Rp {r.harga.toLocaleString("id-ID")}</td>
                  <td className="px-3 py-2">{r.kategori || '-'}</td>
                  <td className="px-3 py-2">{r.keterangan || '-'}</td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button onClick={()=>openEdit(r.id)} className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50"><Edit className="h-4 w-4"/></button>
                    <button onClick={()=>onDelete(r.id)} className="inline-flex items-center px-2 py-1 border border-rose-300 text-rose-600 rounded-md hover:bg-rose-50"><Trash2 className="h-4 w-4"/></button>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={10} className="px-3 py-8 text-center text-gray-500">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e)=> e.target===e.currentTarget && setIsOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-lg font-semibold">{editingId? 'Edit':'Tambah'} Aktivasi Asset</h2>
              <button onClick={()=>setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={saveForm} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Aktivasi</label>
                  <input type="date" value={form.tanggal} onChange={e=>setForm(f=>({...f, tanggal:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">No PO</label>
                  <select value={form.noPO} onChange={e=>onChangePO(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required>
                    <option value="">Pilih No PO</option>
                    {mockPOs.map(po => (<option key={po.no} value={po.no}>{po.no} - {po.vendor}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vendor</label>
                  <input value={form.vendor} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Barang di PO</label>
                  <select value={form.barangPOId} onChange={e=>onChangeBarangPO(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required>
                    <option value="">Pilih Barang</option>
                    {mockPOs.find(p=>p.no===form.noPO)?.items.map(it => (
                      <option key={it.id} value={it.id}>{it.nama} (qty {it.qty})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama Barang</label>
                  <input value={form.namaBarang} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Qty</label>
                  <input type="number" min={1} value={form.qty} onChange={e=>setForm(f=>({...f, qty:Number(e.target.value||0)}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Harga</label>
                  <input type="number" min={0} value={form.harga} onChange={e=>setForm(f=>({...f, harga:Number(e.target.value||0)}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kategori Asset</label>
                  <input value={form.kategori||""} onChange={e=>setForm(f=>({...f, kategori:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="Opsional"/>
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

export default AccountingAssetAktivasiDashboard;
