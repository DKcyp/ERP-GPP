import React, { useState } from 'react';
import { Search, CalendarDays, Plus, FileSpreadsheet, FileText, FileDown, Eye, Clock } from 'lucide-react';
import EntrySupplierBiddingModal from './EntrySupplierBiddingModal'; // Import the new modal
import { EntrySupplierBiddingFormData } from '../types'; // Import the new form data type

const DaftarSeleksiSupplierBiddingDashboard: React.FC = () => {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false); // State for the new modal

  const data = [
    {
      no: 1,
      noBidding: 'BIDDING001',
      tanggalBidding: '08-02-2025',
      noPR: 'PR0030',
      departemen: 'Logistik',
      itemBarangJasa: ['Peralatan Inspeksi', 'Alat keselamatan kerja', 'Kendaraan Operasional'],
      qty: 2,
      namaVendor: ['PT. Permata Buana', 'PT Makmur Sentosa', 'PT Jaya Abadi'],
      namaPemenang: '-'
    },
    {
      no: 2,
      noBidding: 'BIDDING002',
      tanggalBidding: '11-02-2025',
      noPR: 'PR0031',
      departemen: 'Trainer',
      itemBarangJasa: ['Peralatan pelatihan rope access', 'P3K', 'Alat peraga pelatihan'],
      qty: 1,
      namaVendor: ['PT Adem Ayem', 'PT Abden Jaya', 'CV Express'],
      namaPemenang: 'CV Express'
    },
    {
      no: 3,
      noBidding: 'BIDDING003',
      tanggalBidding: '13-02-2025',
      noPR: 'PR0032',
      departemen: 'HRD',
      itemBarangJasa: ['Dokumen dan formulir sertifikasi', 'Segel dan stiker sertifikasi', 'Peralatan pendukung administrasi'],
      qty: 3,
      namaVendor: ['PT Drive Yos', 'PT Longsongts', 'PT Kukis'],
      namaPemenang: '-'
    },
  ];

  const handleEntryModalSubmit = (formData: EntrySupplierBiddingFormData) => {
    console.log('Entry Supplier / Bidding Form Data:', formData);
    // Here you would typically send this data to a backend API
    // For now, we'll just log it.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR SELEKSI SUPPLIER / BIDDING
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Pengadaan</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Seleksi Supplier / Bidding</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Daftar</span>
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
            <div>
              <label htmlFor="no-bidding" className="block text-sm font-medium text-gray-700 mb-1">Cari No Bidding</label>
              <div className="relative">
                <input
                  type="text"
                  id="no-bidding"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="BIDDING001"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="no-pr" className="block text-sm font-medium text-gray-700 mb-1">Cari No PR</label>
              <div className="relative">
                <input
                  type="text"
                  id="no-pr"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="PR0012"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="departemen" className="block text-sm font-medium text-gray-700 mb-1">Cari Departemen</label>
              <div className="relative">
                <input
                  type="text"
                  id="departemen"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="HRD"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Date Range and Search */}
          <div className="flex flex-col md:flex-row items-end gap-4 mb-6">
            <div className="flex-1">
              <label htmlFor="periode-start" className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    id="periode-start"
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="03/03/2025"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <span className="text-gray-600 text-sm">s.d</span>
                <div className="relative">
                  <input
                    type="text"
                    id="periode-end"
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="03/03/2025"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors shadow-md">
              Search
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6 justify-end">
            <button
              onClick={() => setIsEntryModalOpen(true)} // Open the new modal
              className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors flex items-center space-x-2 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors flex items-center space-x-2 shadow-md">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 shadow-md">
              <FileText className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2 shadow-md">
              <FileDown className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm">Show</span>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-gray-700 text-sm">entries</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm">Search:</span>
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 w-48"
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      No
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      No Bidding
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Tanggal Bidding
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      No PR
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Departemen
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Item Barang / Jasa
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Qty
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Nama Vendor
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Nama Pemenang
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.noBidding}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.tanggalBidding}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.noPR}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.departemen}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <ul className="list-disc list-inside space-y-0.5">
                        {row.itemBarangJasa.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.qty}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <ul className="list-disc list-inside space-y-0.5">
                        {row.namaVendor.map((vendor, index) => (
                          <li key={index}>{vendor}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.namaPemenang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors">
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Showing 1 to {data.length} of {data.length} entries
            </div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button
                aria-current="page"
                className="z-10 bg-blue-600 border-blue-500 text-white relative inline-flex items-center px-4 py-2 text-sm font-medium"
              >
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Entry Supplier / Bidding Modal */}
      <EntrySupplierBiddingModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSubmit={handleEntryModalSubmit}
      />
    </div>
  );
};

export default DaftarSeleksiSupplierBiddingDashboard;
