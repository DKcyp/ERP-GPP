import React, { useState } from 'react';
import Modal from './Modal';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { EntryPOJasaFormData, EntryPOJasaItem } from '../types';

interface EntryPOJasaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EntryPOJasaFormData) => void;
}

const EntryPOJasaModal: React.FC<EntryPOJasaModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EntryPOJasaFormData>({
    noPr: '',
    tanggalPo: '',
    noPo: 'PO0091', // Default value from image
    vendor: '',
    noSo: '',
    kodeVendor: '',
    departemen: '',
    pajak: '',
    metodePembayaran: '',
    items: [],
    daftarFile: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, daftarFile: e.target.files![0] }));
    } else {
      setFormData((prev) => ({ ...prev, daftarFile: null }));
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now().toString(), // Simple unique ID
          namaJasa: '',
          kodeJasa: '',
          qty: 0,
          satuan: '',
          hargaSatuan: 0,
          disc: 0,
          jumlah: 0,
          keterangan: '',
        },
      ],
    }));
  };

  const handleItemChange = (id: string, field: keyof EntryPOJasaItem, value: any) => {
    setFormData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate 'jumlah' if 'qty', 'hargaSatuan', or 'disc' changes
          if (field === 'qty' || field === 'hargaSatuan' || field === 'disc') {
            const qty = updatedItem.qty || 0;
            const hargaSatuan = updatedItem.hargaSatuan || 0;
            const disc = updatedItem.disc || 0;
            updatedItem.jumlah = (qty * hargaSatuan) * (1 - disc / 100); // Assuming disc is percentage
          }
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const handleRemoveItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Entry PO Jasa" size="5xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="noPr" className="block text-sm font-medium text-gray-700 mb-1">No PR</label>
              <select
                id="noPr"
                name="noPr"
                value={formData.noPr}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Pilih No PR</option>
                <option value="PR001">PR001</option>
                <option value="PR002">PR002</option>
              </select>
            </div>
            <div>
              <label htmlFor="noPo" className="block text-sm font-medium text-gray-700 mb-1">No PO</label>
              <input
                type="text"
                id="noPo"
                name="noPo"
                value={formData.noPo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="noSo" className="block text-sm font-medium text-gray-700 mb-1">No SO</label>
              <input
                type="text"
                id="noSo"
                name="noSo"
                value={formData.noSo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="departemen" className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
              <input
                type="text"
                id="departemen"
                name="departemen"
                value={formData.departemen}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="metodePembayaran" className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
              <select
                id="metodePembayaran"
                name="metodePembayaran"
                value={formData.metodePembayaran}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Pilih Metode Pembayaran</option>
                <option value="Transfer">Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="tanggalPo" className="block text-sm font-medium text-gray-700 mb-1">Tanggal PO</label>
              <div className="relative">
                <input
                  type="date" // Use type="date" for date picker
                  id="tanggalPo"
                  name="tanggalPo"
                  value={formData.tanggalPo}
                  onChange={handleInputChange}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input
                type="text"
                id="vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="kodeVendor" className="block text-sm font-medium text-gray-700 mb-1">Kode Vendor</label>
              <input
                type="text"
                id="kodeVendor"
                name="kodeVendor"
                value={formData.kodeVendor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="pajak" className="block text-sm font-medium text-gray-700 mb-1">Pajak</label>
              <select
                id="pajak"
                name="pajak"
                value={formData.pajak}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Pilih Pajak</option>
                <option value="PPN 11%">PPN 11%</option>
                <option value="Non PPN">Non PPN</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jasa Items Table */}
        <h4 className="text-lg font-semibold text-text mb-4">Daftar Jasa</h4>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nama Jasa</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Kode Jasa</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Qty</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Satuan</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Harga Satuan</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Disc (Rp)</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Jumlah</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Keterangan</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {formData.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.namaJasa}
                      onChange={(e) => handleItemChange(item.id, 'namaJasa', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.kodeJasa}
                      onChange={(e) => handleItemChange(item.id, 'kodeJasa', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, 'qty', parseInt(e.target.value) || 0)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.satuan}
                      onChange={(e) => handleItemChange(item.id, 'satuan', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.hargaSatuan}
                      onChange={(e) => handleItemChange(item.id, 'hargaSatuan', parseFloat(e.target.value) || 0)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.disc}
                      onChange={(e) => handleItemChange(item.id, 'disc', parseFloat(e.target.value) || 0)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.jumlah)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.keterangan}
                      onChange={(e) => handleItemChange(item.id, 'keterangan', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Tambah Jasa</span>
        </button>

        {/* File Upload */}
        <div className="mt-6">
          <label htmlFor="daftarFile" className="block text-sm font-medium text-gray-700 mb-1">Daftar File</label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              id="daftarFile"
              name="daftarFile"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {formData.daftarFile && (
              <span className="text-sm text-gray-600">{formData.daftarFile.name}</span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-border mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EntryPOJasaModal;
