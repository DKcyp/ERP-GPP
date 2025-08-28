import React, { useState } from 'react';
import { Warehouse, Clock, Search, Calendar, FileText, FileSpreadsheet, FileDown, ChevronUp, ChevronDown, ThumbsUp } from 'lucide-react';
import { TandaTerimaPODariGudangData, TandaTerimaGudangDetailData } from '../types'; // Import the new interface
import TandaTerimaGudangModal from './TandaTerimaGudangModal'; // Import the new modal component

const dummyTandaTerimaData: TandaTerimaPODariGudangData[] = [
  { id: '1', no: 1, noPO: 'PO001', noFaktur: 'F001', tglFaktur: '10-02-2024', vendor: 'PT. Safety Indonesia', penerima: 'Muh Reza', verifikasi: true },
  { id: '2', no: 2, noPO: 'PO002', noFaktur: 'F002', tglFaktur: '11-02-2024', vendor: 'CV. Jaya Mandiri', penerima: 'Rizky Ramadhan', verifikasi: true },
  { id: '3', no: 3, noPO: 'PO003', noFaktur: 'F003', tglFaktur: '12-02-2024', vendor: 'PT. Makmur Sejahtera', penerima: 'Fajar Prasetyo', verifikasi: false },
  { id: '4', no: 4, noPO: 'PO004', noFaktur: 'F004', tglFaktur: '13-02-2024', vendor: 'CV. Berkah Abadi', penerima: 'Dina Kartika', verifikasi: true },
  { id: '5', no: 5, noPO: 'PO005', noFaktur: 'F005', tglFaktur: '14-02-2024', vendor: 'PT. Sumber Rezeki', penerima: 'Bagus Saputra', verifikasi: false },
];

// Dummy data for the modal details
const dummyTandaTerimaDetailData: { [key: string]: TandaTerimaGudangDetailData } = {
  '1': {
    noPO: 'PO001',
    noFaktur: 'F001',
    tglFaktur: '10-02-2024',
    penerima: 'Muh Reza',
    tanggalVerifikasi: '2025-03-03',
    namaVerifikasi: 'Admin Gudang A',
    unduhDokumen: 'F001_doc.pdf',
    items: [
      { kodeBarang: 'GBP001', namaBarang: 'Komputer PC Dell OptiPlex 3090', jumlah: 10, diterima: 10, satuan: 'Unit', hargaSatuan: 12500000, hargaGross: 125000000 },
      { kodeBarang: 'GBP002', namaBarang: 'Printer HP LaserJet Pro M404dn', jumlah: 5, diterima: 5, satuan: 'Unit', hargaSatuan: 4200000, hargaGross: 21000000 },
      { kodeBarang: 'GBP003', namaBarang: 'Server Rack Dell PowerEdge R450', jumlah: 2, diterima: 2, satuan: 'Unit', hargaSatuan: 35000000, hargaGross: 70000000 },
      { kodeBarang: 'GBP004', namaBarang: 'Switch Cisco Catalyst 2960', jumlah: 8, diterima: 8, satuan: 'Unit', hargaSatuan: 7500000, hargaGross: 60000000 },
    ],
    grandTotal: 276000000,
  },
  '2': {
    noPO: 'PO002',
    noFaktur: 'F002',
    tglFaktur: '11-02-2024',
    penerima: 'Rizky Ramadhan',
    tanggalVerifikasi: '2025-03-04',
    namaVerifikasi: 'Admin Gudang B',
    unduhDokumen: 'F002_doc.pdf',
    items: [
      { kodeBarang: 'GBP005', namaBarang: 'Monitor Dell UltraSharp U2723QE', jumlah: 15, diterima: 15, satuan: 'Unit', hargaSatuan: 7000000, hargaGross: 105000000 },
      { kodeBarang: 'GBP006', namaBarang: 'Keyboard Logitech MX Keys', jumlah: 20, diterima: 20, satuan: 'Unit', hargaSatuan: 1500000, hargaGross: 30000000 },
    ],
    grandTotal: 135000000,
  },
  '3': {
    noPO: 'PO003',
    noFaktur: 'F003',
    tglFaktur: '12-02-2024',
    penerima: 'Fajar Prasetyo',
    tanggalVerifikasi: '', // Not yet verified
    namaVerifikasi: '',
    unduhDokumen: 'F003_doc.pdf',
    items: [
      { kodeBarang: 'GBP007', namaBarang: 'Mouse Logitech MX Master 3S', jumlah: 25, diterima: 25, satuan: 'Unit', hargaSatuan: 1200000, hargaGross: 30000000 },
    ],
    grandTotal: 30000000,
  },
  '4': {
    noPO: 'PO004',
    noFaktur: 'F004',
    tglFaktur: '13-02-2024',
    penerima: 'Dina Kartika',
    tanggalVerifikasi: '2025-03-05',
    namaVerifikasi: 'Admin Gudang C',
    unduhDokumen: 'F004_doc.pdf',
    items: [
      { kodeBarang: 'GBP008', namaBarang: 'Webcam Logitech C920s', jumlah: 10, diterima: 10, satuan: 'Unit', hargaSatuan: 800000, hargaGross: 8000000 },
    ],
    grandTotal: 8000000,
  },
  '5': {
    noPO: 'PO005',
    noFaktur: 'F005',
    tglFaktur: '14-02-2024',
    penerima: 'Bagus Saputra',
    tanggalVerifikasi: '', // Not yet verified
    namaVerifikasi: '',
    unduhDokumen: 'F005_doc.pdf',
    items: [
      { kodeBarang: 'GBP009', namaBarang: 'Headset Jabra Evolve2 65', jumlah: 7, diterima: 7, satuan: 'Unit', hargaSatuan: 3000000, hargaGross: 21000000 },
    ],
    grandTotal: 21000000,
  },
};


