import React, { useMemo, useState } from 'react';
import { Clock, Search, Download } from 'lucide-react';

const formatRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
const formatSigned = (n: number) => (n >= 0 ? formatRp(n) : `(${formatRp(Math.abs(n))})`);

const parseNumber = (v: string) => {
  const num = Number((v || '').toString().replace(/[^(\d|\-|\.)]/g, ''));
  return Number.isFinite(num) ? num : 0;
};

// Struktur baris sesuai Excel
const rows = [
  { id: 'pendapatanKontrak', section: 'PENDAPATAN', label: 'Pendapatan Jasa Inspeksi (NDE Services)' },

  { id: 'tunjangan', section: 'Tenaga Kerja', label: 'Tunjangan Proyek Karyawan Tetap & Kontrak' },

  { id: 'matUtama', section: 'Material Langsung', label: 'Biaya Material Utama' },
  { id: 'matConsumable', section: 'Material Langsung', label: 'Biaya Consumable' },
  { id: 'matPeralatan', section: 'Material Langsung', label: 'Biaya Peralatan Proyek' },
  { id: 'matPendukung', section: 'Material Langsung', label: 'Biaya Material Pendukung' },
  { id: 'matProrate', section: 'Material Langsung', label: 'Biaya Prorate Equipment' },

  { id: 'atkRtp', section: 'ATK', label: 'Biaya Rumah Tangga Proyek' },

  { id: 'sewaKendaraan', section: 'Sewa', label: 'Biaya Kendaraan Proyek' },
  { id: 'sewaPeralatan', section: 'Sewa', label: 'Biaya Sewa Peralatan Proyek' },
  { id: 'sewaPenginapan', section: 'Sewa', label: 'Biaya Penginapan Proyek' },
  { id: 'sewaKendaraan2', section: 'Sewa', label: 'Biaya Sewa Kendaraan Proyek' },

  { id: 'perbaikan', section: 'Perbaikan dan Kalibrasi', label: 'Biaya Perbaikan dan Perlengkapan' },

  { id: 'hsePpe', section: 'HSE', label: 'Biaya PPE' },
  { id: 'hseMcu', section: 'HSE', label: 'Biaya MCU' },

  { id: 'adminProyek', section: 'Administrasi', label: 'Biaya Administrasi Proyek' },
  { id: 'bankGaransi', section: 'Administrasi', label: 'Biaya Bank Garansi' },

  { id: 'transportBarang', section: 'Transportasi', label: 'Biaya Pengiriman Barang Proyek' },
  { id: 'transport', section: 'Transportasi', label: 'Biaya Transport' },

  { id: 'entertain', section: 'Lain-lain', label: 'Entertaint & Incentive Marketing' },
  { id: 'hseAward', section: 'Lain-lain', label: 'Biaya HSE Award' },

  { id: 'foh', section: 'FOH rate', label: 'Biaya FOH 8%' },
  { id: 'bunga', section: 'FOH rate', label: 'Biaya Bunga' }
];

// Dummy Plan & Actual (diisi mirip screenshot supaya langsung terlihat)
const dummyPlan: Record<string, number> = {
  pendapatanKontrak: 26644461220,

  tunjangan: 3936329132,

  matUtama: 284790193,
  matConsumable: 3744495,
  matPeralatan: 0,
  matPendukung: 10661669,
  matProrate: 0,

  atkRtp: 8455796,

  sewaKendaraan: 718699609,
  sewaPeralatan: 0,
  sewaPenginapan: 11862304,
  sewaKendaraan2: 6000000,

  perbaikan: 7581000,

  hsePpe: 54024256,
  hseMcu: 120289062,

  adminProyek: 10451350,
  bankGaransi: 24153608,

  transportBarang: 8258497,
  transport: 588088661,

  entertain: 2479900,
  hseAward: 1271900,

  foh: 2131556898,
  bunga: 7223573
};

const dummyActual: Record<string, number> = {
  // beberapa actual sengaja berbeda untuk menunjukkan selisih
  ...dummyPlan,
  pendapatanKontrak: 7741342350,
  foh: 769728879.69,
  bunga: 7223573,
  tunjangan: 3936329132,
  matUtama: 284790193,
  accountDiffExample: 0
};

// Opsi SO Induk untuk autocomplete (mock, sinkron dengan halaman Procon lainnya)
const SO_OPTIONS = ['SO-IND-001', 'SO-IND-002', 'SO-IND-003'];

