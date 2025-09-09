import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, FileSpreadsheet, FileDown, Search } from 'lucide-react';

interface PembayaranRow {
  id: number;
  tanggalBayar: string; // yyyy-mm-dd
  vendor: string;
  noInvoice: string;
  noPembayaran: string;
  metodeBayar: string;
  bank: string;
  nominalBayar: number;
  keterangan: string;
  status: 'Posted' | 'Pending' | 'Draft';
}

const FinanceLaporanPembayaranHutangDashboard: React.FC = () => {
  const today = new Date();

  // Filters
  const [periodeDari, setPeriodeDari] = useState<Date | null>(null);
  const [periodeSampai, setPeriodeSampai] = useState<Date | null>(null);
  const [searchVendor, setSearchVendor] = useState('');
  const [searchNoInvoice, setSearchNoInvoice] = useState('');
  const [status, setStatus] = useState('');

  // Dummy data (placeholder)
  const [rows] = useState<PembayaranRow[]>([
    { id: 1, tanggalBayar: '2025-09-02', vendor: 'PT Sinar Abadi', noInvoice: 'INV-2025-0901', noPembayaran: 'PAY-2025-0901', metodeBayar: 'Transfer', bank: 'Bank Mandiri Operasional', nominalBayar: 3500000, keterangan: 'Pelunasan sebagian', status: 'Posted' },
    { id: 2, tanggalBayar: '2025-09-05', vendor: 'CV Mitra Jaya', noInvoice: 'INV-2025-0902', noPembayaran: 'PAY-2025-0902', metodeBayar: 'Giro', bank: 'Bank BCA', nominalBayar: 5000000, keterangan: 'Pembayaran termin', status: 'Pending' },
    { id: 3, tanggalBayar: '2025-09-06', vendor: 'PT Teknologi Nusantara', noInvoice: 'INV-2025-0903', noPembayaran: 'PAY-2025-0903', metodeBayar: 'Transfer', bank: 'Bank Mandiri PPN', nominalBayar: 2750000, keterangan: 'Pelunasan', status: 'Posted' },
  ]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const okVendor = searchVendor ? r.vendor.toLowerCase().includes(searchVendor.toLowerCase()) : true;
      const okInv = searchNoInvoice ? r.noInvoice.toLowerCase().includes(searchNoInvoice.toLowerCase()) : true;
      const okStatus = status ? r.status === (status as any) : true;
      const okFrom = periodeDari ? new Date(r.tanggalBayar) >= new Date(periodeDari.setHours(0,0,0,0)) : true;
      const okTo = periodeSampai ? new Date(r.tanggalBayar) <= new Date(periodeSampai.setHours(23,59,59,999)) : true;
      return okVendor && okInv && okStatus && okFrom && okTo;
    });
  }, [rows, searchVendor, searchNoInvoice, status, periodeDari, periodeSampai]);

  const totalBayar = useMemo(() => filtered.reduce((s, r) => s + r.nominalBayar, 0), [filtered]);

  const applyFilter = () => {
    // no-op, all filters are reactive
  };

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">LAPORAN PEMBAYARAN HUTANG</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">AP / Laporan Pembayaran Hutang</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode Dari</label>
              <DatePicker selected={periodeDari} onChange={(date: Date | null) => setPeriodeDari(date)} dateFormat="dd/MM/yyyy" className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholderText="dd/MM/yyyy" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode Sampai</label>
              <DatePicker selected={periodeSampai} onChange={(date: Date | null) => setPeriodeSampai(date)} dateFormat="dd/MM/yyyy" className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholderText="dd/MM/yyyy" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
              <input type="text" value={searchVendor} onChange={e => setSearchVendor(e.target.value)} placeholder="Cari vendor..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Invoice</label>
              <input type="text" value={searchNoInvoice} onChange={e => setSearchNoInvoice(e.target.value)} placeholder="INV-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua</option>
                <option value="Posted">Posted</option>
                <option value="Pending">Pending</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={applyFilter} className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Terapkan Filter
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button onClick={exportExcel} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button onClick={exportPDF} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Pembayaran Hutang</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Bayar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Pembayaran</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metode Bayar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nominal Bayar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tanggalBayar).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noInvoice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noPembayaran}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.metodeBayar}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.bank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">Rp {row.nominalBayar.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keterangan}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${row.status === 'Posted' ? 'text-green-700' : row.status === 'Pending' ? 'text-yellow-700' : 'text-gray-600'}`}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right" colSpan={6}>Total Pembayaran</td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-gray-900">Rp {totalBayar.toLocaleString('id-ID')}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceLaporanPembayaranHutangDashboard;
