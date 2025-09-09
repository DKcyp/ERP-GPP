import React, { useMemo, useState } from 'react';
import { Clock, PlusCircle, FileSpreadsheet, FileDown, Edit, Trash2, Search } from 'lucide-react';
import FinancePermintaanPencairanDanaModal, { PermintaanPencairanDanaFormData } from './FinancePermintaanPencairanDanaModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface PPDRow {
  id: number;
  tanggal: string; // yyyy-mm-dd
  noPPD: string;
  divisi: string;
  pemohon: string;
  keperluanUmum: string;
  bank: string; // display label Nama Bank (norek - alamat)
  total: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
}

const FinancePermintaanPencairanDanaDashboard: React.FC = () => {
  const today = new Date();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Tambah Permintaan Pencairan Dana');
  const [editingData, setEditingData] = useState<PermintaanPencairanDanaFormData | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<PPDRow | null>(null);

  const [searchNo, setSearchNo] = useState('');
  const [searchPemohon, setSearchPemohon] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const divisiOptions = ['Marketing','HRD','GA','Procurement','Project Control','Operasional','QHSE','Finance','Accounting','Tax','Gudang'];

  const [rows, setRows] = useState<PPDRow[]>([
    { id: 1, tanggal: '2025-09-05', noPPD: 'PPD-2025-09-001', divisi: 'Finance', pemohon: 'Rina', keperluanUmum: 'Pembayaran vendor A', bank: 'Bank Mandiri Operasional (1400098765432 - KCP Mandiri Operasional, Jl. MH Thamrin, Jakarta)', total: 7500000, status: 'Submitted' },
    { id: 2, tanggal: '2025-09-06', noPPD: 'PPD-2025-09-002', divisi: 'Accounting', pemohon: 'Budi', keperluanUmum: 'Pembayaran PPN', bank: 'Bank Mandiri PPN (1400055512345 - KCP Mandiri Pajak, Jl. Jend. Sudirman, Jakarta)', total: 4500000, status: 'Approved' },
  ]);

  const handleAdd = () => {
    setEditingData(null);
    setModalTitle('Tambah Permintaan Pencairan Dana');
    setIsModalOpen(true);
  };

  const handleEdit = (row: PPDRow) => {
    const data: PermintaanPencairanDanaFormData = {
      id: row.id,
      noPPD: row.noPPD,
      tglPPD: new Date(row.tanggal),
      divisi: row.divisi,
      pemohon: row.pemohon,
      keperluanUmum: row.keperluanUmum,
      detailItems: [{ id: 1, kodeBank: '', namaBank: row.bank, norek: '', alamat: '', nominal: row.total, keterangan: '' }],
      total: row.total,
    };
    setEditingData(data);
    setModalTitle('Edit Permintaan Pencairan Dana');
    setIsModalOpen(true);
  };

  const handleSave = (data: PermintaanPencairanDanaFormData) => {
    if (data.id) {
      setRows(prev => prev.map(r => r.id === data.id ? {
        id: data.id!,
        tanggal: data.tglPPD ? data.tglPPD.toISOString().split('T')[0] : r.tanggal,
        noPPD: data.noPPD,
        divisi: data.divisi,
        pemohon: data.pemohon,
        keperluanUmum: data.keperluanUmum,
        bank: data.detailItems[0]?.namaBank || r.bank,
        total: data.total,
        status: r.status,
      } : r));
    } else {
      const newId = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1;
      const newRow: PPDRow = {
        id: newId,
        tanggal: data.tglPPD ? data.tglPPD.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        noPPD: data.noPPD,
        divisi: data.divisi,
        pemohon: data.pemohon,
        keperluanUmum: data.keperluanUmum,
        bank: data.detailItems[0]?.namaBank || '',
        total: data.total,
        status: 'Draft',
      };
      setRows(prev => [newRow, ...prev]);
    }
  };

  const handleDelete = (row: PPDRow) => { setRowToDelete(row); setIsConfirmOpen(true); };
  const confirmDelete = () => { if (rowToDelete) setRows(prev => prev.filter(r => r.id !== rowToDelete.id)); };

  const filtered = useMemo(() => rows.filter(r => {
    const okNo = searchNo ? r.noPPD.toLowerCase().includes(searchNo.toLowerCase()) : true;
    const okPem = searchPemohon ? r.pemohon.toLowerCase().includes(searchPemohon.toLowerCase()) : true;
    const okDiv = filterDivisi ? r.divisi === filterDivisi : true;
    const okStat = filterStatus ? r.status === filterStatus : true;
    return okNo && okPem && okDiv && okStat;
  }), [rows, searchNo, searchPemohon, filterDivisi, filterStatus]);

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">PERMINTAAN PENCAIRAN DANA</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Permintaan Pencairan Dana</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari No PPD</label>
              <input type="text" value={searchNo} onChange={e => setSearchNo(e.target.value)} placeholder="PPD-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pemohon</label>
              <input type="text" value={searchPemohon} onChange={e => setSearchPemohon(e.target.value)} placeholder="Nama pemohon..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Divisi</label>
              <select value={filterDivisi} onChange={e => setFilterDivisi(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua Divisi</option>
                {divisiOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => { /* trigger memo */ }} className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Cari Data
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center space-y-3 md:space-y-0 md:space-x-3 mt-2">
            <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah PPD
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Permintaan Pencairan Dana</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No PPD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Divisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pemohon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keperluan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row.noPPD}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.divisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.pemohon}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keperluanUmum}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.bank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">Rp {row.total.toLocaleString('id-ID')}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${row.status === 'Approved' ? 'text-green-700' : row.status === 'Submitted' ? 'text-blue-700' : row.status === 'Rejected' ? 'text-red-700' : 'text-gray-600'}`}>{row.status}</td>
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

      <FinancePermintaanPencairanDanaModal
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
        itemName={rowToDelete?.noPPD}
        message="Apakah Anda yakin ingin menghapus Permintaan Pencairan Dana ini?"
      />
    </div>
  );
};

export default FinancePermintaanPencairanDanaDashboard;
