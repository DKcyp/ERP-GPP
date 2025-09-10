import React, { useEffect, useMemo, useState } from "react";
import termsPdf from "../../Folder/term&condition.pdf";
import {
  Search,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Row {
  id: string;
  no: number;
  noKontrak: string;
  namaClient: string;
  pic: string;
  namaKontrak: string;
  tanggalKontrak: string; // DD-MM-YYYY
  suspect: boolean;
  prospect: boolean;
  penawaran: boolean;
  kontrak: boolean;
  soInduk: boolean;
  nilaiKontrak: string; // formatted
  absorbKontrak: string; // formatted
  remainingKontrak: string; // formatted
  tanggalTagihan: string; // DD-MM-YYYY
}

const mockRows: Row[] = [
  {
    id: "1",
    no: 1,
    noKontrak: "KD-001",
    namaClient: "PT Teknologi Maju",
    pic: "Budi Santoso",
    namaKontrak: "Implementasi ERP System",
    tanggalKontrak: "15-01-2025",
    suspect: true,
    prospect: true,
    penawaran: true,
    kontrak: true,
    soInduk: true,
    nilaiKontrak: "Rp 2.500.000.000",
    absorbKontrak: "Rp 1.200.000.000",
    remainingKontrak: "Rp 1.300.000.000",
    tanggalTagihan: "20-02-2025",
  },
  {
    id: "2",
    no: 2,
    noKontrak: "KD-002",
    namaClient: "CV Digital Solutions",
    pic: "Sari Dewi",
    namaKontrak: "Website Development",
    tanggalKontrak: "14-01-2025",
    suspect: true,
    prospect: true,
    penawaran: true,
    kontrak: false,
    soInduk: false,
    nilaiKontrak: "Rp 750.000.000",
    absorbKontrak: "Rp 300.000.000",
    remainingKontrak: "Rp 450.000.000",
    tanggalTagihan: "05-03-2025",
  },
];

const ManagementMonitoringMarketingDashboard: React.FC = () => {
  // Filters
  const [searchNoKontrak, setSearchNoKontrak] = useState("");
  const [searchPIC, setSearchPIC] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [animateRows, setAnimateRows] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return mockRows.filter((r) => {
      const matchesNoKontrak = r.noKontrak
        .toLowerCase()
        .includes(searchNoKontrak.toLowerCase());
      const matchesPIC = r.pic.toLowerCase().includes(searchPIC.toLowerCase());
      // date range
      const itemDate = r.tanggalKontrak.split("-").reverse().join("-");
      const matchesFrom = dateFrom ? itemDate >= dateFrom : true;
      const matchesTo = dateTo ? itemDate <= dateTo : true;
      return matchesNoKontrak && matchesPIC && matchesFrom && matchesTo;
    });
  }, [searchNoKontrak, searchPIC, dateFrom, dateTo]);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentData = filtered.slice(startIndex, endIndex);

  const handleExportCSV = () => {
    const headers = [
      "No Kontrak",
      "Nama Client",
      "PIC",
      "Nama Kontrak",
      "Tanggal Kontrak",
      "Suspect",
      "Prospect",
      "Penawaran",
      "Kontrak",
      "SO Induk",
      "Nilai Kontrak",
      "Absorb Kontrak",
      "Remaining Kontrak",
      "Tanggal Tagihan",
    ];
    const rows = filtered.map((r) => [
      r.noKontrak,
      r.namaClient,
      r.pic,
      r.namaKontrak,
      r.tanggalKontrak,
      r.suspect ? "V" : "X",
      r.prospect ? "V" : "X",
      r.penawaran ? "V" : "X",
      r.kontrak ? "V" : "X",
      r.soInduk ? "V" : "X",
      r.nilaiKontrak,
      r.absorbKontrak,
      r.remainingKontrak,
      r.tanggalTagihan,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "management_monitoring_marketing.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const link = document.createElement("a");
    link.href = termsPdf;
    link.setAttribute("download", "term&condition.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const renderTick = (v: boolean) => (
    <span className="inline-flex items-center gap-1">
      {v ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="sr-only">V</span>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="sr-only">X</span>
        </>
      )}
    </span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-wide mb-1">
                MANAGEMENT MONITORING MARKETING
              </h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Management</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring Marketing</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-10 -mt-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Cari No Kontrak */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari No Kontrak</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchNoKontrak}
                onChange={(e) => setSearchNoKontrak(e.target.value)}
                placeholder="Cari No Kontrak..."
              />
            </div>

            {/* Cari PIC */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari PIC</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchPIC}
                onChange={(e) => setSearchPIC(e.target.value)}
                placeholder="Cari PIC..."
              />
            </div>

            {/* Periode Dari */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Periode Dari</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Sampai */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Periode Sampai</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cari Button */}
            <div className="space-y-2 flex items-end">
              <button
                onClick={() => setPage(1)}
                className="w-full h-[38px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-600/25 flex items-center justify-center space-x-2 text-sm"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition-all hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export Excel</span>
            </button>
            <button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium transition-all hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-2 text-sm">
              <FileText className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nama Client</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">PIC</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nama Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Tanggal Kontrak</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Suspect</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Prospect</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Penawaran</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Kontrak</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">SO Induk</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nilai Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Absorb Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Remaining Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Tanggal Tagihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((r, index) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ animationDelay: animateRows ? `${index * 100}ms` : '0ms', animationFillMode: 'forwards' }}
                  >
                    <td className="px-3 py-2">{startIndex + index + 1}</td>
                    <td className="px-3 py-2 font-medium text-gray-900">{r.noKontrak}</td>
                    <td className="px-3 py-2 text-gray-700">{r.namaClient}</td>
                    <td className="px-3 py-2 text-gray-700">{r.pic}</td>
                    <td className="px-3 py-2 text-gray-700">{r.namaKontrak}</td>
                    <td className="px-3 py-2 text-gray-700">{r.tanggalKontrak}</td>
                    <td className="px-3 py-2 text-center">{renderTick(r.suspect)}</td>
                    <td className="px-3 py-2 text-center">{renderTick(r.prospect)}</td>
                    <td className="px-3 py-2 text-center">{renderTick(r.penawaran)}</td>
                    <td className="px-3 py-2 text-center">{renderTick(r.kontrak)}</td>
                    <td className="px-3 py-2 text-center">{renderTick(r.soInduk)}</td>
                    <td className="px-3 py-2 text-gray-700">{r.nilaiKontrak}</td>
                    <td className="px-3 py-2 text-gray-700">{r.absorbKontrak}</td>
                    <td className="px-3 py-2 text-gray-700">{r.remainingKontrak}</td>
                    <td className="px-3 py-2 text-gray-700">{r.tanggalTagihan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                      page === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'text-gray-700 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementMonitoringMarketingDashboard;
