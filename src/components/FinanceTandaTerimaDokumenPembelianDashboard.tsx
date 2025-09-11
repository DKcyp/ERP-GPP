import React, { useMemo, useState } from 'react';
import { Clock, Search, FileSpreadsheet, FileDown } from 'lucide-react';

interface TTPBRow {
  id: number;
  noTTPB: string;
  tglTTPB: string; // yyyy-mm-dd
  diserahkanOleh: string;
  diterimaOleh: string;
  namaDivisi: string;
  tglDiserahkanPurchasing?: string; // yyyy-mm-dd
  tglDiterimaKeuangan?: string; // yyyy-mm-dd
}

const FinanceTandaTerimaDokumenPembelianDashboard: React.FC = () => {
  const today = new Date();

  // Filters
  const [searchNo, setSearchNo] = useState('');
  const [divisi, setDivisi] = useState('');
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');

  const divisiOptions = ['Marketing','HRD','GA','Procurement','Project Control','Operasional','QHSE','Finance','Accounting','Tax','Gudang'];

  const [rows] = useState<TTPBRow[]>([
    {
      id: 1,
      noTTPB: 'TTPB-2025-09-001',
      tglTTPB: '2025-09-09',
      diserahkanOleh: 'Purchasing - Rina',
      diterimaOleh: 'Keuangan - Andi',
      namaDivisi: 'Procurement',
      tglDiserahkanPurchasing: '2025-09-10',
      tglDiterimaKeuangan: '2025-09-11',
    },
    {
      id: 2,
      noTTPB: 'TTPB-2025-09-002',
      tglTTPB: '2025-09-11',
      diserahkanOleh: 'Purchasing - Dewa',
      diterimaOleh: 'Keuangan - Sinta',
      namaDivisi: 'Finance',
      tglDiserahkanPurchasing: '2025-09-11',
      tglDiterimaKeuangan: '2025-09-12',
    },
  ]);

  const filtered = useMemo(() => rows.filter(r => {
    const okNo = searchNo ? r.noTTPB.toLowerCase().includes(searchNo.toLowerCase()) : true;
    const okDiv = divisi ? r.namaDivisi === divisi : true;
    const okFrom = dari ? new Date(r.tglTTPB) >= new Date(`${dari}T00:00:00`) : true;
    const okTo = sampai ? new Date(r.tglTTPB) <= new Date(`${sampai}T23:59:59`) : true;
    return okNo && okDiv && okFrom && okTo;
  }), [rows, searchNo, divisi, dari, sampai]);

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">TANDA TERIMA DOKUMEN PEMBELIAN (TTPB)</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">TTPB</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter TTPB</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. TTPB</label>
              <input type="text" value={searchNo} onChange={e => setSearchNo(e.target.value)} placeholder="TTPB-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Divisi</label>
              <select value={divisi} onChange={e => setDivisi(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua</option>
                {divisiOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl TTPB Dari</label>
              <input type="date" value={dari} onChange={e => setDari(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl TTPB Sampai</label>
              <input type="date" value={sampai} onChange={e => setSampai(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
            </div>
            <div className="flex items-end">
              <button className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Cari
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button onClick={exportExcel} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button onClick={exportPDF} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar TTPB</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. TTPB</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl TTPB  (….... s/d…...)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diserahkan oleh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diterima oleh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Divisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl diserahkan Purchasing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl di terima Keuangan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{row.noTTPB}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglTTPB).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.diserahkanOleh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.diterimaOleh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaDivisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglDiserahkanPurchasing ? new Date(row.tglDiserahkanPurchasing).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglDiterimaKeuangan ? new Date(row.tglDiterimaKeuangan).toLocaleDateString('id-ID') : '-'}</td>
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

export default FinanceTandaTerimaDokumenPembelianDashboard;
