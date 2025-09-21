import React, { useState } from 'react';
import { Search, Plus, FileText, Clock, Edit, Trash2, Eye, CheckCircle2 } from 'lucide-react';

interface BAExpiredItem {
  id: string;
  nomorBA: string;
  tanggalBA: string;
  kodeBarang: string;
  namaBarang: string;
  jumlahExpired: number;
  alasanExpired: string;
  tindakan: string;
  penanggungJawab: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  createdBy: string;
  approvedBy?: string;
  approvedDate?: string;
  catatan?: string;
}

const seedData = (): BAExpiredItem[] => [
  {
    id: '1',
    nomorBA: 'BA-EXP-001/2024',
    tanggalBA: '2024-12-21',
    kodeBarang: 'BRG-001',
    namaBarang: 'Sarung Tangan Safety',
    jumlahExpired: 50,
    alasanExpired: 'Melewati tanggal kadaluarsa',
    tindakan: 'Pemusnahan sesuai prosedur',
    penanggungJawab: 'Tim QHSE',
    status: 'Submitted',
    createdBy: 'QHSE Officer'
  },
  {
    id: '2',
    nomorBA: 'BA-EXP-002/2024',
    tanggalBA: '2024-12-20',
    kodeBarang: 'BRG-002',
    namaBarang: 'Masker N95',
    jumlahExpired: 200,
    alasanExpired: 'Kualitas menurun, tidak layak pakai',
    tindakan: 'Pemusnahan dan penggantian stok',
    penanggungJawab: 'Supervisor Gudang',
    status: 'Approved',
    createdBy: 'QHSE Officer',
    approvedBy: 'Manager QHSE',
    approvedDate: '2024-12-21'
  }
];

const QHSEExpiredBarangBADashboard: React.FC = () => {
  const [data, setData] = useState<BAExpiredItem[]>(seedData());
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedItem, setSelectedItem] = useState<BAExpiredItem | null>(null);

  const getStatusBadge = (status: string) => {
    const baseClass = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'Approved': return `${baseClass} bg-green-100 text-green-800`;
      case 'Submitted': return `${baseClass} bg-blue-100 text-blue-800`;
      case 'Rejected': return `${baseClass} bg-red-100 text-red-800`;
      default: return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const handleTambah = () => {
    setModalMode('create');
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: BAExpiredItem) => {
    setModalMode('edit');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleView = (item: BAExpiredItem) => {
    setModalMode('view');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleApprove = (item: BAExpiredItem) => {
    setData(prev => prev.map(ba => 
      ba.id === item.id 
        ? { ...ba, status: 'Approved', approvedBy: 'Manager QHSE', approvedDate: new Date().toISOString().split('T')[0] }
        : ba
    ));
  };

  const handleReject = (item: BAExpiredItem) => {
    setData(prev => prev.map(ba => 
      ba.id === item.id 
        ? { ...ba, status: 'Rejected' }
        : ba
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">BA EXPIRED BARANG</h1>
          <nav className="text-sm text-gray-600">
            <span>QHSE</span> › <span>Expired Barang</span> › <span className="text-blue-600">BA Expired</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Search & Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Cari nomor BA, barang..."
              />
            </div>
            <button 
              onClick={handleTambah}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Buat BA Baru
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Nomor BA</th>
                <th className="px-4 py-3 text-left">Tanggal</th>
                <th className="px-4 py-3 text-left">Barang</th>
                <th className="px-4 py-3 text-center">Jumlah</th>
                <th className="px-4 py-3 text-left">Tindakan</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.nomorBA}</td>
                  <td className="px-4 py-3">{new Date(item.tanggalBA).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{item.namaBarang}</div>
                      <div className="text-gray-500 text-xs">{item.kodeBarang}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{item.jumlahExpired}</td>
                  <td className="px-4 py-3 max-w-48 truncate" title={item.tindakan}>
                    {item.tindakan}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={getStatusBadge(item.status)}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button 
                        onClick={() => handleView(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {item.status === 'Draft' && (
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {item.status === 'Submitted' && (
                        <>
                          <button 
                            onClick={() => handleApprove(item)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(item)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              {modalMode === 'create' ? 'Buat BA Baru' : modalMode === 'edit' ? 'Edit BA' : 'Detail BA'}
            </h3>
            <p className="text-gray-600 mb-4">Modal form akan diimplementasi di sini</p>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEExpiredBarangBADashboard;
