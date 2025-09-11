import React, { useMemo, useState } from 'react';
import { Clock, FileSpreadsheet, FileDown, Search, Plus, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface KasRow {
  id: number;
  namaKasKecil: string;
  tglDari: string; // ISO yyyy-mm-dd
  tglSampai: string; // ISO yyyy-mm-dd
  saldo: number; // saldo masing-masing
}


const FinanceLaporanKasKecilDashboard: React.FC = () => {
  const today = new Date();

  const [rows, setRows] = useState<KasRow[]>([
    { id: 1, namaKasKecil: 'Kas HealthyWeek', tglDari: '2025-03-01', tglSampai: '2025-03-31', saldo: 11500000 },
    { id: 2, namaKasKecil: 'Kas Marketing', tglDari: '2025-03-01', tglSampai: '2025-03-31', saldo: 5750000 },
    { id: 3, namaKasKecil: 'Kas Operasional', tglDari: '2025-03-01', tglSampai: '2025-03-31', saldo: 9000000 },
  ]);

  const [periodeDari, setPeriodeDari] = useState<Date | null>(null);
  const [periodeSampai, setPeriodeSampai] = useState<Date | null>(null);

  const totalKasKecil = useMemo(() => rows.reduce((s, r) => s + (r.saldo || 0), 0), [rows]);

  const applyFilter = () => {
    // Placeholder for filtering logic by date range when backend is connected
    console.log('Filter applied', { periodeDari, periodeSampai });
  };

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{ namaKasKecil: string; tglDari: string; tglSampai: string; saldo: string }>({
    namaKasKecil: '',
    tglDari: '',
    tglSampai: '',
    saldo: '',
  });
  const openAdd = () => {
    setForm({ namaKasKecil: '', tglDari: '', tglSampai: '', saldo: '' });
    setShowModal(true);
  };
  const saveForm = () => {
    if (!form.namaKasKecil || !form.tglDari || !form.tglSampai || !form.saldo) return;
    const saldoNum = parseFloat(form.saldo.replace(/[^0-9.-]/g, ''));
    if (isNaN(saldoNum)) return;
    setRows((prev) => [
      { id: Date.now(), namaKasKecil: form.namaKasKecil, tglDari: form.tglDari, tglSampai: form.tglSampai, saldo: saldoNum },
      ...prev,
    ]);
    setShowModal(false);
  };

  return (
    <>
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
            <button onClick={openAdd} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" /> Tambah
            </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kas Kecil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Laporan Kas Kecil</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo Kas Kecil</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Kas Kecil</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{row.namaKasKecil}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                      {new Date(row.tglDari).toLocaleDateString('id-ID')} s/d {new Date(row.tglSampai).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-900">{`Rp ${row.saldo.toLocaleString('id-ID')}`}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-900">-</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right" colSpan={3}>Total Kas Kecil</td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-gray-900">{`Rp ${totalKasKecil.toLocaleString('id-ID')}`}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
        <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Tambah Laporan Kas Kecil</h3>
            <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nama Kas Kecil</label>
              <input
                type="text"
                value={form.namaKasKecil}
                onChange={(e) => setForm({ ...form, namaKasKecil: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tgl Laporan (Dari)</label>
                <input
                  type="date"
                  value={form.tglDari}
                  onChange={(e) => setForm({ ...form, tglDari: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tgl Laporan (Sampai)</label>
                <input
                  type="date"
                  value={form.tglSampai}
                  onChange={(e) => setForm({ ...form, tglSampai: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Saldo Kas Kecil</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Rp 0"
                value={form.saldo}
                onChange={(e) => setForm({ ...form, saldo: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
            <button onClick={() => setShowModal(false)} className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Batal</button>
            <button onClick={saveForm} className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default FinanceLaporanKasKecilDashboard;

