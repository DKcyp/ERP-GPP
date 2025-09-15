import React, { useEffect, useMemo, useState } from "react";
import { Search, FileSpreadsheet, FileText, File, Download } from "lucide-react";

interface IzinData {
  id: string;
  no: number;
  namaPegawai: string;
  tanggal: string; // ISO or dd-mm-yyyy
  jenisIzin: "Sakit" | "Cuti" | "Izin";
  durasi: string; // e.g., "1 Hari" / "3 Jam"
  keterangan: string;
  status: "Menunggu Review" | "Disetujui" | "Ditolak";
  fileName?: string;
  fileUrl?: string;
}



const PengajuanIzinDashboard: React.FC = () => {
  const [data, setData] = useState<IzinData[]>([
    {
      id: "1",
      no: 1,
      namaPegawai: "Agus Santoso",
      tanggal: "2025-09-10",
      jenisIzin: "Sakit",
      durasi: "1 Hari",
      keterangan: "Demam",
      status: "Menunggu Review",
    },
    {
      id: "2",
      no: 2,
      namaPegawai: "Rina Putri",
      tanggal: "2025-09-11",
      jenisIzin: "Cuti",
      durasi: "2 Hari",
      keterangan: "Urusan keluarga",
      status: "Disetujui",
    },
  ]);

  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateRows, setAnimateRows] = useState(false);



  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return data.filter(
      (d) =>
        d.namaPegawai.toLowerCase().includes(s) ||
        d.jenisIzin.toLowerCase().includes(s) ||
        d.status.toLowerCase().includes(s)
    );
  }, [data, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filtered.slice(startIndex, endIndex);



  const handleApprove = (item: IzinData) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === item.id ? { ...d, status: "Disetujui" } : d
      )
    );
  };

  const handleReject = (item: IzinData) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === item.id ? { ...d, status: "Ditolak" } : d
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">APPROVAL IZIN</h1>

          {/* Controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Search:</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama / status / jenis"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              />
              <button className="px-3 py-2 bg-cyan-500 text-white rounded-md text-sm flex items-center gap-1">
                <Search className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-1">
                <FileSpreadsheet className="h-4 w-4" /> Excel
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-1">
                <File className="h-4 w-4" /> CSV
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-1">
                <FileText className="h-4 w-4" /> PDF
              </button>
            </div>
          </div>

          {/* Show entries */}
          <div className="flex items-center gap-2">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Jenis Izin</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Durasi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Keterangan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">File</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"} ${
                      animateRows ? "animate-in fade-in slide-in-from-bottom-2" : "opacity-0"
                    }`}
                    style={{ animationDelay: animateRows ? `${index * 80}ms` : "0ms", animationFillMode: "forwards" }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{item.no}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.namaPegawai}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.tanggal}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.jenisIzin}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.durasi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.keterangan}</td>
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
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          item.status === "Menunggu Review"
                            ? "bg-yellow-500 text-white"
                            : item.status === "Disetujui"
                            ? "bg-green-600 text-white"
                            : item.status === "Ditolak"
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {item.status === "Menunggu Review" ? (
                          <>
                            <button
                              onClick={() => handleApprove(item)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition"
                              title="Approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(item)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
                              title="Reject"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">-</span>
                        )}
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
                Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded disabled:opacity-50"
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

export default PengajuanIzinDashboard;
