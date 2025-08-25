import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ManPowerDetailData } from '../types';

interface ManPowerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  manPowerData: ManPowerDetailData | null;
}

const ManPowerDetailModal: React.FC<ManPowerDetailModalProps> = ({ isOpen, onClose, manPowerData }) => {
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

  if (!isOpen || !manPowerData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Detail MP</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SO Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SO Number
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                  {manPowerData.soNumber}
                </div>
              </div>

              {/* Nama Proyek */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Proyek
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                  {manPowerData.namaProyek}
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                  {manPowerData.lokasi}
                </div>
              </div>

              {/* Kualifikasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kualifikasi
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 min-h-[48px] flex items-center">
                  <div className="flex flex-wrap gap-2">
                    {manPowerData.kualifikasi.map((kual, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {kual}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimasi Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimasi Rate
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 font-medium">
                  {manPowerData.estimasiRate}
                </div>
              </div>

              {/* MOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MOB
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                  {manPowerData.mob}
                </div>
              </div>

              {/* DEMOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DEMOB
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                  {manPowerData.demob}
                </div>
              </div>

              {/* Total (Orang) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total (Orang)
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 font-medium">
                  {manPowerData.totalOrang}
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Tambahan
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 min-h-[120px]">
                  {manPowerData.catatanTambahan || 'Tidak ada catatan tambahan'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
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

export default ManPowerDetailModal;
