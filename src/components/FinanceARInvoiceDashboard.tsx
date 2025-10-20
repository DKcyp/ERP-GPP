import React, { useState } from 'react';
import { Search, Calendar, FileDown, Eye, X, Edit, Printer, MessageSquare, Settings } from 'lucide-react';
import FollowUpModal from './FollowUpModal';
import StatusDokumenModal, { StatusHistoryItem } from './StatusDokumenModal';

interface FollowUp {
  tanggal: string;
  status: string;
}

interface InvoiceRow {
  id: number;
  noInvoice: string;
  noPI: string; // No PI (Proforma Invoice)
  tanggal: string; // dd-mm-yyyy
  customer: string;
  noSO: string;
  nilai: string; // formatted currency
  status: 'Draft' | 'Dikirim' | 'Diterima' | 'Ditolak';
  productionStatus: string; // Status dokumen berdasarkan alur dokumen
  alurDokumen: string; // Nama alur (Project PHE ONWJ, dst.)
  statusHistory: StatusHistoryItem[]; // Riwayat status
  ppnType?: 'Wapu' | 'Non Wapu'; // PPN Wapu atau Non Wapu
  ppnDibebaskan?: boolean; // PPN dibebaskan
  tanggalDikirim?: string; // yyyy-mm-dd
  tanggalDiterima?: string; // yyyy-mm-dd
  dokumenDiterima?: File | null;
  followUps?: FollowUp[];
}

const initialData: InvoiceRow[] = [
  { id: 1, noInvoice: 'INV-001', noPI: 'PI-001', tanggal: '01-09-2025', customer: 'PT. Alpha', noSO: 'SO-1001', nilai: 'Rp 12.500.000', status: 'Draft', productionStatus: 'open GBP', alurDokumen: 'Project PHE ONWJ', statusHistory: [ { status: 'Dibuat', timestamp: '2025-01-30 10:00', changedBy: 'Admin' }, { status: 'open GBP', timestamp: '2025-02-01 11:30', changedBy: 'User1' } ], ppnType: 'Wapu', ppnDibebaskan: false, followUps: [] },
  { id: 2, noInvoice: 'INV-002', noPI: 'PI-002', tanggal: '03-09-2025', customer: 'CV. Beta', noSO: 'SO-1002', nilai: 'Rp 7.250.000', status: 'Dikirim', productionStatus: 'Verifikasi Report BA (EWAN)', alurDokumen: 'Project Medco Gresik', statusHistory: [ { status: 'Dibuat', timestamp: '2025-02-04 09:00', changedBy: 'Admin' }, { status: 'Verifikasi Report BA (EWAN)', timestamp: '2025-02-05 10:45', changedBy: 'User2' } ], ppnType: 'Non Wapu', ppnDibebaskan: false, tanggalDikirim: '2025-09-04', followUps: [{tanggal: '2025-09-05', status: 'Follow up via phone'}] },
  { id: 3, noInvoice: 'INV-003', noPI: 'PI-003', tanggal: '05-09-2025', customer: 'PT. Gamma', noSO: 'SO-1003', nilai: 'Rp 4.800.000', status: 'Diterima', productionStatus: 'REVIEW REPORT', alurDokumen: 'Pertamina Hulu Mahakam', statusHistory: [ { status: 'Dibuat', timestamp: '2025-02-09 14:00', changedBy: 'Admin' }, { status: 'REVIEW REPORT', timestamp: '2025-03-02 09:30', changedBy: 'User3' } ], ppnType: 'Wapu', ppnDibebaskan: true, tanggalDikirim: '2025-09-06', tanggalDiterima: '2025-09-07', followUps: [] },
];

