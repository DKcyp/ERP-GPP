import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, FileSpreadsheet, FileText, Clock, Edit, Trash2, Calendar, UploadCloud, Paperclip } from 'lucide-react';
import MaintenanceDeviceModal, { MaintenanceDeviceForm } from './MaintenanceDeviceModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface Attachment { id: string; name: string; url: string; addedAt: string }

interface DeviceMaintItem extends MaintenanceDeviceForm { id: string; attachments?: Attachment[] }

const seedData = (): DeviceMaintItem[] => [
  { id: '1', deviceName: 'LAP-OPS-01', assetTag: 'ASSET-000123', userName: 'Rudi', department: 'Operasional', kategori: 'Laptop', jenisPekerjaan: 'Maintenance berkala', tanggal: '2025-09-05', vendor: 'PT Tekno Jaya', status: 'Done', biaya: '350.000', hasil: 'Pembersihan fan, update driver', attachments: [] },
  { id: '2', deviceName: 'PRN-2F', assetTag: 'ASSET-000210', userName: 'Sari', department: 'HRD', kategori: 'Printer', jenisPekerjaan: 'Perbaikan', tanggal: '2025-09-10', vendor: 'CV Print Master', status: 'In Progress', biaya: '650.000', hasil: '', attachments: [] },
  { id: '3', deviceName: 'SW-01', assetTag: 'ASSET-000301', userName: 'N/A', department: 'IT', kategori: 'Network', jenisPekerjaan: 'Upgrade firmware', tanggal: '2025-09-20', vendor: 'Internal', status: 'Scheduled', biaya: '0', hasil: '', attachments: [] },
];

