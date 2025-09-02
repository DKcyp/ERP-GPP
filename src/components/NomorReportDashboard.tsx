import React, { useMemo, useState } from 'react';
import { Search, PlusCircle, Download, Clock, FileText, Pencil, Trash2, X } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface ReportRecord {
  jenis: string; // Jenis Report
  nomor: string; // Nomor Report
  tanggal: string; // ISO date
  document?: string; // url or filename
}

const JENIS_OPTIONS = [
  'UT', 'MT', 'PT', 'RT', 'PMI', 'Visual Test', 'Leak Test', 'PAUT', 'Hardness', 'Holiday Test', 'Drop Cell', 'Wire Rope',
  'Lifting Gear', 'Boroscope', 'Jumping Rope', 'Pressure Vessel', 'Tension Meter', 'Load Test', 'Vacum Test', 'Dust Test',
  'Salt Test', 'Painting', 'IRIS ECT', 'Humidity', 'Soil Test',
];

const sampleData: ReportRecord[] = [
  { jenis: 'UT', nomor: 'UT-001/IX/2025', tanggal: '2025-09-01', document: 'ut-001.pdf' },
  { jenis: 'MT', nomor: 'MT-045/VIII/2025', tanggal: '2025-08-28', document: 'mt-045.pdf' },
  { jenis: 'Visual Test', nomor: 'VT-210/VIII/2025', tanggal: '2025-08-15' },
  { jenis: 'RT', nomor: 'RT-012/VII/2025', tanggal: '2025-07-20', document: 'rt-012.pdf' },
  { jenis: 'Hardness', nomor: 'HD-030/VI/2025', tanggal: '2025-06-11' },
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const NomorReportDashboard: React.FC = () => {
  const [searchNomor, setSearchNomor] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [showEntries, setShowEntries] = useState<string>('10');

  // Data & UI state
  const [data, setData] = useState<ReportRecord[]>(sampleData);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ReportRecord | null>(null);
  const [form, setForm] = useState<ReportRecord>({ jenis: '', nomor: '', tanggal: '', document: '' });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ReportRecord | null>(null);

  const filtered = useMemo(() => {
    return data.filter((row) => {
      const byNomor = row.nomor.toLowerCase().includes(searchNomor.toLowerCase());
      const byJenis = filterJenis ? row.jenis === filterJenis : true;
      return byNomor && byJenis;
    });
  }, [searchNomor, filterJenis, data]);

  const displayed = useMemo(() => {
    const limit = parseInt(showEntries, 10);
    return filtered.slice(0, isNaN(limit) ? filtered.length : limit);
  }, [filtered, showEntries]);

  const handleSearch = () => alert(`Cari: ${searchNomor || '-'} | Jenis: ${filterJenis || 'Semua'}`);
  // Add/Edit/Delete handlers
  const openAdd = () => {
    setEditing(null);
    setForm({ jenis: '', nomor: '', tanggal: '', document: '' });
    setShowForm(true);
  };

  const openEdit = (row: ReportRecord) => {
    setEditing(row);
    setForm(row);
    setShowForm(true);
  };

  const saveForm = () => {
    const payload: ReportRecord = {
      jenis: form.jenis.trim(),
      nomor: form.nomor.trim(),
      tanggal: form.tanggal,
      document: form.document?.trim() || undefined,
    };
    if (!payload.jenis || !payload.nomor || !payload.tanggal) {
      alert('Jenis, Nomor, dan Tanggal wajib diisi');
      return;
    }
    if (isNaN(new Date(payload.tanggal).getTime())) {
      alert('Format tanggal tidak valid');
      return;
    }
    if (editing) {
      setData(prev => prev.map(r => (
        r.jenis === editing.jenis && r.nomor === editing.nomor && r.tanggal === editing.tanggal && r.document === editing.document
          ? payload
          : r
      )));
    } else {
      setData(prev => [payload, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const askDelete = (row: ReportRecord) => {
    setDeleteTarget(row);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setData(prev => prev.filter(r => !(r.jenis === deleteTarget.jenis && r.nomor === deleteTarget.nomor && r.tanggal === deleteTarget.tanggal && r.document === deleteTarget.document)));
    setShowDelete(false);
    setDeleteTarget(null);
  };
  const handleExport = (type: string) => alert(`Export ${type}`);
  const handleOpenDoc = (doc?: string) => alert(doc ? `Buka dokumen: ${doc}` : 'Dokumen belum tersedia');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">NOMOR REPORT</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Monitoring Personnel</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Nomor Report</span>
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
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Nomor Report</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nomor report..."
                  value={searchNomor}
                  onChange={(e) => setSearchNomor(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Report</label>
              <div className="relative">
                <select
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                >
                  <option value="">Semua Jenis</option>
                  {JENIS_OPTIONS.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* keep grid balance */}
            <div className="hidden lg:block" />
            <div className="hidden lg:block" />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Report
            </button>
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Controls */}
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

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Report</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Report</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayed.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.jenis}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.nomor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(row.tanggal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleOpenDoc(row.document)}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        <FileText className="h-4 w-4 mr-2" /> {row.document ? 'Lihat Dokumen' : 'Belum Ada'}
                      </button>
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
                ))}
                {displayed.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Tidak ada data</td>
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
                <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Nomor Report' : 'Tambah Nomor Report'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Report</label>
                    <select
                      value={form.jenis}
                      onChange={(e)=>setForm(prev=>({...prev, jenis: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Pilih jenis...</option>
                      {JENIS_OPTIONS.map(j => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Report</label>
                    <input
                      value={form.nomor}
                      onChange={(e)=>setForm(prev=>({...prev, nomor: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Contoh: UT-001/IX/2025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={form.tanggal}
                      onChange={(e)=>setForm(prev=>({...prev, tanggal: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document (opsional)</label>
                    <input
                      value={form.document || ''}
                      onChange={(e)=>setForm(prev=>({...prev, document: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Nama file atau URL"
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
          title="Hapus Nomor Report?"
          message={deleteTarget ? `Apakah Anda yakin ingin menghapus nomor report ${deleteTarget.nomor} (${deleteTarget.jenis})?` : ''}
          onClose={() => setShowDelete(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

export default NomorReportDashboard;
