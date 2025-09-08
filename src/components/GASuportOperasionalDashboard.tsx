import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, FileSpreadsheet, FileText, Clock, Edit, Trash2, Calendar, Building, User } from 'lucide-react';
import SuportOperasionalModal, { SuportOperasionalForm } from './SuportOperasionalModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface SuportItem extends SuportOperasionalForm { id: string }

const seedData = (): SuportItem[] => [
  { id: '1', tanggal: '2025-09-05', departemen: 'HRD', kebutuhan: 'Pengadaan', deskripsi: 'Kursi kerja tambahan', pic: 'Sari', prioritas: 'Medium', status: 'Open', targetSelesai: '2025-09-15', hasil: '' },
  { id: '2', tanggal: '2025-09-03', departemen: 'Finance', kebutuhan: 'Perbaikan', deskripsi: 'Perbaiki AC lantai 3', pic: 'Budi', prioritas: 'High', status: 'In Progress', targetSelesai: '2025-09-10', hasil: '' },
  { id: '3', tanggal: '2025-08-28', departemen: 'Operasional', kebutuhan: 'Fasilitas', deskripsi: 'Penataan ruang rapat', pic: 'Rudi', prioritas: 'Low', status: 'Done', targetSelesai: '2025-09-01', hasil: 'Selesai ditata' },
];