const FinanceARInvoiceDashboard: React.FC = () => {
  const [rows, setRows] = useState<InvoiceRow[]>(initialData);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRow | null>(null);
  const [editFormData, setEditFormData] = useState<InvoiceRow | null>(null);

  // Helper function to get production status styling
  const getProductionStatusStyle = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('open') || lowerStatus.includes('gbp')) {
      return 'bg-blue-100 text-blue-800';
    } else if (lowerStatus.includes('verifikasi') || lowerStatus.includes('report')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (lowerStatus.includes('review')) {
      return 'bg-purple-100 text-purple-800';
    } else if (lowerStatus.includes('complete') || lowerStatus.includes('selesai')) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDetailClick = (invoice: InvoiceRow) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedInvoice(null);
  };

  const handleEditClick = () => {
    if (selectedInvoice) {
      setEditFormData({ ...selectedInvoice });
      setShowDetailModal(false);
      setShowEditModal(true);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditFormData(null);
  };

  const handleEditInputChange = (field: keyof InvoiceRow, value: string | File | null | boolean) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [field]: value
      });
    }
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      setRows(prevRows => 
        prevRows.map(row => 
          row.id === editFormData.id ? editFormData : row
        )
      );
      closeEditModal();
      alert('Invoice berhasil diupdate!');
    }
  };

  const handlePrintInvoice = () => {
    if (selectedInvoice) {
      // Create print content
      const printContent = `
        <html>
          <head>
            <title>Invoice ${selectedInvoice.noInvoice}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .invoice-info { margin-bottom: 20px; }
              .invoice-info div { margin-bottom: 10px; }
              .label { font-weight: bold; }
              .value { margin-left: 10px; }
              .footer { margin-top: 30px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>INVOICE</h1>
              <h2>PT. Gamma Buana Persada</h2>
            </div>
            <div class="invoice-info">
              <div><span class="label">No. Invoice:</span><span class="value">${selectedInvoice.noInvoice}</span></div>
              <div><span class="label">No. PI:</span><span class="value">${selectedInvoice.noPI}</span></div>
              <div><span class="label">Tanggal:</span><span class="value">${selectedInvoice.tanggal}</span></div>
              <div><span class="label">Customer:</span><span class="value">${selectedInvoice.customer}</span></div>
              <div><span class="label">No. SO:</span><span class="value">${selectedInvoice.noSO}</span></div>
              <div><span class="label">Nilai:</span><span class="value">${selectedInvoice.nilai}</span></div>
              <div><span class="label">Status:</span><span class="value">${selectedInvoice.status}</span></div>
            </div>
            <div class="footer">
              <p>Terima kasih atas kepercayaan Anda</p>
            </div>
          </body>
        </html>
      `;
      
      // Open print window
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
      
      alert('Invoice sedang dicetak...');
    }
  };

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
                <option>Diterima</option>
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
                  <th className="px-6 py-3">No PI</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">No SO</th>
                  <th className="px-6 py-3">Nilai</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Alur Dokumen</th>
                  <th className="px-6 py-3">Status Dokumen</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{i + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{r.noInvoice}</td>
                    <td className="px-6 py-4 font-medium text-blue-600">{r.noPI}</td>
                    <td className="px-6 py-4">{r.tanggal}</td>
                    <td className="px-6 py-4">{r.customer}</td>
                    <td className="px-6 py-4">{r.noSO}</td>
                    <td className="px-6 py-4">{r.nilai}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        r.status === 'Diterima' ? 'bg-green-100 text-green-800' :
                        r.status === 'Dikirim' ? 'bg-yellow-100 text-yellow-800' :
                        r.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{r.alurDokumen}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getProductionStatusStyle(r.productionStatus)}`}>
                        {r.productionStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <button 
                        onClick={() => handleDetailClick(r)}
                        className="p-1.5 text-blue-600 rounded-md hover:bg-blue-100"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedInvoice(r);
                          setEditFormData(r);
                          setShowEditModal(true);
                        }}
                        className="p-1.5 text-yellow-600 rounded-md hover:bg-yellow-100"
                        title="Edit Status & Tanggal"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedInvoice(r);
                          setShowFollowUpModal(true);
                        }}
                        className="p-1.5 text-green-600 rounded-md hover:bg-green-100"
                        title="Follow Up"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedInvoice(r);
                          setShowStatusModal(true);
                        }}
                        className="p-1.5 text-purple-600 rounded-md hover:bg-purple-100"
                        title="Update Status Dokumen"
                      >
                        <Settings size={16} />
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

      {/* Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Detail Invoice</h2>
              <button
                onClick={closeDetailModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Invoice Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Informasi Invoice</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">No. Invoice</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">{selectedInvoice.noInvoice}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">No. PI (Proforma Invoice)</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold text-blue-600">{selectedInvoice.noPI}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Tanggal</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInvoice.tanggal}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">No. SO</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInvoice.noSO}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedInvoice.status === 'Diterima' ? 'bg-green-100 text-green-800' :
                      selectedInvoice.status === 'Dikirim' ? 'bg-yellow-100 text-yellow-800' :
                      selectedInvoice.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedInvoice.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Alur Dokumen</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">{selectedInvoice.alurDokumen}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Status Dokumen</label>
                    <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${getProductionStatusStyle(selectedInvoice.productionStatus)}`}>
                      {selectedInvoice.productionStatus}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">PPN Type</label>
                    <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedInvoice.ppnType === 'Wapu' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {selectedInvoice.ppnType || 'Wapu'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">PPN Dibebaskan</label>
                    <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedInvoice.ppnDibebaskan ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedInvoice.ppnDibebaskan ? 'Ya' : 'Tidak'}
                    </span>
                  </div>
                </div>

                {/* Customer & Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Informasi Customer & Keuangan</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Customer</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">{selectedInvoice.customer}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nilai Invoice</label>
                    <p className="mt-1 text-lg text-gray-900 font-bold text-blue-600">{selectedInvoice.nilai}</p>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Keterangan</label>
                    <p className="mt-1 text-sm text-gray-900">Invoice untuk layanan NDT sesuai SO {selectedInvoice.noSO}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Metode Pembayaran</label>
                    <p className="mt-1 text-sm text-gray-900">Transfer Bank</p>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Informasi Tambahan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Dibuat Oleh</label>
                    <p className="mt-1 text-sm text-gray-900">Admin Finance</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Tanggal Dibuat</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInvoice.tanggal}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Terakhir Diupdate</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInvoice.tanggal}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
              <button 
                onClick={handleEditClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Invoice
              </button>
              <button 
                onClick={handlePrintInvoice}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Printer size={16} />
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Edit Invoice</h2>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Invoice</label>
                    <input
                      type="text"
                      value={editFormData.noInvoice}
                      onChange={(e) => handleEditInputChange('noInvoice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. PI (Proforma Invoice)</label>
                    <input
                      type="text"
                      value={editFormData.noPI}
                      onChange={(e) => handleEditInputChange('noPI', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <input
                      type="text"
                      value={editFormData.tanggal}
                      onChange={(e) => handleEditInputChange('tanggal', e.target.value)}
                      placeholder="dd-mm-yyyy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. SO</label>
                    <input
                      type="text"
                      value={editFormData.noSO}
                      onChange={(e) => handleEditInputChange('noSO', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <input
                      type="text"
                      value={editFormData.customer}
                      onChange={(e) => handleEditInputChange('customer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nilai</label>
                    <input
                      type="text"
                      value={editFormData.nilai}
                      onChange={(e) => handleEditInputChange('nilai', e.target.value)}
                      placeholder="Rp 0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => handleEditInputChange('status', e.target.value as InvoiceRow['status'])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Dikirim">Dikirim</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alur Dokumen</label>
                    <select
                      value={editFormData.alurDokumen}
                      onChange={(e) => handleEditInputChange('alurDokumen', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Project PHE ONWJ">Project PHE ONWJ</option>
                      <option value="Project Medco Gresik">Project Medco Gresik</option>
                      <option value="Pertamina Hulu Mahakam">Pertamina Hulu Mahakam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Dokumen</label>
                    <input
                      type="text"
                      value={editFormData.productionStatus}
                      onChange={(e) => handleEditInputChange('productionStatus', e.target.value)}
                      placeholder="e.g. open GBP, Verifikasi Report"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PPN Type</label>
                    <select
                      value={editFormData.ppnType || 'Wapu'}
                      onChange={(e) => handleEditInputChange('ppnType', e.target.value as 'Wapu' | 'Non Wapu')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Wapu">Wapu</option>
                      <option value="Non Wapu">Non Wapu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PPN Dibebaskan</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="ppnDibebaskan"
                          checked={editFormData.ppnDibebaskan === true}
                          onChange={() => handleEditInputChange('ppnDibebaskan', true)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Ya</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="ppnDibebaskan"
                          checked={editFormData.ppnDibebaskan === false}
                          onChange={() => handleEditInputChange('ppnDibebaskan', false)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Tidak</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Dikirim</label>
                    <input
                      type="date"
                      value={editFormData.tanggalDikirim || ''}
                      onChange={(e) => handleEditInputChange('tanggalDikirim', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Diterima</label>
                    <input
                      type="date"
                      value={editFormData.tanggalDiterima || ''}
                      onChange={(e) => handleEditInputChange('tanggalDiterima', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Dokumen Diterima</label>
                    <input
                      type="file"
                      onChange={(e) => handleEditInputChange('dokumenDiterima', e.target.files ? e.target.files[0] : null)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {editFormData.dokumenDiterima && <span className='text-xs text-gray-500 mt-1'>{editFormData.dokumenDiterima.name}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-Up Modal */}
      {showFollowUpModal && selectedInvoice && (
        <FollowUpModal 
          isOpen={showFollowUpModal}
          onClose={() => setShowFollowUpModal(false)}
          invoiceNumber={selectedInvoice.noInvoice}
          followUps={selectedInvoice.followUps || []}
          onSave={(newFollowUps) => {
            const updatedInvoice = { ...selectedInvoice, followUps: newFollowUps };
            setRows(prev => prev.map(r => r.id === selectedInvoice.id ? updatedInvoice : r));
            setShowFollowUpModal(false);
          }}
        />
      )}

      {/* Status Dokumen Modal (shared with Operasional) */}
      <StatusDokumenModal
        isOpen={showStatusModal && !!selectedInvoice}
        onClose={() => setShowStatusModal(false)}
        onSave={(newStatus) => {
          if (!selectedInvoice) return;
          setRows(prev => prev.map(r => {
            if (r.id !== selectedInvoice.id) return r;
            const newHistory = [...(r.statusHistory || [])];
            newHistory.push({ status: newStatus, timestamp: new Date().toISOString().replace('T',' ').slice(0,16), changedBy: 'Finance' });
            return { ...r, productionStatus: newStatus, statusHistory: newHistory };
          }));
        }}
        alurDokumen={selectedInvoice?.alurDokumen || 'Project PHE ONWJ'}
        currentStatus={selectedInvoice?.productionStatus || ''}
        history={selectedInvoice?.statusHistory || []}
      />

    </div>
  );
};

export default FinanceARInvoiceDashboard;
