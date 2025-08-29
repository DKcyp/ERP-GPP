import React, { useState } from 'react';
import {
  PerizinanAlatEntry,
  AjukanIzinFormData,
  DetailIzinAlatFormData,
  PerpanjangIzinFormData,
} from '../types';
import AjukanIzinModal from './AjukanIzinModal';
import DetailIzinAlatModal from './DetailIzinAlatModal';
import PerpanjangIzinModal from './PerpanjangIzinModal';

const PerizinanAlatDashboard: React.FC = () => {
  const [perizinanAlatData, setPerizinanAlatData] = useState<PerizinanAlatEntry[]>([
    {
      id: '1',
      no: 1,
      kodeBarang: 'EXC-001',
      namaAlat: 'Excavator',
      noSeri: '12345-EXC',
      jenisPerizinan: '-',
      status: 'Belum Berizin',
      tanggalAwalIzin: '',
      tanggalAkhirIzin: '',
      dokumen: '',
    },
    {
      id: '2',
      no: 2,
      kodeBarang: 'CRN-001',
      namaAlat: 'Crane',
      noSeri: '12345-CRN',
      jenisPerizinan: 'SLO',
      status: 'Menunggu Persetujuan',
      tanggalAwalIzin: '2024-03-01',
      tanggalAkhirIzin: '2025-03-01',
      dokumen: 'SLO-CRN-001',
    },
    {
      id: '3',
      no: 3,
      kodeBarang: 'TRK-001',
      namaAlat: 'Truk',
      noSeri: '12345-TRK',
      jenisPerizinan: 'Izin Angkut',
      status: 'Disetujui',
      tanggalAwalIzin: '2023-11-15',
      tanggalAkhirIzin: '2024-11-15', // This one should be red (more than 3 months ago from current date)
      dokumen: 'IA-TRK-001',
    },
    {
      id: '4',
      no: 4,
      kodeBarang: 'DZR-001',
      namaAlat: 'Dozer',
      noSeri: '12345-DZR',
      jenisPerizinan: 'Izin Operasional',
      status: 'Izin Tersedia',
      tanggalAwalIzin: '2024-01-20',
      tanggalAkhirIzin: '2025-01-20',
      dokumen: 'IO-DZR-001',
    },
    {
      id: '5',
      no: 5,
      kodeBarang: 'DMP-001',
      namaAlat: 'Dump Truck',
      noSeri: '12345-DMP',
      jenisPerizinan: 'STNK',
      status: 'Aktif',
      tanggalAwalIzin: '2024-02-10',
      tanggalAkhirIzin: '2025-02-10',
      dokumen: 'STNK-DMP-001',
    },
    {
      id: '6',
      no: 6,
      kodeBarang: 'FORK-001',
      namaAlat: 'Forklift',
      noSeri: '12345-FORK',
      jenisPerizinan: 'SIO',
      status: 'Aktif',
      tanggalAwalIzin: '2023-01-01',
      tanggalAkhirIzin: '2024-01-01', // This one should be red (more than 3 months ago from current date)
      dokumen: 'SIO-FORK-001',
    },
    {
      id: '7',
      no: 7,
      kodeBarang: 'GEN-001',
      namaAlat: 'Generator',
      noSeri: '12345-GEN',
      jenisPerizinan: 'Izin Genset',
      status: 'Aktif',
      tanggalAwalIzin: '2024-05-01',
      tanggalAkhirIzin: '2024-07-25', // This one is less than 3 months ago (or exactly 3 months ago if today is 25 Oct)
      dokumen: 'IG-GEN-001',
    },
  ]);

  const [isAjukanIzinModalOpen, setIsAjukanIzinModalOpen] = useState(false);
  const [isDetailIzinModalOpen, setIsDetailIzinModalOpen] = useState(false);
  const [isPerpanjangModalOpen, setIsPerpanjangModalOpen] = useState(false);

  const [selectedIzin, setSelectedIzin] = useState<PerizinanAlatEntry | null>(null);

  const handleOpenAjukanIzinModal = (izin?: PerizinanAlatEntry) => {
    setSelectedIzin(izin || null);
    setIsAjukanIzinModalOpen(true);
  };

  const handleOpenDetailIzinModal = (izin: PerizinanAlatEntry) => {
    setSelectedIzin(izin);
    setIsDetailIzinModalOpen(true);
  };

  const handleOpenPerpanjangModal = (izin: PerizinanAlatEntry) => {
    setSelectedIzin(izin);
    setIsPerpanjangModalOpen(true);
  };

  const handleAjukanIzinSubmit = (data: AjukanIzinFormData) => {
    console.log('Submit Ajukan Izin:', data);
    if (selectedIzin) {
      setPerizinanAlatData((prev) =>
        prev.map((item) =>
          item.id === selectedIzin.id
            ? { ...item, jenisPerizinan: data.jenisPerizinan, status: 'Menunggu Persetujuan' }
            : item
        )
      );
    } else {
      const newId = String(perizinanAlatData.length + 1);
      setPerizinanAlatData((prev) => [
        ...prev,
        {
          id: newId,
          no: prev.length + 1,
          kodeBarang: data.kodeBarang,
          namaAlat: data.namaAlat,
          noSeri: data.noSeri,
          jenisPerizinan: data.jenisPerizinan,
          status: 'Menunggu Persetujuan',
          tanggalAwalIzin: '', // Default empty for new application
          tanggalAkhirIzin: '', // Default empty for new application
          dokumen: '', // Default empty for new application
        },
      ]);
    }
  };

  const handleDetailIzinSubmit = (data: DetailIzinAlatFormData) => {
    console.log('Submit Detail Izin Alat:', data);
    // In a real app, you would send this data to your backend
    // And then update the perizinanAlatData state
    if (selectedIzin) {
      setPerizinanAlatData((prev) =>
        prev.map((item) =>
          item.id === selectedIzin.id
            ? {
                ...item,
                dokumen: data.dokumen,
                tanggalAwalIzin: data.tanggalAwalIzin,
                tanggalAkhirIzin: data.tanggalAkhirIzin,
              }
            : item
        )
      );
    }
  };

  const handlePerpanjangSubmit = (data: PerpanjangIzinFormData) => {
    console.log('Submit Perpanjang Izin:', data);
    if (selectedIzin) {
      setPerizinanAlatData((prev) =>
        prev.map((item) =>
          item.id === selectedIzin.id
            ? { ...item, status: 'Menunggu Persetujuan' } // Simulate status change after extension request
            : item
        )
      );
    }
  };

  const getStatusClasses = (status: PerizinanAlatEntry['status']) => {
    switch (status) {
      case 'Aktif':
        return 'bg-success/20 text-success';
      case 'Belum Berizin':
        return 'bg-gray-500/20 text-gray-500';
      case 'Menunggu Persetujuan':
        return 'bg-warning/20 text-warning';
      case 'Disetujui':
        return 'bg-primary/20 text-primary';
      case 'Izin Tersedia':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Function to determine if the expiry date is more than 3 months in the past
  const getExpiryStatusClass = (tanggalAkhirIzin: string) => {
    if (!tanggalAkhirIzin) return ''; // No date, no special styling

    const expiryDate = new Date(tanggalAkhirIzin);
    const currentDate = new Date();

    // Calculate 3 months ago from current date
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    threeMonthsAgo.setDate(currentDate.getDate()); // Keep the same day of the month

    // If expiryDate is before threeMonthsAgo, it's expired by more than 3 months
    if (expiryDate < threeMonthsAgo) {
      return 'bg-red-900/30'; // A subtle red background
    }
    return '';
  };

  // Search and filter states
  const [searchKodeBarang, setSearchKodeBarang] = useState('');
  const [searchNamaAlat, setSearchNamaAlat] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = perizinanAlatData.filter((item) => {
    const matchesKodeBarang = item.kodeBarang.toLowerCase().includes(searchKodeBarang.toLowerCase());
    const matchesNamaAlat = item.namaAlat.toLowerCase().includes(searchNamaAlat.toLowerCase());
    return matchesKodeBarang && matchesNamaAlat;
  });

  const totalPages = Math.ceil(filteredData.length / showEntries);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showEntries,
    currentPage * showEntries
  );

  return (
    <div className="min-h-screen bg-background p-8 text-text">
      <h1 className="text-3xl font-bold text-primary mb-8">Perizinan Alat</h1>

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
            <label htmlFor="searchNamaAlat" className="block text-sm font-medium text-textSecondary mb-1">
              Cari Nama Alat
            </label>
            <div className="relative">
              <input
                type="text"
                id="searchNamaAlat"
                value={searchNamaAlat}
                onChange={(e) => setSearchNamaAlat(e.target.value)}
                placeholder="Truk"
                className="w-full px-4 py-2 pl-10 rounded-lg bg-surface border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
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
                  Tanggal Awal Izin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Tanggal Akhir Izin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Dokumen
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary text-center">
                    Tidak ada data perizinan alat yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((izin) => (
                  <tr key={izin.id} className={`hover:bg-background transition-colors duration-150 ${getExpiryStatusClass(izin.tanggalAkhirIzin)}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{izin.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{izin.kodeBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{izin.namaAlat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{izin.tanggalAwalIzin || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{izin.tanggalAkhirIzin || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{izin.dokumen || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {izin.status === 'Belum Berizin' && (
                          <button
                            onClick={() => handleOpenAjukanIzinModal(izin)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200"
                          >
                            Ajukan Izin
                          </button>
                        )}
                        {(izin.status === 'Disetujui' || izin.status === 'Izin Tersedia' || izin.status === 'Aktif') && (
                          <button
                            onClick={() => handleOpenDetailIzinModal(izin)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                          >
                            Detail Izin
                          </button>
                        )}
                        {(izin.status === 'Aktif' || izin.status === 'Izin Tersedia') && (
                          <button
                            onClick={() => handleOpenPerpanjangModal(izin)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200"
                          >
                            + Perpanjang
                          </button>
                        )}
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
      {selectedIzin && (
        <AjukanIzinModal
          isOpen={isAjukanIzinModalOpen}
          onClose={() => setIsAjukanIzinModalOpen(false)}
          initialData={{
            kodeBarang: selectedIzin.kodeBarang,
            namaAlat: selectedIzin.namaAlat,
            noSeri: selectedIzin.noSeri,
            jenisPerizinan: selectedIzin.jenisPerizinan === '-' ? '' : selectedIzin.jenisPerizinan,
          }}
          onSubmit={handleAjukanIzinSubmit}
        />
      )}

      {selectedIzin && (
        <DetailIzinAlatModal
          isOpen={isDetailIzinModalOpen}
          onClose={() => setIsDetailIzinModalOpen(false)}
          initialData={{
            kodeBarang: selectedIzin.kodeBarang,
            namaAlat: selectedIzin.namaAlat,
            noSeri: selectedIzin.noSeri,
            jenisPerizinan: selectedIzin.jenisPerizinan,
            dokumen: selectedIzin.dokumen,
            tanggalAwalIzin: selectedIzin.tanggalAwalIzin,
            tanggalAkhirIzin: selectedIzin.tanggalAkhirIzin,
          }}
          onSubmit={handleDetailIzinSubmit}
        />
      )}

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
    </div>
  );
};

export default PerizinanAlatDashboard;
