import React, { useEffect, useMemo, useState } from 'react';
import { Search, Clock } from 'lucide-react';

interface KontrakRow {
  id: string;
  clientName: string;
  soInduk: string;
  soTurunan: string;
  contractStart: string; // dd/MM/yyyy
  contractEnd: string;   // dd/MM/yyyy
  nilaiKontrak: number;
  absorbKontrak: number;
  remainingKontrak: number;
  nextEstimasiTagihan: string; // dd/MM/yyyy
  delayPenagihan: number; // days
  paidDate: string; // dd/MM/yyyy or '-'
  keterangan: string;
}

const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

const ProconKontrakExpenditureDashboard: React.FC = () => {
  // Filters
  const [qClient, setQClient] = useState('');
  const [qSOInduk, setQSOInduk] = useState('');
  const [qSOTurunan, setQSOTurunan] = useState('');
  // Removed: filters for start/end contract and paid date
  // Removed filters: Next Estimasi Tagihan (range), Delay Penagihan (min/max)

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [animateRows, setAnimateRows] = useState(false);

  // Mock data
  const [rows] = useState<KontrakRow[]>([
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
      nextEstimasiTagihan: '15/09/2025',
      delayPenagihan: 0,
      paidDate: '-',
      keterangan: 'Implementasi sistem modul A',
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
      nextEstimasiTagihan: '25/09/2025',
      delayPenagihan: 7,
      paidDate: '05/08/2025',
      keterangan: 'Pengembangan integrasi API',
    },
    {
      id: '3',
      clientName: 'CV. Jaya Abadi',
      soInduk: 'SO-IND-003',
      soTurunan: 'SO-TRN-003-C',
      contractStart: '05/03/2025',
      contractEnd: '05/12/2025',
      nilaiKontrak: 75250000,
      absorbKontrak: 30000000,
      remainingKontrak: 45250000,
      nextEstimasiTagihan: '10/10/2025',
      delayPenagihan: 14,
      paidDate: '-',
      keterangan: 'Maintenance dan support',
    },
  ]);

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  // No date parsing needed after filter removal

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const matchClient = r.clientName.toLowerCase().includes(qClient.toLowerCase());
      const matchSOInduk = r.soInduk.toLowerCase().includes(qSOInduk.toLowerCase());
      const matchSOTurunan = r.soTurunan.toLowerCase().includes(qSOTurunan.toLowerCase());
      return matchClient && matchSOInduk && matchSOTurunan;
    });
  }, [rows, qClient, qSOInduk, qSOTurunan]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">KONTRAK EXPENDITURE</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Procon</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">Kontrak Expenditure</span>
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
        {/* Filter Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Client */}
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
            {/* Removed filters: Tanggal Awal Kontrak, Tanggal Akhir Kontrak, Paid Date */}
            {/* Filter Button (inline) */}
            <div className="flex items-end">
              <button onClick={handleSearch} className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 text-xs flex items-center gap-2 justify-center">
                <Search className="h-4 w-4" />
                Terapkan Filter
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
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Next Estimasi Tagihan</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Delay Penagihan</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Paid Date</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Keterangan pekerjaan project</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ animationDelay: animateRows ? `${idx * 80}ms` : '0ms', animationFillMode: 'forwards' }}
                  >
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
                    <td className="px-3 py-2 text-gray-700">{row.nextEstimasiTagihan}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 inline-flex text-[10px] leading-5 font-semibold rounded-full ${row.delayPenagihan <= 0 ? 'bg-green-100 text-green-800' : row.delayPenagihan <= 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {row.delayPenagihan > 0 ? `${row.delayPenagihan} hari` : 'On time'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{row.paidDate}</td>
                    <td className="px-3 py-2 text-gray-700">{row.keterangan}</td>
                  </tr>
                ))}
                {currentData.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-3 py-6 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-700">
            <div>
              Menampilkan {filtered.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, filtered.length)} dari {filtered.length} data
            </div>
            <div className="flex items-center gap-2">
              <span>Rows:</span>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border border-gray-200 rounded bg-white">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <div className="ml-2 flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`px-2 py-1 rounded ${currentPage === p ? 'bg-blue-600 text-white' : 'hover:bg-white text-gray-700'}`}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProconKontrakExpenditureDashboard;
