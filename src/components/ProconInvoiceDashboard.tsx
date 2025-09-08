import React, { useEffect, useMemo, useState } from 'react';
import { Clock, ReceiptText } from 'lucide-react';

interface PIEntry {
  id: string;
  clientName: string;
  soInduk: string;
  soTurunan: string;
  contractStart: string;
  contractEnd: string;
  nilaiKontrak: number;
  absorbKontrak: number;
  remainingKontrak: number;
}

const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

const ProconInvoiceDashboard: React.FC = () => {
  const [data, setData] = useState<PIEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('procon_pi_entries');
      if (raw) {
        const parsed: PIEntry[] = JSON.parse(raw);
        if (Array.isArray(parsed)) setData(parsed);
      }
    } catch (e) {
      console.warn('Failed to load procon_pi_entries', e);
    }
  }, []);

  const totals = useMemo(() => {
    const totalPI = data.length;
    const totalNilai = data.reduce((s, r) => s + (r.nilaiKontrak || 0), 0);
    const totalAbsorb = data.reduce((s, r) => s + (r.absorbKontrak || 0), 0);
    const totalRemaining = data.reduce((s, r) => s + (r.remainingKontrak || 0), 0);
    return { totalPI, totalNilai, totalAbsorb, totalRemaining };
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">PROFORMA INVOICE DASHBOARD</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Procon</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Proforma Invoice</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total PI</p>
                <p className="text-3xl font-bold text-gray-900">{totals.totalPI}</p>
              </div>
              <ReceiptText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <p className="text-xs text-gray-500">Total Nilai Kontrak</p>
            <p className="text-2xl font-bold text-gray-900">{formatRupiah(totals.totalNilai)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <p className="text-xs text-gray-500">Total Absorb Kontrak</p>
            <p className="text-2xl font-bold text-gray-900">{formatRupiah(totals.totalAbsorb)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <p className="text-xs text-gray-500">Total Remaining Kontrak</p>
            <p className="text-2xl font-bold text-gray-900">{formatRupiah(totals.totalRemaining)}</p>
          </div>
        </div>

        {/* Table from PI data */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Nama Client</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Nomor SO Induk & SO Turunan</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Durasi Kontrak (Tanggal awal - akhir kontrak)</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Nilai Kontrak</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Absorb Kontrak</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Remaining Kontrak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900 font-medium">{row.clientName}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">{row.soInduk}</span>
                        <span className="text-gray-500">{row.soTurunan}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{row.contractStart} - {row.contractEnd}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium">{formatRupiah(row.nilaiKontrak)}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium">{formatRupiah(row.absorbKontrak)}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium">{formatRupiah(row.remainingKontrak)}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-gray-500">Tidak ada data. Silakan tambahkan PI di menu Pembuatan PI.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProconInvoiceDashboard;
