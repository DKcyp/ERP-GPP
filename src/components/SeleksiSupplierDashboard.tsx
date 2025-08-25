import React from 'react';
import { Search, Calendar, Plus, FileDown } from 'lucide-react';

const biddingData = [
  {
    id: 1,
    noBidding: 'BIDDING001',
    tanggalBidding: '08-02-2025',
    noPr: 'PR0030',
    departemen: 'Logistik',
    items: ['Peralatan Inspeksi', 'Alat keselamatan kerja', 'Kendaraan Operasional'],
    qty: 2,
    vendors: ['PT. Permata Buana', 'PT Makmur Sentosa', 'PT Jaya Abadi'],
    pemenang: '-',
  },
  {
    id: 2,
    noBidding: 'BIDDING002',
    tanggalBidding: '11-02-2025',
    noPr: 'PR0031',
    departemen: 'Trainer',
    items: ['Peralatan pelatihan rope access', 'P3K', 'Alat peraga pelatihan'],
    qty: 1,
    vendors: ['PT Adem Ayem', 'PT Abden Jaya', 'CV Express'],
    pemenang: 'CV Express',
  },
  {
    id: 3,
    noBidding: 'BIDDING003',
    tanggalBidding: '13-02-2025',
    noPr: 'PR0032',
    departemen: 'HRD',
    items: ['Dokumen dan formulir sertifikasi', 'Segel dan stiker sertifikasi', 'Peralatan pendukung administrasi'],
    qty: 3,
    vendors: ['PT Drive Yos', 'PT longsongts', 'PT Kukis'],
    pemenang: '-',
  },
];

const SeleksiSupplierDashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">DAFTAR SELEKSI SUPPLIER / BIDDING</h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            {/* Cari No Bidding */}
            <div>
              <label htmlFor="noBidding" className="block text-sm font-medium text-gray-700 mb-1">Cari No Bidding</label>
              <div className="relative">
                <input type="text" id="noBidding" defaultValue="BIDDING001" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Cari No PR */}
            <div>
              <label htmlFor="noPr" className="block text-sm font-medium text-gray-700 mb-1">Cari No PR</label>
              <div className="relative">
                <input type="text" id="noPr" defaultValue="PR0012" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Cari Departemen & Tambah Button */}
            <div className="flex items-end gap-4">
                <div className="flex-grow">
                    <label htmlFor="departemen" className="block text-sm font-medium text-gray-700 mb-1">Cari Departemen</label>
                    <div className="relative">
                        <input type="text" id="departemen" defaultValue="HRD" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <button className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500">
                        <Search size={18} />
                        </button>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-sm">
                    <Plus size={18} />
                    <span>Tambah</span>
                </button>
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

        {/* Action Buttons & Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
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
                <thead className="bg-gray-100 text-gray-700 uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-3">No</th>
                    <th scope="col" className="px-6 py-3">No Bidding</th>
                    <th scope="col" className="px-6 py-3">Tanggal Bidding</th>
                    <th scope="col" className="px-6 py-3">No PR</th>
                    <th scope="col" className="px-6 py-3">Departemen</th>
                    <th scope="col" className="px-6 py-3">Item Barang / Jasa</th>
                    <th scope="col" className="px-6 py-3">Qty</th>
                    <th scope="col" className="px-6 py-3">Nama Vendor</th>
                    <th scope="col" className="px-6 py-3">Nama Pemenang</th>
                  </tr>
                </thead>
                <tbody>
                  {biddingData.map((item, index) => (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.noBidding}</td>
                      <td className="px-6 py-4">{item.tanggalBidding}</td>
                      <td className="px-6 py-4">{item.noPr}</td>
                      <td className="px-6 py-4">{item.departemen}</td>
                      <td className="px-6 py-4">
                        <ul className="list-disc list-inside">
                          {item.items.map((subItem, i) => <li key={i}>{subItem}</li>)}
                        </ul>
                      </td>
                      <td className="px-6 py-4">{item.qty}</td>
                      <td className="px-6 py-4">
                        <ul className="list-disc list-inside">
                          {item.vendors.map((vendor, i) => <li key={i}>{vendor}</li>)}
                        </ul>
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600">{item.pemenang}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             {/* Pagination */}
            <div className="flex justify-end items-center mt-4 text-sm">
                <button className="px-3 py-1 border rounded-l-md hover:bg-gray-100">Previous</button>
                <button className="px-3 py-1 border bg-cyan-500 text-white">1</button>
                <button className="px-3 py-1 border hover:bg-gray-100">2</button>
                <button className="px-3 py-1 border rounded-r-md hover:bg-gray-100">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SeleksiSupplierDashboard;
