import React, { useState, useMemo } from "react";
import { FileText, Download, FileSpreadsheet, Filter, Clock } from "lucide-react";

interface LaporanARData {
  id: number;
  kodeCustomer: string;
  namaCustomer: string;
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
  umurPiutang: string;
  statusPiutang: 'Belum Bayar' | 'Sebagian Bayar' | 'Lunas' | 'Overdue';
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

const FinanceLaporanARDashboard: React.FC = () => {
  // Filter states
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterInvoice, setFilterInvoice] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [tglDokumenDari, setTglDokumenDari] = useState('');
  const [tglDokumenSampai, setTglDokumenSampai] = useState('');
  const [tglJatuhTempoDari, setTglJatuhTempoDari] = useState('');
  const [tglJatuhTempoSampai, setTglJatuhTempoSampai] = useState('');

  const [dummyTableData] = useState<LaporanARData[]>([
    {
      id: 1,
      kodeCustomer: 'CUST-001',
      namaCustomer: 'PT Pertamina Hulu Energi',
      noNpwpNik: '01.234.567.8-901.000',
      noInvoice: 'INV-AR-001/2025',
      noFakturPajak: '010.001-22.12345678',
      jenisDokumen: 'Invoice',
      noDokumen: 'DOC-AR-001',
      tglDokumen: '2025-08-25',
      tglJatuhTempo: '2025-09-24',
      keterangan: 'Jasa NDT Inspection',
      mataUang: 'IDR',
      nominalDpp: 50000000,
      nominalPpn: 5000000,
      subTotal: 55000000,
      umurPiutang: '15 hari',
      statusPiutang: 'Sebagian Bayar',
      tglPembayaran: '2025-09-01',
      nomerBayar: 'BKM-001/2025',
      bayar1: 25000000,
      bayar2: 0,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 30000000,
    },
    {
      id: 2,
      kodeCustomer: 'CUST-002',
      namaCustomer: 'Medco E&P Indonesia',
      noNpwpNik: '3275xxxxxxxxxxxx',
      noInvoice: 'INV-AR-045/2025',
      noFakturPajak: '010.002-22.87654321',
      jenisDokumen: 'Invoice',
      noDokumen: 'DOC-AR-045',
      tglDokumen: '2025-08-18',
      tglJatuhTempo: '2025-09-17',
      keterangan: 'Radiographic Testing',
      mataUang: 'IDR',
      nominalDpp: 35000000,
      nominalPpn: 3500000,
      subTotal: 38500000,
      umurPiutang: '22 hari',
      statusPiutang: 'Lunas',
      tglPembayaran: '2025-09-10',
      nomerBayar: 'BKM-002/2025',
      bayar1: 38500000,
      bayar2: 0,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 0,
    },
    {
      id: 3,
      kodeCustomer: 'CUST-003',
      namaCustomer: 'ENI Muara Bakau B.V.',
      noNpwpNik: '02.345.678.9-012.000',
      noInvoice: 'INV-AR-078/2025',
      noFakturPajak: '010.003-22.11223344',
      jenisDokumen: 'Invoice',
      noDokumen: 'DOC-AR-078',
      tglDokumen: '2025-09-01',
      tglJatuhTempo: '2025-10-01',
      keterangan: 'Ultrasonic Testing',
      mataUang: 'IDR',
      nominalDpp: 42000000,
      nominalPpn: 4200000,
      subTotal: 46200000,
      umurPiutang: '0 hari',
      statusPiutang: 'Belum Bayar',
      bayar1: 0,
      bayar2: 0,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 46200000,
    },
    {
      id: 4,
      kodeCustomer: 'CUST-004',
      namaCustomer: 'PT Chevron Pacific Indonesia',
      noNpwpNik: '3174xxxxxxxxxxxx',
      noInvoice: 'INV-AR-099/2025',
      noFakturPajak: '-',
      jenisDokumen: 'Invoice',
      noDokumen: 'DOC-AR-099',
      tglDokumen: '2025-07-15',
      tglJatuhTempo: '2025-08-14',
      keterangan: 'Magnetic Testing',
      mataUang: 'IDR',
      nominalDpp: 28000000,
      nominalPpn: 2800000,
      subTotal: 30800000,
      umurPiutang: '36 hari',
      statusPiutang: 'Overdue',
      bayar1: 0,
      bayar2: 0,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 30800000,
    },
    {
      id: 5,
      kodeCustomer: 'CUST-005',
      namaCustomer: 'PT Santos (Sampang) Pty Ltd',
      noNpwpNik: '01.987.654.3-210.000',
      noInvoice: 'INV-AR-112/2025',
      noFakturPajak: '010.004-22.55667788',
      jenisDokumen: 'Invoice',
      noDokumen: 'DOC-AR-112',
      tglDokumen: '2025-08-30',
      tglJatuhTempo: '2025-09-29',
      keterangan: 'Visual Testing',
      mataUang: 'IDR',
      nominalDpp: 18000000,
      nominalPpn: 1800000,
      subTotal: 19800000,
      umurPiutang: '10 hari',
      statusPiutang: 'Sebagian Bayar',
      tglPembayaran: '2025-09-05',
      nomerBayar: 'BKM-003/2025',
      bayar1: 10000000,
      bayar2: 0,
      bayar3: 0,
      bayar4: 0,
      bayar5: 0,
      bayar6: 0,
      totalOutstanding: 9800000,
    }
  ]);

