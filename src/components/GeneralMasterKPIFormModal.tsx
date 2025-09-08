import React, { useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';

interface KRAItem {
  id: number;
  perspektif: string;
  kra: string;
  variabelIndicator: string;
  responsibility: string;
  satuan: string;
  triwulan: string; // 1,2,3,4
  bobot: string; // percent
  target: string;
  realisasi: string;
  polaritas: 'Positive' | 'Negative' | '';
}

interface GeneralMasterKPIFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  initialData?: any | null;
}

const GeneralMasterKPIFormModal: React.FC<GeneralMasterKPIFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [jenisKPI, setJenisKPI] = useState(initialData?.jenisKPI || '');

  const [kraItems, setKraItems] = useState<KRAItem[]>(
    initialData?.kraItems || [
      { id: 1, perspektif: '', kra: '', variabelIndicator: '', responsibility: '', satuan: '', triwulan: '', bobot: '', target: '', realisasi: '', polaritas: '' },
    ]
  );
  const [nextId, setNextId] = useState( (initialData?.kraItems?.length || 1) + 1 );

  if (!isOpen) return null;

  const addKRAItem = () => {
    setKraItems((prev) => [
      ...prev,
      { id: nextId, perspektif: '', kra: '', variabelIndicator: '', responsibility: '', satuan: '', triwulan: '', bobot: '', target: '', realisasi: '', polaritas: '' },
    ]);
    setNextId((n: number) => n + 1);
  };

  const removeKRAItem = (id: number) => {
    setKraItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleKRAItemChange = (id: number, field: keyof KRAItem, value: string) => {
    setKraItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const handleSave = () => {
    onSave({ jenisKPI, kraItems });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">{initialData ? 'Edit Master KPI' : 'Tambah Master KPI'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Header Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis KPI</label>
                <select
                  value={jenisKPI}
                  onChange={(e) => setJenisKPI(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                >
                  <option value="">--Pilih Jenis KPI--</option>
                  <option value="KPI Tahunan">KPI Tahunan</option>
                  <option value="KPI Bulanan">KPI Bulanan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prespektif + Tabel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">KPI Master</h3>
            {/* Tambah Baris */}
            <div className="flex justify-end mb-4">
              <button onClick={addKRAItem} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" /> Tambah Baris
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm font-semibold uppercase tracking-wider">
                    <th className="px-4 py-3 text-left align-bottom" rowSpan={2}>Perspektif</th>
                    <th className="px-4 py-3 text-left align-bottom" rowSpan={2}>KRA</th>
                    <th className="px-4 py-3 text-center" colSpan={3}>KPI Indicators</th>
                    <th className="px-4 py-3 text-center" colSpan={3}>Plan</th>
                    <th className="px-4 py-3 text-center align-bottom" rowSpan={2}>Realisasi</th>
                    <th className="px-4 py-3 text-center align-bottom" rowSpan={2}>Polaritas</th>
                    <th className="px-4 py-3 text-center align-bottom" rowSpan={2}>Aksi</th>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-4 py-2 text-left">Variabel Indicator</th>
                    <th className="px-4 py-2 text-left">Responsibility</th>
                    <th className="px-4 py-2 text-left">Satuan</th>
                    <th className="px-4 py-2 text-left">Triwulan</th>
                    <th className="px-4 py-2 text-left">Bobot (%)</th>
                    <th className="px-4 py-2 text-left">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {kraItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 align-top">
                      <td className="px-4 py-3 min-w-[180px]">
                        <select
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                          value={item.perspektif}
                          onChange={(e) => handleKRAItemChange(item.id, 'perspektif', e.target.value)}
                        >
                          <option value="">--Pilih Perspektif--</option>
                          <option value="FINANCIAL (Bobot = 20%)">FINANCIAL (Bobot = 20%)</option>
                          <option value="CUSTOMER (Bobot = 20%)">CUSTOMER (Bobot = 20%)</option>
                          <option value="INTERNAL BUSINESS PROCESS (Bobot = 50%)">INTERNAL BUSINESS PROCESS (Bobot = 50%)</option>
                          <option value="LEARNING & GROWTH (Bobot = 10%)">LEARNING & GROWTH (Bobot = 10%)</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 min-w-[220px]">
                        <textarea className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[40px]" value={item.kra} onChange={(e) => handleKRAItemChange(item.id, 'kra', e.target.value)} />
                      </td>
                      <td className="px-4 py-3 min-w-[220px]">
                        <textarea className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[40px]" value={item.variabelIndicator} onChange={(e) => handleKRAItemChange(item.id, 'variabelIndicator', e.target.value)} />
                      </td>
                      <td className="px-4 py-3 min-w-[220px]">
                        <textarea className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[40px]" value={item.responsibility} onChange={(e) => handleKRAItemChange(item.id, 'responsibility', e.target.value)} />
                      </td>
                      <td className="px-4 py-3 min-w-[140px]">
                        <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50" value={item.satuan} onChange={(e) => handleKRAItemChange(item.id, 'satuan', e.target.value)}>
                          <option>--Pilih Satuan--</option>
                          <option>Hari</option>
                          <option>Bulan</option>
                          <option>Unit</option>
                          <option>Kg</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50" value={item.triwulan} onChange={(e) => handleKRAItemChange(item.id, 'triwulan', e.target.value)}>
                          <option value="">--Pilih Triwulan--</option>
                          <option value="1">Triwulan 1</option>
                          <option value="2">Triwulan 2</option>
                          <option value="3">Triwulan 3</option>
                          <option value="4">Triwulan 4</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <input type="number" className="w-full p-2 border border-gray-300 rounded-lg text-sm" value={item.bobot} onChange={(e) => handleKRAItemChange(item.id, 'bobot', e.target.value)} />
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm" value={item.target} onChange={(e) => handleKRAItemChange(item.id, 'target', e.target.value)} />
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm" value={item.realisasi} onChange={(e) => handleKRAItemChange(item.id, 'realisasi', e.target.value)} />
                      </td>
                      <td className="px-4 py-3 min-w-[140px]">
                        <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50" value={item.polaritas} onChange={(e) => handleKRAItemChange(item.id, 'polaritas', e.target.value as KRAItem['polaritas'])}>
                          <option value="">--Pilih Polaritas--</option>
                          <option value="Positive">Positive</option>
                          <option value="Negative">Negative</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => removeKRAItem(item.id)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Batal</button>
          <button onClick={handleSave} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            <Save className="h-4 w-4 mr-2" /> Simpan KPI
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralMasterKPIFormModal;
