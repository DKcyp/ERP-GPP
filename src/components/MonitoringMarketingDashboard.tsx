import React, { useEffect, useMemo, useState } from "react";
import termsPdf from "../../Folder/term&condition.pdf";
import {
  Search,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
  Clock,
  ChevronDown,
  Calendar,
  X,
  User,
  Briefcase,
  MapPin,
  DollarSign,
  Tag,
  Layers,
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
  jenisKontrak: string;
  tanggalKontrak: string; // DD-MM-YYYY
  durasiKontrak: string;
  nilaiKontrak: string;
  lokasiPekerjaan: string;
  statusPenawaran: "Deal" | "Pending" | "Cancel";
}

const mockRows: Row[] = [
  {
    id: "1",
    no: 1,
    noKontrak: "KD-001",
    namaClient: "PT Teknologi Maju",
    pic: "Budi Santoso",
    namaKontrak: "Implementasi ERP System",
    jenisKontrak: "Software Development",
    tanggalKontrak: "15-01-2025",
    durasiKontrak: "12 Bulan",
    nilaiKontrak: "Rp 2.500.000.000",
    lokasiPekerjaan: "Jakarta Selatan",
    statusPenawaran: "Deal",
  },
  {
    id: "2",
    no: 2,
    noKontrak: "KD-002",
    namaClient: "CV Digital Solutions",
    pic: "Sari Dewi",
    namaKontrak: "Website Development",
    jenisKontrak: "Web Development",
    tanggalKontrak: "14-01-2025",
    durasiKontrak: "9 Bulan",
    nilaiKontrak: "Rp 750.000.000",
    lokasiPekerjaan: "Bandung",
    statusPenawaran: "Pending",
  },
  {
    id: "3",
    no: 3,
    noKontrak: "KD-003",
    namaClient: "PT Industri Kreatif",
    pic: "Ahmad Rizki",
    namaKontrak: "IT Infrastructure Setup",
    jenisKontrak: "Infrastructure",
    tanggalKontrak: "13-01-2025",
    durasiKontrak: "18 Bulan",
    nilaiKontrak: "Rp 1.200.000.000",
    lokasiPekerjaan: "Surabaya",
    statusPenawaran: "Deal",
  },
  {
    id: "4",
    no: 4,
    noKontrak: "KD-004",
    namaClient: "UD Berkah Jaya",
    pic: "Maya Putri",
    namaKontrak: "POS System Integration",
    jenisKontrak: "System Integration",
    tanggalKontrak: "12-01-2025",
    durasiKontrak: "4,5 Bulan",
    nilaiKontrak: "Rp 480.000.000",
    lokasiPekerjaan: "Yogyakarta",
    statusPenawaran: "Cancel",
  },
  {
    id: "5",
    no: 5,
    noKontrak: "KD-005",
    namaClient: "PT Global Mandiri",
    pic: "Andi Wijaya",
    namaKontrak: "Mobile App Development",
    jenisKontrak: "Mobile Development",
    tanggalKontrak: "11-01-2025",
    durasiKontrak: "10,5 Bulan",
    nilaiKontrak: "Rp 820.000.000",
    lokasiPekerjaan: "Medan",
    statusPenawaran: "Pending",
  },
];