  // Filter data based on search criteria
  const filteredData = useMemo(() => {
    return dummyTableData.filter(item => {
      const matchesCustomer = filterCustomer === '' || 
        item.namaCustomer.toLowerCase().includes(filterCustomer.toLowerCase()) ||
        item.kodeCustomer.toLowerCase().includes(filterCustomer.toLowerCase());
      
      const matchesInvoice = filterInvoice === '' || 
        item.noInvoice.toLowerCase().includes(filterInvoice.toLowerCase());
      
      const matchesStatus = filterStatus === '' || item.statusPiutang === filterStatus;
      
      const matchesTglDokumen = (!tglDokumenDari || item.tglDokumen >= tglDokumenDari) &&
        (!tglDokumenSampai || item.tglDokumen <= tglDokumenSampai);
      
      const matchesTglJatuhTempo = (!tglJatuhTempoDari || item.tglJatuhTempo >= tglJatuhTempoDari) &&
        (!tglJatuhTempoSampai || item.tglJatuhTempo <= tglJatuhTempoSampai);

      return matchesCustomer && matchesInvoice && matchesStatus && 
             matchesTglDokumen && matchesTglJatuhTempo;
    });
  }, [dummyTableData, filterCustomer, filterInvoice, filterStatus, 
      tglDokumenDari, tglDokumenSampai, tglJatuhTempoDari, tglJatuhTempoSampai]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'Lunas':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Lunas</span>;
      case 'Sebagian Bayar':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Sebagian Bayar</span>;
      case 'Belum Bayar':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Belum Bayar</span>;
      case 'Overdue':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Overdue</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Data</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <input
              type="text"
              placeholder="Cari customer..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterCustomer}
              onChange={(e) => setFilterCustomer(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No Invoice</label>
            <input
              type="text"
              placeholder="Cari invoice..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterInvoice}
              onChange={(e) => setFilterInvoice(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Piutang</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="Belum Bayar">Belum Bayar</option>
              <option value="Sebagian Bayar">Sebagian Bayar</option>
              <option value="Lunas">Lunas</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Dokumen Dari</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tglDokumenDari}
              onChange={(e) => setTglDokumenDari(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Dokumen Sampai</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tglDokumenSampai}
              onChange={(e) => setTglDokumenSampai(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Jatuh Tempo Dari</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tglJatuhTempoDari}
              onChange={(e) => setTglJatuhTempoDari(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Jatuh Tempo Sampai</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tglJatuhTempoSampai}
              onChange={(e) => setTglJatuhTempoSampai(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <FileSpreadsheet className="h-4 w-4" />
          Export Excel
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Download className="h-4 w-4" />
          Export PDF
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Daftar Laporan AR</h2>
            <div className="text-sm text-gray-500">
              Menampilkan {filteredData.length} dari {dummyTableData.length} data
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No NPWP/NIK</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Invoice</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Faktur Pajak</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Dokumen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Dokumen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Dokumen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Jatuh Tempo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Piutang</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Pembayaran</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomer Bayar</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Uang</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal DPP</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal PPN</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Umur Piutang</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 1</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 2</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 3</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 4</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 5</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal Pembayaran ke 6</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Outstanding Piutang</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.statusPiutang)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tglPembayaran ? new Date(item.tglPembayaran).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nomerBayar || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.mataUang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.nominalDpp.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.nominalPpn.toLocaleString('id-ID')}</td>
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
    </div>
  );
};

export default FinanceLaporanARDashboard;
