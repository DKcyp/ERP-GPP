import React, { useState } from 'react';
import { Search, CalendarDays, FileSpreadsheet, FileText, FileDown, Clock, Eye, ThumbsUp } from 'lucide-react'; // Added Eye and ThumbsUp icons
import { SeleksiSupplierBiddingData } from '../types'; // Import the new form data type

const DaftarSeleksiSupplierBiddingDashboard: React.FC = () => {
  // No longer need isEntryModalOpen state as "Tambah" button is removed
  // const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  const data: SeleksiSupplierBiddingData[] = [
    {
      no: 1,
      noBidding: 'BIDDING001',
      tglPendaftaranVendor: '01-02-2025',
      namaVendor: 'PT. Sukses Makmur',
      namaPIC: 'Budi Santoso',
      noTelp: '081234567890',
      noPR: 'PR0012',
      vendorTerpilih: 'Accept'
    },
    {
      no: 2,
      noBidding: 'BIDDING002',
      tglPendaftaranVendor: '03-02-2025',
      namaVendor: 'CV. Jaya Abadi',
      namaPIC: 'Siti Aminah',
      noTelp: '081345678901',
      noPR: 'PR0013',
      vendorTerpilih: 'Rejected'
    },
    {
      no: 3,
      noBidding: 'BIDDING003',
      tglPendaftaranVendor: '05-02-2025',
      namaVendor: 'UD. Berkah Sentosa',
      namaPIC: 'Andi Wijaya',
      noTelp: '081456789012',
      noPR: 'PR0014',
      vendorTerpilih: 'Accept'
    },
    {
      no: 4,
      noBidding: 'BIDDING004',
      tglPendaftaranVendor: '07-02-2025',
      namaVendor: 'PT. Maju Bersama',
      namaPIC: 'Rina Kusuma',
      noTelp: '081567890123',
      noPR: 'PR0015',
      vendorTerpilih: 'Rejected'
    },
    {
      no: 5,
      noBidding: 'BIDDING005',
      tglPendaftaranVendor: '09-02-2025',
      namaVendor: 'CV. Amanah Sejahtera',
      namaPIC: 'Hendra Saputra',
      noTelp: '081678901234',
      noPR: 'PR0016',
      vendorTerpilih: 'Accept'
    },
  ];

  // No longer need handleEntryModalSubmit as "Tambah" button is removed
  // const handleEntryModalSubmit = (formData: EntrySupplierBiddingFormData) => {
  //   console.log('Entry Supplier / Bidding Form Data:', formData);
  //   // Here you would typically send this data to a backend API
  //   // For now, we'll just log it.
  // };

  const handleViewDetails = (noBidding: string) => {
    console.log(`View details for Bidding No: ${noBidding}`);
    // Implement navigation or modal for viewing details
  };

  const handleApproveVendor = (noBidding: string) => {
    console.log(`Approve vendor for Bidding No: ${noBidding}`);
    // Implement approval logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DASHBOARD SELEKSI SUPPLIER / BIDDING
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Pengadaan</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Seleksi Supplier / Bidding</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Dashboard</span>
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
              <label htmlFor="nama-vendor" className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Vendor</label>
              <div className="relative">
                <input
                  type="text"
                  id="nama-vendor"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="PT Maju Jaya"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="pic-vendor" className="block text-sm font-medium text-gray-700 mb-1">Cari PIC Vendor</label>
              <div className="relative">
                <input
                  type="text"
                  id="pic-vendor"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Budi Santoso"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="vendor-terpilih-select" className="block text-sm font-medium text-gray-700 mb-1">Pilih Vendor Terpilih</label>
              <select
                id="vendor-terpilih-select"
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>--Pilih Vendor Terpilih--</option>
                <option>Accept</option>
                <option>Rejected</option>
              </select>
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
            {/* Removed "Tambah" button as per new design */}
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
                      Tgl Pendaftaran Vendor
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
                      Nama PIC
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      No. Telp
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
                      Vendor Terpilih
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.noBidding}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.tglPendaftaranVendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.namaVendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.namaPIC}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.noTelp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.noPR}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          row.vendorTerpilih === 'Accept'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {row.vendorTerpilih}
                      </span>
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

      {/* Entry Supplier / Bidding Modal - Removed as per new design */}
      {/* <EntrySupplierBiddingModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSubmit={handleEntryModalSubmit}
      /> */}
    </div>
  );
};

export default DaftarSeleksiSupplierBiddingDashboard;
