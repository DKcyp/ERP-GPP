import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, PlusCircle, Save, Trash2, Search, Filter, FileSpreadsheet, FileDown, Pencil } from 'lucide-react';
import { BankKeluarFormData, DetailItem, RecentTransaction } from '../types';
import BankKeluarModal from './BankKeluarModal'; // Import the new modal component

const BankKeluarDashboard: React.FC = () => {
  const today = new Date();

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<BankKeluarFormData | null>(null);

  // State for search and filter
  const [filterNomorJurnal, setFilterNomorJurnal] = useState('');
  const [filterKeterangan, setFilterKeterangan] = useState('');
  const [filterBankAccount, setFilterBankAccount] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState<Date | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<Date | null>(null);

  // Dummy data for recent transactions table
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([
    {
      id: 1,
      tanggal: '2024-07-20',
      nomorJurnal: 'BK-2024-07-001',
      coa: '5101 - Beban Gaji',
      keterangan: 'Transfer gaji karyawan bulan Juli',
      nominal: 25000000,
      client: 'Internal',
    },
    {
      id: 2,
      tanggal: '2024-07-19',
      nomorJurnal: 'BK-2024-07-002',
      coa: '5102 - Beban Sewa',
      keterangan: 'Pembayaran sewa gedung via transfer',
      nominal: 8000000,
      client: 'Vendor Sewa',
    },
    {
      id: 3,
      tanggal: '2024-07-18',
      nomorJurnal: 'BK-2024-07-003',
      coa: '6101 - Beban Listrik',
      keterangan: 'Pembayaran tagihan listrik via bank',
      nominal: 1500000,
      client: 'PLN',
    },
    {
      id: 4,
      tanggal: '2024-07-17',
      nomorJurnal: 'BK-2024-07-004',
      coa: '1301 - Persediaan Barang Dagang',
      keterangan: 'Pembelian bahan baku dari Supplier Y',
      nominal: 15000000,
      client: 'Supplier Y',
    },
    {
      id: 5,
      tanggal: '2024-07-16',
      nomorJurnal: 'BK-2024-07-005',
      coa: '2101 - Utang Usaha',
      keterangan: 'Pembayaran utang dagang ke Vendor Z',
      nominal: 7000000,
      client: 'Vendor Z',
    },
  ]);

  const bankOptions = [
    'Bank BCA',
    'Bank Mandiri',
    'Bank BRI',
    'Bank BNI',
  ];

  const clientOptions = [
    'Client A',
    'Client B',
    'Client C',
    'Client D',
    'Client E',
    'Internal',
    'Vendor Sewa',
    'PLN',
    'Supplier Y',
    'Vendor Z',
    'Pemasok Umum',
  ];

  const handleAddClick = () => {
    setEditingTransaction(null); // For new entry
    setShowModal(true);
  };

  const handleEditClick = (transaction: RecentTransaction) => {
    // Convert RecentTransaction to BankKeluarFormData for editing
    const detailItem: DetailItem = {
      id: 1, // Assuming one detail item for simplicity when editing from recent transactions
      coa: transaction.coa,
      nominal: transaction.nominal,
      keterangan: transaction.keterangan,
      client: transaction.client,
    };

    const formData: BankKeluarFormData = {
      id: transaction.id,
      nomorJurnal: transaction.nomorJurnal,
      tanggal: new Date(transaction.tanggal),
      bankAccount: bankOptions.includes(transaction.client) ? transaction.client : bankOptions[0], // Simple guess for bank account
      keteranganHeader: transaction.keterangan,
      detailItems: [detailItem],
      total: transaction.nominal,
    };
    setEditingTransaction(formData);
    setShowModal(true);
  };

  const handleSaveTransaction = (formData: BankKeluarFormData) => {
    if (formData.id) {
      // Edit existing transaction
      setRecentTransactions(prev =>
        prev.map(t =>
          t.id === formData.id
            ? {
                ...t,
                tanggal: formData.tanggal?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
                nomorJurnal: formData.nomorJurnal,
                coa: formData.detailItems[0]?.coa || 'N/A',
                keterangan: formData.keteranganHeader || formData.detailItems[0]?.keterangan || 'Transaksi Bank Keluar',
                nominal: formData.total,
                client: formData.detailItems[0]?.client || 'N/A',
              }
            : t
        )
      );
    } else {
      // Add new transaction
      const newId = recentTransactions.length > 0 ? Math.max(...recentTransactions.map(t => t.id)) + 1 : 1;
      const newTransaction: RecentTransaction = {
        id: newId,
        tanggal: formData.tanggal?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        nomorJurnal: formData.nomorJurnal,
        coa: formData.detailItems[0]?.coa || 'N/A', // Taking first COA for simplicity
        keterangan: formData.keteranganHeader || formData.detailItems[0]?.keterangan || 'Transaksi Bank Keluar',
        nominal: formData.total,
        client: formData.detailItems[0]?.client || 'N/A', // Taking first client for simplicity
      };
      setRecentTransactions((prev) => [newTransaction, ...prev]);
    }
  };

  const filteredTransactions = recentTransactions.filter(transaction => {
    const matchesNomorJurnal = filterNomorJurnal ? transaction.nomorJurnal.toLowerCase().includes(filterNomorJurnal.toLowerCase()) : true;
    const matchesKeterangan = filterKeterangan ? transaction.keterangan.toLowerCase().includes(filterKeterangan.toLowerCase()) : true;
    const matchesBankAccount = filterBankAccount ? transaction.client.toLowerCase().includes(filterBankAccount.toLowerCase()) : true; // Using client as a proxy for bank account in recent transactions
    const matchesClient = filterClient ? transaction.client.toLowerCase().includes(filterClient.toLowerCase()) : true;

    const transactionDate = new Date(transaction.tanggal);
    const matchesDateFrom = filterDateFrom ? transactionDate >= filterDateFrom : true;
    const matchesDateTo = filterDateTo ? transactionDate <= filterDateTo : true;

    return matchesNomorJurnal && matchesKeterangan && matchesBankAccount && matchesClient && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                BANK KELUAR
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Bank Keluar</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter Transaksi Bank Keluar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label htmlFor="filterNoJurnal" className="block text-sm font-medium text-gray-700 mb-2">Cari No Jurnal</label>
              <input
                type="text"
                id="filterNoJurnal"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Cari No Jurnal..."
                value={filterNomorJurnal}
                onChange={(e) => setFilterNomorJurnal(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filterKeterangan" className="block text-sm font-medium text-gray-700 mb-2">Cari Keterangan</label>
              <input
                type="text"
                id="filterKeterangan"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Cari Keterangan..."
                value={filterKeterangan}
                onChange={(e) => setFilterKeterangan(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filterBankAccount" className="block text-sm font-medium text-gray-700 mb-2">Pilih Akun Bank</label>
              <select
                id="filterBankAccount"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={filterBankAccount}
                onChange={(e) => setFilterBankAccount(e.target.value)}
              >
                <option value="">Pilih Akun Bank...</option>
                {bankOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filterClient" className="block text-sm font-medium text-gray-700 mb-2">Pilih Client</label>
              <select
                id="filterClient"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
              >
                <option value="">Pilih Client...</option>
                {clientOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filterDateFrom" className="block text-sm font-medium text-gray-700 mb-2">Periode Dari</label>
              <DatePicker
                selected={filterDateFrom}
                onChange={(date: Date | null) => setFilterDateFrom(date)}
                dateFormat="dd/MM/yyyy"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholderText="dd/MM/yyyy"
              />
            </div>
            <div>
              <label htmlFor="filterDateTo" className="block text-sm font-medium text-gray-700 mb-2">Periode Sampai</label>
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
                onClick={() => { /* Implement actual filter logic here */ }}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full h-[42px]"
              >
                <Search className="h-4 w-4 mr-2" /> Cari
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleAddClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Bank Keluar
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        {/* Recent Transactions Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Bank Keluar Transactions</h3>

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
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
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

      {/* Bank Keluar Modal */}
      <BankKeluarModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
        title={editingTransaction ? 'Edit Transaksi Bank Keluar' : 'Tambah Transaksi Bank Keluar'}
      />
    </div>
  );
};

export default BankKeluarDashboard;
