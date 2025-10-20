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

  const emptyForm = {
    nomorBA: '',
    tanggalBA: '',
    kodeBarang: '',
    namaBarang: '',
    jumlahExpired: 0,
    alasanExpired: '',
    tindakan: '',
    penanggungJawab: ''
  };
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

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
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const handleEdit = (item: BAExpiredItem) => {
    setModalMode('edit');
    setSelectedItem(item);
    setForm({
      nomorBA: item.nomorBA,
      tanggalBA: item.tanggalBA,
      kodeBarang: item.kodeBarang,
      namaBarang: item.namaBarang,
      jumlahExpired: item.jumlahExpired,
      alasanExpired: item.alasanExpired || '',
      tindakan: item.tindakan,
      penanggungJawab: item.penanggungJawab,
    });
    setIsModalOpen(true);
  };

  const handleView = (item: BAExpiredItem) => {
    setModalMode('view');
    setSelectedItem(item);
    setForm({
      nomorBA: item.nomorBA,
      tanggalBA: item.tanggalBA,
      kodeBarang: item.kodeBarang,
      namaBarang: item.namaBarang,
      jumlahExpired: item.jumlahExpired,
      alasanExpired: item.alasanExpired || '',
      tindakan: item.tindakan,
      penanggungJawab: item.penanggungJawab,
    });
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold">
                {modalMode === 'create' ? 'Buat BA Baru' : modalMode === 'edit' ? 'Edit BA' : 'Detail BA'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor BA</label>
                  <input
                    type="text"
                    value={form.nomorBA}
                    onChange={(e) => setForm(f => ({ ...f, nomorBA: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="BA-EXP-001/2025"
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal BA</label>
                  <input
                    type="date"
                    value={form.tanggalBA}
                    onChange={(e) => setForm(f => ({ ...f, tanggalBA: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Barang</label>
                  <input
                    type="text"
                    value={form.kodeBarang}
                    onChange={(e) => setForm(f => ({ ...f, kodeBarang: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="BRG-001"
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                  <input
                    type="text"
                    value={form.namaBarang}
                    onChange={(e) => setForm(f => ({ ...f, namaBarang: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Nama Barang"
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Expired</label>
                  <input
                    type="number"
                    value={form.jumlahExpired}
                    onChange={(e) => setForm(f => ({ ...f, jumlahExpired: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    min={0}
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={form.penanggungJawab}
                    onChange={(e) => setForm(f => ({ ...f, penanggungJawab: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Tim QHSE / Nama PIC"
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tindakan</label>
                  <input
                    type="text"
                    value={form.tindakan}
                    onChange={(e) => setForm(f => ({ ...f, tindakan: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Pemusnahan / Pengembalian / Lainnya"
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Expired</label>
                  <textarea
                    value={form.alasanExpired}
                    onChange={(e) => setForm(f => ({ ...f, alasanExpired: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Melewati tanggal kadaluarsa / Kualitas menurun / dll"
                    disabled={modalMode === 'view'}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
              {modalMode !== 'view' && (
                <>
                  <button
                    onClick={() => {
                      if (!form.nomorBA || !form.tanggalBA || !form.kodeBarang || !form.namaBarang || !form.tindakan) return;
                      if (modalMode === 'create') {
                        const newItem: BAExpiredItem = {
                          id: Date.now().toString(),
                          nomorBA: form.nomorBA,
                          tanggalBA: form.tanggalBA,
                          kodeBarang: form.kodeBarang,
                          namaBarang: form.namaBarang,
                          jumlahExpired: form.jumlahExpired,
                          alasanExpired: form.alasanExpired,
                          tindakan: form.tindakan,
                          penanggungJawab: form.penanggungJawab || 'Tim QHSE',
                          status: 'Draft',
                          createdBy: 'QHSE Officer'
                        };
                        setData(prev => [newItem, ...prev]);
                      } else if (modalMode === 'edit' && selectedItem) {
                        setData(prev => prev.map(ba => ba.id === selectedItem.id ? {
                          ...ba,
                          nomorBA: form.nomorBA,
                          tanggalBA: form.tanggalBA,
                          kodeBarang: form.kodeBarang,
                          namaBarang: form.namaBarang,
                          jumlahExpired: form.jumlahExpired,
                          alasanExpired: form.alasanExpired,
                          tindakan: form.tindakan,
                          penanggungJawab: form.penanggungJawab,
                        } : ba));
                      }
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </>
              )}
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEExpiredBarangBADashboard;
