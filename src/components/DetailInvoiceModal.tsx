import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { InvoiceDetailData } from '../types';

interface DetailInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceDetailData | null;
}

const DetailInvoiceModal: React.FC<DetailInvoiceModalProps> = ({ isOpen, onClose, invoiceData }) => {
  const [activeTab, setActiveTab] = useState('Barang Utama');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  if (!isOpen || !invoiceData) return null;

  const tabs = ['Barang Utama', 'Barang Pendukung', 'Barang Lain-Lain', 'Man Power', 'Jasa'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Detail Invoice</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* No SO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No SO</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {invoiceData.noSO}
              </p>
            </div>

            {/* Nama Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Project</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {invoiceData.namaProject}
              </p>
            </div>

            {/* HPP SO (SO Turunan) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HPP SO</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {invoiceData.hppSO}
              </p>
            </div>

            {/* No Invoice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Invoice</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {invoiceData.noInvoice}
              </p>
            </div>
          </div>

          {/* Tabs for Items */}
          <div className="p-6 pt-0">
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                      ${activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'Barang Utama' && (
              <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoiceData.items.map((item) => (
                      <tr key={item.no} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.no}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.kodeBarang}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.namaBarang}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.jumlah}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.satuan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(item.harga)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Placeholder for other tabs */}
            {activeTab !== 'Barang Utama' && (
              <div className="p-6 text-center text-gray-500">
                Content for {activeTab} is not yet implemented.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailInvoiceModal;
