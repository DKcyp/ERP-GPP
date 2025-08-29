import React from 'react';
import Modal from './Modal';
import { POJasaData as POJasaDataType } from '../types';

interface DetailPOJasaModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: POJasaDataType | null;
}

const DetailPOJasaModal: React.FC<DetailPOJasaModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null; // Don't render if no data

  // Helper function for Rupiah formatting
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail PO Jasa" size="4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No PR</label>
          <p className="p-2 bg-gray-100 rounded-md text-gray-800">{data.noPr}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Periode PR</label>
          <p className="p-2 bg-gray-100 rounded-md text-gray-800">{data.periodePr}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
          <p className="p-2 bg-gray-100 rounded-md text-gray-800">{data.divisi}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kode Supplier</label>
          <p className="p-2 bg-gray-100 rounded-md text-gray-800">{data.kodeSupplier}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Supplier</label>
          <p className="p-2 bg-gray-100 rounded-md text-gray-800">{data.namaSupplier}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No PO</label>
          <p className="p-2 bg-gray-100 rounded-md text-gray-800">{data.noPo}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal PO</label>
          <p className="p-2 bg-gray-100 rounded-md text-gray-800">{data.tanggalPo}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengiriman</label>
          <p className="p-2 bg-gray-100 rounded-md text-gray-800">{data.tanggalPengiriman}</p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <p className={`p-2 rounded-md text-gray-800 ${
            data.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {data.status}
          </p>
        </div>
      </div>

      <h4 className="text-lg font-semibold text-gray-800 mb-3">Detail Jasa</h4>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Jasa</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Jasa</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Satuan</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disc (%)</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.namaJasa}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.kodeJasa}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.qty}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.satuan}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatRupiah(item.hargaSatuan)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.disc}%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatRupiah(item.jumlah)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default DetailPOJasaModal;
