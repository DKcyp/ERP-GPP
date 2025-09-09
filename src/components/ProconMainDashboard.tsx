import React from 'react';
import { Clock, FileText, BarChart2, ClipboardList, FileSpreadsheet } from 'lucide-react';

const ProconOverviewDashboard: React.FC = () => {
  // Dashboard summary data
  const totalPIYear = 1250000000; // Total nilai PI 1 tahun (mock)
  const jumlahPI = 120; // Jumlah PI (mock)
  const activeProjects = 15;
  const totalSOTercreate = 150;
  const totalSOComplete = 120;
  const totalSO = totalSOTercreate + totalSOComplete; // sync total with breakdown

  const proformaInvoiceMonthly = [
    { month: 'Jan', amount: 120_000_000 },
    { month: 'Feb', amount: 150_000_000 },
    { month: 'Mar', amount: 130_000_000 },
    { month: 'Apr', amount: 180_000_000 },
    { month: 'May', amount: 160_000_000 },
    { month: 'Jun', amount: 200_000_000 },
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
      absorbKontrak: 105000000,
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
      absorbKontrak: 85000000,
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

  const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Proforma Invoice */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Proforma Invoice (1 Tahun)</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">Rp {totalPIYear.toLocaleString('id-ID')}</p>
                <p className="text-sm text-gray-500">Jumlah PI: <span className="font-medium">{jumlahPI}</span></p>
              </div>
            </div>
          </div>

          {/* Jumlah Proyek Aktif */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <ClipboardList className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Jumlah Proyek Aktif</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{activeProjects}</p>
              </div>
            </div>
          </div>

          {/* Total SO */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <FileSpreadsheet className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Sales Order</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{totalSO}</p>
                <p className="text-sm text-gray-500">SO Tercreate - SO Complete: <span className="font-medium">{totalSOTercreate} - {totalSOComplete}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Proforma Invoice per Bulan */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-blue-600" />
            <span>Proforma Invoice (Per Bulan)</span>
          </h3>
          <div className="h-64 flex items-end justify-center space-x-4">
            {proformaInvoiceMonthly.map((item) => (
              <div key={item.month} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-12 bg-blue-500 rounded-t-lg transition-all duration-700 ease-out hover:opacity-80`}
                  style={{ height: `${(item.amount / 1_000_000) * 0.8}px` }}
                  title={`Rp ${item.amount.toLocaleString('id-ID')}`}
                ></div>
                <span className="text-xs text-gray-500">Rp {(item.amount/1_000_000).toFixed(0)} jt</span>
                <span className="text-sm text-gray-700 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Performance Overview (customized columns) */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-purple-600" />
            <span>Project Performance Overview</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. SO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laba Rugi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status project - Profit/Loss</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectPerformanceData.map((row, idx) => {
                  const progress = Math.round((row.absorbKontrak / row.contractValue) * 100);
                  const labaRugi = row.absorbKontrak - row.contractValue * 0.8; // mock calc
                  const status = labaRugi >= 0 ? 'Profit' : 'Loss';
                  const statusClass = labaRugi >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                  return (
                    <tr key={`${row.soInduk}-${row.soTurunan}-${idx}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.soInduk}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.clientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-blue-600 h-2" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
                          </div>
                          <span className="text-gray-700 font-medium">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {Math.abs(labaRugi).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>{status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kontrak Expenditure (moved table) */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-blue-600" />
            <span>Kontrak Expenditure</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Nama Client</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Nomor SO Induk & SO Turunan</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Durasi Kontrak (Tanggal awal - akhir kontrak)</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Nilai Kontrak</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Absorb Kontrak</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Remaining Kontrak</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Next Estimasi Tagihan</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Delay Penagihan</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Paid Date</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">Keterangan pekerjaan project</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projectPerformanceData.map((row, idx) => (
                  <tr key={`${row.soInduk}-${row.soTurunan}-${idx}`} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900 font-medium">{row.clientName}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">{row.soInduk}</span>
                        <span className="text-gray-500">{row.soTurunan}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{row.contractStart} - {row.contractEnd}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium">{formatRupiah(row.contractValue)}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium">{formatRupiah(row.absorbKontrak)}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium">{formatRupiah(row.remainingKontrak)}</td>
                    <td className="px-3 py-2 text-gray-700">{row.nextEstimasiTagihan}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 inline-flex text-[10px] leading-5 font-semibold rounded-full ${row.delayPenagihan <= 0 ? 'bg-green-100 text-green-800' : row.delayPenagihan <= 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {row.delayPenagihan > 0 ? `${row.delayPenagihan} hari` : 'On time'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{row.paidDate}</td>
                    <td className="px-3 py-2 text-gray-700">{row.keterangan}</td>
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

export default ProconOverviewDashboard;
