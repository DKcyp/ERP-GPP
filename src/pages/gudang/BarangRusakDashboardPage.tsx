import React, { useState } from 'react';
import { Eye, FileDown, Plus, Search, Trash2, Wrench } from 'lucide-react';

// Mock Data for Damaged Goods
const damagedGoodsData = [
  {
    id: 'BR-001',
    itemName: 'Kabel HDMI 2m',
    itemCode: 'HDMI-002',
    quantity: 5,
    reportDate: '2023-10-26',
    status: 'Rusak Berat',
    cause: 'Terlindas forklift',
    reporter: 'Andi',
  },
  {
    id: 'BR-002',
    itemName: 'Mouse Wireless Logitech',
    itemCode: 'LOGI-M185',
    quantity: 2,
    reportDate: '2023-10-25',
    status: 'Rusak Ringan',
    cause: 'Tombol klik kiri macet',
    reporter: 'Budi',
  },
  {
    id: 'BR-003',
    itemName: 'Monitor Samsung 24 inch',
    itemCode: 'SM-LF24T350',
    quantity: 1,
    reportDate: '2023-10-25',
    status: 'Perlu Dibuang',
    cause: 'Layar pecah saat pemindahan',
    reporter: 'Citra',
  },
  {
    id: 'BR-004',
    itemName: 'Keyboard Mechanical',
    itemCode: 'KEY-MCH-01',
    quantity: 3,
    reportDate: '2023-10-24',
    status: 'Menunggu Perbaikan',
    cause: 'Konektor USB patah',
    reporter: 'Doni',
  },
];

// Helper to determine status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Rusak Berat':
      return 'bg-red-100 text-red-800';
    case 'Perlu Dibuang':
      return 'bg-gray-100 text-gray-800';
    case 'Rusak Ringan':
      return 'bg-yellow-100 text-yellow-800';
    case 'Menunggu Perbaikan':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const BarangRusakDashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const filteredData = damagedGoodsData.filter(
    (item) =>
      (item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'Semua' || item.status === filterStatus)
  );

  const summaryCards = [
    { title: 'Total Laporan', value: damagedGoodsData.length, color: 'text-blue-500' },
    {
      title: 'Rusak Berat',
      value: damagedGoodsData.filter((i) => i.status === 'Rusak Berat').length,
      color: 'text-red-500',
    },
    {
      title: 'Rusak Ringan',
      value: damagedGoodsData.filter((i) => i.status === 'Rusak Ringan').length,
      color: 'text-yellow-500',
    },
    {
      title: 'Menunggu Perbaikan',
      value: damagedGoodsData.filter((i) => i.status === 'Menunggu Perbaikan').length,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Monitoring Barang Rusak</h1>
        <div className="flex items-center space-x-2">
          <button className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-100 transition-colors">
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Lapor Barang Rusak
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-gray-500 font-medium">{card.title}</h3>
            <p className={`text-4xl font-bold mt-2 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters and Table Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        {/* Filter and Search */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama atau kode barang..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>Semua</option>
              <option>Rusak Berat</option>
              <option>Rusak Ringan</option>
              <option>Menunggu Perbaikan</option>
              <option>Perlu Dibuang</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">ID Laporan</th>
                <th className="p-4 font-semibold text-gray-600">Nama Barang</th>
                <th className="p-4 font-semibold text-gray-600">Jumlah</th>
                <th className="p-4 font-semibold text-gray-600">Tanggal Lapor</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-800 font-medium">{item.id}</td>
                  <td className="p-4 text-gray-800">
                    <div>{item.itemName}</div>
                    <div className="text-sm text-gray-500">{item.itemCode}</div>
                  </td>
                  <td className="p-4 text-gray-800">{item.quantity}</td>
                  <td className="p-4 text-gray-800">{item.reportDate}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Eye size={20} />
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <Wrench size={20} />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BarangRusakDashboardPage;
