import React, { useMemo, useState, useEffect } from "react";
import termsPdf from "../../Folder/term&condition.pdf";
import { FileSpreadsheet, FileText, Plus, Search, ChevronLeft, ChevronRight, Clock, Info } from "lucide-react";

interface Customer {
  id: string;
  namaPerusahaan: string;
  alamat: string;
  pic: string;
  email: string;
  noTelp: string;
  keterangan?: string;
}

const mockData: Customer[] = [
  {
    id: "1",
    namaPerusahaan: "PT Maju Jaya",
    alamat: "Jl. Merdeka No. 10, Jakarta Pusat",
    pic: "Budi Santoso",
    email: "contact@majujaya.co.id",
    noTelp: "021-555-1234",
    keterangan: "Existing client",
  },
  {
    id: "2",
    namaPerusahaan: "CV Sejahtera Abadi",
    alamat: "Jl. Melati No. 2, Bogor",
    pic: "Sari Purnama",
    email: "admin@sejahteraabadi.id",
    noTelp: "0251-888-7766",
    keterangan: "Prospective",
  },
];

const MasterDataCustomerDashboard: React.FC = () => {
  // Filters & UI state (match Penawaran On Call structure)
  const [searchNama, setSearchNama] = useState("");
  const [searchPIC, setSearchPIC] = useState("");
  const [searchAlamat, setSearchAlamat] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [animateRows, setAnimateRows] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const termNama = searchNama.toLowerCase();
    const termPIC = searchPIC.toLowerCase();
    const termAlamat = searchAlamat.toLowerCase();
    return mockData.filter(
      (c) =>
        c.namaPerusahaan.toLowerCase().includes(termNama) &&
        c.pic.toLowerCase().includes(termPIC) &&
        c.alamat.toLowerCase().includes(termAlamat)
    );
  }, [searchNama, searchPIC, searchAlamat]);

  // derive pagination later to avoid duplicate declarations

  const handleExportCSV = () => {
    const headers = ["Nama Perusahaan", "Alamat", "PIC", "Email", "No. Telp", "Keterangan"]; 
    const rows = filtered.map((c) => [c.namaPerusahaan, c.alamat, c.pic, c.email, c.noTelp, c.keterangan ?? ""]);
    const csv = [headers, ...rows].map((r) => r.map((x) => `"${(x || "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "master_data_customer.csv";
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

  const handleSearch = () => {
    setPage(1);
  };

  // Derived for pagination bar (match layout from Penawaran On Call)
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentData = filtered.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-sm">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-wide mb-1">
                MASTER DATA CUSTOMER
              </h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Master</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master Data Customer</span>
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
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-10 -mt-10"></div>

          {/* Filters grid (aligned to Penawaran On Call) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Cari Nama Perusahaan */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari Nama Perusahaan</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNama}
                  onChange={(e) => setSearchNama(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan nama perusahaan..."
                />
              </div>
            </div>

            {/* Cari PIC */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari PIC</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchPIC}
                  onChange={(e) => setSearchPIC(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan nama PIC..."
                />
              </div>
            </div>

            {/* Cari Alamat */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari Alamat</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchAlamat}
                  onChange={(e) => setSearchAlamat(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan alamat..."
                />
              </div>
            </div>

            {/* Cari Button */}
            <div className="space-y-2 flex items-end">
              <button
                onClick={handleSearch}
                className="w-full h-[38px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 flex items-center justify-center space-x-2 text-sm"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Customer</span>
            </button>
            <button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export Excel</span>
            </button>
            <button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-2 text-sm">
              <FileText className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nama Perusahaan</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Alamat</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">PIC</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No. Telp</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((c, index) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ 
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-1.5 w-1.5 bg-blue-500 rounded-full flex-shrink-0">
                          <Info className="h-1.5 w-1.5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{startIndex + index + 1}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900">{c.namaPerusahaan}</td>
                    <td className="px-3 py-2 text-gray-600">{c.alamat}</td>
                    <td className="px-3 py-2 text-gray-600">{c.pic}</td>
                    <td className="px-3 py-2 text-gray-600">{c.email}</td>
                    <td className="px-3 py-2 text-gray-600">{c.noTelp}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <button className="text-yellow-700 hover:underline">View</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-blue-700 hover:underline">Edit</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-red-700 hover:underline">Delete</button>
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
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                      page === p
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-gray-700 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default MasterDataCustomerDashboard;
