import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface TenagaKerjaItem {
  id: string;
  tenaga: string;
  tunjangan: string;
  projectRate: string;
  hari: string;
  hargaAwal: string;
  margin: string;
  hargaAkhir: string;
}

const HPPDetailTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tenaga Kerja');
  const [tenagaKerjaData, setTenagaKerjaData] = useState<TenagaKerjaItem[]>([
    {
      id: crypto.randomUUID(),
      tenaga: '',
      tunjangan: '',
      projectRate: '',
      hari: '',
      hargaAwal: '',
      margin: '',
      hargaAkhir: '',
    },
  ]);

  const tabs = ['Tenaga Kerja', 'Jasa', 'Alat', 'Barang', 'MobDemob', 'Biaya Lain-lain', 'Sisa HPP'];

  const handleAddRow = () => {
    setTenagaKerjaData([
      ...tenagaKerjaData,
      {
        id: crypto.randomUUID(),
        tenaga: '',
        tunjangan: '',
        projectRate: '',
        hari: '',
        hargaAwal: '',
        margin: '',
        hargaAkhir: '',
      },
    ]);
  };

  const handleDeleteRow = (id: string) => {
    setTenagaKerjaData(tenagaKerjaData.filter((item) => item.id !== id));
  };

  const handleInputChange = (id: string, field: keyof TenagaKerjaItem, value: string) => {
    setTenagaKerjaData(
      tenagaKerjaData.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const renderTenagaKerjaTab = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-text">Tenaga Kerja</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr className="bg-surface">
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Tenaga</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Tunjangan</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Project Rate</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Hari</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Awal</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Margin %</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Akhir</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {tenagaKerjaData.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.tenaga}
                    onChange={(e) => handleInputChange(item.id, 'tenaga', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                    placeholder="Nama Tenaga"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.tunjangan}
                    onChange={(e) => handleInputChange(item.id, 'tunjangan', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                    placeholder="Tunjangan"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.projectRate}
                    onChange={(e) => handleInputChange(item.id, 'projectRate', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                    placeholder="Project Rate"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.hari}
                    onChange={(e) => handleInputChange(item.id, 'hari', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                    placeholder="Hari"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.hargaAwal}
                    onChange={(e) => handleInputChange(item.id, 'hargaAwal', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                    placeholder="Harga Awal"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.margin}
                    onChange={(e) => handleInputChange(item.id, 'margin', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                    placeholder="Margin %"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.hargaAkhir}
                    onChange={(e) => handleInputChange(item.id, 'hargaAkhir', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                    placeholder="Harga Akhir"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteRow(item.id)}
                    className="p-2 text-error hover:bg-error/20 rounded-md transition-colors"
                    aria-label="Delete row"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleAddRow}
        className="inline-flex items-center px-4 py-2 bg-success text-white rounded-md hover:bg-success/80 transition-colors text-sm font-medium"
      >
        <Plus className="h-4 w-4 mr-2" /> Tambah Baris
      </button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Tenaga Kerja':
        return renderTenagaKerjaTab();
      case 'Jasa':
        return <div className="p-4 text-textSecondary">Konten untuk Jasa akan datang...</div>;
      case 'Alat':
        return <div className="p-4 text-textSecondary">Konten untuk Alat akan datang...</div>;
      case 'Barang':
        return <div className="p-4 text-textSecondary">Konten untuk Barang akan datang...</div>;
      case 'MobDemob':
        return <div className="p-4 text-textSecondary">Konten untuk MobDemob akan datang...</div>;
      case 'Biaya Lain-lain':
        return <div className="p-4 text-textSecondary">Konten untuk Biaya Lain-lain akan datang...</div>;
      case 'Sisa HPP':
        return <div className="p-4 text-textSecondary">Konten untuk Sisa HPP akan datang...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="mt-8">
      <div className="flex border-b border-border mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-textSecondary hover:text-text'
            } transition-colors duration-200 whitespace-nowrap`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default HPPDetailTabs;
