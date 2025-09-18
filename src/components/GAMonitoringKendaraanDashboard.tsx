import React, { useMemo, useState } from 'react';
import { Search, Gauge, History as HistoryIcon, X, Camera, Clock } from 'lucide-react';

interface KendaraanItem { 
  id: string; 
  merek: string; 
  platNomor: string; 
  namaDriver: string;
  lokasi: string;
}

interface KendaraanLog { date: string; km: number; note?: string; photo?: string; }

const seedKendaraan = (): KendaraanItem[] => [
  { id: 'v1', merek: 'Expander', platNomor: 'B 1875 ROB', namaDriver: 'Ahmad Sutrisno', lokasi: 'Jakarta Pusat' },
  { id: 'v2', merek: 'Rubicon', platNomor: 'B 500 GBP', namaDriver: 'Budi Santoso', lokasi: 'Bekasi' },
  { id: 'v3', merek: 'Chery', platNomor: 'B 1753 TNT', namaDriver: 'Candra Wijaya', lokasi: 'Tangerang' },
];

const today = () => new Date().toISOString().slice(0, 10);

const GAMonitoringKendaraanDashboard: React.FC = () => {
  const data = useMemo(() => seedKendaraan(), []);
  const [q, setQ] = useState('');
  const [logs, setLogs] = useState<Record<string, KendaraanLog[]>>({});
  const [inputId, setInputId] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);

  // form state for input KM
  const [km, setKm] = useState<number | ''>('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter(d => `${d.merek} ${d.platNomor}`.toLowerCase().includes(s));
  }, [data, q]);
  const get = (id: string | null) => data.find(d => d.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MONITORING KENDARAAN</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">GA</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">Monitoring Kendaraan</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Cari Merek/Plat Nomor</label>
              <div className="relative">
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Contoh: Expander B 1875 ROB" className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs">Cari</button>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">No</th>
                <th className="text-left p-2">Merek</th>
                <th className="text-left p-2">Plat Nomor</th>
                <th className="text-left p-2">Nama Driver</th>
                <th className="text-left p-2">Lokasi</th>
                <th className="text-center p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it, idx) => (
                <tr key={it.id} className="border-t">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2 font-medium">{it.merek}</td>
                  <td className="p-2">{it.platNomor}</td>
                  <td className="p-2">{it.namaDriver}</td>
                  <td className="p-2">{it.lokasi}</td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={()=>{ setInputId(it.id); setKm(''); setNote(''); setPhoto(undefined); }} className="px-2 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"><Gauge className="h-3 w-3"/>Input KM</button>
                      <button onClick={()=>setHistoryId(it.id)} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs flex items-center gap-1"><HistoryIcon className="h-3 w-3"/>History</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Input KM Modal */}
      {inputId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded w-full max-w-md">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="font-semibold">Input KM: {get(inputId)?.merek} - {get(inputId)?.platNomor}</div>
              <button onClick={()=>setInputId(null)} className="p-1 hover:bg-gray-100 rounded"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-3 space-y-3 text-sm">
              <div>
                <div className="text-xs text-gray-600">Tanggal</div>
                <input readOnly value={today()} className="w-full border rounded px-2 py-1 bg-gray-100" />
              </div>
              <div>
                <div className="text-xs text-gray-600">KM</div>
                <input type="number" value={km} onChange={e=>setKm(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border rounded px-2 py-1" placeholder="Masukkan KM hari ini" />
              </div>
              <div>
                <div className="text-xs text-gray-600">Catatan</div>
                <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} className="w-full border rounded px-2 py-1"/>
              </div>
              <div>
                <div className="text-xs text-gray-600">Upload Foto (opsional)</div>
                <input type="file" accept="image/*" onChange={e=>setPhoto(e.target.files?.[0]?.name)} className="block w-full text-xs"/>
                {photo && <div className="text-xs text-gray-600 mt-1 flex items-center gap-1"><Camera className="h-3 w-3"/> {photo}</div>}
              </div>
            </div>
            <div className="p-3 border-t flex justify-end gap-2">
              <button onClick={()=>setInputId(null)} className="px-3 py-1 border rounded">Batal</button>
              <button onClick={()=>{
                if (km === '' || Number.isNaN(km)) return;
                setLogs(p=>({ ...p, [inputId]: [{ date: today(), km: Number(km), note: note||undefined, photo }, ...(p[inputId]||[]) ] }));
                setInputId(null);
              }} className="px-3 py-1 bg-blue-600 text-white rounded">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded w-full max-w-lg">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="font-semibold">History KM: {get(historyId)?.merek} - {get(historyId)?.platNomor}</div>
              <button onClick={()=>setHistoryId(null)} className="p-1 hover:bg-gray-100 rounded"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-1">Tanggal</th>
                    <th className="py-1">KM</th>
                    <th className="py-1">Catatan</th>
                    <th className="py-1">Foto</th>
                  </tr>
                </thead>
                <tbody>
                  {(logs[historyId]||[]).map((l, i)=> (
                    <tr key={i} className="border-t">
                      <td className="py-1">{l.date}</td>
                      <td className="py-1">{l.km}</td>
                      <td className="py-1">{l.note||'-'}</td>
                      <td className="py-1">{l.photo||'-'}</td>
                    </tr>
                  ))}
                  {!(logs[historyId]?.length) && (
                    <tr><td className="py-2 text-gray-500" colSpan={4}>Belum ada history.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GAMonitoringKendaraanDashboard;
