import React, { useEffect, useMemo, useState } from 'react';
import { Clock, Plus, Search, X, Edit, Trash2, Printer } from 'lucide-react';

interface PIEntry {
  id: string;
  clientName: string;
  soInduk: string;
  soTurunan: string;
  contractStart: string; // dd/MM/yyyy
  contractEnd: string;   // dd/MM/yyyy
  nilaiKontrak: number;
  absorbKontrak: number;
  remainingKontrak: number;
}

const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

const ProconPembuatanPIDashboard: React.FC = () => {
  // Master options (Client -> SO Induk -> SO Turunan)
  const masterOptions = useMemo(() => ([
    {
      clientName: 'PT. ABC Sejahtera',
      soInduk: [
        {
          id: 'SO-IND-001',
          soTurunan: [
            { id: 'SO-TRN-001-A', nilaiKontrak: 125000000, contractStart: '01/02/2025', contractEnd: '31/07/2025' },
            { id: 'SO-TRN-001-B', nilaiKontrak: 50000000, contractStart: '15/02/2025', contractEnd: '30/06/2025' },
          ],
        },
      ],
    },
    {
      clientName: 'PT. XYZ Mandiri',
      soInduk: [
        {
          id: 'SO-IND-002',
          soTurunan: [
            { id: 'SO-TRN-002-A', nilaiKontrak: 98500000, contractStart: '10/01/2025', contractEnd: '10/10/2025' },
          ],
        },
      ],
    },
  ]), []);
  // Filters
  const [qClient, setQClient] = useState('');
  const [qSOInduk, setQSOInduk] = useState('');
  const [qSOTurunan, setQSOTurunan] = useState('');

  // Data
  const [data, setData] = useState<PIEntry[]>([
    {
      id: '1',
      clientName: 'PT. ABC Sejahtera',
      soInduk: 'SO-IND-001',
      soTurunan: 'SO-TRN-001-A',
      contractStart: '01/02/2025',
      contractEnd: '31/07/2025',
      nilaiKontrak: 125000000,
      absorbKontrak: 65000000,
      remainingKontrak: 60000000,
    },
    {
      id: '2',
      clientName: 'PT. XYZ Mandiri',
      soInduk: 'SO-IND-002',
      soTurunan: 'SO-TRN-002-B',
      contractStart: '10/01/2025',
      contractEnd: '10/10/2025',
      nilaiKontrak: 98500000,
      absorbKontrak: 50000000,
      remainingKontrak: 48500000,
    },
  ]);

  // Load from localStorage on init
  useEffect(() => {
    try {
      const raw = localStorage.getItem('procon_pi_entries');
      if (raw) {
        const parsed: PIEntry[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setData(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load procon_pi_entries', e);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem('procon_pi_entries', JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save procon_pi_entries', e);
    }
  }, [data]);

  // Add Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<PIEntry, 'id'>>({
    clientName: '',
    soInduk: '',
    soTurunan: '',
    contractStart: '',
    contractEnd: '',
    nilaiKontrak: 0,
    absorbKontrak: 0,
    remainingKontrak: 0,
  });

  const filtered = useMemo(() => {
    return data.filter(r =>
      r.clientName.toLowerCase().includes(qClient.toLowerCase()) &&
      r.soInduk.toLowerCase().includes(qSOInduk.toLowerCase()) &&
      r.soTurunan.toLowerCase().includes(qSOTurunan.toLowerCase())
    );
  }, [data, qClient, qSOInduk, qSOTurunan]);

  const handleOpenAdd = () => {
    setForm({
      clientName: '', soInduk: '', soTurunan: '', contractStart: '', contractEnd: '',
      nilaiKontrak: 0, absorbKontrak: 0, remainingKontrak: 0,
    });
    setEditId(null);
    setIsAddOpen(true);
  };

  const handleSave = () => {
    if (editId) {
      setData(prev => prev.map(it => it.id === editId ? { id: editId, ...form } as PIEntry : it));
    } else {
      const newItem: PIEntry = { id: Date.now().toString(), ...form };
      setData(prev => [newItem, ...prev]);
    }
    setIsAddOpen(false);
    setEditId(null);
  };

  const handleEdit = (id: string) => {
    const found = data.find(d => d.id === id);
    if (!found) return;
    setForm({
      clientName: found.clientName,
      soInduk: found.soInduk,
      soTurunan: found.soTurunan,
      contractStart: found.contractStart,
      contractEnd: found.contractEnd,
      nilaiKontrak: found.nilaiKontrak,
      absorbKontrak: found.absorbKontrak,
      remainingKontrak: found.remainingKontrak,
    });
    setEditId(id);
    setIsAddOpen(true);
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  const handlePrint = (id: string) => {
    const item = data.find(d => d.id === id);
    if (!item) return;
    // Placeholder print action. Integrate with real print template if available.
    const details = `Client: ${item.clientName}\nSO Induk: ${item.soInduk}\nSO Turunan: ${item.soTurunan}\nDurasi: ${item.contractStart} - ${item.contractEnd}\nNilai: ${formatRupiah(item.nilaiKontrak)}\nAbsorb: ${formatRupiah(item.absorbKontrak)}\nRemaining: ${formatRupiah(item.remainingKontrak)}`;
    alert(`Cetak Proforma Invoice:\n\n${details}`);
  };

  // Dependent select handlers
  const onClientChange = (clientName: string) => {
    setForm(prev => ({
      ...prev,
      clientName,
      soInduk: '',
      soTurunan: '',
      contractStart: '',
      contractEnd: '',
      nilaiKontrak: 0,
      remainingKontrak: 0,
      // keep absorb as is
    }));
  };

  const onSOIndukChange = (soInduk: string) => {
    setForm(prev => ({
      ...prev,
      soInduk,
      soTurunan: '',
      contractStart: '',
      contractEnd: '',
      nilaiKontrak: 0,
      remainingKontrak: 0,
    }));
  };

  const onSOTurunanChange = (soTurunan: string) => {
    // Find nilaiKontrak and kontrak dates from master
    const client = masterOptions.find(c => c.clientName === form.clientName);
    const soIndukObj = client?.soInduk.find(s => s.id === form.soInduk);
    const st = soIndukObj?.soTurunan.find(x => x.id === soTurunan);
    const nilai = st?.nilaiKontrak ?? 0;
    const start = st?.contractStart ?? '';
    const end = st?.contractEnd ?? '';
    setForm(prev => ({
      ...prev,
      soTurunan,
      nilaiKontrak: nilai,
      contractStart: start,
      contractEnd: end,
      remainingKontrak: Math.max(0, nilai - (prev.absorbKontrak || 0)),
    }));
  };

  const onAbsorbChange = (val: number) => {
    setForm(prev => ({
      ...prev,
      absorbKontrak: val,
      remainingKontrak: Math.max(0, (prev.nilaiKontrak || 0) - val),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">PEMBUATAN PROFORMA INVOICE</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Procon</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">Pembuatan PI</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filters + Add */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Nama Client */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Nama Client</label>
              <div className="relative">
                <input value={qClient} onChange={(e) => setQClient(e.target.value)} className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" placeholder="Cari nama client..." />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* SO Induk */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Nomor SO Induk</label>
              <input value={qSOInduk} onChange={(e) => setQSOInduk(e.target.value)} className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" placeholder="Cari SO Induk..." />
            </div>
            {/* SO Turunan */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">SO Turunan</label>
              <input value={qSOTurunan} onChange={(e) => setQSOTurunan(e.target.value)} className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" placeholder="Cari SO Turunan..." />
            </div>
            {/* Add Button */}
            <div className="flex items-end">
              <button onClick={handleOpenAdd} className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 text-xs flex items-center gap-2 justify-center">
                <Plus className="h-4 w-4" />
                Tambah PI
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Nama Client</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Nomor SO Induk & SO Turunan</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Durasi Kontrak (Tanggal awal - akhir kontrak)</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Nilai Kontrak</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Absorb Kontrak</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Remaining Kontrak</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900 font-medium">{row.clientName}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">{row.soInduk}</span>
                        <span className="text-gray-500">{row.soTurunan}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{row.contractStart} - {row.contractEnd}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium">{formatRupiah(row.nilaiKontrak)}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium">{formatRupiah(row.absorbKontrak)}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium">{formatRupiah(row.remainingKontrak)}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="text-blue-600 hover:text-blue-700" onClick={() => handlePrint(row.id)} title="Cetak">
                          <Printer className="h-4 w-4" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-700" onClick={() => handleEdit(row.id)}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700" onClick={() => handleDelete(row.id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setIsAddOpen(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{editId ? 'Edit' : 'Tambah'} Proforma Invoice</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select Client */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Client</label>
                <select value={form.clientName} onChange={(e) => onClientChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Pilih Client</option>
                  {masterOptions.map(c => (
                    <option key={c.clientName} value={c.clientName}>{c.clientName}</option>
                  ))}
                </select>
              </div>
              {/* Select SO Induk */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nomor SO Induk</label>
                <select value={form.soInduk} onChange={(e) => onSOIndukChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" disabled={!form.clientName}>
                  <option value="">Pilih SO Induk</option>
                  {masterOptions.find(c => c.clientName === form.clientName)?.soInduk.map(s => (
                    <option key={s.id} value={s.id}>{s.id}</option>
                  ))}
                </select>
              </div>
              {/* Select SO Turunan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">SO Turunan</label>
                <select value={form.soTurunan} onChange={(e) => onSOTurunanChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" disabled={!form.soInduk}>
                  <option value="">Pilih SO Turunan</option>
                  {masterOptions.find(c => c.clientName === form.clientName)?.soInduk.find(s => s.id === form.soInduk)?.soTurunan.map(st => (
                    <option key={st.id} value={st.id}>{st.id}</option>
                  ))}
                </select>
              </div>
              {/* Durasi Kontrak (read-only) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Awal Kontrak</label>
                  <input type="text" placeholder="dd/MM/yyyy" value={form.contractStart} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Akhir Kontrak</label>
                  <input type="text" placeholder="dd/MM/yyyy" value={form.contractEnd} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" />
                </div>
              </div>
              {/* Nilai Kontrak (auto, read-only) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nilai Kontrak</label>
                <input type="text" value={formatRupiah(form.nilaiKontrak)} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" />
              </div>
              {/* Absorb Kontrak (editable) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Absorb Kontrak</label>
                <input type="number" value={form.absorbKontrak} onChange={(e) => onAbsorbChange(Number(e.target.value || 0))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              {/* Remaining Kontrak (computed) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Remaining Kontrak</label>
                <input type="text" value={formatRupiah(form.remainingKontrak)} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg border" onClick={() => setIsAddOpen(false)}>Batal</button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={handleSave}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProconPembuatanPIDashboard;
