import React, { useEffect, useMemo, useState } from 'react';

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

interface HPPDetailTabsProps {
  onTotalChange?: (total: number) => void;
}

const HPPDetailTabs: React.FC<HPPDetailTabsProps> = ({ onTotalChange }) => {
  const [activeTab, setActiveTab] = useState('Tenaga Kerja');

  // Seed example data per tab
  const [tenagaKerja, setTenagaKerja] = useState<Array<Pick<TenagaKerjaItem, 'tenaga' | 'tunjangan' | 'hari'>>>([
    { tenaga: 'Teknisi', tunjangan: 'Uang Makan', hari: '10' },
    { tenaga: 'Engineer', tunjangan: 'Transport', hari: '5' },
  ]);
  const [jasa, setJasa] = useState<Array<Pick<JasaItem, 'jasa' | 'tunjangan' | 'hari'>>>([
    { jasa: 'Instalasi', tunjangan: 'Uang Makan', hari: '3' },
    { jasa: 'Maintenance', tunjangan: 'Lembur', hari: '2' },
  ]);
  const [alat, setAlat] = useState<Array<Pick<AlatItem, 'alat' | 'jumlah' | 'satuan'>>>([
    { alat: 'Excavator', jumlah: '2', satuan: 'unit' },
    { alat: 'Generator', jumlah: '1', satuan: 'unit' },
  ]);
  const [barang, setBarang] = useState<Array<Pick<BarangItem, 'namaBarang' | 'jumlah' | 'satuan'>>>([
    { namaBarang: 'Cable', jumlah: '200', satuan: 'meter' },
    { namaBarang: 'Panel', jumlah: '3', satuan: 'unit' },
  ]);
  const [mobDemob, setMobDemob] = useState<MobDemobItem[]>([
    { namaTransportasi: 'Truk', tunjangan: 'Transport', projectRate: '1500000', hari: '2' },
  ]);
  const [biayaLainLain, setBiayaLainLain] = useState<BiayaLainLainItem[]>([
    { namaBiaya: 'Perizinan', tunjangan: 'Uang Makan', projectRate: '500000', hari: '1' },
  ]);

  const tabs = ['Tenaga Kerja', 'Jasa', 'Alat', 'Barang', 'MobDemob', 'Biaya Lain-lain', 'Sisa HPP'];
  const tenagaOptions = ['Teknisi', 'Supervisor', 'Engineer', 'Admin'];
  const jasaOptions = ['Instalasi', 'Maintenance', 'Konsultasi', 'Pelatihan'];
  const alatOptions = ['Excavator', 'Crane', 'Forklift', 'Generator'];
  const barangOptions = ['Cable', 'Pipe', 'Bolt', 'Panel'];
  const tunjanganOptions = ['Uang Makan', 'Transport', 'Lembur'];

  // Price maps

  const tunjanganMap: Record<string, number> = {
    'Uang Makan': 100000,
    'Transport': 150000,
    'Lembur': 200000,
  };
  const jasaBase: Record<string, number> = {
    'Instalasi': 2000000,
    'Maintenance': 1500000,
    'Konsultasi': 1800000,
    'Pelatihan': 1200000,
  };
  const alatHarga: Record<string, number> = {
    'Excavator': 3000000,
    'Crane': 4000000,
    'Forklift': 2000000,
    'Generator': 1500000,
  };
  const barangHarga: Record<string, number> = {
    'Cable': 50000,
    'Pipe': 40000,
    'Bolt': 5000,
    'Panel': 500000,
  };

  // Subtotals per tab (kept for total per-tab and onTotalChange)
  const subtotalTenaga = useMemo(() => tenagaKerja.reduce((s, r) => {
    const hargaSatuan = (tunjanganMap[r.tunjangan] || 100000);
    const qty = Number(r.hari) || 0;
    return s + hargaSatuan * qty;
  }, 0), [tenagaKerja]);
  const subtotalJasa = useMemo(() => jasa.reduce((s, r) => {
    const hargaSatuan = (jasaBase[r.jasa] || 1000000) + (tunjanganMap[r.tunjangan] || 0);
    const qty = Number(r.hari) || 0;
    return s + hargaSatuan * qty;
  }, 0), [jasa]);
  const subtotalAlat = useMemo(() => alat.reduce((s, r) => {
    const hargaSatuan = (alatHarga[r.alat] || 0);
    const qty = Number(r.jumlah) || 0;
    return s + hargaSatuan * qty;
  }, 0), [alat]);
  const subtotalBarang = useMemo(() => barang.reduce((s, r) => {
    const hargaSatuan = (barangHarga[r.namaBarang] || 0);
    const qty = Number(r.jumlah) || 0;
    return s + hargaSatuan * qty;
  }, 0), [barang]);
  const subtotalMobDemob = useMemo(() => mobDemob.reduce((s, r) => {
    const hargaSatuan = (Number(r.projectRate) || 0) + (tunjanganMap[r.tunjangan] || 0);
    const qty = Number(r.hari) || 0;
    return s + hargaSatuan * qty;
  }, 0), [mobDemob]);
  const subtotalLain = useMemo(() => biayaLainLain.reduce((s, r) => {
    const hargaSatuan = (Number(r.projectRate) || 0) + (tunjanganMap[r.tunjangan] || 0);
    const qty = Number(r.hari) || 0;
    return s + hargaSatuan * qty;
  }, 0), [biayaLainLain]);
  const grandTotal = subtotalTenaga + subtotalJasa + subtotalAlat + subtotalBarang + subtotalMobDemob + subtotalLain;

  useEffect(() => {
    onTotalChange?.(grandTotal);
  }, [grandTotal, onTotalChange]);

  // Handlers shared across tabs
  // Remove add/remove row actions per request

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
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Satuan</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Qty</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Akhir</th>
              
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {tenagaKerja.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.tenaga}
                    onChange={(e) => handleTabDataChange(index, 'tenaga', e.target.value)}
                    list={`tenagaOptionsList-${index}`}
                    placeholder="Pilih / cari tenaga"
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                  />
                  <datalist id={`tenagaOptionsList-${index}`}>
                    {tenagaOptions.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.tunjangan}
                    onChange={(e) => handleTabDataChange(index, 'tunjangan', e.target.value)}
                    list={`tunjanganOptionsList-${index}`}
                    placeholder="Pilih / cari tunjangan"
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm focus:ring-secondary focus:border-secondary"
                  />
                  <datalist id={`tunjanganOptionsList-${index}`}>
                    {tunjanganOptions.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">Rp { (tunjanganMap[item.tunjangan] || 100000).toLocaleString('id-ID') }</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input type="number" value={item.hari} onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Qty" />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">Rp {(((tunjanganMap[item.tunjangan] || 100000) * (Number(item.hari)||0))||0).toLocaleString('id-ID')}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-right text-sm font-medium text-text">Subtotal Tenaga Kerja: Rp {subtotalTenaga.toLocaleString('id-ID')}</div>
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Satuan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Akhir</th>
                    
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
                      <td className="px-4 py-2 whitespace-nowrap text-sm">Rp {(((jasaBase[item.jasa]||1000000)+(tunjanganMap[item.tunjangan]||0)).toLocaleString('id-ID'))}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input type="number" value={item.hari} onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Qty" />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">Rp {((((jasaBase[item.jasa]||1000000)+(tunjanganMap[item.tunjangan]||0))*(Number(item.hari)||0)).toLocaleString('id-ID'))}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-sm font-medium text-text">Subtotal Jasa: Rp {subtotalJasa.toLocaleString('id-ID')}</div>
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Satuan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Akhir</th>
                    
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
                      <td className="px-4 py-2 whitespace-nowrap"><input type="text" value={item.satuan} onChange={(e) => handleTabDataChange(index, 'satuan', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Satuan" /></td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">Rp {( (alatHarga[item.alat]||0).toLocaleString('id-ID') )}</td>
                      <td className="px-4 py-2 whitespace-nowrap"><input type="number" value={item.jumlah} onChange={(e) => handleTabDataChange(index, 'jumlah', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Qty" /></td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">Rp {(((alatHarga[item.alat]||0)*(Number(item.jumlah)||0)).toLocaleString('id-ID'))}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-sm font-medium text-text">Subtotal Barang: Rp {subtotalBarang.toLocaleString('id-ID')}</div>
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
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-sm font-medium text-text">Subtotal Barang: Rp {subtotalBarang.toLocaleString('id-ID')}</div>
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Satuan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Harga Akhir</th>
                    
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
                      <td className="px-4 py-2 whitespace-nowrap"><input type="text" value={item.projectRate} onChange={(e) => handleTabDataChange(index, 'projectRate', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Project Rate" /></td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">Rp {(((Number(item.projectRate)||0) + (tunjanganMap[item.tunjangan]||0)).toLocaleString('id-ID'))}</td>
                      <td className="px-4 py-2 whitespace-nowrap"><input type="number" value={item.hari} onChange={(e) => handleTabDataChange(index, 'hari', e.target.value)} className="w-full px-2 py-1 border border-border rounded-md bg-background text-text text-sm" placeholder="Qty" /></td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">Rp {((((Number(item.projectRate)||0) + (tunjanganMap[item.tunjangan]||0))*(Number(item.hari)||0)).toLocaleString('id-ID'))}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-sm font-medium text-text">Subtotal MobDemob: Rp {subtotalMobDemob.toLocaleString('id-ID')}</div>
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
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-sm font-medium text-text">Subtotal Biaya Lain-lain: Rp {subtotalLain.toLocaleString('id-ID')}</div>
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
