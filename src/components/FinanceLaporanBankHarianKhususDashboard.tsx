import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, FileSpreadsheet, FileDown, Search } from 'lucide-react';

interface BankRow {
  id: number;
  namaBank: string;
  norek: string;
  alamat: string;
  saldoAwal: number;
  bankMasuk: number;
  bankKeluar: number;
  saldoTertahan: number;
}

const FinanceLaporanBankHarianKhususDashboard: React.FC = () => {
  const today = new Date();
  const [periodeDari, setPeriodeDari] = useState<Date | null>(null);
  const [periodeSampai, setPeriodeSampai] = useState<Date | null>(null);

  const [rows] = useState<BankRow[]>([
    { id: 1, namaBank: 'Bank Muamalat', norek: '1234567890', alamat: 'Jl. Jend. Sudirman No. 1, Jakarta', saldoAwal: 8000000, bankMasuk: 2500000, bankKeluar: 1000000, saldoTertahan: 500000 },
    { id: 2, namaBank: 'Bank Mandiri Gaji', norek: '1400012345678', alamat: 'KCP Mandiri Gaji, Jl. Gatot Subroto, Jakarta', saldoAwal: 12000000, bankMasuk: 5000000, bankKeluar: 3000000, saldoTertahan: 750000 },
    { id: 3, namaBank: 'Bank Mandiri Operasional', norek: '1400098765432', alamat: 'KCP Mandiri Operasional, Jl. MH Thamrin, Jakarta', saldoAwal: 10000000, bankMasuk: 4000000, bankKeluar: 2500000, saldoTertahan: 1000000 },
    { id: 4, namaBank: 'Bank Mandiri Tabungan', norek: '1400076543210', alamat: 'KCP Mandiri Tabungan, Jl. Asia Afrika, Bandung', saldoAwal: 6000000, bankMasuk: 1500000, bankKeluar: 1000000, saldoTertahan: 250000 },
    { id: 5, namaBank: 'Bank Mandiri PPN', norek: '1400055512345', alamat: 'KCP Mandiri Pajak, Jl. Jend. Sudirman, Jakarta', saldoAwal: 7000000, bankMasuk: 2000000, bankKeluar: 1500000, saldoTertahan: 300000 },
  ]);

  const totals = useMemo(() => {
    const totalSaldoAwal = rows.reduce((s, r) => s + r.saldoAwal, 0);
    const totalMasuk = rows.reduce((s, r) => s + r.bankMasuk, 0);
    const totalKeluar = rows.reduce((s, r) => s + r.bankKeluar, 0);
    const totalTertahan = rows.reduce((s, r) => s + r.saldoTertahan, 0);
    const totalSaldoAkhir = totalSaldoAwal + totalMasuk - totalKeluar - totalTertahan;
    return { totalSaldoAwal, totalMasuk, totalKeluar, totalTertahan, totalSaldoAkhir };
  }, [rows]);

  const applyFilter = () => {
    console.log('Filter applied', { periodeDari, periodeSampai });
  };

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">LAPORAN BANK HARIAN KHUSUS</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Bank / Laporan Bank Harian Khusus</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode Dari</label>
              <DatePicker selected={periodeDari} onChange={(date: Date | null) => setPeriodeDari(date)} dateFormat="dd/MM/yyyy" className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholderText="dd/MM/yyyy" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode Sampai</label>
              <DatePicker selected={periodeSampai} onChange={(date: Date | null) => setPeriodeSampai(date)} dateFormat="dd/MM/yyyy" className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholderText="dd/MM/yyyy" />
            </div>
            <div className="hidden lg:block"></div>
            <div className="flex items-end">
              <button onClick={applyFilter} className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Terapkan Filter
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end mb-6">
            <button onClick={exportExcel} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button onClick={exportPDF} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Bank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Rekening</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo Awal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bank Masuk</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bank Keluar</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo Tertahan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo Akhir</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row, idx) => {
                  const saldoAkhir = row.saldoAwal + row.bankMasuk - row.bankKeluar - row.saldoTertahan;
                  return (
                    <tr key={row.id}>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{row.namaBank}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{row.norek}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{row.alamat}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-900">{`Rp ${row.saldoAwal.toLocaleString('id-ID')}`}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-900">{`Rp ${row.bankMasuk.toLocaleString('id-ID')}`}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-900">{`Rp ${row.bankKeluar.toLocaleString('id-ID')}`}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-900">{`Rp ${row.saldoTertahan.toLocaleString('id-ID')}`}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">{`Rp ${saldoAkhir.toLocaleString('id-ID')}`}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right" colSpan={8}>Total Saldo Akhir</td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-gray-900">{`Rp ${totals.totalSaldoAkhir.toLocaleString('id-ID')}`}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceLaporanBankHarianKhususDashboard;
