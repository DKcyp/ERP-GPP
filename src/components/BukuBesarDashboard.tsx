import React, { useMemo, useState } from "react";
import { Clock, Search, FileSpreadsheet, FileDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface LedgerRow {
  id: string;
  tanggal: string; // yyyy-mm-dd
  coa: string; // e.g. 1101 - Kas
  no: string; // nomor transaksi
  dokumen: string; // referensi dokumen
  keterangan: string;
  so?: string; // Sales Order optional
  debit: number;
  kredit: number;
}

const seed: LedgerRow[] = [
  { id: "1", tanggal: "2025-09-01", coa: "1101 - Kas", no: "KM-0001", dokumen: "Kwitansi", keterangan: "Setoran awal", so: "SO-001", debit: 5_000_000, kredit: 0 },
  { id: "2", tanggal: "2025-09-02", coa: "1101 - Kas", no: "KK-0002", dokumen: "Voucher", keterangan: "Pembelian ATK", so: "", debit: 0, kredit: 750_000 },
  { id: "3", tanggal: "2025-09-03", coa: "1101 - Kas", no: "KM-0003", dokumen: "Kwitansi", keterangan: "Pelunasan invoice", so: "SO-002", debit: 2_250_000, kredit: 0 },
];

const BukuBesarDashboard: React.FC = () => {
  const today = new Date();
  const [data] = useState<LedgerRow[]>(seed);

  // Filters
  const [q, setQ] = useState("");
  const [coa, setCoa] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const coas = useMemo(() => {
    return Array.from(new Set(data.map(d => d.coa)));
  }, [data]);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return data.filter(d => {
      const matchesText =
        d.coa.toLowerCase().includes(qq) ||
        d.no.toLowerCase().includes(qq) ||
        d.dokumen.toLowerCase().includes(qq) ||
        d.keterangan.toLowerCase().includes(qq) ||
        (d.so || "").toLowerCase().includes(qq);
      const matchesCoa = coa ? d.coa === coa : true;
      const dt = new Date(d.tanggal);
      const matchesStart = startDate ? dt >= startDate : true;
      const matchesEnd = endDate ? dt <= endDate : true;
      return matchesText && matchesCoa && matchesStart && matchesEnd;
    })
    .sort((a,b) => a.tanggal.localeCompare(b.tanggal));
  }, [data, q, coa, startDate, endDate]);

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
          <div className="flex justify-end gap-2 mt-4">
            <button className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-emerald-600 hover:bg-emerald-700"><FileSpreadsheet className="h-4 w-4 mr-2"/>Export Excel</button>
            <button className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-rose-600 hover:bg-rose-700"><FileDown className="h-4 w-4 mr-2"/>Export PDF</button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SO</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debet</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Kredit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withSaldo.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{new Date(r.tanggal).toLocaleDateString("id-ID")}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.coa}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.no}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.dokumen}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.keterangan}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.so || '-'}</td>
                    <td className="px-6 py-3 text-sm text-right text-gray-900">{r.debit > 0 ? `Rp ${r.debit.toLocaleString("id-ID")}` : '-'}</td>
                    <td className="px-6 py-3 text-sm text-right text-gray-900">{r.kredit > 0 ? `Rp ${r.kredit.toLocaleString("id-ID")}` : '-'}</td>
                    <td className="px-6 py-3 text-sm text-right font-semibold text-gray-900">Rp {r.saldo.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
                {withSaldo.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-sm text-gray-500">Tidak ada data untuk filter saat ini</td>
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
    </div>
  );
};

export default BukuBesarDashboard;
