import React, { useState, useEffect } from 'react';
import { FaSearch, FaFileExcel, FaFileCsv, FaFilePdf, FaHistory, FaClock } from 'react-icons/fa';
import { IzinAlatData, PerpanjangIzinFormData, DetailIzinAlatFormData, HistoryIzinEntry } from '../types';
import PerpanjangIzinModal from './PerpanjangIzinModal';
import DetailIzinAlatModal from './DetailIzinAlatModal';
import HistoryIzinModal from './HistoryIzinModal';

const mockIzinAlatData: IzinAlatData[] = [
  {
    id: '1',
    no: 1,
    kodeBarang: 'EXC-001',
    namaAlat: 'Excavator',
    noSeri: '12345-EXC',
    jenisPerizinan: 'STNK',
    tanggalBerlaku: '2024-01-01',
    tanggalExp: '2026-03-20',
    status: 'Aktif',
  },
  {
    id: '2',
    no: 2,
    kodeBarang: 'CRN-001',
    namaAlat: 'Crane',
    noSeri: '12345-CRN',
    jenisPerizinan: 'SLO',
    tanggalBerlaku: '2024-02-15',
    tanggalExp: '2025-02-15', // Soon to expire
    status: 'Segera Habis',
  },
  {
    id: '3',
    no: 3,
    kodeBarang: 'TRK-001',
    namaAlat: 'Truk',
    noSeri: '12345-TRK',
    jenisPerizinan: 'Izin Angkut',
    tanggalBerlaku: '2023-05-10',
    tanggalExp: '2024-05-10', // Expired
    status: 'Expired',
  },
  {
    id: '4',
    no: 4,
    kodeBarang: 'DZR-001',
    namaAlat: 'Dozer',
    noSeri: '12345-DZR',
    jenisPerizinan: 'Izin Operasional',
    tanggalBerlaku: '2024-06-01',
    tanggalExp: '2025-06-01',
    status: 'Menunggu Persetujuan',
  },
  {
    id: '5',
    no: 5,
    kodeBarang: 'DMP-001',
    namaAlat: 'Dump Truck',
    noSeri: '12345-DMP',
    jenisPerizinan: 'STNK',
    tanggalBerlaku: '2024-07-01',
    tanggalExp: '2025-07-01',
    status: 'Disetujui',
  },
  {
    id: '6',
    no: 6,
    kodeBarang: 'FOR-001',
    namaAlat: 'Forklift',
    noSeri: '12345-FOR',
    jenisPerizinan: 'SIO',
    tanggalBerlaku: '2024-08-01',
    tanggalExp: '2025-08-01',
    status: 'Izin Tersedia',
  },
  {
    id: '7',
    no: 7,
    kodeBarang: 'GRD-001',
    namaAlat: 'Grader',
    noSeri: '12345-GRD',
    jenisPerizinan: 'SIM',
    tanggalBerlaku: '2024-09-01',
    tanggalExp: '2024-10-01', // Segera Habis
    status: 'Segera Habis',
  },
  {
    id: '8',
    no: 8,
    kodeBarang: 'WHL-001',
    namaAlat: 'Wheel Loader',
    noSeri: '12345-WHL',
    jenisPerizinan: 'SIO',
    tanggalBerlaku: '2023-01-01',
    tanggalExp: '2024-01-01', // Expired
    status: 'Expired',
  },
];

const mockHistoryData: HistoryIzinEntry[] = [
  {
    no: 1,
    tanggalPerpanjang: '20-01-2025',
    tanggalExp: '20-01-2026',
    dokumenUrl: '#',
    catatan: 'Perpanjangan Tahunan',
  },
  {
    no: 2,
    tanggalPerpanjang: '20-01-2024',
    tanggalExp: '20-01-2025',
    dokumenUrl: '#',
    catatan: 'Perpanjangan Tahunan',
  },
];