const statusPill = (status: DeviceMaintItem['status']) => {
  switch (status) {
    case 'Done': return 'bg-green-100 text-green-800 border-green-200';
    case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
    case 'Scheduled':
    default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
};

const GAITMaintenanceDeviceDashboard: React.FC = () => {
  // Filters
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Data
  const [data, setData] = useState<DeviceMaintItem[]>(seedData());
  const [animateRows, setAnimateRows] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DeviceMaintItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeviceMaintItem | null>(null);

  // Approval Confirm Dialog
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState<DeviceMaintItem | null>(null);
  const [approveNextStatus, setApproveNextStatus] = useState<MaintenanceDeviceForm['status']>('Scheduled');
  const [approveFiles, setApproveFiles] = useState<FileList | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState('');

  useEffect(() => { const t = setTimeout(() => setAnimateRows(true), 100); return () => clearTimeout(t); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const dep = department.trim().toLowerCase();
    return data.filter(d => {
      const matchText = q ? `${d.deviceName} ${d.assetTag} ${d.userName} ${d.jenisPekerjaan} ${d.vendor} ${d.hasil ?? ''}`.toLowerCase().includes(q) : true;
      const matchKat = kategori ? d.kategori === (kategori as DeviceMaintItem['kategori']) : true;
      const matchStat = status ? d.status === (status as DeviceMaintItem['status']) : true;
      const matchDep = dep ? d.department.toLowerCase().includes(dep) : true;

      const dt = new Date(d.tanggal);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      const matchDate = (!from || dt >= from) && (!to || dt <= to);

      return matchText && matchKat && matchStat && matchDep && matchDate;
    });
  }, [data, search, kategori, status, department, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const currentData = filtered.slice(startIndex, endIndex);

  const handleSearch = () => setCurrentPage(1);

  const handleSave = (form: MaintenanceDeviceForm) => {
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

  const handleStatusChange = (id: string, next: MaintenanceDeviceForm['status']) => {
    setData(prev => prev.map(x => (x.id === id ? { ...x, status: next } : x)));
  };

  const handleUploadAttachment = (id: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const toAdd: Attachment[] = Array.from(files).map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      url: URL.createObjectURL(f),
      addedAt: new Date().toISOString(),
    }));
    setData(prev => prev.map(x => (x.id === id ? { ...x, attachments: [ ...(x.attachments ?? []), ...toAdd ] } : x)));
  };

  const handlePageChange = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const handleGoToPage = () => { if (!goToPageInput) return; const n = parseInt(goToPageInput, 10); if (!isNaN(n)) handlePageChange(n); };

  const openApproveDialog = (item: DeviceMaintItem, next: MaintenanceDeviceForm['status']) => {
    setApproveTarget(item);
    setApproveNextStatus(next);
    setApproveFiles(null);
    setIsApproveOpen(true);
  };

  const confirmApprove = () => {
    if (!approveTarget) return;
    handleStatusChange(approveTarget.id, approveNextStatus);
    if (approveFiles && approveFiles.length > 0) {
      handleUploadAttachment(approveTarget.id, approveFiles);
    }
    setIsApproveOpen(false);
    setApproveTarget(null);
  };

  const cancelApprove = () => {
    setIsApproveOpen(false);
    setApproveTarget(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MAINTENANCE PERANGKAT DEVICE</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">GA</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">Maintenance Perangkat Device</span>
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
              <label className="block text-xs font-medium text-gray-700">Cari (Device/Asset/User/Vendor/Pekerjaan)</label>
              <div className="relative">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" placeholder="Contoh: LAP-OPS-01 / ASSET-000123 / Rudi" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Kategori</label>
              <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs bg-white">
                <option value="">Semua</option>
                <option value="Laptop">Laptop</option>
                <option value="PC">PC</option>
                <option value="Printer">Printer</option>
                <option value="Network">Network</option>
                <option value="Server">Server</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs bg-white">
                <option value="">Semua</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            {/* Departemen */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Departemen</label>
              <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" placeholder="Contoh: Finance / HRD" />
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
              <span>Tambah Maintenance</span>
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
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Perangkat</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Asset Tag</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">User</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Departemen</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Kategori</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Jenis Pekerjaan</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Tanggal</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Vendor</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Status</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Biaya (Rp)</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Hasil</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Approval</th>
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`} style={{ animationDelay: animateRows ? `${index * 100}ms` : '0ms', animationFillMode: 'forwards' }}>
                    <td className="px-2 py-1"><span className="font-medium text-gray-900">{startIndex + index + 1}</span></td>
                    <td className="px-2 py-1 font-medium text-gray-900">{item.deviceName}</td>
                    <td className="px-2 py-1 text-gray-700">{item.assetTag || '-'}</td>
                    <td className="px-2 py-1 text-gray-700">{item.userName || '-'}</td>
                    <td className="px-2 py-1 text-gray-700">{item.department}</td>
                    <td className="px-2 py-1 text-gray-700">{item.kategori}</td>
                    <td className="px-2 py-1 text-gray-700">{item.jenisPekerjaan}</td>
                    <td className="px-2 py-1 text-gray-700">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-2 py-1 text-gray-700">{item.vendor || '-'}</td>
                    <td className="px-2 py-1"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusPill(item.status)}`}>{item.status}</span></td>
                    <td className="px-2 py-1 text-gray-700">{item.biaya}</td>
                    <td className="px-2 py-1 text-gray-700">{item.hasil || '-'}</td>
                    <td className="px-2 py-1">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <select
                            value={item.status}
                            onChange={(e) => openApproveDialog(item, e.target.value as MaintenanceDeviceForm['status'])}
                            className="px-2 py-1 border border-gray-200 rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                            <option value="Overdue">Overdue</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer text-xs">
                            <UploadCloud className="h-4 w-4" />
                            <span>Upload</span>
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              onChange={(e) => handleUploadAttachment(item.id, e.target.files)}
                            />
                          </label>
                          {item.attachments && item.attachments.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              <Paperclip className="h-3 w-3 text-gray-500" />
                              {item.attachments.slice(0, 3).map((att) => (
                                <a
                                  key={att.id}
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 text-[10px]"
                                  title={att.name}
                                >
                                  {att.name.length > 12 ? `${att.name.slice(0, 12)}…` : att.name}
                                </a>
                              ))}
                              {item.attachments.length > 3 && (
                                <span className="text-xs text-gray-500">+{item.attachments.length - 3} lagi</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
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

      <MaintenanceDeviceModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSave={handleSave}
        initialData={editingItem ? {
          deviceName: editingItem.deviceName,
          assetTag: editingItem.assetTag,
          userName: editingItem.userName,
          department: editingItem.department,
          kategori: editingItem.kategori,
          jenisPekerjaan: editingItem.jenisPekerjaan,
          tanggal: editingItem.tanggal,
          vendor: editingItem.vendor,
          status: editingItem.status,
          biaya: editingItem.biaya,
          hasil: editingItem.hasil,
        } : null}
        title={editingItem ? 'Edit Maintenance Perangkat' : 'Tambah Maintenance Perangkat'}
        submitLabel={editingItem ? 'Update' : 'Simpan'}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        itemName={`${deleteTarget?.deviceName ?? ''} - ${deleteTarget?.jenisPekerjaan ?? ''}`}
      />

      {isApproveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Approval</h3>
            </div>
            <div className="px-5 py-4 space-y-4 text-sm">
              <p className="text-gray-700">Anda akan mengubah status maintenance berikut:</p>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Perangkat</span>
                  <span>{approveTarget?.deviceName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">User</span>
                  <span>{approveTarget?.userName || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status Saat Ini</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${approveTarget ? statusPill(approveTarget.status) : ''}`}>{approveTarget?.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status Baru</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusPill(approveNextStatus)}`}>{approveNextStatus}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">Lampiran (opsional)</label>
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer w-fit">
                  <UploadCloud className="h-4 w-4" />
                  <span className="text-xs">Upload file</span>
                  <input type="file" multiple className="hidden" onChange={(e) => setApproveFiles(e.target.files)} />
                </label>
                {approveFiles && approveFiles.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Paperclip className="h-3 w-3 text-gray-500" />
                    {Array.from(approveFiles).slice(0, 3).map((f, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-[10px]">
                        {f.name.length > 12 ? `${f.name.slice(0, 12)}…` : f.name}
                      </span>
                    ))}
                    {approveFiles.length > 3 && (
                      <span className="text-xs text-gray-500">+{approveFiles.length - 3} lagi</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
              <button onClick={cancelApprove} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={confirmApprove} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">Setujui</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GAITMaintenanceDeviceDashboard;
