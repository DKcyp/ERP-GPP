import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { PenggajianDetailData } from '../types';

interface DetailPenggajianModalProps {
  isOpen: boolean;
  onClose: () => void;
  penggajianData: PenggajianDetailData | null;
}

const DetailPenggajianModal: React.FC<DetailPenggajianModalProps> = ({ isOpen, onClose, penggajianData }) => {
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

  if (!isOpen || !penggajianData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Detail Penggajian</h2>
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
            {/* No Penggajian */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Penggajian</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {penggajianData.noPenggajian}
              </p>
            </div>

            {/* Periode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {penggajianData.periode}
              </p>
            </div>

            {/* No Pegawai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Pegawai</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {penggajianData.noPegawai}
              </p>
            </div>

            {/* Nama Pegawai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pegawai</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {penggajianData.namaPegawai}
              </p>
            </div>

            {/* NIP Pegawai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NIP Pegawai</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {penggajianData.nipPegawai}
              </p>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {penggajianData.keterangan}
              </p>
            </div>

            {/* Bonus Kinerja */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bonus Kinerja</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {penggajianData.bonusKinerja}
              </p>
            </div>
          </div>

          {/* Payroll Items Table */}
          <div className="p-6 pt-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Komponen Gaji</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Penggajian</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gaji Pokok</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potongan PPH21</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potongan BPJS</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potongan Mess</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uang Tunjangan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Gaji</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {penggajianData.items.map((item) => (
                    <tr key={item.no} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.no}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tanggalPenggajian}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(item.gajiPokok)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(item.potonganPPH21)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(item.potonganBPJS)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(item.potonganMess)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(item.uangTunjangan)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{formatCurrency(item.totalGaji)}</td>
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

export default DetailPenggajianModal;