const MonitoringPerizinanDashboard: React.FC = () => {
  const [izinAlatData, setIzinAlatData] = useState<IzinAlatData[]>(mockIzinAlatData);
  const [searchTermNoSeri, setSearchTermNoSeri] = useState('');
  const [searchTermKodeBarang, setSearchTermKodeBarang] = useState('');
  const [searchTermNamaAlat, setSearchTermNamaAlat] = useState('');
  const [selectedJenisPerizinan, setSelectedJenisPerizinan] = useState('');
  const [selectedStatusIzin, setSelectedStatusIzin] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isPerpanjangModalOpen, setIsPerpanjangModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedIzinAlat, setSelectedIzinAlat] = useState<IzinAlatData | null>(null);

  const jenisPerizinanOptions = Array.from(new Set(mockIzinAlatData.map((item) => item.jenisPerizinan)));
  const statusIzinOptions = Array.from(new Set(mockIzinAlatData.map((item) => item.status)));

  const filteredData = izinAlatData.filter((item) => {
    const matchesNoSeri = item.noSeri.toLowerCase().includes(searchTermNoSeri.toLowerCase());
    const matchesKodeBarang = item.kodeBarang.toLowerCase().includes(searchTermKodeBarang.toLowerCase());
    const matchesNamaAlat = item.namaAlat.toLowerCase().includes(searchTermNamaAlat.toLowerCase());
    const matchesJenisPerizinan = selectedJenisPerizinan ? item.jenisPerizinan === selectedJenisPerizinan : true;
    const matchesStatusIzin = selectedStatusIzin ? item.status === selectedStatusIzin : true;
    return matchesNoSeri && matchesKodeBarang && matchesNamaAlat && matchesJenisPerizinan && matchesStatusIzin;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusBadgeClass = (status: IzinAlatData['status']) => {
    switch (status) {
      case 'Aktif':
      case 'Izin Tersedia': // Matches green in image
        return 'bg-success text-white';
      case 'Segera Habis':
      case 'Menunggu Persetujuan': // Matches yellow/orange in image
        return 'bg-warning text-white';
      case 'Expired':
        return 'bg-error text-white';
      case 'Disetujui': // Matches light blue in image
        return 'bg-secondary text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const handlePerpanjangClick = (item: IzinAlatData) => {
    setSelectedIzinAlat(item);
    setIsPerpanjangModalOpen(true);
  };

  const handleDetailClick = (item: IzinAlatData) => {
    setSelectedIzinAlat(item);
    setIsDetailModalOpen(true);
  };

  const handleHistoryClick = (item: IzinAlatData) => {
    setSelectedIzinAlat(item);
    setIsHistoryModalOpen(true);
  };

  const handlePerpanjangSubmit = (data: PerpanjangIzinFormData) => {
    console.log('Perpanjang Izin Submitted:', data);
    // Implement actual submission logic here
  };

  const handleDetailSubmit = (data: DetailIzinAlatFormData) => {
    console.log('Detail Izin Submitted:', data);
    // Implement actual submission logic here
  };

  return (
    <div className="min-h-screen bg-background p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-text mb-8">Monitoring Perizinan</h1>

      {/* Filter and Search Section */}
      <div className="bg-surface p-6 rounded-lg shadow-md mb-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <label htmlFor="searchNoSeri" className="block text-sm font-medium text-textSecondary mb-1">
              Cari No Seri
            </label>
            <input
              type="text"
              id="searchNoSeri"
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-background border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
              placeholder="12345-CRN"
              value={searchTermNoSeri}
              onChange={(e) => setSearchTermNoSeri(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary mt-3" />
          </div>
          <div className="relative">
            <label htmlFor="searchKodeBarang" className="block text-sm font-medium text-textSecondary mb-1">
              Cari Kode Barang
            </label>
            <input
              type="text"
              id="searchKodeBarang"
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-background border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
              placeholder="BRG001"
              value={searchTermKodeBarang}
              onChange={(e) => setSearchTermKodeBarang(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary mt-3" />
          </div>
          <div className="relative">
            <label htmlFor="searchNamaAlat" className="block text-sm font-medium text-textSecondary mb-1">
              Cari Nama Alat
            </label>
            <input
              type="text"
              id="searchNamaAlat"
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-background border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
              placeholder="Truk"
              value={searchTermNamaAlat}
              onChange={(e) => setSearchTermNamaAlat(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary mt-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="jenisPerizinan" className="block text-sm font-medium text-textSecondary mb-1">
              Jenis Perizinan
            </label>
            <select
              id="jenisPerizinan"
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
              value={selectedJenisPerizinan}
              onChange={(e) => setSelectedJenisPerizinan(e.target.value)}
            >
              <option value="">--Pilih Jenis Perizinan--</option>
              {jenisPerizinanOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="statusIzin" className="block text-sm font-medium text-textSecondary mb-1">
              Status Izin
            </label>
            <select
              id="statusIzin"
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
              value={selectedStatusIzin}
              onChange={(e) => setSelectedStatusIzin(e.target.value)}
            >
              <option value="">--Pilih Status Izin--</option>
              {statusIzinOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end space-x-3 mb-6">
        <button className="flex items-center px-4 py-2 rounded-lg bg-success text-white hover:bg-success/90 transition-colors duration-200 shadow-md">
          <FaFileExcel className="mr-2" /> Export Excel
        </button>
        <button className="flex items-center px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors duration-200 shadow-md">
          <FaFileCsv className="mr-2" /> Export CSV
        </button>
        <button className="flex items-center px-4 py-2 rounded-lg bg-error text-white hover:bg-error/90 transition-colors duration-200 shadow-md">
          <FaFilePdf className="mr-2" /> Export PDF
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-textSecondary text-sm">Show</span>
            <select
              className="px-3 py-1 rounded-lg bg-background border border-border text-text text-sm focus:ring-primary focus:border-primary transition-all duration-200"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-textSecondary text-sm">entries</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Kode Barang
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Nama Alat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  No Seri
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Jenis Perizinan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Tanggal Exp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary text-center">
                    Tidak ada data monitoring perizinan.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-background transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{item.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{item.kodeBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{item.namaAlat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{item.noSeri}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{item.jenisPerizinan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{item.tanggalExp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePerpanjangClick(item)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200"
                        >
                          + Perpanjang
                        </button>
                        <button
                          onClick={() => handleDetailClick(item)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                        >
                          Detail Izin
                        </button>
                        <button
                          onClick={() => handleHistoryClick(item)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-textSecondary hover:bg-textSecondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-textSecondary transition-colors duration-200"
                        >
                          <FaClock className="mr-1" /> History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-textSecondary">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
          </div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-border bg-background text-sm font-medium text-textSecondary hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium transition-colors duration-200 ${
                  currentPage === index + 1
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-background text-textSecondary hover:bg-border'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-border bg-background text-sm font-medium text-textSecondary hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      {/* Modals */}
      {selectedIzinAlat && (
        <>
          <PerpanjangIzinModal
            isOpen={isPerpanjangModalOpen}
            onClose={() => setIsPerpanjangModalOpen(false)}
            initialData={{
              namaAlat: selectedIzinAlat.namaAlat,
              kodeBarang: selectedIzinAlat.kodeBarang,
              noSeri: selectedIzinAlat.noSeri,
              jenisPerizinan: selectedIzinAlat.jenisPerizinan,
            }}
            onSubmit={handlePerpanjangSubmit}
          />
          <DetailIzinAlatModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            initialData={{
              kodeBarang: selectedIzinAlat.kodeBarang,
              namaAlat: selectedIzinAlat.namaAlat,
              noSeri: selectedIzinAlat.noSeri,
              jenisPerizinan: selectedIzinAlat.jenisPerizinan,
              noDokumen: 'DOC-' + selectedIzinAlat.id.padStart(3, '0'), // Example
              tanggalMulaiBerlaku: selectedIzinAlat.tanggalBerlaku,
              tanggalBerakhir: selectedIzinAlat.tanggalExp,
            }}
            onSubmit={handleDetailSubmit}
          />
          <HistoryIzinModal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            historyData={mockHistoryData} // Using mock history data for now
          />
        </>
      )}
    </div>
  );
};

export default MonitoringPerizinanDashboard;
