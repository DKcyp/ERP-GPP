import React, { useMemo, useState } from "react";
import {
  Clock,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  FileDown,
} from "lucide-react";

interface NeracaEntry {
  id: string;
  periode: string; // yyyy-mm
  akun: string; // kode akun
  namaAkun: string;
  mu: string;
  debitMu: number;
  kreditMu: number;
  debit: number; // Debet (Rp.)
  kredit: number; // Kredit (Rp.)
  keterangan: string;
}

type BalanceRow = {
  label: string;
  july: number;
  august: number;
  isBold?: boolean;
  isTotal?: boolean;
  level: number; // 0 = level 1, 1 = level 2, 2 = level 3, 3 = level 4
  parentId?: string; // untuk tracking parent
  id: string; // unique identifier
};

const NeracaDashboard: React.FC = () => {
  const today = new Date();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("2025");
  const [filterLevel, setFilterLevel] = useState("all");

  const formatNumber = (n: number) =>
    n < 0
      ? `(${Math.abs(n).toLocaleString("id-ID")})`
      : n.toLocaleString("id-ID");

  // Function untuk mendapatkan indentasi berdasarkan level
  const getIndentation = (level: number) => {
    return "\u00A0".repeat(level * 4); // Non-breaking spaces untuk indentasi
  };

  const asetRows: BalanceRow[] = [
    { id: "kas", label: "Kas", july: 174895077, august: 174895077, level: 0 },
    { id: "kas-besar", label: "Kas Besar", july: 150000000, august: 150000000, level: 1, parentId: "kas" },
    { id: "kas-besar-rupiah", label: "Kas Besar Rupiah", july: 100000000, august: 100000000, level: 2, parentId: "kas-besar" },
    { id: "kas-besar-usd", label: "Kas Besar USD", july: 50000000, august: 50000000, level: 2, parentId: "kas-besar" },
    { id: "kas-besar-rupiah-jakarta", label: "Kas Besar Rupiah Jakarta", july: 60000000, august: 60000000, level: 3, parentId: "kas-besar-rupiah" },
    { id: "kas-besar-rupiah-surabaya", label: "Kas Besar Rupiah Surabaya", july: 40000000, august: 40000000, level: 3, parentId: "kas-besar-rupiah" },
    { id: "kas-kecil", label: "Kas Kecil", july: 24895077, august: 24895077, level: 1, parentId: "kas" },
    { id: "kas-kecil-operasional", label: "Kas Kecil Operasional", july: 15000000, august: 15000000, level: 2, parentId: "kas-kecil" },
    { id: "kas-kecil-darurat", label: "Kas Kecil Darurat", july: 9895077, august: 9895077, level: 2, parentId: "kas-kecil" },
    { id: "bank", label: "Bank", july: 910444129, august: 910444129, level: 0 },
    { id: "bni", label: "BNI - REK 5520140008", july: 250000000, august: 250000000, level: 1, parentId: "bank" },
    { id: "bni-giro", label: "BNI Giro", july: 150000000, august: 150000000, level: 2, parentId: "bni" },
    { id: "bni-tabungan", label: "BNI Tabungan", july: 100000000, august: 100000000, level: 2, parentId: "bni" },
    { id: "bri", label: "BRI - REK 0026-01-001159-30-3", july: 180000000, august: 180000000, level: 1, parentId: "bank" },
    { id: "mandiri-giro", label: "BANK MANDIRI (GIRO) - REK 140-00-1417676-3", july: 320000000, august: 320000000, level: 1, parentId: "bank" },
    { id: "mandiri", label: "BANK MANDIRI - REK 140-00-1400-666-6222", july: 160444129, august: 160444129, level: 1, parentId: "bank" },
    { id: "mandiri-escrow", label: "MANDIRI ESCROW 178000401315", july: 0, august: 0, level: 1, parentId: "bank" },
    { id: "piutang", label: "Piutang", july: 5964450100, august: 5964450100, level: 0 },
    { id: "piutang-usaha", label: "Piutang Usaha", july: 5785285132, august: 5785285132, level: 1, parentId: "piutang" },
    { id: "piutang-usaha-lokal", label: "Piutang Usaha Lokal", july: 4000000000, august: 4000000000, level: 2, parentId: "piutang-usaha" },
    { id: "piutang-usaha-ekspor", label: "Piutang Usaha Ekspor", july: 1785285132, august: 1785285132, level: 2, parentId: "piutang-usaha" },
    { id: "piutang-usaha-lokal-jakarta", label: "Piutang Usaha Lokal Jakarta", july: 2500000000, august: 2500000000, level: 3, parentId: "piutang-usaha-lokal" },
    { id: "piutang-usaha-lokal-surabaya", label: "Piutang Usaha Lokal Surabaya", july: 1500000000, august: 1500000000, level: 3, parentId: "piutang-usaha-lokal" },
    { id: "piutang-direksi", label: "Piutang Direksi", july: 0, august: 0, level: 1, parentId: "piutang" },
    { id: "piutang-karyawan", label: "Piutang Karyawan", july: 179164968, august: 179164968, level: 1, parentId: "piutang" },
    { id: "piutang-lainnya", label: "Piutang Lainnya", july: 0, august: 0, level: 1, parentId: "piutang" },
    {
      id: "total-aset-lancar",
      label: "Total Aset Lancar",
      july: 25180213079,
      august: 25180213079,
      isBold: true,
      level: 0
    },
    { id: "investasi", label: "Investasi", july: 20500000000, august: 20500000000, level: 0 },
    {
      id: "total-investasi",
      label: "Total Investasi",
      july: 20500000000,
      august: 20500000000,
      isBold: true,
      level: 0
    },
    { id: "aset-tetap", label: "Aset Tetap", july: 30391897894, august: 30391897894, level: 0 },
    { id: "tanah-bangunan", label: "Tanah & Bangunan", july: 9514985504, august: 9514985504, level: 1, parentId: "aset-tetap" },
    { id: "peralatan-proyek", label: "Peralatan Proyek", july: 20876912390, august: 20876912390, level: 1, parentId: "aset-tetap" },
    {
      id: "total-aset-tetap",
      label: "Total Aset Tetap",
      july: 18486798703,
      august: 18486798703,
      isBold: true,
      level: 0
    },
    {
      id: "jumlah-aset",
      label: "JUMLAH ASET",
      july: 64167011782,
      august: 64167011782,
      isTotal: true,
      isBold: true,
      level: 0
    },
  ];

  const passivaRows: BalanceRow[] = [
    { id: "kewajiban", label: "Kewajiban", july: 18338641050, august: 18338641050, level: 0 },
    { id: "hutang-uang-muka", label: "Hutang Uang Muka Pembelian", july: 0, august: 0, level: 1, parentId: "kewajiban" },
    { id: "hutang-usaha", label: "Hutang Usaha", july: 14927029616, august: 14927029616, level: 1, parentId: "kewajiban" },
    { id: "hutang-usaha-lokal", label: "Hutang Usaha Lokal", july: 10000000000, august: 10000000000, level: 2, parentId: "hutang-usaha" },
    { id: "hutang-usaha-impor", label: "Hutang Usaha Impor", july: 4927029616, august: 4927029616, level: 2, parentId: "hutang-usaha" },
    { id: "hutang-usaha-lokal-supplier-a", label: "Hutang Usaha Lokal Supplier A", july: 6000000000, august: 6000000000, level: 3, parentId: "hutang-usaha-lokal" },
    { id: "hutang-usaha-lokal-supplier-b", label: "Hutang Usaha Lokal Supplier B", july: 4000000000, august: 4000000000, level: 3, parentId: "hutang-usaha-lokal" },
    { id: "hutang-karyawan", label: "Hutang Karyawan", july: 248444775, august: 248444775, level: 1, parentId: "kewajiban" },
    { id: "hutang-gaji", label: "Hutang Gaji", july: 150000000, august: 150000000, level: 2, parentId: "hutang-karyawan" },
    { id: "hutang-tunjangan", label: "Hutang Tunjangan", july: 98444775, august: 98444775, level: 2, parentId: "hutang-karyawan" },
    { id: "hutang-direksi", label: "Hutang Direksi", july: 0, august: 0, level: 1, parentId: "kewajiban" },
    { id: "hutang-pihak-3", label: "Hutang Kepada Pihak ke-3", july: 11760000, august: 11760000, level: 1, parentId: "kewajiban" },
    { id: "hutang-bank", label: "Hutang Bank", july: 0, august: 0, level: 1, parentId: "kewajiban" },
    {
      id: "total-kewajiban",
      label: "Total Kewajiban",
      july: 18338641050,
      august: 18338641050,
      isBold: true,
      level: 0
    },
    { id: "modal", label: "Modal", july: 45828370732, august: 45828370732, level: 0 },
    { id: "modal-dasar", label: "Modal Dasar", july: 15000000000, august: 15000000000, level: 1, parentId: "modal" },
    { id: "modal-disetor", label: "Modal Disetor", july: 12000000000, august: 12000000000, level: 2, parentId: "modal-dasar" },
    { id: "modal-belum-disetor", label: "Modal Belum Disetor", july: 3000000000, august: 3000000000, level: 2, parentId: "modal-dasar" },
    { id: "laba-ditahan", label: "Laba Ditahan", july: 25209466205, august: 25209466205, level: 1, parentId: "modal" },
    { id: "laba-ditahan-2023", label: "Laba Ditahan 2023", july: 15000000000, august: 15000000000, level: 2, parentId: "laba-ditahan" },
    { id: "laba-ditahan-2024", label: "Laba Ditahan 2024", july: 10209466205, august: 10209466205, level: 2, parentId: "laba-ditahan" },
    { id: "laba-tahun-berjalan", label: "Laba Tahun Berjalan", july: 5618904527, august: 5618904527, level: 1, parentId: "modal" },
    { id: "laba-q1", label: "Laba Q1", july: 1500000000, august: 1500000000, level: 2, parentId: "laba-tahun-berjalan" },
    { id: "laba-q2", label: "Laba Q2", july: 1800000000, august: 1800000000, level: 2, parentId: "laba-tahun-berjalan" },
    { id: "laba-q3", label: "Laba Q3", july: 1318904527, august: 1318904527, level: 2, parentId: "laba-tahun-berjalan" },
    { id: "laba-q4", label: "Laba Q4", july: 1000000000, august: 1000000000, level: 2, parentId: "laba-tahun-berjalan" },
    { id: "deviden", label: "Deviden", july: 0, august: 0, level: 1, parentId: "modal" },
    {
      id: "total-modal",
      label: "Total Modal",
      july: 45828370732,
      august: 45828370732,
      isBold: true,
      level: 0
    },
    {
      id: "jumlah-passiva",
      label: "JUMLAH PASSIVA",
      july: 64167011782,
      august: 64167011782,
      isTotal: true,
      isBold: true,
      level: 0
    },
  ];

  // Filter data berdasarkan level
  const filteredAsetRows = useMemo(() => {
    if (filterLevel === "all") return asetRows;
    if (filterLevel === "level1") return asetRows.filter(row => row.level === 0);
    if (filterLevel === "level2") return asetRows.filter(row => row.level === 1);
    if (filterLevel === "level3") return asetRows.filter(row => row.level === 2);
    if (filterLevel === "level4") return asetRows.filter(row => row.level === 3);
    return asetRows;
  }, [filterLevel]);

  const filteredPassivaRows = useMemo(() => {
    if (filterLevel === "all") return passivaRows;
    if (filterLevel === "level1") return passivaRows.filter(row => row.level === 0);
    if (filterLevel === "level2") return passivaRows.filter(row => row.level === 1);
    if (filterLevel === "level3") return passivaRows.filter(row => row.level === 2);
    if (filterLevel === "level4") return passivaRows.filter(row => row.level === 3);
    return passivaRows;
  }, [filterLevel]);

  const maxRows = Math.max(filteredAsetRows.length, filteredPassivaRows.length);
  const pairedRows = useMemo(
    () =>
      Array.from({ length: maxRows }).map((_, i) => ({
        left: filteredAsetRows[i],
        right: filteredPassivaRows[i],
        key: i,
      })),
    [maxRows, filteredAsetRows, filteredPassivaRows]
  );

  const handleExport = (type: "excel" | "csv" | "pdf") => {
    alert(
      `Mengekspor data Neraca ke format ${type}... (Fungsionalitas ini adalah placeholder)`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LAPORAN NERACA
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Accounting
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Neraca</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Bar: Search, Filter, Export */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari keterangan atau akun..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="all">Semua Level</option>
              <option value="level1">Level 1 / Utama</option>
              <option value="level2">Level 2</option>
              <option value="level3">Level 3</option>
            </select>
          </div>

          <div className="flex justify-end items-center w-full">
            <div className="flex space-x-3">
              <button
                onClick={() => handleExport("excel")}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-green-500 text-white hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FileText className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FileDown className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Neraca Table (ASET vs PASSIVA) */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-200"
                    colSpan={3}
                  >
                    ASET
                  </th>
                  <th
                    className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-l border-gray-200"
                    colSpan={3}
                  >
                    PASSIVA
                  </th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-r border-gray-200">
                    Deskripsi
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 border-r border-gray-200">
                    July
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 border-r border-gray-300">
                    August
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-l border-gray-300">
                    Deskripsi
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 border-r border-gray-200">
                    July
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                    August
                  </th>
                </tr>
              </thead>
              <tbody>
                {pairedRows.map(({ left, right, key }) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td
                      className={`px-4 py-2 border-r border-gray-200 ${
                        left?.isBold ? "font-semibold" : ""
                      } ${left?.isTotal ? "bg-yellow-100 uppercase" : ""} ${
                        left?.level === 0 ? "text-gray-900 font-medium" :
                        left?.level === 1 ? "text-blue-700" : 
                        left?.level === 2 ? "text-green-700" : 
                        left?.level === 3 ? "text-purple-700" : "text-gray-800"
                      }`}
                    >
                      {left ? (
                        <span>
                          {getIndentation(left.level)}
                          {left.level === 1 && "- "}
                          {left.level === 2 && "• "}
                          {left.level === 3 && "◦ "}
                          {left.label}
                        </span>
                      ) : ""}
                    </td>
                    <td
                      className={`px-4 py-2 text-right border-r border-gray-200 ${
                        left?.isBold ? "font-semibold" : ""
                      } ${left?.isTotal ? "bg-yellow-100" : ""}`}
                    >
                      {left ? formatNumber(left.july) : ""}
                    </td>
                    <td
                      className={`px-4 py-2 text-right border-r border-gray-300 ${
                        left?.isBold ? "font-semibold" : ""
                      } ${left?.isTotal ? "bg-yellow-100" : ""}`}
                    >
                      {left ? formatNumber(left.august) : ""}
                    </td>
                    <td
                      className={`px-4 py-2 border-l border-gray-300 ${
                        right?.isBold ? "font-semibold" : ""
                      } ${right?.isTotal ? "bg-yellow-100 uppercase" : ""} ${
                        right?.level === 0 ? "text-gray-900 font-medium" :
                        right?.level === 1 ? "text-blue-700" : 
                        right?.level === 2 ? "text-green-700" : 
                        right?.level === 3 ? "text-purple-700" : "text-gray-800"
                      }`}
                    >
                      {right ? (
                        <span>
                          {getIndentation(right.level)}
                          {right.level === 1 && "- "}
                          {right.level === 2 && "• "}
                          {right.level === 3 && "◦ "}
                          {right.label}
                        </span>
                      ) : ""}
                    </td>
                    <td
                      className={`px-4 py-2 text-right border-r border-gray-200 ${
                        right?.isBold ? "font-semibold" : ""
                      } ${right?.isTotal ? "bg-yellow-100" : ""}`}
                    >
                      {right ? formatNumber(right.july) : ""}
                    </td>
                    <td
                      className={`px-4 py-2 text-right ${
                        right?.isBold ? "font-semibold" : ""
                      } ${right?.isTotal ? "bg-yellow-100" : ""}`}
                    >
                      {right ? formatNumber(right.august) : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeracaDashboard;
