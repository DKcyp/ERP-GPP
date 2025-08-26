import React from 'react';
import { Home, DollarSign, FileText, ArrowDownCircle, ArrowUpCircle, Clock } from 'lucide-react';

const TaxMainDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                TAX DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Tax</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Main Dashboard</span>
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ArrowDownCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Pajak Masukan</p>
                <p className="text-3xl font-bold text-gray-900">Rp 125.000.000</p>
                <p className="text-sm text-green-600 font-medium">+10% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <ArrowUpCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Pajak Keluaran</p>
                <p className="text-3xl font-bold text-gray-900">Rp 180.000.000</p>
                <p className="text-sm text-green-600 font-medium">+15% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total PPh 21</p>
                <p className="text-3xl font-bold text-gray-900">Rp 35.000.000</p>
                <p className="text-sm text-red-600 font-medium">-5% dari bulan lalu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tax Activities */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Tax Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'Pajak Masukan recorded', detail: 'PT Maju Jaya (PPN 11%)', time: '3 hours ago', type: 'info' },
              { action: 'Pajak Keluaran generated', detail: 'Project Alpha (PPN 11%)', time: 'Yesterday', type: 'success' },
              { action: 'PPh 21 payment processed', detail: 'Karyawan Bulan Ini', time: '2 days ago', type: 'warning' },
              { action: 'New vendor added for Pajak Masukan', detail: 'CV Solusi Digital', time: '3 days ago', type: 'info' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.detail}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxMainDashboard;
