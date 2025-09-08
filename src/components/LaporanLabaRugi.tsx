import React, { useState } from 'react';
import { Search, Calendar, FileDown, Printer } from 'lucide-react';

interface LaporanLabaRugiProps {
  role?: string;
}

interface LabaRugiData {
  id: number;
  kodeAkun: string;
  namaAkun: string;
  nominal: number;
  tipe: 'pendapatan' | 'beban' | 'laba';
}

const initialLabaRugiData: LabaRugiData[] = [
  { id: 1, kodeAkun: '4-1000', namaAkun: 'Pendapatan Usaha', nominal: 50000000, tipe: 'pendapatan' },
  { id: 2, kodeAkun: '5-1000', namaAkun: 'Harga Pokok Penjualan', nominal: 25000000, tipe: 'beban' },
  { id: 3, kodeAkun: '5-2000', namaAkun: 'Beban Gaji', nominal: 10000000, tipe: 'beban' },
  { id: 4, kodeAkun: '5-3000', namaAkun: 'Beban Listrik', nominal: 2000000, tipe: 'beban' },
  { id: 5, kodeAkun: '5-4000', namaAkun: 'Beban Sewa', nominal: 3000000, tipe: 'beban' },
];

const LaporanLabaRugi: React.FC<LaporanLabaRugiProps> = ({ role }) => {
  const [labaRugiData, setLabaRugiData] = useState<LabaRugiData[]>(initialLabaRugiData);
  const [searchTerm, setSearchTerm] = useState('');
  const [cabang, setCabang] = useState('');
  const [periode, setPeriode] = useState({
    startDate: '',
    endDate: ''
  });

  // Calculate totals
  const totalPendapatan = labaRugiData
    .filter(item => item.tipe === 'pendapatan')
    .reduce((sum, item) => sum + item.nominal, 0);

  const totalBeban = labaRugiData
    .filter(item => item.tipe === 'beban')
    .reduce((sum, item) => sum + item.nominal, 0);

  const labaBersih = totalPendapatan - totalBeban;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Handle search
  const handleSearch = () => {
    // In a real app, you would fetch data based on search criteria
    console.log('Searching with:', { searchTerm, cabang, periode });
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">LAPORAN LABA RUGI</h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Cari Akun</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cari nama akun..."
                />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Cabang/Unit Usaha */}
            <div>
              <label htmlFor="cabang" className="block text-sm font-medium text-gray-700 mb-1">Cabang/Unit Usaha</label>
              <select
                id="cabang"
                value={cabang}
                onChange={(e) => setCabang(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Cabang</option>
                <option value="pusat">Pusat</option>
                <option value="cabang1">Cabang 1</option>
                <option value="cabang2">Cabang 2</option>
              </select>
            </div>

            {/* Periode */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="date"
                    value={periode.startDate}
                    onChange={(e) => setPeriode({...periode, startDate: e.target.value})}
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={periode.endDate}
                    onChange={(e) => setPeriode({...periode, endDate: e.target.value})}
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </span>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-4 flex justify-end">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-sm"
              >
                Tampilkan Laporan
              </button>
            </div>
          </div>
        </div>

        {/* Report Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Laporan Laba Rugi {cabang ? `- ${cabang}` : ''}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Printer size={16} />
                <span>Cetak</span>
              </button>
              <button className="flex items-center gap-2 text-sm px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                <FileDown size={16} />
                <span>Export Excel</span>
              </button>
              <button className="flex items-center gap-2 text-sm px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                <FileDown size={16} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Report Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th scope="col" className="px-6 py-3 w-1/12">No</th>
                  <th scope="col" className="px-6 py-3 w-2/12">Kode Akun</th>
                  <th scope="col" className="px-6 py-3 w-5/12">Nama Akun</th>
                  <th scope="col" className="px-6 py-3 text-right w-4/12">Nominal</th>
                </tr>
              </thead>
              <tbody>
                {/* Pendapatan Section */}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-6 py-2 font-semibold text-gray-700 bg-gray-100">
                    PENDAPATAN
                  </td>
                </tr>
                {labaRugiData
                  .filter(item => item.tipe === 'pendapatan')
                  .map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{item.kodeAkun}</td>
                      <td className="px-6 py-4">{item.namaAkun}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(item.nominal)}</td>
                    </tr>
                  ))}
                <tr className="font-semibold bg-gray-50">
                  <td colSpan={3} className="px-6 py-2 text-right">Total Pendapatan</td>
                  <td className="px-6 py-2 text-right">{formatCurrency(totalPendapatan)}</td>
                </tr>

                {/* Beban Section */}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-6 py-2 font-semibold text-gray-700 bg-gray-100">
                    BEBAN
                  </td>
                </tr>
                {labaRugiData
                  .filter(item => item.tipe === 'beban')
                  .map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {labaRugiData.filter(i => i.tipe === 'pendapatan').length + index + 1}
                      </td>
                      <td className="px-6 py-4">{item.kodeAkun}</td>
                      <td className="px-6 py-4">{item.namaAkun}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(item.nominal)}</td>
                    </tr>
                  ))}
                <tr className="font-semibold bg-gray-50">
                  <td colSpan={3} className="px-6 py-2 text-right">Total Beban</td>
                  <td className="px-6 py-2 text-right">{formatCurrency(totalBeban)}</td>
                </tr>

                {/* Laba/Rugi Section */}
                <tr className="bg-gray-100 font-bold text-lg">
                  <td colSpan={3} className="px-6 py-3 text-right">
                    {labaBersih >= 0 ? 'LABA BERSIH' : 'RUGI BERSIH'}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className={labaBersih >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(Math.abs(labaBersih))}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Report Summary */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Keterangan:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Laporan ini menampilkan ringkasan laba rugi periode {periode.startDate || '...'} s/d {periode.endDate || '...'}</li>
              <li>Total pendapatan diperoleh dari seluruh pendapatan usaha</li>
              <li>Total beban mencakup semua biaya operasional dan non-operasional</li>
              <li>Laba/Rugi bersih dihitung dari total pendapatan dikurangi total beban</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanLabaRugi;
