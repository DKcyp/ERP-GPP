import React from 'react';
import { Menu } from 'lucide-react'; // For the chart menu icon

const DashboardKPIDashboard: React.FC = () => {
  const kpiData = [
    { month: 'Jan', value: 8 },
    { month: 'Feb', value: 19 },
    { month: 'Mar', value: 30 },
    { month: 'Apr', value: 19 },
    { month: 'May', value: 10 },
    { month: 'Jun', value: 19 },
    { month: 'Jul', value: 30 },
    { month: 'Aug', value: 19 },
    { month: 'Sep', value: 10 },
    { month: 'Oct', value: 19 },
    { month: 'Nov', value: 30 },
    { month: 'Dec', value: 19 },
  ];

  const maxValue = 32; // Max value for Y-axis

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-8">
          Dashboard KPI
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KPI Chart Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">KPI</h3>
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="relative h-80">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-sm text-gray-500 pr-4">
                <span>{maxValue}</span>
                <span>{maxValue * 3 / 4}</span>
                <span>{maxValue / 2}</span>
                <span>{maxValue / 4}</span>
                <span>0</span>
              </div>

              {/* Grid lines */}
              <div className="absolute left-12 right-0 top-0 bottom-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((_, i) => (
                  <hr key={i} className="border-t border-gray-200" />
                ))}
              </div>

              {/* Bars */}
              <div className="absolute left-12 right-0 bottom-0 h-full flex items-end justify-around space-x-2 px-2">
                {kpiData.map((item, index) => (
                  <div
                    key={item.month}
                    className="flex flex-col items-center justify-end h-full"
                    style={{ width: `${100 / kpiData.length}%` }}
                  >
                    <div
                      className="w-4/5 bg-blue-600 rounded-t-md transition-all duration-700 ease-out hover:opacity-80"
                      style={{ height: `${(item.value / maxValue) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KPI Achievement Section */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Pencapaian KPI</h3>

            <div className="space-y-4">
              {/* Bulan Ini */}
              <div className="bg-purple-100 rounded-xl p-5 text-center shadow-sm">
                <p className="text-lg font-medium text-purple-800 mb-1">Pencapaian KPI Bulan Ini</p>
                <p className="text-4xl font-extrabold text-purple-900">100%</p>
              </div>

              {/* Terendah */}
              <div className="bg-red-100 rounded-xl p-5 text-center shadow-sm">
                <p className="text-lg font-medium text-red-800 mb-1">Pencapaian KPI Terendah</p>
                <p className="text-4xl font-extrabold text-red-900">10%</p>
              </div>

              {/* Tertinggi */}
              <div className="bg-green-100 rounded-xl p-5 text-center shadow-sm">
                <p className="text-lg font-medium text-green-800 mb-1">Pencapaian KPI Tertinggi</p>
                <p className="text-4xl font-extrabold text-green-900">100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKPIDashboard;
