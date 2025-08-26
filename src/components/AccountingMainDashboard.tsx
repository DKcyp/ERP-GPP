import React from 'react';
import { Clock, DollarSign, TrendingUp, Scale, BookText, CreditCard } from 'lucide-react';

const AccountingMainDashboard: React.FC = () => {
  const today = new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                ACCOUNTING DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Main Dashboard</span>
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
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Kas Masuk (Bulan Ini)</p>
                <p className="text-3xl font-bold text-gray-900">Rp 125.000.000</p>
                <p className="text-sm text-green-600 font-medium">+10% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <CreditCard className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Kas Keluar (Bulan Ini)</p>
                <p className="text-3xl font-bold text-gray-900">Rp 78.000.000</p>
                <p className="text-sm text-red-600 font-medium">-5% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Laba Bersih (Q2)</p>
                <p className="text-3xl font-bold text-gray-900">Rp 47.000.000</p>
                <p className="text-sm text-green-600 font-medium">+15% dari Q1</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Scale className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Jumlah COA Aktif</p>
                <p className="text-3xl font-bold text-gray-900">120</p>
                <p className="text-sm text-gray-600 font-medium">Stabil</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Journal Entries */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Jurnal Terbaru</h3>
          <div className="space-y-4">
            {[
              { type: 'Kas Masuk', description: 'Penerimaan Pembayaran Proyek C', amount: 'Rp 25.000.000', date: '2024-07-01' },
              { type: 'Bank Keluar', description: 'Pembayaran Gaji Karyawan', amount: 'Rp 15.000.000', date: '2024-06-30' },
              { type: 'Kas Keluar', description: 'Pembelian Perlengkapan Kantor', amount: 'Rp 1.200.000', date: '2024-06-29' },
              { type: 'Bank Masuk', description: 'Transfer dari Klien X', amount: 'Rp 50.000.000', date: '2024-06-28' },
            ].map((entry, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-3 h-3 rounded-full ${entry.type.includes('Masuk') ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{entry.type}: {entry.description}</p>
                  <p className="text-sm text-gray-600">{entry.amount}</p>
                </div>
                <span className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COA Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Master COA Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-5 rounded-xl flex items-center space-x-4">
              <BookText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">Aset</p>
                <p className="text-sm text-gray-600">Total 35 akun</p>
              </div>
            </div>
            <div className="bg-green-50 p-5 rounded-xl flex items-center space-x-4">
              <BookText className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">Liabilitas</p>
                <p className="text-sm text-gray-600">Total 20 akun</p>
              </div>
            </div>
            <div className="bg-yellow-50 p-5 rounded-xl flex items-center space-x-4">
              <BookText className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">Ekuitas</p>
                <p className="text-sm text-gray-600">Total 10 akun</p>
              </div>
            </div>
            <div className="bg-purple-50 p-5 rounded-xl flex items-center space-x-4">
              <BookText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">Pendapatan & Beban</p>
                <p className="text-sm text-gray-600">Total 55 akun</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingMainDashboard;
