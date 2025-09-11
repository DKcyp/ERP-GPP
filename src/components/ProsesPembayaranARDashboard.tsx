import React, { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';

interface ARPaymentRow {
  id: number;
  kodeCustomer: string;
  namaCustomer: string;
  jenisDokumen: string;
  noDokumen: string;
  tglDokumen: string; // yyyy-mm-dd
  tglJatuhTempo: string; // yyyy-mm-dd
  keterangan: string;
  mataUang: string; // IDR, USD
  nominalDpp: number;
  nominalPpn: number;
  subTotal: number;
  // up to 6 payments
  noDokumenPembayaran1?: string; tglPembayaran1?: string; nominalPembayaran1?: number;
  noDokumenPembayaran2?: string; tglPembayaran2?: string; nominalPembayaran2?: number;
  noDokumenPembayaran3?: string; tglPembayaran3?: string; nominalPembayaran3?: number;
  noDokumenPembayaran4?: string; tglPembayaran4?: string; nominalPembayaran4?: number;
  noDokumenPembayaran5?: string; tglPembayaran5?: string; nominalPembayaran5?: number;
  noDokumenPembayaran6?: string; tglPembayaran6?: string; nominalPembayaran6?: number;
}

const ProsesPembayaranARDashboard: React.FC = () => {
  const [rows] = useState<ARPaymentRow[]>([
    {
      id: 1,
      kodeCustomer: 'CUST-001',
      namaCustomer: 'PT Global Tech',
      jenisDokumen: 'Invoice',
      noDokumen: 'INV-AR-0001',
      tglDokumen: '2025-08-20',
      tglJatuhTempo: '2025-09-20',
      keterangan: 'Penjualan jasa konsultasi',
      mataUang: 'IDR',
      nominalDpp: 15000000,
      nominalPpn: 1650000,
      subTotal: 16650000,
      noDokumenPembayaran1: 'RCV-2025-0902', tglPembayaran1: '2025-09-02', nominalPembayaran1: 5000000,
      noDokumenPembayaran2: 'RCV-2025-0910', tglPembayaran2: '2025-09-10', nominalPembayaran2: 3000000,
    },
    {
      id: 2,
      kodeCustomer: 'CUST-002',
      namaCustomer: 'CV Solusi Digital',
      jenisDokumen: 'Invoice',
      noDokumen: 'INV-AR-0002',
      tglDokumen: '2025-08-25',
      tglJatuhTempo: '2025-09-25',
      keterangan: 'Penjualan lisensi',
      mataUang: 'IDR',
      nominalDpp: 9000000,
      nominalPpn: 990000,
      subTotal: 9990000,
      noDokumenPembayaran1: 'RCV-2025-0905', tglPembayaran1: '2025-09-05', nominalPembayaran1: 2500000,
    },
  ]);

  const totalSemuaPembayaran = useMemo(() => rows.reduce((sum, r) => {
    const rowTotal = (r.nominalPembayaran1 || 0) + (r.nominalPembayaran2 || 0) + (r.nominalPembayaran3 || 0) + (r.nominalPembayaran4 || 0) + (r.nominalPembayaran5 || 0) + (r.nominalPembayaran6 || 0);
    return sum + rowTotal;
  }, 0), [rows]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                PROSES PEMBAYARAN AR
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">AR</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Proses Pembayaran AR</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Table List View */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Pembayaran AR</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Customer</th>
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
                {rows.map(row => {
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.kodeCustomer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaCustomer}</td>
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
                  <td className="px-6 py-3 text-sm font-semibold text-right text-gray-900">Rp {totalSemuaPembayaran.toLocaleString('id-ID')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProsesPembayaranARDashboard;
