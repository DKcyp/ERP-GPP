import React, { useMemo, useState } from 'react';
import { Clock, Search } from 'lucide-react';

interface InvOutRow { id: number; noInvoice: string; customer: string; project: string; tanggal: string; nilai: number; terbayar: number; outstanding: number; umurPiutang: number; }

const CollectionDashboardInvoiceOutstanding: React.FC = () => {
  const today = new Date();
  const [searchInv, setSearchInv] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [umur, setUmur] = useState('');

  const [rows] = useState<InvOutRow[]>([
    { id: 1, noInvoice: 'INV-2025-001', customer: 'PT Sinar Abadi', project: 'Instalasi Server', tanggal: '2025-08-20', nilai: 78000000, terbayar: 30000000, outstanding: 48000000, umurPiutang: 20 },
    { id: 2, noInvoice: 'INV-2025-002', customer: 'CV Mitra Jaya', project: 'Upgrade Network', tanggal: '2025-08-10', nilai: 52000000, terbayar: 0, outstanding: 52000000, umurPiutang: 30 },
  ]);

  const filtered = useMemo(() => rows.filter(r =>
    (searchInv ? r.noInvoice.toLowerCase().includes(searchInv.toLowerCase()) : true) &&
    (searchCustomer ? r.customer.toLowerCase().includes(searchCustomer.toLowerCase()) : true) &&
    (umur ? (umur === '>=30' ? r.umurPiutang >= 30 : r.umurPiutang < 30) : true)
  ), [rows, searchInv, searchCustomer, umur]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">COLLECTION - DASHBOARD INVOICE OUTSTANDING</h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">No Invoice</label>
              <input className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" placeholder="INV-..." value={searchInv} onChange={e=>setSearchInv(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <input className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" placeholder="Nama customer..." value={searchCustomer} onChange={e=>setSearchCustomer(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Umur Piutang</label>
              <select className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none" value={umur} onChange={e=>setUmur(e.target.value)}>
                <option value="">Semua</option>
                <option value=">=30">≥ 30 hari</option>
                <option value="<30">&lt; 30 hari</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nilai</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Terbayar</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Outstanding</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Umur (hari)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(r=> (
                  <tr key={r.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(r.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{r.noInvoice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.project}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">Rp {r.nilai.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">Rp {r.terbayar.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">Rp {r.outstanding.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.umurPiutang}</td>
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

export default CollectionDashboardInvoiceOutstanding;
