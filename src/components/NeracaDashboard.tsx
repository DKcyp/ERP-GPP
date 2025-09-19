import React, { useState } from "react";
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
  const [filterPeriod, setFilterPeriod] = useState("Juli 2025"); // Default filter

  const [neracaData] = useState<NeracaEntry[]>([
    {
      id: "1",
      periode: "2025-07",
      akun: "11100000",
      namaAkun: "KAS",
      mu: "IDR",
      debitMu: 42370,
      kreditMu: 0,
      debit: 42370393,
      kredit: 0,
      keterangan: "Kas perusahaan",
    },
    {
      id: "2",
      periode: "2025-07",
      akun: "112001000",
      namaAkun: "BNI - REK.5520140008",
      mu: "IDR",
      debitMu: 21570197,
      kreditMu: 0,
      debit: 21570196765,
      kredit: 0,
      keterangan: "Rekening bank BNI",
    },
  ]);

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
              <option value="Juli 2025">Juli 2025</option>
              <option value="Juni 2025">Juni 2025</option>
              <option value="Mei 2025">Mei 2025</option>
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

        {/* Neraca Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Kode Akun
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Nama Akun
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    MU
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Debet (MU)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Kredit (MU)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Debet (Rp.)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Kredit (Rp.)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Keterangan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Periode
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {neracaData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                      {row.akun}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {row.namaAkun}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {row.mu}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {row.debitMu.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {row.kreditMu.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      Rp {row.debit.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      Rp {row.kredit.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {row.keterangan}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {row.periode.split("-").reverse().join("/")}
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
