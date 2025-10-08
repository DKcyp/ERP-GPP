import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  ChevronRight,
  X,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";

interface BiayaItem {
  kode: string;
  namaBiaya: string;
  januari: number;
  februari: number;
  maret: number;
  april: number;
  mei: number;
  juni: number;
  juli: number;
  agustus: number;
  september: number;
  oktober: number;
  november: number;
  desember: number;
  total: number;
  persentase: number;
  kategori: string;
}

const sampleBiayaData: BiayaItem[] = [
  {
    kode: "6001",
    namaBiaya: "Biaya Gaji Karyawan",
    januari: 150000000,
    februari: 150000000,
    maret: 155000000,
    april: 155000000,
    mei: 160000000,
    juni: 160000000,
    juli: 165000000,
    agustus: 165000000,
    september: 170000000,
    oktober: 170000000,
    november: 175000000,
    desember: 180000000,
    total: 1955000000,
    persentase: 35.2,
    kategori: "Biaya Operasional",
  },
  {
    kode: "6002",
    namaBiaya: "Biaya Sewa Kantor",
    januari: 50000000,
    februari: 50000000,
    maret: 50000000,
    april: 50000000,
    mei: 50000000,
    juni: 50000000,
    juli: 55000000,
    agustus: 55000000,
    september: 55000000,
    oktober: 55000000,
    november: 55000000,
    desember: 55000000,
    total: 630000000,
    persentase: 11.3,
    kategori: "Biaya Operasional",
  },
  {
    kode: "6003",
    namaBiaya: "Biaya Listrik & Air",
    januari: 15000000,
    februari: 16000000,
    maret: 17000000,
    april: 18000000,
    mei: 19000000,
    juni: 20000000,
    juli: 22000000,
    agustus: 21000000,
    september: 20000000,
    oktober: 19000000,
    november: 18000000,
    desember: 17000000,
    total: 222000000,
    persentase: 4.0,
    kategori: "Biaya Utilitas",
  },
  {
    kode: "6004",
    namaBiaya: "Biaya Transportasi",
    januari: 25000000,
    februari: 27000000,
    maret: 26000000,
    april: 28000000,
    mei: 30000000,
    juni: 32000000,
    juli: 35000000,
    agustus: 33000000,
    september: 31000000,
    oktober: 29000000,
    november: 28000000,
    desember: 30000000,
    total: 354000000,
    persentase: 6.4,
    kategori: "Biaya Operasional",
  },
  {
    kode: "6005",
    namaBiaya: "Biaya Pemasaran",
    januari: 40000000,
    februari: 42000000,
    maret: 45000000,
    april: 48000000,
    mei: 50000000,
    juni: 55000000,
    juli: 60000000,
    agustus: 58000000,
    september: 56000000,
    oktober: 54000000,
    november: 52000000,
    desember: 65000000,
    total: 625000000,
    persentase: 11.2,
    kategori: "Biaya Pemasaran",
  },
  {
    kode: "6006",
    namaBiaya: "Biaya Pemeliharaan",
    januari: 20000000,
    februari: 22000000,
    maret: 21000000,
    april: 23000000,
    mei: 25000000,
    juni: 27000000,
    juli: 30000000,
    agustus: 28000000,
    september: 26000000,
    oktober: 24000000,
    november: 23000000,
    desember: 25000000,
    total: 294000000,
    persentase: 5.3,
    kategori: "Biaya Pemeliharaan",
  },
  {
    kode: "6007",
    namaBiaya: "Biaya Administrasi",
    januari: 12000000,
    februari: 13000000,
    maret: 12500000,
    april: 14000000,
    mei: 15000000,
    juni: 16000000,
    juli: 17000000,
    agustus: 16500000,
    september: 15500000,
    oktober: 14500000,
    november: 14000000,
    desember: 15000000,
    total: 175000000,
    persentase: 3.1,
    kategori: "Biaya Administrasi",
  },
  {
    kode: "6008",
    namaBiaya: "Biaya Penyusutan",
    januari: 30000000,
    februari: 30000000,
    maret: 30000000,
    april: 30000000,
    mei: 30000000,
    juni: 30000000,
    juli: 30000000,
    agustus: 30000000,
    september: 30000000,
    oktober: 30000000,
    november: 30000000,
    desember: 30000000,
    total: 360000000,
    persentase: 6.5,
    kategori: "Biaya Non-Operasional",
  },
];

const GrafikLabaRugiDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2024");
  const [selectedBiaya, setSelectedBiaya] = useState<BiayaItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const bulanNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const totalBiaya = sampleBiayaData.reduce((sum, item) => sum + item.total, 0);

  const handleBiayaClick = (biaya: BiayaItem) => {
    setSelectedBiaya(biaya);
    setShowDetailModal(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getMonthlyData = (biaya: BiayaItem) => {
    return [
      biaya.januari,
      biaya.februari,
      biaya.maret,
      biaya.april,
      biaya.mei,
      biaya.juni,
      biaya.juli,
      biaya.agustus,
      biaya.september,
      biaya.oktober,
      biaya.november,
      biaya.desember,
    ];
  };

  const getMaxValue = () => {
    let max = 0;
    sampleBiayaData.forEach((biaya) => {
      const monthlyData = getMonthlyData(biaya);
      const localMax = Math.max(...monthlyData);
      if (localMax > max) max = localMax;
    });
    return max;
  };

  const maxValue = getMaxValue();

  const handleExport = (type: string) => {
    alert(`Export ${type} - Grafik Laba Rugi`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Style Master Barang */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-wide mb-2">
                GRAFIK PERGERAKAN BIAYA
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Accounting
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Grafik
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Grafik Pergerakan Biaya</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Total Biaya
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalBiaya)}
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>Tahun {selectedPeriod}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Kategori Biaya
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {sampleBiayaData.length}
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>Item Biaya</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Biaya Tertinggi
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {sampleBiayaData[0].namaBiaya}
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>{formatCurrency(sampleBiayaData[0].total)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <PieChart className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Rata-rata/Bulan
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalBiaya / 12)}
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>Per Bulan</span>
            </div>
          </div>
        </div>

        {/* Filter & Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Grafik
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setChartType("bar")}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                      chartType === "bar"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Bar</span>
                  </button>
                  <button
                    onClick={() => setChartType("line")}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                      chartType === "line"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <LineChart className="h-4 w-4" />
                    <span>Line</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleExport("Excel")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> Excel
              </button>
              <button
                onClick={() => handleExport("PDF")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> PDF
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-5 w-5 mr-2" /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Grafik Pergerakan Biaya Per Bulan
          </h2>

          {/* Chart Area */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Y-axis labels */}
              <div className="flex">
                <div className="w-32 flex flex-col justify-between pr-4 text-right text-sm text-gray-500">
                  <span>{formatCurrency(maxValue)}</span>
                  <span>{formatCurrency(maxValue * 0.75)}</span>
                  <span>{formatCurrency(maxValue * 0.5)}</span>
                  <span>{formatCurrency(maxValue * 0.25)}</span>
                  <span>Rp 0</span>
                </div>

                {/* Chart bars */}
                <div className="flex-1">
                  <div className="h-96 flex items-end space-x-4 border-l border-b border-gray-300 pl-4 pb-4">
                    {bulanNames.map((bulan, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div className="w-full relative" style={{ height: "100%" }}>
                          {sampleBiayaData.map((biaya, biayaIdx) => {
                            const monthlyData = getMonthlyData(biaya);
                            const value = monthlyData[idx];
                            const heightPercent = (value / maxValue) * 100;
                            const colors = [
                              "bg-blue-500",
                              "bg-purple-500",
                              "bg-green-500",
                              "bg-orange-500",
                              "bg-pink-500",
                              "bg-indigo-500",
                              "bg-yellow-500",
                              "bg-red-500",
                            ];

                            return (
                              <div
                                key={biayaIdx}
                                className={`absolute bottom-0 ${
                                  colors[biayaIdx % colors.length]
                                } hover:opacity-80 cursor-pointer transition-all rounded-t-lg group`}
                                style={{
                                  height: `${heightPercent}%`,
                                  width: `${100 / sampleBiayaData.length}%`,
                                  left: `${(biayaIdx * 100) / sampleBiayaData.length}%`,
                                }}
                                onClick={() => handleBiayaClick(biaya)}
                                title={`${biaya.namaBiaya}: ${formatCurrency(value)}`}
                              >
                                <div className="hidden group-hover:block absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                                  <div className="font-semibold">{biaya.namaBiaya}</div>
                                  <div>{formatCurrency(value)}</div>
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                    <div className="border-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-xs text-gray-600 mt-2">{bulan}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4">
            {sampleBiayaData.map((biaya, idx) => {
              const colors = [
                "bg-blue-500",
                "bg-purple-500",
                "bg-green-500",
                "bg-orange-500",
                "bg-pink-500",
                "bg-indigo-500",
                "bg-yellow-500",
                "bg-red-500",
              ];
              return (
                <button
                  key={idx}
                  onClick={() => handleBiayaClick(biaya)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded ${colors[idx % colors.length]}`}
                  ></div>
                  <span className="text-sm text-gray-700">{biaya.namaBiaya}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Detail Biaya Per Kategori
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Biaya
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Biaya
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Persentase
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleBiayaData.map((biaya, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleBiayaClick(biaya)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {biaya.kode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {biaya.namaBiaya}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {biaya.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {formatCurrency(biaya.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${biaya.persentase}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{biaya.persentase}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBiayaClick(biaya);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-sm font-bold text-gray-900"
                  >
                    TOTAL
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    {formatCurrency(totalBiaya)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-center">
                    100%
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBiaya && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Detail Biaya
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedBiaya.namaBiaya} ({selectedBiaya.kode})
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Biaya</div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(selectedBiaya.total)}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Persentase</div>
                  <div className="text-xl font-bold text-purple-600">
                    {selectedBiaya.persentase}%
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Rata-rata/Bulan</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(selectedBiaya.total / 12)}
                  </div>
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Rincian Per Bulan
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {bulanNames.map((bulan, idx) => {
                    const monthlyData = getMonthlyData(selectedBiaya);
                    const value = monthlyData[idx];
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <div className="text-sm text-gray-600 mb-1">{bulan}</div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(value)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Analisis Trend
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Kategori:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedBiaya.kategori}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bulan Tertinggi:</span>
                    <span className="font-semibold text-gray-900">
                      {bulanNames[11]} - {formatCurrency(selectedBiaya.desember)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bulan Terendah:</span>
                    <span className="font-semibold text-gray-900">
                      {bulanNames[0]} - {formatCurrency(selectedBiaya.januari)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => alert("Export detail biaya")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Detail</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrafikLabaRugiDashboard;
