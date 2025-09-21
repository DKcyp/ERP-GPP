import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Eye, Clock, AlertTriangle } from 'lucide-react';

interface BAApprovalItem {
  id: string;
  nomorBA: string;
  tanggalBA: string;
  namaBarang: string;
  jumlahExpired: number;
  tindakan: string;
  penanggungJawab: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  submittedBy: string;
  submittedDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

const seedData = (): BAApprovalItem[] => [
  {
    id: '1',
    nomorBA: 'BA-EXP-001/2024',
    tanggalBA: '2024-12-21',
    namaBarang: 'Sarung Tangan Safety',
    jumlahExpired: 50,
    tindakan: 'Pemusnahan sesuai prosedur',
    penanggungJawab: 'Tim QHSE',
    status: 'Pending Approval',
    submittedBy: 'QHSE Officer',
    submittedDate: '2024-12-21',
    priority: 'High'
  },
  {
    id: '2',
    nomorBA: 'BA-EXP-003/2024',
    tanggalBA: '2024-12-22',
    namaBarang: 'Helm Safety',
    jumlahExpired: 30,
    tindakan: 'Evaluasi ulang dan pemusnahan bertahap',
    penanggungJawab: 'Supervisor Gudang',
    status: 'Pending Approval',
    submittedBy: 'QHSE Officer',
    submittedDate: '2024-12-22',
    priority: 'Medium'
  }
];

const QHSEExpiredBarangApprovalDashboard: React.FC = () => {
  const [data, setData] = useState<BAApprovalItem[]>(seedData());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<BAApprovalItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');

  const getStatusBadge = (status: string) => {
    const baseClass = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'Approved': return `${baseClass} bg-green-100 text-green-800`;
      case 'Rejected': return `${baseClass} bg-red-100 text-red-800`;
      default: return `${baseClass} bg-yellow-100 text-yellow-800`;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClass = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    switch (priority) {
      case 'High': return `${baseClass} bg-red-100 text-red-800`;
      case 'Medium': return `${baseClass} bg-orange-100 text-orange-800`;
      default: return `${baseClass} bg-green-100 text-green-800`;
    }
  };

  const handleApprove = (item: BAApprovalItem) => {
    setData(prev => prev.map(ba => 
      ba.id === item.id 
        ? { ...ba, status: 'Approved' as const }
        : ba
    ));
    alert(`BA ${item.nomorBA} telah disetujui`);
  };

  const handleReject = (item: BAApprovalItem) => {
    setData(prev => prev.map(ba => 
      ba.id === item.id 
        ? { ...ba, status: 'Rejected' as const }
        : ba
    ));
    alert(`BA ${item.nomorBA} telah ditolak`);
  };

  const handleViewDetail = (item: BAApprovalItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const pendingCount = data.filter(item => item.status === 'Pending Approval').length;
  const approvedCount = data.filter(item => item.status === 'Approved').length;
  const rejectedCount = data.filter(item => item.status === 'Rejected').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-100 via-green-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">APPROVAL BA EXPIRED</h1>
          <nav className="text-sm text-gray-600">
            <span>QHSE</span> › <span>Expired Barang</span> › <span className="text-green-600">Approval</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total BA</p>
                <p className="text-2xl font-bold text-blue-600">{data.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="Cari nomor BA, barang..."
            />
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Nomor BA</th>
                <th className="px-4 py-3 text-left">Barang</th>
                <th className="px-4 py-3 text-center">Jumlah</th>
                <th className="px-4 py-3 text-left">Submitted By</th>
                <th className="px-4 py-3 text-center">Priority</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{item.nomorBA}</div>
                      <div className="text-xs text-gray-500">{new Date(item.tanggalBA).toLocaleDateString('id-ID')}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{item.namaBarang}</td>
                  <td className="px-4 py-3 text-center">{item.jumlahExpired}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div>{item.submittedBy}</div>
                      <div className="text-xs text-gray-500">{new Date(item.submittedDate).toLocaleDateString('id-ID')}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={getPriorityBadge(item.priority)}>{item.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={getStatusBadge(item.status)}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button 
                        onClick={() => handleViewDetail(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {item.status === 'Pending Approval' && (
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
                            <XCircle className="h-4 w-4" />
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

      {/* Detail Modal */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-2/3 max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Detail BA Expired - {selectedItem.nomorBA}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.namaBarang}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jumlah Expired</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.jumlahExpired}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tindakan</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.tindakan}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Penanggung Jawab</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.penanggungJawab}</p>
              </div>
            </div>

            {selectedItem.status === 'Pending Approval' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Approval</label>
                <textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Tambahkan catatan approval..."
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              {selectedItem.status === 'Pending Approval' && (
                <>
                  <button 
                    onClick={() => {
                      handleApprove(selectedItem);
                      setIsDetailModalOpen(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => {
                      handleReject(selectedItem);
                      setIsDetailModalOpen(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEExpiredBarangApprovalDashboard;
