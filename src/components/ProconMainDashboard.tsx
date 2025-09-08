import React from 'react';
import { Clock, FileText, BarChart2, ClipboardList, Layers, FileSpreadsheet } from 'lucide-react';

const ProconOverviewDashboard: React.FC = () => {
  // Dashboard summary data
  const totalInvoices = 125;
  const pendingInvoices = 30;
  const paidInvoices = 95;
  const activeProjects = 15;
  const completedProjects = 42;
  const hppVariance = 2.5; // %
  const totalSO = 187;

  const invoiceProjectionData = [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 150 },
    { month: 'Mar', value: 130 },
    { month: 'Apr', value: 180 },
    { month: 'May', value: 160 },
    { month: 'Jun', value: 200 },
  ];

  const projectPerformanceData = [
    { project: 'Project A', progress: 75, hppVariance: 2.5, status: 'On Track' },
    { project: 'Project B', progress: 90, hppVariance: -1.2, status: 'Ahead' },
    { project: 'Project C', progress: 45, hppVariance: 4.1, status: 'At Risk' },
    { project: 'Project D', progress: 60, hppVariance: 0.5, status: 'On Track' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                PROCON MONITORING DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Procon</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring Dashboard</span>
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Proforma Invoice Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Proforma Invoices</p>
                <p className="text-3xl font-bold text-gray-900">{totalInvoices}</p>
                <p className="text-sm text-gray-500">Pending: <span className="font-medium">{pendingInvoices}</span> • Paid: <span className="font-medium">{paidInvoices}</span></p>
              </div>
            </div>
          </div>

          {/* Project Monitoring */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <ClipboardList className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">{activeProjects}</p>
                <p className="text-sm text-gray-500">Completed: <span className="font-medium">{completedProjects}</span></p>
              </div>
            </div>
          </div>

          {/* HPP Project Control */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Layers className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">HPP Project Variance</p>
                <p className={`text-3xl font-bold ${hppVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {hppVariance >= 0 ? '+' : ''}{hppVariance}%
                </p>
                <p className="text-sm text-gray-500">Against target</p>
              </div>
            </div>
          </div>

          {/* Sales Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <FileSpreadsheet className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Sales Orders</p>
                <p className="text-3xl font-bold text-gray-900">{totalSO}</p>
                <p className="text-sm text-gray-500">Total SO registered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estimasi Invoice Penagihan Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-blue-600" />
            <span>Estimasi Invoice Penagihan (Bulanan)</span>
          </h3>
          <div className="h-64 flex items-end justify-center space-x-4">
            {invoiceProjectionData.map((item, index) => (
              <div key={item.month} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-12 bg-blue-500 rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80`}
                  style={{ height: `${item.value * 0.8}px` }}
                ></div>
                <span className="text-sm text-gray-600 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Performance Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-purple-600" />
            <span>Project Performance Overview</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HPP Variance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectPerformanceData.map((project) => (
                  <tr key={project.project} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.project}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${project.progress > 70 ? 'bg-green-500' : project.progress > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{project.progress}%</span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${project.hppVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {project.hppVariance >= 0 ? '+' : ''}{project.hppVariance}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${project.status === 'On Track' ? 'bg-green-100 text-green-800' : 
                          project.status === 'Ahead' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Sales Orders */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <FileSpreadsheet className="h-6 w-6 text-orange-600" />
            <span>Recent Sales Orders</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SO Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">SO-2023-001</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PT. ABC Sejahtera</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 125.000.000</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">SO-2023-002</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PT. XYZ Mandiri</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 98.500.000</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      In Progress
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">SO-2023-003</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CV. Jaya Abadi</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 75.250.000</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      New
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProconOverviewDashboard;
