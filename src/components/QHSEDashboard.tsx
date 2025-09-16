import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Camera,
  Zap,
  ListChecks
} from 'lucide-react';

const QHSEDashboard: React.FC = () => {
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    // Trigger animations on component mount
    setTimeout(() => setAnimateCards(true), 100);
  }, []);

  // Sample data for dashboard statistics
  const dashboardStats = {
    totalSuratIzinTahunIni: 45,
    totalAlatUkurTerkalibrasi: 128
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
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
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* Total Surat Izin dalam 1 Tahun (Perusahaan) */}
          <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 ${
            animateCards ? 'animate-fade-in-up' : 'opacity-0'
          }`} style={{ animationDelay: '0ms' }}>
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-blue-100 rounded-xl">
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-1">Total Surat Izin</p>
                <p className="text-sm text-gray-500 mb-3">dalam 1 Tahun (Perusahaan)</p>
                <p className="text-4xl font-bold text-blue-600">{dashboardStats.totalSuratIzinTahunIni}</p>
                <p className="text-sm text-green-600 font-medium mt-2">Dokumen</p>
              </div>
            </div>
          </div>

          {/* Total Alat Ukur yang sudah terkalibrasi */}
          <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 ${
            animateCards ? 'animate-fade-in-up' : 'opacity-0'
          }`} style={{ animationDelay: '100ms' }}>
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-green-100 rounded-xl">
                <ListChecks className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-1">Total Alat Ukur</p>
                <p className="text-sm text-gray-500 mb-3">yang sudah terkalibrasi</p>
                <p className="text-4xl font-bold text-green-600">{dashboardStats.totalAlatUkurTerkalibrasi}</p>
                <p className="text-sm text-green-600 font-medium mt-2">Peralatan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Menu */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/qhse/legalitas-perusahaan" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <ShieldCheck className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Legalitas Perusahaan</span>
            </a>
            <a href="/qhse/kamera" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <Camera className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Kamera</span>
            </a>
            <a href="/qhse/radiography/monitoring" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <Zap className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Radiography</span>
            </a>
            <a href="/qhse/monitoring-daftar-alat-ukur" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <ListChecks className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Alat Ukur</span>
            </a>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Kalibrasi Alat Ukur Selesai</p>
                <p className="text-sm text-gray-600">Alat ukur pressure gauge berhasil dikalibrasi</p>
              </div>
              <span className="text-sm text-gray-500">2 jam lalu</span>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Dokumen Baru Ditambahkan</p>
                <p className="text-sm text-gray-600">SOP Keselamatan Kerja v2.1 telah diupload</p>
              </div>
              <span className="text-sm text-gray-500">5 jam lalu</span>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Peringatan H-90</p>
                <p className="text-sm text-gray-600">Sertifikat ISO 45001 akan berakhir dalam 90 hari</p>
              </div>
              <span className="text-sm text-gray-500">1 hari lalu</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>2025 © QHSE Management System</p>
          <p className="mt-1">
            Crafted with <span className="text-red-500">♥</span> by <span className="text-blue-600">Enterprise Team</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QHSEDashboard;
