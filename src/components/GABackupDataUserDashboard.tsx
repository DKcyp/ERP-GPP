import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, FileSpreadsheet, FileText, Clock, Edit, Trash2, Calendar, Database, Paperclip, UploadCloud } from 'lucide-react';
import BackupDataUserModal, { BackupDataUserForm } from './BackupDataUserModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface Attachment { id: string; name: string; url: string; addedAt: string }

interface BackupItem extends BackupDataUserForm { id: string; attachments?: Attachment[] }

const seedData = (): BackupItem[] => [
  { id: '1', userName: 'Rudi', department: 'Operasional', deviceName: 'LAP-OPS-01', backupType: 'Full', backupDate: '2025-09-01', storageLocation: 'NAS-01', size: '18 GB', status: 'Successful', notes: 'Bulanan', attachments: [] },
  { id: '2', userName: 'Sari', department: 'HRD', deviceName: 'LAP-HRD-02', backupType: 'Incremental', backupDate: '2025-09-05', storageLocation: 'Google Drive', size: '2.1 GB', status: 'Scheduled', attachments: [] },
  { id: '3', userName: 'Budi', department: 'Finance', deviceName: 'LAP-FIN-03', backupType: 'Full', backupDate: '2025-09-07', storageLocation: 'NAS-02', size: '21 GB', status: 'Failed', notes: 'Jaringan putus', attachments: [] },
];

const statusPill = (status: BackupItem['status']) => {
  switch (status) {
    case 'Successful': return 'bg-green-100 text-green-800 border-green-200';
    case 'Running': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Failed': return 'bg-red-100 text-red-800 border-red-200';
    case 'Scheduled':
    default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
};

const GABackupDataUserDashboard: React.FC = () => {
  // Filters
  const [searchUser, setSearchUser] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [backupType, setBackupType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Data
  const [data, setData] = useState<BackupItem[]>(seedData());
  const [animateRows, setAnimateRows] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BackupItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BackupItem | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState('');

  useEffect(() => { const t = setTimeout(() => setAnimateRows(true), 100); return () => clearTimeout(t); }, []);

  const filtered = useMemo(() => {
    const qu = searchUser.trim().toLowerCase();
    const dep = department.trim().toLowerCase();
    return data.filter(d => {
      const matchUser = qu ? `${d.userName} ${d.deviceName}`.toLowerCase().includes(qu) : true;
      const matchDep = dep ? d.department.toLowerCase().includes(dep) : true;
      const matchStatus = status ? d.status === (status as BackupItem['status']) : true;
      const matchType = backupType ? d.backupType === (backupType as BackupItem['backupType']) : true;
      const dt = new Date(d.backupDate);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      const matchDate = (!from || dt >= from) && (!to || dt <= to);
      return matchUser && matchDep && matchStatus && matchType && matchDate;
    });
  }, [data, searchUser, department, status, backupType, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const currentData = filtered.slice(startIndex, endIndex);

  const handleSearch = () => setCurrentPage(1);

  const handleSave = (form: BackupDataUserForm) => {
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

  const handleStatusChange = (id: string, next: BackupDataUserForm['status']) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">BACKUP DATA SETIAP USER</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">GA</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">Backup Data User</span>
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
            {/* Cari user/perangkat */}
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-xs font-medium text-gray-700">Cari User / Perangkat</label>
              <div className="relative">
                <input type="text" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" placeholder="Contoh: Rudi / LAP-OPS-01" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Departemen */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Departemen</label>
              <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs" placeholder="Contoh: Finance, HRD" />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs bg-white">
                <option value="">Semua</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Running">Running</option>
                <option value="Successful">Successful</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Jenis Backup */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Jenis Backup</label>
              <select value={backupType} onChange={(e) => setBackupType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs bg-white">
                <option value="">Semua</option>
                <option value="Full">Full</option>
                <option value="Incremental">Incremental</option>
              </select>
            </div>

            {/* Range Tanggal */}
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
              <span>Tambah Backup</span>
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
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">User</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Departemen</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Perangkat</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Jenis Backup</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Tanggal</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Lokasi Penyimpanan</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Ukuran</th>
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-900">Status</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Catatan</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-900">Tindak Lanjut</th>
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`} style={{ animationDelay: animateRows ? `${index * 100}ms` : '0ms', animationFillMode: 'forwards' }}>
                    <td className="px-2 py-1"><span className="font-medium text-gray-900">{startIndex + index + 1}</span></td>
                    <td className="px-2 py-1 font-medium text-gray-900">{item.userName}</td>
                    <td className="px-2 py-1 text-gray-700">{item.department}</td>
                    <td className="px-2 py-1 text-gray-700">{item.deviceName}</td>
                    <td className="px-2 py-1 text-gray-700">{item.backupType}</td>
                    <td className="px-2 py-1 text-gray-700">{new Date(item.backupDate).toLocaleDateString('id-ID')}</td>
                    <td className="px-2 py-1 text-gray-700">{item.storageLocation}</td>
                    <td className="px-2 py-1 text-gray-700">{item.size}</td>
                    <td className="px-2 py-1 text-center"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusPill(item.status)}`}>{item.status}</span></td>
                    <td className="px-2 py-1 text-gray-700">{item.notes || '-'}</td>
                    <td className="px-2 py-1">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value as BackupDataUserForm['status'])}
                            className="px-2 py-1 border border-gray-200 rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Running">Running</option>
                            <option value="Successful">Successful</option>
                            <option value="Failed">Failed</option>
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

      <BackupDataUserModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSave={handleSave}
        initialData={editingItem ? {
          userName: editingItem.userName,
          department: editingItem.department,
          deviceName: editingItem.deviceName,
          backupType: editingItem.backupType,
          backupDate: editingItem.backupDate,
          storageLocation: editingItem.storageLocation,
          size: editingItem.size,
          status: editingItem.status,
          notes: editingItem.notes,
        } : null}
        title={editingItem ? 'Edit Backup User' : 'Tambah Backup User'}
        submitLabel={editingItem ? 'Update' : 'Simpan'}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        itemName={`${deleteTarget?.userName ?? ''} - ${deleteTarget?.deviceName ?? ''}`}
      />
    </div>
  );
};

export default GABackupDataUserDashboard;
