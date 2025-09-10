import React from "react";
import { Clock } from "lucide-react";

const MonitoringActualVsTargetDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-sm">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-wide mb-1">MONITORING ACTUAL VS TARGET</h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Monitoring</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Actual VS Target</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Placeholder content */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Ringkasan</h2>
          <p className="text-gray-600 text-sm">Halaman ini akan menampilkan perbandingan Actual VS Target untuk KPI Marketing (deal, nilai kontrak, jumlah penawaran, dsb).</p>
        </div>
      </div>
    </div>
  );
};

export default MonitoringActualVsTargetDashboard;
