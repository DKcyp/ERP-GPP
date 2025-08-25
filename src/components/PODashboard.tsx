import React from 'react';
import { Search, Calendar, FileDown } from 'lucide-react';

const poDashboardData = [
  {
    id: 1,
    tglPembuatan: '01-02-2025',
    noPo: 'PO001',
    namaDivisi: 'Divisi Sertifikasi',
    namaVendor: 'PT. Permata Buana',
    namaBarang: ['Dokumen', 'formulir sertifikasi'],
    namaJasa: '-',
    nominalPo: 'Rp 150.000.000',
    status: 'Open',
  },
  {
    id: 2,
    tglPembuatan: '03-02-2025',
    noPo: 'PO002',
    namaDivisi: 'Divisi Konsultasi',
    namaVendor: 'CV. Maju Jaya',
    namaBarang: '-',
    namaJasa: ['Jasa riset', 'Jasa transportasi'],
    nominalPo: 'Rp 85.000.000',
    status: 'Close',
  },
  {
    id: 3,
    tglPembuatan: '05-02-2025',
    noPo: 'PO003',
    namaDivisi: 'Devisi Pelatihan',
    namaVendor: 'UD. Cahaya Abadi',
    namaBarang: ['Peralatan pelatihan rope access'],
    namaJasa: '-',
    nominalPo: 'Rp 25.000.000',
    status: 'Open',
  },
  {
    id: 4,
    tglPembuatan: '07-02-2025',
    noPo: 'PO004',
    namaDivisi: 'Divisi Inspeksi',
    namaVendor: 'PT. Teknologi Sejahtera',
    namaBarang: ['Kalibrasi Peralatan Inspeksi'],
    namaJasa: '-',
    nominalPo: 'Rp 10.000.000',
    status: 'Close',
  },
];

const PODashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">DASHBOARD PO</h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            {/* Cari No PO */}
            <div>
              <label htmlFor="noPo" className="block text-sm font-medium text-gray-700 mb-1">Cari No PO</label>
              <div className="relative">
                <input type="text" id="noPo" defaultValue="PO001" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Cari Devisi */}
            <div>
              <label htmlFor="devisi" className="block text-sm font-medium text-gray-700 mb-1">Cari Devisi</label>
              <div className="relative">
                <input type="text" id="devisi" defaultValue="Divisi Sertifikasi" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Cari Nama Vendor */}
            <div>
              <label htmlFor="namaVendor" className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Vendor</label>
              <div className="relative">
                <input type="text" id="namaVendor" defaultValue="PT. Permata Buana" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Periode */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input type="text" defaultValue="03/03/2025" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </span>
                </div>
                <span className="text-gray-600">s.d</span>
                <div className="relative flex-1">
                  <input type="text" defaultValue="03/03/2025" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </span>
                </div>
              </div>
            </div>
            
            {/* Search Button */}
            <div className="flex justify-end">
                <button className="w-full md:w-auto px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-sm">
                    Search
                </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                {/* Show Entries */}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span>Show</span>
                    <select className="border border-gray-300 rounded-md px-2 py-1">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                    <span>entries</span>
                </div>
                {/* Export Buttons */}
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 text-sm px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        <FileDown size={16} />
                        <span>Export Excel</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <FileDown size={16} />
                        <span>Export CSV</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        <FileDown size={16} />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th scope="col" className="px-6 py-3">No</th>
                    <th scope="col" className="px-6 py-3">Tgl Pembuatan PO</th>
                    <th scope="col" className="px-6 py-3">No PO</th>
                    <th scope="col" className="px-6 py-3">Nama Divisi</th>
                    <th scope="col" className="px-6 py-3">Nama Vendor</th>
                    <th scope="col" className="px-6 py-3">Nama Barang</th>
                    <th scope="col" className="px-6 py-3">Nama Jasa</th>
                    <th scope="col" className="px-6 py-3">Nominal PO</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {poDashboardData.map((item, index) => (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{item.tglPembuatan}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.noPo}</td>
                      <td className="px-6 py-4">{item.namaDivisi}</td>
                      <td className="px-6 py-4">{item.namaVendor}</td>
                      <td className="px-6 py-4">
                        {Array.isArray(item.namaBarang) ? (
                          <ul className="list-disc list-inside text-gray-800">
                            {item.namaBarang.map((barang, i) => <li key={i}>{barang}</li>)}
                          </ul>
                        ) : (
                          item.namaBarang
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {Array.isArray(item.namaJasa) ? (
                          <ul className="list-disc list-inside text-gray-800">
                            {item.namaJasa.map((jasa, i) => <li key={i}>{jasa}</li>)}
                          </ul>
                        ) : (
                          item.namaJasa
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.nominalPo}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-md text-white ${
                          item.status === 'Open' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
                <span>Showing 1 to 4 of 4 entries</span>
                <div className="flex">
                    <button className="px-3 py-1 border rounded-l-md hover:bg-gray-100">Previous</button>
                    <button className="px-3 py-1 border bg-blue-600 text-white">1</button>
                    <button className="px-3 py-1 border rounded-r-md hover:bg-gray-100">Next</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PODashboard;
