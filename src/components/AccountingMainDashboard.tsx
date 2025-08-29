import React from 'react';
import { Bell, Plus } from 'lucide-react'; // Updated icons
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const AccountingMainDashboard: React.FC = () => {
  const today = new Date();

  // Mock data for charts
  const monthlyRevenueExpensesData = [
    { name: 'Jan', revenue: 50000, expenses: 30000 },
    { name: 'Feb', revenue: 55000, expenses: 35000 },
    { name: 'Mar', revenue: 65000, expenses: 45000 },
    { name: 'Apr', revenue: 60000, expenses: 40000 },
    { name: 'May', revenue: 80000, expenses: 58000 },
    { name: 'Jun', revenue: 68000, expenses: 42000 },
    { name: 'Jul', revenue: 75000, expenses: 50000 },
    { name: 'Aug', revenue: 90000, expenses: 68000 },
  ];

  const expenseDistributionData = [
    { name: 'Labor', value: 400 },
    { name: 'Materials', value: 300 },
    { name: 'Transportation', value: 200 },
    { name: 'Other', value: 100 },
  ];
  const PIE_COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE']; // Shades of blue for donut chart

  const outstandingInvoicesData = [
    { name: 'Company A Co', value: 20000 },
    { name: 'Company B Inc', value: 25000 },
    { name: 'Company C Corp', value: 22000 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                ACCOUNTING DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Main Dashboard</span>
              </nav>
            </div>
            {/* Removed Last updated timestamp as per image */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Cash & Bank */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Cash & Bank</p>
            <p className="text-4xl font-bold text-gray-900">$125,000</p>
          </div>

          {/* Accounts Receivable */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Accounts Receivable</p>
            <p className="text-4xl font-bold text-gray-900">$82,500</p>
          </div>

          {/* Accounts Payable */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Accounts Payable</p>
            <p className="text-4xl font-bold text-gray-900">$47,000</p>
          </div>

          {/* Revenue vs Expense */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Revenue vs Expense</p>
            <p className="text-4xl font-bold text-gray-900 mb-4">$85,000</p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '70%' }}></div> {/* Example width */}
              </div>
              <span className="text-gray-900 font-medium">$85,000</span>
              <span className="text-gray-500">$65,000</span>
            </div>
          </div>
        </div>

        {/* Charts and Notifications - Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Revenue & Expenses Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue & Expenses</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyRevenueExpensesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#a3a3a3" />
                  <YAxis axisLine={false} tickLine={false} stroke="#a3a3a3" tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip cursor={{ stroke: '#d1d5db', strokeWidth: 1 }} />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#60A5FA" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <span className="h-2 w-2 bg-gray-400 rounded-full mr-3"></span>
                Invoice due in 3 days
              </li>
              <li className="flex items-center text-gray-700">
                <span className="h-2 w-2 bg-gray-400 rounded-full mr-3"></span>
                Payment due
              </li>
              <li className="flex items-center text-gray-700">
                <span className="h-2 w-2 bg-gray-400 rounded-full mr-3"></span>
                Project over budget
              </li>
              <li className="flex items-center text-gray-700">
                <span className="h-2 w-2 bg-gray-400 rounded-full mr-3"></span>
                Taxes due
              </li>
            </ul>
          </div>
        </div>

        {/* Expense Distribution, DSO, Aging, Outstanding Invoices - Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expense Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DSO & New Invoice */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DSO</h3>
              <p className="text-6xl font-bold text-gray-900 mb-2">45</p>
              <p className="text-lg text-gray-600">Days</p>
            </div>
            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
              <Plus className="h-5 w-5" />
              <span>New Invoice</span>
            </button>
          </div>

          {/* Aging Receivables */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aging Receivables</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-gray-700">
                <span>0-30 days</span>
                <span className="font-medium text-gray-900">$50,000</span>
              </li>
              <li className="flex justify-between items-center text-gray-700">
                <span>31-60 days</span>
                <span className="font-medium text-gray-900">$20,000</span>
              </li>
              <li className="flex justify-between items-center text-gray-700">
                <span>Over 60 days</span>
                <span className="font-medium text-gray-900">$12,500</span>
              </li>
            </ul>
          </div>

          {/* Outstanding Invoices Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Outstanding Invoices</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={outstandingInvoicesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#a3a3a3" />
                  <YAxis axisLine={false} tickLine={false} stroke="#a3a3a3" tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" fill="#3B82F6" barSize={30} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Another Notifications/Alerts Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <span className="h-2 w-2 bg-red-500 rounded-full mr-3"></span>
                Invoice due soon
              </li>
              <li className="flex items-center text-gray-700">
                <span className="h-2 w-2 bg-yellow-500 rounded-full mr-3"></span>
                Project budget nearing limit
              </li>
              <li className="flex items-center text-gray-700">
                <span className="h-2 w-2 bg-orange-500 rounded-full mr-3"></span>
                Tax filing deadline approaching
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingMainDashboard;
