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

  // Mock data adapted to requested columns for Project Performance Overview
  const projectPerformanceData = [
    {
      clientName: 'PT. ABC Sejahtera',
      soInduk: 'SO-IND-001',
      soTurunan: 'SO-TRN-001-A',
      contractStart: '01/02/2025',
      contractEnd: '31/07/2025',
      contractValue: 125000000,
      absorbKontrak: 65000000,
      remainingKontrak: 60000000,
      nextEstimasiTagihan: '15/09/2025',
      delayPenagihan: 0,
      paidDate: '-',
      keterangan: 'Implementasi sistem modul A',
    },
    {
      clientName: 'PT. XYZ Mandiri',
      soInduk: 'SO-IND-002',
      soTurunan: 'SO-TRN-002-B',
      contractStart: '10/01/2025',
      contractEnd: '10/10/2025',
      contractValue: 98500000,
      absorbKontrak: 50000000,
      remainingKontrak: 48500000,
      nextEstimasiTagihan: '25/09/2025',
      delayPenagihan: 7,
      paidDate: '05/08/2025',
      keterangan: 'Pengembangan integrasi API',
    },
    {
      clientName: 'CV. Jaya Abadi',
      soInduk: 'SO-IND-003',
      soTurunan: 'SO-TRN-003-C',
      contractStart: '05/03/2025',
      contractEnd: '05/12/2025',
      contractValue: 75250000,
      absorbKontrak: 30000000,
      remainingKontrak: 45250000,
      nextEstimasiTagihan: '10/10/2025',
      delayPenagihan: 14,
      paidDate: '-',
      keterangan: 'Maintenance dan support',
    },
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
            {invoiceProjectionData.map((item) => (
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor SO Induk & SO Turunan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi Kontrak (Tanggal awal - akhir kontrak)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Kontrak</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absorb Kontrak</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Kontrak</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Estimasi Tagihan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delay Penagihan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan pekerjaan project</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectPerformanceData.map((row, idx) => (
                  <tr key={`${row.soInduk}-${row.soTurunan}-${idx}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{row.soInduk}</span>
                        <span className="text-gray-500">{row.soTurunan}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.contractStart} - {row.contractEnd}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`Rp ${row.contractValue.toLocaleString('id-ID')}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`Rp ${row.absorbKontrak.toLocaleString('id-ID')}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`Rp ${row.remainingKontrak.toLocaleString('id-ID')}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.nextEstimasiTagihan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={
                        `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          row.delayPenagihan <= 0 ? 'bg-green-100 text-green-800' :
                          row.delayPenagihan <= 7 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`
                      }>
                        {row.delayPenagihan > 0 ? `${row.delayPenagihan} hari` : 'On time'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.paidDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.keterangan}</td>
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
