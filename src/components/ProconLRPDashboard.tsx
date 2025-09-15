import React, { useMemo, useState } from 'react';
import { LayoutDashboard, Clock, Plus, Pencil, Trash2, X, Save } from 'lucide-react';

type Currency = string; // formatted Rp string e.g., "Rp 10.000"

interface LRPItem {
  id: string;
  tunjanganTimesheetTeknisi: Currency;
  gaji: Currency;
  kategoriDokumen: string;
  kas: Currency;
  bank: Currency;
  purchaseRequest: Currency;
  purchaseOrder: Currency;
  kontrakDeal: Currency;
  hppInduk: Currency;
}

const formatRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
const parseToNumber = (rp: string) => Number((rp || '').toString().replace(/[^\d]/g, '')) || 0;
const formatCurrencyInput = (value: string) => {
  const numeric = value.replace(/[^\d]/g, '');
  const num = parseInt(numeric || '0', 10);
  return formatRp(num);
};

const emptyItem = (): LRPItem => ({
  id: '',
  tunjanganTimesheetTeknisi: formatRp(0),
  gaji: formatRp(0),
  kategoriDokumen: '',
  kas: formatRp(0),
  bank: formatRp(0),
  purchaseRequest: formatRp(0),
  purchaseOrder: formatRp(0),
  kontrakDeal: formatRp(0),
  hppInduk: formatRp(0),
});

const ProconLRPDashboard: React.FC = () => {
  const [items, setItems] = useState<LRPItem[]>(() => [
    {
      id: crypto.randomUUID(),
      tunjanganTimesheetTeknisi: formatRp(0),
      gaji: formatRp(0),
      kategoriDokumen: 'Biaya consumabel',
      kas: formatRp(0),
      bank: formatRp(0),
      purchaseRequest: formatRp(0),
      purchaseOrder: formatRp(0),
      kontrakDeal: formatRp(0),
      hppInduk: formatRp(0),
    },
  ]);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LRPItem>(emptyItem());
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      it.kategoriDokumen.toLowerCase().includes(q)
    );
  }, [items, query]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyItem(), id: crypto.randomUUID() });
    setIsOpen(true);
  };

  const openEdit = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    setEditingId(id);
    setForm({ ...it });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Hapus data ini?')) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const updateField = (field: keyof LRPItem, value: string) => {
    if (
      field === 'tunjanganTimesheetTeknisi' ||
      field === 'gaji' ||
      field === 'kas' ||
      field === 'bank' ||
      field === 'purchaseRequest' ||
      field === 'purchaseOrder' ||
      field === 'kontrakDeal' ||
      field === 'hppInduk'
    ) {
      setForm((f) => ({ ...f, [field]: formatCurrencyInput(value) } as LRPItem));
    } else {
      setForm((f) => ({ ...f, [field]: value } as LRPItem));
    }
  };

  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setItems((prev) => {
      if (editingId) {
        return prev.map((x) => (x.id === editingId ? { ...form } : x));
      }
      return [{ ...form }, ...prev];
    });
    setSaving(false);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laba Rugi Project - Dashboard</h1>
            <div className="text-sm text-gray-600">Procon › Laba Rugi Project › Dashboard</div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </button>
          </div>
          <div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kategori dokumen..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tunjangan/Timesheet Teknisi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gaji</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Kategori Dokumen</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Kas</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bank</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Purchase Request</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Purchase Order</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Kontrak Deal</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">HPP Induk</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((it, idx) => (
                  <tr key={it.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{it.tunjanganTimesheetTeknisi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{it.gaji}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{it.kategoriDokumen}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{it.kas}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{it.bank}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{it.purchaseRequest}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{it.purchaseOrder}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{it.kontrakDeal}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{it.hppInduk}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right space-x-2">
                      <button
                        onClick={() => openEdit(it.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(it.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-red-300 rounded-md text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-sm text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit' : 'Tambah'} Data Laba Rugi</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={saveForm} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tunjangan/Timesheet Teknisi</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.tunjanganTimesheetTeknisi}
                    onChange={(e) => updateField('tunjanganTimesheetTeknisi', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rp 0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gaji</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.gaji}
                    onChange={(e) => updateField('gaji', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rp 0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Dokumen</label>
                  <input
                    type="text"
                    value={form.kategoriDokumen}
                    onChange={(e) => updateField('kategoriDokumen', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="cth: Biaya consumabel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kas</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.kas}
                    onChange={(e) => updateField('kas', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rp 0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.bank}
                    onChange={(e) => updateField('bank', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rp 0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Request</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.purchaseRequest}
                    onChange={(e) => updateField('purchaseRequest', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rp 0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Order</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.purchaseOrder}
                    onChange={(e) => updateField('purchaseOrder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rp 0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kontrak Deal</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.kontrakDeal}
                    onChange={(e) => updateField('kontrakDeal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rp 0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HPP Induk</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.hppInduk}
                    onChange={(e) => updateField('hppInduk', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rp 0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {saving ? (
                    <>
                      <Save className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProconLRPDashboard;
