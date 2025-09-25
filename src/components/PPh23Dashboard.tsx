import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, FileText, FileSpreadsheet, FileDown, Clock, Upload } from 'lucide-react';
import { PPh23Data } from '../types';
import EntryPPh23Modal from './EntryPPh23Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const dummyData: PPh23Data[] = [
  { 
    id: 1, 
    namaPihak: 'PT Sumber Makmur', 
    npwp: '01.234.567.8-091.000', 
    tanggal: '2024-01-31', 
    keteranganTransaksi: 'Jasa Konsultansi Manajemen',
    dpp: 125000000, // DPP
    persentase: 0.02, // 2%
    pph23: 2500000 
  },
  { 
    id: 2, 
    namaPihak: 'CV Karya Jaya', 
    npwp: '09.876.543.2-019.000', 
    tanggal: '2024-02-29', 
    keteranganTransaksi: 'Jasa Teknik dan Konstruksi',
    dpp: 87500000,
    persentase: 0.02, // 2%
    pph23: 1750000 
  },
  { 
    id: 3, 
    namaPihak: 'PT Digital Solusi', 
    npwp: '12.345.678.9-123.000', 
    tanggal: '2024-03-15', 
    keteranganTransaksi: 'Jasa Pembuatan Software',
    dpp: 100000000,
    persentase: 0.02, // 2%
    pph23: 2000000 
  },
];

const PPh23Dashboard: React.FC = () => {
  const [data, setData] = useState<PPh23Data[]>(dummyData);
  const [searchTerm, setSearchTerm] = useState('');

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PPh23Data | null>(null);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);

  const filteredData = data.filter(item => {
    const matchesSearch = item.namaPihak.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.npwp.includes(searchTerm) ||
                          item.keteranganTransaksi.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  const handleAddClick = () => { setItemToEdit(null); setIsAddEditModalOpen(true); };
  const handleEditClick = (item: PPh23Data) => { setItemToEdit(item); setIsAddEditModalOpen(true); };
  const handleSaveItem = (newItem: PPh23Data) => {
    if (newItem.id) {
      setData(prev => prev.map(i => (i.id === newItem.id ? newItem : i)));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 1;
      setData(prev => [...prev, { ...newItem, id: newId }]);
    }
    setIsAddEditModalOpen(false);
  };
  const handleCloseAddEditModal = () => { setIsAddEditModalOpen(false); setItemToEdit(null); };

  const handleDeleteClick = (id: number) => { setItemToDeleteId(id); setIsConfirmDeleteModalOpen(true); };
  const handleConfirmDelete = () => { if (itemToDeleteId) setData(prev => prev.filter(i => i.id !== itemToDeleteId)); setIsConfirmDeleteModalOpen(false); setItemToDeleteId(null); };
  const handleCloseConfirmDeleteModal = () => { setIsConfirmDeleteModalOpen(false); setItemToDeleteId(null); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">PPh 23</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Tax</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">PPh 23</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Cari pihak, NPWP, atau keterangan transaksi..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
            <button onClick={handleAddClick} className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pihak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NPWP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan Transaksi</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">DPP</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Persentase</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">PPh 23</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.namaPihak}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.npwp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tanggal}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={item.keteranganTransaksi}>{item.keteranganTransaksi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(item.dpp)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {(item.persentase * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">{formatCurrency(item.pph23)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(item.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">Tidak ada data PPh 23 yang ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EntryPPh23Modal isOpen={isAddEditModalOpen} onClose={handleCloseAddEditModal} onSave={handleSaveItem} itemToEdit={itemToEdit} />
      <ConfirmDeleteModal isOpen={isConfirmDeleteModalOpen} onClose={handleCloseConfirmDeleteModal} onConfirm={handleConfirmDelete} itemName={itemToDeleteId ? data.find(i => i.id === itemToDeleteId)?.namaPihak : ''} />
    </div>
  );
};

export default PPh23Dashboard;
