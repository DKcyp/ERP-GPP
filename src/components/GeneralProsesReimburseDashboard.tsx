import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Search, Calendar, FileSpreadsheet, FileText, File, Plus, Eye, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import EntryReimburseModal from './EntryReimburseModal'; // Import the new modal

interface ProsesReimburseEntry {
  no: number;
  namaDepartemen: string;
  noReimburse: string;
  tanggal: string;
  noSO: string;
  soTurunan: string;
  namaProyek: string;
  namaPemohon: string;
  nominal: string;
  keperluan: string;
  tanggalPembayaran: string;
  lampiranDokumen: string; // Placeholder for document status/link
}

const dummyData: ProsesReimburseEntry[] = [
  { no: 1, namaDepartemen: 'Operasional', noReimburse: 'R001', tanggal: '2025-01-20', noSO: 'SO001', soTurunan: 'SO001.1', namaProyek: 'Proyek A', namaPemohon: 'Sarah Parker', nominal: 'Rp 150,000', keperluan: 'Pembelian bahan presentasi', tanggalPembayaran: '2025-01-22', lampiranDokumen: 'Ada' },
  { no: 2, namaDepartemen: 'Keuangan', noReimburse: 'R002', tanggal: '2025-01-21', noSO: 'SO002', soTurunan: 'SO002.1', namaProyek: 'Proyek B', namaPemohon: 'David Lee', nominal: 'Rp 200,000', keperluan: 'Transportasi meeting luar kota', tanggalPembayaran: '2025-01-23', lampiranDokumen: 'Ada' },
  { no: 3, namaDepartemen: 'Umum', noReimburse: 'R003', tanggal: '2025-01-22', noSO: 'SO003', soTurunan: 'SO003.1', namaProyek: 'Proyek C', namaPemohon: 'Amanda Clark', nominal: 'Rp 175,000', keperluan: 'Pembelian alat kebersihan kantor', tanggalPembayaran: '2025-01-24', lampiranDokumen: 'Ada' },
  { no: 4, namaDepartemen: 'Manajemen', noReimburse: 'R004', tanggal: '2025-01-23', noSO: 'SO004', soTurunan: 'SO004.1', namaProyek: 'Proyek D', namaPemohon: 'Chris Evans', nominal: 'Rp 180,000', keperluan: 'Biaya konsumsi rapat', tanggalPembayaran: '2025-01-25', lampiranDokumen: 'Ada' },
  { no: 5, namaDepartemen: 'HRD', noReimburse: 'R005', tanggal: '2025-01-24', noSO: 'SO005', soTurunan: 'SO005.1', namaProyek: 'Proyek E', namaPemohon: 'Jessica Taylor', nominal: 'Rp 190,000', keperluan: 'Penggantian biaya parkir', tanggalPembayaran: '2025-01-26', lampiranDokumen: 'Ada' },
  { no: 6, namaDepartemen: 'Marketing', noReimburse: 'R006', tanggal: '2025-01-25', noSO: 'SO006', soTurunan: 'SO006.1', namaProyek: 'Proyek F', namaPemohon: 'Michael Brown', nominal: 'Rp 210,000', keperluan: 'Biaya promosi online', tanggalPembayaran: '2025-01-27', lampiranDokumen: 'Ada' },
  { no: 7, namaDepartemen: 'IT', noReimburse: 'R007', tanggal: '2025-01-26', noSO: 'SO007', soTurunan: 'SO007.1', namaProyek: 'Proyek G', namaPemohon: 'Emily White', nominal: 'Rp 160,000', keperluan: 'Pembelian software lisensi', tanggalPembayaran: '2025-01-28', lampiranDokumen: 'Ada' },
  { no: 8, namaDepartemen: 'Produksi', noReimburse: 'R008', tanggal: '2025-01-27', noSO: 'SO008', soTurunan: 'SO008.1', namaProyek: 'Proyek H', namaPemohon: 'Daniel Green', nominal: 'Rp 250,000', keperluan: 'Perbaikan mesin produksi', tanggalPembayaran: '2025-01-29', lampiranDokumen: 'Ada' },
  { no: 9, namaDepartemen: 'Logistik', noReimburse: 'R009', tanggal: '2025-01-28', noSO: 'SO009', soTurunan: 'SO009.1', namaProyek: 'Proyek I', namaPemohon: 'Olivia Black', nominal: 'Rp 120,000', keperluan: 'Biaya pengiriman barang', tanggalPembayaran: '2025-01-30', lampiranDokumen: 'Ada' },
  { no: 10, namaDepartemen: 'R&D', noReimburse: 'R010', tanggal: '2025-01-29', noSO: 'SO010', soTurunan: 'SO010.1', namaProyek: 'Proyek J', namaPemohon: 'William King', nominal: 'Rp 300,000', keperluan: 'Pembelian alat riset', tanggalPembayaran: '2025-01-31', lampiranDokumen: 'Ada' },
];

const GeneralProsesReimburseDashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'entry' | 'detail'>('entry');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ProsesReimburseEntry; direction: 'ascending' | 'descending' } | null>(null);

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

  const requestSort = (key: keyof ProsesReimburseEntry) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof ProsesReimburseEntry) => {
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

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode('entry');
  };

  const openDetailModal = () => {
    setModalMode('detail');
    setIsModalOpen(true);
  };

  const openEntryModal = () => {
    setModalMode('entry');
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Proses Reimburse</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Reimburse</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari No Reimburse</label>
            <div className="relative">
              <input
                type="text"
                placeholder="R001"
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
          <div className="flex items-end justify-end">
            <button
              onClick={openModal}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah
            </button>
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
                  onClick={() => requestSort('namaDepartemen')}
                >
                  <div className="flex items-center">
                    Nama Departemen {getSortIcon('namaDepartemen')}
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
                  onClick={() => requestSort('tanggal')}
                >
                  <div className="flex items-center">
                    Tanggal {getSortIcon('tanggal')}
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
                    No SO Turunan {getSortIcon('soTurunan')}
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
                  onClick={() => requestSort('nominal')}
                >
                  <div className="flex items-center">
                    Nominal {getSortIcon('nominal')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('keperluan')}
                >
                  <div className="flex items-center">
                    Keperluan {getSortIcon('keperluan')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('tanggalPembayaran')}
                >
                  <div className="flex items-center">
                    Tanggal Pembayaran {getSortIcon('tanggalPembayaran')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lampiran Dokumen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEntries.map((entry) => (
                <tr key={entry.no}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.no}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.namaDepartemen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.noReimburse}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.tanggal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.noSO}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.soTurunan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.namaProyek}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.namaPemohon}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.nominal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.keperluan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.tanggalPembayaran}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={openDetailModal}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Lihat"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={openEntryModal}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </td>
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
      <EntryReimburseModal isOpen={isModalOpen} onRequestClose={closeModal} mode={modalMode} />
    </div>
  );
};

export default GeneralProsesReimburseDashboard;
