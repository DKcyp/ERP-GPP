import React, { useState } from 'react';
import { Clock, Search, Calendar, FileText, FileBarChart, FileSpreadsheet, ShoppingCart, Trash2, FileCheck, CheckCircle } from 'lucide-react';

interface ExpiredBarangItem {
  no: number;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  satuan: string;
  jumlahExpired: number;
  tanggal: string;
  status: string;
  statusColor: string;
  serialNumber: string;
  keterangan: string;
  baStatus: 'Pending' | 'Generated' | 'Completed';
  qhseApproval: 'Pending' | 'Approved' | 'Rejected';
}

const ExpiredBarangDashboard: React.FC = () => {
  const [expiredItems, setExpiredItems] = useState<ExpiredBarangItem[]>([
    { 
      no: 1, kodeBarang: 'BRG001', namaBarang: 'Helm Safety', kategori: 'Alat', satuan: 'Unit', 
      jumlahExpired: 120, tanggal: '13-02-2025', status: 'Expired Dalam 2 Hari', statusColor: 'bg-yellow-100 text-yellow-800',
      serialNumber: 'HSF-2024-001', keterangan: 'Batch produksi Januari, masih layak pakai untuk training',
      baStatus: 'Pending', qhseApproval: 'Pending'
    },
    { 
      no: 2, kodeBarang: 'BRG002', namaBarang: 'Masker Respirator', kategori: 'Alat', satuan: 'Box', 
      jumlahExpired: 50, tanggal: '15-02-2025', status: 'Expired Dalam 4 Hari', statusColor: 'bg-yellow-100 text-yellow-800',
      serialNumber: 'MR-2024-002', keterangan: 'Filter masih berfungsi baik, perlu pengecekan ulang',
      baStatus: 'Generated', qhseApproval: 'Pending'
    },
    { 
      no: 3, kodeBarang: 'BRG003', namaBarang: 'Sarung Tangan Safety', kategori: 'Alat', satuan: 'Pasang', 
      jumlahExpired: 75, tanggal: '22-02-2025', status: 'Expired Dalam 7 Hari', statusColor: 'bg-yellow-100 text-yellow-800',
      serialNumber: 'SGS-2024-003', keterangan: 'Kualitas material masih baik, dapat digunakan untuk pekerjaan ringan',
      baStatus: 'Completed', qhseApproval: 'Approved'
    },
    { 
      no: 4, kodeBarang: 'BRG004', namaBarang: 'Sepatu Boot Safety', kategori: 'Alat', satuan: 'Pasang', 
      jumlahExpired: 30, tanggal: '25-01-2025', status: 'Sudah Expired', statusColor: 'bg-red-100 text-red-800',
      serialNumber: 'SBS-2024-004', keterangan: 'Sol sepatu mulai retak, tidak disarankan untuk digunakan',
      baStatus: 'Completed', qhseApproval: 'Rejected'
    },
    { 
      no: 5, kodeBarang: 'BRG005', namaBarang: 'Jaket Safety', kategori: 'Alat', satuan: 'Unit', 
      jumlahExpired: 20, tanggal: '30-01-2025', status: 'Sudah Expired', statusColor: 'bg-red-100 text-red-800',
      serialNumber: 'JS-2024-005', keterangan: 'Reflective tape mulai pudar, perlu penggantian segera',
      baStatus: 'Generated', qhseApproval: 'Pending'
    },
  ]);

  const handleGenerateBA = (id: number) => {
    setExpiredItems(prev => prev.map(item => 
      item.no === id ? { ...item, baStatus: 'Generated' } : item
    ));
  };

  const handleQHSEApproval = (id: number, approval: 'Approved' | 'Rejected') => {
    setExpiredItems(prev => prev.map(item => 
      item.no === id ? { ...item, qhseApproval: approval } : item
    ));
  };

  const getBAStatusBadge = (status: string) => {
    const config = {
      'Pending': { color: 'bg-gray-100 text-gray-800', icon: '⏳' },
      'Generated': { color: 'bg-blue-100 text-blue-800', icon: '📄' },
      'Completed': { color: 'bg-green-100 text-green-800', icon: '✅' }
    };
    const { color, icon } = config[status as keyof typeof config];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <span className="mr-1">{icon}</span>
        {status}
      </span>
    );
  };

  const getQHSEApprovalBadge = (status: string) => {
    const config = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'Approved': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'Rejected': { color: 'bg-red-100 text-red-800', icon: '❌' }
    };
    const { color, icon } = config[status as keyof typeof config];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <span className="mr-1">{icon}</span>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR EXPIRED BARANG
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Gudang</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Barang</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Expired Barang</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="relative">
              <label htmlFor="kodeBarang" className="block text-sm font-medium text-gray-700 mb-1">Cari Kode Barang</label>
              <input
                type="text"
                id="kodeBarang"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="BRG0001"
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label htmlFor="namaBarang" className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Barang</label>
              <input
                type="text"
                id="namaBarang"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Nama Barang"
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div>
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">Cari Kategori</label>
              <select
                id="kategori"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih Kategori--</option>
                <option>Alat</option>
                <option>Bahan</option>
              </select>
            </div>
            <div>
              <label htmlFor="satuan" className="block text-sm font-medium text-gray-700 mb-1">Cari Satuan</label>
              <select
                id="satuan"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih Satuan--</option>
                <option>Unit</option>
                <option>Box</option>
                <option>Pasang</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Cari Status</label>
              <select
                id="status"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih Status--</option>
                <option>Expired Dalam 7 Hari</option>
                <option>Sudah Expired</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <div className="relative w-1/2">
                <label htmlFor="periodeStart" className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
                <input
                  type="date"
                  id="periodeStart"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  defaultValue="2025-03-03"
                />
                <Calendar className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
              </div>
              <span className="text-gray-500 mb-1">s.d</span>
              <div className="relative w-1/2">
                <input
                  type="date"
                  id="periodeEnd"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  defaultValue="2025-03-03"
                />
                <Calendar className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mb-6">
            <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md">
              Search
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end space-x-3 mb-6">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm">
              <FileText className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm">
              <FileBarChart className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Show</span>
                <select className="border border-gray-300 rounded-md px-2 py-1">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span>entries</span>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Expired</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BA Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QHSE Approval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expiredItems.map((item) => (
                  <tr key={item.no} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kodeBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-blue-600">{item.serialNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.satuan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jumlahExpired}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getBAStatusBadge(item.baStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getQHSEApprovalBadge(item.qhseApproval)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={item.keterangan}>
                        {item.keterangan}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* BA Button */}
                        {item.baStatus === 'Pending' && (
                          <button 
                            onClick={() => handleGenerateBA(item.no)}
                            className="text-purple-600 hover:text-purple-900 transition-colors duration-200 p-1 rounded-full hover:bg-purple-100"
                            title="Generate BA"
                          >
                            <FileCheck className="h-4 w-4" />
                          </button>
                        )}
                        
                        {/* QHSE Approval Buttons */}
                        {item.baStatus !== 'Pending' && item.qhseApproval === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleQHSEApproval(item.no, 'Approved')}
                              className="text-green-600 hover:text-green-900 transition-colors duration-200 p-1 rounded-full hover:bg-green-100"
                              title="QHSE Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleQHSEApproval(item.no, 'Rejected')}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-100"
                              title="QHSE Reject"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {/* Default Actions */}
                        <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded-full hover:bg-blue-100">
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing 1 to {expiredItems.length} of {expiredItems.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Previous
              </button>
              <button className="px-4 py-2 border border-blue-500 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiredBarangDashboard;
