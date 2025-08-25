import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SuspectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  suspectData: SuspectDetailData | null;
}

export interface SuspectDetailData {
  id: string;
  namaPerusahaan: string;
  pic: string;
  emailPIC: string;
  noTelp: string;
  alamatPerusahaan: string;
  bidangUsaha: string;
}

const SuspectDetailModal: React.FC<SuspectDetailModalProps> = ({ isOpen, onClose, suspectData }) => {
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

  if (!isOpen || !suspectData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Detail Suspect</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)]">
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Nama Perusahaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Perusahaan
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                  {suspectData.namaPerusahaan}
                </div>
              </div>

              {/* Bidang Usaha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bidang Usaha
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                  {suspectData.bidangUsaha}
                </div>
              </div>

              {/* No. Telp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telp
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                  {suspectData.noTelp}
                </div>
              </div>

              {/* PIC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIC
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                  {suspectData.pic}
                </div>
              </div>

              {/* Alamat Perusahaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Perusahaan
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 min-h-[120px] flex items-start">
                  {suspectData.alamatPerusahaan}
                </div>
              </div>

              {/* Email PIC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email PIC
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 min-h-[120px] flex items-start">
                  <a 
                    href={`mailto:${suspectData.emailPIC}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {suspectData.emailPIC}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspectDetailModal;
