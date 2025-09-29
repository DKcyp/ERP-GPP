import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, BarChart3, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const AccountingMainDashboard: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Data Laba Rugi per bulan
  const labaRugiData = [
    { bulan: 'Jan', pendapatan: 850000000, bebanOperasional: 650000000, bebanAdministrasi: 120000000, labaRugi: 80000000 },
    { bulan: 'Feb', pendapatan: 920000000, bebanOperasional: 680000000, bebanAdministrasi: 130000000, labaRugi: 110000000 },
    { bulan: 'Mar', pendapatan: 780000000, bebanOperasional: 620000000, bebanAdministrasi: 115000000, labaRugi: 45000000 },
    { bulan: 'Apr', pendapatan: 950000000, bebanOperasional: 720000000, bebanAdministrasi: 140000000, labaRugi: 90000000 },
    { bulan: 'Mei', pendapatan: 1100000000, bebanOperasional: 850000000, bebanAdministrasi: 160000000, labaRugi: 90000000 },
    { bulan: 'Jun', pendapatan: 980000000, bebanOperasional: 750000000, bebanAdministrasi: 145000000, labaRugi: 85000000 },
    { bulan: 'Jul', pendapatan: 1050000000, bebanOperasional: 800000000, bebanAdministrasi: 155000000, labaRugi: 95000000 },
    { bulan: 'Agu', pendapatan: 1200000000, bebanOperasional: 920000000, bebanAdministrasi: 170000000, labaRugi: 110000000 },
    { bulan: 'Sep', pendapatan: 1150000000, bebanOperasional: 880000000, bebanAdministrasi: 165000000, labaRugi: 105000000 },
    { bulan: 'Okt', pendapatan: 1080000000, bebanOperasional: 820000000, bebanAdministrasi: 150000000, labaRugi: 110000000 },
    { bulan: 'Nov', pendapatan: 1250000000, bebanOperasional: 950000000, bebanAdministrasi: 180000000, labaRugi: 120000000 },
    { bulan: 'Des', pendapatan: 1300000000, bebanOperasional: 980000000, bebanAdministrasi: 185000000, labaRugi: 135000000 },
  ];

  // Data Neraca per bulan (Aset, Liabilitas, Ekuitas)
  const neracaData = [
    { bulan: 'Jan', aset: 2500000000, liabilitas: 1200000000, ekuitas: 1300000000 },
    { bulan: 'Feb', aset: 2650000000, liabilitas: 1250000000, ekuitas: 1400000000 },
    { bulan: 'Mar', aset: 2580000000, liabilitas: 1180000000, ekuitas: 1400000000 },
    { bulan: 'Apr', aset: 2750000000, liabilitas: 1300000000, ekuitas: 1450000000 },
    { bulan: 'Mei', aset: 2900000000, liabilitas: 1350000000, ekuitas: 1550000000 },
    { bulan: 'Jun', aset: 2850000000, liabilitas: 1320000000, ekuitas: 1530000000 },
    { bulan: 'Jul', aset: 3000000000, liabilitas: 1400000000, ekuitas: 1600000000 },
    { bulan: 'Agu', aset: 3200000000, liabilitas: 1480000000, ekuitas: 1720000000 },
    { bulan: 'Sep', aset: 3150000000, liabilitas: 1450000000, ekuitas: 1700000000 },
    { bulan: 'Okt', aset: 3300000000, liabilitas: 1500000000, ekuitas: 1800000000 },
    { bulan: 'Nov', aset: 3450000000, liabilitas: 1550000000, ekuitas: 1900000000 },
    { bulan: 'Des', aset: 3600000000, liabilitas: 1600000000, ekuitas: 2000000000 },
  ];

  // 5 Biaya Operasional Terbesar
  const biayaOperasionalData = [
    { kategori: 'Gaji & Tunjangan', nilai: 4800000000 },
    { kategori: 'Bahan Baku', nilai: 3200000000 },
    { kategori: 'Transportasi', nilai: 1800000000 },
    { kategori: 'Utilitas', nilai: 1200000000 },
    { kategori: 'Maintenance', nilai: 950000000 },
  ];

  // 5 Biaya Administrasi dan Umum Terbesar
  const biayaAdministrasiData = [
    { kategori: 'Gaji Administrasi', nilai: 720000000 },
    { kategori: 'Sewa Kantor', nilai: 480000000 },
    { kategori: 'Komunikasi & IT', nilai: 360000000 },
    { kategori: 'Konsultan & Legal', nilai: 240000000 },
    { kategori: 'Perlengkapan Kantor', nilai: 180000000 },
  ];

  const formatRupiah = (value: number) => {
    return `Rp ${(value / 1000000000).toFixed(1)}M`;
  };

  const formatRupiahTooltip = (value: number) => {
    return `Rp ${(value / 1000000).toLocaleString('id-ID')} juta`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
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
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Grafik Laba Rugi per Bulan */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span>Laporan Laba Rugi {currentYear}</span>
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={labaRugiData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="bulan" axisLine={false} tickLine={false} stroke="#a3a3a3" />
                <YAxis axisLine={false} tickLine={false} stroke="#a3a3a3" tickFormatter={formatRupiah} />
                <Tooltip formatter={(value) => formatRupiahTooltip(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="pendapatan" stroke="#10B981" strokeWidth={3} name="Pendapatan" />
                <Line type="monotone" dataKey="bebanOperasional" stroke="#EF4444" strokeWidth={3} name="Beban Operasional" />
                <Line type="monotone" dataKey="bebanAdministrasi" stroke="#F59E0B" strokeWidth={3} name="Beban Administrasi" />
                <Line type="monotone" dataKey="labaRugi" stroke="#3B82F6" strokeWidth={4} name="Laba Rugi" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafik Neraca per Bulan */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span>Laporan Neraca {currentYear}</span>
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={neracaData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                <XAxis dataKey="bulan" axisLine={false} tickLine={false} stroke="#a3a3a3" />
                <YAxis axisLine={false} tickLine={false} stroke="#a3a3a3" tickFormatter={formatRupiah} />
                <Tooltip formatter={(value) => formatRupiahTooltip(Number(value))} />
                <Legend />
                <Bar dataKey="aset" fill="#3B82F6" name="Aset" radius={[4, 4, 0, 0]} />
                <Bar dataKey="liabilitas" fill="#EF4444" name="Liabilitas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ekuitas" fill="#10B981" name="Ekuitas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5 Biaya Operasional dan Administrasi Terbesar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 5 Biaya Operasional Terbesar */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span>5 Biaya Operasional Terbesar</span>
              </h3>
            </div>
            <div className="space-y-4">
              {biayaOperasionalData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.kategori}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">
                      {formatRupiah(item.nilai)}
                    </span>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(item.nilai / biayaOperasionalData[0].nilai) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Biaya Administrasi dan Umum Terbesar */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <span>5 Biaya Administrasi & Umum Terbesar</span>
              </h3>
            </div>
            <div className="space-y-4">
              {biayaAdministrasiData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.kategori}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">
                      {formatRupiah(item.nilai)}
                    </span>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(item.nilai / biayaAdministrasiData[0].nilai) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingMainDashboard;
