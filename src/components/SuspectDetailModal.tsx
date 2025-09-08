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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-base font-semibold text-gray-900">Detail Suspect</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)] p-4 text-sm">
          {suspectData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Nama Perusahaan</p>
                  <p className="text-gray-900 font-medium">{suspectData.namaPerusahaan}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bidang Usaha</p>
                  <p className="text-gray-900 font-medium">{suspectData.bidangUsaha}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">No. Telp</p>
                  <p className="text-gray-900 font-medium">{suspectData.noTelp}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">PIC</p>
                  <p className="text-gray-900 font-medium">{suspectData.pic}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Alamat Perusahaan</p>
                  <p className="text-gray-900 font-medium">{suspectData.alamatPerusahaan}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Email PIC</p>
                  <p className="text-blue-600 font-medium">
                    <a href={`mailto:${suspectData.emailPIC}`} className="hover:underline">{suspectData.emailPIC}</a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspectDetailModal;
