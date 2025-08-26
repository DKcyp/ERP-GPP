import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Search, Calendar, Plus, FileText, FileSpreadsheet, FileDown, Eye, History, Edit, Trash2 } from 'lucide-react';

// Sample Data for the table
const cashAdvanceData = [
  {
    id: 1,
    no: 1,
    namaDepartemen: 'Keuangan',
    noCA: 'CA002',
    tanggal: '2025-01-15',
    noSO: 'SO0001',
    noSOTurunan: 'SO0001.1',
    namaProyek: 'Proyek PHE ONWJ',
    namaPemohon: 'Michael Johnson',
    nominal: 'Rp 150,000',
    keperluan: 'Pembelian alat tulis',
    tglPembayaran: '2025-01-16',
    tglLaporanExpense: '2025-01-15',
  },
  {
    id: 2,
    no: 2,
    namaDepartemen: 'Operasional',
    noCA: 'CA001',
    tanggal: '2025-01-16',
    noSO: 'SO0002',
    noSOTurunan: 'SO0002.1',
    namaProyek: 'Proyek OSES',
    namaPemohon: 'Emily Davis',
    nominal: 'Rp 200,000',
    keperluan: 'Transportasi kegiatan',
    tglPembayaran: '2025-01-17',
    tglLaporanExpense: '2025-01-16',
  },
  {
    id: 3,
    no: 3,
    namaDepartemen: 'Pemasaran',
    noCA: 'CA022',
    tanggal: '2025-01-17',
    noSO: 'SO0003',
    noSOTurunan: 'SO0003.1',
    namaProyek: 'Proyek MEDCO',
    namaPemohon: 'William Brown',
    nominal: 'Rp 175,000',
    keperluan: 'Pembelian bahan seminar',
    tglPembayaran: '2025-01-18',
    tglLaporanExpense: '2025-01-17',
  },
  {
    id: 4,
    no: 4,
    namaDepartemen: 'HRD',
    noCA: 'CA012',
    tanggal: '2025-01-18',
    noSO: 'SO0004',
    noSOTurunan: 'SO0004.1',
    namaProyek: 'Proyek C',
    namaPemohon: 'Olivia Martinez',
    nominal: 'Rp 180,000',
    keperluan: 'Biaya konsumsi',
    tglPembayaran: '2025-01-19',
    tglLaporanExpense: '2025-01-18',
  },
  {
    id: 5,
    no: 5,
    namaDepartemen: 'Logistik',
    noCA: 'CA005',
    tanggal: '2025-01-19',
    noSO: 'SO0005',
    noSOTurunan: 'SO0005.1',
    namaProyek: 'Proyek A',
    namaPemohon: 'James Wilson',
    nominal: 'Rp 190,000',
    keperluan: 'Penggantian barang',
    tglPembayaran: '2025-01-20',
    tglLaporanExpense: '2025-01-19',
  },
];

const GeneralProsesCashAdvance: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Cash Advance</h1>
        <button className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-md hover:bg-emerald-600 transition-colors duration-200">
          <Plus className="w-5 h-5 mr-2" /> Tambah
        </button>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="noReimburse" className="block text-sm font-medium text-gray-700 mb-1">Cari No Reimburse</label>
              <div className="relative">
                <input
                  type="text"
                  id="noReimburse"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="CA001"
                />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-600 bg-blue-100 rounded-r-lg hover:bg-blue-200 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="noSOTurunan" className="block text-sm font-medium text-gray-700 mb-1">Cari No SO Turunan</label>
              <div className="relative">
                <input
                  type="text"
                  id="noSOTurunan"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="SO001.1"
                />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-600 bg-blue-100 rounded-r-lg hover:bg-blue-200 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="noSO" className="block text-sm font-medium text-gray-700 mb-1">Cari No SO</label>
              <div className="relative">
                <input
                  type="text"
                  id="noSO"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="SO001"
                />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-600 bg-blue-100 rounded-r-lg hover:bg-blue-200 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="namaProject" className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Project</label>
              <div className="relative">
                <input
                  type="text"
                  id="namaProject"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="PHE ONWJ"
                />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-600 bg-blue-100 rounded-r-lg hover:bg-blue-200 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Periode and Search Button */}
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  id="startDate"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-6 md:pt-0">
              <span className="text-gray-700 text-sm">s.d</span>
              <div className="relative flex-1">
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  id="endDate"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 w-full md:w-auto">
            Search
          </button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end space-x-3 mb-6">
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 text-sm">
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel
        </button>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 text-sm">
          <FileText className="w-4 h-4 mr-2" /> Export CSV
        </button>
        <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 text-sm">
          <FileDown className="w-4 h-4 mr-2" /> Export PDF
        </button>
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        {/* Table Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <span>Show</span>
            <select
              className="border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Departemen</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No CA</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No SO</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No SO Turunan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Proyek</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pemohon</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keperluan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Pembayaran</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Laporan Expense</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lampiran Dokumen</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cashAdvanceData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.no}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.namaDepartemen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.noCA}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tanggal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.noSO}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.noSOTurunan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.namaProyek}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.namaPemohon}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nominal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.keperluan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tglPembayaran}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tglLaporanExpense}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors duration-200">
                        <History className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing 1 to {cashAdvanceData.length} of {cashAdvanceData.length} entries
          </div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button
              aria-current="page"
              className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              1
            </button>
            <button className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default GeneralProsesCashAdvance;