const statusPill = (s: SuportItem['status']) => {
  switch (s) {
    case 'Done': return 'bg-green-100 text-green-800 border-green-200';
    case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'Open':
    default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
};

const priorityPill = (p: SuportItem['prioritas']) => {
  switch (p) {
    case 'High': return 'bg-red-100 text-red-800 border-red-200';
    case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Low':
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const GASuportOperasionalDashboard: React.FC = () => {
  // Filters
  const [search, setSearch] = useState('');
  const [departemen, setDepartemen] = useState('');
  const [status, setStatus] = useState('');
  const [prioritas, setPrioritas] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Data
  const [data, setData] = useState<SuportItem[]>(seedData());
  const [animateRows, setAnimateRows] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SuportItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SuportItem | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState('');

  useEffect(() => { const t = setTimeout(() => setAnimateRows(true), 100); return () => clearTimeout(t); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const dep = departemen.trim().toLowerCase();
    return data.filter(d => {
      const matchText = q ? `${d.kebutuhan} ${d.deskripsi} ${d.pic}`.toLowerCase().includes(q) : true;
      const matchDep = dep ? d.departemen.toLowerCase().includes(dep) : true;
      const matchStat = status ? d.status === (status as SuportItem['status']) : true;
      const matchPri = prioritas ? d.prioritas === (prioritas as SuportItem['prioritas']) : true;
      const dt = new Date(d.tanggal);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      const matchDate = (!from || dt >= from) && (!to || dt <= to);
      return matchText && matchDep && matchStat && matchPri && matchDate;
    });
  }, [data, search, departemen, status, prioritas, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const currentData = filtered.slice(startIndex, endIndex);

  const handleSearch = () => setCurrentPage(1);

  const handleSave = (form: SuportOperasionalForm) => {
    if (editingItem) {
      setData(prev => prev.map(x => (x.id === editingItem.id ? { ...x, ...form } : x)));
    } else {
      setData(prev => [{ id: `${Date.now()}`, ...form }, ...prev]);
      setCurrentPage(1);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(x => x.id !== id));
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handlePageChange = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const handleGoToPage = () => { if (!goToPageInput) return; const n = parseInt(goToPageInput, 10); if (!isNaN(n)) handlePageChange(n); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">SUPORT OPERASIONAL</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">GA</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">Suport Operasional</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-6">
            {/* Cari */}
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-xs font-medium text-gray-700">Cari (Kebutuhan/Deskripsi/PIC)</label>
              <div className="relative">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" placeholder="Contoh: Pengadaan / Perbaikan / Nama PIC" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Departemen */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Departemen</label>
              <div className="relative">
                <input type="text" value={departemen} onChange={(e) => setDepartemen(e.target.value)} className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" placeholder="Contoh: HRD / Finance" />
                <Building className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs bg-white">
                <option value="">Semua</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Prioritas */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Prioritas</label>
              <select value={prioritas} onChange={(e) => setPrioritas(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs bg-white">
                <option value="">Semua</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Range tanggal */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Tanggal Dari</label>
              <div className="relative">
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Sampai</label>
              <div className="relative">
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-1 flex items-end">
              <button onClick={handleSearch} className="w-full px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center justify-center space-x-2 text-xs">
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-2 text-xs">
              <Plus className="h-4 w-4" />
              <span>Tambah Suport</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-xs">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-2 text-xs">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">No</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Tanggal</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Departemen</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Kebutuhan</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Deskripsi</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">PIC</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Prioritas</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Status</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Target Selesai</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Hasil</th>
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`} style={{ animationDelay: animateRows ? `${index * 100}ms` : '0ms', animationFillMode: 'forwards' }}>
                    <td className="px-2 py-1"><span className="font-medium text-gray-900">{startIndex + index + 1}</span></td>
                    <td className="px-2 py-1 text-gray-700">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-2 py-1 text-gray-700">{item.departemen}</td>
                    <td className="px-2 py-1 font-medium text-gray-900">{item.kebutuhan}</td>
                    <td className="px-2 py-1 text-gray-700 truncate max-w-[260px]" title={item.deskripsi}>{item.deskripsi}</td>
                    <td className="px-2 py-1 text-gray-700">{item.pic}</td>
                    <td className="px-2 py-1"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityPill(item.prioritas)}`}>{item.prioritas}</span></td>
                    <td className="px-2 py-1"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusPill(item.status)}`}>{item.status}</span></td>
                    <td className="px-2 py-1 text-gray-700">{item.targetSelesai ? new Date(item.targetSelesai).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-2 py-1 text-gray-700">{item.hasil || '-'}</td>
                    <td className="px-2 py-1">
                      <div className="flex items-center justify-center space-x-1">
                        <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 hover:scale-110" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setDeleteTarget(item); setIsDeleteOpen(true); }} className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center flex-wrap gap-2 text-xs text-gray-700">
                <span>
                  Showing {filtered.length === 0 ? 0 : startIndex + 1} to {endIndex} of {filtered.length} entries
                </span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <label className="flex items-center gap-2">
                  <span className="text-gray-600">Rows per page:</span>
                  <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border border-gray-200 rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => handlePageChange(page)} className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${currentPage === page ? 'bg-blue-600 text-white shadow shadow-blue-600/20' : 'text-gray-700 hover:bg-white hover:text-blue-600'}`}>
                    {page}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 text-xs">
                <span className="text-gray-600">Go to page:</span>
                <input type="number" min={1} max={Math.max(1, totalPages)} value={goToPageInput} onChange={(e) => setGoToPageInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleGoToPage(); } }} className="w-16 px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={handleGoToPage} className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs">Go</button>
                <span className="text-gray-500">/ {Math.max(1, totalPages)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuportOperasionalModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSave={handleSave}
        initialData={editingItem ? {
          tanggal: editingItem.tanggal,
          departemen: editingItem.departemen,
          kebutuhan: editingItem.kebutuhan,
          deskripsi: editingItem.deskripsi,
          pic: editingItem.pic,
          prioritas: editingItem.prioritas,
          status: editingItem.status,
          targetSelesai: editingItem.targetSelesai,
          hasil: editingItem.hasil,
        } : null}
        title={editingItem ? 'Edit Suport Operasional' : 'Tambah Suport Operasional'}
        submitLabel={editingItem ? 'Update' : 'Simpan'}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        itemName={`${deleteTarget?.departemen ?? ''} - ${deleteTarget?.kebutuhan ?? ''}`}
      />
    </div>
  );
};

export default GASuportOperasionalDashboard;
