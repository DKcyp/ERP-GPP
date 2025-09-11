import React, { useEffect, useMemo, useState } from "react";
import { Plus, FileSpreadsheet, File, FileText, Edit, Trash2, ArrowUp, Search } from "lucide-react";
import TrackingDokumenFormModal, { TrackingDokumenData } from "./TrackingDokumenFormModal";

const sampleData: TrackingDokumenData[] = [
  {
    id: "1",
    no: 1,
    tglPembuatanPR: "2025-03-01",
    noPR: "PR-0001",
    tglPenerimaanPR: "2025-03-02",
    namaSupplier: "PT Maju Jaya",
    tglPO: "2025-03-04",
    noPO: "PO-0001",
    noSO: "SO-0009",
    nilaiDPP: "15000000",
    nilaiPPN: "1650000",
    subTotal: "16650000",
    noInvoice: "INV-001/III/2025",
    tglInvoice: "2025-03-06",
    noFakturPajak: "010.001-23.12345678",
    tglFakturPajak: "2025-03-06",
    tglTerimaBarang: "2025-03-07",
    noLPB: "LPB-0001",
    tglTerimaKeuangan: "2025-03-08",
    tglPengajuanDana: "2025-03-09",
    tglBayar: "2025-03-10",
    noBuktiBayar: "BB-0001",
    status: "Ontime",
  },
];

const TrackingDokumenMonitoringDashboard: React.FC = () => {
  const [data, setData] = useState<TrackingDokumenData[]>(sampleData);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<TrackingDokumenData | null>(null);
  const [animateRows, setAnimateRows] = useState(false);
  const [sortField, setSortField] = useState<keyof TrackingDokumenData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((d) =>
      [
        d.noPR,
        d.namaSupplier,
        d.noPO,
        d.noSO,
        d.noInvoice,
        d.noFakturPajak,
        d.noLPB,
        d.noBuktiBayar,
        d.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = (a[sortField] as any) ?? "";
      const bv = (b[sortField] as any) ?? "";
      if (av === bv) return 0;
      if (sortDirection === "asc") return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });
    return copy;
  }, [filtered, sortField, sortDirection]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const pageData = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestAdd = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const requestEdit = (row: TrackingDokumenData) => {
    setEditing(row);
    setIsOpen(true);
  };

  const requestDelete = (row: TrackingDokumenData) => {
    if (confirm(`Hapus data ${row.noPR} - ${row.noPO}?`)) {
      setData((prev) => prev.filter((x) => x.id !== row.id));
    }
  };

  const handleSave = (payload: Omit<TrackingDokumenData, "id" | "no">) => {
    if (editing) {
      setData((prev) => prev.map((x) => (x.id === editing.id ? { ...editing, ...payload } : x)));
    } else {
      setData((prev) => [
        {
          id: (Date.now()).toString(),
          no: prev.length + 1,
          ...payload,
        },
        ...prev.map((r) => ({ ...r, no: r.no + 1 })),
      ]);
    }
    setIsOpen(false);
    setEditing(null);
  };

  const handleSort = (field: keyof TrackingDokumenData) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const ThSort: React.FC<{ field: keyof TrackingDokumenData; title: string }> = ({ field, title }) => (
    <th
      className="px-3 py-2 text-left text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
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

  return (
    <div className="min-h-screen bg-gray-50 text-xs">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">TRACKING DOKUMEN - MONITORING</h1>
            <button
              onClick={requestAdd}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cari (PR/PO/Supplier/Invoice)</label>
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

            {/* Export Buttons */}
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
                  <ThSort field="tglPembuatanPR" title="Tgl Pembuatan PR" />
                  <ThSort field="noPR" title="No.PR" />
                  <ThSort field="tglPenerimaanPR" title="Tgl Penerimaan PR" />
                  <ThSort field="namaSupplier" title="Nama Supplier/Vendor" />
                  <ThSort field="tglPO" title="Tgl PO" />
                  <ThSort field="noPO" title="No. PO (PO Jasa / Barang)" />
                  <ThSort field="noSO" title="No.SO" />
                  <ThSort field="nilaiDPP" title="Nilai DPP" />
                  <ThSort field="nilaiPPN" title="Nilai PPN" />
                  <ThSort field="subTotal" title="SubTotal" />
                  <ThSort field="noInvoice" title="No.Invoice" />
                  <ThSort field="tglInvoice" title="Tgl Invoice" />
                  <ThSort field="noFakturPajak" title="No Faktur Pajak" />
                  <ThSort field="tglFakturPajak" title="Tgl Faktur Pajak" />
                  <ThSort field="tglTerimaBarang" title="Tgl Terima Barang" />
                  <ThSort field="noLPB" title="No.LPB" />
                  <ThSort field="tglTerimaKeuangan" title="Tgl Terima Keuangan" />
                  <ThSort field="tglPengajuanDana" title="Tgl Pengajuan Dana" />
                  <ThSort field="tglBayar" title="Tgl Bayar" />
                  <ThSort field="noBuktiBayar" title="No.Bukti Bayar" />
                  <ThSort field="status" title="Status" />
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pageData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    } ${animateRows ? "animate-in fade-in slide-in-from-bottom-2" : "opacity-0"}`}
                    style={{
                      animationDelay: animateRows ? `${index * 80}ms` : "0ms",
                      animationFillMode: "forwards",
                    }}
                  >
                    <td className="px-3 py-2 text-xs text-gray-900">{row.no}</td>
                    <td className="px-3 py-2 text-xs">{row.tglPembuatanPR}</td>
                    <td className="px-3 py-2 text-xs">{row.noPR}</td>
                    <td className="px-3 py-2 text-xs">{row.tglPenerimaanPR}</td>
                    <td className="px-3 py-2 text-xs">{row.namaSupplier}</td>
                    <td className="px-3 py-2 text-xs">{row.tglPO}</td>
                    <td className="px-3 py-2 text-xs">{row.noPO}</td>
                    <td className="px-3 py-2 text-xs">{row.noSO}</td>
                    <td className="px-3 py-2 text-xs">{row.nilaiDPP}</td>
                    <td className="px-3 py-2 text-xs">{row.nilaiPPN}</td>
                    <td className="px-3 py-2 text-xs">{row.subTotal}</td>
                    <td className="px-3 py-2 text-xs">{row.noInvoice}</td>
                    <td className="px-3 py-2 text-xs">{row.tglInvoice}</td>
                    <td className="px-3 py-2 text-xs">{row.noFakturPajak}</td>
                    <td className="px-3 py-2 text-xs">{row.tglFakturPajak}</td>
                    <td className="px-3 py-2 text-xs">{row.tglTerimaBarang}</td>
                    <td className="px-3 py-2 text-xs">{row.noLPB}</td>
                    <td className="px-3 py-2 text-xs">{row.tglTerimaKeuangan}</td>
                    <td className="px-3 py-2 text-xs">{row.tglPengajuanDana}</td>
                    <td className="px-3 py-2 text-xs">{row.tglBayar}</td>
                    <td className="px-3 py-2 text-xs">{row.noBuktiBayar}</td>
                    <td className="px-3 py-2 text-xs">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.status === "Ontime" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => requestEdit(row)}
                          className="p-1 bg-blue-600 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-blue-700"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => requestDelete(row)}
                          className="p-1 bg-red-600 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
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

      <TrackingDokumenFormModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
};

export default TrackingDokumenMonitoringDashboard;
