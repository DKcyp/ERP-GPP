import React, { useMemo, useState } from 'react';
import { Clock, FileSpreadsheet, FileDown, Search, CheckCircle, XCircle, Eye, AlertCircle, Receipt } from 'lucide-react';

interface ApprovalReimburseRow {
  id: number;
  noReimburse: string;
  tglReimburse: string;
  namaDivisi: string;
  noSO: string;
  nominalReimburse: number;
  statusApproval: 'Pending' | 'Approved' | 'Rejected';
  namaKaryawan: string;
  jenisReimburse: string;
  approver: string;
  levelApproval: number;
  tglSubmit: string;
  tglApproval?: string;
  keterangan: string;
  catatan?: string;
  dokumenPendukung?: string;
}

const FinanceApprovalReimburseDashboard: React.FC = () => {
  const today = new Date();

  // Filters
  const [filterNoReimburse, setFilterNoReimburse] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReimburse, setSelectedReimburse] = useState<ApprovalReimburseRow | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalNotes, setApprovalNotes] = useState('');

  // Dummy data
  const [rows, setRows] = useState<ApprovalReimburseRow[]>([
    {
      id: 1,
      noReimburse: 'RMB-2025-0901',
      tglReimburse: '2025-09-02',
      namaDivisi: 'Marketing',
      noSO: 'SO-001',
      nominalReimburse: 850000,
      statusApproval: 'Pending',
      namaKaryawan: 'Budi Santoso',
      jenisReimburse: 'Transport',
      approver: 'Manajer Marketing',
      levelApproval: 1,
      tglSubmit: '2025-09-02',
      keterangan: 'Reimburse transport kunjungan client Jakarta',
      dokumenPendukung: 'Kwitansi transport, foto odometer',
    },
    {
      id: 2,
      noReimburse: 'RMB-2025-0902',
      tglReimburse: '2025-09-05',
      namaDivisi: 'HRD',
      noSO: 'SO-015',
      nominalReimburse: 1200000,
      statusApproval: 'Approved',
      namaKaryawan: 'Siti Aminah',
      jenisReimburse: 'Medical',
      approver: 'Direktur HRD',
      levelApproval: 2,
      tglSubmit: '2025-09-05',
      tglApproval: '2025-09-06',
      keterangan: 'Reimburse biaya medical check up karyawan',
      catatan: 'Disetujui sesuai kebijakan medical',
      dokumenPendukung: 'Kwitansi rumah sakit, hasil MCU',
    },
  ]);

  const filtered = useMemo(() => rows.filter(r => {
    const okNo = filterNoReimburse ? r.noReimburse.toLowerCase().includes(filterNoReimburse.toLowerCase()) : true;
    const okDiv = filterDivisi ? r.namaDivisi === filterDivisi : true;
    const okStat = filterStatus ? r.statusApproval === (filterStatus as any) : true;
    const okJenis = filterJenis ? r.jenisReimburse === filterJenis : true;
    const okFrom = dari ? new Date(r.tglReimburse) >= new Date(`${dari}T00:00:00`) : true;
    const okTo = sampai ? new Date(r.tglReimburse) <= new Date(`${sampai}T23:59:59`) : true;
    return okNo && okDiv && okStat && okJenis && okFrom && okTo;
  }), [rows, filterNoReimburse, filterDivisi, filterStatus, filterJenis, dari, sampai]);

  const handleViewDetail = (reimburse: ApprovalReimburseRow) => {
    setSelectedReimburse(reimburse);
    setShowDetailModal(true);
  };

  const handleApproval = (reimburse: ApprovalReimburseRow, action: 'approve' | 'reject') => {
    setSelectedReimburse(reimburse);
    setApprovalAction(action);
    setApprovalNotes('');
    setShowApprovalModal(true);
  };

  const confirmApproval = () => {
    if (!selectedReimburse) return;
    
    const updatedRows = rows.map(row => {
      if (row.id === selectedReimburse.id) {
        return {
          ...row,
          statusApproval: approvalAction === 'approve' ? 'Approved' : 'Rejected' as any,
          tglApproval: new Date().toISOString().split('T')[0],
          catatan: approvalNotes || undefined,
        };
      }
      return row;
    });
    
    setRows(updatedRows);
    setShowApprovalModal(false);
    setSelectedReimburse(null);
    setApprovalNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pending
        </span>;
      case 'Approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  const pendingCount = filtered.filter(r => r.statusApproval === 'Pending').length;
  const approvedCount = filtered.filter(r => r.statusApproval === 'Approved').length;
  const rejectedCount = filtered.filter(r => r.statusApproval === 'Rejected').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">APPROVAL REIMBURSE</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Voucher dan Reimburse</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Approval Reimburse</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reimburse</p>
                <p className="text-3xl font-bold text-gray-900">{filtered.length}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Receipt className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter Approval Reimburse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Reimburse</label>
              <input 
                type="text" 
                value={filterNoReimburse} 
                onChange={e => setFilterNoReimburse(e.target.value)} 
                placeholder="RMB-..." 
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Divisi</label>
              <select 
                value={filterDivisi} 
                onChange={e => setFilterDivisi(e.target.value)} 
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">Semua</option>
                {['Marketing','HRD','GA','Procurement','Project Control','Operasional','QHSE','Finance','Accounting','Tax','Gudang'].map(d => 
                  <option key={d} value={d}>{d}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Approval</label>
              <select 
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)} 
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">Semua</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Reimburse</label>
              <select 
                value={filterJenis} 
                onChange={e => setFilterJenis(e.target.value)} 
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">Semua</option>
                <option value="Transport">Transport</option>
                <option value="Medical">Medical</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Training">Training</option>
                <option value="Communication">Communication</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl Reimburse Dari</label>
              <input 
                type="date" 
                value={dari} 
                onChange={e => setDari(e.target.value)} 
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl Reimburse Sampai</label>
              <input 
                type="date" 
                value={sampai} 
                onChange={e => setSampai(e.target.value)} 
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" 
              />
            </div>
            <div className="flex items-end">
              <button className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Terapkan Filter
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button 
              onClick={exportExcel} 
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button 
              onClick={exportPDF} 
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Daftar Approval Reimburse ({filtered.length} items)</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Reimburse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Reimburse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Divisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karyawan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">{row.noReimburse}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(row.tglReimburse).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaDivisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaKaryawan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.jenisReimburse}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {row.nominalReimburse.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(row.statusApproval)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.approver}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetail(row)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Detail
                        </button>
                        {row.statusApproval === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApproval(row, 'approve')}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproval(row, 'reject')}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceApprovalReimburseDashboard;
