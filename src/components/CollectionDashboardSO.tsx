import React, { useMemo, useState } from 'react';
import { Clock, Search } from 'lucide-react';

interface SORow { id: number; noSO: string; customer: string; project: string; tanggal: string; nilai: number; status: string; }

const CollectionDashboardSO: React.FC = () => {
  const today = new Date();
  const [searchSO, setSearchSO] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [status, setStatus] = useState('');

  const [rows] = useState<SORow[]>([
    { id: 1, noSO: 'SO-2025-001', customer: 'PT Sinar Abadi', project: 'Instalasi Server', tanggal: '2025-09-02', nilai: 125000000, status: 'On Progress' },
    { id: 2, noSO: 'SO-2025-002', customer: 'CV Mitra Jaya', project: 'Upgrade Network', tanggal: '2025-09-05', nilai: 65000000, status: 'Selesai' },
  ]);

  const filtered = useMemo(() => rows.filter(r =>
    (searchSO ? r.noSO.toLowerCase().includes(searchSO.toLowerCase()) : true) &&
    (searchCustomer ? r.customer.toLowerCase().includes(searchCustomer.toLowerCase()) : true) &&
    (status ? r.status === status : true)
  ), [rows, searchSO, searchCustomer, status]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">COLLECTION - DASHBOARD SO</h1>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No SO</label>
              <input className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" placeholder="SO-..." value={searchSO} onChange={e=>setSearchSO(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <input className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" placeholder="Nama customer..." value={searchCustomer} onChange={e=>setSearchCustomer(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none" value={status} onChange={e=>setStatus(e.target.value)}>
                <option value="">Semua</option>
                <option value="On Progress">On Progress</option>
                <option value="Selesai">Selesai</option>
                <option value="Cancel">Cancel</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" /> Cari
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No SO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nilai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(r=> (
                  <tr key={r.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(r.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{r.noSO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.project}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">Rp {r.nilai.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDashboardSO;
