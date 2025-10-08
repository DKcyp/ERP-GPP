import React, { useState } from 'react';
import { Wallet, TrendingDown, TrendingUp, DollarSign, Clock, FileText, Receipt } from 'lucide-react';

interface BudgetItem {
  id: string;
  kategori: string;
  nilaiBudget: number;
  nilaiPemakaian: number;
  nilaiSisa: number;
  persentaseSisa: number;
  sumberPO: number;
  sumberVoucher: number;
}

const BudgetKantorDashboard: React.FC = () => {
  const today = new Date();

  // Data Budget Kantor berdasarkan PO dan Voucher
  const budgetData: BudgetItem[] = [
    {
      id: '1',
      kategori: 'ATK & Perlengkapan Kantor',
      nilaiBudget: 50000000,
      nilaiPemakaian: 32500000,
      nilaiSisa: 17500000,
      persentaseSisa: 35,
      sumberPO: 25000000,
      sumberVoucher: 7500000,
    },
    {
      id: '2',
      kategori: 'Konsumsi & Rapat',
      nilaiBudget: 30000000,
      nilaiPemakaian: 22000000,
      nilaiSisa: 8000000,
      persentaseSisa: 26.67,
      sumberPO: 15000000,
      sumberVoucher: 7000000,
    },
    {
      id: '3',
      kategori: 'Maintenance & Perbaikan',
      nilaiBudget: 75000000,
      nilaiPemakaian: 45000000,
      nilaiSisa: 30000000,
      persentaseSisa: 40,
      sumberPO: 40000000,
      sumberVoucher: 5000000,
    },
    {
      id: '4',
      kategori: 'Transportasi & Perjalanan Dinas',
      nilaiBudget: 40000000,
      nilaiPemakaian: 28500000,
      nilaiSisa: 11500000,
      persentaseSisa: 28.75,
      sumberPO: 0,
      sumberVoucher: 28500000,
    },
    {
      id: '5',
      kategori: 'Utilitas (Listrik, Air, Internet)',
      nilaiBudget: 60000000,
      nilaiPemakaian: 42000000,
      nilaiSisa: 18000000,
      persentaseSisa: 30,
      sumberPO: 0,
      sumberVoucher: 42000000,
    },
    {
      id: '6',
      kategori: 'Peralatan & Furniture',
      nilaiBudget: 100000000,
      nilaiPemakaian: 65000000,
      nilaiSisa: 35000000,
      persentaseSisa: 35,
      sumberPO: 65000000,
      sumberVoucher: 0,
    },
    {
      id: '7',
      kategori: 'IT & Software',
      nilaiBudget: 80000000,
      nilaiPemakaian: 58000000,
      nilaiSisa: 22000000,
      persentaseSisa: 27.5,
      sumberPO: 50000000,
      sumberVoucher: 8000000,
    },
    {
      id: '8',
      kategori: 'Kebersihan & Sanitasi',
      nilaiBudget: 25000000,
      nilaiPemakaian: 18500000,
      nilaiSisa: 6500000,
      persentaseSisa: 26,
      sumberPO: 12000000,
      sumberVoucher: 6500000,
    },
  ];

  const formatRupiah = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 40) return 'text-green-600 bg-green-100';
    if (percentage >= 25) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 40) return 'bg-green-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculate totals
  const totalBudget = budgetData.reduce((sum, item) => sum + item.nilaiBudget, 0);
  const totalPemakaian = budgetData.reduce((sum, item) => sum + item.nilaiPemakaian, 0);
  const totalSisa = budgetData.reduce((sum, item) => sum + item.nilaiSisa, 0);
  const totalPersentaseSisa = (totalSisa / totalBudget) * 100;
  const totalPO = budgetData.reduce((sum, item) => sum + item.sumberPO, 0);
  const totalVoucher = budgetData.reduce((sum, item) => sum + item.sumberVoucher, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                BUDGET KANTOR
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Pengadaan</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Budget Kantor</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalBudget)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pemakaian</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalPemakaian)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sisa</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalSisa)}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{totalPersentaseSisa.toFixed(2)}% tersisa</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">Dari PO</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatRupiah(totalPO)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Receipt className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">Dari Voucher</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatRupiah(totalVoucher)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
              Rincian Budget per Kategori
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai Budget
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai Pemakaian
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai Sisa
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Sisa
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dari PO
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dari Voucher
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgetData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.kategori}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {formatRupiah(item.nilaiBudget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right font-semibold">
                      {formatRupiah(item.nilaiPemakaian)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right font-semibold">
                      {formatRupiah(item.nilaiSisa)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPercentageColor(item.persentaseSisa)}`}>
                        {item.persentaseSisa.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressBarColor(item.persentaseSisa)}`}
                          style={{ width: `${item.persentaseSisa}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 text-right font-medium">
                      {formatRupiah(item.sumberPO)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 text-right font-medium">
                      {formatRupiah(item.sumberVoucher)}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-blue-50 font-bold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    TOTAL
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatRupiah(totalBudget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                    {formatRupiah(totalPemakaian)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                    {formatRupiah(totalSisa)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPercentageColor(totalPersentaseSisa)}`}>
                      {totalPersentaseSisa.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 text-right">
                    {formatRupiah(totalPO)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 text-right">
                    {formatRupiah(totalVoucher)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Keterangan Status Budget:</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">Aman (≥ 40% sisa)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-600">Perhatian (25-39% sisa)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-600">Kritis (&lt; 25% sisa)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetKantorDashboard;
