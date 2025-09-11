import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, FileSpreadsheet, FileDown, Search } from 'lucide-react';

interface PembayaranRow {
  id: number;
  // Existing fields kept for filters/compatibility
  tanggalBayar: string; // yyyy-mm-dd (first payment date fallback)
  vendor: string; // Nama Supplier
  noInvoice: string; // kept for search filter compatibility
  status: 'Posted' | 'Pending' | 'Draft'; // kept for filter compatibility

  // New columns
  kodeSupplier: string;
  jenisDokumen: string;
  noDokumen: string;
  tglDokumen: string; // yyyy-mm-dd
  tglJatuhTempo: string; // yyyy-mm-dd
  keterangan: string;
  mataUang: string; // e.g., IDR
  nominalDpp: number;
  nominalPpn: number;
  subTotal: number;

  // Per-payment details (up to 6)
  tglPembayaran1?: string; noDokumenPembayaran1?: string; nominalPembayaran1?: number;
  tglPembayaran2?: string; noDokumenPembayaran2?: string; nominalPembayaran2?: number;
  tglPembayaran3?: string; noDokumenPembayaran3?: string; nominalPembayaran3?: number;
  tglPembayaran4?: string; noDokumenPembayaran4?: string; nominalPembayaran4?: number;
  tglPembayaran5?: string; noDokumenPembayaran5?: string; nominalPembayaran5?: number;
  tglPembayaran6?: string; noDokumenPembayaran6?: string; nominalPembayaran6?: number;
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
    {
      id: 1,
      tanggalBayar: '2025-09-02',
      vendor: 'PT Sinar Abadi',
      noInvoice: 'INV-2025-0901',
      status: 'Posted',
      kodeSupplier: 'SUP-010',
      jenisDokumen: 'Invoice',
      noDokumen: 'DOC-AP-1001',
      tglDokumen: '2025-08-20',
      tglJatuhTempo: '2025-09-20',
      keterangan: 'Pembelian material proyek',
      mataUang: 'IDR',
      nominalDpp: 15000000,
      nominalPpn: 1500000,
      subTotal: 16500000,
      noDokumenPembayaran1: 'PAY-2025-0901', tglPembayaran1: '2025-09-02', nominalPembayaran1: 3500000,
      noDokumenPembayaran2: 'PAY-2025-0915', tglPembayaran2: '2025-09-15', nominalPembayaran2: 5000000,
      noDokumenPembayaran3: undefined, tglPembayaran3: undefined, nominalPembayaran3: 0,
      noDokumenPembayaran4: undefined, tglPembayaran4: undefined, nominalPembayaran4: 0,
      noDokumenPembayaran5: undefined, tglPembayaran5: undefined, nominalPembayaran5: 0,
      noDokumenPembayaran6: undefined, tglPembayaran6: undefined, nominalPembayaran6: 0,
    },
    {
      id: 2,
      tanggalBayar: '2025-09-05',
      vendor: 'CV Mitra Jaya',
      noInvoice: 'INV-2025-0902',
      status: 'Pending',
      kodeSupplier: 'SUP-022',
      jenisDokumen: 'Tagihan Jasa',
      noDokumen: 'DOC-AP-1002',
      tglDokumen: '2025-08-25',
      tglJatuhTempo: '2025-09-25',
      keterangan: 'Jasa instalasi',
      mataUang: 'IDR',
      nominalDpp: 8000000,
      nominalPpn: 800000,
      subTotal: 8800000,
      noDokumenPembayaran1: 'PAY-2025-0905', tglPembayaran1: '2025-09-05', nominalPembayaran1: 3000000,
      noDokumenPembayaran2: undefined, tglPembayaran2: undefined, nominalPembayaran2: 0,
      noDokumenPembayaran3: undefined, tglPembayaran3: undefined, nominalPembayaran3: 0,
      noDokumenPembayaran4: undefined, tglPembayaran4: undefined, nominalPembayaran4: 0,
      noDokumenPembayaran5: undefined, tglPembayaran5: undefined, nominalPembayaran5: 0,
      noDokumenPembayaran6: undefined, tglPembayaran6: undefined, nominalPembayaran6: 0,
    },
  ]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const okVendor = searchVendor ? r.vendor.toLowerCase().includes(searchVendor.toLowerCase()) : true;
      const okInv = searchNoInvoice ? r.noDokumen.toLowerCase().includes(searchNoInvoice.toLowerCase()) : true;
      const okStatus = status ? r.status === (status as any) : true;
      const baseDate = r.tglDokumen || r.tanggalBayar;
      const okFrom = periodeDari ? new Date(baseDate) >= new Date(periodeDari.setHours(0,0,0,0)) : true;
      const okTo = periodeSampai ? new Date(baseDate) <= new Date(periodeSampai.setHours(23,59,59,999)) : true;
      return okVendor && okInv && okStatus && okFrom && okTo;
    });
  }, [rows, searchVendor, searchNoInvoice, status, periodeDari, periodeSampai]);

  const totalBayar = useMemo(() => filtered.reduce((s, r) => {
    const sumRow = (r.nominalPembayaran1 || 0) + (r.nominalPembayaran2 || 0) + (r.nominalPembayaran3 || 0) + (r.nominalPembayaran4 || 0) + (r.nominalPembayaran5 || 0) + (r.nominalPembayaran6 || 0);
    return s + sumRow;
  }, 0), [filtered]);

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl. Dokumen (….... s/d…...)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl. Jatuh Tempo (….... s/d…...)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mata Uang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal DPP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal PPN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SubTotal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Pembayaran (….... s/d…...)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Dokumen Pembayaran ke 1</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Pembayaran ke 1</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal Pembayaran ke 1</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Dokumen Pembayaran ke 2</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Pembayaran ke 2</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal Pembayaran ke 2</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Dokumen Pembayaran ke 3</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Pembayaran ke 3</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal Pembayaran ke 3</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Dokumen Pembayaran ke 4</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Pembayaran ke 4</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal Pembayaran ke 4</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Dokumen Pembayaran ke 5</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Pembayaran ke 5</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal Pembayaran ke 5</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Dokumen Pembayaran ke 6</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Pembayaran ke 6</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal Pembayaran ke 6</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Pembayaran</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => {
                  const payments = [
                    { d: row.tglPembayaran1, n: row.nominalPembayaran1 },
                    { d: row.tglPembayaran2, n: row.nominalPembayaran2 },
                    { d: row.tglPembayaran3, n: row.nominalPembayaran3 },
                    { d: row.tglPembayaran4, n: row.nominalPembayaran4 },
                    { d: row.tglPembayaran5, n: row.nominalPembayaran5 },
                    { d: row.tglPembayaran6, n: row.nominalPembayaran6 },
                  ].filter(p => p.d);
                  const tglRange = payments.length
                    ? `${new Date(payments[0].d as string).toLocaleDateString('id-ID')} s/d ${new Date(payments[payments.length - 1].d as string).toLocaleDateString('id-ID')}`
                    : '-';
                  const totalPembRow = (row.nominalPembayaran1 || 0) + (row.nominalPembayaran2 || 0) + (row.nominalPembayaran3 || 0) + (row.nominalPembayaran4 || 0) + (row.nominalPembayaran5 || 0) + (row.nominalPembayaran6 || 0);
                  return (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.kodeSupplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.vendor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.jenisDokumen}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noDokumen}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglDokumen).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglJatuhTempo).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keterangan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.mataUang}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {row.nominalDpp.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {row.nominalPpn.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {row.subTotal.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tglRange}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noDokumenPembayaran1 || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglPembayaran1 ? new Date(row.tglPembayaran1).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.nominalPembayaran1 ? `Rp ${row.nominalPembayaran1.toLocaleString('id-ID')}` : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noDokumenPembayaran2 || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglPembayaran2 ? new Date(row.tglPembayaran2).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.nominalPembayaran2 ? `Rp ${row.nominalPembayaran2.toLocaleString('id-ID')}` : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noDokumenPembayaran3 || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglPembayaran3 ? new Date(row.tglPembayaran3).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.nominalPembayaran3 ? `Rp ${row.nominalPembayaran3.toLocaleString('id-ID')}` : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noDokumenPembayaran4 || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglPembayaran4 ? new Date(row.tglPembayaran4).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.nominalPembayaran4 ? `Rp ${row.nominalPembayaran4.toLocaleString('id-ID')}` : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noDokumenPembayaran5 || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglPembayaran5 ? new Date(row.tglPembayaran5).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.nominalPembayaran5 ? `Rp ${row.nominalPembayaran5.toLocaleString('id-ID')}` : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noDokumenPembayaran6 || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglPembayaran6 ? new Date(row.tglPembayaran6).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Rp {totalPembRow.toLocaleString('id-ID')}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right" colSpan={29}>Total Pembayaran</td>
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
