import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, FileSpreadsheet, FileDown, Search } from 'lucide-react';

interface PembayaranRow {
  id: number;
  vendor: string; // Nama Supplier
  noPo: string;
  tglPo: string; // yyyy-mm-dd
  tglJatuhTempo: string; // yyyy-mm-dd
  keterangan: string;
  nominalDpp: number;
  nominalPpn: number;
  subTotal: number;
  totalPembayaran: number;

  // Fields for filtering
  status: 'Posted' | 'Pending' | 'Draft';
  tanggalBayar: string; // yyyy-mm-dd
}

const FinanceLaporanPembayaranHutangDashboard: React.FC = () => {
  const today = new Date();

  // Filters
  const [periodeDari, setPeriodeDari] = useState<Date | null>(null);
  const [periodeSampai, setPeriodeSampai] = useState<Date | null>(null);
  const [searchVendor, setSearchVendor] = useState('');
  const [searchNoPo, setSearchNoPo] = useState('');
  const [status, setStatus] = useState('');

  // Dummy data (placeholder)
  const [rows] = useState<PembayaranRow[]>([
    {
      id: 1,
      vendor: 'PT Sinar Abadi',
      noPo: 'PO-2025-0901',
      tglPo: '2025-08-20',
      tglJatuhTempo: '2025-09-20',
      keterangan: 'Pembelian material proyek',
      nominalDpp: 15000000,
      nominalPpn: 1500000,
      subTotal: 16500000,
      totalPembayaran: 8500000,
      status: 'Posted',
      tanggalBayar: '2025-09-02',
    },
    {
      id: 2,
      vendor: 'CV Mitra Jaya',
      noPo: 'PO-2025-0902',
      tglPo: '2025-08-25',
      tglJatuhTempo: '2025-09-25',
      keterangan: 'Jasa instalasi',
      nominalDpp: 8000000,
      nominalPpn: 800000,
      subTotal: 8800000,
      totalPembayaran: 3000000,
      status: 'Pending',
      tanggalBayar: '2025-09-05',
    },
  ]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const okVendor = searchVendor ? r.vendor.toLowerCase().includes(searchVendor.toLowerCase()) : true;
      const okInv = searchNoPo ? r.noPo.toLowerCase().includes(searchNoPo.toLowerCase()) : true;
      const okStatus = status ? r.status === (status as any) : true;
      const baseDate = r.tglPo || r.tanggalBayar;
      const okFrom = periodeDari ? new Date(baseDate) >= new Date(periodeDari.setHours(0,0,0,0)) : true;
      const okTo = periodeSampai ? new Date(baseDate) <= new Date(periodeSampai.setHours(23,59,59,999)) : true;
      return okVendor && okInv && okStatus && okFrom && okTo;
    });
  }, [rows, searchVendor, searchNoPo, status, periodeDari, periodeSampai]);

  const totalBayar = useMemo(() => filtered.reduce((s, r) => s + r.totalPembayaran, 0), [filtered]);

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
              <label className="block text-sm font-medium text-gray-700 mb-2">No. PO</label>
              <input type="text" value={searchNoPo} onChange={e => setSearchNoPo(e.target.value)} placeholder="PO-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. PO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl. PO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl. Jatuh Tempo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal DPP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal PPN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SubTotal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Pembayaran</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noPo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglPo).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglJatuhTempo).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Rp {row.nominalDpp.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Rp {row.nominalPpn.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Rp {row.subTotal.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">Rp {row.totalPembayaran.toLocaleString('id-ID')}</td>
                  </tr>
                ))} 
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right" colSpan={8}>Total Pembayaran</td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-gray-900">Rp {totalBayar.toLocaleString('id-ID')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

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
              <label className="block text-sm font-medium text-gray-700 mb-2">No. PO</label>
              <input type="text" value={searchNoPo} onChange={e => setSearchNoPo(e.target.value)} placeholder="PO-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. PO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl. PO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl. Jatuh Tempo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal DPP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal PPN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SubTotal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Pembayaran</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noPo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglPo).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglJatuhTempo).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Rp {row.nominalDpp.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Rp {row.nominalPpn.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Rp {row.subTotal.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">Rp {row.totalPembayaran.toLocaleString('id-ID')}</td>
                  </tr>
                ))} 
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right" colSpan={8}>Total Pembayaran</td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-gray-900">Rp {totalBayar.toLocaleString('id-ID')}</td>
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
