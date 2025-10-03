import React, { useState, useEffect } from "react";
import { AbsensiTeknisiData } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AbsensiTeknisiDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedNama, setSelectedNama] = useState<string | null>(null);

  // Sample data matching the first image
  const [absensiTeknisiData, setAbsensiTeknisiData] = useState<
    AbsensiTeknisiData[]
  >([
    {
      id: "1",
      no: 1,
      namaTeknisi: "Ahmad",
      tanggalAbsensi: "01-01-2025",
      zonaKerja: "Zona 1",
      statusAbsensi: "DL",
      lampiran: "Rp 1.500.000",
    },
    {
      id: "2",
      no: 2,
      namaTeknisi: "Budi Santoso",
      tanggalAbsensi: "02-01-2025",
      zonaKerja: "Zona 3",
      statusAbsensi: "TL",
      lampiran: "Rp 2.000.000",
    },
    {
      id: "3",
      no: 3,
      namaTeknisi: "Slamet Riyadi",
      tanggalAbsensi: "03-01-2025",
      zonaKerja: "Zona 2",
      statusAbsensi: "CT",
      lampiran: "Rp 1.750.000",
    },
    {
      id: "4",
      no: 4,
      namaTeknisi: "Agus Prasetyo",
      tanggalAbsensi: "04-01-2025",
      zonaKerja: "Zona 1",
      statusAbsensi: "CK",
      lampiran: "Rp 1.250.000",
    },
    {
      id: "5",
      no: 5,
      namaTeknisi: "Rudi Hartono",
      tanggalAbsensi: "05-01-2025",
      zonaKerja: "Zona 3",
      statusAbsensi: "CI",
      lampiran: "Rp 1.800.000",
    },
    {
      id: "6",
      no: 6,
      namaTeknisi: "Fauzan Malik",
      tanggalAbsensi: "06-01-2025",
      zonaKerja: "Zona 2",
      statusAbsensi: "CP",
      lampiran: "Rp 1.600.000",
    },
    {
      id: "7",
      no: 7,
      namaTeknisi: "Joko Widodo",
      tanggalAbsensi: "07-01-2025",
      zonaKerja: "Zona 1",
      statusAbsensi: "H",
      lampiran: "Rp 2.100.000",
    },
    {
      id: "8",
      no: 8,
      namaTeknisi: "Hariyanto",
      tanggalAbsensi: "08-01-2025",
      zonaKerja: "Zona 3",
      statusAbsensi: "TL",
      lampiran: "Rp 1.450.000",
    },
    // Recent dummy records for Ahmad (within last 16 days from 10-09-2025)
    {
      id: "A1",
      no: 9,
      namaTeknisi: "Ahmad",
      tanggalAbsensi: "26-08-2025",
      zonaKerja: "Zona 1",
      statusAbsensi: "H",
      lampiran: "Rp 1.500.000",
    },
    {
      id: "A2",
      no: 10,
      namaTeknisi: "Ahmad",
      tanggalAbsensi: "28-08-2025",
      zonaKerja: "Zona 1",
      statusAbsensi: "DL",
      lampiran: "Rp 1.500.000",
    },
    {
      id: "A3",
      no: 11,
      namaTeknisi: "Ahmad",
      tanggalAbsensi: "30-08-2025",
      zonaKerja: "Zona 2",
      statusAbsensi: "H",
      lampiran: "Rp 1.500.000",
    },
    {
      id: "A4",
      no: 12,
      namaTeknisi: "Ahmad",
      tanggalAbsensi: "01-09-2025",
      zonaKerja: "Zona 2",
      statusAbsensi: "CP",
      lampiran: "Rp 1.500.000",
    },
    {
      id: "A5",
      no: 13,
      namaTeknisi: "Ahmad",
      tanggalAbsensi: "02-09-2025",
      zonaKerja: "Zona 1",
      statusAbsensi: "CT",
      lampiran: "Rp 1.500.000",
    },
    {
      id: "A6",
      no: 14,
      namaTeknisi: "Ahmad",
      tanggalAbsensi: "04-09-2025",
      zonaKerja: "Zona 3",
      statusAbsensi: "TL",
      lampiran: "Rp 1.500.000",
    },
    {
      id: "A7",
      no: 15,
      namaTeknisi: "Ahmad",
      tanggalAbsensi: "06-09-2025",
      zonaKerja: "Zona 1",
      statusAbsensi: "H",
      lampiran: "Rp 1.500.000",
    },
    {
      id: "A8",
      no: 16,
      namaTeknisi: "Ahmad",
      tanggalAbsensi: "08-09-2025",
      zonaKerja: "Zona 1",
      statusAbsensi: "DL",
      lampiran: "Rp 1.500.000",
    },
    {
      id: "A9",
      no: 17,
      namaTeknisi: "Ahmad",
      tanggalAbsensi: "09-09-2025",
      zonaKerja: "Zona 2",
      statusAbsensi: "H",
      lampiran: "Rp 1.500.000",
    },
    {
      id: "A10",
      no: 18,
      namaTeknisi: "Ahmad",
      tanggalAbsensi: "10-09-2025",
      zonaKerja: "Zona 2",
      statusAbsensi: "H",
      lampiran: "Rp 1.500.000",
    },
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  // No delete flow in this screen

  // Normalize raw code to label: Izin, Sakit, Libur, Cuti, Alpha, Hadir
  const normalizeStatusLabel = (
    status: string
  ): "Izin" | "Sakit" | "Libur" | "Cuti" | "Alpha" | "Hadir" => {
    const s = status.trim().toUpperCase();
    if (s === "DL" || s === "CP" || s === "IZIN") return "Izin";
    if (s === "S" || s === "SAKIT") return "Sakit";
    if (s === "LBR" || s === "LIBUR") return "Libur";
    if (s === "CT" || s === "CUTI") return "Cuti";
    if (s === "TM" || s === "ALPHA") return "Alpha";
    return "Hadir"; // default for H
  };

  const getStatusAbsensiColor = (status: string) => {
    switch (normalizeStatusLabel(status)) {
      case "Izin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Sakit":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Libur":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cuti":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Alpha":
        return "bg-red-100 text-red-800 border-red-200";
      case "Hadir":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };


  // Helpers for 16-day period
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 15); // 16 days window including today

  const formatDate = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const isWithinPeriod = (ddmmyyyy: string) => {
    const [dd, mm, yyyy] = ddmmyyyy.split("-").map((v) => parseInt(v, 10));
    if (!dd || !mm || !yyyy) return false;
    const d = new Date(yyyy, mm - 1, dd);
    d.setHours(0, 0, 0, 0);
    const s = new Date(startDate);
    s.setHours(0, 0, 0, 0);
    const t = new Date(today);
    t.setHours(0, 0, 0, 0);
    return d >= s && d <= t;
  };

  // Map raw status to categories requested by user
  const mapStatusToCategory = (
    status: string
  ): "izin" | "sakit" | "libur" | "cuti" | "alpha" | "hadir" | null => {
    const label = normalizeStatusLabel(status);
    if (label === "Izin") return "izin";
    if (label === "Sakit") return "sakit";
    if (label === "Libur") return "libur";
    if (label === "Cuti") return "cuti";
    if (label === "Alpha") return "alpha";
    if (label === "Hadir") return "hadir";
    return null;
  };

  type EmployeeSummary = {
    no: number;
    nama: string;
    periode: string;
    dl: number;
    izin: number;
    sakit: number;
    libur: number;
    cuti: number;
    cutiTahunan: number;
    cutiPotong: number;
    cutiKhusus: number;
    cutiIstimewa: number;
    alpha: number;
    hadir: number;
    terlambat: number;
  };

  // Build summaries per employee for the last 16 days
  const buildSummaries = (): EmployeeSummary[] => {
    const byNama = new Map<string, AbsensiTeknisiData[]>();
    absensiTeknisiData.forEach((r) => {
      if (!byNama.has(r.namaTeknisi)) byNama.set(r.namaTeknisi, []);
      byNama.get(r.namaTeknisi)!.push(r);
    });

    const results: EmployeeSummary[] = [];
    let counter = 1;
    byNama.forEach((rows, nama) => {
      let dl = 0,
        izin = 0,
        sakit = 0,
        libur = 0,
        cuti = 0,
        cutiTahunan = 0,
        cutiPotong = 0,
        cutiKhusus = 0,
        cutiIstimewa = 0,
        alpha = 0,
        hadir = 0,
        terlambat = 0;
      // consider only within period
      const within = rows.filter((r) => isWithinPeriod(r.tanggalAbsensi));
      within.forEach((r) => {
        const status = r.statusAbsensi.trim().toUpperCase();
        // count DL separately
        if (status === "DL") dl += 1;
        // count different types of cuti
        else if (status === "CT" || status === "CUTI") cutiTahunan += 1;
        else if (status === "CP" || status === "CUTI_POTONG") cutiPotong += 1;
        else if (status === "CK" || status === "CUTI_KHUSUS") cutiKhusus += 1;
        else if (status === "CI" || status === "CUTI_ISTIMEWA") cutiIstimewa += 1;
        // count terlambat
        else if (status === "TL" || status === "TERLAMBAT") terlambat += 1;
        
        const cat = mapStatusToCategory(r.statusAbsensi);
        if (cat === "izin") izin += 1;
        else if (cat === "sakit") sakit += 1;
        else if (cat === "libur") libur += 1;
        else if (cat === "cuti") cuti += 1;
        else if (cat === "alpha") alpha += 1;
        else if (cat === "hadir") hadir += 1;
      });
      
      results.push({
        no: counter++,
        nama,
        periode: `${formatDate(startDate)} s.d ${formatDate(today)}`,
        dl,
        izin,
        sakit,
        libur,
        cuti,
        cutiTahunan,
        cutiPotong,
        cutiKhusus,
        cutiIstimewa,
        alpha,
        hadir,
        terlambat,
      });
    });
    return results;
  };

  const summariesAll = buildSummaries();

  // Filter summaries
  const filteredSummaries = summariesAll.filter((s) =>
    s.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort summaries by name by default
  const sortedSummaries = [...filteredSummaries].sort((a, b) =>
    a.nama.localeCompare(b.nama)
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedSummaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedSummaries.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Absensi</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Controls Section */}
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Cari nama pegawai..."
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Nama Pegawai
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Periode (16 hari sebelumnya)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Dinas Luar (DL)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Izin
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Sakit
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Libur
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Cuti
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Alpha
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Cuti Tahunan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Cuti Potong
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Cuti Khusus
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Cuti Istimewa
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Hadir
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Terlambat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((row, index) => (
                  <tr
                    key={row.nama}
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
                    onClick={() => {
                      setSelectedNama(row.nama);
                      setDetailOpen(true);
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.no}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {row.nama}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {row.periode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.dl}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.izin}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.sakit}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.libur}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.cuti}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.alpha}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.cutiTahunan}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.cutiPotong}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.cutiKhusus}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.cutiIstimewa}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.hadir}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.terlambat}
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
                {Math.min(endIndex, sortedSummaries.length)} of{" "}
                {sortedSummaries.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detail Absensi {selectedNama}
              </h3>
              <button
                onClick={() => setDetailOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Periode: {`${formatDate(startDate)} s.d ${formatDate(today)}`}
            </p>
            <div className="max-h-96 overflow-auto border border-gray-200 rounded">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                      Tanggal
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                      Zona Kerja
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {absensiTeknisiData
                    .filter(
                      (r) =>
                        r.namaTeknisi === selectedNama &&
                        isWithinPeriod(r.tanggalAbsensi)
                    )
                    .sort((a, b) => {
                      // sort by date ascending
                      const [da, ma, ya] = a.tanggalAbsensi
                        .split("-")
                        .map((n) => parseInt(n, 10));
                      const [db, mb, yb] = b.tanggalAbsensi
                        .split("-")
                        .map((n) => parseInt(n, 10));
                      const ta = new Date(ya, ma - 1, da).getTime();
                      const tb = new Date(yb, mb - 1, db).getTime();
                      return ta - tb;
                    })
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-900">
                          {r.tanggalAbsensi}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusAbsensiColor(
                              r.statusAbsensi
                            )}`}
                          >
                            {normalizeStatusLabel(r.statusAbsensi)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-700">
                          {r.zonaKerja}
                        </td>
                      </tr>
                    ))}
                  {absensiTeknisiData.filter(
                    (r) =>
                      r.namaTeknisi === selectedNama &&
                      isWithinPeriod(r.tanggalAbsensi)
                  ).length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-3 py-4 text-center text-gray-500"
                      >
                        Tidak ada data absensi pada periode ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setDetailOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbsensiTeknisiDashboard;
