import React from 'react';
import { Clock, FileText, Download, FileSpreadsheet } from 'lucide-react';

const LaporanARDashboard: React.FC = () => {
  const dummyTableData = [
    { id: 1, supplierName: 'PT Cipta Karya', value: 'Rp 30.000.000', date: '2024-06-25', status: 'Outstanding' },
    { id: 2, supplierName: 'CV Mitra Usaha', value: 'Rp 10.000.000', date: '2024-06-26', status: 'Paid' },
    { id: 3, supplierName: 'UD Jaya Abadi', value: 'Rp 5.000.000', date: '2024-06-27', status: 'Outstanding' },
    { id: 4, supplierName: 'PT Sinar Terang', value: 'Rp 18.000.000', date: '2024-06-28', status: 'Paid' },
    { id: 5, supplierName: 'CV Maju Bersama', value: 'Rp 7.000.000', date: '2024-06-29', status: 'Outstanding' },
    { id: 6, supplierName: 'PT Global Solusi', value: 'Rp 22.000.000', date: '2024-06-30', status: 'Paid' },
    { id: 7, supplierName: 'UD Kreatif Digital', value: 'Rp 3.500.000', date: '2024-07-01', status: 'Outstanding' },
    { id: 8, supplierName: 'PT Harmoni Alam', value: 'Rp 12.000.000', date: '2024-07-02', status: 'Paid' },
    { id: 9, supplierName: 'CV Cepat Tumbuh', value: 'Rp 9.000.000', date: '2024-07-03', status: 'Outstanding' },
    { id: 10, supplierName: 'PT Sejahtera Makmur', value: 'Rp 2.000.000', date: '2024-07-04', status: 'Paid' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LAPORAN AR
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">AR</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Laporan AR</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Laporan AR</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Supplier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyTableData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.supplierName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Paid' ? 'bg-green-100 text-green-800' :
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

export default LaporanARDashboard;
