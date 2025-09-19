import React, { useState } from 'react';
import { Clock, Scale, Search, Filter, FileText, FileSpreadsheet, FileDown, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from './Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface NeracaEntry {
  id: string;
  periode: string; // yyyy-mm
  akun: string; // kode akun
  namaAkun: string;
  mu: string;
  debitMu: number;
  kreditMu: number;
  debit: number; // Debet (Rp.)
  kredit: number; // Kredit (Rp.)
  keterangan: string;
}

const NeracaDashboard: React.FC = () => {
  const today = new Date();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('Juli 2025'); // Default filter

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NeracaEntry>({
    id: "",
    periode: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
    akun: "",
    namaAkun: "",
    mu: "IDR",
    debitMu: 0,
    kreditMu: 0,
    debit: 0,
    kredit: 0,
    keterangan: "",
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NeracaEntry | null>(null);
  const [neracaData, setNeracaData] = useState<NeracaEntry[]>([
    { id: "1", periode: "2025-07", akun: "11100000", namaAkun: "KAS", mu: "IDR", debitMu: 42370, kreditMu: 0, debit: 42370393, kredit: 0, keterangan: "Kas perusahaan" },
    { id: "2", periode: "2025-07", akun: "112001000", namaAkun: "BNI - REK.5520140008", mu: "IDR", debitMu: 21570197, kreditMu: 0, debit: 21570196765, kredit: 0, keterangan: "Rekening bank BNI" },
  ]);

  // Helper function to format numbers as per ID-ID locale (e.g., 123.456.789)
  const formatNumber = (num: number) => {
    // Handle negative numbers by wrapping them in parentheses and formatting
    if (num < 0) {
      return `(${new Intl.NumberFormat('id-ID').format(Math.abs(num))})`;
    }
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Dummy Data for Neraca, structured to match the image
  const data = [
    { id: 1, no: '1', account: '10000000', keterangan: 'ASET', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, isBold: true },
    { id: 2, no: '', account: '11000000', keterangan: 'ASET LANCAR', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 1, isBold: true },
    { id: 3, no: '', account: '11100000', keterangan: 'KAS', saldoAwal: 42370393, mutasiDebet: 200000000, mutasiKredit: -181240506, saldoMutasi: 18759494, saldoAkhir: 61129887, level: 2 },
    { id: 4, no: '', account: '11200000', keterangan: 'BANK', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 2, isBold: true },
    { id: 5, no: '', account: '112001000', keterangan: 'BNI - REK.5520140008', saldoAwal: 21570196765, mutasiDebet: 75459463520, mutasiKredit: -79948800392, saldoMutasi: -4489336872, saldoAkhir: 17080859893, level: 3 },
    { id: 6, no: '', account: '112002000', keterangan: 'BRI - REK.0026-01-001159-30-3', saldoAwal: 608824922, mutasiDebet: 400332, mutasiKredit: -200000, saldoMutasi: 200332, saldoAkhir: 609025254, level: 3 },
    { id: 7, no: '', account: '112003000', keterangan: 'BANK MANDIRI (GIRO) - REK.140-00-1417676-3', saldoAwal: 4462883013, mutasiDebet: 37619318996, mutasiKredit: -36775748152, saldoMutasi: 843570844, saldoAkhir: 5306453857, level: 3 },
    { id: 8, no: '', account: '112004000', keterangan: 'BANK MANDIRI (ESCROW) - 178-000-666-6222', saldoAwal: 2228092353, mutasiDebet: 43679451347, mutasiKredit: -38334134704, saldoMutasi: 5345316643, saldoAkhir: 7573408996, level: 3 },
    { id: 9, no: '', account: '112005000', keterangan: 'MANDIRI ESCROW 1780004013153', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 3 },
    { id: 10, no: '', account: '112006000', keterangan: 'BNI ESCROW-REK.414213679', saldoAwal: 6749607768, mutasiDebet: 23901575930, mutasiKredit: -24311070288, saldoMutasi: -409494358, saldoAkhir: 6340113410, level: 3 },
    { id: 11, no: '', account: '112007000', keterangan: 'BANK SYARIAH MANDIRI', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 3 },
    // Add more dummy data to fill out the table as needed, following the pattern
    { id: 12, no: '', account: '112008000', keterangan: 'BANK PERMATA', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 3 },
    { id: 13, no: '', account: '112009000', keterangan: 'BANK BCA', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 3 },
    { id: 14, no: '', account: '11300000', keterangan: 'PIUTANG USAHA', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 2, isBold: true },
    { id: 15, no: '', account: '113001000', keterangan: 'PIUTANG USAHA - PIHAK KE 3', saldoAwal: 15000000000, mutasiDebet: 5000000000, mutasiKredit: -2000000000, saldoMutasi: 3000000000, saldoAkhir: 18000000000, level: 3 },
    { id: 16, no: '', account: '11400000', keterangan: 'PERSEDIAAN', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 2, isBold: true },
    { id: 17, no: '', account: '114001000', keterangan: 'PERSEDIAAN BARANG DAGANG', saldoAwal: 5000000000, mutasiDebet: 1000000000, mutasiKredit: -500000000, saldoMutasi: 500000000, saldoAkhir: 5500000000, level: 3 },
    { id: 18, no: '', account: '20000000', keterangan: 'KEWAJIBAN', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, isBold: true },
    { id: 19, no: '', account: '21000000', keterangan: 'KEWAJIBAN JANGKA PENDEK', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 1, isBold: true },
    { id: 20, no: '', account: '21100000', keterangan: 'HUTANG USAHA', saldoAwal: -10000000000, mutasiDebet: 3000000000, mutasiKredit: -5000000000, saldoMutasi: -2000000000, saldoAkhir: -12000000000, level: 2 },
    { id: 21, no: '', account: '30000000', keterangan: 'EKUITAS', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, isBold: true },
    { id: 22, no: '', account: '31000000', keterangan: 'MODAL SAHAM', saldoAwal: -10000000000, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: -10000000000, level: 1 },
    { id: 23, no: '', account: '32000000', keterangan: 'LABA DITAHAN', saldoAwal: -10000000000, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: -10000000000, level: 1 },
    { id: 24, no: '', account: '', keterangan: 'TOTAL', saldoAwal: -8019553176, mutasiDebet: 522619351391, mutasiKredit: -522619351391, saldoMutasi: 0, saldoAkhir: -8019553176, isTotal: true, isBold: true },
  ];

  // Filtered data based on search term (keterangan or account)
  const filteredData = [...data, ...neracaData].filter(item => {
    if ('keterangan' in item) {
      return item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ('account' in item ? item.account.toLowerCase().includes(searchTerm.toLowerCase()) : item.akun.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return false;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm({
      id: "",
      periode: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
      akun: "",
      namaAkun: "",
      mu: "IDR",
      debitMu: 0,
      kreditMu: 0,
      debit: 0,
      kredit: 0,
      keterangan: "",
    });
    setIsFormOpen(true);
  };

  const openEdit = (entry: NeracaEntry) => {
    setEditingId(entry.id);
    setForm({ ...entry });
    setIsFormOpen(true);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.akun || !form.namaAkun) {
      alert("Kode Akun dan Nama Akun wajib diisi");
      return;
    }

    if (editingId) {
      setNeracaData((prev) => prev.map((it) => (it.id === editingId ? { ...form, id: it.id } : it)));
    } else {
      setNeracaData((prev) => [{ ...form, id: `${Date.now()}` }, ...prev]);
    }
    setIsFormOpen(false);
  };

  const requestDelete = (entry: NeracaEntry) => {
    setItemToDelete(entry);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setNeracaData((prev) => prev.filter((d) => d.id !== itemToDelete.id));
      setItemToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  const handleExport = (type: 'excel' | 'csv' | 'pdf') => {
    alert(`Mengekspor data Neraca ke format ${type}... (Fungsionalitas ini adalah placeholder)`);
    // Di aplikasi nyata, Anda akan mengimplementasikan logika ekspor yang sebenarnya di sini.
    // Ini mungkin melibatkan:
    // 1. Memformat data untuk format yang dipilih.
    // 2. Menggunakan pustaka seperti 'xlsx' untuk Excel, 'papaparse' untuk CSV, atau 'jspdf' untuk PDF.
    // 3. Memicu unduhan file.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LAPORAN NERACA
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Neraca</span>
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
        {/* Action Bar: Search, Filter, Export */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari keterangan atau akun..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
            >
              <option value="Juli 2025">Juli 2025</option>
              <option value="Juni 2025">Juni 2025</option>
              <option value="Mei 2025">Mei 2025</option>
              {/* Tambahkan periode lain sesuai kebutuhan */}
            </select>
          </div>

          <div className="flex justify-between items-center w-full">
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah Baris
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => handleExport('excel')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-green-500 text-white hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FileText className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FileDown className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Neraca Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Kode Akun</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Nama Akun</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">MU</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Debet (MU)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Kredit (MU)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Debet (Rp.)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Kredit (Rp.)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Keterangan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Periode</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {neracaData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                      {row.akun}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {row.namaAkun}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {row.mu}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {row.debitMu.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {row.kreditMu.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      Rp {row.debit.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      Rp {row.kredit.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {row.keterangan}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {row.periode.split("-").reverse().join("/")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(row)}
                          className="px-2 py-1 text-xs rounded-md bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 inline-flex items-center gap-1"
                        >
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => requestDelete(row)}
                          className="px-2 py-1 text-xs rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Hapus
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

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? "Edit Baris Neraca" : "Tambah Baris Neraca"} size="xl">
        <form onSubmit={submitForm} className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left min-w-[120px]">Kode Akun</th>
                  <th className="px-3 py-2 text-left min-w-[150px]">Nama Akun</th>
                  <th className="px-3 py-2 text-left min-w-[80px]">MU</th>
                  <th className="px-3 py-2 text-right min-w-[100px]">Debet (MU)</th>
                  <th className="px-3 py-2 text-right min-w-[100px]">Kredit (MU)</th>
                  <th className="px-3 py-2 text-right min-w-[120px]">Debet (Rp.)</th>
                  <th className="px-3 py-2 text-right min-w-[120px]">Kredit (Rp.)</th>
                  <th className="px-3 py-2 text-left min-w-[150px]">Keterangan</th>
                  <th className="px-3 py-2 text-left min-w-[120px]">Periode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 min-w-[120px]"><input className="w-full border rounded-lg px-3 py-2" value={form.akun} onChange={(e)=>setForm(f=>({...f, akun: e.target.value}))} placeholder="11100000" /></td>
                  <td className="px-3 py-2 min-w-[150px]"><input className="w-full border rounded-lg px-3 py-2" value={form.namaAkun} onChange={(e)=>setForm(f=>({...f, namaAkun: e.target.value}))} placeholder="Nama Akun" /></td>
                  <td className="px-3 py-2 min-w-[80px]"><input className="w-full border rounded-lg px-3 py-2" value={form.mu} onChange={(e)=>setForm(f=>({...f, mu: e.target.value}))} placeholder="IDR" /></td>
                  <td className="px-3 py-2 min-w-[100px]"><input type="number" className="w-full border rounded-lg px-3 py-2 text-right" value={form.debitMu} onChange={(e)=>setForm(f=>({...f, debitMu: Number(e.target.value)}))} /></td>
                  <td className="px-3 py-2 min-w-[100px]"><input type="number" className="w-full border rounded-lg px-3 py-2 text-right" value={form.kreditMu} onChange={(e)=>setForm(f=>({...f, kreditMu: Number(e.target.value)}))} /></td>
                  <td className="px-3 py-2 min-w-[120px]"><input type="number" className="w-full border rounded-lg px-3 py-2 text-right" value={form.debit} onChange={(e)=>setForm(f=>({...f, debit: Number(e.target.value)}))} /></td>
                  <td className="px-3 py-2 min-w-[120px]"><input type="number" className="w-full border rounded-lg px-3 py-2 text-right" value={form.kredit} onChange={(e)=>setForm(f=>({...f, kredit: Number(e.target.value)}))} /></td>
                  <td className="px-3 py-2 min-w-[150px]"><input className="w-full border rounded-lg px-3 py-2" value={form.keterangan} onChange={(e)=>setForm(f=>({...f, keterangan: e.target.value}))} placeholder="Keterangan" /></td>
                  <td className="px-3 py-2 min-w-[120px]"><input type="month" className="w-full border rounded-lg px-3 py-2" value={form.periode} onChange={(e)=>setForm(f=>({...f, periode: e.target.value}))} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={`${itemToDelete?.akun} - ${itemToDelete?.namaAkun}`}
      />
    </div>
  );
};

export default NeracaDashboard;
