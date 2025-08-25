import React from 'react';
import { Clock, Search, FileSpreadsheet, FileText, FileBarChart, CalendarDays } from 'lucide-react';

const LaporanSemuaStockDashboard: React.FC = () => {
  const stockData = [
    {
      namaBarang: 'Barang A', kategori: 'Elektronik', hpp: 50000, stokAwal: 100, nilaiAwal: 5000000,
      stokMasuk: 20, nilaiMasuk: 1000000, stokKeluar: 30, nilaiKeluar: 1500000,
      selisihOpnameMasuk: 5, nilaiOpnameMasuk: 250000, selisihOpnameKeluar: 0, nilaiOpnameKeluar: 0
    },
    {
      namaBarang: 'Barang B', kategori: 'Fashion', hpp: 30000, stokAwal: 150, nilaiAwal: 4500000,
      stokMasuk: 30, nilaiMasuk: 900000, stokKeluar: 40, nilaiKeluar: 1200000,
      selisihOpnameMasuk: 4, nilaiOpnameMasuk: 120000, selisihOpnameKeluar: 0, nilaiOpnameKeluar: 0
    },
    {
      namaBarang: 'Barang C', kategori: 'Otomotif', hpp: 70000, stokAwal: 80, nilaiAwal: 5600000,
      stokMasuk: 25, nilaiMasuk: 1750000, stokKeluar: 20, nilaiKeluar: 1400000,
      selisihOpnameMasuk: 3, nilaiOpnameMasuk: 210000, selisihOpnameKeluar: 0, nilaiOpnameKeluar: 0
    },
  ];

  const calculateTotal = (key: keyof typeof stockData[0]) => {
    return stockData.reduce((sum, item) => sum + (item[key] as number), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LAPORAN SEMUA STOK
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Gudang</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Stock Opname</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Laporan Semua Stok</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <label htmlFor="cariNamaBarang" className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Barang</label>
              <input
                type="text"
                id="cariNamaBarang"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Excavator"
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div>
              <label htmlFor="pilihKategoriBarang" className="block text-sm font-medium text-gray-700 mb-1">Pilih Kategori Barang</label>
              <select
                id="pilihKategoriBarang"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih Kategori Barang--</option>
                <option>Elektronik</option>
                <option>Fashion</option>
                <option>Otomotif</option>
              </select>
            </div>
          </div>

          {/* Periode and Search Button */}
          <div className="flex items-end space-x-4 mb-6">
            <div className="relative flex-1">
              <label htmlFor="periodeStart" className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <div className="flex items-center space-x-2">
                <div className="relative w-1/2">
                  <input
                    type="date"
                    id="periodeStart"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    defaultValue="2025-03-03"
                  />
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <span className="text-gray-500">s.d</span>
                <div className="relative w-1/2">
                  <input
                    type="date"
                    id="periodeEnd"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    defaultValue="2025-03-03"
                  />
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md">
              Search
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end items-center mb-6 space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm shadow-md">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md">
              <FileText className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm shadow-md">
              <FileBarChart className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Show</span>
                <select className="border border-gray-300 rounded-md px-2 py-1">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span>entries</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search:"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HPP (RP)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Awal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai (Rp)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Masuk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai (Rp)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Keluar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai (Rp)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selisih Opname Masuk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai (Rp)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selisih Opname Keluar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai (Rp)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.hpp.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stokAwal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nilaiAwal.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stokMasuk}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nilaiMasuk.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stokKeluar}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nilaiKeluar.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.selisihOpnameMasuk}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nilaiOpnameMasuk.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.selisihOpnameKeluar}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nilaiOpnameKeluar.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gray-100 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan={3}>Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateTotal('stokAwal')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateTotal('nilaiAwal').toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateTotal('stokMasuk')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateTotal('nilaiMasuk').toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateTotal('stokKeluar')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateTotal('nilaiKeluar').toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateTotal('selisihOpnameMasuk')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateTotal('nilaiOpnameMasuk').toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateTotal('selisihOpnameKeluar')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateTotal('nilaiOpnameKeluar').toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing 1 to {stockData.length} of {stockData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm">
                Previous
              </button>
              <button className="px-4 py-2 border border-blue-500 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500 flex justify-between items-center">
        <span>2023 © Mazer</span>
        <span>
          Crafted with <span className="text-red-500">❤️</span> by Saugi
        </span>
      </footer>
    </div>
  );
};

export default LaporanSemuaStockDashboard;
