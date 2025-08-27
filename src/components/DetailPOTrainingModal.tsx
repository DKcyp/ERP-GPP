import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { POTrainingDetailData } from '../types';

interface DetailPOTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  poTrainingData: POTrainingDetailData | null;
}

const DetailPOTrainingModal: React.FC<DetailPOTrainingModalProps> = ({ isOpen, onClose, poTrainingData }) => {
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

  if (!isOpen || !poTrainingData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Detail PO Training</h2>
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
                {poTrainingData.noSO}
              </p>
            </div>

            {/* SO Turunan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SO Turunan</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {poTrainingData.soTurunan}
              </p>
            </div>

            {/* No Training */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Training</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {poTrainingData.noTraining}
              </p>
            </div>

            {/* Jenis Training */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Training</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {poTrainingData.jenisTraining}
              </p>
            </div>

            {/* Tanggal Pelatihan Start */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pelatihan Mulai</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {poTrainingData.tanggalPelatihanStart}
              </p>
            </div>

            {/* Tanggal Pelatihan End */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pelatihan Selesai</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {poTrainingData.tanggalPelatihanEnd}
              </p>
            </div>

            {/* Vendor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {poTrainingData.vendor}
              </p>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {formatCurrency(poTrainingData.budget)}
              </p>
            </div>

            {/* Approver */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Approver</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {poTrainingData.approver}
              </p>
            </div>

            {/* Keterangan */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {poTrainingData.keterangan}
              </p>
            </div>
          </div>

          {/* Peserta Training Table */}
          <div className="p-6 pt-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daftar Peserta Training</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kualifikasi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {poTrainingData.peserta.map((item) => (
                    <tr key={item.no} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.no}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.namaPegawai}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nip}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.departemen}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.kualifikasi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default DetailPOTrainingModal;
