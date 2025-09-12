import React, { useState } from 'react';
import { Search, Calendar, FileDown, Eye } from 'lucide-react';

interface InvoiceRow {
  id: number;
  noInvoice: string;
  tanggal: string; // dd-mm-yyyy
  customer: string;
  noSO: string;
  nilai: string; // formatted currency
  status: 'Draft' | 'Dikirim' | 'Disetujui' | 'Ditolak';
}

const initialData: InvoiceRow[] = [
  { id: 1, noInvoice: 'INV-001', tanggal: '01-09-2025', customer: 'PT. Alpha', noSO: 'SO-1001', nilai: 'Rp 12.500.000', status: 'Draft' },
  { id: 2, noInvoice: 'INV-002', tanggal: '03-09-2025', customer: 'CV. Beta', noSO: 'SO-1002', nilai: 'Rp 7.250.000', status: 'Dikirim' },
  { id: 3, noInvoice: 'INV-003', tanggal: '05-09-2025', customer: 'PT. Gamma', noSO: 'SO-1003', nilai: 'Rp 4.800.000', status: 'Disetujui' },
];

const FinanceARInvoiceDashboard: React.FC = () => {
  const [rows] = useState<InvoiceRow[]>(initialData);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">FINANCE - AR INVOICE</h1>
        </div>

        {/* Filter Section (Monitoring MCU style) */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            {/* Cari No Invoice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cari No Invoice</label>
              <div className="relative">
                <input type="text" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Customer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <div className="relative">
                <input type="text" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Semua</option>
                <option>Draft</option>
                <option>Dikirim</option>
                <option>Disetujui</option>
                <option>Ditolak</option>
              </select>
            </div>

            {/* Periode */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input type="text" placeholder="dd/mm/yyyy" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </span>
                </div>
                <span className="text-gray-600">s.d</span>
                <div className="relative flex-1">
                  <input type="text" placeholder="dd/mm/yyyy" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
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
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">No Invoice</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">No SO</th>
                  <th className="px-6 py-3">Nilai</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{i + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{r.noInvoice}</td>
                    <td className="px-6 py-4">{r.tanggal}</td>
                    <td className="px-6 py-4">{r.customer}</td>
                    <td className="px-6 py-4">{r.noSO}</td>
                    <td className="px-6 py-4">{r.nilai}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        r.status === 'Disetujui' ? 'bg-green-100 text-green-800' :
                        r.status === 'Dikirim' ? 'bg-yellow-100 text-yellow-800' :
                        r.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
            <span>Showing 1 to {rows.length} of {rows.length} entries</span>
            <div className="flex">
              <button className="px-3 py-1 border rounded-l-md hover:bg-gray-100">Previous</button>
              <button className="px-3 py-1 border bg-cyan-500 text-white">1</button>
              <button className="px-3 py-1 border rounded-r-md hover:bg-gray-100">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceARInvoiceDashboard;
