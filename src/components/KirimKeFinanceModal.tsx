import React, { useState } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { KirimKeFinanceFormData, KirimKeFinanceItemEntry } from '../types';

interface KirimKeFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: KirimKeFinanceFormData) => void;
}

const KirimKeFinanceModal: React.FC<KirimKeFinanceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<KirimKeFinanceFormData>({
    noPO: '',
    tanggalPO: '',
    namaVendor: '',
    namaPenyerah: '',
    items: [
      { id: '1', no: 1, nama: 'Barang A', jumlah: '10', hargaSatuan: '100.000', total: '1.000.000' },
      { id: '2', no: 2, nama: 'Barang B', jumlah: '5', hargaSatuan: '200.000', total: '1.000.000' },
    ],
  });

  const noPOOptions = [
    { value: 'PO001', label: 'PO001' },
    { value: 'PO002', label: 'PO002' },
    { value: 'PO003', label: 'PO003' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Optionally reset form after submission
    setFormData({
      noPO: '',
      tanggalPO: '',
      namaVendor: '',
      namaPenyerah: '',
      items: [
        { id: '1', no: 1, nama: 'Barang A', jumlah: '10', hargaSatuan: '100.000', total: '1.000.000' },
        { id: '2', no: 2, nama: 'Barang B', jumlah: '5', hargaSatuan: '200.000', total: '1.000.000' },
      ],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Kirim Ke Finance</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Top Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="noPO" className="block text-sm font-medium text-gray-700 mb-1">No PO</label>
                <select
                  id="noPO"
                  name="noPO"
                  value={formData.noPO}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Pilih No PO</option>
                  {noPOOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="tanggalPO" className="block text-sm font-medium text-gray-700 mb-1">Tanggal PO</label>
                <div className="relative">
                  <input
                    type="text"
                    id="tanggalPO"
                    name="tanggalPO"
                    value={formData.tanggalPO}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="dd/mm/yyyy"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="namaVendor" className="block text-sm font-medium text-gray-700 mb-1">Nama Vendor</label>
                <input
                  type="text"
                  id="namaVendor"
                  name="namaVendor"
                  value={formData.namaVendor}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="namaPenyerah" className="block text-sm font-medium text-gray-700 mb-1">Nama Penyerah</label>
                <input
                  type="text"
                  id="namaPenyerah"
                  name="namaPenyerah"
                  value={formData.namaPenyerah}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Items Table Section */}
            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Satuan</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2 text-sm text-gray-700">{item.no}</td>
                        <td className="p-2 text-sm text-gray-700">{item.nama}</td>
                        <td className="p-2 text-sm text-gray-700">{item.jumlah}</td>
                        <td className="p-2 text-sm text-gray-700">{item.hargaSatuan}</td>
                        <td className="p-2 text-sm text-gray-700">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end p-4 border-t border-gray-200 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Kirim Ke Finance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KirimKeFinanceModal;
