import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

interface KRAItem {
  id: number;
  kra: string;
  variabelIndicator: string;
  responsibility: string;
  plan: string;
  satuan: string;
  bobot: string;
  target: string;
}

const GeneralMasterKPIDashboard: React.FC = () => {
  const [kraItems, setKraItems] = useState<KRAItem[]>([{
    id: 1,
    kra: '',
    variabelIndicator: '',
    responsibility: '',
    plan: '',
    satuan: '',
    bobot: '',
    target: ''
  }]);
  const [nextId, setNextId] = useState(2);

  const addKRAItem = () => {
    setKraItems([...kraItems, {
      id: nextId,
      kra: '',
      variabelIndicator: '',
      responsibility: '',
      plan: '',
      satuan: '',
      bobot: '',
      target: ''
    }]);
    setNextId(nextId + 1);
  };

  const removeKRAItem = (id: number) => {
    setKraItems(kraItems.filter(item => item.id !== id));
  };

  const handleKRAItemChange = (id: number, field: keyof KRAItem, value: string) => {
    setKraItems(kraItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Master KPI</h1>

        {/* Data Pegawai Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Data Pegawai</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Nama Pegawai */}
            <div>
              <label htmlFor="namaPegawai" className="block text-sm font-medium text-gray-700 mb-2">Nama Pegawai</label>
              <select
                id="namaPegawai"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              >
                <option>--Pilih Nama Pegawai--</option>
                <option>Pegawai A</option>
                <option>Pegawai B</option>
              </select>
            </div>
            {/* Nama Penilai */}
            <div>
              <label htmlFor="namaPenilai" className="block text-sm font-medium text-gray-700 mb-2">Nama Penilai</label>
              <select
                id="namaPenilai"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              >
                <option>--Pilih Nama Penilai--</option>
                <option>Penilai X</option>
                <option>Penilai Y</option>
              </select>
            </div>
            {/* Posisi Pegawai */}
            <div>
              <label htmlFor="posisiPegawai" className="block text-sm font-medium text-gray-700 mb-2">Posisi Pegawai</label>
              <input
                type="text"
                id="posisiPegawai"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                value="-"
                readOnly
              />
            </div>
            {/* Posisi Penilai */}
            <div>
              <label htmlFor="posisiPenilai" className="block text-sm font-medium text-gray-700 mb-2">Posisi Penilai</label>
              <input
                type="text"
                id="posisiPenilai"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                value="-"
                readOnly
              />
            </div>
          </div>
          {/* Jenis KPI */}
          <div className="mb-6">
            <label htmlFor="jenisKPI" className="block text-sm font-medium text-gray-700 mb-2">Jenis KPI</label>
            <select
              id="jenisKPI"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
            >
              <option>--Pilih Jenis KPI--</option>
              <option>KPI Tahunan</option>
              <option>KPI Bulanan</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-300">
              <Plus className="h-4 w-4 mr-2" /> Tambah Prespektif
            </button>
          </div>
        </div>

        {/* Prespektif Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Prespektif</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Prespektif */}
            <div>
              <label htmlFor="prespektif" className="block text-sm font-medium text-gray-700 mb-2">Prespektif</label>
              <select
                id="prespektif"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              >
                <option>--Pilih Prespektif--</option>
                <option>Finansial</option>
                <option>Pelanggan</option>
              </select>
            </div>
            {/* Bobot Prespektif (%) */}
            <div>
              <label htmlFor="bobotPrespektif" className="block text-sm font-medium text-gray-700 mb-2">Bobot Prespektif (%)</label>
              <input
                type="number"
                id="bobotPrespektif"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                placeholder="Masukkan Bobot Prespektif"
              />
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={addKRAItem}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-300"
            >
              Tambah Baris
            </button>
          </div>

          {/* KRA Table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">KRA</th>
                  <th className="px-4 py-3 text-left">Variabel Indicator</th>
                  <th className="px-4 py-3 text-left">Responsibility</th>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Satuan</th>
                  <th className="px-4 py-3 text-left">Bobot (%)</th>
                  <th className="px-4 py-3 text-left">Target</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kraItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[40px]"
                        value={item.kra}
                        onChange={(e) => handleKRAItemChange(item.id, 'kra', e.target.value)}
                      ></textarea>
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[40px]"
                        value={item.variabelIndicator}
                        onChange={(e) => handleKRAItemChange(item.id, 'variabelIndicator', e.target.value)}
                      ></textarea>
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[40px]"
                        value={item.responsibility}
                        onChange={(e) => handleKRAItemChange(item.id, 'responsibility', e.target.value)}
                      ></textarea>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        value={item.plan}
                        onChange={(e) => handleKRAItemChange(item.id, 'plan', e.target.value)}
                      >
                        <option>--Pilih Plan--</option>
                        <option>Plan A</option>
                        <option>Plan B</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        value={item.satuan}
                        onChange={(e) => handleKRAItemChange(item.id, 'satuan', e.target.value)}
                      >
                        <option>--Pilih Satuan--</option>
                        <option>Unit</option>
                        <option>Kg</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        value={item.bobot}
                        onChange={(e) => handleKRAItemChange(item.id, 'bobot', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        value={item.target}
                        onChange={(e) => handleKRAItemChange(item.id, 'target', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removeKRAItem(item.id)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-xl shadow-md hover:bg-red-700 transition-colors duration-300">
              Hapus Prespektif
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-300">
            <Save className="h-5 w-5 mr-2" /> Simpan KPI
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralMasterKPIDashboard;
