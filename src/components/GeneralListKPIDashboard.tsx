import React, { useMemo, useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Download } from 'lucide-react';
import KPITambahModal from './KPITambahModal'; // Import the new modal component

interface KPIEntry {
  no: number;
  namaPegawai: string;
  posisiPegawai: string;
  atasanLangsung: string;
  posisiAtasan: string;
  periode: string;
  detail: KPIItem[];
}

interface KPIItem {
  perspektif: string;
  kra: string;
  variabelIndicator: string;
  responsibility: string;
  satuan: string;
  triwulan: string;
  bobot: string; // percent string
  target: string;
  realisasi: string;
  keterlambatan: string;
  mengaji: string;
  kajian: string;
  healthyWeek: string;
  polaritas: 'Positive' | 'Negative' | '';
  finalScore: string; // computed/placeholder string like '25,00%'
  performance: string; // computed performance percentage
}

// Function to calculate performance percentage
const calculatePerformance = (item: KPIItem): string => {
  // Convert string values to numbers for calculation
  const finalScore = parseFloat(item.finalScore.replace('%', ''));
  const keterlambatan = parseFloat(item.keterlambatan);
  const mengaji = parseFloat(item.mengaji);
  const kajian = parseFloat(item.kajian);
  const healthyWeek = parseFloat(item.healthyWeek);
  
  // Calculate average (you can adjust this formula as needed)
  const average = (finalScore + keterlambatan + mengaji + kajian + healthyWeek) / 5;
  return `${average.toFixed(2)}%`;
};

const GeneralListKPIDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [showEntries, setShowEntries] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);

  const kpiData: KPIEntry[] = [
    { no: 1, namaPegawai: 'M. Luthfi Sujudi', posisiPegawai: 'Admin Report', atasanLangsung: 'Agung Asmara', posisiAtasan: 'Operation Manager', periode: 'Januari 2025', detail: [
      { perspektif: 'FINANCIAL (Bobot = 20 %)', kra: 'MARKET & PRODUCT ON CALL & TENDER', variabelIndicator: 'Efisiensi Budget project', responsibility: 'Submit ketersediaan SO Medco ( H+2 Selesai Report Validation)', satuan: 'Hari', triwulan: '1', bobot: '25', target: '2', realisasi: '2', keterlambatan: '85', mengaji: '90', kajian: '80', healthyWeek: '95', polaritas: 'Negative', finalScore: '25,00%', performance: '75,00%' },
      { perspektif: 'CUSTOMER (Bobot = 20 %)', kra: 'MONITORING SERVICE', variabelIndicator: 'Kepuasan Klien/ Customer', responsibility: 'Distribusi Proses Report dan BAP Tepat Waktu ( H+7 Selesai Demob)', satuan: 'Hari', triwulan: '1', bobot: '25', target: '7', realisasi: '9', keterlambatan: '70', mengaji: '85', kajian: '75', healthyWeek: '80', polaritas: 'Negative', finalScore: '19,44%', performance: '65,89%' },
      { perspektif: 'INTERNAL BUSINESS PROCESS (Bobot = 50 %)', kra: 'MANAGEMENT & MONITORING DEVELOPMENT DEPT', variabelIndicator: 'Laporan Progress Mingguan', responsibility: 'Laporan progress mingguan ( Setiap hari )', satuan: 'Hari', triwulan: '1', bobot: '5', target: '7', realisasi: '10', keterlambatan: '90', mengaji: '95', kajian: '88', healthyWeek: '92', polaritas: 'Negative', finalScore: '3,50%', performance: '73,70%' },
      { perspektif: 'INTERNAL BUSINESS PROCESS (Bobot = 50 %)', kra: 'MANAGEMENT & MONITORING DEVELOPMENT DEPT', variabelIndicator: 'Document arsip dan log monitoring setiap document project', responsibility: 'Membuat arsip data lampiran pendukung setiap project (Report, Timesheet, Summary SO, Rekap SO, Summary SO Minus, ( H+30 setelah selesai submit invoice , dll )', satuan: 'Hari', triwulan: '1', bobot: '10', target: '30', realisasi: '30', keterlambatan: '95', mengaji: '88', kajian: '92', healthyWeek: '85', polaritas: 'Negative', finalScore: '10,00%', performance: '74,00%' },
    ] },
    { no: 2, namaPegawai: 'Rina Sari', posisiPegawai: 'Operation Manager', atasanLangsung: 'Arief Nugroho', posisiAtasan: 'General Manager', periode: 'Januari 2025', detail: [] },
    { no: 3, namaPegawai: 'Budi Santoso', posisiPegawai: 'Operation Manager', atasanLangsung: 'Siti Rahma', posisiAtasan: 'General Manager', periode: 'Januari 2025', detail: [] },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const filtered = useMemo(() => {
    return kpiData.filter((d) => !search || d.namaPegawai.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const pageSize = parseInt(showEntries, 10);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const scoreBg = (score: string) => {
    const num = parseFloat(score.replace(',', '.'));
    if (num >= 25) return 'bg-yellow-50';
    if (num <= 5) return 'bg-red-50';
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">LIST KPI - GENERAL</h1>
                <nav className="text-sm text-gray-600">
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">General</span>
                  <span className="mx-2">›</span>
                  <span className="text-blue-600 font-medium">List KPI</span>
                </nav>
              </div>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 text-sm">
                  <Download className="h-5 w-5 mr-2" /> Excel
                </button>
                <button className="inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-sm">
                  <Download className="h-5 w-5 mr-2" /> CSV
                </button>
                <button className="inline-flex items-center px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 text-sm">
                  <Download className="h-5 w-5 mr-2" /> PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Pegawai</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Masukkan nama pegawai..." />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select value={showEntries} onChange={(e) => { setShowEntries(e.target.value); setCurrentPage(1); }} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
              <button onClick={openModal} className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-xl shadow-md hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" /> Tambah
              </button>
            </div>
          </div>

          {/* KPI Table with expandable rows */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atasan Langsung</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi Atasan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paged.map((entry) => (
                    <React.Fragment key={entry.no}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.no}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.namaPegawai}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.posisiPegawai}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.atasanLangsung}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.posisiAtasan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.periode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button onClick={() => setExpanded(expanded === entry.no ? null : entry.no)} className="inline-flex items-center px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-xs">
                            {expanded === entry.no ? <ChevronDown className="h-4 w-4 mr-1"/> : <ChevronRight className="h-4 w-4 mr-1"/>}
                            {expanded === entry.no ? 'Tutup' : 'Buka'}
                          </button>
                        </td>
                      </tr>
                      {expanded === entry.no && (
                        <tr className="bg-white">
                          <td colSpan={7} className="px-6 pb-6">
                            {/* Header summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mb-4 rounded-xl border border-gray-200 bg-gray-50">
                              <div className="text-sm text-gray-700">
                                <div className="flex gap-2"><span className="font-semibold">Nama:</span><span>{entry.namaPegawai}</span></div>
                                <div className="flex gap-2"><span className="font-semibold">Posisi:</span><span>{entry.posisiPegawai}</span></div>
                              </div>
                              <div className="text-sm text-gray-700">
                                <div className="flex gap-2"><span className="font-semibold">Atasan Langsung:</span><span>{entry.atasanLangsung}</span></div>
                                <div className="flex gap-2"><span className="font-semibold">Posisi:</span><span>{entry.posisiAtasan}</span></div>
                              </div>
                            </div>

                            {/* Detail table */}
                            <div className="overflow-x-auto">
                              <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm font-semibold uppercase tracking-wider">
                                    <th className="px-4 py-3 text-left" rowSpan={2}>Perspektif</th>
                                    <th className="px-4 py-3 text-left" rowSpan={2}>KRA</th>
                                    <th className="px-4 py-3 text-center" colSpan={3}>KPI Indicators</th>
                                    <th className="px-4 py-3 text-center" colSpan={3}>Plan</th>
                                    <th className="px-4 py-3 text-left" rowSpan={2}>Realisasi</th>
                                    <th className="px-4 py-3 text-center" rowSpan={2}>Keterlambatan</th>
                                    <th className="px-4 py-3 text-center" rowSpan={2}>Mengaji</th>
                                    <th className="px-4 py-3 text-center" rowSpan={2}>Kajian</th>
                                    <th className="px-4 py-3 text-center" rowSpan={2}>Healthy Week</th>
                                    <th className="px-4 py-3 text-center" rowSpan={2}>Performance</th>
                                    <th className="px-4 py-3 text-left" rowSpan={2}>Polaritas</th>
                                    <th className="px-4 py-3 text-left" rowSpan={2}>Final Score KPI</th>
                                  </tr>
                                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-4 py-2 text-left">Variabel Indicator</th>
                                    <th className="px-4 py-2 text-left">Responsibility</th>
                                    <th className="px-4 py-2 text-left">Satuan</th>
                                    <th className="px-4 py-2 text-left">Triwulan</th>
                                    <th className="px-4 py-2 text-left">Bobot (%)</th>
                                    <th className="px-4 py-2 text-left">Target</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {entry.detail.length === 0 && (
                                    <tr>
                                      <td colSpan={15} className="px-4 py-6 text-center text-sm text-gray-500">Belum ada data KPI untuk pegawai ini.</td>
                                    </tr>
                                  )}
                                  {entry.detail.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 align-top">
                                      <td className="px-4 py-3 whitespace-pre-line">{row.perspektif}</td>
                                      <td className="px-4 py-3 whitespace-pre-line">{row.kra}</td>
                                      <td className="px-4 py-3 whitespace-pre-line">{row.variabelIndicator}</td>
                                      <td className="px-4 py-3 whitespace-pre-line">{row.responsibility}</td>
                                      <td className="px-4 py-3">{row.satuan}</td>
                                      <td className="px-4 py-3">{row.triwulan}</td>
                                      <td className="px-4 py-3">{row.bobot}%</td>
                                      <td className="px-4 py-3">{row.target}</td>
                                      <td className="px-4 py-3">{row.realisasi}</td>
                                      <td className="px-4 py-3 text-center">{row.keterlambatan}%</td>
                                      <td className="px-4 py-3 text-center">{row.mengaji}%</td>
                                      <td className="px-4 py-3 text-center">{row.kajian}%</td>
                                      <td className="px-4 py-3 text-center">{row.healthyWeek}%</td>
                                      <td className={`px-4 py-3 text-center font-semibold ${parseFloat(row.performance.replace('%', '')) < 75 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                                        {row.performance}
                                      </td>
                                      <td className="px-4 py-3">{row.polaritas}</td>
                                      <td className={`px-4 py-3 font-semibold ${scoreBg(row.finalScore)}`}>{row.finalScore}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-600">
              <span>
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
              </span>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  className="px-3 py-1.5 border border-gray-300 rounded-l-md bg-white hover:bg-gray-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                <span className="px-3 py-1.5 border-t border-b border-gray-300 bg-white">{currentPage}/{totalPages}</span>
                <button
                  className="px-3 py-1.5 border border-gray-300 rounded-r-md bg-white hover:bg-gray-50"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <KPITambahModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default GeneralListKPIDashboard;
