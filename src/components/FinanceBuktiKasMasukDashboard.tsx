import React, { useMemo, useState } from 'react';
import { Clock, PlusCircle, FileSpreadsheet, FileDown, Edit, Trash2, Search } from 'lucide-react';
import FinanceBuktiKasMasukModal, { BKMMasukFormData } from './FinanceBuktiKasMasukModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface BKMSummaryRow {
  id: number;
  tanggal: string; // yyyy-mm-dd
  noBKM: string;
  divisi: string;
  jenisTransaksi: string;
  noDokumen: string;
  terimaDari: string;
  keterangan: string;
  total: number;
}

const FinanceBuktiKasMasukDashboard: React.FC = () => {
  const today = new Date();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Tambah Bukti Kas Masuk');
  const [editingData, setEditingData] = useState<BKMMasukFormData | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<BKMSummaryRow | null>(null);

  const [searchNoBKM, setSearchNoBKM] = useState('');
  const [searchKeterangan, setSearchKeterangan] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [filterTanggalBKM, setFilterTanggalBKM] = useState('');

  const [rows, setRows] = useState<BKMSummaryRow[]>([
    { id: 1, tanggal: '2025-09-01', noBKM: 'BKM-2025-09-001', divisi: 'Finance', jenisTransaksi: 'Penerimaan Pendapatan', noDokumen: 'DOC-001', terimaDari: 'Client A', keterangan: 'Pembayaran proyek', total: 3500000 },
    { id: 2, tanggal: '2025-09-02', noBKM: 'BKM-2025-09-002', divisi: 'Accounting', jenisTransaksi: 'Pelunasan Piutang', noDokumen: 'DOC-002', terimaDari: 'Client B', keterangan: 'Pelunasan invoice', total: 5000000 },
  ]);

  const handleAdd = () => {
    setEditingData(null);
    setModalTitle('Tambah Bukti Kas Masuk');
    setIsModalOpen(true);
  };

  const handleEdit = (row: BKMSummaryRow) => {
    const data: BKMMasukFormData = {
      id: row.id,
      noBKM: row.noBKM,
      tglBKM: new Date(row.tanggal),
      namaDivisi: row.divisi,
      jenisTransaksi: row.jenisTransaksi,
      noDokumen: row.noDokumen,
      terimaDari: row.terimaDari,
      keterangan: row.keterangan,
      detailItems: [{ id: 1, kodeKas: 'KAS01', namaKas: 'Kas Umum', nominal: row.total }],
      total: row.total,
    };
    setEditingData(data);
    setModalTitle('Edit Bukti Kas Masuk');
    setIsModalOpen(true);
  };

  const handleSave = (data: BKMMasukFormData) => {
    if (data.id) {
      setRows(prev => prev.map(r => r.id === data.id ? {
        id: data.id!,
        tanggal: data.tglBKM ? data.tglBKM.toISOString().split('T')[0] : r.tanggal,
        noBKM: data.noBKM,
        divisi: data.namaDivisi,
        jenisTransaksi: data.jenisTransaksi,
        noDokumen: data.noDokumen,
        terimaDari: data.terimaDari,
        keterangan: data.keterangan,
        total: data.total,
      } : r));
    } else {
      const newId = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1;
      const newRow: BKMSummaryRow = {
        id: newId,
        tanggal: data.tglBKM ? data.tglBKM.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        noBKM: data.noBKM,
        divisi: data.namaDivisi,
        jenisTransaksi: data.jenisTransaksi,
        noDokumen: data.noDokumen,
        terimaDari: data.terimaDari,
        keterangan: data.keterangan,
        total: data.total,
      };
      setRows(prev => [newRow, ...prev]);
    }
  };

  const handleDelete = (row: BKMSummaryRow) => {
    setRowToDelete(row);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (rowToDelete) setRows(prev => prev.filter(r => r.id !== rowToDelete.id));
  };

  const filtered = useMemo(() => rows.filter(r => {
    const okBKM = searchNoBKM ? r.noBKM.toLowerCase().includes(searchNoBKM.toLowerCase()) : true;
    const okKet = searchKeterangan ? r.keterangan.toLowerCase().includes(searchKeterangan.toLowerCase()) : true;
    const okDiv = filterDivisi ? r.divisi === filterDivisi : true;
    const okTgl = filterTanggalBKM ? r.tanggal === filterTanggalBKM : true;
    return okBKM && okKet && okDiv && okTgl;
  }), [rows, searchNoBKM, searchKeterangan, filterDivisi, filterTanggalBKM]);

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">BUKTI KAS MASUK</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Kas / Bukti Kas Masuk</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter BKM</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari No BKM</label>
              <input type="text" value={searchNoBKM} onChange={e => setSearchNoBKM(e.target.value)} placeholder="BKM-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal BKM</label>
              <input type="date" value={filterTanggalBKM} onChange={e => setFilterTanggalBKM(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center space-y-3 md:space-y-0 md:space-x-3 mt-6">
            <button onClick={() => { setSearchNoBKM(''); setSearchKeterangan(''); setFilterDivisi(''); setFilterTanggalBKM(''); }} className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none">
              Reset Filter
            </button>
            <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah BKM
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Bukti Kas Masuk</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No BKM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Divisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Transaksi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Terima Dari</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row.noBKM}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.divisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.jenisTransaksi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noDokumen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.terimaDari}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">Rp {row.total.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(row)} className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50" title="Hapus">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FinanceBuktiKasMasukModal
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
        itemName={rowToDelete?.noBKM}
        message="Apakah Anda yakin ingin menghapus Bukti Kas Masuk ini?"
      />
    </div>
  );
};

export default FinanceBuktiKasMasukDashboard;
