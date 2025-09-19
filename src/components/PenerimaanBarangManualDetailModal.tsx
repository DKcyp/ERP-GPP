import React from 'react';
import { X, Package, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { PenerimaanBarangManualData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: PenerimaanBarangManualData | null;
}

const PenerimaanBarangManualDetailModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const getStatusBadge = (status: string) => {
    const config = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'Disetujui': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Ditolak': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const { color, icon: Icon } = config[status as keyof typeof config];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-medium">Detail Penerimaan Manual</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">No PO</label>
                <p className="mt-1 text-sm text-gray-900">{data.noPO}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(data.tanggalPenerimaan).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">{data.namaBarang}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kode Barang</label>
                <p className="mt-1 text-sm text-gray-900">{data.kodeBarang}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <p className="mt-1 text-sm text-gray-900">{data.qty} {data.satuan}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kondisi</label>
                <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs ${
                  data.kondisiBarang === 'Expired' ? 'bg-orange-100 text-orange-800' : 
                  data.kondisiBarang === 'Rusak' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {data.kondisiBarang}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(data.statusPersetujuan)}</div>
              </div>
            </div>

            {data.tanggalExpired && (
              <div className="bg-orange-50 p-3 rounded-lg">
                <label className="block text-sm font-medium text-orange-800">Tanggal Expired</label>
                <p className="text-sm text-orange-900">{new Date(data.tanggalExpired).toLocaleDateString('id-ID')}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Alasan Manual</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-900">{data.alasanManual}</p>
              </div>
            </div>

            {data.keterangan && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">{data.keterangan}</p>
                </div>
              </div>
            )}

            {data.statusPersetujuan === 'Disetujui' && data.disetujuiOleh && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-800">Disetujui Oleh</label>
                    <p className="text-sm text-green-900">{data.disetujuiOleh}</p>
                  </div>
                  {data.tanggalPersetujuan && (
                    <div>
                      <label className="block text-sm font-medium text-green-800">Tanggal Persetujuan</label>
                      <p className="text-sm text-green-900">{new Date(data.tanggalPersetujuan).toLocaleDateString('id-ID')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenerimaanBarangManualDetailModal;
