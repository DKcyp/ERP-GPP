import React, { useState, useEffect } from 'react';
import {
  Factory,
  Handshake,
  FileBox,
  Truck,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Target,
  Award,
  Package,
  ShoppingCart,
  FileText,
  CheckCircle
} from 'lucide-react';
import Alert from './Alert'; // Import the new Alert component
import { AlertItem } from '../types'; // Import AlertItem type

const PengadaanDashboard: React.FC = () => {
  const [animateCards, setAnimateCards] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: '1', message: 'PR212 belum dibuatkan PO', type: 'error', actionText: 'Kerjakan' },
    { id: '2', message: 'PO023 telah sampai', type: 'success', actionText: 'Kerjakan' },
    { id: '3', message: 'PR003 belum melakukan seleksi vendor', type: 'success', actionText: 'Kerjakan' },
  ]);

  useEffect(() => {
    // Trigger animations on component mount
    setTimeout(() => setAnimateCards(true), 100);
  }, []);

  const handleCloseAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const handleActionClick = (id: string) => {
    console.log(`Action clicked for alert ID: ${id}`);
    // Implement specific action logic here based on alert ID or message
    // For example, navigate to a specific page or open another modal
    // For now, just close the alert after action
    handleCloseAlert(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Alert Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 w-72">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            id={alert.id}
            message={alert.message}
            type={alert.type}
            actionText={alert.actionText}
            onActionClick={() => handleActionClick(alert.id)}
            onCloseClick={() => handleCloseAlert(alert.id)}
          />
        ))}
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                PENGADAAN DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Pengadaan</span>
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 ${
            animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Factory className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Vendors</p>
                <p className="text-3xl font-bold text-gray-900">89</p>
                <p className="text-sm text-green-600 font-medium">+12% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 ${
            animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
          }`} style={{ animationDelay: '200ms' }}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <FileBox className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Active PO</p>
                <p className="text-3xl font-bold text-gray-900">156</p>
                <p className="text-sm text-green-600 font-medium">+8% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 ${
            animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
          }`} style={{ animationDelay: '400ms' }}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Penerimaan Barang</p>
                <p className="text-3xl font-bold text-gray-900">234</p>
                <p className="text-sm text-green-600 font-medium">+15% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 ${
            animateCards ? 'animate-in slide-in-from-left-5 fade-in-0' : 'opacity-0'
          }`} style={{ animationDelay: '600ms' }}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Handshake className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Bidding Process</p>
                <p className="text-3xl font-bold text-gray-900">45</p>
                <p className="text-sm text-red-600 font-medium">-3% dari bulan lalu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Pencapaian KPI Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Pencapaian KPI</h3>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </button>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="relative h-48">
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                <span>32</span>
                <span>24</span>
                <span>16</span>
                <span>8</span>
                <span>0</span>
              </div>

              <div className="ml-8 h-40 flex items-end justify-center space-x-2">
                {[
                  { month: 'Jan', value: 8 },
                  { month: 'Feb', value: 18 },
                  { month: 'Mar', value: 28 },
                  { month: 'Apr', value: 18 },
                  { month: 'May', value: 10 },
                  { month: 'Jun', value: 18 },
                  { month: 'Jul', value: 28 },
                  { month: 'Aug', value: 10 },
                  { month: 'Sep', value: 18 },
                  { month: 'Oct', value: 28 },
                  { month: 'Nov', value: 18 },
                  { month: 'Dec', value: 25 }
                ].map((item, index) => (
                  <div key={item.month} className="flex flex-col items-center space-y-1">
                    <div
                      className="w-4 bg-blue-500 rounded-t transition-all duration-1000 ease-out hover:opacity-80"
                      style={{ height: `${(item.value / 32) * 160}px` }}
                    ></div>
                    <span className="text-xs text-gray-600 font-medium transform -rotate-45 origin-center mt-2">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PR Vs PO Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">PR Vs PO</h3>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </button>
              </div>
            </div>

            {/* Line Chart */}
            <div className="relative h-48">
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                <span>140</span>
                <span>130</span>
                <span>120</span>
                <span>110</span>
                <span>100</span>
                <span>90</span>
              </div>

              <div className="ml-8 h-40 relative">
                <svg className="w-full h-full" viewBox="0 0 300 160">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5].map((line) => (
                    <line
                      key={line}
                      x1="0"
                      y1={line * 32}
                      x2="300"
                      y2={line * 32}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}

                  {/* PR Line (Blue) */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    points="0,120 60,100 120,110 180,90 240,80"
                    className="animate-in fade-in duration-1000"
                  />

                  {/* PO Line (Green) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    points="0,100 60,115 120,105 180,110 240,70"
                    className="animate-in fade-in duration-1000"
                  />

                  {/* Data points for PR */}
                  {[
                    { x: 0, y: 120 },
                    { x: 60, y: 100 },
                    { x: 120, y: 110 },
                    { x: 180, y: 90 },
                    { x: 240, y: 80 }
                  ].map((point, index) => (
                    <circle
                      key={`pr-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#3b82f6"
                      className="animate-in zoom-in duration-1000"
                      style={{ animationDelay: `${index * 200}ms` }}
                    />
                  ))}

                  {/* Data points for PO */}
                  {[
                    { x: 0, y: 100 },
                    { x: 60, y: 115 },
                    { x: 120, y: 105 },
                    { x: 180, y: 110 },
                    { x: 240, y: 70 }
                  ].map((point, index) => (
                    <circle
                      key={`po-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#10b981"
                      className="animate-in zoom-in duration-1000"
                      style={{ animationDelay: `${index * 200 + 100}ms` }}
                    />
                  ))}
                </svg>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 px-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">PR</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">PO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grafik Efisiensi Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Grafik Efisiensi</h3>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </button>
              </div>
            </div>

            {/* Line Chart */}
            <div className="relative h-48">
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                <span>150</span>
                <span>120</span>
                <span>90</span>
                <span>60</span>
                <span>30</span>
                <span>0</span>
              </div>

              <div className="ml-8 h-40 relative">
                <svg className="w-full h-full" viewBox="0 0 300 160">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5].map((line) => (
                    <line
                      key={line}
                      x1="0"
                      y1={line * 32}
                      x2="300"
                      y2={line * 32}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Efficiency Line (Blue) */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    points="0,140 30,130 60,125 90,120 120,115 150,110 180,100 210,85 240,70 270,50 300,30"
                    className="animate-in fade-in duration-1000"
                  />

                  {/* Data points */}
                  {[
                    { x: 0, y: 140 },
                    { x: 30, y: 130 },
                    { x: 60, y: 125 },
                    { x: 90, y: 120 },
                    { x: 120, y: 115 },
                    { x: 150, y: 110 },
                    { x: 180, y: 100 },
                    { x: 210, y: 85 },
                    { x: 240, y: 70 },
                    { x: 270, y: 50 },
                    { x: 300, y: 30 }
                  ].map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#3b82f6"
                      className="animate-in zoom-in duration-1000"
                      style={{ animationDelay: `${index * 100}ms` }}
                    />
                  ))}
                </svg>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 px-2">
                  <span>2017</span>
                  <span>2018</span>
                  <span>2019</span>
                  <span>2020</span>
                  <span>2021</span>
                  <span>2022</span>
                  <span>2023</span>
                  <span>2024</span>
                  <span>2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Vendor Performance */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Vendor Performance</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Excellent</span>
                <span className="text-sm font-medium text-green-600">65%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Good</span>
                <span className="text-sm font-medium text-blue-600">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Needs Improvement</span>
                <span className="text-sm font-medium text-yellow-600">10%</span>
              </div>
            </div>
          </div>

          {/* PO Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">PO Status</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium text-green-600">142</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="text-sm font-medium text-blue-600">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-medium text-yellow-600">23</span>
              </div>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Monthly Summary</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Procurement</span>
                <span className="text-sm font-medium text-gray-900">Rp 2.5B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cost Savings</span>
                <span className="text-sm font-medium text-green-600">Rp 150M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Lead Time</span>
                <span className="text-sm font-medium text-blue-600">7 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'New vendor registered', vendor: 'PT Supplier Terpercaya', time: '2 hours ago', type: 'success' },
              { action: 'PO approved', item: 'Office Equipment Purchase', time: '4 hours ago', type: 'info' },
              { action: 'Goods received', vendor: 'CV Material Berkualitas', time: '1 day ago', type: 'success' },
              { action: 'Bidding process started', item: 'IT Infrastructure Project', time: '2 days ago', type: 'warning' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.vendor || activity.item}</p>
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

export default PengadaanDashboard;
