import React, { useState } from 'react';
import { Search, Plus, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PenerimaanBarangManualData, PenerimaanBarangManualFormData } from '../types';
import PenerimaanBarangManualModal from './PenerimaanBarangManualModal';
import PenerimaanBarangManualDetailModal from './PenerimaanBarangManualDetailModal';

const PenerimaanBarangManualDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PenerimaanBarangManualData | null>(null);
  const [penerimaanData, setPenerimaanData] = useState<PenerimaanBarangManualData[]>([
    {
      id: '1', no: 1, tanggalPenerimaan: '2025-01-15', noPO: 'PO-2025-001',
      namaBarang: 'Semen Portland', kodeBarang: 'SMN-001', qty: 50, satuan: 'Sak',
      kondisiBarang: 'Expired', alasanManual: 'Barang expired tapi masih layak pakai',
      statusPersetujuan: 'Pending'
    },
    {
      id: '2', no: 2, tanggalPenerimaan: '2025-01-16', noPO: 'PO-2025-002',
      namaBarang: 'Cat Tembok', kodeBarang: 'CAT-002', qty: 20, satuan: 'Kaleng',
      kondisiBarang: 'Expired', tanggalExpired: '2025-01-12',
      alasanManual: 'Cat expired namun kualitas masih baik setelah dicek',
      keterangan: 'Sudah ditest dan warna masih bagus',
      statusPersetujuan: 'Disetujui', disetujuiOleh: 'Supervisor Gudang',
      tanggalPersetujuan: '2025-01-16'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const config = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'Disetujui': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Ditolak': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const { color, icon: Icon } = config[status as keyof typeof config];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const handleViewDetail = (item: PenerimaanBarangManualData) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleAddPenerimaan = (formData: PenerimaanBarangManualFormData) => {
    const newId = (penerimaanData.length + 1).toString();
    const newPenerimaan: PenerimaanBarangManualData = {
      id: newId,
      no: penerimaanData.length + 1,
      tanggalPenerimaan: new Date().toISOString().split('T')[0],
      noPO: formData.noPO,
      namaBarang: formData.namaBarang,
      kodeBarang: formData.kodeBarang,
      qty: parseInt(formData.qty),
      satuan: formData.satuan,
      kondisiBarang: formData.kondisiBarang,
      tanggalExpired: formData.tanggalExpired,
      alasanManual: formData.alasanManual,
      keterangan: formData.keterangan,
      statusPersetujuan: 'Pending'
    };
    setPenerimaanData(prev => [...prev, newPenerimaan]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PENERIMAAN BARANG MANUAL</h1>
          <nav className="text-sm text-gray-600">
            Gudang › <span className="text-blue-600 font-semibold">Penerimaan Barang Manual</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Cari barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Tambah
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Daftar Penerimaan Manual</h3>
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barang</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {penerimaanData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm">{item.no}</td>
                  <td className="px-6 py-4 text-sm">{item.noPO}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium">{item.namaBarang}</div>
                    <div className="text-gray-500">{item.kodeBarang}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{item.qty} {item.satuan}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.statusPersetujuan)}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleViewDetail(item)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <PenerimaanBarangManualModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPenerimaan}
      />

      {/* Detail Modal */}
      <PenerimaanBarangManualDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedItem}
      />
    </div>
  );
};

export default PenerimaanBarangManualDashboard;