const GudangPenerimaanDashboard: React.FC = () => {
  const [searchNoPO, setSearchNoPO] = useState('');
  const [searchNoFaktur, setSearchNoFaktur] = useState('');
  const [searchNamaVendor, setSearchNamaVendor] = useState('');
  const [periodeStart, setPeriodeStart] = useState('2025-03-03'); // Changed to YYYY-MM-DD for date input
  const [periodeEnd, setPeriodeEnd] = useState('2025-03-03');   // Changed to YYYY-MM-DD for date input
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTandaTerimaDetail, setSelectedTandaTerimaDetail] = useState<TandaTerimaGudangDetailData | null>(null);

  const filteredData = dummyTandaTerimaData.filter(item =>
    item.noPO.toLowerCase().includes(searchNoPO.toLowerCase()) &&
    item.noFaktur.toLowerCase().includes(searchNoFaktur.toLowerCase()) &&
    item.vendor.toLowerCase().includes(searchNamaVendor.toLowerCase())
    // Add date range filtering logic here if needed
  );

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleOpenModal = (item: TandaTerimaPODariGudangData) => {
    // In a real application, you would fetch the detailed data here
    // For now, we use dummy data based on the item's ID
    const detailData = dummyTandaTerimaDetailData[item.id];
    if (detailData) {
      setSelectedTandaTerimaDetail({
        ...detailData,
        noPO: item.noPO, // Ensure consistency with table data
        noFaktur: item.noFaktur,
        tglFaktur: item.tglFaktur,
        penerima: item.penerima,
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTandaTerimaDetail(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-100 via-blue-50 to-white border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                TANDA TERIMA PO DARI GUDANG
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Pengadaan</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Penerimaan Barang</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Gudang</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Cari No PO */}
            <div className="relative">
              <label htmlFor="searchNoPO" className="block text-sm font-medium text-gray-700 mb-2">Cari No PO</label>
              <input
                type="text"
                id="searchNoPO"
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                placeholder="PO0012"
                value={searchNoPO}
                onChange={(e) => setSearchNoPO(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {/* Cari No Faktur */}
            <div className="relative">
              <label htmlFor="searchNoFaktur" className="block text-sm font-medium text-gray-700 mb-2">Cari No Faktur</label>
              <input
                type="text"
                id="searchNoFaktur"
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                placeholder="F001"
                value={searchNoFaktur}
                onChange={(e) => setSearchNoFaktur(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {/* Cari Nama Vendor */}
            <div className="relative">
              <label htmlFor="searchNamaVendor" className="block text-sm font-medium text-gray-700 mb-2">Cari Nama Vendor</label>
              <input
                type="text"
                id="searchNamaVendor"
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                placeholder="Cahaya Abadi"
                value={searchNamaVendor}
                onChange={(e) => setSearchNamaVendor(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-4">
            {/* Periode Start */}
            <div className="relative w-full md:w-auto flex-grow">
              <label htmlFor="periodeStart" className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
              <input
                type="date"
                id="periodeStart"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                value={periodeStart}
                onChange={(e) => setPeriodeStart(e.target.value)}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            <span className="text-gray-600 text-sm mb-2 md:mb-0">s.d</span>
            {/* Periode End */}
            <div className="relative w-full md:w-auto flex-grow">
              <input
                type="date"
                id="periodeEnd"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                value={periodeEnd}
                onChange={(e) => setPeriodeEnd(e.target.value)}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {/* Search Button */}
            <button className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-300">
              Search
            </button>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end space-x-3 mb-6">
          <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-xl shadow-md hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5" />
            <span>Export Excel</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
          <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-xl shadow-md hover:bg-red-700 transition-colors duration-300 flex items-center space-x-2">
            <FileDown className="h-5 w-5" />
            <span>Export PDF</span>
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {/* Show entries dropdown */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="showEntries" className="text-gray-700">Show</label>
            <select
              id="showEntries"
              className="px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-gray-700">entries</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      No
                      <div className="ml-1 flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronDown className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      No PO
                      <div className="ml-1 flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronDown className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      No Faktur
                      <div className="ml-1 flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronDown className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Tgl Faktur
                      <div className="ml-1 flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronDown className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Vendor
                      <div className="ml-1 flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronDown className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Penerima
                      <div className="ml-1 flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronDown className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Verifikasi
                      <div className="ml-1 flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronDown className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.noPO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.noFaktur}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tglFaktur}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.penerima}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className={`p-2 rounded-full ${item.verifikasi ? 'bg-blue-500' : 'bg-gray-400'} text-white hover:opacity-80 transition-colors duration-200 shadow-md`}
                        title={item.verifikasi ? 'Verified' : 'Not Verified'}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">No entries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredData.length)} of {filteredData.length} entries
            </div>
            <nav className="flex space-x-2" aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors duration-300 ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Tanda Terima Gudang Modal */}
      <TandaTerimaGudangModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={selectedTandaTerimaDetail}
      />
    </div>
  );
};

export default GudangPenerimaanDashboard;
