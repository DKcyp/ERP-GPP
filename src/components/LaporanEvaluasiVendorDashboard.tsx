import React, { useEffect, useMemo, useState } from "react";
import { FileSpreadsheet, File, FileText, Search, Check, X, ArrowUp } from "lucide-react";

export type LaporanEvaluasiRow = {
  id: string;
  no: number;
  noPO: string;
  noPR: string;
  vendor: string;
  statusPO: boolean; // true: V, false: X
  statusPR: boolean;
  statusKedatangan: boolean;
  statusInvoice: boolean;
  statusPelunasan: boolean;
  nominal: number;
};

const sampleRows: LaporanEvaluasiRow[] = [
  {
    id: "1",
    no: 1,
    noPO: "PO-0001",
    noPR: "PR-0007",
    vendor: "PT Maju Jaya",
    statusPO: true,
    statusPR: true,
    statusKedatangan: true,
    statusInvoice: true,
    statusPelunasan: false,
    nominal: 16650000,
  },
  {
    id: "2",
    no: 2,
    noPO: "PO-0002",
    noPR: "PR-0011",
    vendor: "CV Sinar Abadi",
    statusPO: true,
    statusPR: true,
    statusKedatangan: false,
    statusInvoice: false,
    statusPelunasan: false,
    nominal: 3450000,
  },
];

const LaporanEvaluasiVendorDashboard: React.FC = () => {
  const [data] = useState<LaporanEvaluasiRow[]>(sampleRows);
  const [search, setSearch] = useState("");
  const [animateRows, setAnimateRows] = useState(false);
  const [sortField, setSortField] = useState<keyof LaporanEvaluasiRow | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 120);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((d) => [d.noPO, d.noPR, d.vendor].join(" ").toLowerCase().includes(q));
  }, [data, search]);

  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sortField] as any;
      const bv = b[sortField] as any;
      if (av === bv) return 0;
      if (sortDirection === "asc") return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });
    return copy;
  }, [filtered, sortField, sortDirection]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const pageData = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: keyof LaporanEvaluasiRow) => {
    if (sortField === field) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const ThSort: React.FC<{ field: keyof LaporanEvaluasiRow; title: string; className?: string }>
    = ({ field, title, className }) => (
    <th
      className={`px-3 py-2 text-left text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 ${className ?? ""}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{title}</span>
        {sortField === field && (
          <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
        )}
      </div>
    </th>
  );

  const BoolIcon: React.FC<{ v: boolean }>= ({ v }) => (
    <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full ${v ? "bg-green-100" : "bg-red-100"}`}>
      {v ? <Check className="h-3.5 w-3.5 text-green-700" /> : <X className="h-3.5 w-3.5 text-red-700" />}
    </span>
  );

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-gray-50 text-xs">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">LAPORAN EVALUASI VENDOR</h1>
          </div>

          {/* Search and Export */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cari (No PO / No PR / Vendor)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="Ketik kata kunci"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1">
                <File className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <ThSort field="no" title="No" />
                  <ThSort field="noPO" title="No PO" />
                  <ThSort field="noPR" title="No PR" />
                  <ThSort field="vendor" title="Vendor" />
                  <ThSort field="statusPO" title="PO" />
                  <ThSort field="statusPR" title="PR" />
                  <ThSort field="statusKedatangan" title="Kedatangan" />
                  <ThSort field="statusInvoice" title="Invoice" />
                  <ThSort field="statusPelunasan" title="Pelunasan" />
                  <ThSort field="nominal" title="Nominal" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pageData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"} ${
                      animateRows ? "animate-in fade-in slide-in-from-bottom-2" : "opacity-0"
                    }`}
                    style={{ animationDelay: animateRows ? `${index * 80}ms` : "0ms", animationFillMode: "forwards" }}
                  >
                    <td className="px-3 py-2 text-xs text-gray-900">{row.no}</td>
                    <td className="px-3 py-2 text-xs">{row.noPO}</td>
                    <td className="px-3 py-2 text-xs">{row.noPR}</td>
                    <td className="px-3 py-2 text-xs">{row.vendor}</td>
                    <td className="px-3 py-2 text-xs"><BoolIcon v={row.statusPO} /></td>
                    <td className="px-3 py-2 text-xs"><BoolIcon v={row.statusPR} /></td>
                    <td className="px-3 py-2 text-xs"><BoolIcon v={row.statusKedatangan} /></td>
                    <td className="px-3 py-2 text-xs"><BoolIcon v={row.statusInvoice} /></td>
                    <td className="px-3 py-2 text-xs"><BoolIcon v={row.statusPelunasan} /></td>
                    <td className="px-3 py-2 text-xs font-medium text-gray-800">{formatRupiah(row.nominal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
              <div className="text-xs text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sorted.length)} of {sorted.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    currentPage === 1 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanEvaluasiVendorDashboard;
