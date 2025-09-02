import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface TenagaKerjaItem {
  id: string;
  tenaga: string;
  tunjangan: string;
  projectRate: string;
  hari: string;
  hargaAwal: string; // legacy, no longer used in UI
  margin: string; // legacy, no longer used in UI
  hargaAkhir: string; // legacy, no longer used in UI
}

// Additional row interfaces for other tabs
interface JasaItem {
  jasa: string;
  tunjangan: string;
  projectRate: string;
  hari: string;
  // removed in UI: hargaAwal, margin, hargaAkhir
}

interface AlatItem {
  alat: string;
  harga: string;
  jumlah: string;
  hari: string;
  satuan: string;
  hargaSatuan: string; // derived
  // removed in UI: hargaAwal, margin, hargaAkhir
}

interface BarangItem {
  namaBarang: string;
  harga: string;
  jumlah: string;
  hari: string;
  satuan: string;
  hargaSatuan: string; // derived
  // removed in UI: hargaAwal, margin, hargaAkhir
}

interface MobDemobItem {
  namaTransportasi: string;
  tunjangan: string;
  projectRate: string;
  hari: string;
  // removed in UI: hargaAwal, margin, hargaAkhir
}

interface BiayaLainLainItem {
  namaBiaya: string;
  tunjangan: string;
  projectRate: string;
  hari: string;
  // removed in UI: hargaAwal, margin, hargaAkhir
}

const HPPDetailTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tenaga Kerja');

  // States for each tab
  const [tenagaKerja, setTenagaKerja] = useState<Array<Pick<TenagaKerjaItem, 'tenaga' | 'tunjangan' | 'hari'>>>([
    { tenaga: '', tunjangan: '', hari: '' },
  ]);
  const [jasa, setJasa] = useState<Array<Pick<JasaItem, 'jasa' | 'tunjangan' | 'hari'>>>([
    { jasa: '', tunjangan: '', hari: '' },
  ]);
  const [alat, setAlat] = useState<Array<Pick<AlatItem, 'alat' | 'jumlah' | 'satuan'>>>([
    { alat: '', jumlah: '', satuan: '' },
  ]);
  const [barang, setBarang] = useState<Array<Pick<BarangItem, 'namaBarang' | 'jumlah' | 'satuan'>>>([
    { namaBarang: '', jumlah: '', satuan: '' },
  ]);
  const [mobDemob, setMobDemob] = useState<MobDemobItem[]>([
    { namaTransportasi: '', tunjangan: '', projectRate: '', hari: '' },
  ]);
  const [biayaLainLain, setBiayaLainLain] = useState<BiayaLainLainItem[]>([
    { namaBiaya: '', tunjangan: '', projectRate: '', hari: '' },
  ]);

  const tabs = ['Tenaga Kerja', 'Jasa', 'Alat', 'Barang', 'MobDemob', 'Biaya Lain-lain', 'Sisa HPP'];
  const tenagaOptions = ['Teknisi', 'Supervisor', 'Engineer', 'Admin'];
  const jasaOptions = ['Instalasi', 'Maintenance', 'Konsultasi', 'Pelatihan'];
  const alatOptions = ['Excavator', 'Crane', 'Forklift', 'Generator'];
  const barangOptions = ['Cable', 'Pipe', 'Bolt', 'Panel'];

  // Utility calculators
  const calcHargaSatuan = (harga: string, jumlah: string, hari: string) => {
    const a = Number(harga) || 0;
    const b = Number(jumlah) || 0;
    const c = Number(hari) || 0;
    return (a * b * c).toString();
  };

  // Handlers shared across tabs
  const addRow = () => {
    switch (activeTab) {
      case 'Tenaga Kerja':
        setTenagaKerja([...tenagaKerja, { tenaga: '', tunjangan: '', hari: '' }]);
        break;
      case 'Jasa':
        setJasa([...jasa, { jasa: '', tunjangan: '', hari: '' }]);
        break;
      case 'Alat':
        setAlat([...alat, { alat: '', jumlah: '', satuan: '' }]);
        break;
      case 'Barang':
        setBarang([...barang, { namaBarang: '', jumlah: '', satuan: '' }]);
        break;
      case 'MobDemob':
        setMobDemob([...mobDemob, { namaTransportasi: '', tunjangan: '', projectRate: '', hari: '' }]);
        break;
      case 'Biaya Lain-lain':
        setBiayaLainLain([...biayaLainLain, { namaBiaya: '', tunjangan: '', projectRate: '', hari: '' }]);
        break;
    }
  };

  const removeRow = (index: number) => {
    switch (activeTab) {
      case 'Tenaga Kerja':
        if (tenagaKerja.length > 1) setTenagaKerja(tenagaKerja.filter((_, i) => i !== index));
        break;
      case 'Jasa':
        if (jasa.length > 1) setJasa(jasa.filter((_, i) => i !== index));
        break;
      case 'Alat':
        if (alat.length > 1) setAlat(alat.filter((_, i) => i !== index));
        break;
      case 'Barang':
        if (barang.length > 1) setBarang(barang.filter((_, i) => i !== index));
        break;
      case 'MobDemob':
        if (mobDemob.length > 1) setMobDemob(mobDemob.filter((_, i) => i !== index));
        break;
      case 'Biaya Lain-lain':
        if (biayaLainLain.length > 1) setBiayaLainLain(biayaLainLain.filter((_, i) => i !== index));
        break;
    }
  };

  const handleTabDataChange = (index: number, field: string, value: string) => {
    switch (activeTab) {
      case 'Tenaga Kerja': {
        const rows = [...tenagaKerja];
        rows[index] = { ...rows[index], [field]: value } as typeof rows[number];
        setTenagaKerja(rows);
        break;
      }
      case 'Jasa': {
        const rows = [...jasa];
        rows[index] = { ...rows[index], [field]: value } as typeof rows[number];
        setJasa(rows);
        break;
      }
      case 'Alat': {
        const rows = [...alat];
        rows[index] = { ...rows[index], [field]: value } as typeof rows[number];
        setAlat(rows);
        break;
      }
      case 'Barang': {
        const rows = [...barang];
        rows[index] = { ...rows[index], [field]: value } as typeof rows[number];
        setBarang(rows);
        break;
      }
      case 'MobDemob': {
        const rows = [...mobDemob];
        rows[index] = { ...rows[index], [field]: value } as typeof rows[number];
        setMobDemob(rows);
        break;
      }
      case 'Biaya Lain-lain': {
        const rows = [...biayaLainLain];
        rows[index] = { ...rows[index], [field]: value } as typeof rows[number];
        setBiayaLainLain(rows);
        break;
      }
    }
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
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Hari</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {tenagaKerja.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <select
                    value={item.tenaga}
                    onChange={(e) => handleTabDataChange(index, 'tenaga', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                  >
                    <option value="">Pilih Tenaga</option>
                    {tenagaOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.tunjangan}
                    onChange={(e) => handleTabDataChange(index, 'tunjangan', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                    placeholder="Tunjangan"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={item.hari}
                    onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                    placeholder="Hari"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    onClick={() => removeRow(index)}
                    className="p-2 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Delete row"
                    disabled={tenagaKerja.length === 1}
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
        onClick={addRow}
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
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-text">Jasa</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-surface">
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Jasa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Tunjangan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Hari</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                  {jasa.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <select
                          value={item.jasa}
                          onChange={(e) => handleTabDataChange(index, 'jasa', e.target.value)}
                          className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm"
                        >
                          <option value="">Pilih Jasa</option>
                          {jasaOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="text" value={item.tunjangan} onChange={(e) => handleTabDataChange(index, 'tunjangan', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Tunjangan" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="number" value={item.hari} onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Hari" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button onClick={() => removeRow(index)} className="p-2 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Delete row" disabled={jasa.length === 1}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addRow} className="inline-flex items-center px-4 py-2 bg-success text-white rounded-md hover:bg-success/80 transition-colors text-sm font-medium">
              <Plus className="h-4 w-4 mr-2" /> Tambah Baris
            </button>
          </div>
        );
      case 'Alat':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-text">Alat</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-surface">
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Alat</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Jumlah</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Satuan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                  {alat.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <select
                          value={item.alat}
                          onChange={(e) => handleTabDataChange(index, 'alat', e.target.value)}
                          className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm"
                        >
                          <option value="">Pilih Alat</option>
                          {alatOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="number" value={item.jumlah} onChange={(e) => handleTabDataChange(index, 'jumlah', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Jumlah" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="text" value={item.satuan} onChange={(e) => handleTabDataChange(index, 'satuan', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Satuan" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button onClick={() => removeRow(index)} className="p-2 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Delete row" disabled={alat.length === 1}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addRow} className="inline-flex items-center px-4 py-2 bg-success text-white rounded-md hover:bg-success/80 transition-colors text-sm font-medium">
              <Plus className="h-4 w-4 mr-2" /> Tambah Baris
            </button>
          </div>
        );
      case 'Barang':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-text">Barang</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-surface">
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Nama Barang</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Jumlah</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Satuan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                  {barang.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <select
                          value={item.namaBarang}
                          onChange={(e) => handleTabDataChange(index, 'namaBarang', e.target.value)}
                          className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm"
                        >
                          <option value="">Pilih Barang</option>
                          {barangOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="number" value={item.jumlah} onChange={(e) => handleTabDataChange(index, 'jumlah', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Jumlah" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="text" value={item.satuan} onChange={(e) => handleTabDataChange(index, 'satuan', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Satuan" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button onClick={() => removeRow(index)} className="p-2 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Delete row" disabled={barang.length === 1}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addRow} className="inline-flex items-center px-4 py-2 bg-success text-white rounded-md hover:bg-success/80 transition-colors text-sm font-medium">
              <Plus className="h-4 w-4 mr-2" /> Tambah Baris
            </button>
          </div>
        );
      case 'MobDemob':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-text">MobDemob</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-surface">
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Nama Transportasi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Tunjangan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Project Rate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Hari</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                  {mobDemob.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="text" value={item.namaTransportasi} onChange={(e) => handleTabDataChange(index, 'namaTransportasi', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Nama Transportasi" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="text" value={item.tunjangan} onChange={(e) => handleTabDataChange(index, 'tunjangan', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Tunjangan" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="text" value={item.projectRate} onChange={(e) => handleTabDataChange(index, 'projectRate', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Project Rate" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="number" value={item.hari} onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Hari" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button onClick={() => removeRow(index)} className="p-2 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Delete row" disabled={mobDemob.length === 1}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addRow} className="inline-flex items-center px-4 py-2 bg-success text-white rounded-md hover:bg-success/80 transition-colors text-sm font-medium">
              <Plus className="h-4 w-4 mr-2" /> Tambah Baris
            </button>
          </div>
        );
      case 'Biaya Lain-lain':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-text">Biaya Lain-lain</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-surface">
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Nama Biaya</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Tunjangan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Project Rate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Hari</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                  {biayaLainLain.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="text" value={item.namaBiaya} onChange={(e) => handleTabDataChange(index, 'namaBiaya', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Nama Biaya" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="text" value={item.tunjangan} onChange={(e) => handleTabDataChange(index, 'tunjangan', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Tunjangan" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="text" value={item.projectRate} onChange={(e) => handleTabDataChange(index, 'projectRate', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Project Rate" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="number" value={item.hari} onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Hari" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button onClick={() => removeRow(index)} className="p-2 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Delete row" disabled={biayaLainLain.length === 1}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addRow} className="inline-flex items-center px-4 py-2 bg-success text-white rounded-md hover:bg-success/80 transition-colors text-sm font-medium">
              <Plus className="h-4 w-4 mr-2" /> Tambah Baris
            </button>
          </div>
        );
      case 'Sisa HPP':
        return (
          <div className="p-4 text-textSecondary">
            Belum ada data untuk Sisa HPP.
          </div>
        );
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
