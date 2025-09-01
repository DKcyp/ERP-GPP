import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { PayVoucherFormData } from '../types';

interface PayVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PayVoucherFormData) => void;
  initialData: { voucherNo: string; amount: string; name: string; }; // Data from the table row
}

// Helper functions for Rupiah formatting (re-used from KasKeluarModal)
const formatRupiah = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '';
  const stringValue = String(value);
  const cleanValue = stringValue.replace(/[^0-9]/g, ''); // Remove all non-digits
  const num = parseInt(cleanValue, 10);

  if (isNaN(num) || cleanValue === '') {
    return '';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const parseRupiah = (value: string): string => {
  return value.replace(/[^0-9]/g);
};

const PayVoucherModal: React.FC<PayVoucherModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [jenisBayar, setJenisBayar] = useState('');
  const [nominal, setNominal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const paymentTypeOptions = ['Cash', 'Bank Transfer', 'Credit Card', 'E-Wallet'];

  useEffect(() => {
    if (isOpen && initialData) {
      setJenisBayar(''); // Reset payment type on open
      setNominal(parseFloat(parseRupiah(initialData.amount)) || 0); // Pre-fill nominal from initialData
      setErrors({}); // Clear errors
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors: any = {};
    if (!jenisBayar) newErrors.jenisBayar = 'Jenis bayar wajib dipilih';
    if (nominal <= 0) newErrors.nominal = 'Nominal harus lebih dari 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    onSave({
      voucherNo: initialData.voucherNo,
      jenisBayar,
      nominal,
    });
    setIsLoading(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Bayar Voucher: {initialData.voucherNo}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="jenisBayar" className="block text-sm font-medium text-gray-700 mb-2">Jenis Bayar <span className="text-red-500">*</span></label>
            <select
              id="jenisBayar"
              className={`block w-full border rounded-lg px-4 py-2 focus:ring-purple-500 focus:border-purple-500 text-sm appearance-none ${errors.jenisBayar ? 'border-red-300' : 'border-gray-300'}`}
              value={jenisBayar}
              onChange={(e) => setJenisBayar(e.target.value)}
            >
              <option value="">Pilih Jenis Bayar</option>
              {paymentTypeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.jenisBayar && <p className="mt-1 text-sm text-red-600">{errors.jenisBayar}</p>}
          </div>
          <div>
            <label htmlFor="nominal" className="block text-sm font-medium text-gray-700 mb-2">Nominal <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="nominal"
              className={`block w-full border rounded-lg px-4 py-2 focus:ring-purple-500 focus:border-purple-500 text-sm ${errors.nominal ? 'border-red-300' : 'border-gray-300'}`}
              value={formatRupiah(nominal)}
              onChange={(e) => setNominal(parseFloat(parseRupiah(e.target.value)) || 0)}
              placeholder="Masukkan Nominal"
            />
            {errors.nominal && <p className="mt-1 text-sm text-red-600">{errors.nominal}</p>}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Pembayaran</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayVoucherModal;
