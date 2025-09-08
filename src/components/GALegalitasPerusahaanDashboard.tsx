import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, FileSpreadsheet, FileText, Clock, Edit, Trash2, Calendar } from 'lucide-react';
import LegalitasPerusahaanModal, { LegalitasForm } from './LegalitasPerusahaanModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface LegalitasItem extends LegalitasForm {
  id: string;
}

const seedData = (): LegalitasItem[] => [
  { id: '1', jenisDokumen: 'NIB', noDokumen: '812/NIB/2024', tanggalMulai: '2024-01-01', tanggalBerakhir: '2027-01-01', status: 'Aktif', lkpm: 'On Schedule', keterangan: 'Valid' },
  { id: '2', jenisDokumen: 'SIUP', noDokumen: 'SIUP-221/2023', tanggalMulai: '2023-06-01', tanggalBerakhir: '2026-06-01', status: 'Aktif', lkpm: 'On Schedule' },
  { id: '3', jenisDokumen: 'TDP', noDokumen: 'TDP-900/2022', tanggalMulai: '2022-03-15', tanggalBerakhir: '2025-03-15', status: 'Segera Perpanjang', lkpm: 'Late', keterangan: 'Perpanjang 1 bulan lagi' },
];

const statusPill = (status: LegalitasItem['status']) => {
  switch (status) {
    case 'Aktif':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Segera Perpanjang':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Kadaluarsa':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const lkpmPill = (lkpm: LegalitasItem['lkpm']) => {
  switch (lkpm) {
    case 'On Schedule':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Late':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'N/A':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const GALegalitasPerusahaanDashboard: React.FC = () => {
  // Filters
  const [searchJenis, setSearchJenis] = useState('');
  const [searchNo, setSearchNo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [lkpmFilter, setLkpmFilter] = useState('');

  // Data
  const [data, setData] = useState<LegalitasItem[]>(seedData());
  const [animateRows, setAnimateRows] = useState(false);

  // Modal Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LegalitasItem | null>(null);

  // Delete Confirm
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LegalitasItem | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState<string>('');

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const j = searchJenis.trim().toLowerCase();
    const n = searchNo.trim().toLowerCase();
    return data.filter((d) => {
      const matchesJenis = j ? d.jenisDokumen.toLowerCase().includes(j) : true;
      const matchesNo = n ? d.noDokumen.toLowerCase().includes(n) : true;
      const matchesStatus = statusFilter ? d.status === (statusFilter as LegalitasItem['status']) : true;
      const matchesLkpm = lkpmFilter ? d.lkpm === (lkpmFilter as LegalitasItem['lkpm']) : true;

      const start = dateFrom ? new Date(dateFrom) : null;
      const end = dateTo ? new Date(dateTo) : null;
      const docEnd = new Date(d.tanggalBerakhir);
      const matchesDate = (!start || docEnd >= start) && (!end || docEnd <= end);

      return matchesJenis && matchesNo && matchesStatus && matchesLkpm && matchesDate;
    });
  }, [data, searchJenis, searchNo, statusFilter, lkpmFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const currentData = filtered.slice(startIndex, endIndex);

  const handleSearch = () => setCurrentPage(1);

  const handleSave = (item: LegalitasForm) => {
    if (editingItem) {
      setData((prev) => prev.map((x) => (x.id === editingItem.id ? { ...x, ...item } : x)));
    } else {
      setData((prev) => [{ id: `${Date.now()}`, ...item }, ...prev]);
      setCurrentPage(1);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((x) => x.id !== id));
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handlePageChange = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
  };

  const handleGoToPage = () => {
    if (!goToPageInput) return;
    const n = parseInt(goToPageInput, 10);
    if (!isNaN(n)) handlePageChange(n);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">LEGALITAS PERUSAHAAN</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">GA</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">Legalitas Perusahaan</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            {/* Cari Jenis Dokumen */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari Jenis Dokumen</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchJenis}
                  onChange={(e) => setSearchJenis(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Contoh: NIB, SIUP"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cari No Dokumen */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari No. Dokumen</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNo}
                  onChange={(e) => setSearchNo(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Contoh: 812/NIB/2024"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Sampai */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Berlaku s.d</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Hingga */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Sampai</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs bg-white"
              >
                <option value="">Semua</option>
                <option value="Aktif">Aktif</option>
                <option value="Segera Perpanjang">Segera Perpanjang</option>
                <option value="Kadaluarsa">Kadaluarsa</option>
              </select>
            </div>

            {/* LKPM */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Status LKPM</label>
              <select
                value={lkpmFilter}
                onChange={(e) => setLkpmFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs bg-white"
              >
                <option value="">Semua</option>
                <option value="On Schedule">On Schedule</option>
                <option value="Late">Late</option>
                <option value="N/A">N/A</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-1 flex items-end">
              <button
                onClick={handleSearch}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center justify-center space-x-2 text-xs"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-2 text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Legalitas</span>
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
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Jenis Dokumen</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">No. Dokumen</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Berlaku Dari</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Berlaku s.d</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Status</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">LKPM</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Keterangan</th>
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ animationDelay: animateRows ? `${index * 100}ms` : '0ms', animationFillMode: 'forwards' }}
                  >
                    <td className="px-2 py-1"><span className="font-medium text-gray-900">{startIndex + index + 1}</span></td>
                    <td className="px-2 py-1 font-medium text-gray-900">{item.jenisDokumen}</td>
                    <td className="px-2 py-1 text-gray-700">{item.noDokumen}</td>
                    <td className="px-2 py-1 text-gray-700">{new Date(item.tanggalMulai).toLocaleDateString('id-ID')}</td>
                    <td className="px-2 py-1 text-gray-700">{new Date(item.tanggalBerakhir).toLocaleDateString('id-ID')}</td>
                    <td className="px-2 py-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusPill(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-2 py-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${lkpmPill(item.lkpm)}`}>
                        {item.lkpm}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-gray-700">{item.keterangan || '-'}</td>
                    <td className="px-2 py-1">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                          className="p-1 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { setDeleteTarget(item); setIsDeleteOpen(true); }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Delete"
                        >
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
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="px-2 py-1 border border-gray-200 rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${currentPage === page ? 'bg-blue-600 text-white shadow shadow-blue-600/20' : 'text-gray-700 hover:bg-white hover:text-blue-600'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 text-xs">
                <span className="text-gray-600">Go to page:</span>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, totalPages)}
                  value={goToPageInput}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleGoToPage(); } }}
                  className="w-16 px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleGoToPage} className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs">Go</button>
                <span className="text-gray-500">/ {Math.max(1, totalPages)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LegalitasPerusahaanModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSave={handleSave}
        initialData={editingItem ? {
          jenisDokumen: editingItem.jenisDokumen,
          noDokumen: editingItem.noDokumen,
          tanggalMulai: editingItem.tanggalMulai,
          tanggalBerakhir: editingItem.tanggalBerakhir,
          status: editingItem.status,
          lkpm: editingItem.lkpm,
          keterangan: editingItem.keterangan,
        } : null}
        title={editingItem ? 'Edit Legalitas' : 'Tambah Legalitas'}
        submitLabel={editingItem ? 'Update' : 'Simpan'}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        itemName={`${deleteTarget?.jenisDokumen ?? ''} ${deleteTarget?.noDokumen ?? ''}`.trim()}
      />
    </div>
  );
};

export default GALegalitasPerusahaanDashboard;
