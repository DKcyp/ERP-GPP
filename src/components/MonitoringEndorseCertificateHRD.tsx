import React, { useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';

interface Row {
  no: string; // No. Sertifikat
  vendor: string;
  masaBerlaku: string; // ISO end date
}

const initialData: Row[] = [
  { no: 'CERT-001', vendor: 'PT NDT Sejahtera', masaBerlaku: '2026-01-31' },
  { no: 'CERT-002', vendor: 'PT Teknindo Geosistem', masaBerlaku: '2025-11-15' },
  { no: 'CERT-003', vendor: 'CV Surya Kencana', masaBerlaku: '2025-12-20' },
];

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { 
  day: '2-digit', 
  month: 'short', 
  year: 'numeric' 
});

const MonitoringEndorseCertificateHRD: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  const filtered = useMemo(() => initialData.filter(r => (
    r.no.toLowerCase().includes(search.toLowerCase()) ||
    r.vendor.toLowerCase().includes(search.toLowerCase())
  )), [search]);

  const displayed = useMemo(() => {
    const n = parseInt(showEntries, 10);
    return filtered.slice(0, isNaN(n) ? filtered.length : n);
  }, [filtered, showEntries]);

  const handleExport = (t: string) => alert(`Export ${t}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MONITORING ENDORSE CERTIFICATE</h1>
            <nav className="text-sm text-gray-600">HRD › Monitoring › Endorse Certificate</nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari No. Sertifikat / Vendor</label>
              <div className="relative">
                <input 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  placeholder="Ketik untuk mencari..." 
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select 
              value={showEntries} 
              onChange={(e) => setShowEntries(e.target.value)} 
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => handleExport('Excel')} 
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white shadow"
            >
              <Download className="h-5 w-5 mr-2" />Excel
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Sertifikat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa Berlaku</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayed.map((r) => (
                  <tr key={r.no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(r.masaBerlaku)}
                    </td>
                  </tr>
                ))}
                {displayed.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringEndorseCertificateHRD;
