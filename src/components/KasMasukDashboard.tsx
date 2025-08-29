import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, PlusCircle, Save, Trash2, Search, Filter, FileSpreadsheet, FileDown, Edit } from 'lucide-react';
import KasMasukModal from './KasMasukModal'; // Import the new modal component
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Import the ConfirmDeleteModal component
import { KasMasukFormData, RecentTransaction } from '../types'; // Import types

const KasMasukDashboard: React.FC = () => {
  const today = new Date();

  // State for Kas Masuk Modal
  const [isKasMasukModalOpen, setIsKasMasukModalOpen] = useState(false);
  const [editingKasMasukData, setEditingKasMasukData] = useState<KasMasukFormData | null>(null);
  const [modalTitle, setModalTitle] = useState('Tambah Kas Masuk Baru');

  // State for Confirm Delete Modal
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<RecentTransaction | null>(null);

  // State for Search and Filter
  const [searchNoJurnal, setSearchNoJurnal] = useState('');
  const [searchKeterangan, setSearchKeterangan] = useState('');
  const [selectedKasAccount, setSelectedKasAccount] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [periodeDari, setPeriodeDari] = useState<Date | null>(null);
  const [periodeSampai, setPeriodeSampai] = useState<Date | null>(null);

  // Dummy data for the new recent transactions table
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([
    {
      id: 1,
      tanggal: '2024-07-20',
      nomorJurnal: 'KM-2024-07-001',
      coa: '4101 - Pendapatan Penjualan',
      keterangan: 'Penerimaan pembayaran proyek Alpha',
      nominal: 15000000,
      client: 'Client A',
    },
    {
      id: 2,
      tanggal: '2024-07-19',
      nomorJurnal: 'KM-2024-07-002',
      coa: '1201 - Piutang Usaha',
      keterangan: 'Pelunasan piutang dari Client B',
      nominal: 7500000,
      client: 'Client B',
    },
    {
      id: 3,
      tanggal: '2024-07-18',
      nomorJurnal: 'KM-2024-07-003',
      coa: '4102 - Pendapatan Jasa',
      keterangan: 'Pendapatan jasa konsultasi Client C',
      nominal: 5000000,
      client: 'Client C',
    },
    {
      id: 4,
      tanggal: '2024-07-17',
      nomorJurnal: 'KM-2024-07-004',
      coa: '4101 - Pendapatan Penjualan',
      keterangan: 'Penjualan produk X ke Client D',
      nominal: 12000000,
      client: 'Client D',
    },
    {
      id: 5,
      tanggal: '2024-07-16',
      nomorJurnal: 'KM-2024-07-005',
      coa: '1201 - Piutang Usaha',
      keterangan: 'Pembayaran sebagian piutang Client E',
      nominal: 3000000,
      client: 'Client E',
    },
  ]);

  const kasOptions = [
    'Kas Besar',
    'Kas Kecil',
  ];

  const clientOptions = [
    'Client A',
    'Client B',
    'Client C',
    'Client D',
    'Client E',
  ];

  const handleAddKasMasukClick = () => {
    setEditingKasMasukData(null);
    setModalTitle('Tambah Kas Masuk Baru');
    setIsKasMasukModalOpen(true);
  };

  const handleEditKasMasukClick = (transaction: RecentTransaction) => {
    // For editing, we need to reconstruct KasMasukFormData from RecentTransaction
    // This is a simplified reconstruction. In a real app, you'd fetch full details.
    const fullKasMasukData: KasMasukFormData = {
      id: transaction.id,
      nomorJurnal: transaction.nomorJurnal,
      tanggal: new Date(transaction.tanggal),
      kasAccount: selectedKasAccount || 'Kas Besar', // Placeholder, as not in RecentTransaction
      keteranganHeader: transaction.keterangan,
      detailItems: [{ // Simplified: only one detail item for editing
        id: 1,
        coa: transaction.coa,
        nominal: transaction.nominal,
        keterangan: transaction.keterangan,
        client: transaction.client,
      }],
      total: transaction.nominal,
    };
    setEditingKasMasukData(fullKasMasukData);
    setModalTitle('Edit Kas Masuk');
    setIsKasMasukModalOpen(true);
  };

  const handleSaveKasMasuk = (data: KasMasukFormData) => {
    if (data.id) {
      // Edit existing transaction
      setRecentTransactions(prev => prev.map(t =>
        t.id === data.id ? {
          ...t,
          tanggal: data.tanggal?.toISOString().split('T')[0] || t.tanggal,
          nomorJurnal: data.nomorJurnal,
          coa: data.detailItems[0]?.coa || t.coa,
          keterangan: data.keteranganHeader || data.detailItems[0]?.keterangan || t.keterangan,
          nominal: data.total,
          client: data.detailItems[0]?.client || t.client,
        } : t
      ));
    } else {
      // Add new transaction
      const newId = recentTransactions.length > 0 ? Math.max(...recentTransactions.map(t => t.id)) + 1 : 1;
      const newTransaction: RecentTransaction = {
        id: newId,
        tanggal: data.tanggal?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        nomorJurnal: data.nomorJurnal,
        coa: data.detailItems[0]?.coa || 'N/A',
        keterangan: data.keteranganHeader || data.detailItems[0]?.keterangan || 'Transaksi Kas Masuk',
        nominal: data.total,
        client: data.detailItems[0]?.client || 'N/A',
      };
      setRecentTransactions(prev => [newTransaction, ...prev]);
    }
  };

  const handleDeleteClick = (transaction: RecentTransaction) => {
    setTransactionToDelete(transaction);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      setRecentTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
      setTransactionToDelete(null);
    }
    setIsConfirmDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setTransactionToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleSearch = () => {
    // This function will trigger the useMemo re-calculation
    console.log('Searching with filters:', {
      searchNoJurnal, searchKeterangan, selectedKasAccount, selectedClient, periodeDari, periodeSampai
    });
  };

  const handleExportExcel = () => {
    alert('Exporting to Excel...');
    // Implement actual export logic here
  };

  const handleExportPDF = () => {
    alert('Exporting to PDF...');
    // Implement actual export logic here
  };

  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter(transaction => {
      const matchesNoJurnal = searchNoJurnal
        ? transaction.nomorJurnal.toLowerCase().includes(searchNoJurnal.toLowerCase())
        : true;
      const matchesKeterangan = searchKeterangan
        ? transaction.keterangan.toLowerCase().includes(searchKeterangan.toLowerCase())
        : true;
      const matchesKasAccount = selectedKasAccount
        ? transaction.coa.toLowerCase().includes(selectedKasAccount.toLowerCase()) // Simplified, assuming COA can represent kas account
        : true;
      const matchesClient = selectedClient
        ? transaction.client.toLowerCase().includes(selectedClient.toLowerCase())
        : true;

      const transactionDate = new Date(transaction.tanggal);
      const matchesPeriodeDari = periodeDari
        ? transactionDate >= periodeDari
        : true;
      const matchesPeriodeSampai = periodeSampai
        ? transactionDate <= periodeSampai
        : true;

      return matchesNoJurnal && matchesKeterangan && matchesKasAccount && matchesClient && matchesPeriodeDari && matchesPeriodeSampai;
    });
  }, [recentTransactions, searchNoJurnal, searchKeterangan, selectedKasAccount, selectedClient, periodeDari, periodeSampai]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                KAS MASUK
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Kas Masuk</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter Transaksi Kas Masuk</h3>
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
            {/* Pilih Akun Kas */}
            <div>
              <label htmlFor="selectedKasAccount" className="block text-sm font-medium text-gray-700 mb-2">Pilih Akun Kas</label>
              <select
                id="selectedKasAccount"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={selectedKasAccount}
                onChange={(e) => setSelectedKasAccount(e.target.value)}
              >
                <option value="">Semua Akun Kas</option>
                {kasOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            {/* Pilih Client */}
            <div>
              <label htmlFor="selectedClient" className="block text-sm font-medium text-gray-700 mb-2">Pilih Client</label>
              <select
                id="selectedClient"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="">Semua Client</option>
                {clientOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            {/* Periode Dari */}
            <div>
              <label htmlFor="periodeDari" className="block text-sm font-medium text-gray-700 mb-2">Periode Dari</label>
              <DatePicker
                selected={periodeDari}
                onChange={(date: Date | null) => setPeriodeDari(date)}
                dateFormat="dd/MM/yyyy"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholderText="dd/MM/yyyy"
              />
            </div>
            {/* Periode Sampai */}
            <div>
              <label htmlFor="periodeSampai" className="block text-sm font-medium text-gray-700 mb-2">Periode Sampai</label>
              <DatePicker
                selected={periodeSampai}
                onChange={(date: Date | null) => setPeriodeSampai(date)}
                dateFormat="dd/MM/yyyy"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholderText="dd/MM/yyyy"
              />
            </div>
            {/* Empty div for alignment */}
            <div className="hidden lg:block"></div>
            {/* Cari Data Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors h-[42px]"
              >
                <Search className="h-4 w-4 mr-2" /> Cari Data
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center space-y-3 md:space-y-0 md:space-x-3 mt-6">
            <button
              onClick={handleAddKasMasukClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors w-full md:w-auto"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Kas Masuk
            </button>
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors w-full md:w-auto"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors w-full md:w-auto"
            >
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        {/* Recent Transactions Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Kas Masuk Transactions</h3>

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
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditKasMasukClick(transaction)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                          title="Edit Transaksi"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(transaction)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Kas Masuk Modal */}
      <KasMasukModal
        isOpen={isKasMasukModalOpen}
        onClose={() => setIsKasMasukModalOpen(false)}
        onSave={handleSaveKasMasuk}
        initialData={editingKasMasukData}
        title={modalTitle}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={transactionToDelete ? transactionToDelete.nomorJurnal : ''}
        message="Apakah Anda yakin ingin menghapus transaksi kas masuk ini?"
      />
    </div>
  );
};

export default KasMasukDashboard;
