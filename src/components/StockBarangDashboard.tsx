import React, { useMemo, useState } from 'react';
import { Clock, Search, FileText, FileBarChart, FileSpreadsheet } from 'lucide-react';

// Gudang summary component (placed before usage to avoid hoisting issues)
type GudangKey = 'ALL' | 'MAIN' | 'PROYEK_A' | 'PROYEK_B' | 'PROYEK_C' | 'PROYEK_D';
interface StockItem {
  no: number;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  satuan: string;
  stockMain: number;
  stockProyekA: number;
  stockProyekB: number;
  stockProyekC: number;
  stockProyekD: number;
}

const GudangSummary: React.FC<{ selectedGudang: GudangKey; items: StockItem[] }> = ({ selectedGudang, items }) => {
  const totals = useMemo(() => {
    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    return {
      MAIN: sum(items.map(i => i.stockMain)),
      PROYEK_A: sum(items.map(i => i.stockProyekA)),
      PROYEK_B: sum(items.map(i => i.stockProyekB)),
      PROYEK_C: sum(items.map(i => i.stockProyekC)),
      PROYEK_D: sum(items.map(i => i.stockProyekD)),
    };
  }, [items]);

  const Card: React.FC<{ title: string; value: number; highlight?: boolean }> = ({ title, value, highlight }) => (
    <div className={`rounded-xl border p-4 shadow-sm ${highlight ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className={`text-2xl font-semibold ${highlight ? 'text-blue-700' : 'text-gray-900'}`}>{value.toLocaleString('id-ID')}</div>
    </div>
  );

  if (selectedGudang === 'ALL') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
        <Card title="Main" value={totals.MAIN} />
        <Card title="Proyek A" value={totals.PROYEK_A} />
        <Card title="Proyek B" value={totals.PROYEK_B} />
        <Card title="Proyek C" value={totals.PROYEK_C} />
        <Card title="Proyek D" value={totals.PROYEK_D} />
      </div>
    );
  }

  const mapTitle: Record<Exclude<GudangKey, 'ALL'>, string> = {
    MAIN: 'Main',
    PROYEK_A: 'Proyek A',
    PROYEK_B: 'Proyek B',
    PROYEK_C: 'Proyek C',
    PROYEK_D: 'Proyek D',
  };

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      <Card title={`Total ${mapTitle[selectedGudang as Exclude<GudangKey, 'ALL'>]}`} value={
        selectedGudang === 'MAIN' ? totals.MAIN :
        selectedGudang === 'PROYEK_A' ? totals.PROYEK_A :
        selectedGudang === 'PROYEK_B' ? totals.PROYEK_B :
        selectedGudang === 'PROYEK_C' ? totals.PROYEK_C :
        totals.PROYEK_D
      } highlight />
    </div>
  );
};

const StockBarangDashboard: React.FC = () => {
  const [selectedGudang, setSelectedGudang] = useState<'ALL' | 'MAIN' | 'PROYEK_A' | 'PROYEK_B' | 'PROYEK_C' | 'PROYEK_D'>('ALL');
  const [searchBarang, setSearchBarang] = useState('');
  const [searchKodeBarang, setSearchKodeBarang] = useState('');

  const allStockItems = [
    { no: 1, kodeBarang: 'GB001', namaBarang: 'Bolt M10 x 50', kategori: 'Sparepart', satuan: 'PCS', stockMain: 500, stockProyekA: 120, stockProyekB: 80, stockProyekC: 150, stockProyekD: 100 },
    { no: 2, kodeBarang: 'GB002', namaBarang: 'Bearing 6203', kategori: 'Sparepart', satuan: 'PCS', stockMain: 300, stockProyekA: 90, stockProyekB: 60, stockProyekC: 100, stockProyekD: 50 },
    { no: 3, kodeBarang: 'GB003', namaBarang: 'Grease Shell Gadus', kategori: 'Pelumas', satuan: 'Kg', stockMain: 200, stockProyekA: 40, stockProyekB: 30, stockProyekC: 70, stockProyekD: 60 },
    { no: 4, kodeBarang: 'GB004', namaBarang: 'Welding Rod E6013', kategori: 'Material', satuan: 'Kg', stockMain: 150, stockProyekA: 30, stockProyekB: 20, stockProyekC: 50, stockProyekD: 50 },
    { no: 5, kodeBarang: 'GB005', namaBarang: 'Hydraulic Oil AW 68', kategori: 'Pelumas', satuan: 'Liter', stockMain: 250, stockProyekA: 50, stockProyekB: 40, stockProyekC: 80, stockProyekD: 80 },
  ];

  // Filter data berdasarkan pencarian
  const filteredStockItems = useMemo(() => {
    return allStockItems.filter(item => {
      const matchKodeBarang = searchKodeBarang === '' || 
        item.kodeBarang.toLowerCase().includes(searchKodeBarang.toLowerCase());
      
      const matchNamaBarang = searchBarang === '' || 
        item.namaBarang.toLowerCase().includes(searchBarang.toLowerCase());
      
      return matchKodeBarang && matchNamaBarang;
    });
  }, [searchBarang, searchKodeBarang]);

  const stockItems = filteredStockItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LAPORAN STOK PERGUDANG
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Gudang</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Barang</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Laporan Stok Pergudang</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Gudang Summary */}
          <GudangSummary selectedGudang={selectedGudang} items={stockItems} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Unified Filter Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2 text-blue-600" />
              Panel Pencarian Laporan Stok
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🏢 Filter Gudang</label>
                <select
                  value={selectedGudang}
                  onChange={(e) => setSelectedGudang(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="ALL">Semua Gudang</option>
                  <option value="MAIN">Main</option>
                  <option value="PROYEK_A">Proyek A</option>
                  <option value="PROYEK_B">Proyek B</option>
                  <option value="PROYEK_C">Proyek C</option>
                  <option value="PROYEK_D">Proyek D</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">🔢 Kode Barang</label>
                <input
                  type="text"
                  value={searchKodeBarang}
                  onChange={(e) => setSearchKodeBarang(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Cari kode barang"
                />
                <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">📦 Nama Barang</label>
                <input
                  type="text"
                  value={searchBarang}
                  onChange={(e) => setSearchBarang(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Cari nama barang"
                />
                <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  <option>--Pilih Kategori--</option>
                  <option>Sparepart</option>
                  <option>Pelumas</option>
                  <option>Material</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                <select className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  <option>--Pilih Satuan--</option>
                  <option>PCS</option>
                  <option>Kg</option>
                  <option>Liter</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {(searchKodeBarang || searchBarang) && (
                  <div className="flex items-center space-x-2">
                    <span>📊 Hasil: {stockItems.length} item</span>
                    {searchKodeBarang && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Kode: "{searchKodeBarang}"
                      </span>
                    )}
                    {searchBarang && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        Nama: "{searchBarang}"
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button 
                onClick={() => { 
                  setSearchBarang(''); 
                  setSearchKodeBarang(''); 
                  setSelectedGudang('ALL'); 
                }}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end space-x-3 mb-6">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm">
              <FileText className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Main</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Proyek A</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Proyek B</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Proyek C</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Proyek D</th>
                  {selectedGudang !== 'ALL' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Gudang Terpilih</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockItems.map((item) => {
                  const selectedValue =
                    selectedGudang === 'MAIN' ? item.stockMain :
                    selectedGudang === 'PROYEK_A' ? item.stockProyekA :
                    selectedGudang === 'PROYEK_B' ? item.stockProyekB :
                    selectedGudang === 'PROYEK_C' ? item.stockProyekC :
                    selectedGudang === 'PROYEK_D' ? item.stockProyekD : undefined;
                  return (
                    <tr key={item.no} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.no}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kodeBarang}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaBarang}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kategori}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.satuan}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${selectedGudang==='MAIN' ? 'text-blue-700 font-semibold' : 'text-gray-900'}`}>{item.stockMain}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${selectedGudang==='PROYEK_A' ? 'text-blue-700 font-semibold' : 'text-gray-900'}`}>{item.stockProyekA}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${selectedGudang==='PROYEK_B' ? 'text-blue-700 font-semibold' : 'text-gray-900'}`}>{item.stockProyekB}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${selectedGudang==='PROYEK_C' ? 'text-blue-700 font-semibold' : 'text-gray-900'}`}>{item.stockProyekC}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${selectedGudang==='PROYEK_D' ? 'text-blue-700 font-semibold' : 'text-gray-900'}`}>{item.stockProyekD}</td>
                      {selectedGudang !== 'ALL' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedValue}</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing 1 to {stockItems.length} of {stockItems.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Previous
              </button>
              <button className="px-4 py-2 border border-blue-500 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200">
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

export default StockBarangDashboard;
