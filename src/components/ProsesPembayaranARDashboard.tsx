import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const ProsesPembayaranARDashboard: React.FC = () => {
  const dummyTableData = [
    { id: 1, supplierName: 'PT Global Tech', type: 'Barang', value: 'Rp 15.000.000', status: 'Pending' },
    { id: 2, supplierName: 'CV Solusi Digital', type: 'Jasa', value: 'Rp 7.500.000', status: 'Approved' },
    { id: 3, supplierName: 'UD Makmur Jaya', type: 'Barang', value: 'Rp 3.000.000', status: 'Pending' },
    { id: 4, supplierName: 'PT Abadi Sentosa', type: 'Jasa', value: 'Rp 10.000.000', status: 'Paid' },
    { id: 5, supplierName: 'PT Sejahtera Abadi', type: 'Barang', value: 'Rp 1.200.000', status: 'Approved' },
    { id: 6, supplierName: 'CV Bersama Maju', type: 'Jasa', value: 'Rp 4.500.000', status: 'Pending' },
    { id: 7, supplierName: 'PT Indah Karya', type: 'Barang', value: 'Rp 50.000.000', status: 'Paid' },
    { id: 8, supplierName: 'UD Sentosa Jaya', type: 'Jasa', value: 'Rp 800.000', status: 'Approved' },
    { id: 9, supplierName: 'PT Cepat Tanggap', type: 'Barang', value: 'Rp 6.000.000', status: 'Pending' },
    { id: 10, supplierName: 'CV Harmoni Digital', type: 'Jasa', value: 'Rp 2.500.000', status: 'Approved' },
  ];

  const handlePay = (id: number) => {
    alert(`Membayar AR untuk Supplier: ${dummyTableData.find(item => item.id === id)?.supplierName}`);
    // Implement actual payment processing logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                PROSES PEMBAYARAN AR
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">AR</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Proses Pembayaran AR</span>
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
        {/* Table List View */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Pembayaran AR</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Supplier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyTableData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.supplierName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        item.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.status !== 'Paid' && (
                        <button
                          onClick={() => handlePay(item.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Bayar</span>
                        </button>
                      )}
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

export default ProsesPembayaranARDashboard;
