import React, { useMemo, useState } from "react";
import { Clock, PlusCircle, Edit, Trash2, FileSpreadsheet, FileDown, Search, Upload, X } from "lucide-react";

type PembayaranRow = {
  id: number;
  tanggal: string; // yyyy-mm-dd
  vendor: string;
  noPo: string; 
  metode: "Kas" | "Bank" | "";
  sumberDetail: string; // Nama Kas atau Bank yang dipilih
  dpp: number;
  ppn: number;
  total: number;
  noBuktiBayar: string;
  buktiTransfer?: File | null; // File bukti transfer
};

const FinancePembayaranHutangDashboard: React.FC = () => {
  const today = new Date();
  const [rows, setRows] = useState<PembayaranRow[]>([
    { id: 1, tanggal: "2025-09-08", vendor: "PT Jaya", noPo: "PO-001", metode: "Bank", sumberDetail: "BCA 123456", dpp: 10000000, ppn: 1100000, total: 11100000, noBuktiBayar: "BB-202509-0001" },
  ]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PembayaranRow | null>(null);

  const filtered = useMemo(() => rows.filter(r => [r.noPo, r.vendor, r.noBuktiBayar].join(" ").toLowerCase().includes(search.toLowerCase())), [rows, search]);

  // Data PO dengan vendor dan PPN
  const purchaseOrdersData = {
    'PO-001': { vendor: 'PT Jaya Abadi', ppn: 1100000 },
    'PO-002': { vendor: 'CV Mitra Sejahtera', ppn: 2200000 },
    'PO-003': { vendor: 'PT Sukses Mandiri', ppn: 1650000 },
    'PO-004': { vendor: 'UD Berkah Jaya', ppn: 3300000 }
  };
  
  const [purchaseOrders] = useState(Object.keys(purchaseOrdersData));

  const kasOptions = ['Kas Kecil', 'Kas Operasional', 'Kas Proyek A'];
  const bankOptions = ['Bank Mandiri', 'Bank BCA', 'Bank BNI'];

  const generateNoBuktiBayar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const lastEntry = rows
      .filter(r => r.noBuktiBayar.startsWith(`BB-${year}${month}`))
      .sort((a, b) => b.noBuktiBayar.localeCompare(a.noBuktiBayar))[0];

    let nextId = 1;
    if (lastEntry) {
      const lastId = parseInt(lastEntry.noBuktiBayar.split('-').pop() || '0', 10);
      nextId = lastId + 1;
    }
    return `BB-${year}${month}-${nextId.toString().padStart(4, '0')}`;
  };

  const startAdd = () => { 
    setEditing({ 
      id: 0, 
      tanggal: new Date().toISOString().split('T')[0], 
      vendor: '', 
      noPo: '', 
      metode: '',
      sumberDetail: '',
      dpp: 0, 
      ppn: 0, 
      total: 0, 
      noBuktiBayar: generateNoBuktiBayar(),
      buktiTransfer: null
    }); 
    setFormOpen(true); 
  };
  const startEdit = (row: PembayaranRow) => { setEditing(row); setFormOpen(true); };
  const remove = (id: number) => setRows(prev => prev.filter(r => r.id !== id));
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editing) {
      // Validate file type (image or PDF)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }
      
      setEditing({ ...editing, buktiTransfer: file });
    }
  };
  
  // Remove uploaded file
  const removeFile = () => {
    if (editing) {
      setEditing({ ...editing, buktiTransfer: null });
    }
  };
  const onSave = (data: PembayaranRow) => {
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
              <h1 className="text-3xl font-bold text-gray-900 tracking-wide mb-2">AP - PEMBAYARAN HUTANG</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">AP / Pembayaran Hutang</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
              <div className="relative">
                <input value={search} onChange={e => setSearch(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-9" placeholder="Vendor/No. PO/No Bukti Bayar" />
                <Search className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
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
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Vendor</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">No. PO</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Metode</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">DPP</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">PPN</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">No Bukti Bayar</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id}>
                    <td className="px-4 py-2 text-sm">{new Date(row.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2 text-sm">{row.vendor}</td>
                    <td className="px-4 py-2 text-sm">{row.noPo}</td>
                    <td className="px-4 py-2 text-sm">{row.metode}</td>
                    <td className="px-4 py-2 text-sm text-right">Rp {row.dpp.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-sm text-right">Rp {row.ppn.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">Rp {row.total.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-sm">{row.noBuktiBayar}</td>
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
              <h3 className="text-sm font-semibold">{editing.id ? 'Edit' : 'Tambah'} Pembayaran Hutang</h3>
              <button onClick={() => { setFormOpen(false); setEditing(null); }} className="p-1 rounded hover:bg-gray-100" aria-label="Close">✕</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal</label>
                  <input type="date" value={editing.tanggal} onChange={e => setEditing({ ...editing, tanggal: e.target.value })} className="w-full border rounded px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vendor</label>
                  <input 
                    value={editing.vendor} 
                    onChange={e => setEditing({ ...editing, vendor: e.target.value })} 
                    className="w-full border rounded px-2 py-1.5 text-sm bg-gray-100" 
                    readOnly
                    placeholder="Pilih PO untuk auto-fill vendor"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">No. PO</label>
                  <select 
                    value={editing.noPo} 
                    onChange={e => {
                      const selectedPO = e.target.value;
                      const poData = purchaseOrdersData[selectedPO as keyof typeof purchaseOrdersData];
                      
                      setEditing({ 
                        ...editing, 
                        noPo: selectedPO,
                        vendor: poData ? poData.vendor : '',
                        ppn: poData ? poData.ppn : 0
                      });
                    }} 
                    className="w-full border rounded px-2 py-1.5 text-sm appearance-none bg-white"
                  >
                    <option value="">Pilih No. PO</option>
                    {purchaseOrders.map(po => (
                      <option key={po} value={po}>{po}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Metode</label>
                  <select value={editing.metode} onChange={e => setEditing({ ...editing, metode: e.target.value as any, sumberDetail: '' })} className="w-full border rounded px-2 py-1.5 text-sm appearance-none bg-white">
                    <option value="">Pilih Metode</option>
                    <option value="Kas">Kas</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>
                {editing.metode && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sumber Pembayaran</label>
                    <select value={editing.sumberDetail} onChange={e => setEditing({ ...editing, sumberDetail: e.target.value })} className="w-full border rounded px-2 py-1.5 text-sm appearance-none bg-white">
                      <option value="">Pilih Sumber</option>
                      {(editing.metode === 'Kas' ? kasOptions : bankOptions).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">DPP</label>
                  <input type="number" value={editing.dpp} onChange={e => setEditing({ ...editing, dpp: parseFloat(e.target.value)||0 })} className="w-full border rounded px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PPN</label>
                  <input 
                    type="number" 
                    value={editing.ppn} 
                    onChange={e => setEditing({ ...editing, ppn: parseFloat(e.target.value)||0 })} 
                    className="w-full border rounded px-2 py-1.5 text-sm bg-gray-100" 
                    readOnly
                    placeholder="Pilih PO untuk auto-fill PPN"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">No Bukti Bayar</label>
                  <input value={editing.noBuktiBayar} readOnly className="w-full border rounded px-2 py-1.5 text-sm bg-gray-100" />
                </div>
                
                {/* Upload Bukti Transfer */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Upload Bukti Transfer
                    <span className="text-gray-500 text-xs ml-1">(JPG, PNG, PDF - Max 5MB)</span>
                  </label>
                  
                  {!editing.buktiTransfer ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        id="bukti-transfer"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="bukti-transfer"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Klik untuk upload bukti transfer
                        </span>
                        <span className="text-xs text-gray-500">
                          atau drag & drop file di sini
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                            <Upload className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {editing.buktiTransfer.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(editing.buktiTransfer.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Hapus file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
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

export default FinancePembayaranHutangDashboard;
