import React from 'react';
import { Clock, ReceiptText, BarChart2, TrendingUp, DollarSign } from 'lucide-react'; // Changed FileInvoice to ReceiptText

const ProconOverviewDashboard: React.FC = () => {
  const totalInvoices = 125;
  const pendingInvoices = 30;
  const paidInvoices = 95;

  const invoiceProjectionData = [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 150 },
    { month: 'Mar', value: 130 },
    { month: 'Apr', value: 180 },
    { month: 'May', value: 160 },
    { month: 'Jun', value: 200 },
  ];

  const profitLossData = [
    { month: 'Jan', profit: 25, loss: 10 },
    { month: 'Feb', profit: 30, loss: 12 },
    { month: 'Mar', profit: 28, loss: 15 },
    { month: 'Apr', profit: 35, loss: 10 },
    { month: 'May', profit: 32, loss: 13 },
    { month: 'Jun', profit: 40, loss: 8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                PROCON OVERVIEW DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Procon</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Overview Dashboard</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ReceiptText className="h-8 w-8 text-blue-600" /> {/* Changed FileInvoice to ReceiptText */}
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Invoices Created</p>
                <p className="text-3xl font-bold text-gray-900">{totalInvoices}</p>
                <p className="text-sm text-gray-600 font-medium">Total invoices across all projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <ReceiptText className="h-8 w-8 text-yellow-600" /> {/* Changed FileInvoice to ReceiptText */}
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Invoices</p>
                <p className="text-3xl font-bold text-gray-900">{pendingInvoices}</p>
                <p className="text-sm text-yellow-600 font-medium">Awaiting payment</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <ReceiptText className="h-8 w-8 text-green-600" /> {/* Changed FileInvoice to ReceiptText */}
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Paid Invoices</p>
                <p className="text-3xl font-bold text-gray-900">{paidInvoices}</p>
                <p className="text-sm text-green-600 font-medium">Successfully settled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estimasi Invoice Penagihan Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-blue-600" />
            <span>Estimasi Invoice Penagihan (Bulanan)</span>
          </h3>
          <div className="h-64 flex items-end justify-center space-x-4">
            {invoiceProjectionData.map((item, index) => (
              <div key={item.month} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-12 bg-blue-500 rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80`}
                  style={{ height: `${item.value * 0.8}px` }}
                ></div>
                <span className="text-sm text-gray-600 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Realtime Laba Rugi Proyek Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <span>Realtime Laba Rugi Proyek (Juta Rupiah)</span>
          </h3>
          <div className="h-64 flex items-end justify-center space-x-4">
            {profitLossData.map((item, index) => (
              <div key={item.month} className="flex flex-col items-center space-y-2">
                <div className="flex items-end h-48">
                  <div
                    className={`w-6 bg-green-500 rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80`}
                    style={{ height: `${item.profit * 3}px` }}
                  ></div>
                  <div
                    className={`w-6 bg-red-500 rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80 ml-1`}
                    style={{ height: `${item.loss * 3}px` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-4 text-sm text-gray-700">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Laba</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Rugi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProconOverviewDashboard;
