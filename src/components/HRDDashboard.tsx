import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart3, 
  FileText, 
  Wrench,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ProgramKerjaAktif {
  no: number;
  namaProgram: string;
  durasiPlan: string;
  durasiActual: string;
  status: 'Track' | 'Delay' | 'On Progress' | 'Selesai';
}

interface KomposisiBiayaGaji {
  no: number;
  namaKaryawan: string;
  project: string;
  gaji: string;
  tunjangan: string;
}

const HRDDashboard: React.FC = () => {
  const [animateCards, setAnimateCards] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);

  // Sample data for Program Kerja Aktif
  const programKerjaData: ProgramKerjaAktif[] = [
    {
      no: 1,
      namaProgram: 'Proyek Infrastruktur Kota',
      durasiPlan: '01-02-2025',
      durasiActual: '01-08-2025',
      status: 'Track'
    },
    {
      no: 2,
      namaProgram: 'Pengembangan Aplikasi ERP',
      durasiPlan: '15-03-2025',
      durasiActual: '30-09-2025',
      status: 'Delay'
    },
    {
      no: 3,
      namaProgram: 'Implementasi Smart Factory',
      durasiPlan: '01-04-2025',
      durasiActual: '01-09-2025',
      status: 'On Progress'
    },
    {
      no: 4,
      namaProgram: 'Modernisasi Jaringan IT',
      durasiPlan: '10-05-2025',
      durasiActual: '10-11-2025',
      status: 'Selesai'
    }
  ];

  // Sample data for Komposisi Biaya Gaji
  const komposisiBiayaGajiData: KomposisiBiayaGaji[] = [
    {
      no: 1,
      namaKaryawan: 'Andi',
      project: 'Proyek Infrastruktur Kota',
      gaji: 'Rp 15.000.000',
      tunjangan: 'Rp 1.500.000'
    },
    {
      no: 2,
      namaKaryawan: 'Siti',
      project: 'Pengembangan Aplikasi ERP',
      gaji: 'Rp 13.500.000',
      tunjangan: 'Rp 1.200.000'
    }
  ];

  useEffect(() => {
    // Trigger animations on component mount
    setTimeout(() => setAnimateCards(true), 100);
    setTimeout(() => setAnimateChart(true), 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Track': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delay': return 'bg-red-100 text-red-800 border-red-200';
      case 'On Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Selesai': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Track': return <CheckCircle className="h-4 w-4" />;
      case 'Delay': return <XCircle className="h-4 w-4" />;
      case 'On Progress': return <Clock className="h-4 w-4" />;
      case 'Selesai': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Pie chart data
  const pieChartData = [
    { label: 'Kontrak Habis', value: 90, color: '#3B82F6' },
    { label: 'Diberhentikan', value: 5, color: '#10B981' },
    { label: 'Resign', value: 5, color: '#EF4444' }
  ];

  const total = pieChartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                HRD DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">HRD</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Dashboard</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Employee Cards */}
          <div className="space-y-6">
            {/* Teknisi Reguler Card */}
            <div className={`bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Wrench className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Teknisi Reguler</h3>
                  </div>
                  <p className="text-3xl font-bold">150</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Teknisi Lepas Card */}
            <div className={`bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
            }`} style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Teknisi Lepas</h3>
                  </div>
                  <p className="text-3xl font-bold">250</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Staf Kantor Card */}
            <div className={`bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
            }`} style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Staf Kantor</h3>
                  </div>
                  <p className="text-3xl font-bold">125</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Pie Chart */}
          <div className="flex items-center justify-center">
            <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md ${
              animateChart ? 'animate-in zoom-in-95 fade-in-0' : 'opacity-0'
            }`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Status Karyawan
              </h3>
              
              {/* Pie Chart */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  
                  {/* Kontrak Habis segment (blue) - 90% */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="40"
                    strokeDasharray={`${(90 / 100) * 502.65} 502.65`}
                    strokeDashoffset="0"
                    className="transition-all duration-1000 ease-out"
                  />
                  
                  {/* Diberhentikan segment (green) - 5% */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="40"
                    strokeDasharray={`${(5 / 100) * 502.65} 502.65`}
                    strokeDashoffset={`-${(90 / 100) * 502.65}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  
                  {/* Resign segment (red) - 5% */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="40"
                    strokeDasharray={`${(5 / 100) * 502.65} 502.65`}
                    strokeDashoffset={`-${(95 / 100) * 502.65}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {total}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Resign</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Diberhentikan</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Kontrak Habis</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">90%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status Cards */}
          <div className="space-y-6">
            {/* Resign Card */}
            <div className={`bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              animateCards ? 'animate-in slide-in-from-right-5 fade-in-0' : 'opacity-0'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Resign</h3>
                  <p className="text-3xl font-bold">5%</p>
                </div>
                <div className="text-right">
                  <TrendingDown className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Diberhentikan Card */}
            <div className={`bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              animateCards ? 'animate-in slide-in-from-right-5 fade-in-0' : 'opacity-0'
            }`} style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Diberhentikan</h3>
                  <p className="text-3xl font-bold">5%</p>
                </div>
                <div className="text-right">
                  <TrendingDown className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Kontrak Habis Card */}
            <div className={`bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              animateCards ? 'animate-in slide-in-from-right-5 fade-in-0' : 'opacity-0'
            }`} style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Kontrak Habis</h3>
                  <p className="text-3xl font-bold">90%</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Program Kerja Aktif Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">Program Kerja Aktif</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Program</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Durasi Plan</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Durasi Actual</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {programKerjaData.map((item, index) => (
                    <tr 
                      key={item.no}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      } ${animateCards ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                      style={{ 
                        animationDelay: animateCards ? `${(index + 6) * 100}ms` : '0ms',
                        animationFillMode: 'forwards'
                      }}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.no}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.namaProgram}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.durasiPlan}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.durasiActual}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            <span className="mr-1">{getStatusIcon(item.status)}</span>
                            {item.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Komposisi Biaya Gaji Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">Komposisi Biaya Gaji</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Karyawan</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gaji</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tunjangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {komposisiBiayaGajiData.map((item, index) => (
                    <tr 
                      key={item.no}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      } ${animateCards ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                      style={{ 
                        animationDelay: animateCards ? `${(index + 10) * 100}ms` : '0ms',
                        animationFillMode: 'forwards'
                      }}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.no}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.namaKaryawan}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.project}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.gaji}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.tunjangan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Karyawan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Karyawan</p>
                <p className="text-2xl font-bold text-gray-900">525</p>
              </div>
            </div>
          </div>

          {/* Karyawan Aktif */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Karyawan Aktif</p>
                <p className="text-2xl font-bold text-gray-900">475</p>
              </div>
            </div>
          </div>

          {/* Cuti Hari Ini */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cuti Hari Ini</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          {/* Training Bulan Ini */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Training Bulan Ini</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>2025 © HRD Management System</p>
          <p className="mt-1">
            Crafted with <span className="text-red-500">♥</span> by <span className="text-blue-600">Enterprise Team</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HRDDashboard;
