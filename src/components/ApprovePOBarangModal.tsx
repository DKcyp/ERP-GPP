import React, { useState, useEffect } from 'react';
import { X, CalendarDays, ThumbsUp, ThumbsDown } from 'lucide-react';
import { POBarangData, ApprovalPOBarangFormData } from '../types';

interface ApprovePOBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
  poId: number | null;
  onApprove: (data: ApprovalPOBarangFormData) => void;
}

// Mock data for a single PO Barang, replace with actual data fetching
const mockPOBarangDetails: POBarangData[] = [
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
    status: 'Unpaid', // This one is pending approval
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
    status: 'Pending', // Another one pending approval
    noSO: 'SO003',
    metodePembayaran: 'Giro',
    kodeVendor: 'KV003',
    departemen: 'Procurement',
    vendor: 'UD. Cahaya Abadi',
    pajak: 'PPN',
    tandaBuktiUrl: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Example Pexels URL
    daftarFileUrls: ['https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], // Example Pexels URL
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
];


const ApprovePOBarangModal: React.FC<ApprovePOBarangModalProps> = ({ isOpen, onClose, poId, onApprove }) => {
  const [poDetails, setPoDetails] = useState<POBarangData | null>(null);
  const [keterangan, setKeterangan] = useState<string>('');

  useEffect(() => {
    if (isOpen && poId !== null) {
      // In a real application, you would fetch data from an API
      const data = mockPOBarangDetails.find(po => po.id === poId);
      setPoDetails(data || null);
      setKeterangan(''); // Reset keterangan when modal opens
    }
  }, [isOpen, poId]);

  const handleApprove = () => {
    if (poDetails) {
      onApprove({ poId: poDetails.id, action: 'approve', keterangan });
      onClose();
    }
  };

  const handleReject = () => {
    if (poDetails) {
      onApprove({ poId: poDetails.id, action: 'reject', keterangan });
      onClose();
    }
  };

  if (!isOpen || !poDetails) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-auto max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Approve PO Barang: {poDetails.noPo}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Top Form Fields - Read Only */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="noPR" className="block text-sm font-medium text-gray-700 mb-1">No PR</label>
                <input type="text" id="noPR" value={poDetails.noPr} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600" />
              </div>
              <div>
                <label htmlFor="tanggalPO" className="block text-sm font-medium text-gray-700 mb-1">Tanggal PO</label>
                <div className="relative">
                  <input type="text" id="tanggalPO" value={poDetails.tanggalPo} readOnly className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="noPO" className="block text-sm font-medium text-gray-700 mb-1">No PO</label>
                <input type="text" id="noPO" value={poDetails.noPo} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600" />
              </div>
              <div>
                <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <input type="text" id="vendor" value={poDetails.vendor || ''} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600" />
              </div>

              <div>
                <label htmlFor="noSO" className="block text-sm font-medium text-gray-700 mb-1">No SO</label>
                <input type="text" id="noSO" value={poDetails.noSO || ''} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600" />
              </div>
              <div>
                <label htmlFor="kodeVendor" className="block text-sm font-medium text-gray-700 mb-1">Kode Vendor</label>
                <input type="text" id="kodeVendor" value={poDetails.kodeVendor || ''} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600" />
              </div>
              <div>
                <label htmlFor="departemen" className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
                <input type="text" id="departemen" value={poDetails.departemen || ''} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600" />
              </div>
              <div>
                <label htmlFor="pajak" className="block text-sm font-medium text-gray-700 mb-1">Pajak</label>
                <input type="text" id="pajak" value={poDetails.pajak || ''} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600" />
              </div>

              <div>
                <label htmlFor="metodePembayaran" className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                <input type="text" id="metodePembayaran" value={poDetails.metodePembayaran || ''} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600" />
              </div>
              <div>
                <label htmlFor="tanggalPengiriman" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengiriman</label>
                <div className="relative">
                  <input type="text" id="tanggalPengiriman" value={poDetails.tanggalPengiriman} readOnly className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <label htmlFor="tandaBukti" className="block text-sm font-medium text-gray-700 mb-1">Tanda Bukti</label>
                {poDetails.tandaBuktiUrl ? (
                  <a href={poDetails.tandaBuktiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Tanda Bukti</a>
                ) : (
                  <span className="text-sm text-gray-500">No file uploaded</span>
                )}
              </div>
            </div>

            {/* Daftar File */}
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Daftar File</label>
              {poDetails.daftarFileUrls && poDetails.daftarFileUrls.length > 0 ? (
                <ul className="text-sm text-gray-700 mt-2 border border-gray-200 rounded-md p-3 bg-gray-50">
                  {poDetails.daftarFileUrls.map((url, index) => (
                    <li key={index}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        File {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No additional files uploaded.</p>
              )}
            </div>

            {/* Items Table Section - Read Only */}
            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Satuan</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pajak</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disc (Rp)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {poDetails.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="p-2"><input type="text" value={item.namaBarang} readOnly className="w-full border-0 focus:ring-0 text-sm bg-transparent" /></td>
                        <td className="p-2"><input type="text" value={item.kodeBarang} readOnly className="w-full border-0 focus:ring-0 text-sm bg-transparent" /></td>
                        <td className="p-2"><input type="text" value={item.qty} readOnly className="w-full border-0 focus:ring-0 text-sm bg-transparent" /></td>
                        <td className="p-2"><input type="text" value={item.satuan} readOnly className="w-full border-0 focus:ring-0 text-sm bg-transparent" /></td>
                        <td className="p-2"><input type="text" value={item.hargaSatuan} readOnly className="w-full border-0 focus:ring-0 text-sm bg-transparent" /></td>
                        <td className="p-2"><input type="text" value={item.pajakItem} readOnly className="w-full border-0 focus:ring-0 text-sm bg-transparent" /></td>
                        <td className="p-2"><input type="text" value={item.discRp} readOnly className="w-full border-0 focus:ring-0 text-sm bg-transparent" /></td>
                        <td className="p-2"><input type="text" value={item.jumlah} readOnly className="w-full border-0 focus:ring-0 text-sm bg-transparent" /></td>
                        <td className="p-2"><input type="text" value={item.keterangan} readOnly className="w-full border-0 focus:ring-0 text-sm bg-transparent" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Totals - Read Only */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 self-end w-full md:w-1/2 ml-auto">
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Total:</span>
                <input type="text" value={poDetails.total || ''} readOnly className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600" />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Disc Akhir:</span>
                <input type="text" value={poDetails.discAkhir || ''} readOnly className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600" />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Sub Total:</span>
                <input type="text" value={poDetails.subTotal || ''} readOnly className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600" />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>PPN:</span>
                <input type="text" value={poDetails.ppn || ''} readOnly className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600" />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Ongkos Kirim:</span>
                <input type="text" value={poDetails.ongkosKirim || ''} readOnly className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600" />
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Grand Total:</span>
                <input type="text" value={poDetails.grandTotal || ''} readOnly className="w-1/2 text-right px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600" />
              </div>
            </div>

            {/* Keterangan for Approval/Rejection */}
            <div className="mt-6">
              <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">Keterangan (Opsional)</label>
              <textarea
                id="keterangan"
                name="keterangan"
                rows={3}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tambahkan catatan persetujuan atau penolakan..."
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end p-4 border-t border-gray-200 space-x-2">
            <button
              type="button"
              onClick={handleReject}
              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <ThumbsDown size={16} />
              <span>Tolak</span>
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <ThumbsUp size={16} />
              <span>Setuju</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovePOBarangModal;
