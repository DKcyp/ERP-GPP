import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';

type Status = 'Pending' | 'Approved' | 'Rejected';

interface POItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  qty: number;
  unit: string;
  harga: number;
}

interface PORecord {
  id: string; // kodePO
  kodePO: string;
  tanggal: string; // yyyy-MM-dd
  supplier: string;
  project: string;
  status: Status;
  items: POItem[];
}

const ProconPOApproval: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<PORecord | null>(null);

  const [data, setData] = useState<PORecord[]>([
    {
      id: 'PO-20250719-001',
      kodePO: 'PO-20250719-001',
      tanggal: '2025-07-19',
      supplier: 'PT Sumber Makmur',
      project: 'Proyek A',
      status: 'Pending',
      items: [ { id: 'it-1', kodeBarang: 'BRG-001', namaBarang: 'Kabel UTP Cat6', qty: 100, unit: 'meter', harga: 12000 } ]
    },
    {
      id: 'PO-20250718-002',
      kodePO: 'PO-20250718-002',
      tanggal: '2025-07-18',
      supplier: 'CV Maju Jaya',
      project: 'Proyek B',
      status: 'Approved',
      items: [ { id: 'it-2', kodeBarang: 'BRG-010', namaBarang: 'Switch 24 Port', qty: 2, unit: 'unit', harga: 1500000 } ]
    },
  ]);

  const filtered = useMemo(() => {
    return data.filter(r => {
      const matchesSearch = r.kodePO.toLowerCase().includes(searchTerm.toLowerCase())
        || r.supplier.toLowerCase().includes(searchTerm.toLowerCase())
        || r.project.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || r.status.toLowerCase() === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, filterStatus]);

  const badgeClass = (status: Status) => (
    status === 'Approved' ? 'bg-green-100 text-green-800' :
    status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800'
  );

  const approve = (id: string) => setData(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  const reject = (id: string) => setData(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
  const openDetail = (rec: PORecord) => { setSelected(rec); setDetailOpen(true); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">Approval Purchase Order</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Procon</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Purchase Order</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">Approval</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters only (no add) */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Cari PO..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-xl shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode PO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length > 0 ? (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.kodePO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.tanggal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.supplier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.project}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        r.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        r.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-50 text-xs" onClick={() => openDetail(r)} title="Detail">
                          <Eye className="h-4 w-4" /> Detail
                        </button>
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-xs" onClick={() => approve(r.id)} disabled={r.status === 'Approved'} title="Approve">
                          <CheckCircle2 className="h-4 w-4" /> Approve
                        </button>
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs" onClick={() => reject(r.id)} disabled={r.status === 'Rejected'} title="Reject">
                          <XCircle className="h-4 w-4" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        {detailOpen && selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Detail PO - {selected.kodePO}</h3>
                <button onClick={() => setDetailOpen(false)} className="px-3 py-1.5 rounded-lg border">Tutup</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-gray-500">Tanggal</div>
                  <div className="font-medium text-gray-900">{selected.tanggal}</div>
                </div>
                <div>
                  <div className="text-gray-500">Supplier</div>
                  <div className="font-medium text-gray-900">{selected.supplier}</div>
                </div>
                <div>
                  <div className="text-gray-500">Project</div>
                  <div className="font-medium text-gray-900">{selected.project}</div>
                </div>
                <div>
                  <div className="text-gray-500">Status</div>
                  <div className="font-medium"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass(selected.status)}`}>{selected.status}</span></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 text-sm font-semibold text-gray-700">Detail Barang</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead className="bg-white border-t border-b">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Kode Barang</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Nama Barang</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Qty</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Satuan</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Harga</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selected.items.map(it => (
                        <tr key={it.id}>
                          <td className="px-3 py-2">{it.kodeBarang}</td>
                          <td className="px-3 py-2">{it.namaBarang}</td>
                          <td className="px-3 py-2">{it.qty}</td>
                          <td className="px-3 py-2">{it.unit}</td>
                          <td className="px-3 py-2">{it.harga.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                      {selected.items.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-3 py-6 text-center text-gray-500">Tidak ada item</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProconPOApproval;
