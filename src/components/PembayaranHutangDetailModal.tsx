import React from 'react';
import { X } from 'lucide-react';

// Assuming PembayaranRow will be imported from the main component or a types file
// and will contain the detailed payment info.
interface PembayaranRow {
  id: number;
  vendor: string;
  noPo: string;
  subTotal: number;
  detailPembayaran?: {
    tanggal: string;
    nominal: number;
  }[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PembayaranRow | null;
}

const PembayaranHutangDetailModal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 transform transition-all duration-300">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Detail Pembayaran Hutang</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="text-sm text-gray-700 space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <p><strong>Nama Supplier:</strong></p><p>{data.vendor}</p>
            <p><strong>No. PO:</strong></p><p>{data.noPo}</p>
            <p><strong>Total Tagihan:</strong></p><p>{formatCurrency(data.subTotal)}</p>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Rincian Pembayaran:</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Termin</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Bayar</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Nominal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.detailPembayaran?.map((p, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">Pembayaran ke-{index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.tanggal ? new Date(p.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">{formatCurrency(p.nominal)}</td>
                  </tr>
                ))}
                 {(!data.detailPembayaran || data.detailPembayaran.length === 0) && (
                    <tr>
                        <td colSpan={3} className="text-center py-4 text-gray-500">Belum ada data pembayaran.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembayaranHutangDetailModal;
