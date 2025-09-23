import React from 'react';

// Definisikan tipe data untuk rincian pembayaran
interface RincianPembayaran {
  termin: string;
  tanggalBayar: string;
  nominal: number;
}

// Definisikan tipe data untuk props komponen
interface DetailPembayaranHutangModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    namaSupplier: string;
    noPO: string;
    subTotal: number;
    rincianPembayaran: RincianPembayaran[];
  } | null; // data bisa null
}

const DetailPembayaranHutangModal: React.FC<DetailPembayaranHutangModalProps> = ({ isOpen, onClose, data }) => {
  // Jangan render apapun jika modal tidak terbuka atau tidak ada data
  if (!isOpen || !data) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Detail Pembayaran Hutang</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Informasi Utama */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <span className="font-medium text-gray-600">Nama Supplier:</span>
            <span className="col-span-2 text-gray-800">{data.namaSupplier}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span className="font-medium text-gray-600">No. PO:</span>
            <span className="col-span-2 text-gray-800">{data.noPO}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span className="font-medium text-gray-600">Total Tagihan:</span>
            <span className="col-span-2 text-gray-800">Rp {data.subTotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Tabel Rincian Pembayaran */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Rincian Pembayaran:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Termin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Bayar</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.rincianPembayaran && data.rincianPembayaran.length > 0 ? (
                  data.rincianPembayaran.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.termin}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(item.tanggalBayar).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Rp {item.nominal.toLocaleString('id-ID')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Tidak ada data pembayaran.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="flex justify-end mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPembayaranHutangModal;
