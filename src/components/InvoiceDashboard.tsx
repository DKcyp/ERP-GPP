import React, { useState } from 'react';
import { Search, FileSpreadsheet, FileText, FileDown, CalendarDays, ThumbsUp, Clock, Plus } from 'lucide-react';
import InvoiceModal from './InvoiceModal'; // Import the new modal
import TandaTerimaInvoiceModal from './TandaTerimaInvoiceModal'; // Import the new TandaTerimaInvoiceModal
import { InvoiceDashboardData, InvoiceFormInput, TandaTerimaInvoiceDetail } from '../types'; // Import the new types

const InvoiceDashboard: React.FC = () => {
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [isTandaTerimaModalOpen, setIsTandaTerimaModalOpen] = useState(false);
  const [selectedInvoiceForTandaTerima, setSelectedInvoiceForTandaTerima] = useState<TandaTerimaInvoiceDetail | null>(null);

  const [invoiceData, setInvoiceData] = useState<InvoiceDashboardData[]>([
    { id: '1', no: 1, noPO: 'PO001', tanggalPO: '13-02-2024', namaVendor: 'PT Maju Sejahtera', nilaiInvoice: 'Rp 10.000.000', penerimaInvoice: 'Ahmad Kasim', statusVerifikasi: 'Pending', unduhInvoice: '/documents/inv001.pdf', tanggalVerifikasi: '' },
    { id: '2', no: 2, noPO: 'PO002', tanggalPO: '12-02-2024', namaVendor: 'CV Hendra Jaya', nilaiInvoice: 'Rp 15.000.000', penerimaInvoice: 'Budi Santoso', statusVerifikasi: 'Approved', unduhInvoice: '/documents/inv002.pdf', tanggalVerifikasi: '15/02/2024' },
    { id: '3', no: 3, noPO: 'PO003', tanggalPO: '11-01-2024', namaVendor: 'PT JoHigh Express', nilaiInvoice: 'Rp 8.500.000', penerimaInvoice: 'Siti Aminah', statusVerifikasi: 'Pending', unduhInvoice: '/documents/inv003.pdf', tanggalVerifikasi: '' },
    { id: '4', no: 4, noPO: 'PO004', tanggalPO: '10-03-2024', namaVendor: 'ACE GROUP', nilaiInvoice: 'Rp 12.750.000', penerimaInvoice: 'Rizky Fauzan', statusVerifikasi: 'Rejected', unduhInvoice: '/documents/inv004.pdf', tanggalVerifikasi: '12/03/2024' },
  ]);

  const handleAddInvoice = (formData: InvoiceFormInput) => {
    const newInvoice: InvoiceDashboardData = {
      id: (invoiceData.length + 1).toString(), // Simple ID generation
      no: invoiceData.length + 1,
      ...formData,
      statusVerifikasi: 'Pending', // Default status for new invoices
      unduhInvoice: `/documents/inv${invoiceData.length + 1}.pdf`, // Placeholder for new invoice
      tanggalVerifikasi: '',
    };
    setInvoiceData(prev => [newInvoice, ...prev]); // Add new invoice to the top
  };

  const handleOpenTandaTerimaModal = (invoice: InvoiceDashboardData) => {
    setSelectedInvoiceForTandaTerima({
      id: invoice.id,
      tanggalPO: invoice.tanggalPO,
      noPO: invoice.noPO,
      namaVendor: invoice.namaVendor,
      nilaiInvoice: invoice.nilaiInvoice,
      penerimaInvoice: invoice.penerimaInvoice,
      unduhInvoice: invoice.unduhInvoice,
      tanggalVerifikasi: invoice.tanggalVerifikasi,
    });
    setIsTandaTerimaModalOpen(true);
  };

  const handleVerifyInvoice = (invoiceId: string, verificationDate: string) => {
    setInvoiceData(prev =>
      prev.map(invoice =>
        invoice.id === invoiceId
          ? { ...invoice, statusVerifikasi: 'Approved', tanggalVerifikasi: verificationDate }
          : invoice
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                TANDA TERIMA INVOICE DARI RESEPSIONIS
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Pengadaan</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Penerimaan Barang</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Invoice</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="no-po" className="block text-sm font-medium text-gray-700 mb-1">Cari No PO</label>
              <div className="relative">
                <input
                  type="text"
                  id="no-po"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="PO0012"
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
                  placeholder="Cahaya Abadi"
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

          {/* Export and Add Buttons */}
          <div className="flex flex-wrap gap-3 mb-6 justify-end">
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
            <button
              onClick={() => setIsAddInvoiceModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Add Invoice</span>
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
                      No PO
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Tanggal PO
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
                      Nilai Invoice
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Penerima Invoice
                      <span className="ml-1 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.75 7.25a.75.75 0 011.1 0L10 15.148l2.7-2.91a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 010-1.02z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Verifikasi
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
                {invoiceData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.noPO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.tanggalPO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.namaVendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.nilaiInvoice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.penerimaInvoice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => handleOpenTandaTerimaModal(row)}
                        className={`p-2 rounded-full transition-colors ${
                          row.statusVerifikasi === 'Approved' ? 'bg-green-100 text-green-600 hover:bg-green-200' :
                          row.statusVerifikasi === 'Rejected' ? 'bg-red-100 text-red-600 hover:bg-red-200' :
                          'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                        title={row.statusVerifikasi}
                      >
                        <ThumbsUp className="h-5 w-5" />
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
              Showing 1 to {invoiceData.length} of {invoiceData.length} entries
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

      {/* Invoice Modal (for adding new invoices) */}
      <InvoiceModal
        isOpen={isAddInvoiceModalOpen}
        onClose={() => setIsAddInvoiceModalOpen(false)}
        onSave={handleAddInvoice}
      />

      {/* Tanda Terima Invoice Modal (for verifying existing invoices) */}
      <TandaTerimaInvoiceModal
        isOpen={isTandaTerimaModalOpen}
        onClose={() => setIsTandaTerimaModalOpen(false)}
        invoiceData={selectedInvoiceForTandaTerima}
        onVerify={handleVerifyInvoice}
      />
    </div>
  );
};

export default InvoiceDashboard;
