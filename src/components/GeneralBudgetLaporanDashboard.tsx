import React, { useMemo, useState } from 'react';
import { Search, Download, Calendar, FileText } from 'lucide-react';

interface LaporanBudgetItem {
  id: string;
  tanggal: string; // ISO date
  unit: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  nomorDokumen?: string;
}

const GeneralBudgetLaporanDashboard: React.FC = () => {
  const [data] = useState<LaporanBudgetItem[]>([
    { id: 'LB-0001', tanggal: '2025-01-15', unit: 'Marketing', kategori: 'Promosi', deskripsi: 'Iklan media sosial', nominal: 5000000, nomorDokumen: 'DOC/IK/001' },
    { id: 'LB-0002', tanggal: '2025-02-03', unit: 'QHSE', kategori: 'Pelatihan', deskripsi: 'Training K3 internal', nominal: 3000000, nomorDokumen: 'DOC/TR/014' },
  ]);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  const filtered = useMemo(() => {
    return data.filter((it) => {
      const q = searchText.toLowerCase();
      const matchSearch = !q || it.deskripsi.toLowerCase().includes(q) || it.unit.toLowerCase().includes(q) || (it.nomorDokumen || '').toLowerCase().includes(q);
      const matchUnit = !unitFilter || it.unit === unitFilter;
      const matchKategori = !kategoriFilter || it.kategori === kategoriFilter;
      const matchStart = !dateStart || new Date(it.tanggal) >= new Date(dateStart);
      const matchEnd = !dateEnd || new Date(it.tanggal) <= new Date(dateEnd);
      return matchSearch && matchUnit && matchKategori && matchStart && matchEnd;
    });
  }, [data, searchText, unitFilter, kategoriFilter, dateStart, dateEnd]);

  const handleExport = (type: string) => {
    alert(`Exporting as ${type}`);
  };

  const formatCurrency = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const totalNominal = filtered.reduce((sum, it) => sum + it.nominal, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">LAPORAN PENGGUNAAN BUDGET</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">General</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Laporan Penggunaan Budget</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
              <div className="relative">
                <input className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Ketik kata kunci..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none" value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)}>
                <option value="">Semua</option>
                <option>Marketing</option>
                <option>QHSE</option>
                <option>HRD</option>
                <option>Pengadaan</option>
                <option>Gudang</option>
                <option>Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none" value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)}>
                <option value="">Semua</option>
                <option>Promosi</option>
                <option>Operasional</option>
                <option>Pelatihan</option>
                <option>Perjalanan Dinas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => {}} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Total Penggunaan</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(totalNominal)}</div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select value={showEntries} onChange={(e) => setShowEntries(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => handleExport('Excel')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button onClick={() => handleExport('CSV')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button onClick={() => handleExport('PDF')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <Download className="h-5 w-5 mr-2" /> PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumen</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((it) => (
                  <tr key={it.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(it.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{it.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{it.kategori}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{it.deskripsi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(it.nominal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {it.nomorDokumen ? (
                        <a href="#" className="flex items-center hover:text-blue-800">
                          <FileText className="h-4 w-4 mr-1" /> {it.nomorDokumen}
                        </a>
                      ) : (
                        '-' 
                      )}
                    </td>
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

export default GeneralBudgetLaporanDashboard;
