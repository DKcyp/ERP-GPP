import React, { useState } from 'react';
import {
  IzinAlatData,
  HistoryIzinEntry,
  PerpanjangIzinFormData,
  DetailIzinAlatFormData,
} from '../types';
import HistoryIzinModal from './HistoryIzinModal';
import PerpanjangIzinModal from './PerpanjangIzinModal';
import DetailIzinAlatModal from './DetailIzinAlatModal';

const MonitoringIzinAlatDashboard: React.FC = () => {
  const [izinAlatData, setIzinAlatData] = useState<IzinAlatData[]>([
    {
      id: '1',
      no: 1,
      kodeBarang: 'EXC-001',
      namaAlat: 'Excavator',
      noSeri: '12345-EXC',
      jenisPerizinan: 'SLO',
      tanggalBerlaku: '10-03-2025',
      tanggalExp: '10-03-2026',
      status: 'Aktif',
    },
    {
      id: '2',
      no: 2,
      kodeBarang: 'CRN-001',
      namaAlat: 'Crane',
      noSeri: '12345-CRN',
      jenisPerizinan: 'SLO',
      tanggalBerlaku: '10-03-2024',
      tanggalExp: '10-03-2025',
      status: 'Segera Habis',
    },
    {
      id: '3',
      no: 3,
      kodeBarang: 'TRK-001',
      namaAlat: 'Truk',
      noSeri: '12345-TRK',
      jenisPerizinan: 'Izin Angkut',
      tanggalBerlaku: '20-01-2024',
      tanggalExp: '20-01-2025',
      status: 'Expired',
    },
    {
      id: '4',
      no: 4,
      kodeBarang: 'CRN-001',
      namaAlat: 'Crane',
      noSeri: '12345-CRN',
      jenisPerizinan: 'SLO',
      tanggalBerlaku: '14-03-2023',
      tanggalExp: '14-03-2026',
      status: 'Menunggu Persetujuan',
    },
    {
      id: '5',
      no: 5,
      kodeBarang: 'TRK-001',
      namaAlat: 'Truk',
      noSeri: '12345-TRK',
      jenisPerizinan: 'Izin Angkut',
      tanggalBerlaku: '09-02-2027',
      tanggalExp: '09-02-2027',
      status: 'Disetujui',
    },
    {
      id: '6',
      no: 6,
      kodeBarang: 'DZR-001',
      namaAlat: 'Dozer',
      noSeri: '12345-DZR',
      jenisPerizinan: 'Izin Operasional',
      tanggalBerlaku: '03-02-2025',
      tanggalExp: '03-02-2026',
      status: 'Izin Tersedia',
    },
    {
      id: '7',
      no: 7,
      kodeBarang: 'DMF-001',
      namaAlat: 'Dump Truck',
      noSeri: '12345-DMP',
      jenisPerizinan: 'STNK',
      tanggalBerlaku: '10-04-2024',
      tanggalExp: '10-04-2026',
      status: 'Aktif',
    },
  ]);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPerpanjangModalOpen, setIsPerpanjangModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedIzin, setSelectedIzin] = useState<IzinAlatData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryIzinEntry[]>([]);

  const handleOpenHistoryModal = (izin: IzinAlatData) => {
    setSelectedIzin(izin);
    // Mock history data for demonstration
    setHistoryData([
      { no: 1, tanggalPerpanjang: '20-01-2025', tanggalExp: '20-01-2026', dokumenUrl: '#', catatan: 'Perpanjangan Tahunan' },
      { no: 2, tanggalPerpanjang: '20-01-2024', tanggalExp: '20-01-2025', dokumenUrl: '#', catatan: 'Perpanjangan Tahunan' },
    ]);
    setIsHistoryModalOpen(true);
  };

  const handleOpenPerpanjangModal = (izin: IzinAlatData) => {
    setSelectedIzin(izin);
    setIsPerpanjangModalOpen(true);
  };

  const handleOpenDetailModal = (izin: IzinAlatData) => {
    setSelectedIzin(izin);
    setIsDetailModalOpen(true);
  };

  const handlePerpanjangSubmit = (data: PerpanjangIzinFormData) => {
    console.log('Submit Perpanjang Izin:', data);
    // In a real app, you would send this data to your backend
    // And then update the izinAlatData state
  };

  const handleDetailSubmit = (data: DetailIzinAlatFormData) => {
    console.log('Submit Detail Izin Alat:', data);
    // In a real app, you would send this data to your backend
    // And then update the izinAlatData state
  };

  const getStatusClasses = (status: IzinAlatData['status']) => {
    switch (status) {
      case 'Aktif':
        return 'bg-success/20 text-success';
      case 'Segera Habis':
        return 'bg-warning/20 text-warning';
      case 'Expired':
        return 'bg-error/20 text-error';
      case 'Menunggu Persetujuan':
        return 'bg-blue-500/20 text-blue-500'; // Using a custom blue for this status
      case 'Disetujui':
        return 'bg-primary/20 text-primary';
      case 'Izin Tersedia':
        return 'bg-green-500/20 text-green-500'; // Another custom green
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Search and filter states
  const [searchKodeBarang, setSearchKodeBarang] = useState('');
  const [searchTanggalExp, setSearchTanggalExp] = useState('');
  const [statusAlatFilter, setStatusAlatFilter] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = izinAlatData.filter((item) => {
    const matchesKodeBarang = item.kodeBarang.toLowerCase().includes(searchKodeBarang.toLowerCase());
    const matchesTanggalExp = searchTanggalExp
      ? item.tanggalExp.includes(searchTanggalExp) // Simple string match for now, can be improved with date parsing
      : true;
    const matchesStatus = statusAlatFilter ? item.status === statusAlatFilter : true;
    return matchesKodeBarang && matchesTanggalExp && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / showEntries);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showEntries,
    currentPage * showEntries
  );

  return (
    <div className="min-h-screen bg-background p-8 text-text">
      <h1 className="text-3xl font-bold text-primary mb-8">Monitoring Izin Alat</h1>

      {/* Search and Filter Section */}
      <div className="bg-surface rounded-xl shadow-lg p-6 mb-8 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="searchKodeBarang" className="block text-sm font-medium text-textSecondary mb-1">
              Cari Kode Barang
            </label>
            <div className="relative">
              <input
                type="text"
                id="searchKodeBarang"
                value={searchKodeBarang}
                onChange={(e) => setSearchKodeBarang(e.target.value)}
                placeholder="BRG001"
                className="w-full px-4 py-2 pl-10 rounded-lg bg-surface border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="searchTanggalExp" className="block text-sm font-medium text-textSecondary mb-1">
              Cari Tanggal Exp
            </label>
            <div className="relative">
              <input
                type="date" // Changed to type="date" for better UX
                id="searchTanggalExp"
                value={searchTanggalExp}
                onChange={(e) => setSearchTanggalExp(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg bg-surface border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="statusAlatFilter" className="block text-sm font-medium text-textSecondary mb-1">
              Status Alat
            </label>
            <select
              id="statusAlatFilter"
              value={statusAlatFilter}
              onChange={(e) => setStatusAlatFilter(e.target.value as IzinAlatData['status'])}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
            >
              <option value="">--Pilih Status Alat--</option>
              <option value="Aktif">Aktif</option>
              <option value="Segera Habis">Segera Habis</option>
              <option value="Expired">Expired</option>
              <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Izin Tersedia">Izin Tersedia</option>
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export Excel
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export CSV
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-surface rounded-xl shadow-lg p-6 border border-border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-textSecondary text-sm">Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(Number(e.target.value))}
              className="px-3 py-1.5 rounded-md bg-surface border border-border text-text text-sm focus:ring-primary focus:border-primary"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
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
                  Tanggal Berlaku
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
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary text-center">
                    Tidak ada data izin alat yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((izin) => (
                  <tr key={izin.id} className="hover:bg-background transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{izin.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{izin.kodeBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{izin.namaAlat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{izin.noSeri}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{izin.jenisPerizinan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{izin.tanggalBerlaku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{izin.tanggalExp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(izin.status)}`}
                      >
                        {izin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {(izin.status === 'Segera Habis' || izin.status === 'Expired' || izin.status === 'Menunggu Persetujuan') && (
                          <button
                            onClick={() => handleOpenPerpanjangModal(izin)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200"
                          >
                            + Perpanjang
                          </button>
                        )}
                        {izin.status === 'Izin Tersedia' && (
                          <button
                            onClick={() => handleOpenDetailModal(izin)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                          >
                            + Detail Izin
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenHistoryModal(izin)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-text bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
                        >
                          <svg className="-ml-0.5 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          History
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
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-textSecondary">
            Showing {(currentPage - 1) * showEntries + 1} to {Math.min(currentPage * showEntries, filteredData.length)} of {filteredData.length} entries
          </div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-surface text-sm font-medium text-textSecondary hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium ${
                  currentPage === page
                    ? 'z-10 bg-primary border-primary text-white'
                    : 'bg-surface text-textSecondary hover:bg-background'
                } transition-colors duration-200`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-surface text-sm font-medium text-textSecondary hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      {/* Modals */}
      <HistoryIzinModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        historyData={historyData}
      />

      {selectedIzin && (
        <PerpanjangIzinModal
          isOpen={isPerpanjangModalOpen}
          onClose={() => setIsPerpanjangModalOpen(false)}
          initialData={{
            namaAlat: selectedIzin.namaAlat,
            kodeBarang: selectedIzin.kodeBarang,
            noSeri: selectedIzin.noSeri,
            jenisPerizinan: selectedIzin.jenisPerizinan,
          }}
          onSubmit={handlePerpanjangSubmit}
        />
      )}

      {selectedIzin && (
        <DetailIzinAlatModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          initialData={{
            kodeBarang: selectedIzin.kodeBarang,
            namaAlat: selectedIzin.namaAlat,
            noSeri: selectedIzin.noSeri,
            jenisPerizinan: selectedIzin.jenisPerizinan,
            // Mock other fields for detail modal
            noDokumen: 'DOC-0012',
            tanggalMulaiBerlaku: '2024-01-01', // Example date format for input type="date"
            tanggalBerakhir: '2025-01-01',
          }}
          onSubmit={handleDetailSubmit}
        />
      )}
    </div>
  );
};

export default MonitoringIzinAlatDashboard;
