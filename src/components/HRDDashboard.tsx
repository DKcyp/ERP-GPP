import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart3, 
  FileText, 
  Wrench,
  Calendar,
  TrendingUp,
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

  // (Removed chart data; using tables instead)

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
        <div className="w-full">
          {/* KPI Boxes aligned to the right */}
          <div className="flex flex-col lg:flex-row justify-end gap-6">
            {/* Staf (PKWT) */}
            <div className={`bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Wrench className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Staf (PKWT)</h3>
                  </div>
                  <p className="text-3xl font-bold">85</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Staf (PKWTT) */}
            <div className={`bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
            }`} style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Staf (PKWTT)</h3>
                  </div>
                  <p className="text-3xl font-bold">60</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Teknisi (PKWT) */}
            <div className={`bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
            }`} style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Teknisi (PKWT)</h3>
                  </div>
                  <p className="text-3xl font-bold">140</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Teknisi (PKWTT) */}
            <div className={`bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
            }`} style={{ animationDelay: '600ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Teknisi (PKWTT)</h3>
                  </div>
                  <p className="text-3xl font-bold">110</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Teknisi (Freelance) */}
            <div className={`bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
            }`} style={{ animationDelay: '800ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Teknisi (Freelance)</h3>
                  </div>
                  <p className="text-3xl font-bold">95</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>
          </div>

          {/* Center/Right columns removed as requested; tables moved below */}
        </div>

        {/* Tables Section (Below Boxes) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Monitoring Kontrak Habis H-3 Bulan */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">Monitoring Kontrak Habis H-3 Bulan</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Jabatan</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kontrak Habis</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sisa Hari</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Budi Santoso</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Teknisi</td>
                    <td className="px-4 py-3 text-sm text-gray-600">10-12-2025</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">75</td>
                    <td className="px-4 py-3"><span className="px-3 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">H-3 Bulan</span></td>
                  </tr>
                  <tr className="bg-gray-25">
                    <td className="px-4 py-3 text-sm text-gray-900">Siti Aminah</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Staf</td>
                    <td className="px-4 py-3 text-sm text-gray-600">02-11-2025</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">36</td>
                    <td className="px-4 py-3"><span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">H-3 Bulan</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Joko Susilo</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Teknisi</td>
                    <td className="px-4 py-3 text-sm text-gray-600">20-02-2026</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">130</td>
                    <td className="px-4 py-3"><span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">H &gt; 3 Bulan</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Turn Over Rate */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">Turn Over Rate</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bulan</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Masuk</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Keluar</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Turn Over Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Jan 2025</td>
                    <td className="px-4 py-3 text-sm text-gray-900">18</td>
                    <td className="px-4 py-3 text-sm text-gray-900">12</td>
                    <td className="px-4 py-3 text-sm text-gray-900">530</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">2.3%</td>
                  </tr>
                  <tr className="bg-gray-25">
                    <td className="px-4 py-3 text-sm text-gray-900">Feb 2025</td>
                    <td className="px-4 py-3 text-sm text-gray-900">22</td>
                    <td className="px-4 py-3 text-sm text-gray-900">15</td>
                    <td className="px-4 py-3 text-sm text-gray-900">537</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">2.8%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Mar 2025</td>
                    <td className="px-4 py-3 text-sm text-gray-900">20</td>
                    <td className="px-4 py-3 text-sm text-gray-900">17</td>
                    <td className="px-4 py-3 text-sm text-gray-900">540</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">2.6%</td>
                  </tr>
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
