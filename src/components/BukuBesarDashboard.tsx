import React, { useMemo, useState } from "react";
import { Clock, Search, FileSpreadsheet, FileDown, Plus, Edit, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "./Modal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface LedgerRow {
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

const seed: LedgerRow[] = [
  { id: "1", periode: "2025-09", akun: "1101", namaAkun: "Kas", mu: "IDR", debitMu: 5000, kreditMu: 0, debit: 5_000_000, kredit: 0, keterangan: "Setoran awal" },
  { id: "2", periode: "2025-09", akun: "1101", namaAkun: "Kas", mu: "IDR", debitMu: 0, kreditMu: 750, debit: 0, kredit: 750_000, keterangan: "Pembelian ATK" },
  { id: "3", periode: "2025-09", akun: "1101", namaAkun: "Kas", mu: "IDR", debitMu: 2250, kreditMu: 0, debit: 2_250_000, kredit: 0, keterangan: "Pelunasan invoice" },
];

const BukuBesarDashboard: React.FC = () => {
  const today = new Date();
  const [data, setData] = useState<LedgerRow[]>(seed);

  // Filters
  const [q, setQ] = useState("");
  const [coa, setCoa] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LedgerRow>({
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
  const [itemToDelete, setItemToDelete] = useState<LedgerRow | null>(null);

  const coas = useMemo(() => {
    return Array.from(new Set(data.map(d => `${d.akun} - ${d.namaAkun}`)));
  }, [data]);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return data.filter(d => {
      const matchesText =
        d.akun.toLowerCase().includes(qq) ||
        d.namaAkun.toLowerCase().includes(qq) ||
        d.keterangan.toLowerCase().includes(qq);
      const matchesCoa = coa ? `${d.akun} - ${d.namaAkun}` === coa : true;
      return matchesText && matchesCoa;
    })
    .sort((a,b) => a.periode.localeCompare(b.periode));
  }, [data, q, coa]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Running saldo based on filtered rows and by COA
  const withSaldo = useMemo(() => {
    let saldo = 0;
    return paged.map(r => {
      saldo += r.debit - r.kredit;
      return { ...r, saldo } as LedgerRow & { saldo: number };
    });
  }, [paged]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const goPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

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

  const openEdit = (entry: LedgerRow) => {
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
      setData((prev) => prev.map((it) => (it.id === editingId ? { ...form, id: it.id } : it)));
    } else {
      setData((prev) => [{ ...form, id: `${Date.now()}` }, ...prev]);
    }
    setIsFormOpen(false);
  };

  const requestDelete = (entry: LedgerRow) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-wide mb-1">BUKU BESAR</h1>
              <nav className="text-sm text-gray-600">Accounting › Buku Besar</nav>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari COA/No/Dokumen/Keterangan/SO" className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">COA</label>
              <select value={coa} onChange={e=>{ setCoa(e.target.value); setPage(1); }} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option value="">Semua COA</option>
                {coas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Tanggal Dari</label>
              <DatePicker selected={startDate} onChange={setStartDate} dateFormat="dd/MM/yyyy" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholderText="dd/MM/yyyy"/>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Tanggal Sampai</label>
              <DatePicker selected={endDate} onChange={setEndDate} dateFormat="dd/MM/yyyy" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholderText="dd/MM/yyyy"/>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah Baris
            </button>
            <div className="flex gap-2">
              <button className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-emerald-600 hover:bg-emerald-700"><FileSpreadsheet className="h-4 w-4 mr-2"/>Export Excel</button>
              <button className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-rose-600 hover:bg-rose-700"><FileDown className="h-4 w-4 mr-2"/>Export PDF</button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-6">
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
                {withSaldo.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{r.akun}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.namaAkun}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.mu}</td>
                    <td className="px-6 py-3 text-sm text-right text-gray-900">{r.debitMu.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-3 text-sm text-right text-gray-900">{r.kreditMu.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-3 text-sm text-right text-gray-900">Rp {r.debit.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-3 text-sm text-right text-gray-900">Rp {r.kredit.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.keterangan}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.periode.split("-").reverse().join("/")}</td>
                    <td className="px-6 py-3 text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(r)}
                          className="px-2 py-1 text-xs rounded-md bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 inline-flex items-center gap-1"
                        >
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => requestDelete(r)}
                          className="px-2 py-1 text-xs rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {withSaldo.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-sm text-gray-500">Tidak ada data untuk filter saat ini</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">Total: {filtered.length} baris</div>
            <div className="flex items-center gap-2">
              <select value={pageSize} onChange={e=>{ setPageSize(Number(e.target.value)); setPage(1); }} className="px-2 py-1 text-sm border rounded-md">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <div className="flex items-center gap-1">
                <button onClick={()=>goPage(1)} className="px-2 py-1 text-sm border rounded-md disabled:opacity-50" disabled={page===1}>{"<<"}</button>
                <button onClick={()=>goPage(page-1)} className="px-2 py-1 text-sm border rounded-md disabled:opacity-50" disabled={page===1}>{"<"}</button>
                <span className="px-2 text-sm">{page} / {totalPages}</span>
                <button onClick={()=>goPage(page+1)} className="px-2 py-1 text-sm border rounded-md disabled:opacity-50" disabled={page===totalPages}>{">"}</button>
                <button onClick={()=>goPage(totalPages)} className="px-2 py-1 text-sm border rounded-md disabled:opacity-50" disabled={page===totalPages}>{">>"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? "Edit Baris Buku Besar" : "Tambah Baris Buku Besar"} size="xl">
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

export default BukuBesarDashboard;
