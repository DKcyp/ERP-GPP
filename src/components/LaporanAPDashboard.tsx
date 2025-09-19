import React, { useState, useMemo } from "react";
import { Clock, FileText, Download, FileSpreadsheet, Search, Filter } from "lucide-react";

interface LaporanAPData {
  id: number;
  kodeSupplier: string;
  namaSupplier: string;
  noNpwpNik: string;
  noInvoice: string;
  noFakturPajak: string;
  jenisDokumen: string;
  noDokumen: string;
  tglDokumen: string;
  tglJatuhTempo: string;
  keterangan: string;
  mataUang: string;
  nominalDpp: number;
  nominalPpn: number;
  subTotal: number;
  umurHutang: string;
  statusHutang: 'Belum Bayar' | 'Sebagian Bayar' | 'Lunas' | 'Overdue';
  tglPembayaran?: string;
  nomerBayar?: string;
  bayar1: number;
  bayar2: number;
  bayar3: number;
  bayar4: number;
  bayar5: number;
  bayar6: number;
  totalOutstanding: number;
}

const LaporanAPDashboard: React.FC = () => {
  // Filter states
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterInvoice, setFilterInvoice] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [tglDokumenDari, setTglDokumenDari] = useState('');
  const [tglDokumenSampai, setTglDokumenSampai] = useState('');
  const [tglJatuhTempoDari, setTglJatuhTempoDari] = useState('');
  const [tglJatuhTempoSampai, setTglJatuhTempoSampai] = useState('');

  const [dummyTableData] = useState<LaporanAPData[]>([
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
      statusHutang: 'Sebagian Bayar',
      tglPembayaran: '2025-09-01',
      nomerBayar: 'BKK-001/2025',
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
      statusHutang: 'Sebagian Bayar',
      tglPembayaran: '2025-08-30',
      nomerBayar: 'BKK-002/2025',
      bayar1: 5000000,
      bayar2: 2500000,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 5700000,
    },
    {
      id: 3,
      kodeSupplier: 'SUP-003',
      namaSupplier: 'PT Teknologi Maju',
      noNpwpNik: '02.345.678.9-012.000',
      noInvoice: 'INV-078/2025',
      noFakturPajak: '010.002-22.87654321',
      jenisDokumen: 'Invoice',
      noDokumen: 'DOC-AP-078',
      tglDokumen: '2025-09-01',
      tglJatuhTempo: '2025-10-01',
      keterangan: 'Pembelian hardware',
      mataUang: 'IDR',
      nominalDpp: 15000000,
      nominalPpn: 1500000,
      subTotal: 16500000,
      umurHutang: '0 hari',
      statusHutang: 'Lunas',
      tglPembayaran: '2025-09-15',
      nomerBayar: 'BKK-003/2025',
      bayar1: 16500000,
      bayar2: 0,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 0,
    },
    {
      id: 4,
      kodeSupplier: 'SUP-004',
      namaSupplier: 'CV Berkah Mandiri',
      noNpwpNik: '3174xxxxxxxxxxxx',
      noInvoice: 'INV-099/2025',
      noFakturPajak: '-',
      jenisDokumen: 'Tagihan Jasa',
      noDokumen: 'DOC-AP-099',
      tglDokumen: '2025-07-15',
      tglJatuhTempo: '2025-08-14',
      keterangan: 'Jasa konsultasi',
      mataUang: 'IDR',
      nominalDpp: 8000000,
      nominalPpn: 800000,
      subTotal: 8800000,
      umurHutang: '36 hari',
      statusHutang: 'Overdue',
      bayar1: 0,
      bayar2: 0,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 8800000,
    },
  ]);

  // Filter logic
  const filteredData = useMemo(() => {
    return dummyTableData.filter(item => {
      const supplierMatch = filterSupplier === '' || 
        item.namaSupplier.toLowerCase().includes(filterSupplier.toLowerCase()) ||
        item.kodeSupplier.toLowerCase().includes(filterSupplier.toLowerCase());
      
      const invoiceMatch = filterInvoice === '' || 
        item.noInvoice.toLowerCase().includes(filterInvoice.toLowerCase());
      
      const statusMatch = filterStatus === '' || item.statusHutang === filterStatus;
      
      const tglDokumenMatch = (!tglDokumenDari || new Date(item.tglDokumen) >= new Date(tglDokumenDari)) &&
        (!tglDokumenSampai || new Date(item.tglDokumen) <= new Date(tglDokumenSampai));
      
      const tglJatuhTempoMatch = (!tglJatuhTempoDari || new Date(item.tglJatuhTempo) >= new Date(tglJatuhTempoDari)) &&
        (!tglJatuhTempoSampai || new Date(item.tglJatuhTempo) <= new Date(tglJatuhTempoSampai));
      
      return supplierMatch && invoiceMatch && statusMatch && tglDokumenMatch && tglJatuhTempoMatch;
    });
  }, [dummyTableData, filterSupplier, filterInvoice, filterStatus, tglDokumenDari, tglDokumenSampai, tglJatuhTempoDari, tglJatuhTempoSampai]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Belum Bayar':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Belum Bayar</span>;
      case 'Sebagian Bayar':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Sebagian Bayar</span>;
      case 'Lunas':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Lunas</span>;
      case 'Overdue':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Overdue</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

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
        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="h-6 w-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Filter Laporan Outstanding Hutang</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
              <input
                type="text"
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
                placeholder="Nama/Kode Supplier..."
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Invoice</label>
              <input
                type="text"
                value={filterInvoice}
                onChange={(e) => setFilterInvoice(e.target.value)}
                placeholder="No Invoice..."
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Hutang</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">Semua Status</option>
                <option value="Belum Bayar">Belum Bayar</option>
                <option value="Sebagian Bayar">Sebagian Bayar</option>
                <option value="Lunas">Lunas</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Terapkan Filter
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl Dokumen Dari</label>
              <input
                type="date"
                value={tglDokumenDari}
                onChange={(e) => setTglDokumenDari(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl Dokumen Sampai</label>
              <input
                type="date"
                value={tglDokumenSampai}
                onChange={(e) => setTglDokumenSampai(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl Jatuh Tempo Dari</label>
              <input
                type="date"
                value={tglJatuhTempoDari}
                onChange={(e) => setTglJatuhTempoDari(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl Jatuh Tempo Sampai</label>
              <input
                type="date"
                value={tglJatuhTempoSampai}
                onChange={(e) => setTglJatuhTempoSampai(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Laporan Outstanding Hutang ({filteredData.length} items)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Supplier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Supplier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No NPWP/NIK</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Invoice</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Faktur Pajak</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Dokumen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Dokumen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Dokumen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Jatuh Tempo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Hutang</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Pembayaran</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomer Bayar</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Uang</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal DPP</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal PPN</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Umur Hutang</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 1</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 2</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 3</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 4</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 5</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Outstanding Hutang</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.statusHutang)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tglPembayaran ? new Date(item.tglPembayaran).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nomerBayar || '-'}</td>
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
