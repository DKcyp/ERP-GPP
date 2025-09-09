import React, { useMemo, useState } from 'react';
import { Clock, Search } from 'lucide-react';

interface CustomerRow { id: number; nama: string; pic: string; telp: string; email: string; alamat: string; kota: string; npwp: string; }

const CollectionDatabaseCustomer: React.FC = () => {
  const today = new Date();
  const [searchNama, setSearchNama] = useState('');
  const [searchKota, setSearchKota] = useState('');

  const [rows] = useState<CustomerRow[]>([
    { id: 1, nama: 'PT Sinar Abadi', pic: 'Rudi', telp: '021-123456', email: 'info@sinarabadi.co.id', alamat: 'Jl. Melati No. 1', kota: 'Jakarta', npwp: '01.234.567.8-901.000' },
    { id: 2, nama: 'CV Mitra Jaya', pic: 'Dina', telp: '022-654321', email: 'cs@mitrajaya.co.id', alamat: 'Jl. Mawar No. 2', kota: 'Bandung', npwp: '02.345.678.9-012.000' },
  ]);

  const filtered = useMemo(() => rows.filter(r =>
    (searchNama ? r.nama.toLowerCase().includes(searchNama.toLowerCase()) : true) &&
    (searchKota ? r.kota.toLowerCase().includes(searchKota.toLowerCase()) : true)
  ), [rows, searchNama, searchKota]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">COLLECTION - DATABASE CUSTOMER</h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Customer</label>
              <input className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" placeholder="Nama..." value={searchNama} onChange={e=>setSearchNama(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kota</label>
              <input className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" placeholder="Kota..." value={searchKota} onChange={e=>setSearchKota(e.target.value)} />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PIC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kota</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NPWP</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(r=> (
                  <tr key={r.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.pic}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.telp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.alamat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.kota}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.npwp}</td>
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

export default CollectionDatabaseCustomer;
