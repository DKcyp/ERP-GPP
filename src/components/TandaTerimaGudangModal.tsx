import React, { useState } from 'react';
import Modal from './Modal';
import { TandaTerimaGudangDetailData } from '../types';
import { Calendar, Download } from 'lucide-react';

interface TandaTerimaGudangModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TandaTerimaGudangDetailData | null;
}

const TandaTerimaGudangModal: React.FC<TandaTerimaGudangModalProps> = ({ isOpen, onClose, data }) => {
  const [tanggalVerifikasi, setTanggalVerifikasi] = useState(data?.tanggalVerifikasi || '');
  const [namaVerifikasi, setNamaVerifikasi] = useState(data?.namaVerifikasi || '');

  React.useEffect(() => {
    if (data) {
      setTanggalVerifikasi(data.tanggalVerifikasi);
      setNamaVerifikasi(data.namaVerifikasi);
    }
  }, [data]);

  if (!data) return null;

  const handleVerifikasi = () => {
    // Implement verification logic here
    console.log('Verifikasi data:', {
      ...data,
      tanggalVerifikasi,
      namaVerifikasi,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tanda Terima Gudang" size="4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
        {/* Left Column */}
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-textSecondary mb-1">No PO</label>
            <input
              type="text"
              value={data.noPO}
              readOnly
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-textSecondary mb-1">No Faktur</label>
            <input
              type="text"
              value={data.noFaktur}
              readOnly
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-textSecondary mb-1">Tanggal Faktur</label>
            <input
              type="text"
              value={data.tglFaktur}
              readOnly
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">Penerima</label>
            <input
              type="text"
              value={data.penerima}
              readOnly
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-4">
            <label htmlFor="tanggalVerifikasi" className="block text-sm font-medium text-textSecondary mb-1">Tanggal Verifikasi</label>
            <div className="relative">
              <input
                type="date"
                id="tanggalVerifikasi"
                value={tanggalVerifikasi}
                onChange={(e) => setTanggalVerifikasi(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textSecondary pointer-events-none" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="namaVerifikasi" className="block text-sm font-medium text-textSecondary mb-1">Nama Verifikasi</label>
            <input
              type="text"
              id="namaVerifikasi"
              value={namaVerifikasi}
              onChange={(e) => setNamaVerifikasi(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Nama Verifikator"
            />
          </div>
          <div>
            <label htmlFor="unduhDokumen" className="block text-sm font-medium text-textSecondary mb-1">Unduh Dokumen</label>
            <div className="relative">
              <input
                type="text"
                id="unduhDokumen"
                value={data.unduhDokumen}
                readOnly
                className="w-full px-4 py-2 pr-10 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <a
                href={`/documents/${data.unduhDokumen}`} // Replace with actual download URL
                download
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary hover:text-primary cursor-pointer transition-colors"
                title="Unduh Dokumen"
              >
                <Download />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto rounded-lg border border-border shadow-sm mb-6">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Kode Barang</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Nama Barang</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Jumlah</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Diterima</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Satuan</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Satuan</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Gross</th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {data.items.map((item, index) => (
              <tr key={index} className="hover:bg-surface transition-colors duration-150">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-text">{item.kodeBarang}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-text">{item.namaBarang}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-text">{item.jumlah}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-text">{item.diterima}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-text">{item.satuan}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-text">{item.hargaSatuan.toLocaleString('id-ID')}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-text">{item.hargaGross.toLocaleString('id-ID')}</td>
              </tr>
            ))}
            <tr className="bg-surface font-semibold">
              <td colSpan={6} className="px-4 py-2 text-right text-sm text-text">Grand Total</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-text">{data.grandTotal.toLocaleString('id-ID')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-border">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-textSecondary text-white font-medium rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300"
        >
          Close
        </button>
        <button
          onClick={handleVerifikasi}
          className="px-6 py-2 bg-success text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
        >
          Verifikasi
        </button>
      </div>
    </Modal>
  );
};

export default TandaTerimaGudangModal;
