import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, FileText, FileSpreadsheet, FileDown, Clock } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EntryPajakMasukanModal from './EntryPajakMasukanModal'; // Import the new modal

interface PajakMasukanData {
  id: number;
  namaPengadaan: string;
  tanggal: string;
  vendor: string;
  npwp: string;
  ppn: number; // Changed to number for better handling (e.g., 0.11 for 11%)
  nilaiProject: number;
  keterangan: string;
  noInvoice: string;
}

const initialDummyData: PajakMasukanData[] = [
  { 
    id: 1, 
    namaPengadaan: 'Pembelian Bahan Baku A', 
    tanggal: '2024-01-15', 
    vendor: 'PT Supplier Maju', 
    npwp: '01.234.567.8-901.000',
    ppn: 0.11, 
    nilaiProject: 15000000,
    keterangan: 'Pembelian bahan baku untuk produksi Q1',
    noInvoice: 'INV-001/2024'
  },
  { 
    id: 2, 
    namaPengadaan: 'Jasa Konsultan IT', 
    tanggal: '2024-02-01', 
    vendor: 'CV Tech Solusi', 
    npwp: '02.345.678.9-012.000',
    ppn: 0.11, 
    nilaiProject: 25000000,
    keterangan: 'Konsultasi pengembangan sistem ERP',
    noInvoice: 'INV-002/2024'
  },
  { 
    id: 3, 
    namaPengadaan: 'Sewa Peralatan Kantor', 
    tanggal: '2024-02-20', 
    vendor: 'UD Rental Prima', 
    npwp: '03.456.789.0-123.000',
    ppn: 0.11, 
    nilaiProject: 5000000,
    keterangan: 'Sewa printer dan komputer untuk 6 bulan',
    noInvoice: 'INV-003/2024'
  },
  { 
    id: 4, 
    namaPengadaan: 'Pengadaan Mesin Produksi', 
    tanggal: '2024-03-10', 
    vendor: 'PT Manufaktur Jaya', 
    npwp: '04.567.890.1-234.000',
    ppn: 0.11, 
    nilaiProject: 75000000,
    keterangan: 'Mesin produksi otomatis untuk line A',
    noInvoice: 'INV-004/2024'
  },
  { 
    id: 5, 
    namaPengadaan: 'Pembelian Perlengkapan Gudang', 
    tanggal: '2024-03-25', 
    vendor: 'Toko Logistik', 
    npwp: '05.678.901.2-345.000',
    ppn: 0.11, 
    nilaiProject: 8000000,
    keterangan: 'Rak gudang dan peralatan handling',
    noInvoice: 'INV-005/2024'
  },
  { 
    id: 6, 
    namaPengadaan: 'Jasa Perbaikan Kendaraan', 
    tanggal: '2024-04-05', 
    vendor: 'Bengkel Sejahtera', 
    npwp: '06.789.012.3-456.000',
    ppn: 0.11, 
    nilaiProject: 3000000,
    keterangan: 'Service rutin kendaraan operasional',
    noInvoice: 'INV-006/2024'
  },
  { 
    id: 7, 
    namaPengadaan: 'Pembelian Software Akuntansi', 
    tanggal: '2024-04-18', 
    vendor: 'PT Software Cerdas', 
    npwp: '07.890.123.4-567.000',
    ppn: 0.11, 
    nilaiProject: 12000000,
    keterangan: 'Lisensi software akuntansi untuk 1 tahun',
    noInvoice: 'INV-007/2024'
  },
  { 
    id: 8, 
    namaPengadaan: 'Pengadaan Seragam Karyawan', 
    tanggal: '2024-05-02', 
    vendor: 'Konveksi Indah', 
    npwp: '08.901.234.5-678.000',
    ppn: 0.11, 
    nilaiProject: 6000000,
    keterangan: 'Seragam kerja untuk 100 karyawan',
    noInvoice: 'INV-008/2024'
  },
  { 
    id: 9, 
    namaPengadaan: 'Biaya Pemasaran Digital', 
    tanggal: '2024-05-10', 
    vendor: 'Agency Kreatif', 
    npwp: '09.012.345.6-789.000',
    ppn: 0.11, 
    nilaiProject: 10000000,
    keterangan: 'Campaign digital marketing Q2 2024',
    noInvoice: 'INV-009/2024'
  },
  { 
    id: 10, 
    namaPengadaan: 'Pembelian ATK Bulanan', 
    tanggal: '2024-05-25', 
    vendor: 'Stationery Mart', 
    npwp: '10.123.456.7-890.000',
    ppn: 0.11, 
    nilaiProject: 2000000,
    keterangan: 'Alat tulis kantor untuk bulan Mei',
    noInvoice: 'INV-010/2024'
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
    const matchesSearch = item.namaPengadaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.npwp.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.noInvoice.toLowerCase().includes(searchTerm.toLowerCase());
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
                placeholder="Cari pengadaan, vendor, NPWP, invoice, atau keterangan..."
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
                    Nama Pengadaan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NPWP
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PPN
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Invoice
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.namaPengadaan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.tanggal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {item.npwp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.ppn * 100}% {/* Display PPN as percentage */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(item.nilaiProject)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {item.noInvoice}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={item.keterangan}>
                      {item.keterangan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditClick(item)} // Add handler for "Edit" button
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150 p-1 rounded-full hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)} // Add handler for "Hapus" button
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
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
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
        itemName={itemToDelete?.namaPengadaan}
      />
    </div>
  );
};

export default PajakMasukanDashboard;
