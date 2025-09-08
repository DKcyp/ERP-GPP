import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { PenawaranDetailData } from '../types';

interface PenawaranDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  penawaranData: PenawaranDetailData | null;
}

const PenawaranDetailModal: React.FC<PenawaranDetailModalProps> = ({ isOpen, onClose, penawaranData }) => {
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

  if (!isOpen || !penawaranData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Detail Penawaran</h2>
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
            <div className="space-y-4">
              {/* Kategori Pajak */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Kategori Pajak</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.kategoriPajak}
                  </div>
                </div>
              </div>

              {/* No. Ref. Req */}
              {penawaranData.noRefReq && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium text-gray-700">No. Ref. Req</label>
                  <div className="lg:col-span-2">
                    <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                      {penawaranData.noRefReq}
                    </div>
                  </div>
                </div>
              )}

              {/* Kode Customer */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Kode Customer</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.kodeCustomer}
                  </div>
                </div>
              </div>

              {/* Nama Customer */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Nama Customer</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.namaCustomer}
                  </div>
                </div>
              </div>

              {/* Pajak */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Pajak</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.pajak}
                  </div>
                </div>
              </div>

              {/* No Penawaran */}
              {penawaranData.noPenawaran && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium text-gray-700">No Penawaran</label>
                  <div className="lg:col-span-2">
                    <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                      {penawaranData.noPenawaran}
                    </div>
                  </div>
                </div>
              )}

              {/* Tanggal Penawaran */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Tanggal Penawaran</label>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                      {penawaranData.tanggalPenawaran}
                    </div>
                    <div className="text-center text-sm text-gray-500">s.d</div>
                    <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                      {penawaranData.tanggalPenawaranEnd}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tanggal Kirim */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Tanggal Kirim</label>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                      {penawaranData.tanggalKirim}
                    </div>
                    <div className="text-center text-sm text-gray-500">s.d</div>
                    <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                      {penawaranData.tanggalKirimEnd}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Dok */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Status Dok</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.statusDok}
                  </div>
                </div>
              </div>

              {/* Nama Divisi */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Nama Divisi</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.namaDivisi}
                  </div>
                </div>
              </div>

              {/* Jenis Penawaran */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Jenis Penawaran</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.jenisPenawaran}
                  </div>
                </div>
              </div>

              {/* Kode Barang */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Kode Barang</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.kodeBarang}
                  </div>
                </div>
              </div>

              {/* Status SO */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Status SO</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.statusSO}
                  </div>
                </div>
              </div>

              {/* Status Penawaran */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Status Penawaran</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.statusPenawaran}
                  </div>
                </div>
              </div>

              {/* Jenis Pekerjaan */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Jenis Pekerjaan</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.jenisPekerjaan}
                  </div>
                </div>
              </div>

              {/* Status KOM */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Status KOM</label>
                <div className="lg:col-span-2">
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                    {penawaranData.statusKOM}
                  </div>
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
            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all duration-200 font-medium text-sm"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenawaranDetailModal;
