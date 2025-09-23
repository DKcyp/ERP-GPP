import React, { useMemo, useState } from 'react';
import { Search, CalendarDays, FileText, FileSpreadsheet, FileDown, Plus, Edit, Trash2, X } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface VoucherEntry {
  no: number;
  noVoucher: string;
  noSO: string;
  noSOTurunan: string;
  namaProject: string;
  namaPemohon: string;
  namaPenerima: string;
  noRekening: string;
  tglPengajuanVoucher: string;
  tglPembayaranVoucher: string;
  tglExpired: string;
  tglLaporanExpense: string;
  nominal: string;
  keterangan: string;
}

const GeneralVoucherDashboard: React.FC = () => {
  const initialData: VoucherEntry[] = [
    {
      no: 1,
      noVoucher: 'VCH001',
      noSO: 'SO001',
      noSOTurunan: '-',
      namaProject: 'Project A',
      namaPemohon: 'Abdul Karim',
      namaPenerima: 'Andi Pratama',
      noRekening: '1234567890',
      tglPengajuanVoucher: '10-01-2025',
      tglPembayaranVoucher: '15-01-2025',
      tglExpired: '25-01-2025',
      tglLaporanExpense: '30-01-2025',
      nominal: 'Rp 20,000,000',
      keterangan: 'Tugas Luar Kota',
    },
    {
      no: 2,
      noVoucher: 'VCH002',
      noSO: 'SO002',
      noSOTurunan: 'SO002.4',
      namaProject: 'Project B',
      namaPemohon: 'Juna Saputra',
      namaPenerima: 'Siti Nurhaliza',
      noRekening: '2345678901',
      tglPengajuanVoucher: '10-01-2025',
      tglPembayaranVoucher: '15-01-2025',
      tglExpired: '25-01-2025',
      tglLaporanExpense: '30-01-2025',
      nominal: 'Rp 25,000,000',
      keterangan: 'Tugas Luar Kota',
    },
    {
      no: 3,
      noVoucher: 'VCH003',
      noSO: 'SO003',
      noSOTurunan: 'SO003.12',
      namaProject: 'Inspeksi Rope Access',
      namaPemohon: 'Rizky Andrian',
      namaPenerima: 'Rudi Hermawan',
      noRekening: '3456789012',
      tglPengajuanVoucher: '12-02-2025',
      tglPembayaranVoucher: '17-02-2025',
      tglExpired: '27-02-2025',
      tglLaporanExpense: '04-03-2025',
      nominal: 'Rp 15,000,000',
      keterangan: 'Inspeksi Rope Access',
    },
    {
      no: 4,
      noVoucher: 'VCH004',
      noSO: 'SO004',
      noSOTurunan: 'SO004.8',
      namaProject: 'Project D',
      namaPemohon: 'Sari Indah',
      namaPenerima: 'Maya Sari',
      noRekening: '4567890123',
      tglPengajuanVoucher: '15-02-2025',
      tglPembayaranVoucher: '20-02-2025',
      tglExpired: '02-03-2025',
      tglLaporanExpense: '07-03-2025',
      nominal: 'Rp 30,000,000',
      keterangan: 'Tugas Luar Kota',
    },
    {
      no: 5,
      noVoucher: 'VCH005',
      noSO: 'SO005',
      noSOTurunan: 'SO005.15',
      namaProject: 'Project E',
      namaPemohon: 'Budi Santoso',
      namaPenerima: 'Budi Santoso',
      noRekening: '5678901234',
      tglPengajuanVoucher: '18-02-2025',
      tglPembayaranVoucher: '23-02-2025',
      tglExpired: '05-03-2025',
      tglLaporanExpense: '10-03-2025',
      nominal: 'Rp 18,000,000',
      keterangan: 'Tugas Luar Kota',
    },
    {
      no: 6,
      noVoucher: 'VCH006',
      noSO: 'SO006',
      noSOTurunan: 'SO006.3',
      namaProject: 'Project F',
      namaPemohon: 'Dewi Lestari',
      namaPenerima: 'PT. Supplier ABC',
      noRekening: '9876543210',
      tglPengajuanVoucher: '20-02-2025',
      tglPembayaranVoucher: '25-02-2025',
      tglExpired: '07-03-2025',
      tglLaporanExpense: '12-03-2025',
      nominal: 'Rp 22,000,000',
      keterangan: 'Tugas Luar Kota',
    },
  ];

  const [rows, setRows] = useState<VoucherEntry[]>(initialData);
  const [search, setSearch] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  // form modal state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<VoucherEntry | null>(null);
  const [form, setForm] = useState<VoucherEntry>({
    no: 0,
    noVoucher: '',
    noSO: '',
    noSOTurunan: '',
    namaProject: '',
    namaPemohon: '',
    namaPenerima: '',
    noRekening: '',
    tglPengajuanVoucher: '',
    tglPembayaranVoucher: '',
    tglExpired: '',
    tglLaporanExpense: '',
    nominal: '',
    keterangan: '',
  });

  // delete confirm state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VoucherEntry | null>(null);

  const filtered = useMemo(() => rows.filter(r =>
    r.noVoucher.toLowerCase().includes(search.toLowerCase()) ||
    r.noSO.toLowerCase().includes(search.toLowerCase()) ||
    r.noSOTurunan.toLowerCase().includes(search.toLowerCase()) ||
    r.namaProject.toLowerCase().includes(search.toLowerCase()) ||
    r.namaPemohon.toLowerCase().includes(search.toLowerCase())
  ), [rows, search]);

  const displayed = useMemo(() => {
    const n = parseInt(showEntries, 10);
    return filtered.slice(0, isNaN(n) ? filtered.length : n);
  }, [filtered, showEntries]);

  const openAdd = () => {
    setEditing(null);
    setForm({ no: 0, noVoucher: '', noSO: '', noSOTurunan: '', namaProject: '', namaPemohon: '', namaPenerima: '', noRekening: '', tglPengajuanVoucher: '', tglPembayaranVoucher: '', tglExpired: '', tglLaporanExpense: '', nominal: '', keterangan: '' });
    setShowForm(true);
  };

  const openEdit = (r: VoucherEntry) => {
    setEditing(r);
    setForm({ ...r });
    setShowForm(true);
  };

  const saveForm = () => {
    if (editing) {
      setRows(prev => prev.map(p => (p.no === editing.no ? { ...form, no: editing.no } as VoucherEntry : p)));
    } else {
      const nextNo = rows.length > 0 ? Math.max(...rows.map(r => r.no)) + 1 : 1;
      setRows(prev => [{ ...form, no: nextNo }, ...prev]);
    }
    setShowForm(false);
  };

  const askDelete = (r: VoucherEntry) => { setDeleteTarget(r); setShowDelete(true); };
  const confirmDelete = () => { if (deleteTarget) setRows(prev => prev.filter(p => p.no !== deleteTarget.no)); setShowDelete(false); setDeleteTarget(null); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Voucher</h1>
        <p className="text-sm text-gray-500 mb-8">Kelola data Voucher (tambah, edit, hapus)</p>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Cari No Voucher */}
            <div>
              <label htmlFor="noVoucher" className="block text-sm font-medium text-gray-700 mb-2">Cari No Voucher</label>
              <div className="relative">
                <input
                  type="text"
                  id="noVoucher"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                  placeholder="VCH001"
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Cari No SO */}
            <div>
              <label htmlFor="noSO" className="block text-sm font-medium text-gray-700 mb-2">Cari No SO</label>
              <div className="relative">
                <input
                  type="text"
                  id="noSO"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                  placeholder="SO001"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Cari No SO Turunan */}
            <div>
              <label htmlFor="noSOTurunan" className="block text-sm font-medium text-gray-700 mb-2">Cari No SO Turunan</label>
              <div className="relative">
                <input
                  type="text"
                  id="noSOTurunan"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                  placeholder="SO001.12"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Cari Nama Project */}
            <div>
              <label htmlFor="namaProject" className="block text-sm font-medium text-gray-700 mb-2">Cari Nama Project</label>
              <div className="relative">
                <input
                  type="text"
                  id="namaProject"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                  placeholder="Proyek Medco"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Cari Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Cari Status</label>
              <select
                id="status"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              >
                <option>--Pilih Status--</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          {/* Periode and Search Button */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="periodeStart" className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                <div className="relative">
                  <input
                    type="text"
                    id="periodeStart"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                    placeholder="03/03/2025"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm md:mt-8">s.d</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="periodeEnd"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                    placeholder="03/03/2025"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-500 text-white font-medium rounded-xl shadow-md hover:bg-blue-600 transition-colors duration-300 w-full md:w-auto">
              Search
            </button>
          </div>
        </div>

        {/* Actions / Export */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={openAdd} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-300">
            <Plus className="h-4 w-4 mr-2"/> Tambah
          </button>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-xl shadow-md hover:bg-green-700 transition-colors duration-300">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-300">
              <FileText className="h-4 w-4 mr-2" /> Export CSV
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-xl shadow-md hover:bg-red-700 transition-colors duration-300">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        {/* Voucher Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <span>Show</span>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-gray-50">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">No <span className="text-blue-500">↑</span></th>
                  <th className="px-4 py-3 text-left">No Voucher</th>
                  <th className="px-4 py-3 text-left">No SO</th>
                  <th className="px-4 py-3 text-left">No SO Turunan</th>
                  <th className="px-4 py-3 text-left">Nama Project</th>
                  <th className="px-4 py-3 text-left">Nama Pemohon</th>
                  <th className="px-4 py-3 text-left">Tgl Pengajuan Voucher</th>
                  <th className="px-4 py-3 text-left">Tgl Pembayaran Voucher</th>
                  <th className="px-4 py-3 text-left">Tgl Expired</th>
                  <th className="px-4 py-3 text-left">Tgl Laporan Expense</th>
                  <th className="px-4 py-3 text-left">Nominal</th>
                  <th className="px-4 py-3 text-left">Keterangan</th>
                  <th className="px-4 py-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((entry) => (
                  <tr key={entry.no} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.no}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.noVoucher}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.noSO}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.noSOTurunan}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.namaProject}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.namaPemohon}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.tglPengajuanVoucher}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.tglPembayaranVoucher}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.tglExpired}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.tglLaporanExpense}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.nominal}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.keterangan}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>openEdit(entry)} className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white"><Edit className="h-4 w-4 mr-1"/>Edit</button>
                        <button onClick={()=>askDelete(entry)} className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><Trash2 className="h-4 w-4 mr-1"/>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayed.length===0 && (
                  <tr>
                    <td colSpan={13} className="px-6 py-8 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>Show</span>
              <select value={showEntries} onChange={(e)=>setShowEntries(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-gray-50">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>entries</span>
            </div>
            <span>Showing 1 to {displayed.length} of {filtered.length} entries</span>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-200">Previous</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-200">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={()=>setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">{editing ? 'Edit Voucher' : 'Tambah Voucher'}</h3>
              <button onClick={()=>setShowForm(false)} className="p-1 rounded hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No Voucher</label>
                  <input value={form.noVoucher} onChange={(e)=>setForm(f=>({ ...f, noVoucher: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No SO</label>
                  <input value={form.noSO} onChange={(e)=>setForm(f=>({ ...f, noSO: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No SO Turunan</label>
                  <input value={form.noSOTurunan} onChange={(e)=>setForm(f=>({ ...f, noSOTurunan: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Project</label>
                  <input value={form.namaProject} onChange={(e)=>setForm(f=>({ ...f, namaProject: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemohon</label>
                  <input value={form.namaPemohon} onChange={(e)=>setForm(f=>({ ...f, namaPemohon: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Pengajuan</label>
                    <input type="date" value={form.tglPengajuanVoucher} onChange={(e)=>setForm(f=>({ ...f, tglPengajuanVoucher: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Pembayaran</label>
                    <input type="date" value={form.tglPembayaranVoucher} onChange={(e)=>setForm(f=>({ ...f, tglPembayaranVoucher: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Expired</label>
                    <input type="date" value={form.tglExpired} onChange={(e)=>setForm(f=>({ ...f, tglExpired: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Laporan Expense</label>
                    <input type="date" value={form.tglLaporanExpense} onChange={(e)=>setForm(f=>({ ...f, tglLaporanExpense: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nominal</label>
                  <input value={form.nominal} onChange={(e)=>setForm(f=>({ ...f, nominal: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea value={form.keterangan} onChange={(e)=>setForm(f=>({ ...f, keterangan: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 min-h-[90px]" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button onClick={()=>setShowForm(false)} className="px-4 py-2 rounded-md text-sm border hover:bg-gray-50">Batal</button>
              <button onClick={saveForm} className="px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmDeleteModal
        isOpen={showDelete}
        onClose={()=>setShowDelete(false)}
        onConfirm={confirmDelete}
        itemName={deleteTarget ? deleteTarget.noVoucher : ''}
      />
    </div>
  );
};

export default GeneralVoucherDashboard;
