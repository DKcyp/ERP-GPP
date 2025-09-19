import React, { useMemo, useState } from "react";
import { Clock, PlusCircle, Edit, Trash2, FileSpreadsheet, FileDown, Search } from "lucide-react";

type ARPaymentRow = {
  id: number;
  tanggal: string; // yyyy-mm-dd
  customer: string;
  noInvoice: string;
  metode: "Transfer" | "Giro" | "Tunai";
  dpp: number;
  ppn: number;
  total: number;
  noBuktiTerima: string;
  keterangan?: string;
};

const ProsesPembayaranARDashboard: React.FC = () => {
  const today = new Date();
  const [rows, setRows] = useState<ARPaymentRow[]>([
    { id: 1, tanggal: "2025-09-08", customer: "PT Global Tech", noInvoice: "INV-AR-001", metode: "Transfer", dpp: 15000000, ppn: 1650000, total: 16650000, noBuktiTerima: "BT-001", keterangan: "Pembayaran jasa konsultasi" },
    { id: 2, tanggal: "2025-09-10", customer: "CV Solusi Digital", noInvoice: "INV-AR-002", metode: "Giro", dpp: 9000000, ppn: 990000, total: 9990000, noBuktiTerima: "BT-002", keterangan: "Pembayaran lisensi software" },
    { id: 3, tanggal: "2025-09-12", customer: "PT Maju Bersama", noInvoice: "INV-AR-003", metode: "Transfer", dpp: 12000000, ppn: 1320000, total: 13320000, noBuktiTerima: "BT-003", keterangan: "Pembayaran maintenance" },
  ]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ARPaymentRow | null>(null);

  const filtered = useMemo(() => rows.filter(r => [r.noInvoice, r.customer, r.noBuktiTerima].join(" ").toLowerCase().includes(search.toLowerCase())), [rows, search]);

  const startAdd = () => { setEditing({ id: 0, tanggal: new Date().toISOString().split('T')[0], customer: '', noInvoice: '', metode: 'Transfer', dpp: 0, ppn: 0, total: 0, noBuktiTerima: '', keterangan: '' }); setFormOpen(true); };
  const startEdit = (row: ARPaymentRow) => { setEditing(row); setFormOpen(true); };
  const remove = (id: number) => setRows(prev => prev.filter(r => r.id !== id));
  const onSave = (data: ARPaymentRow) => {
    data.total = (Number(data.dpp)||0) + (Number(data.ppn)||0);
    if (data.id && rows.some(r => r.id === data.id)) setRows(prev => prev.map(r => r.id === data.id ? data : r));
    else { const newId = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1; setRows(prev => [{ ...data, id: newId }, ...prev]); }
    setFormOpen(false); setEditing(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-wide mb-2">AR - PROSES PEMBAYARAN</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-green-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-green-600 font-medium">AR / Proses Pembayaran</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
              <div className="relative">
                <input value={search} onChange={e => setSearch(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-9" placeholder="Customer/No Invoice/No Bukti Terima" />
                <Search className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="hidden md:block"></div>
            <div className="flex items-end justify-end gap-2">
              <button onClick={startAdd} className="inline-flex items-center px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">
                <PlusCircle className="h-5 w-5 mr-2" /> Tambah
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                <FileSpreadsheet className="h-5 w-5 mr-2" /> Excel
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                <FileDown className="h-5 w-5 mr-2" /> PDF
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daftar Pembayaran AR ({filtered.length} items)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Invoice</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DPP</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PPN</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Bukti Terima</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{row.noInvoice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        row.metode === 'Transfer' ? 'bg-blue-100 text-blue-800' :
                        row.metode === 'Giro' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {row.metode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {row.dpp.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {row.ppn.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Rp {row.total.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noBuktiTerima}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{row.keterangan || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => startEdit(row)} className="text-blue-600 hover:text-blue-900" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(row.id)} className="text-red-600 hover:text-red-900" title="Hapus">
                          <Trash2 className="h-4 w-4" />
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

      {/* Modal Form */}
      {formOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editing?.id ? 'Edit Pembayaran AR' : 'Tambah Pembayaran AR'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editing) onSave(editing);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={editing?.tanggal || ''}
                    onChange={(e) => setEditing(prev => prev ? {...prev, tanggal: e.target.value} : null)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input
                    type="text"
                    value={editing?.customer || ''}
                    onChange={(e) => setEditing(prev => prev ? {...prev, customer: e.target.value} : null)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nama customer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No Invoice</label>
                  <input
                    type="text"
                    value={editing?.noInvoice || ''}
                    onChange={(e) => setEditing(prev => prev ? {...prev, noInvoice: e.target.value} : null)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="INV-AR-001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                  <select
                    value={editing?.metode || 'Transfer'}
                    onChange={(e) => setEditing(prev => prev ? {...prev, metode: e.target.value as 'Transfer' | 'Giro' | 'Tunai'} : null)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Transfer">Transfer</option>
                    <option value="Giro">Giro</option>
                    <option value="Tunai">Tunai</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DPP</label>
                    <input
                      type="number"
                      value={editing?.dpp || 0}
                      onChange={(e) => {
                        const dpp = Number(e.target.value);
                        const ppn = dpp * 0.11; // 11% PPN
                        setEditing(prev => prev ? {...prev, dpp, ppn, total: dpp + ppn} : null);
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PPN (11%)</label>
                    <input
                      type="number"
                      value={editing?.ppn || 0}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                  <input
                    type="number"
                    value={editing?.total || 0}
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No Bukti Terima</label>
                  <input
                    type="text"
                    value={editing?.noBuktiTerima || ''}
                    onChange={(e) => setEditing(prev => prev ? {...prev, noBuktiTerima: e.target.value} : null)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="BT-001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea
                    value={editing?.keterangan || ''}
                    onChange={(e) => setEditing(prev => prev ? {...prev, keterangan: e.target.value} : null)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Keterangan pembayaran (opsional)"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  {editing?.id ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProsesPembayaranARDashboard;
