import React, { useState } from 'react';
import { Search, CalendarDays, FileText, FileSpreadsheet, FileDown } from 'lucide-react';
import PertanggungJawabanEntryModal from './PertanggungJawabanEntryModal'; // Import the new modal
import { VoucherEntry } from '../types'; // Only import VoucherEntry

const GeneralPertanggungJawabanVoucherDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherEntry | null>(null); // Change type to VoucherEntry | null

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

  const handleViewDetail = (entry: VoucherEntry) => {
    setSelectedVoucher(entry); // Pass the entire VoucherEntry object
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVoucher(null);
  };

  return (
    <div className="min-h-screen bg-background text-text p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-text mb-8">Pertanggung Jawaban Voucher</h1>

        {/* Filter Section */}
        <div className="bg-surface rounded-2xl shadow-lg border border-border p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Cari No Voucher */}
            <div>
              <label htmlFor="noVoucher" className="block text-sm font-medium text-textSecondary mb-2">Cari No Voucher</label>
              <div className="relative">
                <input
                  type="text"
                  id="noVoucher"
                  className="w-full px-4 py-2 pr-10 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
                  placeholder="VCH001"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textSecondary" />
              </div>
            </div>
            {/* Cari No SO */}
            <div>
              <label htmlFor="noSO" className="block text-sm font-medium text-textSecondary mb-2">Cari No SO</label>
              <div className="relative">
                <input
                  type="text"
                  id="noSO"
                  className="w-full px-4 py-2 pr-10 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
                  placeholder="SO001"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textSecondary" />
              </div>
            </div>
            {/* Cari No SO Turunan */}
            <div>
              <label htmlFor="noSOTurunan" className="block text-sm font-medium text-textSecondary mb-2">Cari No SO Turunan</label>
              <div className="relative">
                <input
                  type="text"
                  id="noSOTurunan"
                  className="w-full px-4 py-2 pr-10 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
                  placeholder="SO001.12"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textSecondary" />
              </div>
            </div>
            {/* Cari Nama Project */}
            <div>
              <label htmlFor="namaProject" className="block text-sm font-medium text-textSecondary mb-2">Cari Nama Project</label>
              <div className="relative">
                <input
                  type="text"
                  id="namaProject"
                  className="w-full px-4 py-2 pr-10 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
                  placeholder="Proyek Medco"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textSecondary" />
              </div>
            </div>
            {/* Cari Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-textSecondary mb-2">Cari Status</label>
              <select
                id="status"
                className="w-full px-4 py-2 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
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
                <label htmlFor="periodeStart" className="block text-sm font-medium text-textSecondary mb-2">Periode</label>
                <div className="relative">
                  <input
                    type="text"
                    id="periodeStart"
                    className="w-full px-4 py-2 pr-10 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
                    placeholder="03/03/2025"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textSecondary pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-textSecondary text-sm md:mt-8">s.d</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="periodeEnd"
                    className="w-full px-4 py-2 pr-10 border border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-text bg-background"
                    placeholder="03/03/2025"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textSecondary pointer-events-none" />
                </div>
              </div>
            </div>
            <button className="px-6 py-2 bg-primary text-white font-medium rounded-xl shadow-md hover:bg-primary/80 transition-colors duration-300 w-full md:w-auto">
              Search
            </button>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end space-x-3 mb-6">
          <button className="inline-flex items-center px-4 py-2 bg-success text-white font-medium rounded-xl shadow-md hover:bg-success/80 transition-colors duration-300">
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-secondary text-white font-medium rounded-xl shadow-md hover:bg-secondary/80 transition-colors duration-300">
            <FileText className="h-4 w-4 mr-2" /> Export CSV
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-error text-white font-medium rounded-xl shadow-md hover:bg-error/80 transition-colors duration-300">
            <FileDown className="h-4 w-4 mr-2" /> Export PDF
          </button>
        </div>

        {/* Voucher Table */}
        <div className="bg-surface rounded-2xl shadow-lg border border-border p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 text-textSecondary">
              <span>Show</span>
              <select className="border border-border rounded-md px-2 py-1 text-sm bg-background text-text">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-surface rounded-xl shadow-sm border border-border">
              <thead>
                <tr className="bg-background border-b border-border text-textSecondary text-sm font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">No <span className="text-primary">↑</span></th>
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
                  <th className="px-4 py-3 text-left">Aksi</th> {/* New Action Column Header */}
                </tr>
              </thead>
              <tbody>
                {voucherData.map((entry) => (
                  <tr key={entry.no} className="border-b border-border last:border-b-0 hover:bg-background transition-colors duration-150">
                    <td className="px-4 py-3 text-sm text-text">{entry.no}</td>
                    <td className="px-4 py-3 text-sm text-text">{entry.noVoucher}</td>
                    <td className="px-4 py-3 text-sm text-text">{entry.noSO}</td>
                    <td className="px-4 py-3 text-sm text-text">{entry.noSOTurunan}</td>
                    <td className="px-4 py-3 text-sm text-text">{entry.namaProject}</td>
                    <td className="px-4 py-3 text-sm text-text">{entry.namaPemohon}</td>
                    <td className="px-4 py-3 text-sm text-text">{entry.tglPengajuanVoucher}</td>
                    <td className="px-4 py-3 text-sm text-text">{entry.tglPembayaranVoucher}</td>
                    <td className="px-4 py-3 text-sm text-text">{entry.tglExpired}</td>
                    <td className="px-4 py-3 text-sm text-text">{entry.tglLaporanExpense}</td>
                    <td className="px-4 py-3 text-sm text-text">{entry.nominal}</td>
                    <td className="px-4 py-3 text-sm text-text">{entry.keterangan}</td>
                    <td className="px-4 py-3 text-sm text-text">
                      <button
                        onClick={() => handleViewDetail(entry)}
                        className="px-3 py-1 bg-primary text-white rounded-lg text-xs hover:bg-primary/80 transition-colors duration-200"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm text-textSecondary">
            <span>Showing 1 to {voucherData.length} of {voucherData.length} entries</span>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-border rounded-xl hover:bg-background transition-colors duration-200">Previous</button>
              <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors duration-200">1</button>
              <button className="px-4 py-2 border border-border rounded-xl hover:bg-background transition-colors duration-200">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Pertanggung Jawaban Entry Modal */}
      <PertanggungJawabanEntryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        voucherData={selectedVoucher}
      />
    </div>
  );
};

export default GeneralPertanggungJawabanVoucherDashboard;
