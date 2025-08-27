import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ApprovalVoucherDetailData } from '../types';

interface DetailApprovalVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherData: ApprovalVoucherDetailData | null;
}

const DetailApprovalVoucherModal: React.FC<DetailApprovalVoucherModalProps> = ({ isOpen, onClose, voucherData }) => {
  const [activeTab, setActiveTab] = useState<'tiket' | 'hotel' | 'travel'>('tiket');

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

  if (!isOpen || !voucherData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Approval Voucher</h2>
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
            {/* No Voucher */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Voucher</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {voucherData.noVoucher}
              </p>
            </div>

            {/* Tanggal Pengajuan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pengajuan</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {voucherData.tanggalPengajuan}
              </p>
            </div>

            {/* No SO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No SO</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {voucherData.noSO}
              </p>
            </div>

            {/* Jumlah Nominal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Nominal</label>
              <p className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900">
                {formatCurrency(voucherData.jumlahNominal)}
              </p>
            </div>
          </div>

          {/* Data Pegawai Table */}
          <div className="p-6 pt-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Pegawai</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Pegawai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {voucherData.dataPegawai.map((item) => (
                    <tr key={item.no} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.no}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.kodePegawai}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.namaPegawai}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.departemen}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabs for Pemesanan */}
          <div className="p-6 pt-0">
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('tiket')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'tiket'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tiket
                </button>
                <button
                  onClick={() => setActiveTab('hotel')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'hotel'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Hotel
                </button>
                <button
                  onClick={() => setActiveTab('travel')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'travel'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Travel
                </button>
              </nav>
            </div>

            {activeTab === 'tiket' && voucherData.pemesananTiketPesawat && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">PEMESANAN TIKET PESAWAT</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Keberangkatan */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Keberangkatan</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {voucherData.pemesananTiketPesawat.keberangkatan.tanggal}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tujuan</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {voucherData.pemesananTiketPesawat.keberangkatan.tujuan}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Jam</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {voucherData.pemesananTiketPesawat.keberangkatan.jam}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Maskapai</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {voucherData.pemesananTiketPesawat.keberangkatan.maskapai}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Harga</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {formatCurrency(voucherData.pemesananTiketPesawat.keberangkatan.harga)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Jenis Tiket</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {voucherData.pemesananTiketPesawat.keberangkatan.jenisTiket}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kepulangan */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Kepulangan</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {voucherData.pemesananTiketPesawat.kepulangan.tanggal}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tujuan</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {voucherData.pemesananTiketPesawat.kepulangan.tujuan}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Jam</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {voucherData.pemesananTiketPesawat.kepulangan.jam}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Maskapai</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {voucherData.pemesananTiketPesawat.kepulangan.maskapai}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Harga Total</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {formatCurrency(voucherData.pemesananTiketPesawat.kepulangan.hargaTotal)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Jenis Tiket</label>
                        <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {voucherData.pemesananTiketPesawat.kepulangan.jenisTiket}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center text-sm text-gray-600">
                  <p>Ditagihkan Ke {voucherData.pemesananTiketPesawat.ditagihkanKe}</p>
                  <p className="mt-2 text-gray-500 italic">Note: {voucherData.pemesananTiketPesawat.note}</p>
                </div>
              </div>
            )}

            {activeTab === 'hotel' && (
              <div className="text-gray-600 text-center py-8">
                <p>Detail Pemesanan Hotel belum tersedia.</p>
              </div>
            )}

            {activeTab === 'travel' && (
              <div className="text-gray-600 text-center py-8">
                <p>Detail Biaya Travel belum tersedia.</p>
              </div>
            )}
          </div>

          {/* Keterangan */}
          <div className="p-6 pt-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
            <textarea
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 resize-none"
              rows={4}
              readOnly
              value={voucherData.keterangan}
            ></textarea>
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
          <button
            type="button"
            className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailApprovalVoucherModal;
