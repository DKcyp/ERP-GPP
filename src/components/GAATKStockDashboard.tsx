import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, FileSpreadsheet, FileText, Clock, Edit, Trash2 } from 'lucide-react';
import ATKStockModal, { ATKStockForm } from './ATKStockModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface ATKItem extends ATKStockForm { id: string }

const seedData = (): ATKItem[] => [
  { id: '1', namaBarang: 'Kertas A4', kategori: 'Kertas', satuan: 'rim', stok: '120', minimalStok: '20', lokasi: 'Gudang A', status: 'Aman', lastUpdate: '2025-09-01', keterangan: 'Merk Sinar Dunia' },
  { id: '2', namaBarang: 'Ballpoint', kategori: 'Alat Tulis', satuan: 'box', stok: '8', minimalStok: '10', lokasi: 'Gudang A', status: 'Menipis', lastUpdate: '2025-09-05' },
  { id: '3', namaBarang: 'Toner Printer', kategori: 'Printer', satuan: 'pcs', stok: '0', minimalStok: '2', lokasi: 'Kantor Pusat', status: 'Habis', lastUpdate: '2025-09-07', keterangan: 'HP 78A' },
];

const statusPill = (status: ATKItem['status']) => {
  switch (status) {
    case 'Aman': return 'bg-green-100 text-green-800 border-green-200';
    case 'Menipis': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Habis': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const GAATKStockDashboard: React.FC = () => {
  // Filters
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const [status, setStatus] = useState('');
  const [lokasi, setLokasi] = useState('');

  // Data
  const [data, setData] = useState<ATKItem[]>(seedData());
  const [animateRows, setAnimateRows] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ATKItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ATKItem | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState('');

  useEffect(() => { const t = setTimeout(() => setAnimateRows(true), 100); return () => clearTimeout(t); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const l = lokasi.trim().toLowerCase();
    return data.filter(d => {
      const matchText = q ? `${d.namaBarang} ${d.keterangan ?? ''}`.toLowerCase().includes(q) : true;
      const matchKat = kategori ? d.kategori === (kategori as ATKItem['kategori']) : true;
      const matchStat = status ? d.status === (status as ATKItem['status']) : true;
      const matchLok = l ? d.lokasi.toLowerCase().includes(l) : true;
      return matchText && matchKat && matchStat && matchLok;
    });
  }, [data, search, kategori, status, lokasi]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const currentData = filtered.slice(startIndex, endIndex);

  const handleSearch = () => setCurrentPage(1);

  const handleSave = (form: ATKStockForm) => {
    // Auto status based on stok vs minimalStok
    const stokNum = Number((form.stok || '0').replace(/[^0-9.-]/g, ''));
    const minNum = Number((form.minimalStok || '0').replace(/[^0-9.-]/g, ''));
    let statusAuto: ATKItem['status'] = form.status;
    if (!isNaN(stokNum) && !isNaN(minNum)) {
      statusAuto = stokNum <= 0 ? 'Habis' : stokNum <= minNum ? 'Menipis' : 'Aman';
    }

    if (editingItem) {
      setData(prev => prev.map(x => (x.id === editingItem.id ? { ...x, ...form, status: statusAuto } : x)));
    } else {
      setData(prev => [{ id: `${Date.now()}`, ...form, status: statusAuto }, ...prev]);
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
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MONITORING STOK ATK</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">GA</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">Monitoring Stok ATK</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
            {/* Cari barang */}
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-xs font-medium text-gray-700">Cari Barang / Keterangan</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Contoh: Kertas / Toner / Merk"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Kategori</label>
              <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs bg-white">
                <option value="">Semua</option>
                <option value="Kertas">Kertas</option>
                <option value="Alat Tulis">Alat Tulis</option>
                <option value="Printer">Printer</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs bg-white">
                <option value="">Semua</option>
                <option value="Aman">Aman</option>
                <option value="Menipis">Menipis</option>
                <option value="Habis">Habis</option>
              </select>
            </div>

            {/* Lokasi */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Lokasi</label>
              <input type="text" value={lokasi} onChange={(e) => setLokasi(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" placeholder="Gudang / Kantor" />
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
              <span>Tambah Stok</span>
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
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Nama Barang</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Kategori</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Satuan</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Stok</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Minimal Stok</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Lokasi</th>
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-900">Status</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Terakhir Update</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Keterangan</th>
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`} style={{ animationDelay: animateRows ? `${index * 100}ms` : '0ms', animationFillMode: 'forwards' }}>
                    <td className="px-2 py-1"><span className="font-medium text-gray-900">{startIndex + index + 1}</span></td>
                    <td className="px-2 py-1 font-medium text-gray-900">{item.namaBarang}</td>
                    <td className="px-2 py-1 text-gray-700">{item.kategori}</td>
                    <td className="px-2 py-1 text-gray-700">{item.satuan}</td>
                    <td className="px-2 py-1 text-gray-700">{item.stok}</td>
                    <td className="px-2 py-1 text-gray-700">{item.minimalStok}</td>
                    <td className="px-2 py-1 text-gray-700">{item.lokasi}</td>
                    <td className="px-2 py-1 text-center"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusPill(item.status)}`}>{item.status}</span></td>
                    <td className="px-2 py-1 text-gray-700">{new Date(item.lastUpdate).toLocaleDateString('id-ID')}</td>
                    <td className="px-2 py-1 text-gray-700">{item.keterangan || '-'}</td>
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

      <ATKStockModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSave={handleSave}
        initialData={editingItem ? {
          namaBarang: editingItem.namaBarang,
          kategori: editingItem.kategori,
          satuan: editingItem.satuan,
          stok: editingItem.stok,
          minimalStok: editingItem.minimalStok,
          lokasi: editingItem.lokasi,
          status: editingItem.status,
          lastUpdate: editingItem.lastUpdate,
          keterangan: editingItem.keterangan,
        } : null}
        title={editingItem ? 'Edit Stok ATK' : 'Tambah Stok ATK'}
        submitLabel={editingItem ? 'Update' : 'Simpan'}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        itemName={`${deleteTarget?.namaBarang ?? ''} - ${deleteTarget?.lokasi ?? ''}`}
      />
    </div>
  );
};

export default GAATKStockDashboard;
