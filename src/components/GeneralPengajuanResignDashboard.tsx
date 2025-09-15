import React, { useMemo, useState } from 'react';
import { PlusCircle, Search, Download, Pencil, Trash2, X, Calendar } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface PengajuanResignItem {
  id: string;
  tanggalPengajuan: string; // ISO date
  namaPegawai: string;
  departemen: string;
  alasan: string;
  tanggalEfektif: string; // ISO date
  status: 'Draft' | 'Diajukan' | 'Disetujui' | 'Ditolak';
}

const GeneralPengajuanResignDashboard: React.FC = () => {
  const [data, setData] = useState<PengajuanResignItem[]>([
    { id: 'RS-0001', tanggalPengajuan: '2025-02-01', namaPegawai: 'Adi Putra', departemen: 'Marketing', alasan: 'Pindah domisili', tanggalEfektif: '2025-03-01', status: 'Diajukan' },
    { id: 'RS-0002', tanggalPengajuan: '2025-02-10', namaPegawai: 'Rina K', departemen: 'QHSE', alasan: 'Alasan pribadi', tanggalEfektif: '2025-03-10', status: 'Draft' },
  ]);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [departemenFilter, setDepartemenFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  const filtered = useMemo(() => {
    return data.filter((it) => {
      const q = searchText.toLowerCase();
      const matchSearch = !q || it.namaPegawai.toLowerCase().includes(q) || it.alasan.toLowerCase().includes(q);
      const matchDept = !departemenFilter || it.departemen === departemenFilter;
      const matchStatus = !statusFilter || it.status === (statusFilter as any);
      return matchSearch && matchDept && matchStatus;
    });
  }, [data, searchText, departemenFilter, statusFilter]);

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PengajuanResignItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PengajuanResignItem | null>(null);

  // Form state
  const [form, setForm] = useState<Omit<PengajuanResignItem, 'id'>>({
    tanggalPengajuan: '',
    namaPegawai: '',
    departemen: '',
    alasan: '',
    tanggalEfektif: '',
    status: 'Draft',
  });

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ tanggalPengajuan: '', namaPegawai: '', departemen: '', alasan: '', tanggalEfektif: '', status: 'Draft' });
    setShowFormModal(true);
  };

  const openEditModal = (item: PengajuanResignItem) => {
    setEditingItem(item);
    setForm({
      tanggalPengajuan: item.tanggalPengajuan,
      namaPegawai: item.namaPegawai,
      departemen: item.departemen,
      alasan: item.alasan,
      tanggalEfektif: item.tanggalEfektif,
      status: item.status,
    });
    setShowFormModal(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setData((prev) => prev.map((it) => (it.id === editingItem.id ? { ...editingItem, ...form } : it)));
    } else {
      const idNum = Math.floor(1 + Math.random() * 9999).toString().padStart(4, '0');
      setData((prev) => [{ id: `RS-${idNum}`, ...form }, ...prev]);
    }
    setShowFormModal(false);
    setEditingItem(null);
  };

  const askDelete = (item: PengajuanResignItem) => {
    setDeleteTarget(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setData((prev) => prev.filter((it) => it.id !== deleteTarget.id));
      setDeleteTarget(null);
      setShowDeleteModal(false);
    }
  };

  const handleExport = (type: string) => {
    alert(`Exporting as ${type}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">PENGAJUAN RESIGN</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">General</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Absensi</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Pengajuan Resign</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
              <div className="relative">
                <input className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Nama/alasan..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departemen</label>
              <select className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none" value={departemenFilter} onChange={(e) => setDepartemenFilter(e.target.value)}>
                <option value="">Semua</option>
                <option>Marketing</option>
                <option>QHSE</option>
                <option>HRD</option>
                <option>Pengadaan</option>
                <option>Gudang</option>
                <option>Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Semua</option>
                <option>Draft</option>
                <option>Diajukan</option>
                <option>Disetujui</option>
                <option>Ditolak</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={openAddModal} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Pengajuan
            </button>
            <button onClick={() => {}} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select value={showEntries} onChange={(e) => setShowEntries(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => handleExport('Excel')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button onClick={() => handleExport('CSV')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button onClick={() => handleExport('PDF')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <Download className="h-5 w-5 mr-2" /> PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pengajuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alasan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Efektif</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((it) => (
                  <tr key={it.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(it.tanggalPengajuan).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{it.namaPegawai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{it.departemen}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{it.alasan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(it.tanggalEfektif).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${it.status === 'Disetujui' ? 'bg-green-100 text-green-800' : it.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{it.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(it)} className="inline-flex items-center px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 text-xs"><Pencil className="h-4 w-4 mr-1" /> Edit</button>
                        <button onClick={() => askDelete(it)} className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 text-xs"><Trash2 className="h-4 w-4 mr-1" /> Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Modal */}
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit Pengajuan Resign' : 'Tambah Pengajuan Resign'}</h2>
                <button onClick={() => { setShowFormModal(false); setEditingItem(null); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengajuan</label>
                    <input type="date" value={form.tanggalPengajuan} onChange={(e) => setForm((f) => ({ ...f, tanggalPengajuan: e.target.value }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Efektif</label>
                    <input type="date" value={form.tanggalEfektif} onChange={(e) => setForm((f) => ({ ...f, tanggalEfektif: e.target.value }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai</label>
                    <input type="text" value={form.namaPegawai} onChange={(e) => setForm((f) => ({ ...f, namaPegawai: e.target.value }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Nama Pegawai" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
                    <select value={form.departemen} onChange={(e) => setForm((f) => ({ ...f, departemen: e.target.value }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                      <option value="">Pilih departemen...</option>
                      <option>Marketing</option>
                      <option>QHSE</option>
                      <option>HRD</option>
                      <option>Pengadaan</option>
                      <option>Gudang</option>
                      <option>Finance</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alasan</label>
                  <textarea value={form.alasan} onChange={(e) => setForm((f) => ({ ...f, alasan: e.target.value }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm h-24" placeholder="Masukkan alasan" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))} className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                    <option>Draft</option>
                    <option>Diajukan</option>
                    <option>Disetujui</option>
                    <option>Ditolak</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                <button onClick={() => { setShowFormModal(false); setEditingItem(null); }} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Batal</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Simpan</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Konfirmasi Hapus Pengajuan Resign"
          message="Apakah Anda yakin ingin menghapus pengajuan resign ini?"
          itemName={deleteTarget ? `${deleteTarget.id} - ${deleteTarget.namaPegawai}` : undefined}
        />
      </div>
    </div>
  );
};

export default GeneralPengajuanResignDashboard;
