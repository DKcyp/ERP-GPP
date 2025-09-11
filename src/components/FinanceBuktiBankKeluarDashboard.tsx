import React, { useMemo, useState } from 'react';
import { Clock, PlusCircle, FileSpreadsheet, FileDown, Edit, Trash2, Search } from 'lucide-react';
import FinanceBuktiBankKeluarModal, { BBKKeluarFormData } from './FinanceBuktiBankKeluarModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface BBKSummaryRow {
  id: number;
  tanggal: string; // yyyy-mm-dd
  noBBK: string;
  divisi: string;
  jenisTransaksi: string;
  noDokumen: string;
  bayarKepada: string;
  keterangan: string;
  bank: string; // display label: Nama Bank (norek - alamat)
  total: number;
}

const FinanceBuktiBankKeluarDashboard: React.FC = () => {
  const today = new Date();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Tambah Bukti Bank Keluar');
  const [editingData, setEditingData] = useState<BBKKeluarFormData | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<BBKSummaryRow | null>(null);

  const [searchNoBBK, setSearchNoBBK] = useState('');
  const [searchKeterangan, setSearchKeterangan] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [filterBank, setFilterBank] = useState('');

  const bankMeta: Record<string, { kode: string; norek: string; alamat: string }> = {
    'Bank Muamalat': { kode: 'MUAMALAT', norek: '1234567890', alamat: 'Jl. Jend. Sudirman No. 1, Jakarta' },
    'Bank Mandiri Gaji': { kode: 'MANDIRI-GAJI', norek: '1400012345678', alamat: 'KCP Mandiri Gaji, Jl. Gatot Subroto, Jakarta' },
    'Bank Mandiri Operasional': { kode: 'MANDIRI-OPS', norek: '1400098765432', alamat: 'KCP Mandiri Operasional, Jl. MH Thamrin, Jakarta' },
    'Bank Mandiri Tabungan': { kode: 'MANDIRI-TAB', norek: '1400076543210', alamat: 'KCP Mandiri Tabungan, Jl. Asia Afrika, Bandung' },
    'Bank Mandiri PPN': { kode: 'MANDIRI-PPN', norek: '1400055512345', alamat: 'KCP Mandiri Pajak, Jl. Jend. Sudirman, Jakarta' },
    'Bank Mandiri Vendor': { kode: 'MANDIRI-VENDOR', norek: '1400033345678', alamat: 'KCP Mandiri Vendor, Jl. Pemuda, Jakarta' },
    'Bank Mandiri Kesejahteraan': { kode: 'MANDIRI-KES', norek: '1400022245678', alamat: 'KCP Mandiri Kesejahteraan, Jl. Diponegoro, Surabaya' },
    'Bank Mandiri Zakat': { kode: 'MANDIRI-ZKT', norek: '1400099912345', alamat: 'KCP Mandiri Zakat, Jl. Asia Afrika, Bandung' },
    'Bank BCA': { kode: 'BCA', norek: '8888888888', alamat: 'KCU BCA, Jl. Jend. Sudirman, Jakarta' },
  };
  const formatBankOption = (base: string) => `${base} (${bankMeta[base].norek} - ${bankMeta[base].alamat})`;
  const bankOptions = Object.keys(bankMeta).map(formatBankOption);

  const [rows, setRows] = useState<BBKSummaryRow[]>([
    { id: 1, tanggal: '2025-09-05', noBBK: 'BBK-2025-09-001', divisi: 'Finance', jenisTransaksi: 'Pembelian Barang', noDokumen: 'DOC-301', bayarKepada: 'Vendor A', keterangan: 'Pembelian alat', bank: formatBankOption('Bank Mandiri Operasional'), total: 2750000 },
    { id: 2, tanggal: '2025-09-06', noBBK: 'BBK-2025-09-002', divisi: 'Accounting', jenisTransaksi: 'Pelunasan Hutang', noDokumen: 'DOC-302', bayarKepada: 'Vendor B', keterangan: 'Pelunasan invoice', bank: formatBankOption('Bank BCA'), total: 4300000 },
  ]);

  const handleAdd = () => {
    setEditingData(null);
    setModalTitle('Tambah Bukti Bank Keluar');
    setIsModalOpen(true);
  };

  const handleEdit = (row: BBKSummaryRow) => {
    const base = row.bank.split(' (')[0];
    const meta = bankMeta[base] || { kode: '', norek: '', alamat: '' };
    const data: BBKKeluarFormData = {
      id: row.id,
      noBBK: row.noBBK,
      tglBBK: new Date(row.tanggal),
      namaDivisi: row.divisi,
      jenisTransaksi: row.jenisTransaksi,
      noDokumen: row.noDokumen,
      bayarKepada: row.bayarKepada,
      keterangan: row.keterangan,
      detailItems: [{ id: 1, kodeBank: meta.kode, namaBank: row.bank, norek: meta.norek, alamat: meta.alamat, nominal: row.total }],
      total: row.total,
    };
    setEditingData(data);
    setModalTitle('Edit Bukti Bank Keluar');
    setIsModalOpen(true);
  };

  const handleSave = (data: BBKKeluarFormData) => {
    if (data.id) {
      setRows(prev => prev.map(r => r.id === data.id ? {
        id: data.id!,
        tanggal: data.tglBBK ? data.tglBBK.toISOString().split('T')[0] : r.tanggal,
        noBBK: data.noBBK,
        divisi: data.namaDivisi,
        jenisTransaksi: data.jenisTransaksi,
        noDokumen: data.noDokumen,
        bayarKepada: data.bayarKepada,
        keterangan: data.keterangan,
        bank: data.detailItems[0]?.namaBank || r.bank,
        total: data.total,
      } : r));
    } else {
      const newId = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1;
      const newRow: BBKSummaryRow = {
        id: newId,
        tanggal: data.tglBBK ? data.tglBBK.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        noBBK: data.noBBK,
        divisi: data.namaDivisi,
        jenisTransaksi: data.jenisTransaksi,
        noDokumen: data.noDokumen,
        bayarKepada: data.bayarKepada,
        keterangan: data.keterangan,
        bank: data.detailItems[0]?.namaBank || '',
        total: data.total,
      };
      setRows(prev => [newRow, ...prev]);
    }
  };

  const handleDelete = (row: BBKSummaryRow) => { setRowToDelete(row); setIsConfirmOpen(true); };
  const confirmDelete = () => { if (rowToDelete) setRows(prev => prev.filter(r => r.id !== rowToDelete.id)); };

  const filtered = useMemo(() => rows.filter(r => {
    const okNo = searchNoBBK ? r.noBBK.toLowerCase().includes(searchNoBBK.toLowerCase()) : true;
    const okKet = searchKeterangan ? r.keterangan.toLowerCase().includes(searchKeterangan.toLowerCase()) : true;
    const okDiv = filterDivisi ? r.divisi === filterDivisi : true;
    const okBank = filterBank ? r.bank === filterBank : true;
    return okNo && okKet && okDiv && okBank;
  }), [rows, searchNoBBK, searchKeterangan, filterDivisi, filterBank]);

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">BUKTI BANK KELUAR</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Bank / Bukti Bank Keluar</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter Bukti Bank Keluar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari No BBK</label>
              <input type="text" value={searchNoBBK} onChange={e => setSearchNoBBK(e.target.value)} placeholder="BBK-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Keterangan</label>
              <input type="text" value={searchKeterangan} onChange={e => setSearchKeterangan(e.target.value)} placeholder="Keterangan..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Divisi</label>
              <select value={filterDivisi} onChange={e => setFilterDivisi(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua Divisi</option>
                {['Marketing','HRD','GA','Procurement','Project Control','Operasional','QHSE','Finance','Accounting','Tax','Gudang'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank</label>
              <select value={filterBank} onChange={e => setFilterBank(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua Bank</option>
                {bankOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => { /* trigger memo */ }} className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Cari Data
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center space-y-3 md:space-y-0 md:space-x-3 mt-6">
            <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah BBK
            </button>
            <button onClick={exportExcel} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 w-full md:w-auto">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button onClick={exportPDF} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 w-full md:w-auto">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Bukti Bank Keluar</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. BBK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl BBK (….... s/d…...)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Divisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode Bank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Bank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Transaksi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bayar Kepada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => {
                  const baseBank = row.bank.split(' (')[0];
                  return (
                    <tr key={row.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row.noBBK}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tanggal).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.divisi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bankMeta[baseBank]?.kode || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.bank}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.jenisTransaksi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noDokumen}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.bayarKepada}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keterangan}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FinanceBuktiBankKeluarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingData}
        title={modalTitle}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={rowToDelete?.noBBK}
        message="Apakah Anda yakin ingin menghapus Bukti Bank Keluar ini?"
      />
    </div>
  );
};

export default FinanceBuktiBankKeluarDashboard;
