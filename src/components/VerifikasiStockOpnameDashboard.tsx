import React, { useState } from 'react';
import { Clock, Search, FileSpreadsheet, FileText, FileBarChart, CalendarDays, CheckSquare } from 'lucide-react';

const VerifikasiStockOpnameDashboard: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [kategoriFilter, setKategoriFilter] = useState("all");

  const stockOpnameData = [
    { no: 1, kodeBarang: 'BRG001', namaBarang: 'Barang A', kategori: 'Elektronik', hpp: 50000, stokTercatatQty: 10, stokTercatatHPP: 500000, stokFisikQty: 9, stokFisikHPP: 450000, selisihQty: -1, selisihHPP: -50000, keterangan: '-' },
    { no: 2, kodeBarang: 'BRG002', namaBarang: 'Barang B', kategori: 'Fashion', hpp: 30000, stokTercatatQty: 15, stokTercatatHPP: 450000, stokFisikQty: 16, stokFisikHPP: 480000, selisihQty: 1, selisihHPP: 30000, keterangan: '+' },
    { no: 3, kodeBarang: 'BRG003', namaBarang: 'Barang C', kategori: 'Makanan', hpp: 10000, stokTercatatQty: 50, stokTercatatHPP: 500000, stokFisikQty: 48, stokFisikHPP: 480000, selisihQty: -2, selisihHPP: -20000, keterangan: '-' },
    { no: 4, kodeBarang: 'BRG004', namaBarang: 'Barang D', kategori: 'Alat Tulis', hpp: 5000, stokTercatatQty: 30, stokTercatatHPP: 150000, stokFisikQty: 30, stokFisikHPP: 150000, selisihQty: 0, selisihHPP: 0, keterangan: 'OK' },
    { no: 5, kodeBarang: 'BRG005', namaBarang: 'Barang E', kategori: 'Perabot', hpp: 75000, stokTercatatQty: 5, stokTercatatHPP: 375000, stokFisikQty: 4, stokFisikHPP: 300000, selisihQty: -1, selisihHPP: -75000, keterangan: '-' },
  ];

  // Get unique categories for filter options
  const uniqueCategories = [...new Set(stockOpnameData.map(item => item.kategori))];

  // Filter data based on selected category
  const filteredData = kategoriFilter === "all" 
    ? stockOpnameData 
    : stockOpnameData.filter(item => item.kategori === kategoriFilter);

  const totalHPP = filteredData.reduce((sum, item) => sum + item.hpp, 0);
  const totalStokTercatatQty = filteredData.reduce((sum, item) => sum + item.stokTercatatQty, 0);
  const totalStokTercatatHPP = filteredData.reduce((sum, item) => sum + item.stokTercatatHPP, 0);
  const totalStokFisikQty = filteredData.reduce((sum, item) => sum + item.stokFisikQty, 0);
  const totalStokFisikHPP = filteredData.reduce((sum, item) => sum + item.stokFisikHPP, 0);

  const handleCheckboxChange = (no: number) => {
    setSelectedItems(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(no)) {
        newSelected.delete(no);
      } else {
        newSelected.add(no);
      }
      return newSelected;
    });
  };

  const handleVerifikasi = () => {
    console.log("Verifikasi items:", Array.from(selectedItems));
    // Add logic to process verification
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LAPORAN VERIFIKASI STOCK OPNAME
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Gudang</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Stock Opname</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Verifikasi Stock Opname</span>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label htmlFor="pilihTahun" className="block text-sm font-medium text-gray-700 mb-1">Pilih Tahun</label>
              <select
                id="pilihTahun"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih Tahun--</option>
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
            <div>
              <label htmlFor="pilihPeriode" className="block text-sm font-medium text-gray-700 mb-1">Pilih Periode</label>
              <select
                id="pilihPeriode"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih Periode--</option>
                <option>Januari</option>
                <option>Februari</option>
                <option>Maret</option>
              </select>
            </div>
            <div>
              <label htmlFor="pilihGudang" className="block text-sm font-medium text-gray-700 mb-1">Pilih Gudang</label>
              <select
                id="pilihGudang"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih Gudang--</option>
                <option>Gudang Proyek MEDCO</option>
                <option>Gudang Proyek SSB</option>
              </select>
            </div>
          </div>

          {/* Second Row - Filter Kategori and Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="filterKategori" className="block text-sm font-medium text-gray-700 mb-1">Filter Kategori</label>
              <select
                id="filterKategori"
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">--Semua Kategori--</option>
                {uniqueCategories.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label htmlFor="cariKeterangan" className="block text-sm font-medium text-gray-700 mb-1">Cari Keterangan</label>
              <input
                type="text"
                id="cariKeterangan"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Cari..."
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HPP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Tercatat (Qty)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Tercatat (HPP)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Fisik (Qty)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Fisik (HPP)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selisih (Qty)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selisih (HPP)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.no} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={selectedItems.has(item.no)}
                        onChange={() => handleCheckboxChange(item.no)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kodeBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.hpp.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stokTercatatQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stokTercatatHPP.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stokFisikQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stokFisikHPP.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.selisihQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.selisihHPP.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.keterangan}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gray-100 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan={5}>Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalHPP.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalStokTercatatQty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalStokTercatatHPP.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalStokFisikQty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalStokFisikHPP.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination and Verifikasi Button */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing 1 to {filteredData.length} of {filteredData.length} entries
              {kategoriFilter !== "all" && (
                <span className="ml-2 text-blue-600 font-medium">
                  (filtered by {kategoriFilter})
                </span>
              )}
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
            <button
              onClick={handleVerifikasi}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm shadow-md"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Verifikasi</span>
            </button>
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

export default VerifikasiStockOpnameDashboard;
