import React, { useMemo, useState } from "react";
import { Search, Download, Clock } from "lucide-react";

interface RekonMasukanItem {
  id: string;
  tanggal: string; // yyyy-mm-dd
  noFaktur: string;
  npwp: string;
  nama: string;
  dpp: number;
  ppn: number;
  keterangan?: string;
}

const seed: RekonMasukanItem[] = [
  { id: "rm-001", tanggal: "2025-09-01", noFaktur: "010.001-22.12345678", npwp: "01.234.567.8-901.000", nama: "PT Sumber Makmur", dpp: 100_000_000, ppn: 10_000_000, keterangan: "Invoice 123" },
  { id: "rm-002", tanggal: "2025-09-05", noFaktur: "010.001-22.87654321", npwp: "02.345.678.9-012.000", nama: "CV Elektronik Jaya", dpp: 35_000_000, ppn: 3_500_000 },
];

const FinancePajakRekonsiliasiMasukanDashboard: React.FC = () => {
  const [q, setQ] = useState("");
  const [show, setShow] = useState("10");
  const [rows] = useState<RekonMasukanItem[]>(seed);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return rows.filter(r =>
      r.noFaktur.toLowerCase().includes(qq) ||
      r.npwp.toLowerCase().includes(qq) ||
      r.nama.toLowerCase().includes(qq)
    );
  }, [rows, q]);

  const pageSize = Number(show);
  const pageData = filtered.slice(0, pageSize);
  const total = filtered.length;

  const sum = (key: keyof RekonMasukanItem) => pageData.reduce((s, r) => s + (Number(r[key]) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide">Laporan Pajak Rekonsiliasi Masukan</h1>
            <div className="text-xs text-gray-600">Finance › Pajak › Rekonsiliasi Masukan</div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center justify-between">
          <div className="space-x-2">
            <button className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700"><Download className="h-4 w-4 mr-1"/>Export</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Cari No Faktur / NPWP / Nama" className="w-80 pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400"/>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-700">Show</span>
              <select value={show} onChange={(e)=>setShow(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-gray-700">entries</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left">No</th>
                  <th className="px-3 py-2 text-left">Tanggal</th>
                  <th className="px-3 py-2 text-left">No Faktur</th>
                  <th className="px-3 py-2 text-left">NPWP</th>
                  <th className="px-3 py-2 text-left">Nama</th>
                  <th className="px-3 py-2 text-right">DPP</th>
                  <th className="px-3 py-2 text-right">PPN</th>
                  <th className="px-3 py-2 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageData.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{idx+1}</td>
                    <td className="px-3 py-2">{new Date(r.tanggal).toLocaleDateString("id-ID")}</td>
                    <td className="px-3 py-2">{r.noFaktur}</td>
                    <td className="px-3 py-2">{r.npwp}</td>
                    <td className="px-3 py-2">{r.nama}</td>
                    <td className="px-3 py-2 text-right">Rp {r.dpp.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2 text-right">Rp {r.ppn.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2">{r.keterangan||'-'}</td>
                  </tr>
                ))}
                {pageData.length===0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-8 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-3 py-2" colSpan={5}>Total</td>
                  <td className="px-3 py-2 text-right">Rp {sum('dpp').toLocaleString('id-ID')}</td>
                  <td className="px-3 py-2 text-right">Rp {sum('ppn').toLocaleString('id-ID')}</td>
                  <td className="px-3 py-2" />
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-sm text-gray-700">
            Showing 1 to {Math.min(pageSize, total)} of {total} entries
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePajakRekonsiliasiMasukanDashboard;
