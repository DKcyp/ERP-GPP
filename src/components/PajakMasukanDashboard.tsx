import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, FileText, FileSpreadsheet, FileDown, Clock } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EntryPajakMasukanModal from './EntryPajakMasukanModal'; // Import the new modal

interface PajakMasukanData {
  id: number;
  tanggal: string;
  namaSupplier: string;
  nomorPO: string;
  nomorInvoice: string;
  nomorFP: string;
  nilaiDPP: number;
  nilaiPPN: number;
  keterangan: string;
}

const initialDummyData: PajakMasukanData[] = [
  { 
    id: 1, 
    tanggal: '2024-01-15', 
    namaSupplier: 'PT Supplier Maju', 
    nomorPO: 'PO-001/2024',
    nomorInvoice: 'INV-001/2024',
    nomorFP: 'FP-001/2024',
    nilaiDPP: 15000000,
    nilaiPPN: 1650000,
    keterangan: 'Pembelian bahan baku untuk produksi Q1'
  },
  { 
    id: 2, 
    tanggal: '2024-02-01', 
    namaSupplier: 'CV Tech Solusi', 
    nomorPO: 'PO-002/2024',
    nomorInvoice: 'INV-002/2024',
    nomorFP: 'FP-002/2024',
    nilaiDPP: 25000000,
    nilaiPPN: 2750000,
    keterangan: 'Konsultasi pengembangan sistem ERP'
  },
  { 
    id: 3, 
    tanggal: '2024-02-20', 
    namaSupplier: 'UD Rental Prima', 
    nomorPO: 'PO-003/2024',
    nomorInvoice: 'INV-003/2024',
    nomorFP: 'FP-003/2024',
    nilaiDPP: 5000000,
    nilaiPPN: 550000,
    keterangan: 'Sewa printer dan komputer untuk 6 bulan'
  },
  { 
    id: 4, 
    tanggal: '2024-03-10', 
    namaSupplier: 'PT Manufaktur Jaya', 
    nomorPO: 'PO-004/2024',
    nomorInvoice: 'INV-004/2024',
    nomorFP: 'FP-004/2024',
    nilaiDPP: 75000000,
    nilaiPPN: 8250000,
    keterangan: 'Mesin produksi otomatis untuk line A'
  },
  { 
    id: 5, 
    tanggal: '2024-03-25', 
    namaSupplier: 'Toko Logistik', 
    nomorPO: 'PO-005/2024',
    nomorInvoice: 'INV-005/2024',
    nomorFP: 'FP-005/2024',
    nilaiDPP: 8000000,
    nilaiPPN: 880000,
    keterangan: 'Rak gudang dan peralatan handling'
  },
  { 
    id: 6, 
    tanggal: '2024-04-05', 
    namaSupplier: 'Bengkel Sejahtera', 
    nomorPO: 'PO-006/2024',
    nomorInvoice: 'INV-006/2024',
    nomorFP: 'FP-006/2024',
    nilaiDPP: 3000000,
    nilaiPPN: 330000,
    keterangan: 'Service rutin kendaraan operasional'
  },
  { 
    id: 7, 
    tanggal: '2024-04-18', 
    namaSupplier: 'PT Software Cerdas', 
    nomorPO: 'PO-007/2024',
    nomorInvoice: 'INV-007/2024',
    nomorFP: 'FP-007/2024',
    nilaiDPP: 12000000,
    nilaiPPN: 1320000,
    keterangan: 'Lisensi software akuntansi untuk 1 tahun'
  },
  { 
    id: 8, 
    tanggal: '2024-05-02', 
    namaSupplier: 'Konveksi Indah', 
    nomorPO: 'PO-008/2024',
    nomorInvoice: 'INV-008/2024',
    nomorFP: 'FP-008/2024',
    nilaiDPP: 6000000,
    nilaiPPN: 660000,
    keterangan: 'Seragam kerja untuk 100 karyawan'
  },
  { 
    id: 9, 
    tanggal: '2024-05-10', 
    namaSupplier: 'Agency Kreatif', 
    nomorPO: 'PO-009/2024',
    nomorInvoice: 'INV-009/2024',
    nomorFP: 'FP-009/2024',
    nilaiDPP: 10000000,
    nilaiPPN: 1100000,
    keterangan: 'Campaign digital marketing Q2 2024'
  },
  { 
    id: 10, 
    tanggal: '2024-05-25', 
    namaSupplier: 'Stationery Mart', 
    nomorPO: 'PO-010/2024',
    nomorInvoice: 'INV-010/2024',
    nomorFP: 'FP-010/2024',
    nilaiDPP: 2000000,
    nilaiPPN: 220000,
    keterangan: 'Alat tulis kantor untuk bulan Mei'
  },
];

const PajakMasukanDashboard: React.FC = () => {
  const [data, setData] = useState<PajakMasukanData[]>(initialDummyData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PajakMasukanData | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PajakMasukanData | null>(null);

  const filteredData = data.filter(item => {
    const matchesSearch = item.namaSupplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.nomorPO.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.nomorInvoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.nomorFP.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.keterangan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const handleAddClick = () => {
    setItemToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditClick = (item: PajakMasukanData) => {
    setItemToEdit(item);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteClick = (item: PajakMasukanData) => {
    setItemToDelete(item);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleSaveItem = (newItem: Omit<PajakMasukanData, 'id'> & { id?: number }) => {
    if (newItem.id) {
      // Update existing item
      setData(prevData =>
        prevData.map(item => (item.id === newItem.id ? { ...newItem, id: item.id } as PajakMasukanData : item))
      );
    } else {
      // Add new item
      const newId = Math.max(...prevData.map(item => item.id), 0) + 1;
      setData(prevData => [...prevData, { ...newItem, id: newId } as PajakMasukanData]);
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setData(prevData => prevData.filter(item => item.id !== itemToDelete.id));
      setItemToDelete(null);
    }
    setIsConfirmDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Pajak Masukan
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Tax</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Pajak Masukan</span>
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
                placeholder="Cari supplier, PO, invoice, FP, atau keterangan..."
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
              onClick={handleAddClick} // Add handler for "Tambah" button
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
                    Tanggal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Supplier
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor PO
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor Invoice
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor FP
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai DPP
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai PPN
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keterangan
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.tanggal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.namaSupplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {item.nomorPO}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {item.nomorInvoice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {item.nomorFP}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-bold">
                      {formatCurrency(item.nilaiDPP)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-bold">
                      {formatCurrency(item.nilaiPPN)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={item.keterangan}>
                      {item.keterangan}
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
                          onClick={() => handleDeleteClick(item)}
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
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                      Tidak ada data Pajak Masukan yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <EntryPajakMasukanModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaSupplier}
      />
    </div>
  );
};

export default PajakMasukanDashboard;
