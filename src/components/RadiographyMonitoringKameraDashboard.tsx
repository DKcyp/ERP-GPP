import React, { useMemo, useState } from 'react';
import { Clock, Download, Edit2, MapPin, PlusCircle, Search, Trash2, AlertTriangle } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

type Kamera = {
  id: string;
  serialNumber: string;
  isotopPerWeek: string; // Monthly summary text
  lokasi: string;
  posisiKameraCi: number; // for reminder check (> 30 Ci)
};

const initialData: Kamera[] = [
  { id: 'KAM-001', serialNumber: 'CAM-AX1001', isotopPerWeek: 'Ir-192 / 5 mCi per week', lokasi: 'Workshop A', posisiKameraCi: 28 },
  { id: 'KAM-002', serialNumber: 'CAM-AX1002', isotopPerWeek: 'Ir-192 / 7 mCi per week', lokasi: 'Field Site 1', posisiKameraCi: 33 },
  { id: 'KAM-003', serialNumber: 'CAM-BX2001', isotopPerWeek: 'Co-60 / 4 mCi per week', lokasi: 'Workshop B', posisiKameraCi: 18 },
];

const RadiographyMonitoringKameraDashboard: React.FC = () => {
  const [data, setData] = useState<Kamera[]>(initialData);
  const [searchSN, setSearchSN] = useState('');
  const [lokasiFilter, setLokasiFilter] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  // modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Kamera | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Kamera | null>(null);

  const lokasiOptions = useMemo(() => {
    const s = new Set<string>();
    data.forEach((d) => s.add(d.lokasi));
    return Array.from(s);
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((d) => {
      const matchSN = d.serialNumber.toLowerCase().includes(searchSN.toLowerCase());
      const matchLok = !lokasiFilter || d.lokasi === lokasiFilter;
      return matchSN && matchLok;
    });
  }, [data, searchSN, lokasiFilter]);

  const handleExport = (type: string) => {
    alert(`Export ${type} (dummy)`);
  };

  const openAdd = () => {
    setEditing({ id: '', serialNumber: '', isotopPerWeek: '', lokasi: '', posisiKameraCi: 0 });
    setIsFormOpen(true);
  };
  const openEdit = (row: Kamera) => {
    setEditing({ ...row });
    setIsFormOpen(true);
  };
  const saveForm = () => {
    if (!editing) return;
    if (editing.id) {
      setData((prev) => prev.map((p) => (p.id === editing.id ? editing : p)));
    } else {
      const newRow = { ...editing, id: `KAM-${String(Math.floor(Math.random() * 900) + 100)}` };
      setData((prev) => [newRow, ...prev]);
    }
    setIsFormOpen(false);
    setEditing(null);
  };
  const cancelForm = () => {
    setIsFormOpen(false);
    setEditing(null);
  };

  const askDelete = (row: Kamera) => {
    setDeleting(row);
    setIsDeleteOpen(true);
  };
  const confirmDelete = () => {
    if (deleting) setData((prev) => prev.filter((p) => p.id !== deleting.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MONITORING KAMERA RADIOGRAPHY</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Radiography</span>
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
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Serial Number Kamera</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan serial number..."
                  value={searchSN}
                  onChange={(e) => setSearchSN(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Lokasi</label>
              <div className="relative">
                <select
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={lokasiFilter}
                  onChange={(e) => setLokasiFilter(e.target.value)}
                >
                  <option value="">Semua lokasi</option>
                  {lokasiOptions.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="lg:col-span-2 flex items-end justify-end space-x-3">
              <button
                onClick={openAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Tambah Kamera
              </button>
              <button
                onClick={() => { /* Search executed by controlled inputs */ }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Search className="h-5 w-5 mr-2" /> Cari Data
              </button>
            </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number Kamera</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Isotop per Week (Monthly)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi Pemanfaatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi Kamera (Ci)</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row) => {
                  const danger = row.posisiKameraCi > 30;
                  return (
                    <tr key={row.id} className={danger ? 'bg-red-50 hover:bg-red-100 transition-colors' : 'hover:bg-gray-50 transition-colors'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.serialNumber}
                        {danger && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> &gt; 30 Ci
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.isotopPerWeek}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.lokasi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.posisiKameraCi.toFixed(0)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEdit(row)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-xs"
                          >
                            <Edit2 className="h-4 w-4 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => askDelete(row)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 text-xs"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isFormOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">{editing.id ? 'Edit Kamera' : 'Tambah Kamera'}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number Kamera</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={editing.serialNumber}
                  onChange={(e) => setEditing((p) => (p ? { ...p, serialNumber: e.target.value } : p))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Isotop per Week (Monthly)</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={editing.isotopPerWeek}
                  onChange={(e) => setEditing((p) => (p ? { ...p, isotopPerWeek: e.target.value } : p))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Pemanfaatan</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={editing.lokasi}
                  onChange={(e) => setEditing((p) => (p ? { ...p, lokasi: e.target.value } : p))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Kamera (Ci)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={editing.posisiKameraCi}
                  onChange={(e) => setEditing((p) => (p ? { ...p, posisiKameraCi: Number(e.target.value) } : p))}
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-100 bg-gray-50">
              <button onClick={cancelForm} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm inline-flex items-center">
                <PlusCircle className="h-4 w-4 mr-2" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={deleting?.serialNumber}
        title="Konfirmasi Hapus Kamera"
        message="Apakah Anda yakin ingin menghapus data kamera ini?"
      />
    </div>
  );
};

export default RadiographyMonitoringKameraDashboard;
