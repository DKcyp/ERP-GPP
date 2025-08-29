import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, PlusCircle, Save, Trash2, Search, Filter, FileSpreadsheet, FileDown, Pencil, CalendarDays } from 'lucide-react';
import KasKeluarModal from './KasKeluarModal'; // Import the new modal component
import { DetailItem, RecentTransaction, KasKeluarFormData } from '../types';

const KasKeluarDashboard: React.FC = () => {
  const today = new Date();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<KasKeluarFormData | null>(null);
  const [modalTitle, setModalTitle] = useState('Tambah Kas Keluar');

  // State for search and filter
  const [searchNoJurnal, setSearchNoJurnal] = useState('');
  const [searchClient, setSearchClient] = useState('');
  const [searchCOA, setSearchCOA] = useState('');
  const [searchKeterangan, setSearchKeterangan] = useState('');
  const [selectedKasAccount, setSelectedKasAccount] = useState('');
  const [periodeDari, setPeriodeDari] = useState<Date | null>(null);
  const [periodeSampai, setPeriodeSampai] = useState<Date | null>(null);

  // Dummy data for the new recent transactions table
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([
    {
      id: 1,
      tanggal: '2024-07-20',
      nomorJurnal: 'KK-2024-07-001',
      coa: '5101 - Beban Gaji',
      keterangan: 'Pembayaran gaji karyawan bulan Juli',
      nominal: 25000000,
      client: 'Internal',
    },
    {
      id: 2,
      tanggal: '2024-07-19',
      nomorJurnal: 'KK-2024-07-002',
      coa: '5102 - Beban Sewa',
      keterangan: 'Pembayaran sewa kantor bulan Agustus',
      nominal: 8000000,
      client: 'Vendor Sewa',
    },
    {
      id: 3,
      tanggal: '2024-07-18',
      nomorJurnal: 'KK-2024-07-003',
      coa: '6101 - Beban Listrik',
      keterangan: 'Pembayaran tagihan listrik bulan Juni',
      nominal: 1500000,
      client: 'PLN',
    },
    {
      id: 4,
      tanggal: '2024-07-17',
      nomorJurnal: 'KK-2024-07-004',
      coa: '1301 - Persediaan Barang Dagang',
      keterangan: 'Pembelian ATK kantor',
      nominal: 750000,
      client: 'Toko ATK Jaya',
    },
    {
      id: 5,
      tanggal: '2024-07-16',
      nomorJurnal: 'KK-2024-07-005',
      coa: '2101 - Utang Usaha',
      keterangan: 'Pembayaran utang ke Supplier X',
      nominal: 10000000,
      client: 'Supplier X',
    },
  ]);

  const kasOptions = [
    'Kas Besar',
    'Kas Kecil',
    'Bank BCA',
    'Bank Mandiri',
  ];

  const coaOptions = [
    '5101 - Beban Gaji',
    '5102 - Beban Sewa',
    '6101 - Beban Listrik',
    '1301 - Persediaan Barang Dagang',
    '2101 - Utang Usaha',
    '7101 - Beban Lain-lain',
  ];

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setModalTitle('Tambah Kas Keluar');
    setIsModalOpen(true);
  };

  const handleEditClick = (transaction: RecentTransaction) => {
    // Convert RecentTransaction to KasKeluarFormData for the modal
    const formData: KasKeluarFormData = {
      id: transaction.id,
      nomorJurnal: transaction.nomorJurnal,
      tanggal: new Date(transaction.tanggal),
      kasAccount: selectedKasAccount || 'Kas Besar', // Default or infer if possible
      keteranganHeader: transaction.keterangan,
      detailItems: [{ // For simplicity, we'll create a single detail item from the RecentTransaction
        id: 1,
        coa: transaction.coa,
        nominal: transaction.nominal,
        keterangan: transaction.keterangan,
        client: transaction.client,
      }],
      total: transaction.nominal,
    };
    setEditingTransaction(formData);
    setModalTitle('Edit Kas Keluar');
    setIsModalOpen(true);
  };

  const handleSaveKasKeluar = (data: KasKeluarFormData) => {
    if (data.id) {
      // Update existing transaction
      setRecentTransactions(prev =>
        prev.map(t =>
          t.id === data.id
            ? {
                ...t,
                tanggal: data.tanggal?.toISOString().split('T')[0] || t.tanggal,
                nomorJurnal: data.nomorJurnal,
                coa: data.detailItems[0]?.coa || 'N/A',
                keterangan: data.keteranganHeader || data.detailItems[0]?.keterangan || 'Transaksi Kas Keluar',
                nominal: data.total,
                client: data.detailItems[0]?.client || 'N/A',
              }
            : t
        )
      );
    } else {
      // Add new transaction
      const newId = recentTransactions.length > 0 ? Math.max(...recentTransactions.map(t => t.id)) + 1 : 1;
      const newNomorJurnal = `KK-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${String(newId).padStart(3, '0')}`;
      const newTransaction: RecentTransaction = {
        id: newId,
        tanggal: data.tanggal?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        nomorJurnal: newNomorJurnal,
        coa: data.detailItems[0]?.coa || 'N/A',
        keterangan: data.keteranganHeader || data.detailItems[0]?.keterangan || 'Transaksi Kas Keluar',
        nominal: data.total,
        client: data.detailItems[0]?.client || 'N/A',
      };
      setRecentTransactions(prev => [newTransaction, ...prev]);
    }
  };

  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter(transaction => {
      const matchesNoJurnal = searchNoJurnal
        ? transaction.nomorJurnal.toLowerCase().includes(searchNoJurnal.toLowerCase())
        : true;
      const matchesClient = searchClient
        ? transaction.client.toLowerCase().includes(searchClient.toLowerCase())
        : true;
      const matchesCOA = searchCOA
        ? transaction.coa.toLowerCase().includes(searchCOA.toLowerCase())
        : true;
      const matchesKeterangan = searchKeterangan
        ? transaction.keterangan.toLowerCase().includes(searchKeterangan.toLowerCase())
        : true;
      const matchesKasAccount = selectedKasAccount
        ? transaction.keterangan.toLowerCase().includes(selectedKasAccount.toLowerCase()) // Assuming kas account is part of keterangan or can be inferred
        : true;

      const transactionDate = new Date(transaction.tanggal);
      const matchesPeriodeDari = periodeDari ? transactionDate >= periodeDari : true;
      const matchesPeriodeSampai = periodeSampai ? transactionDate <= periodeSampai : true;

      return (
        matchesNoJurnal &&
        matchesClient &&
        matchesCOA &&
        matchesKeterangan &&
        matchesKasAccount &&
        matchesPeriodeDari &&
        matchesPeriodeSampai
      );
    });
  }, [
    recentTransactions,
    searchNoJurnal,
    searchClient,
    searchCOA,
    searchKeterangan,
    selectedKasAccount,
    periodeDari,
    periodeSampai,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                KAS KELUAR
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Kas Keluar</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter Transaksi Kas Keluar</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Cari No Jurnal */}
            <div>
              <label htmlFor="searchNoJurnal" className="block text-sm font-medium text-gray-700 mb-2">Cari No Jurnal</label>
              <input
                type="text"
                id="searchNoJurnal"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Cari No Jurnal..."
                value={searchNoJurnal}
                onChange={(e) => setSearchNoJurnal(e.target.value)}
              />
            </div>

            {/* Cari Client */}
            <div>
              <label htmlFor="searchClient" className="block text-sm font-medium text-gray-700 mb-2">Cari Client</label>
              <input
                type="text"
                id="searchClient"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Cari Client..."
                value={searchClient}
                onChange={(e) => setSearchClient(e.target.value)}
              />
            </div>

            {/* Cari COA */}
            <div>
              <label htmlFor="searchCOA" className="block text-sm font-medium text-gray-700 mb-2">Cari COA</label>
              <select
                id="searchCOA"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={searchCOA}
                onChange={(e) => setSearchCOA(e.target.value)}
              >
                <option value="">Pilih COA</option>
                {coaOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Cari Keterangan */}
            <div>
              <label htmlFor="searchKeterangan" className="block text-sm font-medium text-gray-700 mb-2">Cari Keterangan</label>
              <input
                type="text"
                id="searchKeterangan"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Cari Keterangan..."
                value={searchKeterangan}
                onChange={(e) => setSearchKeterangan(e.target.value)}
              />
            </div>

            {/* Pilih Kas Account */}
            <div>
              <label htmlFor="selectedKasAccount" className="block text-sm font-medium text-gray-700 mb-2">Pilih Akun Kas</label>
              <select
                id="selectedKasAccount"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={selectedKasAccount}
                onChange={(e) => setSelectedKasAccount(e.target.value)}
              >
                <option value="">Pilih Akun Kas</option>
                {kasOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Periode Dari */}
            <div>
              <label htmlFor="periodeDari" className="block text-sm font-medium text-gray-700 mb-2">Periode Dari</label>
              <div className="relative">
                <DatePicker
                  selected={periodeDari}
                  onChange={(date: Date | null) => setPeriodeDari(date)}
                  dateFormat="dd/MM/yyyy"
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  calendarClassName="shadow-lg rounded-lg"
                  wrapperClassName="w-full"
                />
                <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Sampai */}
            <div>
              <label htmlFor="periodeSampai" className="block text-sm font-medium text-gray-700 mb-2">Periode Sampai</label>
              <div className="relative">
                <DatePicker
                  selected={periodeSampai}
                  onChange={(date: Date | null) => setPeriodeSampai(date)}
                  dateFormat="dd/MM/yyyy"
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  calendarClassName="shadow-lg rounded-lg"
                  wrapperClassName="w-full"
                />
                <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cari Button */}
            <div className="flex items-end">
              <button
                onClick={() => { /* Trigger search logic, currently handled by useMemo */ }}
                className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors h-[42px]"
              >
                <Search className="h-4 w-4 mr-2" /> Cari
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center space-y-3 md:space-y-0 md:space-x-3 mt-6">
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Kas Keluar
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        {/* Recent Transactions Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Kas Keluar Transactions</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor Jurnal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    COA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keterangan
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nominal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {transaction.nomorJurnal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.coa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.keterangan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      Rp {transaction.nominal.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(transaction)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Kas Keluar Modal */}
      <KasKeluarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveKasKeluar}
        initialData={editingTransaction}
        title={modalTitle}
      />
    </div>
  );
};

export default KasKeluarDashboard;
