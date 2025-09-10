import React, { useEffect, useState } from "react";
import { File, FileSpreadsheet, FileText, Plus, Search } from "lucide-react";

interface PengajuanPegawaiBaru {
  id: string;
  no: number;
  nama: string;
  departemen: string;
  jabatan: string;
  lokasiKerja: string;
  tanggalMulai: string; // DD-MM-YYYY
  status: "Menunggu Review" | "Approve" | "Reject";
}

const PengajuanPegawaiBaruDashboard: React.FC = () => {
  const [animateRows, setAnimateRows] = useState(false);
  const [searchNama, setSearchNama] = useState("");
  const [searchDept, setSearchDept] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState<PengajuanPegawaiBaru[]>([
    {
      id: "1",
      no: 1,
      nama: "Ahmad Fauzi",
      departemen: "Operasional",
      jabatan: "Teknisi",
      lokasiKerja: "Jakarta",
      tanggalMulai: "24-12-2024",
      status: "Menunggu Review",
    },
    {
      id: "2",
      no: 2,
      nama: "Budi Santoso",
      departemen: "Operasional",
      jabatan: "Welder",
      lokasiKerja: "Bekasi",
      tanggalMulai: "05-01-2025",
      status: "Approve",
    },
    {
      id: "3",
      no: 3,
      nama: "Siti Aisyah",
      departemen: "HRD",
      jabatan: "Staff HR",
      lokasiKerja: "Jakarta",
      tanggalMulai: "12-01-2025",
      status: "Reject",
    },
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const getStatusBadge = (status: PengajuanPegawaiBaru["status"]) => {
    switch (status) {
      case "Menunggu Review":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Approve":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Reject":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter
  const filtered = data.filter((r) => {
    const matchNama = r.nama.toLowerCase().includes(searchNama.toLowerCase());
    const matchDept = r.departemen
      .toLowerCase()
      .includes(searchDept.toLowerCase());
    // Optional date filter (DD-MM-YYYY)
    const inRange = (() => {
      if (!dateFrom && !dateTo) return true;
      const [d, m, y] = r.tanggalMulai.split("-").map((v) => parseInt(v, 10));
      const t = new Date(y, m - 1, d).getTime();
      let ok = true;
      if (dateFrom) {
        const ts = new Date(dateFrom).getTime();
        ok = ok && t >= ts;
      }
      if (dateTo) {
        const te = new Date(dateTo).getTime();
        ok = ok && t <= te;
      }
      return ok;
    })();

    return matchNama && matchDept && inRange;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filtered.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSearch = () => setCurrentPage(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengajuan Pegawai Baru</h1>

          {/* Filter section (compact like MCU/ManPower) */}
          <div className="space-y-4 mb-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cari Nama</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNama}
                    onChange={(e) => setSearchNama(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Nama pegawai"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Departemen</label>
                <input
                  type="text"
                  value={searchDept}
                  onChange={(e) => setSearchDept(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="HRD / Operasional / Finance"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Periode</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Export Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-2">
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <File className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Departemen</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Jabatan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Lokasi Kerja</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal Mulai</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    } ${animateRows ? "animate-in fade-in slide-in-from-bottom-2" : "opacity-0"}`}
                    style={{
                      animationDelay: animateRows ? `${index * 100}ms` : "0ms",
                      animationFillMode: "forwards",
                    }}
                  >
                    <td className="px-4 py-3 text-gray-900">{row.no}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{row.nama}</td>
                    <td className="px-4 py-3 text-gray-900">{row.departemen}</td>
                    <td className="px-4 py-3 text-gray-900">{row.jabatan}</td>
                    <td className="px-4 py-3 text-gray-600">{row.lokasiKerja}</td>
                    <td className="px-4 py-3 text-gray-600">{row.tanggalMulai}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {currentData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                        currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default PengajuanPegawaiBaruDashboard;
