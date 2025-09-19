import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface RFIData {
  id: string;
  no: number;
  noInvoice: string;
  noPO: string;
  namaSupplier: string;
  statusApproval: 'Pending' | 'Approved' | 'Rejected';
}

const QHSEApprovalRFIDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const rfiData: RFIData[] = [
    { id: '1', no: 1, noInvoice: 'INV-001', noPO: 'PO001', namaSupplier: 'Supplier A', statusApproval: 'Pending' },
    { id: '2', no: 2, noInvoice: 'INV-002', noPO: 'PO002', namaSupplier: 'Supplier B', statusApproval: 'Approved' }
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'Approved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Rejected': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const { color, icon: Icon } = config[status as keyof typeof config];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">APPROVAL RFI</h1>
          <nav className="text-sm text-gray-600">
            QHSE › <span className="text-blue-600 font-semibold">Approval RFI</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Cari RFI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Daftar RFI untuk Approval</h3>
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rfiData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm">{item.no}</td>
                  <td className="px-6 py-4 text-sm">{item.noInvoice}</td>
                  <td className="px-6 py-4 text-sm">{item.noPO}</td>
                  <td className="px-6 py-4 text-sm">{item.namaSupplier}</td>
                  <td className="px-6 py-4">{getStatusBadge(item.statusApproval)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      {item.statusApproval === 'Pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
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
    </div>
  );
};

export default QHSEApprovalRFIDashboard;
