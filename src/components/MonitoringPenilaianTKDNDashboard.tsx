import React, { useMemo, useState } from 'react';
import { Clock, Download, Pencil, PlusCircle, Search, Trash2, X, FileText } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface PenilaianTKDNItem {
  id: string;
  noKontrak: string;
  judulTender: string;
  documentUrl: string;
}

const MonitoringPenilaianTKDNDashboard: React.FC = () => {
  const initialData: PenilaianTKDNItem[] = [
    { id: 'PTKDN-001', noKontrak: 'KTR-2025-0007', judulTender: 'Pengadaan Peralatan X', documentUrl: '#' },
    { id: 'PTKDN-002', noKontrak: 'KTR-2025-0011', judulTender: 'Jasa Perawatan Tahunan', documentUrl: '#' },
  ];

  const [data, setData] = useState<PenilaianTKDNItem[]>(initialData);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PenilaianTKDNItem | null>(null);
  const [form, setForm] = useState<Omit<PenilaianTKDNItem, 'id'>>({ noKontrak: '', judulTender: '', documentUrl: '#' });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PenilaianTKDNItem | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((it) =>
      it.noKontrak.toLowerCase().includes(q) ||
      it.judulTender.toLowerCase().includes(q)
    );
  }, [data, search]);

  const openAdd = () => {
    setEditing(null);
    setForm({ noKontrak: '', judulTender: '', documentUrl: '#' });
    setShowForm(true);
  };

  const openEdit = (item: PenilaianTKDNItem) => {
    setEditing(item);
    setForm({ noKontrak: item.noKontrak, judulTender: item.judulTender, documentUrl: item.documentUrl });
    setShowForm(true);
  };

  const save = () => {
    if (!form.noKontrak || !form.judulTender) return;
    if (editing) {
      setData((prev) => prev.map((it) => (it.id === editing.id ? { ...editing, ...form } : it)));
    } else {
      const id = `PTKDN-${Math.floor(1000 + Math.random() * 9000)}`;
      setData((prev) => [{ id, ...form }, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const askDelete = (item: PenilaianTKDNItem) => {
    setDeleteTarget(item);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) setData((prev) => prev.filter((it) => it.id !== deleteTarget.id));
    setDeleteTarget(null);
    setShowDelete(false);
  };

  const handleExport = (type: string) => {
    alert(`Exporting Penilaian TKDN as ${type}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">PENILAIAN TKDN</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600">Marketing</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Penilaian TKDN</span>
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
        {/* Filters & Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="No Kontrak / Judul Tender"
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <div className="flex gap-3 w-full justify-end">
                <button onClick={openAdd} className="inline-flex items-center px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 text-sm">
                  <PlusCircle className="h-5 w-5 mr-2" /> Tambah
                </button>
                <button onClick={() => {}} className="inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-sm">
                  <Search className="h-5 w-5 mr-2" /> Cari
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => handleExport('Excel')} className="inline-flex items-center px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 text-sm">
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button onClick={() => handleExport('CSV')} className="inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-sm">
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button onClick={() => handleExport('PDF')} className="inline-flex items-center px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 text-sm">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Kontrak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul Tender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((it) => (
                  <tr key={it.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.noKontrak}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{it.judulTender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <a href={it.documentUrl} target="_blank" rel="noreferrer" className="flex items-center hover:underline">
                        <FileText className="h-4 w-4 mr-1" /> Lihat
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(it)} className="inline-flex items-center px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 text-xs">
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button onClick={() => askDelete(it)} className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 text-xs">
                          <Trash2 className="h-4 w-4 mr-1" /> Hapus
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.currentTarget === e.target) setShowForm(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Penilaian TKDN' : 'Tambah Penilaian TKDN'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No Kontrak</label>
                  <input
                    value={form.noKontrak}
                    onChange={(e) => setForm((f) => ({ ...f, noKontrak: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nomor kontrak"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Tender</label>
                  <input
                    value={form.judulTender}
                    onChange={(e) => setForm((f) => ({ ...f, judulTender: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan judul tender"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tautan Dokumen</label>
                <input
                  value={form.documentUrl}
                  onChange={(e) => setForm((f) => ({ ...f, documentUrl: e.target.value }))}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="# atau URL dokumen"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      <ConfirmDeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus Penilaian TKDN"
        message="Apakah Anda yakin ingin menghapus data ini?"
        itemName={deleteTarget ? `${deleteTarget.noKontrak} - ${deleteTarget.judulTender}` : undefined}
      />
    </div>
  );
};

export default MonitoringPenilaianTKDNDashboard;
