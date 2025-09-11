import React from "react";
import { Clock, FileText, Download, FileSpreadsheet } from "lucide-react";

const LaporanAPDashboard: React.FC = () => {
  const dummyTableData = [
    {
      id: 1,
      kodeSupplier: 'SUP-001',
      namaSupplier: 'PT Maju Jaya',
      noNpwpNik: '01.234.567.8-901.000',
      noInvoice: 'INV-001/2025',
      noFakturPajak: '010.001-22.12345678',
      jenisDokumen: 'Invoice',
      noDokumen: 'DOC-AP-001',
      tglDokumen: '2025-08-25',
      tglJatuhTempo: '2025-09-24',
      keterangan: 'Pembelian material',
      mataUang: 'IDR',
      nominalDpp: 20000000,
      nominalPpn: 2000000,
      subTotal: 22000000,
      umurHutang: '15 hari',
      bayar1: 10000000,
      bayar2: 0,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 12000000,
    },
    {
      id: 2,
      kodeSupplier: 'SUP-002',
      namaSupplier: 'CV Solusi Digital',
      noNpwpNik: '3275xxxxxxxxxxxx',
      noInvoice: 'INV-045/2025',
      noFakturPajak: '-',
      jenisDokumen: 'Tagihan Jasa',
      noDokumen: 'DOC-AP-045',
      tglDokumen: '2025-08-18',
      tglJatuhTempo: '2025-09-17',
      keterangan: 'Lisensi software',
      mataUang: 'IDR',
      nominalDpp: 12000000,
      nominalPpn: 1200000,
      subTotal: 13200000,
      umurHutang: '22 hari',
      bayar1: 5000000,
      bayar2: 2500000,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 5700000,
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
                Laporan Outstanding Hutang
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Finance
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  AP
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Laporan AP</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Laporan AP</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Supplier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Supplier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No NPWP / No NIK</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Invoice</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Faktur Pajak</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Dokumen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Dokumen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl. Dokumen (….... s/d…...)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl. Jatuh Tempo (….... s/d…...)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Uang</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal DPP</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal PPN</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SubTotal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Umur Hutang / Aging</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 1</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 2</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 3</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 4</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 5</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 6</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Outstanding Hutang</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyTableData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kodeSupplier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaSupplier}</td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.nominalPpn.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.subTotal.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.umurHutang}</td>
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

export default LaporanAPDashboard;
