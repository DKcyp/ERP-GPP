import React from 'react';
import { Clock, FileText, Download, FileSpreadsheet } from 'lucide-react';

const LaporanARDashboard: React.FC = () => {
  const dummyTableData = [
    {
      id: 1,
      kodeCustomer: 'CUST-001',
      namaCustomer: 'PT Cipta Karya',
      noNpwpNik: '01.234.567.8-901.000',
      noInvoice: 'INV-AR-0001',
      noFakturPajak: '010.001-22.12345678',
      jenisDokumen: 'Invoice',
      noDokumen: 'DOC-AR-001',
      tglDokumen: '2025-08-20',
      tglJatuhTempo: '2025-09-19',
      keterangan: 'Penjualan jasa',
      mataUang: 'IDR',
      nominalDpp: 20000000,
      subTotal: 22200000,
      umurPiutang: '15 hari',
      bayar1: 5000000,
      bayar2: 3000000,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 14200000,
    },
    {
      id: 2,
      kodeCustomer: 'CUST-002',
      namaCustomer: 'CV Mitra Usaha',
      noNpwpNik: '3201xxxxxxxxxxxx',
      noInvoice: 'INV-AR-0002',
      noFakturPajak: '-',
      jenisDokumen: 'Tagihan Jasa',
      noDokumen: 'DOC-AR-045',
      tglDokumen: '2025-08-25',
      tglJatuhTempo: '2025-09-24',
      keterangan: 'Tagihan maintenance',
      mataUang: 'IDR',
      nominalDpp: 9000000,
      subTotal: 9990000,
      umurPiutang: '22 hari',
      bayar1: 2000000,
      bayar2: 0,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 7990000,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LAPORAN AR
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">AR</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Laporan AR</span>
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
        {/* Action Bar */}
        <div className="flex justify-end space-x-3 mb-6">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export PDF</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5" />
            <span>Export Excel</span>
          </button>
        </div>

        {/* Table List View */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Laporan AR</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No NPWP / No NIK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Faktur Pajak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl. Dokumen (….... s/d…...)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl. Jatuh Tempo (….... s/d…...)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Uang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal DPP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SubTotal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Umur Piutang / Aging</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 1</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 2</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 3</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 4</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 5</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 6</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Outstanding Piutang</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyTableData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kodeCustomer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaCustomer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.noNpwpNik}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.noInvoice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.noFakturPajak}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jenisDokumen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.noDokumen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(item.tglDokumen).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(item.tglJatuhTempo).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.mataUang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.nominalDpp.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.subTotal.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.umurPiutang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.bayar1.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.bayar2.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.bayar3.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.bayar4.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.bayar5.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.bayar6.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Rp {item.totalOutstanding.toLocaleString('id-ID')}</td>
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

export default LaporanARDashboard;
