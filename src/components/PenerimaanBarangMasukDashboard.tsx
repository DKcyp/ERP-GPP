import React, { useState } from 'react';
import { Clock, Search, Plus, FileText, FileBarChart, FileSpreadsheet, Eye, Edit, Trash2, CalendarDays } from 'lucide-react';
import EntryPenerimaanBarangModal from './EntryPenerimaanBarangModal'; // Import the new modal
import ConfirmDeleteModal from './ConfirmDeleteModal';

type Mode = 'create' | 'view' | 'edit';

interface RowData {
  no: number;
  noInvoice: string;
  noPo: string;
  namaSupplier: string;
  tanggalPenerimaan: string; // yyyy-mm-dd
  jumlahItem: number;
  serialNumber: string;
  keterangan: string;
}

const PenerimaanBarangMasukDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<Mode>('create');
  const [selectedHeader, setSelectedHeader] = useState<{ noInvoice?: string; noPo?: string; namaSupplier?: string; tanggalPenerimaan?: string; catatan?: string } | undefined>(undefined);
  const [items, setItems] = useState<RowData[]>([
    { no: 1, noInvoice: 'INV-001', noPo: 'PO001', namaSupplier: 'Supplier A', tanggalPenerimaan: '2025-03-10', jumlahItem: 5, serialNumber: 'SN001-005', keterangan: 'Barang dalam kondisi baik' },
    { no: 2, noInvoice: 'INV-002', noPo: 'PO002', namaSupplier: 'Supplier B', tanggalPenerimaan: '2025-03-09', jumlahItem: 8, serialNumber: 'SN002-008', keterangan: 'Perlu inspeksi lebih lanjut' },
    { no: 3, noInvoice: 'INV-003', noPo: 'PO003', namaSupplier: 'Supplier C', tanggalPenerimaan: '2025-03-08', jumlahItem: 3, serialNumber: 'SN003-003', keterangan: 'Sesuai spesifikasi' },
    { no: 4, noInvoice: 'INV-004', noPo: 'PO004', namaSupplier: 'Supplier D', tanggalPenerimaan: '2025-03-07', jumlahItem: 10, serialNumber: 'SN004-010', keterangan: 'Menunggu approval QC' },
  ]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RowData | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                REQUEST FOR INSPECTION (RFI)
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Gudang</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Request For Inspection (RFI)</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <label htmlFor="noInvoice" className="block text-xs font-medium text-gray-700 mb-1">Cari No Invoice</label>
              <input
                type="text"
                id="noInvoice"
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                placeholder="INV-001"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <div className="relative">
              <label htmlFor="noPo" className="block text-xs font-medium text-gray-700 mb-1">Cari No PO</label>
              <input
                type="text"
                id="noPo"
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                placeholder="PO001"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <div className="relative">
              <label htmlFor="namaSupplier" className="block text-xs font-medium text-gray-700 mb-1">Cari Nama Supplier</label>
              <input
                type="text"
                id="namaSupplier"
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                placeholder="PT Clock Tower"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* Periode and Search Button */}
          <div className="flex items-end space-x-3 mb-4">
            <div className="relative flex-1">
              <label htmlFor="periodeStart" className="block text-xs font-medium text-gray-700 mb-1">Periode</label>
              <div className="flex items-center space-x-2">
                <div className="relative w-1/2">
                  <input
                    type="date"
                    id="periodeStart"
                    className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                    defaultValue="2025-03-01"
                  />
                  <CalendarDays className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <span className="text-gray-500 text-xs">s.d</span>
                <div className="relative w-1/2">
                  <input
                    type="date"
                    id="periodeEnd"
                    className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                    defaultValue="2025-03-31"
                  />
                  <CalendarDays className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-xs shadow-sm">
              Search
            </button>
          </div>

          {/* Action Buttons: + Penerimaan Barang and Export */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => {
                setModalMode('create');
                setSelectedHeader(undefined);
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-xs shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>+ Request For Inspection</span>
            </button>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-xs shadow-sm">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </button>
              <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-xs shadow-sm">
                <FileText className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-xs shadow-sm">
                <FileBarChart className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>Show</span>
                <select className="border border-gray-300 rounded-md px-2 py-1 text-xs">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span>entries</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search:"
                  className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">No Invoice</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">No PO</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Nama Supplier</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Tanggal Penerimaan</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Jumlah Item Barang</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.no} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.no}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.noInvoice}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.noPo}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.namaSupplier}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.tanggalPenerimaan}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.jumlahItem}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.serialNumber}</td>
                    <td className="px-3 py-2 text-xs text-gray-900 max-w-xs truncate" title={item.keterangan}>{item.keterangan}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                      <div className="flex items-center space-x-1.5">
                        <button
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded-full hover:bg-blue-100"
                          onClick={() => {
                            setModalMode('view');
                            setSelectedHeader({
                              noInvoice: item.noInvoice,
                              noPo: item.noPo,
                              namaSupplier: item.namaSupplier,
                              tanggalPenerimaan: item.tanggalPenerimaan,
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 p-1 rounded-full hover:bg-indigo-100"
                          onClick={() => {
                            setModalMode('edit');
                            setSelectedHeader({
                              noInvoice: item.noInvoice,
                              noPo: item.noPo,
                              namaSupplier: item.namaSupplier,
                              tanggalPenerimaan: item.tanggalPenerimaan,
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-100"
                          onClick={() => {
                            setItemToDelete(item);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-gray-600">
              Showing 1 to {items.length} of {items.length} entries
            </div>
            <div className="flex items-center space-x-1.5">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-xs">
                Previous
              </button>
              <button className="px-3 py-1.5 border border-blue-500 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-xs">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-xs">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500 flex justify-between items-center">
        <span>2023 Mazer</span>
        <span>
          Crafted with <span className="text-red-500">❤️</span> by Saugi
        </span>
      </footer>

      <EntryPenerimaanBarangModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        headerData={selectedHeader}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          if (itemToDelete) {
            setItems(prev => prev.filter(r => r.no !== itemToDelete.no));
          }
        }}
        title="Konfirmasi Hapus Penerimaan"
        message="Apakah Anda yakin ingin menghapus penerimaan barang ini?"
        itemName={itemToDelete ? `${itemToDelete.noInvoice} - ${itemToDelete.namaSupplier}` : undefined}
      />
    </div>
  );
};

export default PenerimaanBarangMasukDashboard;
