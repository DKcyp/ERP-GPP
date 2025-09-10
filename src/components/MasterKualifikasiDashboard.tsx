import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Database, Search, PlusCircle, Download, Pencil, Trash2, X, Tag, DollarSign } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface KualifikasiItem {
  id: string;
  kualifikasi: string; // e.g., Welder, Inspector, Helper
  rateKualifikasi: string; // e.g., Harian, Bulanan, Per Jam
  harga: number; // price in IDR
  keterangan?: string;
}

const MasterKualifikasiDashboard: React.FC = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialData: KualifikasiItem[] = [
    { id: 'KQ001', kualifikasi: 'Welder', rateKualifikasi: 'Harian', harga: 350000, keterangan: 'Rate harian welder' },
    { id: 'KQ002', kualifikasi: 'Inspector', rateKualifikasi: 'Bulanan', harga: 7000000, keterangan: 'Rate bulanan inspector' },
    { id: 'KQ003', kualifikasi: 'Helper', rateKualifikasi: 'Harian', harga: 200000, keterangan: 'Rate harian helper' },
  ];

  const [data, setData] = useState<KualifikasiItem[]>(initialData);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<KualifikasiItem | null>(null);
  const [form, setForm] = useState<Omit<KualifikasiItem, 'id'>>({
    kualifikasi: '',
    rateKualifikasi: '',
    harga: 0,
    keterangan: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<KualifikasiItem | null>(null);

  // Search & Filter state (matching Monitoring MCU style)
  const [searchKualifikasi, setSearchKualifikasi] = useState('');
  const [rateFilter, setRateFilter] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  const formatIDR = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ kualifikasi: '', rateKualifikasi: '', harga: 0, keterangan: '' });
    setShowFormModal(true);
  };

  const openEditModal = (item: KualifikasiItem) => {
    setEditingItem(item);
    setForm({ kualifikasi: item.kualifikasi, rateKualifikasi: item.rateKualifikasi, harga: item.harga, keterangan: item.keterangan || '' });
    setShowFormModal(true);
  };

  const handleSave = () => {
    if (!form.kualifikasi || !form.rateKualifikasi) {
      alert('Mohon lengkapi kualifikasi dan rate kualifikasi.');
      return;
    }
    if (form.harga < 0) {
      alert('Harga tidak boleh negatif.');
      return;
    }

    if (editingItem) {
      setData(prev => prev.map(it => (it.id === editingItem.id ? { ...editingItem, ...form } : it)));
    } else {
      const newItem: KualifikasiItem = { id: generateId(), ...form };
      setData(prev => [newItem, ...prev]);
    }
    setShowFormModal(false);
    setEditingItem(null);
  };

  const generateId = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `KQ${num}`;
  };

  const askDelete = (item: KualifikasiItem) => {
    setDeleteTarget(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setData(prev => prev.filter(it => it.id !== deleteTarget.id));
      setDeleteTarget(null);
      setShowDeleteModal(false);
    }
  };

  const handleExport = (type: string) => {
    alert(`Exporting as ${type}`);
  };

  // Filtered data for display
  const filtered = data.filter(it => {
    const matchKualifikasi = it.kualifikasi.toLowerCase().includes(searchKualifikasi.toLowerCase());
    const matchRate = rateFilter ? it.rateKualifikasi === rateFilter : true;
    return matchKualifikasi && matchRate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MASTER KUALIFIKASI</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">HRD</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Rekrutmen</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master Kualifikasi</span>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Kualifikasi</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nama kualifikasi..."
                  value={searchKualifikasi}
                  onChange={(e) => setSearchKualifikasi(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Rate Kualifikasi</label>
              <div className="relative">
                <select
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={rateFilter}
                  onChange={(e) => setRateFilter(e.target.value)}
                >
                  <option value="">Semua rate...</option>
                  <option value="Harian">Harian</option>
                  <option value="Bulanan">Bulanan</option>
                  <option value="Per Jam">Per Jam</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Informasi</label>
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-2">
                Gunakan filter untuk mencari data kualifikasi dan rate beserta harga.
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Kualifikasi
            </button>
            <button
              onClick={() => { /* placeholder for search trigger */ }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleExport('Excel')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> PDF
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kualifikasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate Kualifikasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" /> {item.kualifikasi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.rateKualifikasi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-400" /> {formatIDR(item.harga)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.keterangan || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 text-xs"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => askDelete(item)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 text-xs"
                          title="Hapus"
                        >
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

        {/* Form Modal */}
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit Kualifikasi' : 'Tambah Kualifikasi'}</h2>
                <button onClick={() => { setShowFormModal(false); setEditingItem(null); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kualifikasi</label>
                  <input
                    type="text"
                    value={form.kualifikasi}
                    onChange={(e) => setForm((f) => ({ ...f, kualifikasi: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Contoh: Welder, Inspector"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate Kualifikasi</label>
                  <select
                    value={form.rateKualifikasi}
                    onChange={(e) => setForm((f) => ({ ...f, rateKualifikasi: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  >
                    <option value="">Pilih rate...</option>
                    <option value="Harian">Harian</option>
                    <option value="Bulanan">Bulanan</option>
                    <option value="Per Jam">Per Jam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                  <input
                    type="number"
                    min={0}
                    value={form.harga}
                    onChange={(e) => setForm((f) => ({ ...f, harga: Number(e.target.value) }))}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Masukkan harga dalam IDR"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea
                    value={form.keterangan}
                    onChange={(e) => setForm((f) => ({ ...f, keterangan: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm h-24"
                    placeholder="Masukkan keterangan tambahan (opsional)"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                <button onClick={() => { setShowFormModal(false); setEditingItem(null); }} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Batal</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Simpan</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Konfirmasi Hapus Kualifikasi"
          message="Apakah Anda yakin ingin menghapus data kualifikasi ini?"
          itemName={deleteTarget ? `${deleteTarget.kualifikasi} - ${deleteTarget.rateKualifikasi}` : undefined}
        />
      </div>
    </div>
  );
};

export default MasterKualifikasiDashboard;
