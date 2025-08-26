import React from 'react';
import { Clock, FileText, Download, FileSpreadsheet } from 'lucide-react';

const LaporanAPDashboard: React.FC = () => {
  const dummyTableData = [
    { id: 1, date: '2024-06-28', vendor: 'PT Maju Jaya', description: 'Pembelian Server', amount: 'Rp 25.000.000', status: 'Paid' },
    { id: 2, date: '2024-06-29', vendor: 'CV Solusi Digital', description: 'Lisensi Software', amount: 'Rp 12.000.000', status: 'Pending' },
    { id: 3, date: '2024-06-30', vendor: 'UD Bersama', description: 'Jasa Kebersihan', amount: 'Rp 2.500.000', status: 'Paid' },
    { id: 4, date: '2024-07-01', vendor: 'PT Global Tech', description: 'Maintenance Jaringan', amount: 'Rp 8.000.000', status: 'Approved' },
    { id: 5, date: '2024-07-02', vendor: 'CV Kreatif', description: 'Desain Grafis', amount: 'Rp 4.000.000', status: 'Pending' },
    { id: 6, date: '2024-07-03', vendor: 'PT Indah Karya', description: 'Sewa Kantor', amount: 'Rp 18.000.000', status: 'Paid' },
    { id: 7, date: '2024-07-04', vendor: 'UD Sejahtera', description: 'Pengadaan ATK', amount: 'Rp 1.500.000', status: 'Approved' },
    { id: 8, date: '2024-07-05', vendor: 'PT Cepat Tanggap', description: 'Perbaikan AC', amount: 'Rp 3.200.000', status: 'Pending' },
    { id: 9, date: '2024-07-06', vendor: 'CV Makmur Abadi', description: 'Biaya Listrik', amount: 'Rp 6.700.000', status: 'Paid' },
    { id: 10, date: '2024-07-07', vendor: 'PT Sentosa', description: 'Transportasi Logistik', amount: 'Rp 900.000', status: 'Approved' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LAPORAN AP
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">AP</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Laporan AP</span>
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
        {/* Action Bar */}
        <div className="flex justify-end space-x-3 mb-6">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export PDF</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5" />
            <span>Export Excel</span>
          </button>
        </div>

        {/* Table List View */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Laporan AP</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyTableData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        item.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
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

export default LaporanAPDashboard;
