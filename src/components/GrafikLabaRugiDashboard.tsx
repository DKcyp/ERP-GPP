import React, { useState } from "react";
import {
  Download,
  RefreshCw,
  ChevronRight,
  X,
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
  const [selectedPeriod] = useState<string>("2024");
  const [selectedBiaya, setSelectedBiaya] = useState<BiayaItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
      {/* Header Section */}
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Grafik Pergerakan Biaya Per Bulan
            </h2>
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

          {/* Chart Area */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="flex">
                <div className="w-32 flex flex-col justify-between pr-4 text-right text-sm text-gray-500">
                  <span>{formatCurrency(maxValue)}</span>
                  <span>{formatCurrency(maxValue * 0.75)}</span>
                  <span>{formatCurrency(maxValue * 0.5)}</span>
                  <span>{formatCurrency(maxValue * 0.25)}</span>
                  <span>Rp 0</span>
                </div>

                <div className="flex-1">
                  <div className="h-96 relative border-l border-b border-gray-300 pl-4 pb-4">
                    <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                      {/* Grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((factor, idx) => (
                        <line
                          key={idx}
                          x1="0"
                          y1={400 - 400 * factor}
                          x2="1000"
                          y2={400 - 400 * factor}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Lines for each biaya */}
                      {sampleBiayaData.map((biaya, biayaIdx) => {
                        const monthlyData = getMonthlyData(biaya);
                        const colors = [
                          "#3b82f6",
                          "#a855f7",
                          "#22c55e",
                          "#f97316",
                          "#ec4899",
                          "#6366f1",
                          "#eab308",
                          "#ef4444",
                        ];

                        const points = monthlyData
                          .map((value, idx) => {
                            const x = (idx / 11) * 1000;
                            const y = 400 - (value / maxValue) * 400;
                            return `${x},${y}`;
                          })
                          .join(" ");

                        return (
                          <g key={biayaIdx}>
                            <polyline
                              points={points}
                              fill="none"
                              stroke={colors[biayaIdx % colors.length]}
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="hover:stroke-[5] cursor-pointer transition-all"
                              onClick={() => handleBiayaClick(biaya)}
                            />

                            {monthlyData.map((value, idx) => {
                              const x = (idx / 11) * 1000;
                              const y = 400 - (value / maxValue) * 400;
                              return (
                                <circle
                                  key={idx}
                                  cx={x}
                                  cy={y}
                                  r="5"
                                  fill={colors[biayaIdx % colors.length]}
                                  className="hover:r-8 cursor-pointer transition-all"
                                  onClick={() => handleBiayaClick(biaya)}
                                >
                                  <title>{`${biaya.namaBiaya}: ${formatCurrency(value)}`}</title>
                                </circle>
                              );
                            })}
                          </g>
                        );
                      })}
                    </svg>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2">
                      {bulanNames.map((bulan, idx) => (
                        <span key={idx} className="text-xs text-gray-600">
                          {bulan}
                        </span>
                      ))}
                    </div>
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
                  <div className={`w-4 h-4 rounded ${colors[idx % colors.length]}`}></div>
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
            <h2 className="text-xl font-bold text-gray-900">Detail Biaya Per Kategori</h2>
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
                  <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900">
                    TOTAL
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    {formatCurrency(totalBiaya)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-center">100%</td>
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
                <h2 className="text-2xl font-bold text-gray-900">Detail Biaya</h2>
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Rincian Per Bulan</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {bulanNames.map((bulan, idx) => {
                    const monthlyData = getMonthlyData(selectedBiaya);
                    const value = monthlyData[idx];
                    return (
                      <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
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
                <h3 className="text-lg font-bold text-gray-900 mb-3">Analisis Trend</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Kategori:</span>
                    <span className="font-semibold text-gray-900">{selectedBiaya.kategori}</span>
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
