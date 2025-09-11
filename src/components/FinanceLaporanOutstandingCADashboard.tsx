import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Search, Calendar, FileSpreadsheet, FileText, File, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import Modal from 'react-modal';

interface CashAdvanceEntry {
  no: number;
  namaDivisi: string;
  nominalOCA: string;
  statusOCA: string;
}

const dummyData: CashAdvanceEntry[] = [
  { no: 1, namaDivisi: 'Keuangan', nominalOCA: 'Rp 12,000,000', statusOCA: 'Outstanding' },
  { no: 2, namaDivisi: 'Operasional', nominalOCA: 'Rp 18,500,000', statusOCA: 'Outstanding' },
  { no: 3, namaDivisi: 'Pemasaran', nominalOCA: 'Rp 22,000,000', statusOCA: 'Outstanding' },
  { no: 4, namaDivisi: 'HRD', nominalOCA: 'Rp 30,000,000', statusOCA: 'Outstanding' },
  { no: 5, namaDivisi: 'Logistik', nominalOCA: 'Rp 15,000,000', statusOCA: 'Outstanding' },
];

const FinanceLaporanOutstandingCADashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const entriesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CashAdvanceEntry; direction: 'ascending' | 'descending' } | null>(null);
  const [data, setData] = useState<CashAdvanceEntry[]>(dummyData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formNamaDivisi, setFormNamaDivisi] = useState('');
  const [formNominalOCA, setFormNominalOCA] = useState('');
  const [formStatusOCA, setFormStatusOCA] = useState('Outstanding');

  useEffect(() => {
    // Ensure accessibility for react-modal
    try {
      Modal.setAppElement('#root');
    } catch {
      // no-op if root not found
    }
  }, []);

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [sortConfig, data]);

  const requestSort = (key: keyof CashAdvanceEntry) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof CashAdvanceEntry) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNo = data.length > 0 ? Math.max(...data.map((d) => d.no)) + 1 : 1;
    const newEntry: CashAdvanceEntry = {
      no: nextNo,
      namaDivisi: formNamaDivisi || '-',
      nominalOCA: formNominalOCA || 'Rp 0',
      statusOCA: formStatusOCA || 'Outstanding',
    };
    setData((prev) => [newEntry, ...prev]);
    // reset form
    setFormNamaDivisi('');
    setFormNominalOCA('');
    setFormStatusOCA('Outstanding');
    closeModal();
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

        <div className="flex justify-between items-center mb-6">
          <button onClick={openModal} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            <Plus className="h-5 w-5 mr-2" /> Tambah
          </button>
          <div className="flex items-center space-x-2">
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
        </div>

        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('no')}>
                  <div className="flex items-center">No {getSortIcon('no')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('namaDivisi')}>
                  <div className="flex items-center">Nama Divisi {getSortIcon('namaDivisi')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('nominalOCA')}>
                  <div className="flex items-center">Nominal OCA {getSortIcon('nominalOCA')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('statusOCA')}>
                  <div className="flex items-center">Status OCA {getSortIcon('statusOCA')}</div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEntries.map((entry) => (
                <tr key={entry.no} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.no}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.namaDivisi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.nominalOCA}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.statusOCA}</td>
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
    {/* Modal Tambah */}
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Tambah Outstanding CA"
      className="max-w-lg w-[90%] mx-auto mt-24 bg-white rounded-lg shadow-lg p-6 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Tambah Outstanding CA</h3>
      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Divisi</label>
          <input
            type="text"
            value={formNamaDivisi}
            onChange={(e) => setFormNamaDivisi(e.target.value)}
            placeholder="Keuangan"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nominal OCA</label>
          <input
            type="text"
            value={formNominalOCA}
            onChange={(e) => setFormNominalOCA(e.target.value)}
            placeholder="Rp 0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status OCA</label>
          <select
            value={formStatusOCA}
            onChange={(e) => setFormStatusOCA(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Outstanding">Outstanding</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
        </div>
      </form>
    </Modal>
    </div>
  );
};

export default FinanceLaporanOutstandingCADashboard;
