import React, { useMemo, useState } from 'react';
import { Clock, FileSpreadsheet, FileDown, Search } from 'lucide-react';

interface VoucherRow {
  id: number;
  noVoucher: string;
  tglVoucher: string; // yyyy-mm-dd
  namaDivisi: string;
  noSO: string;
  nominalVoucher: number;
  statusDokumen: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  namaKaryawan: string;
  namaAkun: string;
  approver1?: string;
  approver2?: string;
  approver3?: string;
  approver4?: string;
  approver5?: string;
  keterangan: string;
}

const FinanceVoucherDashboard: React.FC = () => {
  const today = new Date();

  // Filters
  const [filterNoVoucher, setFilterNoVoucher] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');

  // Dummy data
  const [rows] = useState<VoucherRow[]>([
    {
      id: 1,
      noVoucher: 'VCR-2025-0901',
      tglVoucher: '2025-09-02',
      namaDivisi: 'Finance',
      noSO: 'SO-001',
      nominalVoucher: 2500000,
      statusDokumen: 'Submitted',
      namaKaryawan: 'Budi Santoso',
      namaAkun: 'Biaya Operasional',
      approver1: 'Manajer Finance',
      approver2: 'Direktur Operasional',
      approver3: '—',
      approver4: '—',
      approver5: '—',
      keterangan: 'Uang muka perjalanan dinas',
    },
    {
      id: 2,
      noVoucher: 'VCR-2025-0902',
      tglVoucher: '2025-09-05',
      namaDivisi: 'Accounting',
      noSO: 'SO-015',
      nominalVoucher: 1500000,
      statusDokumen: 'Approved',
      namaKaryawan: 'Siti Aminah',
      namaAkun: 'Biaya ATK',
      approver1: 'SPV Accounting',
      approver2: 'Manajer Keuangan',
      approver3: '—',
      approver4: '—',
      approver5: '—',
      keterangan: 'Pembelian ATK',
    },
  ]);

  const filtered = useMemo(() => rows.filter(r => {
    const okNo = filterNoVoucher ? r.noVoucher.toLowerCase().includes(filterNoVoucher.toLowerCase()) : true;
    const okDiv = filterDivisi ? r.namaDivisi === filterDivisi : true;
    const okStat = filterStatus ? r.statusDokumen === (filterStatus as any) : true;
    const okFrom = dari ? new Date(r.tglVoucher) >= new Date(`${dari}T00:00:00`) : true;
    const okTo = sampai ? new Date(r.tglVoucher) <= new Date(`${sampai}T23:59:59`) : true;
    return okNo && okDiv && okStat && okFrom && okTo;
  }), [rows, filterNoVoucher, filterDivisi, filterStatus, dari, sampai]);

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">DASHBOARD VOUCHER</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Voucher / Dashboard</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter Voucher</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Voucher</label>
              <input type="text" value={filterNoVoucher} onChange={e => setFilterNoVoucher(e.target.value)} placeholder="VCR-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Divisi</label>
              <select value={filterDivisi} onChange={e => setFilterDivisi(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua</option>
                {['Marketing','HRD','GA','Procurement','Project Control','Operasional','QHSE','Finance','Accounting','Tax','Gudang'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Dokumen</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl Voucher Dari</label>
              <input type="date" value={dari} onChange={e => setDari(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl Voucher Sampai</label>
              <input type="date" value={sampai} onChange={e => setSampai(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
            </div>
            <div className="flex items-end">
              <button className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Voucher</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Voucher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Voucher (….... s/d…...)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Divisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No SO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal Voucher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Karyawan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Akun</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approver 1</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approver 2</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approver 3</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approver 4</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approver 5</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{row.noVoucher}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglVoucher).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaDivisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noSO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {row.nominalVoucher.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.statusDokumen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaKaryawan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaAkun}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.approver1 || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.approver2 || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.approver3 || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.approver4 || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.approver5 || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceVoucherDashboard;
