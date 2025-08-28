import React, { useState } from 'react';
import { Search, Calendar, Plus, FileDown, Printer, Eye, Edit, Trash2 } from 'lucide-react';
import EntryPOJasaModal from './EntryPOJasaModal';
import EditPOJasaModal from './EditPOJasaModal'; // Import the new edit modal
import { EntryPOJasaFormData, EntryPOJasaItem, POJasaData as POJasaDataType } from '../types'; // Import POJasaData type

const initialPOJasaData: POJasaDataType[] = [
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
    items: [
      { id: '1', namaJasa: 'Jasa audit dan inspeksi untuk proses sertifikasi', kodeJasa: 'JS001', qty: 1, satuan: 'Pax', hargaSatuan: 500000, disc: 10, jumlah: 450000, keterangan: 'Audit Tahunan' },
      { id: '2', namaJasa: 'Jasa perbaikan peralatan inspeksi', kodeJasa: 'JS002', qty: 1, satuan: 'Pax', hargaSatuan: 500000, disc: 10, jumlah: 450000, keterangan: 'Perbaikan Sensor' },
      { id: '3', namaJasa: 'Jasa pemeliharaan peralatan pelatihan', kodeJasa: 'JS003', qty: 1, satuan: 'Pax', hargaSatuan: 500000, disc: 10, jumlah: 450000, keterangan: 'Maintenance Rutin' },
    ],
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
    status: 'Unpaid',
    items: [
      { id: '4', namaJasa: 'Jasa konsultasi keuangan', kodeJasa: 'JS004', qty: 2, satuan: 'Jam', hargaSatuan: 750000, disc: 0, jumlah: 1500000, keterangan: 'Konsultasi Pajak' },
    ],
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
    tanggalPengiriman: '30-03-2025',
    status: 'Unpaid',
    items: [
      { id: '5', namaJasa: 'Jasa pengadaan barang', kodeJasa: 'JS005', qty: 1, satuan: 'Proyek', hargaSatuan: 1200000, disc: 5, jumlah: 1140000, keterangan: 'Pengadaan Server' },
    ],
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
    tanggalPengiriman: '20-05-2025',
    status: 'Paid',
    items: [
      { id: '6', namaJasa: 'Jasa pelatihan karyawan', kodeJasa: 'JS006', qty: 1, satuan: 'Sesi', hargaSatuan: 800000, disc: 0, jumlah: 800000, keterangan: 'Pelatihan Softskill' },
    ],
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
    tanggalPengiriman: '30-05-2025',
    status: 'Unpaid',
    items: [
      { id: '7', namaJasa: 'Jasa kampanye digital', kodeJasa: 'JS007', qty: 1, satuan: 'Bulan', hargaSatuan: 2500000, disc: 15, jumlah: 2125000, keterangan: 'Campaign Q2' },
    ],
  },
];

const POJasaDashboard: React.FC = () => {
  const [poJasaData, setPoJasaData] = useState<POJasaDataType[]>(initialPOJasaData);
  const [isEntryPOJasaModalOpen, setIsEntryPOJasaModalOpen] = useState(false);
  const [isEditPOJasaModalOpen, setIsEditPOJasaModalOpen] = useState(false); // State for edit modal
  const [selectedPOJasaForEdit, setSelectedPOJasaForEdit] = useState<POJasaDataType | null>(null); // State to hold data for editing

  const handleEntryPOJasaModalSubmit = (formData: EntryPOJasaFormData) => {
    console.log('Entry PO Jasa Form Data:', formData);
    // In a real application, you would add this to your state or send to backend
    // For now, just log and close.
    setIsEntryPOJasaModalOpen(false);
  };

  const handleEditPOJasaModalSubmit = (poId: number, updatedItems: EntryPOJasaItem[]) => {
    console.log(`Updating PO Jasa ID ${poId} with items:`, updatedItems);
    setPoJasaData((prevData) =>
      prevData.map((po) =>
        po.id === poId ? { ...po, items: updatedItems } : po
      )
    );
    setIsEditPOJasaModalOpen(false);
    setSelectedPOJasaForEdit(null);
  };

  const openEditModal = (po: POJasaDataType) => {
    setSelectedPOJasaForEdit(po);
    setIsEditPOJasaModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">DAFTAR PO JASA</h1>
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
                <button
                  onClick={() => setIsEntryPOJasaModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-sm"
                >
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
                  {poJasaData.map((item, index) => (
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
                          item.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">
                            <Printer size={14} />
                          </button>
                          <button className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            <Eye size={14} />
                          </button>
                          {item.status === 'Unpaid' && (
                            <button
                              onClick={() => openEditModal(item)} // Open edit modal
                              className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                <Edit size={14} />
                            </button>
                          )}
                          <button className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
                <span>Showing 1 to 5 of 5 entries</span>
                <div className="flex">
                    <button className="px-3 py-1 border rounded-l-md hover:bg-gray-100">Previous</button>
                    <button className="px-3 py-1 border bg-cyan-500 text-white">1</button>
                    <button className="px-3 py-1 border rounded-r-md hover:bg-gray-100">Next</button>
                </div>
            </div>
        </div>
      </div>

      {/* Entry PO Jasa Modal */}
      <EntryPOJasaModal
        isOpen={isEntryPOJasaModalOpen}
        onClose={() => setIsEntryPOJasaModalOpen(false)}
        onSubmit={handleEntryPOJasaModalSubmit}
      />

      {/* Edit PO Jasa Modal */}
      {selectedPOJasaForEdit && (
        <EditPOJasaModal
          isOpen={isEditPOJasaModalOpen}
          onClose={() => setIsEditPOJasaModalOpen(false)}
          onSubmit={handleEditPOJasaModalSubmit}
          poId={selectedPOJasaForEdit.id}
          initialItems={selectedPOJasaForEdit.items}
        />
      )}
    </div>
  );
};

export default POJasaDashboard;