const MonitoringMarketingDashboard: React.FC = () => {
  // Filters
  const [searchNoKontrak, setSearchNoKontrak] = useState("");
  const [searchPIC, setSearchPIC] = useState("");
  const [searchJenisPekerjaan, setSearchJenisPekerjaan] = useState("");
  const [searchLokasiKerja, setSearchLokasiKerja] = useState("");
  const [selectedStatusPenawaran, setSelectedStatusPenawaran] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const [animateRows, setAnimateRows] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Detail & History modals
  const [detailOpen, setDetailOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selected, setSelected] = useState<Row | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'dokumen' | 'catatan'>('overview');

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return mockRows.filter((r) => {
      const matchesNoKontrak = r.noKontrak.toLowerCase().includes(searchNoKontrak.toLowerCase());
      const matchesPIC = r.pic.toLowerCase().includes(searchPIC.toLowerCase());
      const matchesJenis = r.jenisKontrak.toLowerCase().includes(searchJenisPekerjaan.toLowerCase());
      const matchesLokasi = r.lokasiPekerjaan.toLowerCase().includes(searchLokasiKerja.toLowerCase());
      const matchesStatus = selectedStatusPenawaran ? r.statusPenawaran === selectedStatusPenawaran : true;
      // date range
      const itemDate = r.tanggalKontrak.split('-').reverse().join('-');
      const matchesFrom = dateFrom ? itemDate >= dateFrom : true;
      const matchesTo = dateTo ? itemDate <= dateTo : true;
      return matchesNoKontrak && matchesPIC && matchesJenis && matchesLokasi && matchesStatus && matchesFrom && matchesTo;
    });
  }, [searchNoKontrak, searchPIC, searchJenisPekerjaan, searchLokasiKerja, selectedStatusPenawaran, dateFrom, dateTo]);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentData = filtered.slice(startIndex, endIndex);

  const statusOptions = ["Deal", "Pending", "Cancel"];
  const getStatusBadge = (s: Row["statusPenawaran"]) => {
    switch (s) {
      case "Deal":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancel":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "No Kontrak",
      "Nama Client",
      "PIC",
      "Nama Kontrak",
      "Jenis Kontrak",
      "Tanggal Kontrak",
      "Durasi Kontrak",
      "Nilai Kontrak",
      "Lokasi Pekerjaan",
      "Status Penawaran",
    ];
    const rows = filtered.map((r) => [
      r.noKontrak,
      r.namaClient,
      r.pic,
      r.namaKontrak,
      r.jenisKontrak,
      r.tanggalKontrak,
      r.durasiKontrak,
      r.nilaiKontrak,
      r.lokasiPekerjaan,
      r.statusPenawaran,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "monitoring_marketing.csv";
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

  const handleOpenDetail = (row: Row) => {
    setSelected(row);
    setDetailOpen(true);
  };

  const handleOpenHistory = (row: Row) => {
    setSelected(row);
    setHistoryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-wide mb-1">MONITORING MARKETING</h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Monitoring</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring Marketing</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
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

            {/* Cari Jenis Pekerjaan */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari Jenis Pekerjaan</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchJenisPekerjaan}
                onChange={(e) => setSearchJenisPekerjaan(e.target.value)}
                placeholder="Cari Jenis Pekerjaan..."
              />
            </div>

            {/* Cari Lokasi Kerja */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari Lokasi Kerja</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchLokasiKerja}
                onChange={(e) => setSearchLokasiKerja(e.target.value)}
                placeholder="Cari Lokasi Kerja..."
              />
            </div>

            {/* Pilih Status Penawaran */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Pilih Status Penawaran</label>
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-left flex items-center justify-between text-sm"
                >
                  <span className={selectedStatusPenawaran ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedStatusPenawaran || 'Pilih status penawaran...'}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden text-sm">
                    <button
                      onClick={() => { setSelectedStatusPenawaran(""); setStatusDropdownOpen(false); }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 text-gray-500"
                    >
                      Semua Status
                    </button>
                    {statusOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSelectedStatusPenawaran(s); setStatusDropdownOpen(false); }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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

          {/* Action Buttons (no Tambah as requested) */}
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
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Jenis Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Tanggal Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Durasi Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nilai Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Lokasi Pekerjaan</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Status Penawaran</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((r, index) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ animationDelay: animateRows ? `${index * 100}ms` : '0ms', animationFillMode: 'forwards' }}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                        <span className="font-medium text-gray-900">{startIndex + index + 1}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900">{r.noKontrak}</td>
                    <td className="px-3 py-2 text-gray-700">{r.namaClient}</td>
                    <td className="px-3 py-2 text-gray-700">{r.pic}</td>
                    <td className="px-3 py-2 text-gray-700">{r.namaKontrak}</td>
                    <td className="px-3 py-2 text-gray-700">{r.jenisKontrak}</td>
                    <td className="px-3 py-2 text-gray-700">{r.tanggalKontrak}</td>
                    <td className="px-3 py-2 text-gray-700">{r.durasiKontrak}</td>
                    <td className="px-3 py-2 text-gray-700">{r.nilaiKontrak}</td>
                    <td className="px-3 py-2 text-gray-700">{r.lokasiPekerjaan}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(r.statusPenawaran)}`}>
                        {r.statusPenawaran}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <button onClick={() => handleOpenDetail(r)} className="text-yellow-700 hover:underline">Detail</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => handleOpenHistory(r)} className="text-teal-700 hover:underline">History</button>
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

      {/* Detail Modal */}
      {detailOpen && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.currentTarget === e.target) setDetailOpen(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Detail Kontrak</h3>
                <p className="text-xs text-gray-500">{selected.noKontrak} • {selected.namaKontrak}</p>
              </div>
              <button
                onClick={() => setDetailOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-4 pt-3">
              <div className="flex gap-2 text-xs">
                <button onClick={() => setDetailTab('overview')} className={`px-3 py-1.5 rounded-md border ${detailTab==='overview' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>Overview</button>
                <button onClick={() => setDetailTab('dokumen')} className={`px-3 py-1.5 rounded-md border ${detailTab==='dokumen' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>Dokumen</button>
                <button onClick={() => setDetailTab('catatan')} className={`px-3 py-1.5 rounded-md border ${detailTab==='catatan' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>Catatan</button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-4">
              {detailTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                  <div className="lg:col-span-2 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-200">
                        <Tag className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">No Kontrak</p>
                          <p className="font-medium text-gray-900">{selected.noKontrak}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-200">
                        <Briefcase className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Jenis Kontrak</p>
                          <p className="font-medium text-gray-900">{selected.jenisKontrak}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-200">
                        <User className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Client / PIC</p>
                          <p className="font-medium text-gray-900">{selected.namaClient} • {selected.pic}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-200">
                        <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Tanggal / Durasi</p>
                          <p className="font-medium text-gray-900">{selected.tanggalKontrak} • {selected.durasiKontrak}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-200">
                        <DollarSign className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Nilai Kontrak</p>
                          <p className="font-medium text-gray-900">{selected.nilaiKontrak}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-200">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Lokasi Pekerjaan</p>
                          <p className="font-medium text-gray-900">{selected.lokasiPekerjaan}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">Ringkasan</p>
                      <p className="text-gray-700">Proyek {selected.namaKontrak} untuk {selected.namaClient} dengan PIC {selected.pic}. Nilai kontrak {selected.nilaiKontrak}, berlokasi di {selected.lokasiPekerjaan}. Status saat ini: <span className="font-medium">{selected.statusPenawaran}</span>.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Status Penawaran</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(selected.statusPenawaran)}`}>
                        {selected.statusPenawaran}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Tahapan Singkat</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Suspect</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Register</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Pra-kualifikasi</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Evaluasi</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Tender</li>
                        <li className="flex items-center gap-2">{selected.statusPenawaran === 'Deal' ? (<><CheckCircle2 className="h-4 w-4 text-green-500" /> Kontrak Deal</>) : selected.statusPenawaran === 'Cancel' ? (<><XCircle className="h-4 w-4 text-red-500" /> Cancel</>) : (<><Clock className="h-4 w-4 text-yellow-500" /> Pending</>)}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {detailTab === 'dokumen' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Dokumen Terkait</p>
                    <button onClick={handleExportPDF} className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"><FileText className="h-3.5 w-3.5" /> Unduh Contoh PDF</button>
                  </div>
                  <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 overflow-hidden">
                    {[{name:'Surat Penawaran', date:'10-12-2024'},{name:'BA Negoisasi', date:'20-12-2024'},{name:'Draft Kontrak', date:selected.tanggalKontrak}].map((d, i) => (
                      <li key={i} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Layers className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-900">{d.name}</p>
                            <p className="text-xs text-gray-500">Tanggal: {d.date}</p>
                          </div>
                        </div>
                        <button className="text-xs text-blue-600 hover:underline">Lihat</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {detailTab === 'catatan' && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">Catatan Internal</p>
                  <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-sm text-gray-700">
                    Peluang {selected.noKontrak} atas nama {selected.namaClient}. Pastikan legal dokumen lengkap sebelum Go-Live.
                  </div>
                  <div className="flex items-center gap-2">
                    <input className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Tambah catatan (demo)" />
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs">Simpan</button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 p-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setDetailOpen(false)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyOpen && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.currentTarget === e.target) setHistoryOpen(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="text-lg font-semibold text-gray-900">Riwayat Proses: {selected.noKontrak}</h3>
              <button
                onClick={() => setHistoryOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(85vh-130px)] p-4">
              <ol className="relative ps-4 space-y-4">
                {[
                  { step: "Suspect", date: "01-12-2024", note: `Lead masuk atas nama ${selected.namaClient}`, color: 'text-blue-600', bg: 'bg-blue-100' },
                  { step: "Register", date: "05-12-2024", note: "Registrasi peluang dan penunjukan PIC", color: 'text-blue-600', bg: 'bg-blue-100' },
                  { step: "Pra-kualifikasi", date: "10-12-2024", note: "Pengumpulan dokumen prasyarat", color: 'text-blue-600', bg: 'bg-blue-100' },
                  { step: "Evaluasi", date: "18-12-2024", note: "Evaluasi teknis & komersial", color: 'text-blue-600', bg: 'bg-blue-100' },
                  { step: "Tender", date: "28-12-2024", note: "Pengajuan penawaran & negosiasi", color: 'text-blue-600', bg: 'bg-blue-100' },
                  selected.statusPenawaran === 'Deal'
                    ? { step: 'Kontrak Deal', date: selected.tanggalKontrak, note: 'Kontrak ditandatangani', color: 'text-green-600', bg: 'bg-green-100', success: true }
                    : selected.statusPenawaran === 'Cancel'
                    ? { step: 'Cancel', date: selected.tanggalKontrak, note: 'Peluang dibatalkan', color: 'text-red-600', bg: 'bg-red-100', cancel: true }
                    : { step: 'Pending', date: selected.tanggalKontrak, note: 'Menunggu keputusan', color: 'text-yellow-600', bg: 'bg-yellow-100', pending: true }
                ].map((h, idx) => (
                  <li key={idx} className="ms-0">
                    <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" aria-hidden />
                    <div className={`relative z-10 inline-flex items-center justify-center h-5 w-5 rounded-full ${h.bg} ring-2 ring-white shadow`}></div>
                    <div className="ml-6">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          {h.success ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : h.cancel ? <XCircle className="h-4 w-4 text-red-600" /> : <Clock className={`h-4 w-4 ${h.color}`} />} {h.step}
                        </p>
                        <span className="text-xs text-gray-500">{h.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{h.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex items-center justify-end gap-2 p-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setHistoryOpen(false)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringMarketingDashboard;
