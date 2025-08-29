import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, Lock, Unlock, CalendarDays, Search, FileSpreadsheet, FileDown, PlusCircle } from 'lucide-react';
import TutupBukuModal from './TutupBukuModal'; // Import the new modal component
import Modal from './Modal'; // Import the generic Modal component

interface TutupBukuEntry {
  id: string;
  tanggalTutup: string;
  periodeBulan: string;
  periodeTahun: number;
  status: 'Closed' | 'Open';
}

const TutupBukuDashboard: React.FC = () => {
  const today = new Date();

  // State for Tutup Buku modal
  const [showTutupBukuModal, setShowTutupBukuModal] = useState(false);

  // State for Buka Tutup Buku confirmation modal
  const [showBukaTutupBukuConfirmModal, setShowBukaTutupBukuConfirmModal] = useState(false);
  const [selectedEntryToOpen, setSelectedEntryToOpen] = useState<TutupBukuEntry | null>(null);

  // State for search and filter
  const [filterPeriodeBulan, setFilterPeriodeBulan] = useState('');
  const [filterPeriodeTahun, setFilterPeriodeTahun] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState<Date | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<Date | null>(null);

  const [dummyData, setDummyData] = useState<TutupBukuEntry[]>([
    { id: '1', tanggalTutup: '2024-06-30', periodeBulan: 'Juni', periodeTahun: 2024, status: 'Closed' },
    { id: '2', tanggalTutup: '2024-05-31', periodeBulan: 'Mei', periodeTahun: 2024, status: 'Closed' },
    { id: '3', tanggalTutup: '2024-04-30', periodeBulan: 'April', periodeTahun: 2024, status: 'Closed' },
    { id: '4', tanggalTutup: '2024-03-31', periodeBulan: 'Maret', periodeTahun: 2024, status: 'Closed' },
    { id: '5', tanggalTutup: '2024-02-29', periodeBulan: 'Februari', periodeTahun: 2024, status: 'Closed' },
    { id: '6', tanggalTutup: '2024-01-31', periodeBulan: 'Januari', periodeTahun: 2024, status: 'Closed' },
  ]);

  const months = [
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => (today.getFullYear() - i).toString());

  const handleTutupBuku = (tanggalTutup: Date | null, bulanValue: string, tahun: string) => {
    const selectedMonthLabel = months.find(m => m.value === bulanValue)?.label;
    if (tanggalTutup && selectedMonthLabel) {
      const newEntry: TutupBukuEntry = {
        id: (dummyData.length + 1).toString(),
        tanggalTutup: tanggalTutup.toISOString().split('T')[0],
        periodeBulan: selectedMonthLabel,
        periodeTahun: parseInt(tahun),
        status: 'Closed',
      };
      setDummyData(prev => [newEntry, ...prev]);
      alert(`Melakukan Tutup Buku untuk periode ${selectedMonthLabel} ${tahun} pada tanggal ${tanggalTutup.toLocaleDateString('id-ID')}`);
    }
  };

  const handleBukaTutupBuku = (entry: TutupBukuEntry) => {
    setSelectedEntryToOpen(entry);
    setShowBukaTutupBukuConfirmModal(true);
  };

  const handleConfirmBukaTutupBuku = () => {
    if (selectedEntryToOpen) {
      setDummyData(prev =>
        prev.map(entry =>
          entry.id === selectedEntryToOpen.id ? { ...entry, status: 'Open' } : entry
        )
      );
      alert(`Membuka kembali buku untuk entri: ${selectedEntryToOpen.id} (${selectedEntryToOpen.periodeBulan} ${selectedEntryToOpen.periodeTahun})`);
      setSelectedEntryToOpen(null);
      setShowBukaTutupBukuConfirmModal(false);
    }
  };

  const filteredData = dummyData.filter(entry => {
    const matchesBulan = filterPeriodeBulan ? entry.periodeBulan.toLowerCase().includes(filterPeriodeBulan.toLowerCase()) : true;
    const matchesTahun = filterPeriodeTahun ? entry.periodeTahun.toString().includes(filterPeriodeTahun) : true;
    const matchesStatus = filterStatus ? entry.status.toLowerCase() === filterStatus.toLowerCase() : true;

    const entryDate = new Date(entry.tanggalTutup);
    const matchesDateFrom = filterDateFrom ? entryDate >= filterDateFrom : true;
    const matchesDateTo = filterDateTo ? entryDate <= filterDateTo : true;

    return matchesBulan && matchesTahun && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                TUTUP BUKU
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Tutup Buku</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter Tutup Buku</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label htmlFor="filterPeriodeBulan" className="block text-sm font-medium text-gray-700 mb-2">Pilih Bulan</label>
              <select
                id="filterPeriodeBulan"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={filterPeriodeBulan}
                onChange={(e) => setFilterPeriodeBulan(e.target.value)}
              >
                <option value="">Semua Bulan</option>
                {months.map((m) => (
                  <option key={m.label} value={m.label}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filterPeriodeTahun" className="block text-sm font-medium text-gray-700 mb-2">Pilih Tahun</label>
              <select
                id="filterPeriodeTahun"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={filterPeriodeTahun}
                onChange={(e) => setFilterPeriodeTahun(e.target.value)}
              >
                <option value="">Semua Tahun</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-2">Pilih Status</label>
              <select
                id="filterStatus"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Closed">Closed</option>
                <option value="Open">Open</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterDateFrom" className="block text-sm font-medium text-gray-700 mb-2">Tanggal Tutup Dari</label>
              <DatePicker
                selected={filterDateFrom}
                onChange={(date: Date | null) => setFilterDateFrom(date)}
                dateFormat="dd/MM/yyyy"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholderText="dd/MM/yyyy"
              />
            </div>
            <div>
              <label htmlFor="filterDateTo" className="block text-sm font-medium text-gray-700 mb-2">Tanggal Tutup Sampai</label>
              <DatePicker
                selected={filterDateTo}
                onChange={(date: Date | null) => setFilterDateTo(date)}
                dateFormat="dd/MM/yyyy"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholderText="dd/MM/yyyy"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { /* Filter logic is already applied by state changes, this button can trigger a re-render or more complex server-side filtering */ }}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full h-[42px]"
              >
                <Search className="h-4 w-4 mr-2" /> Cari
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowTutupBukuModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Lock className="h-5 w-5 mr-2" /> Tambah Tutup Buku
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <h3 className="text-2xl font-bold text-gray-900 p-8 pb-4">Daftar Tutup Buku Sebelumnya</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Tutup
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode Bulan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode Tahun
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(entry.tanggalTutup).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.periodeBulan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.periodeTahun}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.status === 'Closed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {entry.status === 'Closed' && (
                        <button
                          onClick={() => handleBukaTutupBuku(entry)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          <Unlock className="h-4 w-4 mr-1" /> Buka Tutup Buku
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tutup Buku Modal */}
      <TutupBukuModal
        isOpen={showTutupBukuModal}
        onClose={() => setShowTutupBukuModal(false)}
        onSave={handleTutupBuku}
        title="Form Tutup Buku"
      />

      {/* Buka Tutup Buku Confirmation Modal */}
      <Modal
        isOpen={showBukaTutupBukuConfirmModal}
        onClose={() => setShowBukaTutupBukuConfirmModal(false)}
        title="Konfirmasi Buka Tutup Buku"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-textSecondary">
            Apakah Anda yakin ingin membuka kembali buku untuk periode{' '}
            <span className="font-semibold text-text">
              {selectedEntryToOpen?.periodeBulan} {selectedEntryToOpen?.periodeTahun}
            </span>
            ?
          </p>
          <p className="text-sm text-red-500">
            Membuka kembali buku dapat mempengaruhi laporan keuangan yang sudah ditutup.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowBukaTutupBukuConfirmModal(false)}
              className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md shadow-sm text-textSecondary bg-surface hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmBukaTutupBuku}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Unlock className="h-5 w-5 mr-2" /> Ya, Buka Buku
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TutupBukuDashboard;
