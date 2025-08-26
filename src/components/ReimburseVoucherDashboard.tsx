import React from 'react';
import { Clock, Wallet, CheckCircle } from 'lucide-react';

const ReimburseVoucherDashboard: React.FC = () => {
  const dummyTableData = [
    { id: 1, voucherNo: 'RV-202407001', name: 'Budi Santoso', description: 'Perjalanan Dinas Jakarta', amount: 'Rp 1.500.000', status: 'Pending' },
    { id: 2, voucherNo: 'RV-202407002', name: 'Siti Aminah', description: 'Pembelian Perlengkapan Kantor', amount: 'Rp 750.000', status: 'Approved' },
    { id: 3, voucherNo: 'RV-202407003', name: 'Joko Susilo', description: 'Biaya Entertainment Klien', amount: 'Rp 2.000.000', status: 'Pending' },
    { id: 4, voucherNo: 'RV-202407004', name: 'Dewi Lestari', description: 'Transportasi Lokal', amount: 'Rp 300.000', status: 'Paid' },
    { id: 5, voucherNo: 'RV-202407005', name: 'Rahmat Hidayat', description: 'Akomodasi Workshop', amount: 'Rp 1.200.000', status: 'Approved' },
    { id: 6, voucherNo: 'RV-202407006', name: 'Ani Suryani', description: 'Makan Siang Tim', amount: 'Rp 450.000', status: 'Pending' },
    { id: 7, voucherNo: 'RV-202407007', name: 'Fajar Nugroho', description: 'Pembelian Software', amount: 'Rp 3.500.000', status: 'Paid' },
    { id: 8, voucherNo: 'RV-202407008', name: 'Kartika Putri', description: 'Biaya Internet Bulanan', amount: 'Rp 600.000', status: 'Approved' },
    { id: 9, voucherNo: 'RV-202407009', name: 'Eko Prasetyo', description: 'Perbaikan Kendaraan', amount: 'Rp 900.000', status: 'Pending' },
    { id: 10, voucherNo: 'RV-202407010', name: 'Linda Wijaya', description: 'Pelatihan Karyawan', amount: 'Rp 2.800.000', status: 'Approved' },
  ];

  const handlePay = (id: number) => {
    alert(`Membayar voucher No: ${dummyTableData.find(item => item.id === id)?.voucherNo}`);
    // Implement actual payment logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                REIMBURSE / VOUCHER
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Reimburse / Voucher</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Reimburse / Voucher</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Voucher</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyTableData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.voucherNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
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

export default ReimburseVoucherDashboard;
