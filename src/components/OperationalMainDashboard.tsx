import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, CartesianGrid
} from 'recharts';

// Data for KPI Bar Chart
const kpiData = [
  { name: 'Jan', value: 80 },
  { name: 'Feb', value: 90 },
  { name: 'Mar', value: 75 },
  { name: 'Apr', value: 85 },
  { name: 'May', value: 95 },
];

// Data for Target Vs Produksi Line Chart
const targetProduksiData = [
  { name: 'Jan', target: 100, produksi: 90 },
  { name: 'Feb', target: 120, produksi: 110 },
  { name: 'Mar', target: 110, produksi: 105 },
  { name: 'Apr', target: 130, produksi: 125 },
  { name: 'May', target: 140, produksi: 135 },
];

// Data for Produksi Vs Invoice Area Chart
const produksiInvoiceData = [
  { name: 'Jan', produksi: 200, invoice: 180 },
  { name: 'Feb', produksi: 250, invoice: 220 },
  { name: 'Mar', produksi: 230, invoice: 210 },
  { name: 'Apr', produksi: 280, invoice: 260 },
  { name: 'May', produksi: 300, invoice: 290 },
];

const OperationalMainDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                OPERATIONAL DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Operational</span>
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">34</p>
                <p className="text-sm text-green-600 font-medium">+5% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Man Power</p>
                <p className="text-3xl font-bold text-gray-900">156</p>
                <p className="text-sm text-green-600 font-medium">+8% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Production Value</p>
                <p className="text-3xl font-bold text-gray-900">89%</p>
                <p className="text-sm text-green-600 font-medium">+12% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">On Schedule</p>
                <p className="text-3xl font-bold text-gray-900">78%</p>
                <p className="text-sm text-red-600 font-medium">-2% dari bulan lalu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* KPI Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">KPI</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={kpiData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-gray-600" />
                <YAxis axisLine={false} tickLine={false} className="text-xs text-gray-600" />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {kpiData.map((entry, index) => (
                    <text
                      key={`label-${index}`}
                      x={index * (250 / kpiData.length) + (250 / kpiData.length) / 2} // Adjust x position
                      y={250 - (entry.value * 2.5) - 10} // Adjust y position
                      fill="#fff"
                      textAnchor="middle"
                      className="text-xs font-medium"
                    >
                      {entry.value}
                    </text>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Target Vs Produksi Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Target Vs Produksi</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={targetProduksiData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-gray-600" />
                <YAxis axisLine={false} tickLine={false} className="text-xs text-gray-600" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="produksi" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Produksi Vs Invoice Area Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Produksi Vs Invoice</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={produksiInvoiceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-gray-600" />
                <YAxis axisLine={false} tickLine={false} className="text-xs text-gray-600" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="produksi" stroke="#3b82f6" fillOpacity={0.8} fill="url(#colorProduksi)" />
                <Area type="monotone" dataKey="invoice" stroke="#10b981" fillOpacity={0.8} fill="url(#colorInvoice)" />
                <defs>
                  <linearGradient id="colorProduksi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInvoice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Operations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Operations</h3>
          <div className="space-y-4">
            {[
              { action: 'New SO created', project: 'Project Alpha', time: '1 hour ago', type: 'success' },
              { action: 'Man power assigned', project: 'Project Beta', time: '3 hours ago', type: 'info' },
              { action: 'Training completed', project: 'Safety Training', time: '5 hours ago', type: 'success' },
              { action: 'Equipment maintenance', project: 'Project Gamma', time: '1 day ago', type: 'warning' }
            ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'info' ? 'bg-blue-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.project}</p>
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

export default OperationalMainDashboard;
