import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ManPowerPlanDetailData } from '../types';

interface ManPowerPlanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  manPowerPlanData: ManPowerPlanDetailData | null;
  onApprove?: () => void;
  onReject?: () => void;
}

const ManPowerPlanDetailModal: React.FC<ManPowerPlanDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  manPowerPlanData,
  onApprove,
  onReject 
}) => {
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

  const handleApprove = () => {
    if (onApprove) {
      onApprove();
    }
    onClose();
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
    }
    onClose();
  };

  if (!isOpen || !manPowerPlanData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Detail Man Power Plan</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="p-6 space-y-8">
            {/* Data Pemohon Section */}
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Data Pemohon</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Budi setiadi
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai Kerja</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    13/02/2024
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Software Engineer
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departemen</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    IT
                  </div>
                </div>
              </div>
            </div>

            {/* Data Pegawai Section */}
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Data Pegawai</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kode Pegawai</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    k-001
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Software Engineer
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pegawai</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    John Doe
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai Kerja</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    01/01/2025
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Senior
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Kerja</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Jakarta
                  </div>
                </div>
              </div>
            </div>

            {/* Kompensasi Section */}
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Kompensasi</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gaji</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Rp 15.000.000
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tunjangan Transport</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Rp 1.000.000
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tunjangan Jabatan</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Rp 2.000.000
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tunjangan Makan</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Rp 750.000
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tunjangan Lainnya</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Rp 500.000
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hari Kerja</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Senin - Jumat
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jam Kerja</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    08:00 - 17:00
                  </div>
                </div>
              </div>
            </div>

            {/* Deskripsi Jabatan Section */}
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Deskripsi Jabatan</h3>
              <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 min-h-[120px]">
                Merancang dan mengembangkan perangkat lunak...
              </div>
            </div>

            {/* Kualifikasi Section */}
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Kualifikasi</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usia</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    25 - 35 Tahun
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Lajang
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    Laki-laki
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pendidikan</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    S1 Teknik Informatika / Sistem Informasi
                  </div>
                </div>
              </div>
            </div>

            {/* Lampiran Dokumen Section */}
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Lampiran Dokumen</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">MCU</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-20 bg-gray-300 rounded mx-auto mb-2 flex items-center justify-center">
                        <span className="text-xs text-gray-600">PDF</span>
                      </div>
                      <p className="text-sm text-gray-600">PEMERIKSAAN GENERAL CHEK UP</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sertifikasi</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-20 bg-gray-300 rounded mx-auto mb-2 flex items-center justify-center">
                        <span className="text-xs text-gray-600">IMG</span>
                      </div>
                      <p className="text-sm text-gray-600">Certificate Document</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={handleReject}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 transition-all duration-200 font-medium text-sm"
          >
            Rejected
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium text-sm"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManPowerPlanDetailModal;
