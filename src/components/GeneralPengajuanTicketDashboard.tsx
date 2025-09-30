import React, { useMemo, useState } from 'react';
import { Clock, PlusCircle, FileSpreadsheet, FileDown, Edit, Trash2, Search, Plus, Minus } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface PassengerData {
  no: number;
  nama: string;
}

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
  
  // Form Header Info
  noDokumen?: string;
  noRevisi?: string;
  tanggalRevisi?: string;
  tanggalBerlaku?: string;
  halaman?: string;
  
  // Basic Info
  dept?: string;
  soTurunan?: string;
  
  // Ticket Booking - Keberangkatan
  tanggalBerangkat?: string;
  tujuanBerangkat?: string;
  jamBerangkat?: string;
  maskapaiBerangkat?: string;
  hargaBerangkat?: number;
  jenisTicketBerangkat?: string;
  
  // Ticket Booking - Kepulangan
  tanggalPulang?: string;
  tujuanPulang?: string;
  jamPulang?: string;
  maskapaipulang?: string;
  hargaPulang?: number;
  jenisTicketPulang?: string;
  
  // Passenger List
  passengers?: PassengerData[];
  
  // Hotel Booking
  tanggalCheckIn?: string;
  tanggalCheckOut?: string;
  lokasiHotel?: string;
  namaHotel?: string;
  jumlahHari?: number;
  hargaTotalHotel?: number;
  
  // Billing Section
  ditagihkanKe?: 'Client' | 'Perusahaan' | '';
  
  // Approval Section
  managerTerkait?: string;
  managerFinance?: string;
  direkturOPS?: string;
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
    
    // Form Header Info
    noDokumen: 'GBP-HG-FM-23',
    noRevisi: '01',
    tanggalRevisi: today.toISOString().split('T')[0],
    tanggalBerlaku: today.toISOString().split('T')[0],
    halaman: '1 dari 1',
    
    // Basic Info
    dept: '',
    soTurunan: '',
    
    // Ticket Booking - Keberangkatan
    tanggalBerangkat: '',
    tujuanBerangkat: '',
    jamBerangkat: '',
    maskapaiBerangkat: '',
    hargaBerangkat: 0,
    jenisTicketBerangkat: 'Ekonomi',
    
    // Ticket Booking - Kepulangan
    tanggalPulang: '',
    tujuanPulang: '',
    jamPulang: '',
    maskapaipulang: '',
    hargaPulang: 0,
    jenisTicketPulang: 'Ekonomi',
    
    // Passenger List
    passengers: [{ no: 1, nama: '' }],
    
    // Hotel Booking
    tanggalCheckIn: '',
    tanggalCheckOut: '',
    lokasiHotel: '',
    namaHotel: '',
    jumlahHari: 0,
    hargaTotalHotel: 0,
    
    // Billing Section
    ditagihkanKe: '',
    
    // Approval Section
    managerTerkait: '',
    managerFinance: '',
    direkturOPS: '',
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
      judul: 'Pemesanan Tiket Dinas ke Jakarta', 
      deskripsi: 'Perjalanan dinas untuk meeting dengan client di Jakarta',
      status: 'Submitted',
      dept: 'IT',
      soTurunan: 'SO00123.001',
      tanggalBerangkat: '2025-10-01',
      tujuanBerangkat: 'Jakarta',
      jamBerangkat: '08:00',
      maskapaiBerangkat: 'Garuda Indonesia',
      hargaBerangkat: 1500000,
      jenisTicketBerangkat: 'Ekonomi',
      tanggalPulang: '2025-10-03',
      tujuanPulang: 'Surabaya',
      jamPulang: '16:00',
      maskapaipulang: 'Lion Air',
      hargaPulang: 1200000,
      jenisTicketPulang: 'Ekonomi',
      passengers: [{ no: 1, nama: 'Andi Pratama' }],
      tanggalCheckIn: '2025-10-01',
      tanggalCheckOut: '2025-10-03',
      lokasiHotel: 'Jakarta',
      namaHotel: 'Hotel Santika',
      jumlahHari: 2,
      hargaTotalHotel: 800000,
      ditagihkanKe: 'Client'
    },
    { 
      id: 2, 
      tanggal: '2025-09-21', 
      noTicket: 'TKT-2025-09-002', 
      divisi: 'GA', 
      pemohon: 'Siti Nurhaliza', 
      kategori: 'General Request', 
      prioritas: 'Medium', 
      judul: 'Perjalanan Dinas ke Bali', 
      deskripsi: 'Kunjungan ke cabang Bali untuk audit operasional',
      status: 'In Progress',
      dept: 'GA',
      soTurunan: 'SO00123.002',
      tanggalBerangkat: '2025-10-05',
      tujuanBerangkat: 'Bali',
      jamBerangkat: '09:30',
      maskapaiBerangkat: 'Citilink',
      hargaBerangkat: 2000000,
      jenisTicketBerangkat: 'Ekonomi',
      tanggalPulang: '2025-10-08',
      tujuanPulang: 'Surabaya',
      jamPulang: '18:00',
      maskapaipulang: 'Batik Air',
      hargaPulang: 1800000,
      jenisTicketPulang: 'Ekonomi',
      passengers: [{ no: 1, nama: 'Siti Nurhaliza' }, { no: 2, nama: 'Ahmad Fauzi' }],
      tanggalCheckIn: '2025-10-05',
      tanggalCheckOut: '2025-10-08',
      lokasiHotel: 'Denpasar',
      namaHotel: 'Grand Inna Bali Beach',
      jumlahHari: 3,
      hargaTotalHotel: 1500000,
      ditagihkanKe: 'Perusahaan'
    },
    { 
      id: 3, 
      tanggal: '2025-09-22', 
      noTicket: 'TKT-2025-09-003', 
      divisi: 'Finance', 
      pemohon: 'Rudi Hermawan', 
      kategori: 'Finance', 
      prioritas: 'Urgent', 
      judul: 'Meeting Budget Q4 di Bandung', 
      deskripsi: 'Pertemuan dengan tim finance regional untuk pembahasan budget Q4',
      status: 'Approved',
      dept: 'Finance',
      soTurunan: 'SO00123.003',
      tanggalBerangkat: '2025-09-25',
      tujuanBerangkat: 'Bandung',
      jamBerangkat: '07:00',
      maskapaiBerangkat: 'Sriwijaya Air',
      hargaBerangkat: 800000,
      jenisTicketBerangkat: 'Ekonomi',
      tanggalPulang: '2025-09-26',
      tujuanPulang: 'Surabaya',
      jamPulang: '19:00',
      maskapaipulang: 'Garuda Indonesia',
      hargaPulang: 900000,
      jenisTicketPulang: 'Ekonomi',
      passengers: [{ no: 1, nama: 'Rudi Hermawan' }],
      tanggalCheckIn: '2025-09-25',
      tanggalCheckOut: '2025-09-26',
      lokasiHotel: 'Bandung',
      namaHotel: 'Hotel Savoy Homann',
      jumlahHari: 1,
      hargaTotalHotel: 500000,
      ditagihkanKe: 'Client'
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
      
      // Form Header Info
      noDokumen: 'GBP-HG-FM-23',
      noRevisi: '01',
      tanggalRevisi: today.toISOString().split('T')[0],
      tanggalBerlaku: today.toISOString().split('T')[0],
      halaman: '1 dari 1',
      
      // Basic Info
      dept: '',
      soTurunan: '',
      
      // Ticket Booking - Keberangkatan
      tanggalBerangkat: '',
      tujuanBerangkat: '',
      jamBerangkat: '',
      maskapaiBerangkat: '',
      hargaBerangkat: 0,
      jenisTicketBerangkat: 'Ekonomi',
      
      // Ticket Booking - Kepulangan
      tanggalPulang: '',
      tujuanPulang: '',
      jamPulang: '',
      maskapaipulang: '',
      hargaPulang: 0,
      jenisTicketPulang: 'Ekonomi',
      
      // Passenger List
      passengers: [{ no: 1, nama: '' }],
      
      // Hotel Booking
      tanggalCheckIn: '',
      tanggalCheckOut: '',
      lokasiHotel: '',
      namaHotel: '',
      jumlahHari: 0,
      hargaTotalHotel: 0,
      
      // Billing Section
      ditagihkanKe: '',
      
      // Approval Section
      managerTerkait: '',
      managerFinance: '',
      direkturOPS: '',
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
              <div className="p-6 space-y-8">
                {/* Header Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Informasi Dokumen</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">No Dokumen</label>
                      <input type="text" value={formData.noDokumen || ''} onChange={e => setFormData(prev => ({...prev, noDokumen: e.target.value}))} placeholder="GBP-HG-FM-23" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">No Revisi</label>
                      <input type="text" value={formData.noRevisi || ''} onChange={e => setFormData(prev => ({...prev, noRevisi: e.target.value}))} placeholder="01" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Halaman</label>
                      <input type="text" value={formData.halaman || ''} onChange={e => setFormData(prev => ({...prev, halaman: e.target.value}))} placeholder="1 dari 1" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Revisi</label>
                      <input type="date" value={formData.tanggalRevisi || ''} onChange={e => setFormData(prev => ({...prev, tanggalRevisi: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Berlaku</label>
                      <input type="date" value={formData.tanggalBerlaku || ''} onChange={e => setFormData(prev => ({...prev, tanggalBerlaku: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pemohon</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">No Ticket</label>
                      <input type="text" value={formData.noTicket || ''} onChange={e => setFormData(prev => ({...prev, noTicket: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                      <input type="date" value={formData.tanggal || ''} onChange={e => setFormData(prev => ({...prev, tanggal: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pemohon</label>
                      <input type="text" value={formData.pemohon || ''} onChange={e => setFormData(prev => ({...prev, pemohon: e.target.value}))} placeholder="Supardi" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dept</label>
                      <select value={formData.dept || ''} onChange={e => setFormData(prev => ({...prev, dept: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none">
                        <option value="">Pilih Departemen</option>
                        {divisiOptions.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">SO Turunan</label>
                      <input type="text" value={formData.soTurunan || ''} onChange={e => setFormData(prev => ({...prev, soTurunan: e.target.value}))} placeholder="SO00123.342" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                  </div>
                </div>

                {/* Ticket Booking Section */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Pemesanan Tiket Pesawat</h4>
                  
                  {/* Keberangkatan */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-green-800 mb-3">Keberangkatan</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                        <input type="date" value={formData.tanggalBerangkat || ''} onChange={e => setFormData(prev => ({...prev, tanggalBerangkat: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tujuan</label>
                        <input type="text" value={formData.tujuanBerangkat || ''} onChange={e => setFormData(prev => ({...prev, tujuanBerangkat: e.target.value}))} placeholder="Bali" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jam</label>
                        <input type="time" value={formData.jamBerangkat || ''} onChange={e => setFormData(prev => ({...prev, jamBerangkat: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Maskapai</label>
                        <input type="text" value={formData.maskapaiBerangkat || ''} onChange={e => setFormData(prev => ({...prev, maskapaiBerangkat: e.target.value}))} placeholder="Lion Air" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
                        <input type="number" value={formData.hargaBerangkat || 0} onChange={e => setFormData(prev => ({...prev, hargaBerangkat: Number(e.target.value)}))} placeholder="6000000" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Tiket</label>
                        <select value={formData.jenisTicketBerangkat || ''} onChange={e => setFormData(prev => ({...prev, jenisTicketBerangkat: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none">
                          <option value="Ekonomi">Ekonomi</option>
                          <option value="Bisnis">Bisnis</option>
                          <option value="First Class">First Class</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Kepulangan */}
                  <div>
                    <h5 className="text-md font-medium text-green-800 mb-3">Kepulangan</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                        <input type="date" value={formData.tanggalPulang || ''} onChange={e => setFormData(prev => ({...prev, tanggalPulang: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tujuan</label>
                        <input type="text" value={formData.tujuanPulang || ''} onChange={e => setFormData(prev => ({...prev, tujuanPulang: e.target.value}))} placeholder="Jakarta" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jam</label>
                        <input type="time" value={formData.jamPulang || ''} onChange={e => setFormData(prev => ({...prev, jamPulang: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Maskapai</label>
                        <input type="text" value={formData.maskapaipulang || ''} onChange={e => setFormData(prev => ({...prev, maskapaipulang: e.target.value}))} placeholder="Garuda" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
                        <input type="number" value={formData.hargaPulang || 0} onChange={e => setFormData(prev => ({...prev, hargaPulang: Number(e.target.value)}))} placeholder="8000000" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Tiket</label>
                        <select value={formData.jenisTicketPulang || ''} onChange={e => setFormData(prev => ({...prev, jenisTicketPulang: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none">
                          <option value="Ekonomi">Ekonomi</option>
                          <option value="Bisnis">Bisnis</option>
                          <option value="First Class">First Class</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passenger List */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-yellow-900">Daftar Penumpang</h4>
                    <button 
                      type="button"
                      onClick={() => {
                        const newPassengers = [...(formData.passengers || [])];
                        newPassengers.push({ no: newPassengers.length + 1, nama: '' });
                        setFormData(prev => ({...prev, passengers: newPassengers}));
                      }}
                      className="inline-flex items-center px-3 py-1 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Tambah Penumpang
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(formData.passengers || []).map((passenger, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-16">
                          <label className="block text-sm font-medium text-gray-700 mb-1">No</label>
                          <input type="number" value={passenger.no} readOnly className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penumpang</label>
                          <input 
                            type="text" 
                            value={passenger.nama} 
                            onChange={e => {
                              const newPassengers = [...(formData.passengers || [])];
                              newPassengers[index].nama = e.target.value;
                              setFormData(prev => ({...prev, passengers: newPassengers}));
                            }}
                            placeholder="Masukkan nama penumpang"
                            className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                          />
                        </div>
                        {(formData.passengers || []).length > 1 && (
                          <button 
                            type="button"
                            onClick={() => {
                              const newPassengers = (formData.passengers || []).filter((_, i) => i !== index);
                              // Renumber passengers
                              newPassengers.forEach((p, i) => p.no = i + 1);
                              setFormData(prev => ({...prev, passengers: newPassengers}));
                            }}
                            className="mt-6 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing Section - After Passenger List */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">Ditagihkan Ke</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="ditagihkanKe" 
                          value="Client" 
                          checked={formData.ditagihkanKe === 'Client'}
                          onChange={e => setFormData(prev => ({...prev, ditagihkanKe: e.target.value as 'Client' | 'Perusahaan'}))}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Client</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="ditagihkanKe" 
                          value="Perusahaan" 
                          checked={formData.ditagihkanKe === 'Perusahaan'}
                          onChange={e => setFormData(prev => ({...prev, ditagihkanKe: e.target.value as 'Client' | 'Perusahaan'}))}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Perusahaan</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Hotel Booking Section */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-purple-900 mb-4">Pemesanan Hotel</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Check In</label>
                      <input type="date" value={formData.tanggalCheckIn || ''} onChange={e => setFormData(prev => ({...prev, tanggalCheckIn: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Check Out</label>
                      <input type="date" value={formData.tanggalCheckOut || ''} onChange={e => setFormData(prev => ({...prev, tanggalCheckOut: e.target.value}))} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Hari</label>
                      <input type="number" value={formData.jumlahHari || 0} onChange={e => setFormData(prev => ({...prev, jumlahHari: Number(e.target.value)}))} placeholder="10" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                      <input type="text" value={formData.lokasiHotel || ''} onChange={e => setFormData(prev => ({...prev, lokasiHotel: e.target.value}))} placeholder="Bali" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Hotel</label>
                      <input type="text" value={formData.namaHotel || ''} onChange={e => setFormData(prev => ({...prev, namaHotel: e.target.value}))} placeholder="Hotel Citra" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Harga Total (Rp)</label>
                      <input type="number" value={formData.hargaTotalHotel || 0} onChange={e => setFormData(prev => ({...prev, hargaTotalHotel: Number(e.target.value)}))} placeholder="15000000" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                  </div>
                </div>

                {/* Billing Section */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">Ditagihkan Ke</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="ditagihkanKe" 
                          value="Client" 
                          checked={formData.ditagihkanKe === 'Client'}
                          onChange={e => setFormData(prev => ({...prev, ditagihkanKe: e.target.value as 'Client' | 'Perusahaan'}))}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Client</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="ditagihkanKe" 
                          value="Perusahaan" 
                          checked={formData.ditagihkanKe === 'Perusahaan'}
                          onChange={e => setFormData(prev => ({...prev, ditagihkanKe: e.target.value as 'Client' | 'Perusahaan'}))}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Perusahaan</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Approval Section */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-red-900 mb-4">Persetujuan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Manager Terkait</label>
                      <input type="text" value={formData.managerTerkait || ''} onChange={e => setFormData(prev => ({...prev, managerTerkait: e.target.value}))} placeholder="Nama Manager Terkait" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Manager Finance</label>
                      <input type="text" value={formData.managerFinance || ''} onChange={e => setFormData(prev => ({...prev, managerFinance: e.target.value}))} placeholder="Nama Manager Finance" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Direktur OPS & MKT</label>
                      <input type="text" value={formData.direkturOPS || ''} onChange={e => setFormData(prev => ({...prev, direkturOPS: e.target.value}))} placeholder="Nama Direktur OPS & MKT" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                    </div>
                  </div>
                </div>

                {/* Legacy Fields for Compatibility */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Informasi Tambahan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                    <input type="text" value={formData.judul || ''} onChange={e => setFormData(prev => ({...prev, judul: e.target.value}))} placeholder="Judul pengajuan" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                    <textarea value={formData.deskripsi || ''} onChange={e => setFormData(prev => ({...prev, deskripsi: e.target.value}))} rows={4} placeholder="Deskripsi detail pengajuan" className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                  </div>
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
