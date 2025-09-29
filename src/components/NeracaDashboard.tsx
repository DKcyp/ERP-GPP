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

const NeracaDashboard: React.FC = () => {
  const today = new Date();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("2025"); // Default filter

  // Comparative data for ASET vs PASSIVA (example)
  type BalanceRow = {
    label: string;
    july: number;
    august: number;
    isBold?: boolean;
    isTotal?: boolean;
  };

  const formatNumber = (n: number) =>
    n < 0
      ? `(${Math.abs(n).toLocaleString("id-ID")})`
      : n.toLocaleString("id-ID");

  const asetRows: BalanceRow[] = [
    { label: "Kas", july: 174895077, august: 174895077 },
    { label: "  Kas Besar", july: 150000000, august: 150000000 },
    { label: "  Kas Kecil", july: 24895077, august: 24895077 },
    { label: "Bank", july: 910444129, august: 910444129 },
    { label: "  BNI - REK 5520140008", july: 250000000, august: 250000000 },
    { label: "  BRI - REK 0026-01-001159-30-3", july: 180000000, august: 180000000 },
    { label: "  BANK MANDIRI (GIRO) - REK 140-00-1417676-3", july: 320000000, august: 320000000 },
    { label: "  BANK MANDIRI - REK 140-00-1400-666-6222", july: 160444129, august: 160444129 },
    { label: "  MANDIRI ESCROW 178000401315", july: 0, august: 0 },
    { label: "Piutang Usaha", july: 5785285132, august: 5785285132 },
    { label: "Piutang Direksi", july: 0, august: 0 },
    { label: "Piutang Karyawan", july: 179164968, august: 179164968 },
    { label: "Piutang Lainnya", july: 0, august: 0 },
    {
      label: "Total Aset Lancar",
      july: 25180213079,
      august: 25180213079,
      isBold: true,
    },
    { label: "Investasi", july: 20500000000, august: 20500000000 },
    {
      label: "Total Investasi",
      july: 20500000000,
      august: 20500000000,
      isBold: true,
    },
    { label: "Tanah & Bangunan", july: 9514985504, august: 9514985504 },
    { label: "Peralatan Proyek", july: 20876912390, august: 20876912390 },
    {
      label: "Total Aset Tetap",
      july: 18486798703,
      august: 18486798703,
      isBold: true,
    },
    {
      label: "JUMLAH ASET",
      july: 64167011782,
      august: 64167011782,
      isTotal: true,
      isBold: true,
    },
  ];

  const passivaRows: BalanceRow[] = [
    { label: "Hutang Uang Muka Pembelian", july: 0, august: 0 },
    { label: "Hutang Usaha", july: 14927029616, august: 14927029616 },
    { label: "Hutang Karyawan", july: 248444775, august: 248444775 },
    { label: "Hutang Direksi", july: 0, august: 0 },
    { label: "Hutang Kepada Pihak ke -3", july: 11760000, august: 11760000 },
    { label: "Hutang Bank", july: 0, august: 0 },
    {
      label: "Total Kewajiban",
      july: 18338641050,
      august: 18338641050,
      isBold: true,
    },
    { label: "Modal", july: 15000000000, august: 15000000000 },
    { label: "Laba Ditahan", july: 25209466205, august: 25209466205 },
    { label: "Laba Tahun Berjalan", july: 5618904527, august: 5618904527 },
    { label: "Deviden", july: 0, august: 0 },
    {
      label: "Total Modal",
      july: 45828370732,
      august: 45828370732,
      isBold: true,
    },
    {
      label: "JUMLAH PASSIVA",
      july: 64167011782,
      august: 64167011782,
      isTotal: true,
      isBold: true,
    },
  ];

  const maxRows = Math.max(asetRows.length, passivaRows.length);
  const pairedRows = useMemo(
    () =>
      Array.from({ length: maxRows }).map((_, i) => ({
        left: asetRows[i],
        right: passivaRows[i],
        key: i,
      })),
    [maxRows]
  );

  // Removed unused helpers

  // Removed legacy dummy data block

  // Removed unused filtered data

  // CRUD features removed per requirement

  const handleExport = (type: "excel" | "csv" | "pdf") => {
    alert(
      `Mengekspor data Neraca ke format ${type}... (Fungsionalitas ini adalah placeholder)`
    );
    // Di aplikasi nyata, Anda akan mengimplementasikan logika ekspor yang sebenarnya di sini.
    // Ini mungkin melibatkan:
    // 1. Memformat data untuk format yang dipilih.
    // 2. Menggunakan pustaka seperti 'xlsx' untuk Excel, 'papaparse' untuk CSV, atau 'jspdf' untuk PDF.
    // 3. Memicu unduhan file.
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
              {/* Tambahkan periode lain sesuai kebutuhan */}
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
                        left?.isBold ? "font-semibold" : "text-gray-800"
                      } ${left?.isTotal ? "bg-yellow-100 uppercase" : ""}`}
                    >
                      {left ? left.label : ""}
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
                        right?.isBold ? "font-semibold" : "text-gray-800"
                      } ${right?.isTotal ? "bg-yellow-100 uppercase" : ""}`}
                    >
                      {right ? right.label : ""}
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
