import React, { useMemo, useState } from 'react';
import { Clock, Search } from 'lucide-react';

interface CashInRow { id: number; tanggal: string; customer: string; sumber: string; noDokumen: string; bank: string; nominal: number; keterangan: string; }

const CollectionDashboardCashIn: React.FC = () => {
  const today = new Date();
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchDoc, setSearchDoc] = useState('');

  const [rows] = useState<CashInRow[]>([
    { id: 1, tanggal: '2025-09-05', customer: 'PT Sinar Abadi', sumber: 'Invoice INV-2025-001', noDokumen: 'BBM-2025-09-010', bank: 'Bank Mandiri Operasional', nominal: 20000000, keterangan: 'Pelunasan' },
    { id: 2, tanggal: '2025-09-06', customer: 'CV Mitra Jaya', sumber: 'Proforma PI-2025-002', noDokumen: 'BBM-2025-09-011', bank: 'Bank BCA', nominal: 12000000, keterangan: 'Termin 1' },
  ]);

  const filtered = useMemo(() => rows.filter(r =>
    (searchCustomer ? r.customer.toLowerCase().includes(searchCustomer.toLowerCase()) : true) &&
    (searchDoc ? r.noDokumen.toLowerCase().includes(searchDoc.toLowerCase()) : true)
  ), [rows, searchCustomer, searchDoc]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">COLLECTION - DASHBOARD CASH IN</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <input className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" placeholder="Nama customer..." value={searchCustomer} onChange={e=>setSearchCustomer(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Dokumen</label>
              <input className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" placeholder="No dokumen..." value={searchDoc} onChange={e=>setSearchDoc(e.target.value)} />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sumber</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nominal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(r=> (
                  <tr key={r.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(r.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.sumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{r.noDokumen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.bank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">Rp {r.nominal.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.keterangan}</td>
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

export default CollectionDashboardCashIn;
