import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, FileText, FileSpreadsheet, FileDown, Clock } from 'lucide-react';
import { PPh21Data } from '../types'; // Import PPh21Data from types
import EntryPPh21Modal from './EntryPPh21Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const dummyData: PPh21Data[] = [
  { id: 1, namaPegawai: 'Budi Santoso', npwp: '12.345.678.9-001.000', tanggal: '2024-01-31', pph21: 1500000 },
  { id: 2, namaPegawai: 'Siti Aminah', npwp: '98.765.432.1-002.000', tanggal: '2024-01-31', pph21: 1200000 },
  { id: 3, namaPegawai: 'Joko Susilo', npwp: '11.223.344.5-003.000', tanggal: '2024-02-29', pph21: 1800000 },
  { id: 4, namaPegawai: 'Ani Lestari', npwp: '55.667.788.9-004.000', tanggal: '2024-02-29', pph21: 950000 },
  { id: 5, namaPegawai: 'Rudi Hartono', npwp: '22.334.455.6-005.000', tanggal: '2024-03-31', pph21: 2100000 },
  { id: 6, namaPegawai: 'Dewi Anggraini', npwp: '77.889.900.1-006.000', tanggal: '2024-03-31', pph21: 1300000 },
  { id: 7, namaPegawai: 'Fajar Nugroho', npwp: '33.445.566.7-007.000', tanggal: '2024-04-30', pph21: 1650000 },
  { id: 8, namaPegawai: 'Maya Sari', npwp: '88.990.011.2-008.000', tanggal: '2024-04-30', pph21: 1050000 },
  { id: 9, namaPegawai: 'Agus Wijaya', npwp: '44.556.677.8-009.000', tanggal: '2024-05-31', pph21: 1900000 },
  { id: 10, namaPegawai: 'Linda Permata', npwp: '66.778.899.0-010.000', tanggal: '2024-05-31', pph21: 1150000 },
];

const PPh21Dashboard: React.FC = () => {
  const [data, setData] = useState<PPh21Data[]>(dummyData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // Not used yet, but kept for future filter functionality

  // State for Add/Edit Modal
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PPh21Data | null>(null);

  // State for Confirm Delete Modal
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);

  const filteredData = data.filter(item => {
    const matchesSearch = item.namaPegawai.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.npwp.includes(searchTerm);
    return matchesSearch;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  // Handlers for Add/Edit Modal
  const handleAddClick = () => {
    setItemToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditClick = (item: PPh21Data) => {
    setItemToEdit(item);
    setIsAddEditModalOpen(true);
  };

  const handleSaveItem = (newItem: PPh21Data) => {
    if (newItem.id) {
      // Edit existing item
      setData(prevData => prevData.map(item => (item.id === newItem.id ? newItem : item)));
    } else {
      // Add new item
      const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
      setData(prevData => [...prevData, { ...newItem, id: newId }]);
    }
    setIsAddEditModalOpen(false);
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setItemToEdit(null);
  };

  // Handlers for Delete Modal
  const handleDeleteClick = (id: number) => {
    setItemToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDeleteId) {
      setData(prevData => prevData.filter(item => item.id !== itemToDeleteId));
    }
    setIsConfirmDeleteModalOpen(false);
    setItemToDeleteId(null);
  };

  const handleCloseConfirmDeleteModal = () => {
    setIsConfirmDeleteModalOpen(false);
    setItemToDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                PPh 21
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Tax</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">PPh 21</span>
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
        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pegawai atau NPWP..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handleAddClick}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Pegawai
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NPWP
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PPh 21
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.namaPegawai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.npwp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.tanggal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(item.pph21)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150 p-1 rounded-full hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-150 p-1 rounded-full hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Tidak ada data PPh 21 yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit PPh 21 Modal */}
      <EntryPPh21Modal
        isOpen={isAddEditModalOpen}
        onClose={handleCloseAddEditModal}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={handleCloseConfirmDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={itemToDeleteId ? data.find(item => item.id === itemToDeleteId)?.namaPegawai : ''}
      />
    </div>
  );
};

export default PPh21Dashboard;
