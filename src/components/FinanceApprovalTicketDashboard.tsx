import React, { useMemo, useState } from 'react';
import { Clock, FileSpreadsheet, FileDown, Eye, CheckCircle, XCircle, Search } from 'lucide-react';

interface TicketRow {
  id: number;
  tanggal: string;
  noTicket: string;
  divisi: string;
  pemohon: string;
  kategori: 'IT Support' | 'Maintenance' | 'General Request' | 'Finance' | 'HR';
  prioritas: 'Low' | 'Medium' | 'High' | 'Urgent';
  judul: string;
  deskripsi: string;
  status: 'Submitted' | 'Approved' | 'Rejected';
  tanggalApproval?: string;
  approver?: string;
  catatan?: string;
}

const FinanceApprovalTicketDashboard: React.FC = () => {
  const today = new Date();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketRow | null>(null);
  const [approvalNote, setApprovalNote] = useState('');

  const [searchNo, setSearchNo] = useState('');
  const [searchPemohon, setSearchPemohon] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPrioritas, setFilterPrioritas] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const kategoriOptions = ['IT Support', 'Maintenance', 'General Request', 'Finance', 'HR'];
  const prioritasOptions = ['Low', 'Medium', 'High', 'Urgent'];

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
      deskripsi: 'Laptop saya tidak bisa terhubung ke jaringan WiFi kantor sejak pagi ini. Sudah dicoba restart berkali-kali tetapi masih tidak bisa.',
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
      deskripsi: 'AC di ruang meeting lantai 2 tidak mengeluarkan udara dingin. Perlu diperbaiki segera karena akan ada meeting penting.',
      status: 'Submitted'
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
      deskripsi: 'Membutuhkan persetujuan budget untuk quarter 4 tahun ini sesuai dengan planning yang telah dibuat.',
      status: 'Approved',
      tanggalApproval: '2025-09-22',
      approver: 'Finance Manager',
      catatan: 'Budget approved sesuai dengan proposal yang diajukan'
    },
  ]);

  const handleApprove = (ticket: TicketRow) => {
    setRows(prev => prev.map(r => 
      r.id === ticket.id 
        ? { 
            ...r, 
            status: 'Approved', 
            tanggalApproval: today.toISOString().split('T')[0],
            approver: 'Finance Manager',
            catatan: approvalNote
          } 
        : r
    ));
    setIsDetailOpen(false);
    setApprovalNote('');
  };

  const handleReject = (ticket: TicketRow) => {
    setRows(prev => prev.map(r => 
      r.id === ticket.id 
        ? { 
            ...r, 
            status: 'Rejected', 
            tanggalApproval: today.toISOString().split('T')[0],
            approver: 'Finance Manager',
            catatan: approvalNote
          } 
        : r
    ));
    setIsDetailOpen(false);
    setApprovalNote('');
  };

  const handleViewDetail = (ticket: TicketRow) => {
    setSelectedTicket(ticket);
    setApprovalNote(ticket.catatan || '');
    setIsDetailOpen(true);
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
      case 'Approved': return 'text-green-700';
      case 'Submitted': return 'text-blue-700';
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

  // Statistics
  const stats = {
    pending: rows.filter(r => r.status === 'Submitted').length,
    approved: rows.filter(r => r.status === 'Approved').length,
    rejected: rows.filter(r => r.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">Approval Ticket</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-green-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-green-600 font-medium">Approval Ticket</span>
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari No Ticket</label>
              <input type="text" value={searchNo} onChange={e => setSearchNo(e.target.value)} placeholder="TKT-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pemohon</label>
              <input type="text" value={searchPemohon} onChange={e => setSearchPemohon(e.target.value)} placeholder="Nama pemohon..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none">
                <option value="">Semua Kategori</option>
                {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none">
                <option value="">Semua</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Dari</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Sampai</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm" />
            </div>
            <div className="flex items-end">
              <button onClick={() => { /* trigger memo */ }} className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Cari Data
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center space-y-3 md:space-y-0 md:space-x-3 mt-2">
            <button onClick={exportExcel} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 w-full md:w-auto">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button onClick={exportPDF} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 w-full md:w-auto">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Ticket untuk Approval</h3>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{row.noTicket}</td>
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
                      <button onClick={() => handleViewDetail(row)} className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50" title="View Detail">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">Detail Ticket - {selectedTicket.noTicket}</h2>
              <button onClick={() => setIsDetailOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                    <p className="text-sm text-gray-900">{new Date(selectedTicket.tanggal).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">No Ticket</label>
                    <p className="text-sm text-gray-900">{selectedTicket.noTicket}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Divisi</label>
                    <p className="text-sm text-gray-900">{selectedTicket.divisi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pemohon</label>
                    <p className="text-sm text-gray-900">{selectedTicket.pemohon}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kategori</label>
                    <p className="text-sm text-gray-900">{selectedTicket.kategori}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prioritas</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedTicket.prioritas)}`}>
                      {selectedTicket.prioritas}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Judul</label>
                  <p className="text-sm text-gray-900">{selectedTicket.judul}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                  <p className="text-sm text-gray-900">{selectedTicket.deskripsi}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Approval</label>
                  <textarea 
                    value={approvalNote} 
                    onChange={e => setApprovalNote(e.target.value)} 
                    rows={3} 
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                    placeholder="Masukkan catatan untuk approval/rejection..."
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setIsDetailOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Tutup
              </button>
              {selectedTicket.status === 'Submitted' && (
                <>
                  <button onClick={() => handleReject(selectedTicket)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm inline-flex items-center">
                    <XCircle className="h-4 w-4 mr-2" /> Reject
                  </button>
                  <button onClick={() => handleApprove(selectedTicket)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm inline-flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" /> Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceApprovalTicketDashboard;
