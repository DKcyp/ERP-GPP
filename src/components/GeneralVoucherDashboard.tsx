import React from 'react';
import { Search, CalendarDays, FileText, FileSpreadsheet, FileDown } from 'lucide-react';

interface VoucherEntry {
  no: number;
  noVoucher: string;
  noSO: string;
  noSOTurunan: string;
  namaProject: string;
  namaPemohon: string;
  tglPengajuanVoucher: string;
  tglPembayaranVoucher: string;
  tglExpired: string;
  tglLaporanExpense: string;
  nominal: string;
  keterangan: string;
}

const GeneralVoucherDashboard: React.FC = () => {
  const voucherData: VoucherEntry[] = [
    {
      no: 1,
      noVoucher: 'VCH001',
      noSO: 'SO001',
      noSOTurunan: '-',
      namaProject: 'Project A',
      namaPemohon: 'Abdul Karim',
      tglPengajuanVoucher: '10-01-2025',
      tglPembayaranVoucher: '15-01-2025',
      tglExpired: '25-01-2025',
      tglLaporanExpense: '30-01-2025',
      nominal: 'Rp 20,000,000',
      keterangan: 'Tugas Luar Kota',
    },
    {
      no: 2,
      noVoucher: 'VCH002',
      noSO: 'SO002',
      noSOTurunan: 'SO002.4',
      namaProject: 'Project B',
      namaPemohon: 'Juna Saputra',
      tglPengajuanVoucher: '10-01-2025',
      tglPembayaranVoucher: '15-01-2025',
      tglExpired: '25-01-2025',
      tglLaporanExpense: '30-01-2025',
      nominal: 'Rp 25,000,000',
      keterangan: 'Tugas Luar Kota',
    },
    {
      no: 3,
      noVoucher: 'VCH003',
      noSO: 'SO003',
      noSOTurunan: 'SO003.12',
      namaProject: 'Inspeksi Rope Access',
      namaPemohon: 'Rizky Andrian',
      tglPengajuanVoucher: '12-02-2025',
      tglPembayaranVoucher: '17-02-2025',
      tglExpired: '27-02-2025',
      tglLaporanExpense: '05-03-2025',
      nominal: 'Rp 15,000,000',
      keterangan: 'Perjalanan Dinas ke Site',
    },
    {
      no: 4,
      noVoucher: 'VCH004',
      noSO: '-',
      noSOTurunan: '-',
      namaProject: 'Training Keselamatan Kerja',
      namaPemohon: 'Hendra Prasetyo',
      tglPengajuanVoucher: '15-02-2025',
      tglPembayaranVoucher: '20-02-2025',
      tglExpired: '01-03-2025',
      tglLaporanExpense: '07-03-2025',
      nominal: 'Rp 30,000,000',
      keterangan: 'Pelatihan Internal',
    },
    {
      no: 5,
      noVoucher: 'VCH005',
      noSO: 'SO005',
      noSOTurunan: '-',
      namaProject: 'Audit Sistem Manajemen K3',
      namaPemohon: 'Indra Wijaya',
      tglPengajuanVoucher: '18-02-2025',
      tglPembayaranVoucher: '23-02-2025',
      tglExpired: '05-03-2025',
      tglLaporanExpense: '12-03-2025',
      nominal: 'Rp 22,000,000',
      keterangan: 'Proyek Audit K3',
    },
    {
      no: 6,
      noVoucher: 'VCH006',
      noSO: 'SO006',
      noSOTurunan: 'SO006.13',
      namaProject: 'Pemeliharaan Struktur Baja',
      namaPemohon: 'Doni Saputra',
      tglPengajuanVoucher: '22-02-2025',
      tglPembayaranVoucher: '27-02-2025',
      tglExpired: '10-03-2025',
      tglLaporanExpense: '17-03-2025',
      nominal: 'Rp 18,500,000',
      keterangan: 'Pemeliharaan Rutin',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard Voucher</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Cari No Voucher */}
            <div>
              <label htmlFor="noVoucher" className="block text-sm font-medium text-gray-700 mb-2">Cari No Voucher</label>
              <div className="relative">
                <input
                  type="text"
                  id="noVoucher"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                  placeholder="VCH001"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Cari No SO */}
            <div>
              <label htmlFor="noSO" className="block text-sm font-medium text-gray-700 mb-2">Cari No SO</label>
              <div className="relative">
                <input
                  type="text"
                  id="noSO"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                  placeholder="SO001"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Cari No SO Turunan */}
            <div>
              <label htmlFor="noSOTurunan" className="block text-sm font-medium text-gray-700 mb-2">Cari No SO Turunan</label>
              <div className="relative">
                <input
                  type="text"
                  id="noSOTurunan"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                  placeholder="SO001.12"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Cari Nama Project */}
            <div>
              <label htmlFor="namaProject" className="block text-sm font-medium text-gray-700 mb-2">Cari Nama Project</label>
              <div className="relative">
                <input
                  type="text"
                  id="namaProject"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                  placeholder="Proyek Medco"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Cari Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Cari Status</label>
              <select
                id="status"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              >
                <option>--Pilih Status--</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          {/* Periode and Search Button */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="periodeStart" className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                <div className="relative">
                  <input
                    type="text"
                    id="periodeStart"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                    placeholder="03/03/2025"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm md:mt-8">s.d</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="periodeEnd"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                    placeholder="03/03/2025"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-500 text-white font-medium rounded-xl shadow-md hover:bg-blue-600 transition-colors duration-300 w-full md:w-auto">
              Search
            </button>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end space-x-3 mb-6">
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-xl shadow-md hover:bg-green-700 transition-colors duration-300">
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-300">
            <FileText className="h-4 w-4 mr-2" /> Export CSV
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-xl shadow-md hover:bg-red-700 transition-colors duration-300">
            <FileDown className="h-4 w-4 mr-2" /> Export PDF
          </button>
        </div>

        {/* Voucher Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <span>Show</span>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-gray-50">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">No <span className="text-blue-500">↑</span></th>
                  <th className="px-4 py-3 text-left">No Voucher</th>
                  <th className="px-4 py-3 text-left">No SO</th>
                  <th className="px-4 py-3 text-left">No SO Turunan</th>
                  <th className="px-4 py-3 text-left">Nama Project</th>
                  <th className="px-4 py-3 text-left">Nama Pemohon</th>
                  <th className="px-4 py-3 text-left">Tgl Pengajuan Voucher</th>
                  <th className="px-4 py-3 text-left">Tgl Pembayaran Voucher</th>
                  <th className="px-4 py-3 text-left">Tgl Expired</th>
                  <th className="px-4 py-3 text-left">Tgl Laporan Expense</th>
                  <th className="px-4 py-3 text-left">Nominal</th>
                  <th className="px-4 py-3 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {voucherData.map((entry) => (
                  <tr key={entry.no} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.no}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.noVoucher}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.noSO}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.noSOTurunan}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.namaProject}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.namaPemohon}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.tglPengajuanVoucher}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.tglPembayaranVoucher}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.tglExpired}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.tglLaporanExpense}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.nominal}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
            <span>Showing 1 to {voucherData.length} of {voucherData.length} entries</span>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-200">Previous</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-200">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralVoucherDashboard;
