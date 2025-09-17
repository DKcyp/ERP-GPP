import React, { useMemo, useState } from 'react';
import { Check, X as XIcon, Search, Clock } from 'lucide-react';

interface RequestItem {
  id: number;
  tanggal: string; // dd-mm-yyyy
  kendaraan: string; // merek - plat
  lokasi: string;
  driver: string;
  keterangan?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const seedRequests = (): RequestItem[] => [
  { id: 1, tanggal: '17-09-2025', kendaraan: 'Expander - B 1875 ROB', lokasi: 'HO \u2192 Proyek A', driver: 'Ujang', keterangan: 'Antar dokumen', status: 'Pending' },
  { id: 2, tanggal: '17-09-2025', kendaraan: 'Rubicon - B 500 GBP', lokasi: 'HO \u2192 Bandara', driver: 'Dedi', keterangan: 'Pickup tamu', status: 'Approved' },
  { id: 3, tanggal: '16-09-2025', kendaraan: 'Chery - B 1753 TNT', lokasi: 'Proyek B \u2192 HO', driver: 'Yusuf', keterangan: '-', status: 'Rejected' },
];

const GAPermintaanDriverApprovalDashboard: React.FC = () => {
  const [data, setData] = useState<RequestItem[]>(seedRequests());
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter(d => `${d.tanggal} ${d.kendaraan} ${d.lokasi} ${d.driver} ${d.keterangan ?? ''} ${d.status}`.toLowerCase().includes(s));
  }, [data, q]);

  const updateStatus = (id: number, status: 'Approved' | 'Rejected') => {
    setData(prev => prev.map(it => it.id === id ? { ...it, status } : it));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">PERMINTAAN DRIVER</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">GA</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">Permintaan Driver</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Cari</label>
              <div className="relative">
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari tgl/kendaraan/lokasi/driver/keterangan/status" className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs">Cari</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">No</th>
                <th className="text-left p-2">Tgl</th>
                <th className="text-left p-2">Kendaraan</th>
                <th className="text-left p-2">Lokasi</th>
                <th className="text-left p-2">Driver</th>
                <th className="text-left p-2">Keterangan</th>
                <th className="text-left p-2">Status</th>
                <th className="text-center p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it, idx) => {
                const locked = it.status !== 'Pending';
                return (
                  <tr key={it.id} className="border-t">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{it.tanggal}</td>
                    <td className="p-2">{it.kendaraan}</td>
                    <td className="p-2">{it.lokasi}</td>
                    <td className="p-2">{it.driver}</td>
                    <td className="p-2">{it.keterangan || '-'}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${it.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' : it.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>{it.status}</span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateStatus(it.id, 'Approved')}
                          disabled={locked}
                          title={locked ? 'Status sudah ditetapkan' : 'Setujui'}
                          className={`px-2 py-1 rounded text-white text-xs flex items-center gap-1 ${locked ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          <Check className="h-3 w-3"/> Approve
                        </button>
                        <button
                          onClick={() => updateStatus(it.id, 'Rejected')}
                          disabled={locked}
                          title={locked ? 'Status sudah ditetapkan' : 'Tolak'}
                          className={`px-2 py-1 rounded text-white text-xs flex items-center gap-1 ${locked ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                          <XIcon className="h-3 w-3"/> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
 
        </div>
      </div>
    </div>
  );
};

export default GAPermintaanDriverApprovalDashboard;
