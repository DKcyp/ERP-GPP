import React, { useState } from 'react';
import { Clock, FileText, FileBarChart, FileSpreadsheet, Eye, CalendarDays, AlertTriangle, Plus } from 'lucide-react';
import EntryBarangDibuangModal, { BarangDibuangItemInput } from './EntryBarangDibuangModal';

const BarangDibuangDashboard: React.FC = () => {
  const [barangDibuangItems, setBarangDibuangItems] = useState<Array<{
    no: number;
    kodeBarang: string;
    namaBarang: string;
    kategori: string;
    satuan: string;
    sumber: string;
    tanggalDibuang: string;
    catatan: string;
    jumlah?: number;
  }>>([
    { no: 1, kodeBarang: 'BRG001', namaBarang: 'Body Shiled', kategori: 'APD', satuan: 'Unit', sumber: 'Karantina', tanggalDibuang: '01-02-2025', catatan: 'Tidak dapat diperbaiki' },
    { no: 2, kodeBarang: 'BRG003', namaBarang: 'Sepatu Boot', kategori: 'APD', satuan: 'Unit', sumber: 'Timesheet', tanggalDibuang: '02-02-2025', catatan: 'Tidak dapat diperbaiki' },
    { no: 3, kodeBarang: 'BRG002', namaBarang: 'Helm Proyek', kategori: 'APD', satuan: 'Unit', sumber: 'Pengembalian Barang', tanggalDibuang: '02-02-2025', catatan: 'Retak tidak aman' },
    // Sample items to trigger warning badge
    { no: 4, kodeBarang: 'CHM001', namaBarang: 'Solvent X', kategori: 'Chemical', satuan: 'Liter', sumber: 'Karantina', tanggalDibuang: '03-02-2025', catatan: 'Melebihi tanggal kadaluarsa' },
    { no: 5, kodeBarang: 'B3001', namaBarang: 'Baterai Industri', kategori: 'B3', satuan: 'Unit', sumber: 'Pengembalian Barang', tanggalDibuang: '04-02-2025', catatan: 'Kerusakan berat' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatToDDMMYYYY = (yyyyMmDd: string) => {
    const [y, m, d] = yyyyMmDd.split('-');
    if (!y || !m || !d) return yyyyMmDd;
    return `${d}-${m}-${y}`;
  };

  const handleSave = (data: BarangDibuangItemInput) => {
    const nextNo = (barangDibuangItems[0]?.no || 0) + 1;
    const newItem = {
      no: nextNo,
      kodeBarang: data.kodeBarang || `NEW${String(Date.now()).slice(-3)}`,
      namaBarang: data.namaBarang,
      kategori: data.kategori,
      satuan: data.satuan,
      sumber: data.sumber,
      tanggalDibuang: formatToDDMMYYYY(data.tanggalDibuang),
      catatan: data.catatan || '-',
      jumlah: data.jumlah ?? 1,
    };
    setBarangDibuangItems(prev => [
      newItem,
      ...prev.map(p => ({ ...p, no: p.no + 1 })),
    ]);
  };

  const isB3Category = (kategori: string) => {
    const key = (kategori || '').toLowerCase();
    return key === 'chemical' || key === 'b3';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                BARANG DIBUANG
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Gudang</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Pengembalian Barang</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Barang Dibuang</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <label htmlFor="kodeBarang" className="block text-xs font-medium text-gray-700 mb-1">Cari Kode Barang</label>
              <input
                type="text"
                id="kodeBarang"
                className="px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                placeholder="BRG001"
              />
            </div>
            <div className="relative">
              <label htmlFor="namaBarang" className="block text-xs font-medium text-gray-700 mb-1">Cari Nama Barang</label>
              <input
                type="text"
                id="namaBarang"
                className="px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                placeholder="Excavator"
              />
            </div>
            <div>
              <label htmlFor="sumberBarang" className="block text-xs font-medium text-gray-700 mb-1">Pilih Sumber Barang</label>
              <select
                id="sumberBarang"
                className="px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
              >
                <option>Timesheet</option>
                <option>Karantina</option>
                <option>Pengembalian Barang</option>
              </select>
            </div>
          </div>

          {/* Periode and Search/Tambah Buttons */}
          <div className="flex items-end space-x-2 mb-4">
            <div className="relative flex-1">
              <label htmlFor="periodeStart" className="block text-xs font-medium text-gray-700 mb-1">Periode</label>
              <div className="flex items-center space-x-2">
                <div className="relative w-1/2">
                  <input
                    type="date"
                    id="periodeStart"
                    className="pl-7 pr-2 py-1 h-7 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-[11px]"
                    defaultValue="2025-03-03"
                  />
                  <CalendarDays className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                </div>
                <span className="text-gray-500 text-[11px]">s.d</span>
                <div className="relative w-1/2">
                  <input
                    type="date"
                    id="periodeEnd"
                    className="pl-7 pr-2 py-1 h-7 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-[11px]"
                    defaultValue="2025-03-03"
                  />
                  <CalendarDays className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                </div>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-xs shadow-sm">
              Search
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-xs shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end items-center mb-4 space-x-2.5">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-xs shadow-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel</span>
            </button>
            <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-xs shadow-sm">
              <FileText className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-xs shadow-sm">
              <FileBarChart className="h-4 w-4" />
              <span>PDF</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>Show</span>
                <select className="border border-gray-300 rounded-md px-2 py-1 text-xs">
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
                  className="px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                />
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Warning</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Sumber</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuang</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {barangDibuangItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.no}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.kodeBarang}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.namaBarang}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.kategori}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                      {isB3Category(item.kategori) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-800 text-[10px] font-medium border border-yellow-200">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Prosedur B3
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.satuan}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.jumlah ?? 1}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.sumber}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.tanggalDibuang}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.catatan}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                      <button className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs shadow-sm">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-gray-600">
              Showing 1 to {barangDibuangItems.length} of {barangDibuangItems.length} entries
            </div>
            <div className="flex items-center space-x-1.5">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-xs">
                Previous
              </button>
              <button className="px-3 py-1.5 border border-blue-500 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-xs">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-xs">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <EntryBarangDibuangModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

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

export default BarangDibuangDashboard;