const ProconLRPExcelDashboard: React.FC = () => {
  const [selectedSO, setSelectedSO] = useState<string>('');
  const [values, setValues] = useState<Record<string, number>>(dummyActual);
  const [plan, setPlan] = useState<Record<string, number>>(dummyPlan);

  // Autocomplete states
  const [query, setQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [highlightIdx, setHighlightIdx] = useState<number>(-1);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const filteredSO = useMemo(
    () => SO_OPTIONS.filter((opt) => opt.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  const handleSearch = () => {
    const chosen = highlightIdx >= 0 && filteredSO[highlightIdx] ? filteredSO[highlightIdx] : query.trim();
    if (!chosen) return;
    setSelectedSO(chosen);
    setHasSearched(true);
    setOpen(false);
    setHighlightIdx(-1);
  };

  const handleSelect = (val: string) => {
    setQuery(val);
    setSelectedSO(val);
    setHasSearched(true);
    setOpen(false);
    setHighlightIdx(-1);
  };

  const onChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: parseNumber(e.target.value) }));
  };
  const onChangePlan = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlan((prev) => ({ ...prev, [key]: parseNumber(e.target.value) }));
  };

  // Hitung total pendapatan dan biaya
  const pendapatanKeys = rows.filter((r) => r.section === 'PENDAPATAN').map((r) => r.id);
  const totalPendPlan = useMemo(() => pendapatanKeys.reduce((s, k) => s + (plan[k] || 0), 0), [plan]);
  const totalPendActual = useMemo(() => pendapatanKeys.reduce((s, k) => s + (values[k] || 0), 0), [values]);

  const biayaKeys = rows.filter((r) => r.section !== 'PENDAPATAN').map((r) => r.id);

  const totalBiayaPlan = useMemo(() => biayaKeys.reduce((s, k) => s + (plan[k] || 0), 0), [plan]);
  const totalBiayaActual = useMemo(() => biayaKeys.reduce((s, k) => s + (values[k] || 0), 0), [values]);

  const labaPlan = totalPendPlan - totalBiayaPlan;
  const labaActual = totalPendActual - totalBiayaActual;
  const marginPlan = totalPendPlan ? (labaPlan / totalPendPlan) * 100 : 0;
  const marginActual = totalPendActual ? (labaActual / totalPendActual) * 100 : 0;

  // Fungsi export ke Excel
  const exportToExcel = () => {
    if (!selectedSO) {
      alert('Pilih nomor SO terlebih dahulu');
      return;
    }

    // Buat data untuk export
    const exportData = [];
    
    // Header
    exportData.push(['Laba Rugi Project - ' + selectedSO]);
    exportData.push(['Tanggal Export:', new Date().toLocaleString('id-ID')]);
    exportData.push([]);
    
    // Table header
    exportData.push(['No.', 'Uraian', 'Plan', 'Actual', 'Actual + Forecast', 'Actual Dari Plans', '%']);
    
    // Pendapatan
    exportData.push(['I', 'PENDAPATAN', '', '', '', '', '']);
    rows.filter(r => r.section === 'PENDAPATAN').forEach((r, idx) => {
      const planVal = plan[r.id] || 0;
      const actualVal = values[r.id] || 0;
      const diff = actualVal - planVal;
      const percentage = planVal ? ((diff / planVal) * 100).toFixed(2) + '%' : '#DIV/0!';
      
      exportData.push([
        idx + 1,
        r.label,
        planVal,
        actualVal,
        actualVal,
        diff,
        percentage
      ]);
    });
    
    // Total Pendapatan
    exportData.push([
      '',
      'Total Pendapatan',
      totalPendPlan,
      totalPendActual,
      totalPendActual,
      totalPendActual - totalPendPlan,
      totalPendPlan ? (((totalPendActual - totalPendPlan) / totalPendPlan) * 100).toFixed(2) + '%' : '#DIV/0!'
    ]);
    
    // Biaya
    exportData.push(['II', 'BIAYA', '', '', '', '', '']);
    
    const sections = [
      'Tenaga Kerja', 'Material Langsung', 'ATK', 'Sewa',
      'Perbaikan dan Kalibrasi', 'HSE', 'Administrasi',
      'Transportasi', 'Lain-lain', 'FOH rate'
    ];
    
    sections.forEach(section => {
      exportData.push(['', section, '', '', '', '', '']);
      
      rows.filter(r => r.section === section).forEach((r, idx) => {
        const planVal = plan[r.id] || 0;
        const actualVal = values[r.id] || 0;
        const diff = actualVal - planVal;
        const percentage = planVal ? ((diff / planVal) * 100).toFixed(2) + '%' : '#DIV/0!';
        
        exportData.push([
          idx + 1,
          '  ' + r.label,
          planVal,
          actualVal,
          actualVal,
          diff,
          percentage
        ]);
      });
    });
    
    // Total Biaya
    exportData.push([
      '',
      'Total Biaya Pengeluaran',
      totalBiayaPlan,
      totalBiayaActual,
      totalBiayaActual,
      totalBiayaActual - totalBiayaPlan,
      totalBiayaPlan ? (((totalBiayaActual - totalBiayaPlan) / totalBiayaPlan) * 100).toFixed(2) + '%' : '#DIV/0!'
    ]);
    
    // Laba Rugi
    exportData.push([
      '',
      'LABA - RUGI',
      labaPlan,
      labaActual,
      labaActual,
      labaActual - labaPlan,
      labaPlan ? (((labaActual - labaPlan) / labaPlan) * 100).toFixed(2) + '%' : '#DIV/0!'
    ]);
    
    // Margin
    exportData.push([
      '',
      'MARGIN',
      marginPlan.toFixed(2) + '%',
      marginActual.toFixed(2) + '%',
      marginActual.toFixed(2) + '%',
      '',
      ''
    ]);

    // Convert ke CSV dan download
    const csvContent = exportData.map(row => 
      row.map(cell => {
        if (typeof cell === 'number') {
          return cell.toString();
        }
        return `"${cell.toString().replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Laba_Rugi_${selectedSO}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laba Rugi Project</h1>
            <div className="text-sm text-gray-600">Procon › Laba Rugi Project</div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportToExcel}
              disabled={!hasSearched || !selectedSO}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                hasSearched && selectedSO
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="h-4 w-4" />
              Export Excel
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter No SO (tetap ditampilkan supaya bisa ganti) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cari Nomor SO Induk</label>
          <div className="flex items-start gap-3">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                  setHighlightIdx(-1);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 100)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setOpen(true);
                    setHighlightIdx((prev) => Math.min(prev + 1, Math.max(0, filteredSO.length - 1)));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlightIdx((prev) => Math.max(prev - 1, 0));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  } else if (e.key === 'Escape') {
                    setOpen(false);
                  }
                }}
                placeholder="Ketik Nomor SO (mis. SO-IND-001), lalu Enter atau klik Cari"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* Dropdown */}
              {open && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredSO.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">Tidak ada hasil</div>
                  )}
                  {filteredSO.map((opt, idx) => (
                    <div
                      key={opt}
                      className={`px-3 py-2 text-sm cursor-pointer ${idx === highlightIdx ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                      onMouseDown={() => handleSelect(opt)}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Cari
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Pilih dari daftar atau tekan Enter untuk menampilkan data.</p>
        </div>

        {/* Excel-like summary */}
        {hasSearched && selectedSO && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Ringkasan Laba Rugi</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">SO: <span className="font-semibold">{selectedSO}</span></div>
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Download className="h-4 w-4" />
                  Export Excel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 w-16">No.</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Uraian</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Plan</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actual</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actual + Forecast</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actual Dari Plans</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {/* Pendapatan header */}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-4 py-2 text-sm">I</td>
                    <td className="px-4 py-2 text-sm">PENDAPATAN</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  {/* Pendapatan row(s) */}
                  {rows.filter((r) => r.section === 'PENDAPATAN').map((r, idx) => (
                    <tr key={r.id}>
                      <td className="px-4 py-2 text-sm">{idx + 1}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{r.label}</td>
                      <td className="px-4 py-2 text-sm text-right">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={plan[r.id] ? formatRp(plan[r.id]) : ''}
                          onChange={onChangePlan(r.id)}
                          placeholder="Rp 0"
                          className="w-48 text-right px-2 py-1 border rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={values[r.id] ? formatRp(values[r.id]) : ''}
                          onChange={onChange(r.id)}
                          placeholder="Rp 0"
                          className="w-48 text-right px-2 py-1 border rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-right">{formatRp(values[r.id] || 0)}</td>
                      <td className={`px-4 py-2 text-sm text-right ${(values[r.id] || 0) - (plan[r.id] || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatSigned((values[r.id] || 0) - (plan[r.id] || 0))}
                      </td>
                      <td className="px-4 py-2 text-sm text-right">{plan[r.id] ? ((((values[r.id] || 0) - (plan[r.id] || 0)) / plan[r.id]) * 100).toFixed(2) + '%' : '#DIV/0!'}</td>
                    </tr>
                  ))}

                  {/* Total Pendapatan */}
                  <tr className="font-semibold">
                    <td></td>
                    <td className="px-4 py-2 text-sm">Total Pendapatan</td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(totalPendPlan)}</td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(totalPendActual)}</td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(totalPendActual)}</td>
                    <td className={`px-4 py-2 text-sm text-right ${totalPendActual - totalPendPlan < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatSigned(totalPendActual - totalPendPlan)}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">{totalPendPlan ? (((totalPendActual - totalPendPlan) / totalPendPlan) * 100).toFixed(2) + '%' : '#DIV/0!'}</td>
                  </tr>

                  {/* BIAYA header */}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-4 py-2 text-sm">II</td>
                    <td className="px-4 py-2 text-sm">BIAYA</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  {/* Grouped sections */}
                  {[
                    'Tenaga Kerja',
                    'Material Langsung',
                    'ATK',
                    'Sewa',
                    'Perbaikan dan Kalibrasi',
                    'HSE',
                    'Administrasi',
                    'Transportasi',
                    'Lain-lain',
                    'FOH rate'
                  ].map((section) => (
                    <React.Fragment key={section}>
                      <tr className="bg-white">
                        <td className="px-4 py-2 text-sm"></td>
                        <td className="px-4 py-2 text-sm font-semibold">{section}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>

                      {rows
                        .filter((r) => r.section === section)
                        .map((r, idx) => (
                          <tr key={r.id}>
                            <td className="px-4 py-2 text-sm">{idx + 1}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 pl-6">{r.label}</td>

                            <td className="px-4 py-2 text-sm text-right">
                              <input
                                type="text"
                                inputMode="numeric"
                                value={plan[r.id] ? formatRp(plan[r.id]) : ''}
                                onChange={onChangePlan(r.id)}
                                placeholder="Rp 0"
                                className="w-48 text-right px-2 py-1 border rounded-md"
                              />
                            </td>

                            <td className="px-4 py-2 text-sm text-right">
                              <input
                                type="text"
                                inputMode="numeric"
                                value={values[r.id] ? formatRp(values[r.id]) : ''}
                                onChange={onChange(r.id)}
                                placeholder="Rp 0"
                                className="w-48 text-right px-2 py-1 border rounded-md"
                              />
                            </td>

                            <td className="px-4 py-2 text-sm text-right">{formatRp(values[r.id] || 0)}</td>

                            <td className={`px-4 py-2 text-sm text-right ${(values[r.id] || 0) - (plan[r.id] || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {formatSigned((values[r.id] || 0) - (plan[r.id] || 0))}
                            </td>

                            <td className="px-4 py-2 text-sm text-right">
                              {plan[r.id] ? ((((values[r.id] || 0) - (plan[r.id] || 0)) / plan[r.id]) * 100).toFixed(2) + '%' : '#DIV/0!'}
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}

                  {/* Total Biaya Pengeluaran */}
                  <tr className="bg-gray-100 font-semibold">
                    <td></td>
                    <td className="px-4 py-2 text-sm">Total Biaya Pengeluaran</td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(totalBiayaPlan)}</td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(totalBiayaActual)}</td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(totalBiayaActual)}</td>
                    <td className={`px-4 py-2 text-sm text-right ${totalBiayaActual - totalBiayaPlan < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatSigned(totalBiayaActual - totalBiayaPlan)}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">{totalBiayaPlan ? (((totalBiayaActual - totalBiayaPlan) / totalBiayaPlan) * 100).toFixed(2) + '%' : '#DIV/0!'}</td>
                  </tr>

                  {/* Laba / Rugi */}
                  <tr className={labaActual >= 0 ? 'bg-green-50' : 'bg-red-50'}>
                    <td></td>
                    <td className="px-4 py-2 text-sm font-bold text-gray-900">LABA - RUGI</td>
                    <td className="px-4 py-2 text-sm text-right font-bold">{formatRp(labaPlan)}</td>
                    <td className={`px-4 py-2 text-sm text-right font-bold ${labaActual >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {formatRp(labaActual)}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right font-bold ${labaActual >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {formatRp(labaActual)}
                    </td>
                    <td className="px-4 py-2 text-sm text-right font-bold">{formatSigned(labaActual - labaPlan)}</td>
                    <td className="px-4 py-2 text-sm text-right font-bold">{labaPlan ? (((labaActual - labaPlan) / labaPlan) * 100).toFixed(2) + '%' : '#DIV/0!'}</td>
                  </tr>

                  {/* Margin */}
                  <tr className="bg-yellow-100 font-semibold">
                    <td></td>
                    <td className="px-4 py-2 text-sm">MARGIN</td>
                    <td className="px-4 py-2 text-sm text-right">{marginPlan.toFixed(2)}%</td>
                    <td className="px-4 py-2 text-sm text-right">{marginActual.toFixed(2)}%</td>
                    <td className="px-4 py-2 text-sm text-right">{marginActual.toFixed(2)}%</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProconLRPExcelDashboard;
