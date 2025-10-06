import React, { useState } from 'react';
import { ChevronDown, Plus, X, Info } from 'lucide-react';
import EntryPurchasingRequestModal from './EntryPurchasingRequestModal'; // Import the new modal
import { EntryPurchasingRequestFormData } from '../types/index'; // Import the new type

interface PurchasingRequest {
  id: number;
  noSO: string;
  jenis: string;
  noSistemACTS: string;
  tanggalPengajuan: string;
  cust: string;
  deskripsiPekerjaan: string;
  jumlah: number;
  satuan: string;
  noPO: string;
  statusPOFinance: string;
  statusBarang: string;
}

const GeneralProsesPurchasingRequest: React.FC = () => {
  const [purchasingRequests, setPurchasingRequests] = useState<PurchasingRequest[]>([
    { id: 1, noSO: '001-2020-AKS', jenis: 'JASA', noSistemACTS: 'PPE-GBP/2025/04/071', tanggalPengajuan: '22 January 2025', cust: 'PHE', deskripsiPekerjaan: 'sewa plugging tools', jumlah: 13, satuan: '-', noPO: 'PHE/A', statusPOFinance: '-', statusBarang: '-' },
    { id: 2, noSO: '051-2020-548', jenis: 'JASA', noSistemACTS: 'PPE-GBP/2025/04/071', tanggalPengajuan: '21 April 2025', cust: 'PHE ONWJ', deskripsiPekerjaan: 'sewa plugging tools', jumlah: 13, satuan: '-', noPO: 'PHE/A', statusPOFinance: '-', statusBarang: '-' },
    { id: 3, noSO: '086-2025', jenis: 'BARANG', noSistemACTS: 'PPE-GBP/2025/08/067', tanggalPengajuan: '20 Juli', cust: 'PHE ONWJ', deskripsiPekerjaan: 'BOROSCOPE', jumlah: 1, satuan: '-', noPO: '-', statusPOFinance: '-', statusBarang: '-' },
    { id: 4, noSO: '004-2025', jenis: 'JASA', noSistemACTS: 'PPE-GBP/2025/08/075', tanggalPengajuan: '25 Aug', cust: 'SSB', deskripsiPekerjaan: 'SEWA ALAT DWT', jumlah: 7, satuan: 'HARI', noPO: '-', statusPOFinance: '-', statusBarang: '-' },
    { id: 5, noSO: '048-2025-48', jenis: 'JASA', noSistemACTS: 'PPE-GBP/2025/08/057', tanggalPengajuan: '27 Aug', cust: 'PHE ONWJ', deskripsiPekerjaan: 'SEWA PROBE BOROSCOPE Panjang 1-13 Sep 2025', jumlah: 13, satuan: '-', noPO: 'SSB', statusPOFinance: '-', statusBarang: '-' },
    { id: 6, noSO: '004-2025', jenis: 'BARANG', noSistemACTS: 'PPE-GBP/2025/08/059', tanggalPengajuan: '28 Aug', cust: 'SSB', deskripsiPekerjaan: 'Penjualan 1-13 Sep 2025', jumlah: 30, satuan: '-', noPO: '-', statusPOFinance: '-', statusBarang: '-' },
    { id: 7, noSO: '037-2024', jenis: 'BARANG', noSistemACTS: 'PPE-GBP/2025/08/111', tanggalPengajuan: '29 Aug', cust: 'DHM', deskripsiPekerjaan: 'SPAREPART PERALATAN PROJECT ( PGD )', jumlah: 1, satuan: '-', noPO: '-', statusPOFinance: '-', statusBarang: '-' },
    { id: 8, noSO: '040-2025', jenis: 'BARANG', noSistemACTS: 'PPE-GBP/2025/09/002', tanggalPengajuan: '02 Sep', cust: 'PHE ONWJ', deskripsiPekerjaan: 'CD RW', jumlah: 200, satuan: '-', noPO: '-', statusPOFinance: '-', statusBarang: '-' },
    { id: 9, noSO: '045-2025-48', jenis: 'JASA', noSistemACTS: 'PPE-GBP/2025/09/048', tanggalPengajuan: '17 Sep', cust: 'PHE ONWJ', deskripsiPekerjaan: 'COVER CD', jumlah: 1, satuan: '-', noPO: '-', statusPOFinance: '-', statusBarang: '-' },
    { id: 10, noSO: '048-2025', jenis: 'JASA', noSistemACTS: 'PPE-GBP/2025/09/027', tanggalPengajuan: '17 Sep', cust: 'PHE ONWJ', deskripsiPekerjaan: 'BIAYA KIRIM ( AKP )', jumlah: 200, satuan: '-', noPO: '-', statusPOFinance: '-', statusBarang: '-' },
  ]);

  const [alert, setAlert] = useState<{ type: 'success' | 'info' | 'warning' | 'error'; message: string } | null>(null);

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
      noSO: newData.noSO || '',
      jenis: newData.jenis.toUpperCase(),
      noSistemACTS: newData.noSistemACTS || '',
      tanggalPengajuan: new Date().toLocaleDateString('id-ID'),
      cust: newData.customer || '',
      deskripsiPekerjaan: newData.detailItems.length > 0 ? newData.detailItems[0].namaItem : '',
      jumlah: newData.detailItems.length > 0 ? newData.detailItems[0].qty : 1,
      satuan: newData.detailItems.length > 0 ? newData.detailItems[0].satuan || '-' : '-',
      noPO: newData.noPo || '',
      statusPOFinance: '-',
      statusBarang: '-',
    };
    setPurchasingRequests((prev) => [...prev, newRequest]);
    console.log('New Purchasing Request Added:', newRequest);
  };


  const getRowBackgroundColor = (index: number) => {
    // Replicating the exact background colors from the image
    if (index === 0) return 'bg-red-50'; // Light red for first row
    if (index === 2) return 'bg-red-50'; // Light red for third row  
    if (index === 3) return 'bg-blue-50'; // Light blue for fourth row
    if (index === 6) return 'bg-red-50'; // Light red for seventh row
    if (index === 8) return 'bg-red-50'; // Light red for ninth row
    return 'bg-white'; // Default white for other rows
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

        {alert && (
          <div
            className={`mb-6 rounded-lg border p-3 flex items-start gap-2 ${
              alert.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : alert.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : alert.type === 'warning'
                ? 'border-yellow-200 bg-yellow-50 text-yellow-800'
                : 'border-blue-200 bg-blue-50 text-blue-800'
            }`}
          >
            <Info className="h-4 w-4 mt-0.5" />
            <div className="flex-1 text-sm">{alert.message}</div>
            <button onClick={() => setAlert(null)} className="rounded p-1 hover:bg-white/50">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

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
                    <div className="flex items-center">No. SO <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Jenis <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">No. Sistem ACTS <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Tanggal Pengajuan <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Cust <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Deskripsi Pekerjaan <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Jumlah <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">satuan <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">No PO <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">status PO ke finance <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">status barang <ChevronDown className="ml-1 h-3 w-3" /></div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.noSO}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.jenis}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.noSistemACTS}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.tanggalPengajuan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.cust}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.deskripsiPekerjaan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{request.jumlah}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{request.satuan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.noPO}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.statusPOFinance}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.statusBarang}</td>
                    </tr>
                    {expanded.has(request.id) && (
                      <tr className="bg-gray-50">
                        <td colSpan={13} className="px-6 py-4">
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-xs">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-3 py-2 text-left font-medium text-gray-700">Nama Pekerjaan</th>
                                  <th className="px-3 py-2 text-left font-medium text-gray-700">Jumlah</th>
                                  <th className="px-3 py-2 text-left font-medium text-gray-700">Tanggal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {(detailMap[request.id] || [
                                  { nama: 'Item', jumlah: 1, tanggal: request.tanggalPengajuan },
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
