import React, { useState, useEffect } from "react";
import {
  Search,
  FileSpreadsheet,
  FileText,
  File,
  ChevronDown,
  ArrowUp,
  Download,
} from "lucide-react";

// Removed TambahTalentPoolModal as 'Tambah' feature is disabled

interface TalentPoolData {
  id: string;
  no: number;
  namaPelamar: string;
  noTelp: string;
  email: string;
  kualifikasi: string;
  fileName?: string;
  fileUrl?: string;
  status: "Pending" | "Accepted" | "Rejected" | "Interview" | "Hired";
  keterangan: string;
}

const ListLamaranDashboard: React.FC = () => {
  const [searchNamaPelamar, setSearchNamaPelamar] = useState("");
  const [selectedKualifikasi, setSelectedKualifikasi] = useState("");
  const [kualifikasiDropdownOpen, setKualifikasiDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof TalentPoolData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  // Removed: const [isTambahOpen, setIsTambahOpen] = useState(false);
  
  // New state for Move to Rekrutmen modal
  const [isMoveToRekrutmenModalOpen, setIsMoveToRekrutmenModalOpen] = useState(false);
  const [selectedForMove, setSelectedForMove] = useState<TalentPoolData | null>(null);

  // Sample data matching the image, now with status and keterangan
  const [lamaranData, setLamaranData] = useState<TalentPoolData[]>([
    {
      id: "1",
      no: 1,
      namaPelamar: "Rahmat Hidayat",
      noTelp: "0812-3456-7890",
      email: "rahmat.hidayat@email.com",
      kualifikasi:
        "Sarjana Teknik Sipil, pengalaman 4 tahun di bidang konstruksi",
      status: "Pending",
      keterangan: "Menunggu review HRD.",
    },
    {
      id: "2",
      no: 2,
      namaPelamar: "Siti Aisyah",
      noTelp: "0813-9876-5432",
      email: "siti.aisyah@email.com",
      kualifikasi: "D3 Manajemen, pengalaman 2 tahun sebagai Admin HRD",
      status: "Accepted",
      keterangan: "Lolos seleksi administrasi, menunggu jadwal interview.",
    },
    {
      id: "3",
      no: 3,
      namaPelamar: "Fauzan Alfarizi",
      noTelp: "0857-6543-2109",
      email: "fauzan.alfarizi@email.com",
      kualifikasi:
        "Sarjana Teknik Sipil, pengalaman 4 tahun di bidang konstruksi",
      status: "Rejected",
      keterangan: "Kualifikasi tidak sesuai.",
    },
    {
      id: "4",
      no: 4,
      namaPelamar: "Lestari Putri",
      noTelp: "0821-1234-5678",
      email: "lestari.putri@email.com",
      kualifikasi:
        "Sarjana Akuntansi, pengalaman 5 tahun sebagai Finance Officer",
      status: "Interview",
      keterangan: "Jadwal interview tanggal 10 April 2025.",
    },
  ]);

  const kualifikasiOptions = [
    "Sarjana Teknik Sipil, pengalaman 4 tahun di bidang konstruksi",
    "D3 Manajemen, pengalaman 2 tahun sebagai Admin HRD",
    "Sarjana Akuntansi, pengalaman 5 tahun sebagai Finance Officer",
  ];

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof TalentPoolData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter data based on search criteria
  const filteredData = lamaranData.filter((item) => {
    const matchesNamaPelamar = item.namaPelamar
      .toLowerCase()
      .includes(searchNamaPelamar.toLowerCase());
    const matchesKualifikasi = selectedKualifikasi
      ? item.kualifikasi === selectedKualifikasi
      : true;

    return matchesNamaPelamar && matchesKualifikasi;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField] as any;
    const bValue = b[sortField] as any;

    if (sortField === "no") {
      const aNum =
        typeof aValue === "number" ? aValue : parseFloat(aValue ?? 0);
      const bNum =
        typeof bValue === "number" ? bValue : parseFloat(bValue ?? 0);
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
    }

    const aStr = (aValue ?? "").toString().toLowerCase();
    const bStr = (bValue ?? "").toString().toLowerCase();
    const cmp = aStr.localeCompare(bStr, undefined, {
      numeric: true,
      sensitivity: "base",
    });
    return sortDirection === "asc" ? cmp : -cmp;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleMoveToRekrutmenClick = (item: TalentPoolData) => {
    setSelectedForMove(item);
    setIsMoveToRekrutmenModalOpen(true);
  };

  const handleConfirmMoveToRekrutmen = () => {
    if (!selectedForMove) return;
    
    // Remove from talent pool data
    setLamaranData((prev) => prev.filter((item) => item.id !== selectedForMove.id));
    
    // Close modal and reset selection
    setIsMoveToRekrutmenModalOpen(false);
    setSelectedForMove(null);
    
    // You can add additional logic here to actually move the data to recruitment system
    console.log('Moving to recruitment:', selectedForMove);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">TALENT POOL</h1>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Search Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Search Nama Pelamar */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Pelamar
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaPelamar}
                    onChange={(e) => setSearchNamaPelamar(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Agus"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Kualifikasi Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Kualifikasi
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setKualifikasiDropdownOpen(!kualifikasiDropdownOpen)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-sm"
                  >
                    <span
                      className={
                        selectedKualifikasi ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {selectedKualifikasi
                        ? selectedKualifikasi.substring(0, 30) + "..."
                        : "--Pilih Kualifikasi--"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                        kualifikasiDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {kualifikasiDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedKualifikasi("");
                          setKualifikasiDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-sm"
                      >
                        --Pilih Kualifikasi--
                      </button>
                      {kualifikasiOptions.map((kualifikasi) => (
                        <button
                          key={kualifikasi}
                          onClick={() => {
                            setSelectedKualifikasi(kualifikasi);
                            setKualifikasiDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                          title={kualifikasi}
                        >
                          {kualifikasi.length > 50
                            ? kualifikasi.substring(0, 50) + "..."
                            : kualifikasi}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigasi & Export Buttons */}
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <div className="flex justify-end space-x-2">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Show entries control */}
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

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("no")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No</span>
                      {sortField === "no" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("namaPelamar")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Pelamar</span>
                      {sortField === "namaPelamar" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("noTelp")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No. Telp</span>
                      {sortField === "noTelp" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      {sortField === "email" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("kualifikasi")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Kualifikasi</span>
                      {sortField === "kualifikasi" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    File
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    } ${
                      animateRows
                        ? "animate-in fade-in slide-in-from-bottom-2"
                        : "opacity-0"
                    }`}
                    style={{
                      animationDelay: animateRows ? `${index * 100}ms` : "0ms",
                      animationFillMode: "forwards",
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.no}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.namaPelamar}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.noTelp}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <a
                        href={`mailto:${item.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {item.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                      <div className="truncate" title={item.kualifikasi}>
                        {item.kualifikasi}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.fileUrl ? (
                        <a
                          href={item.fileUrl}
                          download={item.fileName || true}
                          className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          title="File belum diupload"
                          className="inline-flex items-center gap-1 rounded bg-gray-300 px-3 py-1 text-xs font-medium text-white cursor-not-allowed"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleMoveToRekrutmenClick(item)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          title="Move to Rekrutmen"
                        >
                          Move to rekrutmen
                        </button>
                      </div>
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
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredData.length)} of{" "}
                {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <button
                  onClick={() => handlePageChange(1)}
                  className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                    currentPage === 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  1
                </button>

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
      {/* Removed Tambah Talent Pool Modal */}

      {/* Move to Rekrutmen Confirmation Modal */}
      {isMoveToRekrutmenModalOpen && selectedForMove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMoveToRekrutmenModalOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Konfirmasi Move to Rekrutmen
              </h3>
              <button
                onClick={() => setIsMoveToRekrutmenModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pelamar
                </label>
                <div className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50">
                  {selectedForMove.namaPelamar}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50">
                  {selectedForMove.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kualifikasi
                </label>
                <div className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 max-h-20 overflow-y-auto">
                  {selectedForMove.kualifikasi}
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Perhatian:</strong> Pelamar ini akan dipindahkan dari Talent Pool ke sistem Rekrutmen. 
                  Aksi ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
              <button
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={() => setIsMoveToRekrutmenModalOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleConfirmMoveToRekrutmen}
              >
                Ya, Pindahkan ke Rekrutmen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListLamaranDashboard;
