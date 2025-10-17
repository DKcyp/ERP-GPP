import React, { useState } from "react";
import { Clock, FileSpreadsheet, FileDown, FileText } from "lucide-react";

interface RasioData {
  kategori: string;
  deskripsi: string;
  monthlyValues: { month: string; value: number }[];
}

const JurnalRasioKeuanganDashboard: React.FC = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0"); // "01" for Jan, "12" for Dec

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [startDate, setStartDate] = useState(`${currentYear}-${currentMonth}`);
  const [endDate, setEndDate] = useState(`${currentYear}-${currentMonth}`);

  const rasioData: RasioData[] = [
    {
      kategori: "Current Ratio (Aset Lancar / Hutang Lancar)",
      deskripsi:
        "Menunjukkan perbandingan aset lancar dengan hutang lancar\nSemakin tinggi semakin baik likuiditasnya",
      monthlyValues: [
        { month: "01", value: 1 },
        { month: "02", value: 1 },
        { month: "03", value: 1 },
        { month: "04", value: 1 },
        { month: "05", value: 1 },
        { month: "06", value: 1 },
      ],
    },
    {
      kategori: "Working Capital / Modal Kerja (Aset Lancar - Hutang Lancar)",
      deskripsi:
        "Mengukur modal kerja bersih, perlu dibandingkan per tahun\nSemakin besar semakin baik",
      monthlyValues: [
        { month: "01", value: 6841572030 },
        { month: "02", value: 6841572030 },
        { month: "03", value: 6841572030 },
        { month: "04", value: 6841572030 },
        { month: "05", value: 6841572030 },
        { month: "06", value: 6841572030 },
      ],
    },
    {
      kategori: "Assets-to-Equity Ratio (Total Assets / Modal)",
      deskripsi: "Mengukur total aset terhadap modal",
      monthlyValues: [
        { month: "01", value: 1 },
        { month: "02", value: 1 },
        { month: "03", value: 1 },
        { month: "04", value: 1 },
        { month: "05", value: 1 },
        { month: "06", value: 1 },
      ],
    },
    {
      kategori: "Debt Ratio (Total Kewajiban / Total Assets)",
      deskripsi:
        "Mengukur besarnya dana yang berasal dari utang\nSemakin kecil rasionya, maka semakin aman (solvable)",
      monthlyValues: [
        { month: "01", value: 0 },
        { month: "02", value: 0 },
        { month: "03", value: 0 },
        { month: "04", value: 0 },
        { month: "05", value: 0 },
        { month: "06", value: 0 },
      ],
    },
    {
      kategori: "Debt-to-Equity Ratio (Total Hutang/ Modal)",
      deskripsi:
        "Mengukur utang yang dimiliki dengan modal sendiri\nSemakin kecil utang akan semakin baik dan aman\nRasio wajar menurut pajak 1:4",
      monthlyValues: [
        { month: "01", value: 2 },
        { month: "02", value: 2 },
        { month: "03", value: 2 },
        { month: "04", value: 2 },
        { month: "05", value: 2 },
        { month: "06", value: 2 },
      ],
    },
  ];

  const monthNames: { [key: string]: string } = {
    "01": "Januari",
    "02": "Februari",
    "03": "Maret",
    "04": "April",
    "05": "Mei",
    "06": "Juni",
    "07": "Juli",
    "08": "Agustus",
    "09": "September",
    "10": "Oktober",
    "11": "November",
    "12": "Desember",
  };

  const getMonthIndex = (monthString: string) => {
    const [, month] = monthString.split("-");
    return parseInt(month, 10);
  };

  const filteredMonths = Object.keys(monthNames).filter((monthKey) => {
    const startMonthIndex = getMonthIndex(startDate);
    const endMonthIndex = getMonthIndex(endDate);
    const currentMonthIndex = parseInt(monthKey, 10);

    return (
      currentMonthIndex >= startMonthIndex && currentMonthIndex <= endMonthIndex
    );
  });

  const formatNumber = (num: number) => {
    // Format sebagai mata uang Rupiah untuk angka besar
    if (num >= 1000000) {
      return `Rp ${num.toLocaleString("id-ID")}`;
    }
    return num.toString();
  };

  const getRowColor = (index: number) => {
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Rasio Keuangan KEUANGAN
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Accounting
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Jurnal
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Rasio Keuangan
                </span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dari Bulan
                </label>
                <input
                  type="month"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sampai Bulan
                </label>
                <input
                  type="month"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 text-sm shadow-md">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 text-sm shadow-md">
                <FileDown className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Rasio Keuangan Tahun {selectedYear}
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider border-r border-green-600">
                    RASIO KEUANGAN
                  </th>
                  {filteredMonths.map((monthKey) => (
                    <th
                      key={monthKey}
                      className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider border-r border-green-600"
                    >
                      {monthNames[monthKey]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rasioData.map((item, index) => (
                  <tr
                    key={index}
                    className={`${getRowColor(
                      index
                    )} hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-4 py-4 border-r border-gray-200">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm mb-1">
                          {item.kategori}
                        </div>
                        <div className="text-xs text-gray-600 whitespace-pre-line">
                          {item.deskripsi}
                        </div>
                      </div>
                    </td>
                    {filteredMonths.map((monthKey) => {
                      const monthValue = item.monthlyValues.find(
                        (mv) => mv.month === monthKey
                      );
                      return (
                        <td
                          key={monthKey}
                          className="px-4 py-4 text-center text-sm font-medium text-gray-900 border-r border-gray-200 whitespace-nowrap"
                        >
                          {monthValue && monthValue.value >= 1000000
                            ? formatNumber(monthValue.value)
                            : monthValue?.value || 0}
                        </td>
                      );
                    })}
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

export default JurnalRasioKeuanganDashboard;
