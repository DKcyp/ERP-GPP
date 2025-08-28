import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Assuming Modal.tsx is in the same components directory
import { CalendarDays, FileDown } from 'lucide-react';
import { TandaTerimaInvoiceDetail } from '../types';

interface TandaTerimaInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: TandaTerimaInvoiceDetail | null;
  onVerify: (invoiceId: string, verificationDate: string) => void;
}

const TandaTerimaInvoiceModal: React.FC<TandaTerimaInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
  onVerify,
}) => {
  const [verificationDate, setVerificationDate] = useState('');

  useEffect(() => {
    if (isOpen && invoiceData) {
      setVerificationDate(invoiceData.tanggalVerifikasi || '');
    } else {
      setVerificationDate(''); // Reset when modal closes
    }
  }, [isOpen, invoiceData]);

  const handleVerify = () => {
    if (invoiceData && verificationDate) {
      onVerify(invoiceData.id, verificationDate);
      onClose();
    }
  };

  if (!isOpen || !invoiceData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tanda Terima dari Resepsionis" size="3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tanggal PO */}
        <div>
          <label htmlFor="tanggal-po" className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal PO
          </label>
          <input
            type="text"
            id="tanggal-po"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
            value={invoiceData.tanggalPO}
            readOnly
          />
        </div>

        {/* Penerima Invoice */}
        <div>
          <label htmlFor="penerima-invoice" className="block text-sm font-medium text-gray-700 mb-1">
            Penerima Invoice
          </label>
          <input
            type="text"
            id="penerima-invoice"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
            value={invoiceData.penerimaInvoice}
            readOnly
          />
        </div>

        {/* No PO */}
        <div>
          <label htmlFor="no-po" className="block text-sm font-medium text-gray-700 mb-1">
            No PO
          </label>
          <input
            type="text"
            id="no-po"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
            value={invoiceData.noPO}
            readOnly
          />
        </div>

        {/* Unduh Invoice */}
        <div>
          <label htmlFor="unduh-invoice" className="block text-sm font-medium text-gray-700 mb-1">
            Unduh Invoice
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              id="unduh-invoice"
              className="block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
              value={invoiceData.unduhInvoice}
              readOnly
            />
            <a
              href={invoiceData.unduhInvoice}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500 hover:text-blue-700 transition-colors"
              title="Download Invoice"
            >
              <FileDown className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Nama Vendor */}
        <div>
          <label htmlFor="nama-vendor" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Vendor
          </label>
          <input
            type="text"
            id="nama-vendor"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
            value={invoiceData.namaVendor}
            readOnly
          />
        </div>

        {/* Tanggal Verifikasi */}
        <div>
          <label htmlFor="tanggal-verifikasi" className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Verifikasi
          </label>
          <div className="relative">
            <input
              type="text"
              id="tanggal-verifikasi"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="dd/mm/yyyy"
              value={verificationDate}
              onChange={(e) => setVerificationDate(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <CalendarDays className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Nilai Invoice */}
        <div>
          <label htmlFor="nilai-invoice" className="block text-sm font-medium text-gray-700 mb-1">
            Nilai Invoice
          </label>
          <input
            type="text"
            id="nilai-invoice"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
            value={invoiceData.nilaiInvoice}
            readOnly
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
        <button
          type="button"
          onClick={handleVerify}
          className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
        >
          Verifikasi
        </button>
      </div>
    </Modal>
  );
};

export default TandaTerimaInvoiceModal;
