import React, { useMemo, useState } from 'react';
import { PlusCircle, Download, Pencil, Trash2, Search, Clock } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import GeneralMasterKPIFormModal from './GeneralMasterKPIFormModal';

interface KPIRecord {
  id: string;
  jenisKPI: 'KPI Tahunan' | 'KPI Bulanan' | '';
  totalBobot: number; // 0-100
  jumlahKRA: number;
  tanggal: string; // ISO date string
}

const GeneralMasterKPIDashboard: React.FC = () => {
  // Dummy data list
  const initialData: KPIRecord[] = [
    { id: 'KPI001', jenisKPI: 'KPI Tahunan', totalBobot: 100, jumlahKRA: 6, tanggal: '2025-01-20' },
    { id: 'KPI002', jenisKPI: 'KPI Bulanan', totalBobot: 90, jumlahKRA: 4, tanggal: '2025-03-02' },
    { id: 'KPI003', jenisKPI: 'KPI Tahunan', totalBobot: 110, jumlahKRA: 7, tanggal: '2025-02-12' },
  ];

  const [data, setData] = useState<KPIRecord[]>(initialData);

  // Filters
  const [searchNama, setSearchNama] = useState(''); // repurposed to search by ID
  const [jenisFilter, setJenisFilter] = useState('');
  const [showEntries, setShowEntries] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<KPIRecord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<KPIRecord | null>(null);

  const filtered = useMemo(() => {
    return data.filter((d) =>
      (!searchNama || d.id.toLowerCase().includes(searchNama.toLowerCase())) &&
      (!jenisFilter || d.jenisKPI === jenisFilter)
    );
  }, [data, searchNama, jenisFilter]);

  const pageSize = parseInt(showEntries, 10);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openAddModal = () => {
    setEditingItem(null);
    setShowFormModal(true);
  };

  const openEditModal = (item: KPIRecord) => {
    setEditingItem(item);
    setShowFormModal(true);
  };

  const handleSave = (payload: any) => {
    const sumBobot = payload?.kraItems?.reduce((sum: number, row: any) => sum + (parseFloat(row?.bobot || '0') || 0), 0) || 0;
    const kraCount = payload?.kraItems?.length || 0;

    if (editingItem) {
      setData((prev) =>
        prev.map((it) =>
          it.id === editingItem.id
            ? {
                ...it,
                jenisKPI: payload.jenisKPI || it.jenisKPI,
                totalBobot: sumBobot || it.totalBobot,
                jumlahKRA: kraCount || it.jumlahKRA,
              }
            : it
        )
      );
    } else {
      const newId = `KPI${Math.floor(1000 + Math.random() * 9000)}`;
      const newItem: KPIRecord = {
        id: newId,
        jenisKPI: payload.jenisKPI || 'KPI Tahunan',
        totalBobot: sumBobot,
        jumlahKRA: kraCount,
        tanggal: new Date().toISOString().slice(0, 10),
      };
      setData((prev) => [newItem, ...prev]);
    }
    setShowFormModal(false);
    setEditingItem(null);
  };

  const askDelete = (item: KPIRecord) => {
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
    alert(`Exporting Master KPI as ${type}`);
  };

  const rowClass = (rec: KPIRecord) => {
    if (rec.totalBobot > 100) return 'bg-red-50 hover:bg-red-100 transition-colors';
    if (rec.totalBobot < 100) return 'bg-yellow-50 hover:bg-yellow-100 transition-colors';
    return 'hover:bg-gray-50 transition-colors';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MASTER KPI - GENERAL</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">General</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master KPI</span>
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
        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari ID Master</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan ID master..."
                  value={searchNama}
                  onChange={(e) => setSearchNama(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis KPI</label>
              <select
                className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={jenisFilter}
                onChange={(e) => setJenisFilter(e.target.value)}
              >
                <option value="">Semua</option>
                <option value="KPI Tahunan">KPI Tahunan</option>
                <option value="KPI Bulanan">KPI Bulanan</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Master KPI
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={showEntries}
              onChange={(e) => { setShowEntries(e.target.value); setCurrentPage(1); }}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis KPI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah KRA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bobot (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paged.map((rec) => (
                  <tr key={rec.id} className={rowClass(rec)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rec.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.jenisKPI}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.jumlahKRA}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.totalBobot}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(rec.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(rec)} className="inline-flex items-center px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 text-xs">
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button onClick={() => askDelete(rec)} className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 text-xs">
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

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
          </span>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              className="px-3 py-1.5 border border-gray-300 rounded-l-md bg-white hover:bg-gray-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="px-3 py-1.5 border-t border-b border-gray-300 bg-white">{currentPage}/{totalPages}</span>
            <button
              className="px-3 py-1.5 border border-gray-300 rounded-r-md bg-white hover:bg-gray-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showFormModal && (
          <GeneralMasterKPIFormModal
            isOpen={showFormModal}
            onClose={() => { setShowFormModal(false); setEditingItem(null); }}
            onSave={handleSave}
            initialData={editingItem ? {
              jenisKPI: editingItem.jenisKPI,
              kraItems: [],
            } : null}
          />
        )}

        {/* Delete Confirm Modal */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Konfirmasi Hapus Master KPI"
          message="Apakah Anda yakin ingin menghapus Master KPI ini?"
          itemName={deleteTarget ? `${deleteTarget.id} - ${deleteTarget.jenisKPI}` : undefined}
        />
      </div>
    </div>
  );
};

export default GeneralMasterKPIDashboard;
