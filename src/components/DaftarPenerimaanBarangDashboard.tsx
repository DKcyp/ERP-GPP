import React from 'react';
import { Clock } from 'lucide-react';

const DaftarPenerimaanBarangDashboard: React.FC = () => {
  const data = [
    { no: 1, tglPR: '01-02-2024', tglDokumenGudang: '03-02-2024', tglPurchasingFinance: '05-02-2024' },
    { no: 2, tglPR: '02-02-2024', tglDokumenGudang: '04-02-2024', tglPurchasingFinance: '06-02-2024' },
    { no: 3, tglPR: '03-02-2024', tglDokumenGudang: '05-02-2024', tglPurchasingFinance: '07-02-2024' },
    { no: 4, tglPR: '04-02-2024', tglDokumenGudang: '06-02-2024', tglPurchasingFinance: '08-02-2024' },
    { no: 5, tglPR: '05-02-2024', tglDokumenGudang: '07-02-2024', tglPurchasingFinance: '09-02-2024' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR PENERIMAAN BARANG
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Pengadaan</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Daftar Penerimaan Barang</span>
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
          {/* Controls Section */}
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
                      Tgl Tanda Terima PR ke Purchasing
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Tgl Tanda Terima Dokumen Gudang ke Purchasing
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Tgl Tanda Terima Purchasing ke Finance
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.tglPR}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.tglDokumenGudang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.tglPurchasingFinance}</td>
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
    </div>
  );
};

export default DaftarPenerimaanBarangDashboard;
