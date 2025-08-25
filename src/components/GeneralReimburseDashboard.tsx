import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Search, Calendar, FileSpreadsheet, FileText, File, ChevronDown, ChevronUp } from 'lucide-react';

interface ReimburseEntry {
  no: number;
  noReimburse: string;
  noSO: string;
  soTurunan: string;
  namaProyek: string;
  namaPemohon: string;
  tglPengajuan: string;
  tglPembayaran: string;
  nominal: string;
}

const dummyData: ReimburseEntry[] = [
  { no: 1, noReimburse: 'RO001', noSO: 'SO001', soTurunan: 'SO001.4', namaProyek: 'Proyek A', namaPemohon: 'Abdul Karim', tglPengajuan: '14-01-2025', tglPembayaran: '20-01-2025', nominal: 'Rp 40,000,000' },
  { no: 2, noReimburse: 'RO002', noSO: 'SO002', soTurunan: 'SO002.5', namaProyek: 'Proyek B', namaPemohon: 'Juna Saputra', tglPengajuan: '18-01-2025', tglPembayaran: '24-01-2025', nominal: 'Rp 35,000,000' },
  { no: 3, noReimburse: 'RO003', noSO: 'SO003', soTurunan: 'SO003.4', namaProyek: 'Proyek C', namaPemohon: 'Rizky Andrian', tglPengajuan: '20-01-2025', tglPembayaran: '26-01-2025', nominal: 'Rp 28,000,000' },
  { no: 4, noReimburse: 'RO004', noSO: 'SO004', soTurunan: 'SO004.2', namaProyek: 'Proyek D', namaPemohon: 'Hendra Prasetyo', tglPengajuan: '22-01-2025', tglPembayaran: '28-01-2025', nominal: 'Rp 50,000,000' },
  { no: 5, noReimburse: 'RO005', noSO: 'SO005', soTurunan: 'SO005.3', namaProyek: 'Proyek E', namaPemohon: 'Indra Wijaya', tglPengajuan: '25-01-2025', tglPembayaran: '31-01-2025', nominal: 'Rp 22,500,000' },
  { no: 6, noReimburse: 'RO006', noSO: 'SO006', soTurunan: 'SO006.1', namaProyek: 'Proyek F', namaPemohon: 'Siti Aminah', tglPengajuan: '01-02-2025', tglPembayaran: '05-02-2025', nominal: 'Rp 15,000,000' },
  { no: 7, noReimburse: 'RO007', noSO: 'SO007', soTurunan: 'SO007.2', namaProyek: 'Proyek G', namaPemohon: 'Budi Santoso', tglPengajuan: '03-02-2025', tglPembayaran: '07-02-2025', nominal: 'Rp 60,000,000' },
  { no: 8, noReimburse: 'RO008', noSO: 'SO008', soTurunan: 'SO008.3', namaProyek: 'Proyek H', namaPemohon: 'Dewi Lestari', tglPengajuan: '05-02-2025', tglPembayaran: '09-02-2025', nominal: 'Rp 30,000,000' },
  { no: 9, noReimburse: 'RO009', noSO: 'SO009', soTurunan: 'SO009.4', namaProyek: 'Proyek I', namaPemohon: 'Agus Salim', tglPengajuan: '07-02-2025', tglPembayaran: '11-02-2025', nominal: 'Rp 25,000,000' },
  { no: 10, noReimburse: 'RO010', noSO: 'SO010', soTurunan: 'SO010.5', namaProyek: 'Proyek J', namaPemohon: 'Rina Fitriani', tglPengajuan: '09-02-2025', tglPembayaran: '13-02-2025', nominal: 'Rp 45,000,000' },
];

const GeneralReimburseDashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ReimburseEntry; direction: 'ascending' | 'descending' } | null>(null);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...dummyData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [dummyData, sortConfig]);

  const requestSort = (key: keyof ReimburseEntry) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof ReimburseEntry) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const totalPages = Math.ceil(sortedData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedData.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Reimburse</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Reimburse</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari No Reimburse</label>
            <div className="relative">
              <input
                type="text"
                placeholder="RO001"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari No SO</label>
            <div className="relative">
              <input
                type="text"
                placeholder="SO001"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari No SO Turunan</label>
            <div className="relative">
              <input
                type="text"
                placeholder="SO001.1"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Project</label>
            <div className="relative">
              <input
                type="text"
                placeholder="PHE ONWJ"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari Status</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>--Pilih Status--</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end md:space-x-4 space-y-4 md:space-y-0 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <span className="text-gray-500">s.d</span>
              <div className="relative">
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Search
              </button>
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

        <div className="mb-4 flex items-center space-x-2">
          <span className="text-gray-700">Show</span>
          <select
            className="border border-gray-300 rounded-md px-2 py-1"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span className="text-gray-700">entries</span>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('no')}
                >
                  <div className="flex items-center">
                    No {getSortIcon('no')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('noReimburse')}
                >
                  <div className="flex items-center">
                    No Reimburse {getSortIcon('noReimburse')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('noSO')}
                >
                  <div className="flex items-center">
                    No SO {getSortIcon('noSO')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('soTurunan')}
                >
                  <div className="flex items-center">
                    SO Turunan {getSortIcon('soTurunan')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('namaProyek')}
                >
                  <div className="flex items-center">
                    Nama Proyek {getSortIcon('namaProyek')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('namaPemohon')}
                >
                  <div className="flex items-center">
                    Nama Pemohon {getSortIcon('namaPemohon')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('tglPengajuan')}
                >
                  <div className="flex items-center">
                    Tgl Pengajuan Reimburse {getSortIcon('tglPengajuan')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('tglPembayaran')}
                >
                  <div className="flex items-center">
                    Tgl Pembayaran Reimburse {getSortIcon('tglPembayaran')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('nominal')}
                >
                  <div className="flex items-center">
                    Nominal {getSortIcon('nominal')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEntries.map((entry) => (
                <tr key={entry.no}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.no}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.noReimburse}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.noSO}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.soTurunan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.namaProyek}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.namaPemohon}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.tglPengajuan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.tglPembayaran}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.nominal}</td>
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
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                  currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default GeneralReimburseDashboard;
