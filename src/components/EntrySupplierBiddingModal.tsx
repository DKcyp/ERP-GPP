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
        total: '',
        pengiriman: '',
        garansi: '',
        keterangan: '',
      },
    ],
  });

  const prOptions = [
    { value: 'PR001', label: 'PR001' },
    { value: 'PR002', label: 'PR002' },
    { value: 'PR003', label: 'PR003' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
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
          total: '',
          pengiriman: '',
          garansi: '',
          keterangan: '',
        },
      ],
    }));
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
          total: '',
          pengiriman: '',
          garansi: '',
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
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diskon (%)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PPN / Non PPN</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengiriman</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Garansi</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
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
                          <input
                            type="text"
                            name="namaVendor"
                            value={item.namaVendor}
                            onChange={(e) => handleItemChange(index, e)}
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
                            name="total"
                            value={item.total}
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
                        <td className="p-2">
                          <input
                            type="text"
                            name="keterangan"
                            value={item.keterangan}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full border-0 focus:ring-0 text-sm"
                          />
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
              <Plus size={16} className="mr-1" /> Tambah Vendor
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
