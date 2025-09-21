import React, { useEffect, useState } from 'react';
import { Plus, Search, ChevronDown, Eye, Clock, Save, PlusCircle, MinusCircle } from 'lucide-react';

type Status = 'Pending' | 'Approved' | 'Rejected';

interface RequestItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  qty: number;
  unit: string;
  keterangan?: string;
}

interface PermintaanHeader {
  kodePermintaan: string;
  tanggalInput: string; // yyyy-MM-dd
  gudangAsal: string;
  gudangTujuan: string;
}

interface PermintaanRecord extends PermintaanHeader {
  id: string; // same as kodePermintaan
  items: RequestItem[];
  status: Status;
}

const gudangOptions = [
  { id: 'G001', name: 'Gudang Pusat' },
  { id: 'G002', name: 'Gudang Proyek A' },
  { id: 'G003', name: 'Gudang Proyek B' },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

const generateKode = (baseDate: string, seq: number) => {
  const compact = baseDate.replace(/-/g, '');
  return `PRG-${compact}-${String(seq).padStart(3, '0')}`;
};

const PermintaanBarangGudangDashboard: React.FC = () => {
  // Search & filter for list
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Saved requests (local state; can be replaced by API later)
  const [saved, setSaved] = useState<PermintaanRecord[]>([
    {
      id: 'PRG-20250719-001',
      kodePermintaan: 'PRG-20250719-001',
      tanggalInput: '2025-07-19',
      gudangAsal: 'G001',
      gudangTujuan: 'G002',
      status: 'Pending',
      items: [
        { id: 'it-1', kodeBarang: 'BRG-001', namaBarang: 'Kabel UTP Cat6', qty: 100, unit: 'meter' },
      ],
    },
    {
      id: 'PRG-20250719-002',
      kodePermintaan: 'PRG-20250719-002',
      tanggalInput: '2025-07-19',
      gudangAsal: 'G002',
      gudangTujuan: 'G003',
      status: 'Approved',
      items: [
        { id: 'it-2', kodeBarang: 'BRG-002', namaBarang: 'Besi Beton 12mm', qty: 50, unit: 'batang' },
      ],
    },
    {
      id: 'PRG-20250719-003',
      kodePermintaan: 'PRG-20250719-003',
      tanggalInput: '2025-07-19',
      gudangAsal: 'G001',
      gudangTujuan: 'G003',
      status: 'Pending',
      items: [
        { id: 'it-3', kodeBarang: 'BRG-003', namaBarang: 'Semen Portland', qty: 25, unit: 'sak' },
      ],
    },
    {
      id: 'PRG-20250719-004',
      kodePermintaan: 'PRG-20250719-004',
      tanggalInput: '2025-07-19',
      gudangAsal: 'G003',
      gudangTujuan: 'G001',
      status: 'Rejected',
      items: [
        { id: 'it-4', kodeBarang: 'BRG-004', namaBarang: 'Cat Tembok Putih', qty: 10, unit: 'kaleng' },
      ],
    },
  ]);

  // Header form state
  const [header, setHeader] = useState<PermintaanHeader>({
    kodePermintaan: '',
    tanggalInput: todayStr(),
    gudangAsal: '',
    gudangTujuan: '',
  });


  // Items input table state
  const [items, setItems] = useState<RequestItem[]>([
    { id: 'row-1', kodeBarang: '', namaBarang: '', qty: 0, unit: '' },
  ]);

  // Auto-generate kode on load and when date changes
  useEffect(() => {
    const sameDate = saved.filter(r => r.tanggalInput === header.tanggalInput).length;
    const nextSeq = sameDate + 1;
    const kode = generateKode(header.tanggalInput, nextSeq);
    setHeader(prev => ({ ...prev, kodePermintaan: kode }));
  }, [header.tanggalInput, saved]);

  const addRow = () => {
    setItems(prev => [
      ...prev,
      { id: `row-${Date.now()}`, kodeBarang: '', namaBarang: '', qty: 0, unit: '' },
    ]);
  };

  const removeRow = (id: string) => {
    setItems(prev => prev.filter(r => r.id !== id));
  };

  const updateItem = (id: string, patch: Partial<RequestItem>) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const resetForm = () => {
    setHeader({ kodePermintaan: '', tanggalInput: todayStr(), gudangAsal: '', gudangTujuan: '' });
    setItems([{ id: 'row-1', kodeBarang: '', namaBarang: '', qty: 0, unit: '' }]);
  };

  const handleSave = () => {
    if (!header.gudangAsal || !header.gudangTujuan) return;
    if (items.length === 0 || items.every(i => !i.kodeBarang || !i.namaBarang || !i.qty || !i.unit)) return;
    const record: PermintaanRecord = {
      id: header.kodePermintaan,
      kodePermintaan: header.kodePermintaan,
      tanggalInput: header.tanggalInput,
      gudangAsal: header.gudangAsal,
      gudangTujuan: header.gudangTujuan,
      status: 'Pending',
      items: items.filter(i => i.kodeBarang && i.namaBarang && i.qty && i.unit),
    };
    setSaved(prev => [record, ...prev]);
    resetForm();
    setIsModalOpen(false);
  };

  const filteredRequests = saved.filter(request => {
    const matchesSearch =
      request.kodePermintaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gudangOptions.find(g => g.id === request.gudangAsal)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gudangOptions.find(g => g.id === request.gudangTujuan)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Permintaan Barang Gudang
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Gudang</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Permintaan Barang Gudang</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Buat Permintaan Barang Gudang</h3>
                <button onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 rounded-lg border">Tutup</button>
              </div>
              {/* Header Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Input</label>
                  <input type="date" value={header.tanggalInput} onChange={(e) => setHeader({ ...header, tanggalInput: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kode Permintaan</label>
                  <input type="text" value={header.kodePermintaan} readOnly className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gudang Asal</label>
                  <select value={header.gudangAsal} onChange={(e) => setHeader({ ...header, gudangAsal: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="">Pilih Gudang Asal</option>
                    {gudangOptions.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gudang Tujuan</label>
                  <select value={header.gudangTujuan} onChange={(e) => setHeader({ ...header, gudangTujuan: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="">Pilih Gudang Tujuan</option>
                    {gudangOptions.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Items Table */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Detail Barang</span>
                  <button onClick={addRow} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-700">
                    <PlusCircle className="h-4 w-4" /> Tambah Baris
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead className="bg-white border-t border-b">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Kode Barang</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Nama Barang</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Qty</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Satuan</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Keterangan</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((it) => (
                        <tr key={it.id}>
                          <td className="px-3 py-2"><input value={it.kodeBarang} onChange={(e) => updateItem(it.id, { kodeBarang: e.target.value })} className="w-full px-2 py-1.5 border rounded" placeholder="BRG-001" /></td>
                          <td className="px-3 py-2"><input value={it.namaBarang} onChange={(e) => updateItem(it.id, { namaBarang: e.target.value })} className="w-full px-2 py-1.5 border rounded" placeholder="Nama Barang" /></td>
                          <td className="px-3 py-2"><input type="number" value={it.qty} onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) })} className="w-24 px-2 py-1.5 border rounded" /></td>
                          <td className="px-3 py-2"><input value={it.unit} onChange={(e) => updateItem(it.id, { unit: e.target.value })} className="w-28 px-2 py-1.5 border rounded" placeholder="pcs/unit" /></td>
                          <td className="px-3 py-2"><input value={it.keterangan || ''} onChange={(e) => updateItem(it.id, { keterangan: e.target.value })} className="w-full px-2 py-1.5 border rounded" placeholder="Catatan" /></td>
                          <td className="px-3 py-2 text-right">
                            <button onClick={() => removeRow(it.id)} className="inline-flex items-center gap-1 px-2 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100">
                              <MinusCircle className="h-4 w-4" /> Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                      {items.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center text-gray-500">Belum ada barang</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border">Batal</button>
                <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700">
                  <Save className="h-4 w-4" /> Simpan Permintaan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Action Bar (Filters + Tambah) */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Cari permintaan..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Buat Permintaan Baru</span>
          </button>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Permintaan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gudang Asal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gudang Tujuan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.kodePermintaan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.tanggalInput}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{gudangOptions.find(g => g.id === request.gudangAsal)?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{gudangOptions.find(g => g.id === request.gudangTujuan)?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors" title="Lihat Detail">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada permintaan barang yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PermintaanBarangGudangDashboard;
