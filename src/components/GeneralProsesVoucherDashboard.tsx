import React, { useState } from 'react';
import { Search, Plus, FileText, FileSpreadsheet, FileDown, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EntryVoucherModal from './EntryVoucherModal'; // Import the modal component
import { twMerge } from 'tailwind-merge';

interface VoucherData {
  no: number;
  noVoucher: string;
  noSO: string;
  soTurunan: string;
  namaProject: string;
  tglPengajuan: string;
  tglPembayaran: string;
  tglExpense: string;
  tglExpired: string;
  nominalPengajuan: string;
}

const dummyVoucherData: VoucherData[] = [
  { no: 1, noVoucher: 'VCH001', noSO: 'SO12345', soTurunan: '-', namaProject: 'Project A', tglPengajuan: '2025-01-15', tglPembayaran: '2025-01-25', tglExpense: '2025-02-10', tglExpired: '2025-02-15', nominalPengajuan: 'Rp 13.000.000' },
  { no: 2, noVoucher: 'VCH002', noSO: 'SO12346', soTurunan: 'SO12346.23', namaProject: 'Project B', tglPengajuan: '2025-01-16', tglPembayaran: '-', tglExpense: '2025-02-12', tglExpired: '2025-02-16', nominalPengajuan: 'Rp 20.000.000' },
  { no: 3, noVoucher: 'VCH003', noSO: 'SO12347', soTurunan: 'SO12347.32', namaProject: 'Project C', tglPengajuan: '2025-01-17', tglPembayaran: '2025-01-27', tglExpense: '2025-02-12', tglExpired: '2025-02-17', nominalPengajuan: 'Rp 10.000.000' },
  { no: 4, noVoucher: 'VCH004', noSO: 'SO12348', soTurunan: 'SO12348.21', namaProject: 'Project D', tglPengajuan: '2025-01-18', tglPembayaran: '2025-01-28', tglExpense: '-', tglExpired: '2025-02-18', nominalPengajuan: 'Rp 50.000.000' },
  { no: 5, noVoucher: 'VCH005', noSO: '-', soTurunan: '-', namaProject: 'Project E', tglPengajuan: '2025-01-19', tglPembayaran: '2025-01-29', tglExpense: '2025-02-14', tglExpired: '2025-02-19', nominalPengajuan: 'Rp 40.000.000' },
];

const GeneralProsesVoucherDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchNoVoucher, setSearchNoVoucher] = useState('');
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchNoSOTurunan, setSearchNoSOTurunan] = useState('');
  const [searchNamaProject, setSearchNamaProject] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(new Date('2025-03-03'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2025-03-03'));
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = dummyVoucherData.filter(item => {
    return (
      item.noVoucher.toLowerCase().includes(searchNoVoucher.toLowerCase()) &&
      item.noSO.toLowerCase().includes(searchNoSO.toLowerCase()) &&
      item.soTurunan.toLowerCase().includes(searchNoSOTurunan.toLowerCase()) &&
      item.namaProject.toLowerCase().includes(searchNamaProject.toLowerCase())
      // Add status and date filtering logic here if needed
    );
  });

  const totalPages = Math.ceil(filteredData.length / showEntries);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showEntries,
    currentPage * showEntries
  );

  const handleSearch = () => {
    console.log('Searching with filters:', {
      searchNoVoucher, searchNoSO, searchNoSOTurunan, searchNamaProject, searchStatus, startDate, endDate
    });
    setCurrentPage(1); // Reset to first page on new search
    // Implement actual data fetching/filtering logic here
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const selectClass = "w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none";
  const searchButtonClass = "p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Voucher</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Cari No Voucher */}
            <div className="relative">
              <label htmlFor="cariNoVoucher" className="block text-sm font-medium text-gray-700 mb-1">Cari No Voucher</label>
              <input
                type="text"
                id="cariNoVoucher"
                className={inputClass}
                value={searchNoVoucher}
                onChange={(e) => setSearchNoVoucher(e.target.value)}
                placeholder="RY-001"
              />
              <button className={twMerge(searchButtonClass, "absolute right-0 top-7 h-[42px] w-[42px] rounded-l-none")} onClick={handleSearch}>
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Cari No SO */}
            <div className="relative">
              <label htmlFor="cariNoSO" className="block text-sm font-medium text-gray-700 mb-1">Cari No SO</label>
              <input
                type="text"
                id="cariNoSO"
                className={inputClass}
                value={searchNoSO}
                onChange={(e) => setSearchNoSO(e.target.value)}
                placeholder="SO0023.12"
              />
              <button className={twMerge(searchButtonClass, "absolute right-0 top-7 h-[42px] w-[42px] rounded-l-none")} onClick={handleSearch}>
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Cari No SO Turunan */}
            <div className="relative">
              <label htmlFor="cariNoSOTurunan" className="block text-sm font-medium text-gray-700 mb-1">Cari No SO Turunan</label>
              <input
                type="text"
                id="cariNoSOTurunan"
                className={inputClass}
                value={searchNoSOTurunan}
                onChange={(e) => setSearchNoSOTurunan(e.target.value)}
                placeholder="SO0023.12"
              />
              <button className={twMerge(searchButtonClass, "absolute right-0 top-7 h-[42px] w-[42px] rounded-l-none")} onClick={handleSearch}>
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Cari Nama Project */}
            <div className="relative">
              <label htmlFor="cariNamaProject" className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Project</label>
              <input
                type="text"
                id="cariNamaProject"
                className={inputClass}
                value={searchNamaProject}
                onChange={(e) => setSearchNamaProject(e.target.value)}
                placeholder="Proyek MEDCO"
              />
              <button className={twMerge(searchButtonClass, "absolute right-0 top-7 h-[42px] w-[42px] rounded-l-none")} onClick={handleSearch}>
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Cari Status */}
            <div>
              <label htmlFor="cariStatus" className="block text-sm font-medium text-gray-700 mb-1">Cari Status</label>
              <select
                id="cariStatus"
                className={selectClass}
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
              >
                <option value="">--Pilih Nama Project--</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Periode and Search Button */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-4 mt-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label htmlFor="periode" className="block text-sm font-medium text-gray-700 md:col-span-3">Periode</label>
              <div className="relative">
                <DatePicker
                  id="periode"
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className={inputClass}
                  placeholderText="dd/mm/yyyy"
                  calendarClassName="shadow-lg rounded-lg"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
              <span className="text-gray-600 text-center">s.d</span>
              <div className="relative">
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className={inputClass}
                  placeholderText="dd/mm/yyyy"
                  calendarClassName="shadow-lg rounded-lg"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 w-full md:w-auto"
            >
              Search
            </button>
          </div>
        </div>

        {/* Action Buttons and Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 w-full md:w-auto justify-center"
            >
              <Plus className="h-5 w-5" />
              <span>Tambah</span>
            </button>
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              <button className="px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center space-x-2">
                <FileSpreadsheet className="h-5 w-5" />
                <span>Export Excel</span>
              </button>
              <button className="px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Export CSV</span>
              </button>
              <button className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2">
                <FileDown className="h-5 w-5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mb-4 flex items-center space-x-2 text-gray-700">
            <span>Show</span>
            <select
              className="border border-gray-300 rounded-md px-2 py-1"
              value={showEntries}
              onChange={(e) => setShowEntries(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No <span className="ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No Voucher <span className="ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No SO <span className="ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SO Turunan <span className="ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Project <span className="ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tgl Pengajuan <span className="ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tgl Pembayaran <span className="ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tgl Expense <span className="ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tgl Expired <span className="ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nominal Pengajuan <span className="ml-1 text-gray-400">↑↓</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item) => (
                  <tr key={item.no} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.noVoucher}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.noSO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.soTurunan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.namaProject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tglPengajuan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tglPembayaran}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tglExpense}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tglExpired}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nominalPengajuan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav
            className="flex items-center justify-between pt-4"
            aria-label="Pagination"
          >
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * showEntries) + 1} to {Math.min(currentPage * showEntries, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={twMerge(
                    "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50",
                    currentPage === index + 1 && "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  )}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </nav>
        </div>
      </div>

      <EntryVoucherModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default GeneralProsesVoucherDashboard;
