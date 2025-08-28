import React, { useState, useEffect } from 'react';
import { X, Save, CalendarDays, DollarSign, User, Building } from 'lucide-react';
import { InvoiceFormInput } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: InvoiceFormInput) => void;
  initialData?: InvoiceFormInput; // Optional for editing
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<InvoiceFormInput>({
    noPO: '',
    tanggalPO: '',
    namaVendor: '',
    nilaiInvoice: '',
    penerimaInvoice: '',
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    } else if (isOpen) {
      // Reset form when opening for new entry
      setFormData({
        noPO: '',
        tanggalPO: '',
        namaVendor: '',
        nilaiInvoice: '',
        penerimaInvoice: '',
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 ease-out scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          title="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">
          {initialData ? 'Edit Invoice' : 'Tambah Invoice Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* No PO */}
          <div>
            <label htmlFor="noPO" className="block text-sm font-medium text-gray-700 mb-1">
              No PO
            </label>
            <div className="relative">
              <input
                type="text"
                id="noPO"
                value={formData.noPO}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                placeholder="PO00123"
                required
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-400 text-sm">#</span>
              </div>
            </div>
          </div>

          {/* Tanggal PO */}
          <div>
            <label htmlFor="tanggalPO" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal PO
            </label>
            <div className="relative">
              <input
                type="date"
                id="tanggalPO"
                value={formData.tanggalPO}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CalendarDays className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Nama Vendor */}
          <div>
            <label htmlFor="namaVendor" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Vendor
            </label>
            <div className="relative">
              <input
                type="text"
                id="namaVendor"
                value={formData.namaVendor}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                placeholder="PT Maju Sejahtera"
                required
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Nilai Invoice */}
          <div>
            <label htmlFor="nilaiInvoice" className="block text-sm font-medium text-gray-700 mb-1">
              Nilai Invoice
            </label>
            <div className="relative">
              <input
                type="text"
                id="nilaiInvoice"
                value={formData.nilaiInvoice}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rp 10.000.000"
                required
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Penerima Invoice */}
          <div>
            <label htmlFor="penerimaInvoice" className="block text-sm font-medium text-gray-700 mb-1">
              Penerima Invoice
            </label>
            <div className="relative">
              <input
                type="text"
                id="penerimaInvoice"
                value={formData.penerimaInvoice}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ahmad Kasim"
                required
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors shadow-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;
