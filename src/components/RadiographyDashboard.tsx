import React, { useState } from "react";
import {
  Activity,
  Camera,
  Shield,
  BarChart3,
  Clock,
  ArrowRight,
  Users,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface RadiographyStats {
  totalISOTOP: number;
  activeISOTOP: number;
  pendingUjiUsap: number;
  completedTLD: number;
  criticalAlerts: number;
}

const RadiographyDashboard: React.FC = () => {
  const [stats] = useState<RadiographyStats>({
    totalISOTOP: 12,
    activeISOTOP: 8,
    pendingUjiUsap: 5,
    completedTLD: 15,
    criticalAlerts: 2,
  });

  const menuItems = [
    {
      title: "Proses ISOTOP",
      description: "Manage ISOTOP processes and tracking",
      icon: Activity,
      path: "/qhse/radiography/isotop",
      color: "bg-blue-500",
      stats: `${stats.activeISOTOP}/${stats.totalISOTOP} Active`,
    },
    {
      title: "Uji Usap Kamera",
      description: "Camera wipe test management",
      icon: Camera,
      path: "/qhse/radiography/uji-usap",
      color: "bg-green-500",
      stats: `${stats.pendingUjiUsap} Pending`,
    },
    {
      title: "TLD",
      description: "Thermoluminescent Dosimeter monitoring",
      icon: Shield,
      path: "/qhse/radiography/tld",
      color: "bg-purple-500",
      stats: `${stats.completedTLD} Completed`,
    },
    {
      title: "Monitoring",
      description: "Overall radiography monitoring and reports",
      icon: BarChart3,
      path: "/qhse/radiography/monitoring",
      color: "bg-orange-500",
      stats: `${stats.criticalAlerts} Alerts`,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "ISOTOP",
      description: "ISOTOP IR-192 scheduled for maintenance",
      timestamp: "2024-01-15 10:30",
      status: "pending",
    },
    {
      id: 2,
      type: "Uji Usap",
      description: "Camera wipe test completed for Camera-001",
      timestamp: "2024-01-15 09:15",
      status: "completed",
    },
    {
      id: 3,
      type: "TLD",
      description: "Monthly TLD reading recorded",
      timestamp: "2024-01-14 16:45",
      status: "completed",
    },
    {
      id: 4,
      type: "Alert",
      description: "High radiation level detected in Zone A",
      timestamp: "2024-01-14 14:20",
      status: "critical",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Radiography Management
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  QHSE
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Radiography</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total ISOTOP</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalISOTOP}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active ISOTOP</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeISOTOP}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Uji Usap</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingUjiUsap}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Camera className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">TLD Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedTLD}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.criticalAlerts}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Radiography Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className="group relative bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-300 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg"
                      onClick={() => {
                        // Navigate to the specific path
                        alert(`Navigate to: ${item.path}`);
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 ${item.color} rounded-xl`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">
                          {item.stats}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  View All Activities
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center px-6 py-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-700 font-medium transition-colors">
                <Users className="h-5 w-5 mr-2" />
                Schedule ISOTOP Maintenance
              </button>
              <button className="flex items-center justify-center px-6 py-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl text-green-700 font-medium transition-colors">
                <Camera className="h-5 w-5 mr-2" />
                Perform Wipe Test
              </button>
              <button className="flex items-center justify-center px-6 py-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-purple-700 font-medium transition-colors">
                <FileText className="h-5 w-5 mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadiographyDashboard;
