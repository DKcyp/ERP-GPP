import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock, Search, Download, Plus, Edit, Trash2 } from "lucide-react";
import Modal from "./Modal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface TBEntry {
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

const TrialBalanceDashboard: React.FC = () => {
  const today = new Date();

  const [data, setData] = useState<TBEntry[]>([
    { id: "TB-1", periode: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`, akun: "1101", namaAkun: "Kas", mu: "IDR", debitMu: 15000, kreditMu: 0, debit: 15000000, kredit: 0, keterangan: "Kas perusahaan" },
    { id: "TB-2", periode: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`, akun: "2101", namaAkun: "Hutang Usaha", mu: "IDR", debitMu: 0, kreditMu: 4500, debit: 0, kredit: 4500000, keterangan: "Hutang kepada supplier" },
  ]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [periodeFilter, setPeriodeFilter] = useState<Date | null>(null);
  const [showEntries, setShowEntries] = useState("10");

  const filteredData = useMemo(() => {
    return data.filter((it) => {
      const matchesSearch =
        it.akun.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.namaAkun.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPeriode = !periodeFilter
        ? true
        : it.periode === `${periodeFilter.getFullYear()}-${String(periodeFilter.getMonth() + 1).padStart(2, "0")}`;
      return matchesSearch && matchesPeriode;
    });
  }, [data, searchQuery, periodeFilter]);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TBEntry>({
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
  const [itemToDelete, setItemToDelete] = useState<TBEntry | null>(null);

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

  const openEdit = (entry: TBEntry) => {
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
    if (form.debit < 0 || form.kredit < 0) {
      alert("Debit/Kredit tidak boleh negatif");
      return;
    }
    // Typically, for TB, one line may be debit or credit. We allow both but it's fine for demo.

    if (editingId) {
      setData((prev) => prev.map((it) => (it.id === editingId ? { ...form, id: it.id } : it)));
    } else {
      setData((prev) => [{ ...form, id: `${Date.now()}` }, ...prev]);
    }
    setIsFormOpen(false);
  };

  const requestDelete = (entry: TBEntry) => {
    setItemToDelete(entry);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData((prev) => prev.filter((d) => d.id !== itemToDelete.id));
      setItemToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  const handleExport = (type: string) => {
    alert(`Export ${type}`);
  };

  const total = filteredData.length;
  const pageSize = Number(showEntries);
  const pageData = filteredData.slice(0, pageSize);

  const totalDebit = filteredData.reduce((s, d) => s + d.debit, 0);
  const totalKredit = filteredData.reduce((s, d) => s + d.kredit, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">TRIAL BALANCE</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Trial Balance</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters + actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Akun</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Cari kode/nama akun..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
              <DatePicker
                selected={periodeFilter}
                onChange={(date) => setPeriodeFilter(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="mm/yyyy"
                className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah Baris
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => handleExport("Excel")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> Excel
              </button>
              <button
                onClick={() => handleExport("CSV")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> CSV
              </button>
              <button
                onClick={() => handleExport("PDF")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Table controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Akun</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Akun</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MU</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debet (MU)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Kredit (MU)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debet (Rp.)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Kredit (Rp.)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageData.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.akun}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.namaAkun}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.mu}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{entry.debitMu.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{entry.kreditMu.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Rp {entry.debit.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Rp {entry.kredit.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {entry.periode.split("-").reverse().join("/")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(entry)}
                          className="px-2 py-1 text-xs rounded-md bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 inline-flex items-center gap-1"
                        >
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => requestDelete(entry)}
                          className="px-2 py-1 text-xs rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-3 text-sm text-gray-900" colSpan={5}>Total</td>
                  <td className="px-6 py-3 text-sm text-right text-gray-900">Rp {totalDebit.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-3 text-sm text-right text-gray-900">Rp {totalKredit.toLocaleString("id-ID")}</td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-sm text-gray-700">
            Showing 1 to {Math.min(pageSize, total)} of {total} entries
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? "Edit Baris TB" : "Tambah Baris TB"} size="xl">
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
                  <td className="px-3 py-2 min-w-[120px]"><input className="w-full border rounded-lg px-3 py-2" value={form.akun} onChange={(e)=>setForm(f=>({...f, akun: e.target.value}))} placeholder="1101" /></td>
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

export default TrialBalanceDashboard;
