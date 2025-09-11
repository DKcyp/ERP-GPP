import React, { useState } from 'react';
import { ChevronDown, Eye, Clock, Printer, Plus } from 'lucide-react';
import EntryPurchasingRequestModal from './EntryPurchasingRequestModal'; // Import the new modal
import { EntryPurchasingRequestFormData } from '../types'; // Import the new type

interface PurchasingRequest {
  id: number;
  tanggalPR: string;
  noPR: string;
  noSO: string;
  departemen: string;
  keterangan: string;
  statusPR: 'Approve' | 'Rejected' | 'Pending'; // Added 'Pending' for form options
  statusPO: 'PO' | '-';
}

const GeneralProsesPurchasingRequest: React.FC = () => {
  const [purchasingRequests, setPurchasingRequests] = useState<PurchasingRequest[]>([
    { id: 1, tanggalPR: '07-02-2025', noPR: 'PR001', noSO: 'SO001.22', departemen: 'HRD', keterangan: 'Jasa Pelatihan Karyawan', statusPR: 'Approve', statusPO: 'PO' },
    { id: 2, tanggalPR: '08-02-2025', noPR: 'PR002', noSO: 'SO002.12', departemen: 'Finance', keterangan: 'Pembelian Software Akuntansi', statusPR: 'Approve', statusPO: '-' },
    { id: 3, tanggalPR: '09-02-2025', noPR: 'PR003', noSO: 'SO003.33', departemen: 'HRD', keterangan: 'Jasa Pelatihan Karyawan', statusPR: 'Approve', statusPO: '-' },
    { id: 4, tanggalPR: '10-02-2025', noPR: 'PR004', noSO: 'SO004.90', departemen: 'Operasional', keterangan: 'Pembelian Alat Tulis Kantor', statusPR: 'Approve', statusPO: 'PO' },
    { id: 5, tanggalPR: '11-02-2025', noPR: 'PR005', noSO: 'SO005.55', departemen: 'Operasional', keterangan: 'Pembelian Alat Tulis Kantor', statusPR: 'Rejected', statusPO: '-' },
  ]);

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  // Example detail items per PR row; in real usage, replace with actual data
  const detailMap: Record<number, { nama: string; jumlah: number; tanggal: string }[]> = {
    1: [
      { nama: 'Safety Helmet', jumlah: 10, tanggal: '07-02-2025' },
      { nama: 'Safety Gloves', jumlah: 20, tanggal: '07-02-2025' },
    ],
    2: [
      { nama: 'License Akuntansi', jumlah: 5, tanggal: '08-02-2025' },
    ],
    3: [
      { nama: 'Training Kit', jumlah: 15, tanggal: '09-02-2025' },
    ],
    4: [
      { nama: 'ATK - Kertas A4', jumlah: 3, tanggal: '10-02-2025' },
      { nama: 'ATK - Pulpen', jumlah: 12, tanggal: '10-02-2025' },
    ],
    5: [
      { nama: 'ATK - Map Folder', jumlah: 8, tanggal: '11-02-2025' },
    ],
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleOpenEntryModal = () => setIsEntryModalOpen(true);
  const handleCloseEntryModal = () => setIsEntryModalOpen(false);

  const handleAddPurchasingRequest = (newData: EntryPurchasingRequestFormData) => {
    const newId = purchasingRequests.length > 0 ? Math.max(...purchasingRequests.map(req => req.id)) + 1 : 1;
    const newRequest: PurchasingRequest = {
      id: newId,
      tanggalPR: newData.tanggalPR,
      noPR: newData.noPR,
      noSO: newData.noSO,
      departemen: newData.departemen,
      keterangan: newData.keterangan,
      // Default statuses for new PR since inputs removed from modal
      statusPR: 'Pending',
      statusPO: '-',
    };
    setPurchasingRequests((prev) => [...prev, newRequest]);
    console.log('New Purchasing Request Added:', newRequest);
  };

  const getRowBackgroundColor = (index: number) => {
    // Replicating the exact background colors from the image
    if (index === 0 || index === 2) return 'bg-red-50'; // Light red for rows 1 and 3
    if (index === 3) return 'bg-blue-50'; // Light blue for row 4
    return 'bg-white'; // Default white for rows 2 and 5
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">DAFTAR PURCHASING REQUEST</h1>
          <button
            onClick={handleOpenEntryModal}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/80 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah PR
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="status-pr" className="text-gray-700 font-medium">Status PR</label>
            <div className="relative">
              <select
                id="status-pr"
                className="block w-48 appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>--Pilih Status PO--</option>
                <option>Approve</option>
                <option>Rejected</option>
                <option>Pending</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Show</span>
              <div className="relative">
                <select className="block w-20 appearance-none bg-white border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              <span className="text-gray-700">entries</span>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="search" className="text-gray-700">Search:</label>
              <input
                type="text"
                id="search"
                className="border border-gray-300 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 px-3 py-3"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">No <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Tanggal PR <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">No PR <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">No SO <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Departemen <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Keterangan <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Status PR <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Status PO <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Aksi <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchasingRequests.map((request, index) => (
                  <React.Fragment key={request.id}>
                    <tr className={getRowBackgroundColor(index)}>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <button
                          type="button"
                          onClick={() => toggleExpand(request.id)}
                          className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 text-gray-600"
                          aria-label={expanded.has(request.id) ? 'Collapse' : 'Expand'}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${expanded.has(request.id) ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.tanggalPR}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.noPR}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.noSO}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.departemen}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.keterangan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.statusPR === 'Approve' ? 'bg-green-100 text-green-800' : request.statusPR === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.statusPR}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.statusPO === 'PO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {request.statusPO}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {request.statusPO === 'PO' ? (
                            <button className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                          ) : (
                            <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                              <Plus className="h-4 w-4" />
                            </button>
                          )}
                          <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                            <Clock className="h-4 w-4" />
                          </button>
                          <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                            <Printer className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded.has(request.id) && (
                      <tr className="bg-gray-50">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-xs">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-3 py-2 text-left font-medium text-gray-700">Nama</th>
                                  <th className="px-3 py-2 text-left font-medium text-gray-700">Jumlah</th>
                                  <th className="px-3 py-2 text-left font-medium text-gray-700">Tanggal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {(detailMap[request.id] || [
                                  { nama: 'Item', jumlah: 1, tanggal: request.tanggalPR },
                                ]).map((d, i) => (
                                  <tr key={i}>
                                    <td className="px-3 py-2 text-gray-700">{d.nama}</td>
                                    <td className="px-3 py-2 text-gray-700">{d.jumlah}</td>
                                    <td className="px-3 py-2 text-gray-700">{d.tanggal}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Showing 1 to {purchasingRequests.length} of {purchasingRequests.length} entries
            </div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Entry Purchasing Request Modal */}
      <EntryPurchasingRequestModal
        isOpen={isEntryModalOpen}
        onClose={handleCloseEntryModal}
        onSubmit={handleAddPurchasingRequest}
      />
    </div>
  );
};

export default GeneralProsesPurchasingRequest;
