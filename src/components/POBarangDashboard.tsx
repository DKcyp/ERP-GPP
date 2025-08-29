import React, { useState } from 'react';
import { Search, Calendar, Plus, FileDown, Clock, Eye, Trash2, Printer, ThumbsUp } from 'lucide-react'; // Import ThumbsUp icon
import EntryPOBarangModal from './EntryPOBarangModal';
import HistoryApprovePOModal from './HistoryApprovePOModal';
import DetailPOBarangModal from './DetailPOBarangModal';
import ApprovePOBarangModal from './ApprovePOBarangModal'; // Import the new approval modal
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Import ConfirmDeleteModal
import { EntryPOBarangFormData, POBarangData, ApprovalPOBarangFormData } from '../types'; // Import POBarangData and ApprovalPOBarangFormData
import { useAuth } from '../context/AuthContext'; // Import useAuth

// Updated mock data to include 'Pending' status and more details for the modal
const initialPoData: POBarangData[] = [
  {
    id: 1,
    noPr: 'PR001',
    periodePr: 'Jan 2025',
    divisi: 'IT',
    kodeSupplier: 'SUP001',
    namaSupplier: 'PT. Global Intermedia',
    noPo: 'PO001',
    tanggalPo: '01-01-2025',
    tanggalPengiriman: '14-01-2025',
    status: 'Paid',
    noSO: 'SO001',
    metodePembayaran: 'Transfer Bank',
    kodeVendor: 'KV001',
    departemen: 'IT',
    vendor: 'PT. Global Intermedia',
    pajak: 'PPN',
    tandaBuktiUrl: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    daftarFileUrls: ['https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    items: [
      { id: '1', namaBarang: 'Laptop', kodeBarang: 'LT001', qty: '2', satuan: 'Unit', hargaSatuan: '7500000', pajakItem: '10%', discRp: '0', jumlah: '15000000', keterangan: 'For IT Dept' },
      { id: '2', namaBarang: 'Monitor', kodeBarang: 'MN001', qty: '4', satuan: 'Unit', hargaSatuan: '2000000', pajakItem: '10%', discRp: '0', jumlah: '8000000', keterangan: 'For IT Dept' },
    ],
    total: 'Rp 23.000.000',
    discAkhir: 'Rp 0',
    subTotal: 'Rp 23.000.000',
    ppn: 'Rp 2.300.000',
    ongkosKirim: 'Rp 100.000',
    grandTotal: 'Rp 25.400.000',
  },
  {
    id: 2,
    noPr: 'PR002',
    periodePr: 'Feb 2025',
    divisi: 'Finance',
    kodeSupplier: 'SUP002',
    namaSupplier: 'CV. Maju Jaya',
    noPo: 'PO002',
    tanggalPo: '10-02-2025',
    tanggalPengiriman: '24-02-2025',
    status: 'Pending', // Changed to Pending for approval flow
    noSO: 'SO002',
    metodePembayaran: 'Cash',
    kodeVendor: 'KV002',
    departemen: 'Finance',
    vendor: 'CV. Maju Jaya',
    pajak: 'Non PPN',
    tandaBuktiUrl: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    daftarFileUrls: [],
    items: [
      { id: '1', namaBarang: 'Printer', kodeBarang: 'PRN01', qty: '1', satuan: 'Unit', hargaSatuan: '3000000', pajakItem: '0%', discRp: '0', jumlah: '3000000', keterangan: 'For Finance Dept' },
    ],
    total: 'Rp 3.000.000',
    discAkhir: 'Rp 0',
    subTotal: 'Rp 3.000.000',
    ppn: 'Rp 0',
    ongkosKirim: 'Rp 50.000',
    grandTotal: 'Rp 3.050.000',
  },
  {
    id: 3,
    noPr: 'PR003',
    periodePr: 'Mar 2025',
    divisi: 'Procurement',
    kodeSupplier: 'SUP003',
    namaSupplier: 'UD. Cahaya Abadi',
    noPo: 'PO003',
    tanggalPo: '15-03-2025',
    tanggalPengiriman: '29-03-2025',
    status: 'Pending', // Changed to Pending for approval flow
    noSO: 'SO003',
    metodePembayaran: 'Giro',
    kodeVendor: 'KV003',
    departemen: 'Procurement',
    vendor: 'UD. Cahaya Abadi',
    pajak: 'PPN',
    tandaBuktiUrl: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Example Pexels URL
    daftarFileUrls: ['https://images.pexels.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], // Example Pexels URL
    items: [
      { id: '1', namaBarang: 'Stationery Set', kodeBarang: 'STN05', qty: '10', satuan: 'Set', hargaSatuan: '150000', pajakItem: '10%', discRp: '0', jumlah: '1500000', keterangan: 'Office supplies' },
    ],
    total: 'Rp 1.500.000',
    discAkhir: 'Rp 50.000',
    subTotal: 'Rp 1.450.000',
    ppn: 'Rp 145.000',
    ongkosKirim: 'Rp 0',
    grandTotal: 'Rp 1.595.000',
  },
  {
    id: 4,
    noPr: 'PR004',
    periodePr: 'Apr 2025',
    divisi: 'HRD',
    kodeSupplier: 'SUP004',
    namaSupplier: 'PT. Teknologi Sejahtera',
    noPo: 'PO004',
    tanggalPo: '20-04-2025',
    tanggalPengiriman: '04-05-2025',
    status: 'Paid',
    items: [], // Simplified for brevity
  },
  {
    id: 5,
    noPr: 'PR005',
    periodePr: 'Mei 2025',
    divisi: 'Marketing',
    kodeSupplier: 'SUP005',
    namaSupplier: 'CV. Sumber Rezeki',
    noPo: 'PO005',
    tanggalPo: '25-05-2025',
    tanggalPengiriman: '10-06-2025',
    status: 'Unpaid', // Still unpaid, not necessarily pending approval by management
    items: [], // Simplified for brevity
  },
];

const POBarangDashboard: React.FC = () => {
  const { user } = useAuth();
  const isManagement = user?.role === 'management';

  const [poList, setPoList] = useState<POBarangData[]>(initialPoData);
  const [isEntryPOModalOpen, setIsEntryPOModalOpen] = useState(false);
  const [isHistoryApproveModalOpen, setIsHistoryApproveModalOpen] = useState(false);
  const [isDetailPOModalOpen, setIsDetailPOModalOpen] = useState(false);
  const [isApprovePOModalOpen, setIsApprovePOModalOpen] = useState(false); // State for Approve PO Barang modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [selectedPoId, setSelectedPoId] = useState<number | null>(null);

  const handleEntryPOModalSubmit = (formData: EntryPOBarangFormData) => {
    console.log('Entry PO Barang Form Data:', formData);
    // In a real app, you'd send this to backend and update poList
    // For now, simulate adding a new PO with 'Pending' status
    const newPo: POBarangData = {
      id: poList.length + 1,
      noPr: formData.noPR,
      periodePr: 'Current', // Placeholder
      divisi: formData.departemen || 'Unknown',
      kodeSupplier: formData.kodeVendor || 'Unknown',
      namaSupplier: formData.vendor || 'Unknown',
      noPo: formData.noPO,
      tanggalPo: formData.tanggalPO,
      tanggalPengiriman: formData.tanggalPengiriman,
      status: 'Pending', // New entries are pending approval
      noSO: formData.noSO,
      metodePembayaran: formData.metodePembayaran,
      kodeVendor: formData.kodeVendor,
      departemen: formData.departemen,
      vendor: formData.vendor,
      pajak: formData.pajak,
      // For files, you'd handle uploads and get URLs
      tandaBuktiUrl: formData.tandaBukti ? URL.createObjectURL(formData.tandaBukti) : undefined,
      daftarFileUrls: formData.daftarFile.map(file => URL.createObjectURL(file)),
      items: formData.items.map(item => ({ ...item, qty: String(item.qty), hargaSatuan: String(item.hargaSatuan) })), // Ensure types match
      total: formData.total,
      discAkhir: formData.discAkhir,
      subTotal: formData.subTotal,
      ppn: formData.ppn,
      ongkosKirim: formData.ongkosKirim,
      grandTotal: formData.grandTotal,
    };
    setPoList((prev) => [...prev, newPo]);
  };

  const handlePrint = (poId: number) => {
    console.log(`Printing PO with ID: ${poId}`);
    // Implement print logic here
  };

  const openHistoryApproveModal = (poId: number) => {
    setSelectedPoId(poId);
    setIsHistoryApproveModalOpen(true);
  };

  const openDetailPOModal = (poId: number) => {
    setSelectedPoId(poId);
    setIsDetailPOModalOpen(true);
  };

  const openApprovePOModal = (poId: number) => {
    setSelectedPoId(poId);
    setIsApprovePOModalOpen(true);
  };

  const openDeletePOModal = (poId: number) => {
    setSelectedPoId(poId);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePO = () => {
    if (selectedPoId !== null) {
      setPoList((prev) => prev.filter((po) => po.id !== selectedPoId));
      console.log(`PO with ID ${selectedPoId} deleted.`);
      setSelectedPoId(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleApprovePO = (approvalData: ApprovalPOBarangFormData) => {
    console.log('PO Barang Approval Data:', approvalData);
    setPoList((prev) =>
      prev.map((po) =>
        po.id === approvalData.poId
          ? { ...po, status: approvalData.action === 'approve' ? 'Paid' : 'Unpaid' } // Change status based on action
          : po
      )
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">DAFTAR PO BARANG</h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
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

            {/* Cari Nama Supplier */}
            <div>
              <label htmlFor="namaSupplier" className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Supplier</label>
              <div className="relative">
                <input type="text" id="namaSupplier" defaultValue="Cahaya Abadi" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Cari Devisi & Tambah Button */}
            <div className="flex items-end gap-4">
                <div className="flex-grow">
                    <label htmlFor="devisi" className="block text-sm font-medium text-gray-700 mb-1">Cari Devisi</label>
                    <div className="relative">
                        <input type="text" id="devisi" defaultValue="Procurement" className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <button className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500">
                        <Search size={18} />
                        </button>
                    </div>
                </div>
                {!isManagement && ( // Conditionally render Tambah button
                  <button
                    onClick={() => setIsEntryPOModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-sm"
                  >
                      <Plus size={18} />
                      <span>Tambah</span>
                  </button>
                )}
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
                    <th scope="col" className="px-6 py-3">No PR</th>
                    <th scope="col" className="px-6 py-3">Periode PR</th>
                    <th scope="col" className="px-6 py-3">Nama Divisi</th>
                    <th scope="col" className="px-6 py-3">Kode Supplier</th>
                    <th scope="col" className="px-6 py-3">Nama Supplier</th>
                    <th scope="col" className="px-6 py-3">No PO</th>
                    <th scope="col" className="px-6 py-3">Tanggal PO</th>
                    <th scope="col" className="px-6 py-3">Tanggal Pengiriman</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {poList.map((item, index) => ( // Use poList state
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.noPr}</td>
                      <td className="px-6 py-4">{item.periodePr}</td>
                      <td className="px-6 py-4">{item.divisi}</td>
                      <td className="px-6 py-4">{item.kodeSupplier}</td>
                      <td className="px-6 py-4">{item.namaSupplier}</td>
                      <td className="px-6 py-4">{item.noPo}</td>
                      <td className="px-6 py-4">{item.tanggalPo}</td>
                      <td className="px-6 py-4">{item.tanggalPengiriman}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isManagement ? ( // Conditional rendering for management role
                            item.status === 'Pending' && ( // Only show ThumbsUp if status is Pending
                              <button
                                onClick={() => openApprovePOModal(item.id)}
                                className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                              >
                                <ThumbsUp size={14} />
                              </button>
                            )
                          ) : ( // For other roles, show all buttons
                            <>
                              <button
                                onClick={() => openHistoryApproveModal(item.id)}
                                className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600"
                              >
                                <Clock size={14} />
                              </button>
                              <button
                                onClick={() => openDetailPOModal(item.id)}
                                className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handlePrint(item.id)}
                                className="p-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                              >
                                <Printer size={14} />
                              </button>
                              <button
                                onClick={() => openDeletePOModal(item.id)} // Open delete modal
                                className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
                <span>Showing 1 to {poList.length} of {poList.length} entries</span>
                <div className="flex">
                    <button className="px-3 py-1 border rounded-l-md hover:bg-gray-100">Previous</button>
                    <button className="px-3 py-1 border bg-cyan-500 text-white">1</button>
                    <button className="px-3 py-1 border rounded-r-md hover:bg-gray-100">Next</button>
                </div>
            </div>
        </div>
      </div>

      {/* Entry PO Barang Modal */}
      <EntryPOBarangModal
        isOpen={isEntryPOModalOpen}
        onClose={() => setIsEntryPOModalOpen(false)}
        onSubmit={handleEntryPOModalSubmit}
      />

      {/* History Approve PO Modal */}
      <HistoryApprovePOModal
        isOpen={isHistoryApproveModalOpen}
        onClose={() => setIsHistoryApproveModalOpen(false)}
        poId={selectedPoId}
      />

      {/* Detail PO Barang Modal */}
      <DetailPOBarangModal
        isOpen={isDetailPOModalOpen}
        onClose={() => setIsDetailPOModalOpen(false)}
        poId={selectedPoId}
      />

      {/* Approve PO Barang Modal */}
      <ApprovePOBarangModal
        isOpen={isApprovePOModalOpen}
        onClose={() => setIsApprovePOModalOpen(false)}
        poId={selectedPoId}
        onApprove={handleApprovePO}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePO}
        itemName={poList.find(po => po.id === selectedPoId)?.noPo || `PO ID: ${selectedPoId}`}
      />
    </div>
  );
};

export default POBarangDashboard;
