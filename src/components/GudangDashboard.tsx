import React, { useState } from 'react';
import { Package, Shield, Wrench, TrendingUp, AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';

interface BarangItem {
  kodeBarang: string;
  namaBarang: string;
  minimalStok: number;
  permintaanGudang: number;
  stokAkhir: number;
  selisih: number;
}

const GudangDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // Data Barang Fast Moving Material Utama
  const fastMovingMaterial: BarangItem[] = [
    { kodeBarang: 'MTR-001', namaBarang: 'Semen Portland 50kg', minimalStok: 150, permintaanGudang: 200, stokAkhir: 180, selisih: -20 },
    { kodeBarang: 'MTR-002', namaBarang: 'Besi Beton 10mm', minimalStok: 200, permintaanGudang: 250, stokAkhir: 300, selisih: 50 },
    { kodeBarang: 'MTR-003', namaBarang: 'Pasir Cor', minimalStok: 100, permintaanGudang: 120, stokAkhir: 90, selisih: -30 },
    { kodeBarang: 'MTR-004', namaBarang: 'Kerikil Split', minimalStok: 80, permintaanGudang: 100, stokAkhir: 110, selisih: 10 },
    { kodeBarang: 'MTR-005', namaBarang: 'Cat Tembok Putih', minimalStok: 50, permintaanGudang: 60, stokAkhir: 45, selisih: -15 },
  ];

  // Data Barang Safety PPE Fast Moving
  const fastMovingSafety: BarangItem[] = [
    { kodeBarang: 'PPE-001', namaBarang: 'Helm Safety Kuning', minimalStok: 30, permintaanGudang: 45, stokAkhir: 50, selisih: 5 },
    { kodeBarang: 'PPE-002', namaBarang: 'Sarung Tangan Karet', minimalStok: 50, permintaanGudang: 60, stokAkhir: 40, selisih: -20 },
    { kodeBarang: 'PPE-003', namaBarang: 'Sepatu Safety Boot', minimalStok: 25, permintaanGudang: 30, stokAkhir: 35, selisih: 5 },
    { kodeBarang: 'PPE-004', namaBarang: 'Masker N95', minimalStok: 100, permintaanGudang: 120, stokAkhir: 90, selisih: -30 },
    { kodeBarang: 'PPE-005', namaBarang: 'Kacamata Safety', minimalStok: 40, permintaanGudang: 50, stokAkhir: 55, selisih: 5 },
  ];

  // Data Peralatan NDT
  const ndtEquipment = [
    { kodeAlat: 'NDT-001', namaAlat: 'Ultrasonic Thickness Gauge', status: 'Available', lastCalibration: '2025-01-15', nextCalibration: '2025-07-15' },
    { kodeAlat: 'NDT-002', namaAlat: 'Magnetic Particle Detector', status: 'In Use', lastCalibration: '2024-12-20', nextCalibration: '2025-06-20' },
    { kodeAlat: 'NDT-003', namaAlat: 'Radiography Equipment', status: 'Available', lastCalibration: '2025-01-10', nextCalibration: '2025-07-10' },
    { kodeAlat: 'NDT-004', namaAlat: 'Eddy Current Tester', status: 'Maintenance', lastCalibration: '2024-11-25', nextCalibration: '2025-05-25' },
    { kodeAlat: 'NDT-005', namaAlat: 'Liquid Penetrant Kit', status: 'Available', lastCalibration: '2025-01-05', nextCalibration: '2025-07-05' },
  ];

  // Data Barang Consumable Fast Moving
  const consumableFastMoving: BarangItem[] = [
    { kodeBarang: 'CON-001', namaBarang: 'Elektroda Las 2.6mm', minimalStok: 80, permintaanGudang: 100, stokAkhir: 75, selisih: -25 },
    { kodeBarang: 'CON-002', namaBarang: 'Baut M12 x 50mm', minimalStok: 200, permintaanGudang: 250, stokAkhir: 280, selisih: 30 },
    { kodeBarang: 'CON-003', namaBarang: 'Lem PVC', minimalStok: 40, permintaanGudang: 50, stokAkhir: 35, selisih: -15 },
    { kodeBarang: 'CON-004', namaBarang: 'Amplas Kasar', minimalStok: 60, permintaanGudang: 70, stokAkhir: 80, selisih: 10 },
    { kodeBarang: 'CON-005', namaBarang: 'Kawat Las MIG', minimalStok: 30, permintaanGudang: 40, stokAkhir: 25, selisih: -15 },
  ];

  const renderBarangTable = (data: BarangItem[], title: string, icon: React.ReactNode, bgColor: string) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className={`${bgColor} p-6 border-b border-gray-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">Data per {new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Real-time</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Minimal Stok</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Permintaan Gudang</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Akhir</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Selisih</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.kodeBarang}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.namaBarang}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">{item.minimalStok}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-blue-600">{item.permintaanGudang}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">{item.stokAkhir}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-bold ${item.selisih < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {item.selisih > 0 ? '+' : ''}{item.selisih}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {item.stokAkhir < item.minimalStok ? (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" /> Low Stock
                    </span>
                  ) : (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" /> Normal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-wide mb-2">
                GUDANG DASHBOARD
              </h1>
              <nav className="text-sm text-blue-100">
                <span className="hover:text-white cursor-pointer transition-colors">Gudang</span>
                <span className="mx-2">›</span>
                <span className="text-white font-medium">Dashboard Monitoring</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-blue-100">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Package className="h-10 w-10 opacity-80" />
              <TrendingUp className="h-6 w-6" />
            </div>
            <p className="text-sm opacity-90 mb-1">Material Utama</p>
            <p className="text-3xl font-bold">{fastMovingMaterial.length}</p>
            <p className="text-xs opacity-75 mt-2">Fast Moving Items</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Shield className="h-10 w-10 opacity-80" />
              <TrendingUp className="h-6 w-6" />
            </div>
            <p className="text-sm opacity-90 mb-1">Safety PPE</p>
            <p className="text-3xl font-bold">{fastMovingSafety.length}</p>
            <p className="text-xs opacity-75 mt-2">Fast Moving Items</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Wrench className="h-10 w-10 opacity-80" />
              <CheckCircle className="h-6 w-6" />
            </div>
            <p className="text-sm opacity-90 mb-1">Peralatan NDT</p>
            <p className="text-3xl font-bold">{ndtEquipment.length}</p>
            <p className="text-xs opacity-75 mt-2">Specialized Tools</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-10 w-10 opacity-80" />
              <AlertTriangle className="h-6 w-6" />
            </div>
            <p className="text-sm opacity-90 mb-1">Consumable</p>
            <p className="text-3xl font-bold">{consumableFastMoving.length}</p>
            <p className="text-xs opacity-75 mt-2">Fast Moving Items</p>
          </div>
        </div>

        {/* 1. Barang Fast Moving Material Utama */}
        {renderBarangTable(
          fastMovingMaterial,
          'Barang Fast Moving - Material Utama',
          <Package className="h-8 w-8 text-blue-600" />,
          'bg-blue-50'
        )}

        {/* 2. Barang Safety PPE Fast Moving */}
        {renderBarangTable(
          fastMovingSafety,
          'Barang Safety Fast Moving - Perlengkapan PPE',
          <Shield className="h-8 w-8 text-green-600" />,
          'bg-green-50'
        )}

        {/* 3. Peralatan Khusus NDT */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-purple-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wrench className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Peralatan Khusus NDT</h3>
                  <p className="text-sm text-gray-600">Non-Destructive Testing Equipment</p>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Alat</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Alat</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Calibration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Calibration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ndtEquipment.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.kodeAlat}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaAlat}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {item.status === 'Available' ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Available
                        </span>
                      ) : item.status === 'In Use' ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          In Use
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Maintenance
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.lastCalibration}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.nextCalibration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Barang Consumable Fast Moving dengan Filter Bulan */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-orange-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Barang Consumable Fast Moving</h3>
                  <p className="text-sm text-gray-600">Filter berdasarkan periode bulan</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Minimal Stok</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Permintaan Gudang</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Akhir</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Selisih</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consumableFastMoving.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.kodeBarang}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaBarang}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">{item.minimalStok}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-blue-600">{item.permintaanGudang}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">{item.stokAkhir}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-bold ${item.selisih < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.selisih > 0 ? '+' : ''}{item.selisih}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {item.stokAkhir < item.minimalStok ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" /> Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GudangDashboard;
