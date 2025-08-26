import React from 'react';
import { Clock, ShieldCheck, AlertTriangle, Users, CalendarCheck } from 'lucide-react';

const QHSENewDashboard: React.FC = () => {
  const today = new Date();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                QHSE DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Dashboard</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Perizinan Aktif</p>
                <p className="text-3xl font-bold text-gray-900">48</p>
                <p className="text-sm text-green-600 font-medium">+7% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Perizinan Mendekati Expired</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
                <p className="text-sm text-red-600 font-medium">+2 dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Pegawai Belum MCU</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-green-600 font-medium">-3 dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <CalendarCheck className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Audit Bulan Ini</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <p className="text-sm text-green-600 font-medium">Sesuai target</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Overview Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Compliance Status Overview</h3>
          <div className="h-64 flex items-end justify-center space-x-4">
            {[
              { category: 'Compliant', value: 90, color: 'bg-green-500' },
              { category: 'Warning', value: 15, color: 'bg-yellow-500' },
              { category: 'Critical', value: 5, color: 'bg-red-500' }
            ].map((item, index) => (
              <div key={item.category} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-20 ${item.color} rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80`}
                  style={{ height: `${item.value * 2.5}px` }}
                ></div>
                <span className="text-sm text-gray-600 font-medium text-center">{item.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent QHSE Activities */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent QHSE Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'Perizinan Alat "Forklift A" diperbarui', detail: 'Berlaku hingga 2025-12-31', time: '3 hours ago', type: 'success' },
              { action: 'MCU Pegawai "Budi Santoso" akan expired', detail: 'Masa berlaku sisa 45 hari', time: 'Yesterday', type: 'warning' },
              { action: 'Audit Internal Q3 selesai', detail: 'Ditemukan 2 minor non-conformity', time: '2 days ago', type: 'info' },
              { action: 'Program "Safety First" direalisasikan', detail: 'Partisipasi 95% karyawan', time: '3 days ago', type: 'success' }
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

export default QHSENewDashboard;
