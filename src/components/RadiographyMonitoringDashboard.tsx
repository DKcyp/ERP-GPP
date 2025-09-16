import React, { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  Activity,
  Shield,
  Download,
  Calendar,
  Users,
} from "lucide-react";

interface MonitoringData {
  id: string;
  tanggal: string;
  lokasi: string;
  jenisMonitoring: "Area" | "Personal" | "Equipment";
  nilaiRadiasi: number; // in mSv/h
  batasAman: number;
  status: "Normal" | "Warning" | "Critical";
  petugas: string;
  keterangan?: string;
}

interface MonitoringStats {
  totalMonitoring: number;
  normalReadings: number;
  warningReadings: number;
  criticalReadings: number;
  averageRadiation: number;
}

const initialData: MonitoringData[] = [
  {
    id: "1",
    tanggal: "2024-01-15",
    lokasi: "Area Radiografi A",
    jenisMonitoring: "Area",
    nilaiRadiasi: 0.5,
    batasAman: 2.0,
    status: "Normal",
    petugas: "Ahmad RSO",
    keterangan: "Monitoring rutin area kerja",
  },
  {
    id: "2",
    tanggal: "2024-01-15",
    lokasi: "Personal - Radiographer 1",
    jenisMonitoring: "Personal",
    nilaiRadiasi: 1.8,
    batasAman: 2.0,
    status: "Warning",
    petugas: "Sari RSO",
    keterangan: "Mendekati batas aman",
  },
  {
    id: "3",
    tanggal: "2024-01-14",
    lokasi: "Storage Room B",
    jenisMonitoring: "Area",
    nilaiRadiasi: 3.2,
    batasAman: 2.0,
    status: "Critical",
    petugas: "Ahmad RSO",
    keterangan: "Melebihi batas aman, perlu tindakan segera",
  },
];

const RadiographyMonitoringDashboard: React.FC = () => {
  const [data] = useState<MonitoringData[]>(initialData);
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedType, setSelectedType] = useState<string>("");

  const stats = useMemo((): MonitoringStats => {
    const total = data.length;
    const normal = data.filter(d => d.status === "Normal").length;
    const warning = data.filter(d => d.status === "Warning").length;
    const critical = data.filter(d => d.status === "Critical").length;
    const avgRadiation = data.reduce((sum, d) => sum + d.nilaiRadiasi, 0) / total;

    return {
      totalMonitoring: total,
      normalReadings: normal,
      warningReadings: warning,
      criticalReadings: critical,
      averageRadiation: parseFloat(avgRadiation.toFixed(2)),
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(d => {
      const matchType = !selectedType || d.jenisMonitoring === selectedType;
      return matchType;
    });
  }, [data, selectedType]);

  const getStatusColor = (status: MonitoringData["status"]) => {
    switch (status) {
      case "Normal": return "bg-green-50 text-green-700 border-green-200";
      case "Warning": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Critical": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getRadiationLevel = (value: number, limit: number) => {
    const percentage = (value / limit) * 100;
    if (percentage >= 100) return { color: "bg-red-500", level: "Critical" };
    if (percentage >= 80) return { color: "bg-yellow-500", level: "Warning" };
    return { color: "bg-green-500", level: "Normal" };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Radiography Monitoring
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Radiography</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring</span>
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
                <p className="text-sm font-medium text-gray-600">Total Monitoring</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalMonitoring}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Normal</p>
                <p className="text-3xl font-bold text-green-600">{stats.normalReadings}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Warning</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.warningReadings}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-3xl font-bold text-red-600">{stats.criticalReadings}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Radiation</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageRadiation}</p>
                <p className="text-xs text-gray-500">mSv/h</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monitoring Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="Area">Area Monitoring</option>
                <option value="Personal">Personal Monitoring</option>
                <option value="Equipment">Equipment Monitoring</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => alert("Generate Report")}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Generate Report
              </button>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => alert("Export Data")}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Monitoring Data */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Monitoring Data</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Radiation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item) => {
                      const radiationLevel = getRadiationLevel(item.nilaiRadiasi, item.batasAman);
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(item.tanggal).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.lokasi}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.jenisMonitoring}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">{item.nilaiRadiasi} mSv/h</span>
                                  <span className="text-xs text-gray-500">/{item.batasAman}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${radiationLevel.color}`}
                                    style={{ width: `${Math.min((item.nilaiRadiasi / item.batasAman) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.petugas}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Radiation Trends */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Radiation Trends</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">Normal Levels</p>
                    <p className="text-2xl font-bold text-green-900">{stats.normalReadings}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Warning Levels</p>
                    <p className="text-2xl font-bold text-yellow-900">{stats.warningReadings}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-red-800">Critical Levels</p>
                    <p className="text-2xl font-bold text-red-900">{stats.criticalReadings}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 font-medium transition-colors">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Monitoring
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-green-700 font-medium transition-colors">
                  <Activity className="h-5 w-5 mr-2" />
                  Record Reading
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-700 font-medium transition-colors">
                  <Users className="h-5 w-5 mr-2" />
                  Assign Officer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Alerts</h2>
            <div className="space-y-4">
              {data.filter(d => d.status === "Critical" || d.status === "Warning").map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.status === "Critical" ? "bg-red-50 border-red-400" : "bg-yellow-50 border-yellow-400"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <AlertTriangle className={`h-5 w-5 mr-2 ${
                          alert.status === "Critical" ? "text-red-500" : "text-yellow-500"
                        }`} />
                        <h3 className={`text-sm font-medium ${
                          alert.status === "Critical" ? "text-red-800" : "text-yellow-800"
                        }`}>
                          {alert.status} - {alert.lokasi}
                        </h3>
                      </div>
                      <p className={`mt-1 text-sm ${
                        alert.status === "Critical" ? "text-red-700" : "text-yellow-700"
                      }`}>
                        Radiation level: {alert.nilaiRadiasi} mSv/h (Limit: {alert.batasAman} mSv/h)
                      </p>
                      <p className={`mt-1 text-xs ${
                        alert.status === "Critical" ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {alert.keterangan}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.status === "Critical" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {alert.status}
                    </span>
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

export default RadiographyMonitoringDashboard;
