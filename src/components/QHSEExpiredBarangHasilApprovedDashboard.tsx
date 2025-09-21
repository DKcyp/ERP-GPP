import React, { useState } from 'react';
import { Eye, Download } from 'lucide-react';

interface HasilBAApproved {
  id: string;
  nomorBA: string;
  namaBarang: string;
  statusTindakan: 'Belum Dilaksanakan' | 'Sedang Proses' | 'Selesai';
  approvedBy: string;
  approvedDate: string;
}

const seedData = (): HasilBAApproved[] => [
  {
    id: '1',
    nomorBA: 'BA-EXP-002/2024',
    namaBarang: 'Masker N95',
    statusTindakan: 'Selesai',
    approvedBy: 'Manager QHSE',
    approvedDate: '2024-12-21'
  },
  {
    id: '2',
    nomorBA: 'BA-EXP-001/2024',
    namaBarang: 'Sarung Tangan Safety',
    statusTindakan: 'Sedang Proses',
    approvedBy: 'Manager QHSE',
    approvedDate: '2024-12-22'
  }
];

const QHSEExpiredBarangHasilApprovedDashboard: React.FC = () => {
  const [data] = useState<HasilBAApproved[]>(seedData());
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: string) => {
    const baseClass = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'Selesai': return `${baseClass} bg-green-100 text-green-800`;
      case 'Sedang Proses': return `${baseClass} bg-blue-100 text-blue-800`;
      default: return `${baseClass} bg-yellow-100 text-yellow-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="bg-gradient-to-r from-purple-100 via-purple-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">HASIL BA APPROVED</h1>
          <nav className="text-sm text-gray-600">
            <span>QHSE</span> › <span>Expired Barang</span> › <span className="text-purple-600">Hasil Approved</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Cari BA..."
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Nomor BA</th>
                <th className="px-4 py-3 text-left">Barang</th>
                <th className="px-4 py-3 text-left">Approved By</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">{item.nomorBA}</td>
                  <td className="px-4 py-3">{item.namaBarang}</td>
                  <td className="px-4 py-3">{item.approvedBy}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={getStatusBadge(item.statusTindakan)}>{item.statusTindakan}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QHSEExpiredBarangHasilApprovedDashboard;
