import React, { useState } from 'react';
import { X, CalendarDays, Plus } from 'lucide-react';
import { EntrySupplierBiddingFormData, BiddingItemEntry } from '../types';

interface EntrySupplierBiddingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EntrySupplierBiddingFormData) => void;
}

const EntrySupplierBiddingModal: React.FC<EntrySupplierBiddingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EntrySupplierBiddingFormData>({
    noBidding: 'BIDDING42',
    noPR: '',
    tanggalBidding: '',
    departemen: '',
    items: [
      {
        id: '1',
        namaBarang: '',
        qty: '',
        namaVendor: '',
        harga: '',
        diskon: '',
        jumlah: '',
        ppnNonPpn: '',
        pengiriman: '',
        garansi: '',
        metodeBayar: '', // NEW: Added metodeBayar
        keterangan: '',
      },
    ],
  });

  const prOptions = [
    { value: 'PR001', label: 'PR001' },
    { value: 'PR002', label: 'PR002' },
    { value: 'PR003', label: 'PR003' },
  ];

  // Mock: daftar barang berdasarkan PR terpilih (auto-populate items)
  const prItemsMap: Record<string, Array<Partial<BiddingItemEntry>>> = {
    PR001: [
      { namaBarang: 'Kabel NYA 1.5mm', qty: '10' },
      { namaBarang: 'MCB 2A', qty: '5' },
    ],
    PR002: [
      { namaBarang: 'Pipa PVC 1"', qty: '20' },
    ],
    PR003: [
      { namaBarang: 'Panel Listrik', qty: '2' },
      { namaBarang: 'Breaker 10A', qty: '6' },
      { namaBarang: 'Stop Kontak', qty: '12' },
    ],
  };

  const vendorOptions = [
    { value: '', label: 'Pilih Vendor' },
    { value: 'Vendor A', label: 'Vendor A' },
    { value: 'Vendor B', label: 'Vendor B' },
    { value: 'Vendor C', label: 'Vendor C' },
    { value: 'CUSTOM', label: 'Vendor masih Bidding (ketik manual)' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Auto-populate items ketika No PR dipilih
    if (name === 'noPR') {
      const preset = prItemsMap[value] || [];
      const newItems = preset.length
        ? preset.map((p, idx) => ({
            id: String(idx + 1),
            namaBarang: p.namaBarang || '',
            qty: p.qty || '',
            namaVendor: '',
            harga: '',
            diskon: '',
            jumlah: '',
            ppnNonPpn: '',
            pengiriman: '',
            garansi: '',
            metodeBayar: '',
            keterangan: '',
          }))
        : formData.items;
      setFormData((prev: any) => ({ ...prev, [name]: value, items: newItems }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setFormData((prev: any) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setFormData((prev: any) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: (prev.items.length + 1).toString(),
          namaBarang: '',
          qty: '',
          namaVendor: '',
          harga: '',
          diskon: '',
          jumlah: '',
          ppnNonPpn: '',
          pengiriman: '',
          garansi: '',
          metodeBayar: '', // NEW: Added metodeBayar
          keterangan: '',
        },
      ],
    }));
  };

  const handleVendorModeChange = (index: number, mode: 'SELECT' | 'CUSTOM') => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], vendorMode: mode };
    setFormData((prev: EntrySupplierBiddingFormData) => ({ ...prev, items: newItems }));
  };

  const handleRowPenilaian = (index: number) => {
    const item = formData.items[index] as any;
    window.alert(`Penilaian untuk barang: ${item?.namaBarang || ''}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form after submission
    setFormData({
      noBidding: 'BIDDING42',
      noPR: '',
      tanggalBidding: '',
      departemen: '',
      items: [
        {
          id: '1',
          namaBarang: '',
          qty: '',
          namaVendor: '',
          harga: '',
          diskon: '',
          jumlah: '',
          ppnNonPpn: '',
          pengiriman: '',
          garansi: '',
          metodeBayar: '',
          keterangan: '',
        },
      ],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Entry Supplier / Bidding</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto">
            {/* Top Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="noBidding" className="block text-sm font-medium text-gray-700 mb-1">
                  No Bidding
                </label>
                <input
                  type="text"
                  id="noBidding"
                  name="noBidding"
                  value={formData.noBidding}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="noPR" className="block text-sm font-medium text-gray-700 mb-1">
                  No PR
                </label>
                <select
                  id="noPR"
                  name="noPR"
                  value={formData.noPR}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Pilih No PR</option>
                  {prOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="tanggalBidding" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Bidding
                </label>
                <div className="relative">
                  <input
                    type="text" // Use text for custom format, or 'date' for native picker
                    id="tanggalBidding"
                    name="tanggalBidding"
                    value={formData.tanggalBidding}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="dd/mm/yyyy"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="departemen" className="block text-sm font-medium text-gray-700 mb-1">
                  Departemen
                </label>
                <input
                  type="text"
                  id="departemen"
                  name="departemen"
                  value={formData.departemen}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Items Table Section */}
            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Vendor</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Telp</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diskon (%)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PPN / Non PPN</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengiriman</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Garansi</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode Bayar</th> {/* NEW COLUMN */}
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Penilaian</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Kunjungan</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="p-2">
                          <input
                            type="text"
                            name="namaBarang"
                            value={item.namaBarang}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            name="qty"
                            value={item.qty}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <div className="flex flex-col gap-1">
                            <select
                              value={(item as any).vendorMode === 'CUSTOM' ? 'CUSTOM' : (item.namaVendor || '')}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (v === 'CUSTOM') {
                                  handleVendorModeChange(index, 'CUSTOM');
                                } else {
                                  handleVendorModeChange(index, 'SELECT');
                                  const fakeEvt = { target: { name: 'namaVendor', value: v } } as any;
                                  handleItemChange(index, fakeEvt);
                                }
                              }}
                              className="w-full border-0 focus:ring-0 text-sm"
                            >
                              {vendorOptions.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
                            {(item as any).vendorMode === 'CUSTOM' && (
                              <input
                                type="text"
                                placeholder="Ketik nama vendor"
                                value={item.namaVendor}
                                onChange={(e) => handleItemChange(index, e as any)}
                                name="namaVendor"
                                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                              />
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            name="pic"
                            value={(item as any).pic || ''}
                            onChange={(e) => {
                              const newItems: any[] = [...(formData.items as any[])];
                              newItems[index] = { ...newItems[index], pic: e.target.value };
                              setFormData((prev: any) => ({ ...prev, items: newItems as any }));
                            }}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            name="noTelp"
                            value={(item as any).noTelp || ''}
                            onChange={(e) => {
                              const newItems: any[] = [...(formData.items as any[])];
                              newItems[index] = { ...newItems[index], noTelp: e.target.value };
                              setFormData((prev) => ({ ...prev, items: newItems as any }));
                            }}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            name="harga"
                            value={item.harga}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            name="diskon"
                            value={item.diskon}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            name="jumlah"
                            value={item.jumlah}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            name="ppnNonPpn"
                            value={item.ppnNonPpn}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            name="pengiriman"
                            value={item.pengiriman}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            name="garansi"
                            value={item.garansi}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2"> {/* NEW CELL */}
                          <input
                            type="text"
                            name="metodeBayar"
                            value={item.metodeBayar}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            name="keterangan"
                            value={item.keterangan}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="datetime-local"
                            value={(item as any).waktuPenilaian || ''}
                            onChange={(e) => {
                              const newItems: any[] = [...(formData.items as any[])];
                              newItems[index] = { ...newItems[index], waktuPenilaian: e.target.value };
                              setFormData((prev) => ({ ...prev, items: newItems as any }));
                            }}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="datetime-local"
                            value={(item as any).waktuKunjungan || ''}
                            onChange={(e) => {
                              const newItems: any[] = [...(formData.items as any[])];
                              newItems[index] = { ...newItems[index], waktuKunjungan: e.target.value };
                              setFormData((prev) => ({ ...prev, items: newItems as any }));
                            }}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRowPenilaian(index)}
                            className="px-3 py-1 rounded bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                          >
                            Penilaian
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              <Plus size={16} className="mr-1" /> Tambah Item Penawaran {/* Changed text */}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntrySupplierBiddingModal;
