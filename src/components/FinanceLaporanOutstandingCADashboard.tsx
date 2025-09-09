import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Search, Calendar, FileSpreadsheet, FileText, File, ChevronDown, ChevronUp } from 'lucide-react';

interface CashAdvanceEntry {
  no: number;
  namaDepartemen: string;
  noCA: string;
  noSO: string;
  soTurunan: string;
  namaProyek: string;
  namaPemohon: string;
  tglPengajuan: string;
  tglPembayaran: string;
  nominal: string;
  keterangan: string;
}

const dummyData: CashAdvanceEntry[] = [
  { no: 1, namaDepartemen: 'Keuangan', noCA: 'CA001', noSO: 'SO001', soTurunan: 'SO001.23', namaProyek: 'Proyek PHE ONWJ', namaPemohon: 'Muh Saifudin', tglPengajuan: '15-01-2025', tglPembayaran: '25-01-2025', nominal: 'Rp 12,000,000', keterangan: 'Pembelian material' },
  { no: 2, namaDepartemen: 'Operasional', noCA: 'CA002', noSO: 'SO002', soTurunan: 'SO002.43', namaProyek: 'Proyek OSES', namaPemohon: 'Rizky Andrian', tglPengajuan: '18-01-2025', tglPembayaran: '28-01-2025', nominal: 'Rp 18,500,000', keterangan: 'Pembelian alat berat' },
  { no: 3, namaDepartemen: 'Pemasaran', noCA: 'CA003', noSO: 'SO003', soTurunan: 'SO003.12', namaProyek: 'Proyek MEDCO', namaPemohon: 'Hendra Prasetyo', tglPengajuan: '20-01-2025', tglPembayaran: '29-01-2025', nominal: 'Rp 22,000,000', keterangan: 'Perjalanan dinas' },
  { no: 4, namaDepartemen: 'HRD', noCA: 'CA004', noSO: 'SO004', soTurunan: 'SO004.33', namaProyek: 'Proyek C', namaPemohon: 'Indra Wijaya', tglPengajuan: '22-01-2025', tglPembayaran: '31-01-2025', nominal: 'Rp 30,000,000', keterangan: 'Pembelian inventaris' },
  { no: 5, namaDepartemen: 'Logistik', noCA: 'CA005', noSO: 'SO005', soTurunan: 'SO005.43', namaProyek: 'Proyek A', namaPemohon: 'Juna Saputra', tglPengajuan: '25-01-2025', tglPembayaran: '02-02-2025', nominal: 'Rp 15,000,000', keterangan: 'Biaya operasional' },
];

const FinanceLaporanOutstandingCADashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CashAdvanceEntry; direction: 'ascending' | 'descending' } | null>(null);

  const sortedData = useMemo(() => {
    let sortableItems = [...dummyData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [sortConfig]);

  const requestSort = (key: keyof CashAdvanceEntry) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof CashAdvanceEntry) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const totalPages = Math.ceil(sortedData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedData.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">LAPORAN OUTSTANDING CASH ADVANCE</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Outstanding Cash Advance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari No CA</label>
            <div className="relative">
              <input type="text" placeholder="CA001" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari No SO</label>
            <div className="relative">
              <input type="text" placeholder="SO001" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Project</label>
            <div className="relative">
              <input type="text" placeholder="PHE ONWJ" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end md:space-x-4 space-y-4 md:space-y-0 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} dateFormat="dd/MM/yyyy" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <span className="text-gray-500">s.d</span>
              <div className="relative">
                <DatePicker selected={endDate} onChange={(date: Date | null) => setEndDate(date)} dateFormat="dd/MM/yyyy" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Search</button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mb-6">
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
            <FileSpreadsheet className="h-5 w-5 mr-2" /> Export Excel
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <FileText className="h-5 w-5 mr-2" /> Export CSV
          </button>
          <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
            <File className="h-5 w-5 mr-2" /> Export PDF
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('no')}>
                  <div className="flex items-center">No {getSortIcon('no')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('namaDepartemen')}>
                  <div className="flex items-center">Nama Departemen {getSortIcon('namaDepartemen')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('noCA')}>
                  <div className="flex items-center">No CA {getSortIcon('noCA')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('noSO')}>
                  <div className="flex items-center">No SO {getSortIcon('noSO')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('soTurunan')}>
                  <div className="flex items-center">SO Turunan {getSortIcon('soTurunan')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('namaProyek')}>
                  <div className="flex items-center">Nama Proyek {getSortIcon('namaProyek')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('namaPemohon')}>
                  <div className="flex items-center">Nama Pemohon {getSortIcon('namaPemohon')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('tglPengajuan')}>
                  <div className="flex items-center">Tgl Pengajuan {getSortIcon('tglPengajuan')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('tglPembayaran')}>
                  <div className="flex items-center">Tgl Pembayaran {getSortIcon('tglPembayaran')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('nominal')}>
                  <div className="flex items-center">Nominal {getSortIcon('nominal')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('keterangan')}>
                  <div className="flex items-center">Keterangan {getSortIcon('keterangan')}</div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEntries.map((entry) => (
                <tr key={entry.no}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.no}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.namaDepartemen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.noCA}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.noSO}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.soTurunan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.namaProyek}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.namaPemohon}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.tglPengajuan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.tglPembayaran}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.nominal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, sortedData.length)} of {sortedData.length} entries
          </div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Previous</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => paginate(i + 1)} className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>{i + 1}</button>
            ))}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Next</button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default FinanceLaporanOutstandingCADashboard;
