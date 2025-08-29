import React from 'react';
import Modal from './Modal'; // Assuming a generic Modal component exists
import { X } from 'lucide-react';

export interface HPPIndukDetailData {
  id: string; // No HPP
  pic: string;
  jenisPekerjaan: string;
  lokasi: string;
  estimasiHPP: string;
  statusDokumen: 'Open' | 'Close';
  tanggalUpdate: string;
}

interface HPPIndukDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  hppData: HPPIndukDetailData | null;
}

const HPPIndukDetailModal: React.FC<HPPIndukDetailModalProps> = ({ isOpen, onClose, hppData }) => {
  if (!hppData) return null;

  const getStatusDokumenColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800 border-green-200';
      case 'Close': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail HPP Induk">
      <div className="space-y-4 text-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">No HPP</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{hppData.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">PIC</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{hppData.pic}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Jenis Pekerjaan</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{hppData.jenisPekerjaan}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Lokasi</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{hppData.lokasi}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Estimasi HPP</label>
          <p className="mt-1 text-lg font-semibold text-gray-900">{hppData.estimasiHPP}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Status Dokumen</label>
            <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusDokumenColor(hppData.statusDokumen)}`}>
              {hppData.statusDokumen}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Tanggal Update</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{hppData.tanggalUpdate}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center space-x-2 px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
        >
          <X className="h-4 w-4" />
          <span>Tutup</span>
        </button>
      </div>
    </Modal>
  );
};

export default HPPIndukDetailModal;
