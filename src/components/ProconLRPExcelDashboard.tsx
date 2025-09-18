import React, { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';

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

const ProconLRPExcelDashboard: React.FC = () => {
  const [selectedSO, setSelectedSO] = useState('SO-IND-001');
  const [values, setValues] = useState<Record<string, number>>(dummyActual);
  const [plan, setPlan] = useState<Record<string, number>>(dummyPlan);

  const onChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: parseNumber(e.target.value) }));
  };
  const onChangePlan = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlan((prev) => ({ ...prev, [key]: parseNumber(e.target.value) }));
  };

  // Hitung total pendapatan dan biaya
  const totalPendPlan = plan['pendapatanKontrak'] || 0;
  const totalPendActual = values['pendapatanKontrak'] || 0;

  const biayaKeys = rows.filter((r) => r.section !== 'PENDAPATAN').map((r) => r.id);

  const totalBiayaPlan = useMemo(() => biayaKeys.reduce((s, k) => s + (plan[k] || 0), 0), [plan]);
  const totalBiayaActual = useMemo(() => biayaKeys.reduce((s, k) => s + (values[k] || 0), 0), [values]);

  const labaPlan = totalPendPlan - totalBiayaPlan;
  const labaActual = totalPendActual - totalBiayaActual;
  const marginPlan = totalPendPlan ? (labaPlan / totalPendPlan) * 100 : 0;
  const marginActual = totalPendActual ? (labaActual / totalPendActual) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laba Rugi Project</h1>
            <div className="text-sm text-gray-600">Procon › Laba Rugi Project</div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter No SO (tetap ditampilkan supaya bisa ganti) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih No SO terlebih dahulu</label>
          <input
            value={selectedSO}
            onChange={(e) => setSelectedSO(e.target.value)}
            placeholder="Masukkan Nomor SO (mis. SO-IND-001)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Excel-like summary */}
        {selectedSO && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Ringkasan Laba Rugi</h2>
              <div className="text-sm text-gray-600">SO: <span className="font-semibold">{selectedSO}</span></div>
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
