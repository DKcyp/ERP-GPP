import React, { useMemo, useState } from 'react';
import { Clock, FileSpreadsheet, FileDown, Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface KasRow {
  id: number;
  namaKas: string;
  saldoAwal: number;
  kasMasuk: number;
  kasKeluar: number;
}


const FinanceLaporanKasKecilDashboard: React.FC = () => {
  const today = new Date();

  const [rows] = useState<KasRow[]>([
    { id: 1, namaKas: 'Kas HealthyWeek', saldoAwal: 10000000, kasMasuk: 2500000, kasKeluar: 1000000 },
    { id: 2, namaKas: 'Kas Marketing', saldoAwal: 5000000, kasMasuk: 1500000, kasKeluar: 750000 },
    { id: 3, namaKas: 'Kas Operasional', saldoAwal: 8000000, kasMasuk: 3000000, kasKeluar: 2000000 },
    { id: 4, namaKas: 'Kas Kantor', saldoAwal: 4000000, kasMasuk: 1000000, kasKeluar: 500000 },
    { id: 5, namaKas: 'Kas Pengajian', saldoAwal: 12000000, kasMasuk: 6000000, kasKeluar: 11000000 },
    { id: 6, namaKas: 'Kas Tampungan', saldoAwal: 2000000, kasMasuk: 500000, kasKeluar: 250000 },
  ]);

  const [periodeDari, setPeriodeDari] = useState<Date | null>(null);
  const [periodeSampai, setPeriodeSampai] = useState<Date | null>(null);

  const totals = useMemo(() => {
    const totalSaldoAwal = rows.reduce((s, r) => s + r.saldoAwal, 0);
    const totalKasMasuk = rows.reduce((s, r) => s + r.kasMasuk, 0);
    const totalKasKeluar = rows.reduce((s, r) => s + r.kasKeluar, 0);
    const totalSaldoAkhir = totalSaldoAwal + totalKasMasuk - totalKasKeluar;
    return { totalSaldoAwal, totalKasMasuk, totalKasKeluar, totalSaldoAkhir };
  }, [rows]);

  const applyFilter = () => {
    // Placeholder for filtering logic by date range when backend is connected
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
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">LAPORAN KAS KECIL</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Kas / Laporan Kas Kecil</span>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo Awal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kas Masuk</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kas Keluar</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo Akhir</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row, idx) => {
                  const saldoAkhir = row.saldoAwal + row.kasMasuk - row.kasKeluar;
                  return (
                    <tr key={row.id}>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{row.namaKas}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-900">{`Rp ${row.saldoAwal.toLocaleString('id-ID')}`}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-900">{`Rp ${row.kasMasuk.toLocaleString('id-ID')}`}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-900">{`Rp ${row.kasKeluar.toLocaleString('id-ID')}`}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">{`Rp ${saldoAkhir.toLocaleString('id-ID')}`}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right" colSpan={5}>Total Saldo Akhir</td>
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

export default FinanceLaporanKasKecilDashboard;
