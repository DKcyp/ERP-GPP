import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, FileText, FileSpreadsheet, FileDown, Clock } from 'lucide-react';

interface PajakMasukanData {
  id: number;
  namaPengadaan: string;
  tanggal: string;
  vendor: string;
  ppn: string;
  nilaiProject: number;
}

const dummyData: PajakMasukanData[] = [
  { id: 1, namaPengadaan: 'Pembelian Bahan Baku A', tanggal: '2024-01-15', vendor: 'PT Supplier Maju', ppn: '11%', nilaiProject: 15000000 },
  { id: 2, namaPengadaan: 'Jasa Konsultan IT', tanggal: '2024-02-01', vendor: 'CV Tech Solusi', ppn: '11%', nilaiProject: 25000000 },
  { id: 3, namaPengadaan: 'Sewa Peralatan Kantor', tanggal: '2024-02-20', vendor: 'UD Rental Prima', ppn: '11%', nilaiProject: 5000000 },
  { id: 4, namaPengadaan: 'Pengadaan Mesin Produksi', tanggal: '2024-03-10', vendor: 'PT Manufaktur Jaya', ppn: '11%', nilaiProject: 75000000 },
  { id: 5, namaPengadaan: 'Pembelian Perlengkapan Gudang', tanggal: '2024-03-25', vendor: 'Toko Logistik', ppn: '11%', nilaiProject: 8000000 },
  { id: 6, namaPengadaan: 'Jasa Perbaikan Kendaraan', tanggal: '2024-04-05', vendor: 'Bengkel Sejahtera', ppn: '11%', nilaiProject: 3000000 },
  { id: 7, namaPengadaan: 'Pembelian Software Akuntansi', tanggal: '2024-04-18', vendor: 'PT Software Cerdas', ppn: '11%', nilaiProject: 12000000 },
  { id: 8, namaPengadaan: 'Pengadaan Seragam Karyawan', tanggal: '2024-05-02', vendor: 'Konveksi Indah', ppn: '11%', nilaiProject: 6000000 },
  { id: 9, namaPengadaan: 'Biaya Pemasaran Digital', tanggal: '2024-05-10', vendor: 'Agency Kreatif', ppn: '11%', nilaiProject: 10000000 },
  { id: 10, namaPengadaan: 'Pembelian ATK Bulanan', tanggal: '2024-05-25', vendor: 'Stationery Mart', ppn: '11%', nilaiProject: 2000000 },
];

const PajakMasukanDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredData = dummyData.filter(item => {
    const matchesSearch = item.namaPengadaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    // Add more filter logic if 'filterStatus' was implemented for specific criteria
    return matchesSearch;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
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
                placeholder="Cari pengadaan atau vendor..."
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
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
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
                    PPN
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai Project
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.ppn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(item.nilaiProject)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors duration-150 p-1 rounded-full hover:bg-blue-100">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors duration-150 p-1 rounded-full hover:bg-red-100">
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
    </div>
  );
};

export default PajakMasukanDashboard;
