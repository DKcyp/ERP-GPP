import React, { useMemo, useState } from 'react';
import { Clock, PlusCircle, FileSpreadsheet, FileDown, Edit, Trash2, Search, Eye } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface TicketRow {
  id: number;
  tanggal: string; // yyyy-mm-dd
  noTicket: string;
  divisi: string;
  pemohon: string;
  kategori: 'IT Support' | 'Maintenance' | 'General Request' | 'Finance' | 'HR';
  prioritas: 'Low' | 'Medium' | 'High' | 'Urgent';
  judul: string;
  deskripsi: string;
  status: 'Draft' | 'Submitted' | 'In Progress' | 'Approved' | 'Rejected' | 'Completed';
}

const GeneralPengajuanTicketDashboard: React.FC = () => {
  const today = new Date();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Tambah Pengajuan Ticket');
  const [editingData, setEditingData] = useState<TicketRow | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<TicketRow | null>(null);

  const [searchNo, setSearchNo] = useState('');
  const [searchPemohon, setSearchPemohon] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPrioritas, setFilterPrioritas] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const kategoriOptions = ['IT Support', 'Maintenance', 'General Request', 'Finance', 'HR'];
  const prioritasOptions = ['Low', 'Medium', 'High', 'Urgent'];
  const divisiOptions = ['Marketing','HRD','GA','Procurement','Project Control','Operasional','QHSE','Finance','Accounting','Tax','Gudang'];

  const [formData, setFormData] = useState<Partial<TicketRow>>({
    tanggal: today.toISOString().split('T')[0],
    noTicket: `TKT-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-001`,
    divisi: '',
    pemohon: '',
    kategori: 'General Request',
    prioritas: 'Medium',
    judul: '',
    deskripsi: '',
    status: 'Draft',
  });

  const [rows, setRows] = useState<TicketRow[]>([
    { 
      id: 1, 
      tanggal: '2025-09-20', 
      noTicket: 'TKT-2025-09-001', 
      divisi: 'IT', 
      pemohon: 'Andi Pratama', 
      kategori: 'IT Support', 
      prioritas: 'High', 
      judul: 'Laptop tidak bisa connect ke WiFi', 
      deskripsi: 'Laptop saya tidak bisa terhubung ke jaringan WiFi kantor sejak pagi ini',
      status: 'Submitted' 
    },
    { 
      id: 2, 
      tanggal: '2025-09-21', 
      noTicket: 'TKT-2025-09-002', 
      divisi: 'GA', 
      pemohon: 'Siti Nurhaliza', 
      kategori: 'Maintenance', 
      prioritas: 'Medium', 
      judul: 'AC ruang meeting tidak dingin', 
      deskripsi: 'AC di ruang meeting lantai 2 tidak mengeluarkan udara dingin',
      status: 'In Progress' 
    },
    { 
      id: 3, 
      tanggal: '2025-09-22', 
      noTicket: 'TKT-2025-09-003', 
      divisi: 'Finance', 
      pemohon: 'Rudi Hermawan', 
      kategori: 'Finance', 
      prioritas: 'Urgent', 
      judul: 'Request approval budget Q4', 
      deskripsi: 'Membutuhkan persetujuan budget untuk quarter 4 tahun ini',
      status: 'Approved' 
    },
  ]);

  const handleAdd = () => {
    setEditingData(null);
    setModalTitle('Tambah Pengajuan Ticket');
    setFormData({
      tanggal: today.toISOString().split('T')[0],
      noTicket: `TKT-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${String(rows.length + 1).padStart(3, '0')}`,
      divisi: '',
      pemohon: '',
      kategori: 'General Request',
      prioritas: 'Medium',
      judul: '',
      deskripsi: '',
      status: 'Draft',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (row: TicketRow) => {
    setEditingData(row);
    setFormData(row);
    setModalTitle('Edit Pengajuan Ticket');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingData) {
      setRows(prev => prev.map(r => r.id === editingData.id ? { ...formData as TicketRow, id: editingData.id } : r));
    } else {
      const newId = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1;
      setRows(prev => [{ ...formData as TicketRow, id: newId }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (row: TicketRow) => { 
    setRowToDelete(row); 
    setIsConfirmOpen(true); 
  };
  
  const confirmDelete = () => { 
    if (rowToDelete) {
      setRows(prev => prev.filter(r => r.id !== rowToDelete.id)); 
      setIsConfirmOpen(false);
      setRowToDelete(null);
    }
  };

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const okNo = searchNo ? r.noTicket.toLowerCase().includes(searchNo.toLowerCase()) : true;
      const okPemohon = searchPemohon ? r.pemohon.toLowerCase().includes(searchPemohon.toLowerCase()) : true;
      const okKategori = filterKategori ? r.kategori === filterKategori : true;
      const okStatus = filterStatus ? r.status === filterStatus : true;
      const okPrioritas = filterPrioritas ? r.prioritas === filterPrioritas : true;
      const okDateFrom = dateFrom ? new Date(r.tanggal) >= new Date(dateFrom) : true;
      const okDateTo = dateTo ? new Date(r.tanggal) <= new Date(dateTo) : true;
      return okNo && okPemohon && okKategori && okStatus && okPrioritas && okDateFrom && okDateTo;
    });
  }, [rows, searchNo, searchPemohon, filterKategori, filterStatus, filterPrioritas, dateFrom, dateTo]);

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-700';
      case 'Approved': return 'text-blue-700';
      case 'In Progress': return 'text-yellow-700';
      case 'Submitted': return 'text-purple-700';
      case 'Rejected': return 'text-red-700';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">Pengajuan Ticket</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">General</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Pengajuan Ticket</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari No Ticket</label>
              <input type="text" value={searchNo} onChange={e => setSearchNo(e.target.value)} placeholder="TKT-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pemohon</label>
              <input type="text" value={searchPemohon} onChange={e => setSearchPemohon(e.target.value)} placeholder="Nama pemohon..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua Kategori</option>
                {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
              <select value={filterPrioritas} onChange={e => setFilterPrioritas(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua Prioritas</option>
                {prioritasOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Dari</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Sampai</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div className="flex items-end">
              <button onClick={() => { /* trigger memo */ }} className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Cari Data
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center space-y-3 md:space-y-0 md:space-x-3 mt-2">
            <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Ticket
            </button>
            <button onClick={exportExcel} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 w-full md:w-auto">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button onClick={exportPDF} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 w-full md:w-auto">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Pengajuan Ticket</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Ticket</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Divisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pemohon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Prioritas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row.noTicket}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.divisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.pemohon}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(row.prioritas)}`}>
                        {row.prioritas}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate" title={row.judul}>{row.judul}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(row.status)}`}>{row.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(row)} className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50" title="Hapus">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">{modalTitle}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">No Ticket</label>
                    <input type="text" value={formData.noTicket || ''} onChange={e => setFormData(prev => ({...prev, noTicket: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                    <input type="date" value={formData.tanggal || ''} onChange={e => setFormData(prev => ({...prev, tanggal: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Divisi</label>
                    <select value={formData.divisi || ''} onChange={e => setFormData(prev => ({...prev, divisi: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none">
                      <option value="">Pilih Divisi</option>
                      {divisiOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pemohon</label>
                    <input type="text" value={formData.pemohon || ''} onChange={e => setFormData(prev => ({...prev, pemohon: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select value={formData.kategori || ''} onChange={e => setFormData(prev => ({...prev, kategori: e.target.value as any}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none">
                      {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
                    <select value={formData.prioritas || ''} onChange={e => setFormData(prev => ({...prev, prioritas: e.target.value as any}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none">
                      {prioritasOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                  <input type="text" value={formData.judul || ''} onChange={e => setFormData(prev => ({...prev, judul: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea value={formData.deskripsi || ''} onChange={e => setFormData(prev => ({...prev, deskripsi: e.target.value}))} rows={4} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Tutup
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={rowToDelete?.noTicket}
        message="Apakah Anda yakin ingin menghapus Pengajuan Ticket ini?"
      />
    </div>
  );
};

export default GeneralPengajuanTicketDashboard;
