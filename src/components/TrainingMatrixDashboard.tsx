import React, { useMemo, useState } from 'react';
import { Search, PlusCircle, Download, Clock, AlertTriangle, Pencil, Trash2, X } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface TrainingRecord {
  nama: string;
  posisi: string;
  certificate: string;
  expiry: string; // ISO date string
}

const sampleData: TrainingRecord[] = [
  { nama: 'Andi Wijaya', posisi: 'Radiographer', certificate: 'BNSP RT Level 2', expiry: '2025-05-20' },
  { nama: 'Budi Santoso', posisi: 'Assistant Radiographer', certificate: 'BNSP RT Level 1', expiry: '2024-08-15' },
  { nama: 'Citra Lestari', posisi: 'QHSE Officer', certificate: 'SMK3 Auditor', expiry: '2026-01-10' },
  { nama: 'Dewi Puspita', posisi: 'Technician', certificate: 'First Aid', expiry: '2024-07-01' },
  { nama: 'Eko Prasetyo', posisi: 'Supervisor', certificate: 'H2S Awareness', expiry: '2025-12-31' },
];

// positions are derived from current data via posisiOptions (see below)

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const isExpired = (iso: string) => {
  const today = new Date();
  const exp = new Date(iso);
  // Compare without time part
  return exp.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
};

const TrainingMatrixDashboard: React.FC = () => {
  const [searchNama, setSearchNama] = useState('');
  const [filterPosisi, setFilterPosisi] = useState('');
  const [showEntries, setShowEntries] = useState<string>('10');

  // Data & UI state
  const [data, setData] = useState<TrainingRecord[]>(sampleData);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TrainingRecord | null>(null);
  const [form, setForm] = useState<TrainingRecord>({ nama: '', posisi: '', certificate: '', expiry: '' });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TrainingRecord | null>(null);

  const posisiOptions = useMemo(() => Array.from(new Set(data.map(d => d.posisi))).sort(), [data]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const byNama = row.nama.toLowerCase().includes(searchNama.toLowerCase());
      const byPosisi = filterPosisi ? row.posisi === filterPosisi : true;
      return byNama && byPosisi;
    });
  }, [searchNama, filterPosisi, data]);

  const displayedData = useMemo(() => {
    const limit = parseInt(showEntries, 10);
    return filteredData.slice(0, isNaN(limit) ? filteredData.length : limit);
  }, [filteredData, showEntries]);

  const handleSearch = () => {
    // Placeholder to mirror MCU behavior
    alert(`Cari: ${searchNama} | Posisi: ${filterPosisi || 'Semua'}`);
  };

  // Handlers: Add/Edit/Delete
  const openAdd = () => {
    setEditing(null);
    setForm({ nama: '', posisi: '', certificate: '', expiry: '' });
    setShowForm(true);
  };

  const openEdit = (row: TrainingRecord) => {
    setEditing(row);
    setForm(row);
    setShowForm(true);
  };

  const saveForm = () => {
    const payload: TrainingRecord = {
      nama: form.nama.trim(),
      posisi: form.posisi.trim(),
      certificate: form.certificate.trim(),
      expiry: form.expiry,
    };
    if (!payload.nama || !payload.posisi || !payload.certificate || !payload.expiry) {
      alert('Semua field wajib diisi');
      return;
    }
    // basic ISO date validation
    if (isNaN(new Date(payload.expiry).getTime())) {
      alert('Format tanggal Expiry tidak valid');
      return;
    }
    if (editing) {
      setData(prev => prev.map(r => (
        r.nama === editing.nama && r.posisi === editing.posisi && r.certificate === editing.certificate && r.expiry === editing.expiry
          ? payload
          : r
      )));
    } else {
      setData(prev => [payload, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const askDelete = (row: TrainingRecord) => {
    setDeleteTarget(row);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setData(prev => prev.filter(r => !(
      r.nama === deleteTarget.nama && r.posisi === deleteTarget.posisi && r.certificate === deleteTarget.certificate && r.expiry === deleteTarget.expiry
    )));
    setShowDelete(false);
    setDeleteTarget(null);
  };
  const handleExport = (type: string) => alert(`Export ${type}`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section (mirror MCU) */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                TRAINING MATRIX (Technical & QHSE)
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Monitoring Personnel</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Training Matrix</span>
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
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Nama Pegawai</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nama pegawai..."
                  value={searchNama}
                  onChange={(e) => setSearchNama(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Posisi / Competency</label>
              <div className="relative">
                <select
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={filterPosisi}
                  onChange={(e) => setFilterPosisi(e.target.value)}
                >
                  <option value="">Semua Posisi</option>
                  {posisiOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-180" />
              </div>
            </div>

            {/* Empty placeholders to keep grid identical to MCU on lg */}
            <div className="hidden lg:block" />
            <div className="hidden lg:block" />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Training
            </button>
            <button
              onClick={handleSearch}
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi / Competency</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedData.map((row, idx) => {
                  const expired = isExpired(row.expiry);
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.nama}
                        {expired && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Expired
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.posisi}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${expired ? 'text-red-700 bg-red-50' : 'text-gray-500'}`}>
                        <div className="flex flex-col">
                          <span className="font-medium">{row.certificate}</span>
                          <span className="text-xs">Expiry: {formatDate(row.expiry)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => openEdit(row)}
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => askDelete(row)}
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {displayedData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah/Edit */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Training' : 'Tambah Training'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                    <input
                      value={form.nama}
                      onChange={(e)=>setForm(prev=>({...prev, nama: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Nama pegawai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posisi / Competency</label>
                    <input
                      value={form.posisi}
                      onChange={(e)=>setForm(prev=>({...prev, posisi: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Contoh: Radiographer"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificate</label>
                    <input
                      value={form.certificate}
                      onChange={(e)=>setForm(prev=>({...prev, certificate: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Contoh: BNSP RT Level 2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <input
                      type="date"
                      value={form.expiry}
                      onChange={(e)=>setForm(prev=>({...prev, expiry: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
                <button onClick={()=>setShowForm(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">Batal</button>
                <button onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Simpan</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus */}
        <ConfirmDeleteModal
          isOpen={showDelete}
          title="Hapus Data Training?"
          message={deleteTarget ? `Apakah Anda yakin ingin menghapus data training ${deleteTarget.nama} (${deleteTarget.certificate})?` : ''}
          onClose={() => setShowDelete(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

export default TrainingMatrixDashboard;
