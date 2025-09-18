import React, { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';

const formatRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

const parseNumber = (v: string) => {
  const num = Number(v.replace(/[^\d.-]/g, ''));
  return Number.isFinite(num) ? num : 0;
};

const ProconLRPExcelDashboard: React.FC = () => {
  const [selectedSO, setSelectedSO] = useState<string>('');
  const [values, setValues] = useState({
    pendapatanKontrak: 1400000000,
    hppInduk: 920000000,
    tunjanganTimesheetTeknisi: 75000000,
    gaji: 115000000,
    purchaseRequest: 50000000,
    purchaseOrder: 55000000,
    kas: 18000000,
    bank: 12000000,
  });
  const [plan, setPlan] = useState({
    pendapatanKontrak: 1500000000,
    hppInduk: 900000000,
    tunjanganTimesheetTeknisi: 80000000,
    gaji: 120000000,
    purchaseRequest: 40000000,
    purchaseOrder: 60000000,
    kas: 20000000,
    bank: 10000000,
  });

  // removed older simple totals; replaced by Excel-like computed helpers below

  

  const onChange = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: parseNumber(e.target.value) }));
  };
  const onChangePlan = (key: keyof typeof plan) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlan((prev) => ({ ...prev, [key]: parseNumber(e.target.value) }));
  };

  // Helpers for Excel-like totals
  const sum = (obj: Record<string, number>, keys: string[]) => keys.reduce((s, k) => s + (obj[k] || 0), 0);
  const biayaKeys = ['hppInduk','tunjanganTimesheetTeknisi','gaji','purchaseRequest','purchaseOrder','kas','bank'];
  const totalBiayaPlanExcel = useMemo(() => sum(plan as any, biayaKeys), [plan]);
  const totalBiayaActualExcel = useMemo(() => sum(values as any, biayaKeys), [values]);
  const totalPendPlan = plan.pendapatanKontrak;
  const totalPendActual = values.pendapatanKontrak;
  const totalPendAF = totalPendActual; // Forecast 0 for now
  const labaPlanExcel = useMemo(() => totalPendPlan - totalBiayaPlanExcel, [totalPendPlan, totalBiayaPlanExcel]);
  const labaActualExcel = useMemo(() => totalPendActual - totalBiayaActualExcel, [totalPendActual, totalBiayaActualExcel]);
  const labaAFExcel = useMemo(() => totalPendAF - totalBiayaActualExcel, [totalPendAF, totalBiayaActualExcel]);

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
        {/* Filter No SO (required) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih No SO terlebih dahulu</label>
          <input
            value={selectedSO}
            onChange={(e) => setSelectedSO(e.target.value)}
            placeholder="Masukkan Nomor SO (mis. SO-IND-001 atau SO-TRN-001-A)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {!selectedSO && (
            <p className="text-xs text-gray-500 mt-2">Isi nomor SO untuk menampilkan form ringkasan Laba Rugi sesuai template Excel.</p>
          )}
        </div>

        {/* Excel-like summary, only after SO selected */}
        {selectedSO && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Ringkasan Laba Rugi</h2>
              <div className="text-sm text-gray-600">SO: <span className="font-semibold">{selectedSO}</span></div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Uraian</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Plan</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actual</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actual + Forecast</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actual dari Plan Amount</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Pendapatan Kontrak (Kontrak Deal)</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={plan.pendapatanKontrak ? formatRp(plan.pendapatanKontrak) : ''} onChange={onChangePlan('pendapatanKontrak')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" />
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={values.pendapatanKontrak ? formatRp(values.pendapatanKontrak) : ''} onChange={onChange('pendapatanKontrak')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" />
                    </td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(values.pendapatanKontrak)}</td>
                    {(() => { const v = values.pendapatanKontrak - plan.pendapatanKontrak; const p = plan.pendapatanKontrak ? (v / plan.pendapatanKontrak) * 100 : null; return (
                      <>
                        <td className={`px-4 py-2 text-sm text-right ${v < 0 ? 'text-red-700 bg-red-50' : ''}`}>{v >= 0 ? formatRp(v) : `(${formatRp(Math.abs(v))})`}</td>
                        <td className="px-4 py-2 text-sm text-right">{p === null ? '#DIV/0!' : `${p.toFixed(2)}%`}</td>
                      </>
                    ); })()}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900 font-medium">HPP Induk</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={plan.hppInduk ? formatRp(plan.hppInduk) : ''} onChange={onChangePlan('hppInduk')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" />
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={values.hppInduk ? formatRp(values.hppInduk) : ''} onChange={onChange('hppInduk')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" />
                    </td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(values.hppInduk)}</td>
                    {(() => { const v = values.hppInduk - plan.hppInduk; const p = plan.hppInduk ? (v / plan.hppInduk) * 100 : null; return (
                      <>
                        <td className={`px-4 py-2 text-sm text-right ${v < 0 ? 'text-red-700 bg-red-50' : ''}`}>{v >= 0 ? formatRp(v) : `(${formatRp(Math.abs(v))})`}</td>
                        <td className="px-4 py-2 text-sm text-right">{p === null ? '#DIV/0!' : `${p.toFixed(2)}%`}</td>
                      </>
                    ); })()}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Tunjangan / Timesheet Teknisi</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={plan.tunjanganTimesheetTeknisi ? formatRp(plan.tunjanganTimesheetTeknisi) : ''} onChange={onChangePlan('tunjanganTimesheetTeknisi')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" />
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={values.tunjanganTimesheetTeknisi ? formatRp(values.tunjanganTimesheetTeknisi) : ''} onChange={onChange('tunjanganTimesheetTeknisi')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" />
                    </td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(values.tunjanganTimesheetTeknisi)}</td>
                    {(() => { const v = values.tunjanganTimesheetTeknisi - plan.tunjanganTimesheetTeknisi; const p = plan.tunjanganTimesheetTeknisi ? (v / plan.tunjanganTimesheetTeknisi) * 100 : null; return (
                      <>
                        <td className={`px-4 py-2 text-sm text-right ${v < 0 ? 'text-red-700 bg-red-50' : ''}`}>{v >= 0 ? formatRp(v) : `(${formatRp(Math.abs(v))})`}</td>
                        <td className="px-4 py-2 text-sm text-right">{p === null ? '#DIV/0!' : `${p.toFixed(2)}%`}</td>
                      </>
                    ); })()}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">Gaji</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={plan.gaji ? formatRp(plan.gaji) : ''} onChange={onChangePlan('gaji')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" />
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={values.gaji ? formatRp(values.gaji) : ''} onChange={onChange('gaji')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" />
                    </td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(values.gaji)}</td>
                    {(() => { const v = values.gaji - plan.gaji; const p = plan.gaji ? (v / plan.gaji) * 100 : null; return (
                      <>
                        <td className={`px-4 py-2 text-sm text-right ${v < 0 ? 'text-red-700 bg-red-50' : ''}`}>{v >= 0 ? formatRp(v) : `(${formatRp(Math.abs(v))})`}</td>
                        <td className="px-4 py-2 text-sm text-right">{p === null ? '#DIV/0!' : `${p.toFixed(2)}%`}</td>
                      </>
                    ); })()}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Purchase Request</td>
                    <td className="px-4 py-2 text-sm text-right"><input type="text" inputMode="numeric" value={plan.purchaseRequest ? formatRp(plan.purchaseRequest) : ''} onChange={onChangePlan('purchaseRequest')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" /></td>
                    <td className="px-4 py-2 text-sm text-right"><input type="text" inputMode="numeric" value={values.purchaseRequest ? formatRp(values.purchaseRequest) : ''} onChange={onChange('purchaseRequest')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" /></td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(values.purchaseRequest)}</td>
                    {(() => { const v = values.purchaseRequest - plan.purchaseRequest; const p = plan.purchaseRequest ? (v / plan.purchaseRequest) * 100 : null; return (
                      <>
                        <td className={`px-4 py-2 text-sm text-right ${v < 0 ? 'text-red-700 bg-red-50' : ''}`}>{v >= 0 ? formatRp(v) : `(${formatRp(Math.abs(v))})`}</td>
                        <td className="px-4 py-2 text-sm text-right">{p === null ? '#DIV/0!' : `${p.toFixed(2)}%`}</td>
                      </>
                    ); })()}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">Purchase Order</td>
                    <td className="px-4 py-2 text-sm text-right"><input type="text" inputMode="numeric" value={plan.purchaseOrder ? formatRp(plan.purchaseOrder) : ''} onChange={onChangePlan('purchaseOrder')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" /></td>
                    <td className="px-4 py-2 text-sm text-right"><input type="text" inputMode="numeric" value={values.purchaseOrder ? formatRp(values.purchaseOrder) : ''} onChange={onChange('purchaseOrder')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" /></td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(values.purchaseOrder)}</td>
                    {(() => { const v = values.purchaseOrder - plan.purchaseOrder; const p = plan.purchaseOrder ? (v / plan.purchaseOrder) * 100 : null; return (
                      <>
                        <td className={`px-4 py-2 text-sm text-right ${v < 0 ? 'text-red-700 bg-red-50' : ''}`}>{v >= 0 ? formatRp(v) : `(${formatRp(Math.abs(v))})`}</td>
                        <td className="px-4 py-2 text-sm text-right">{p === null ? '#DIV/0!' : `${p.toFixed(2)}%`}</td>
                      </>
                    ); })()}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Kas</td>
                    <td className="px-4 py-2 text-sm text-right"><input type="text" inputMode="numeric" value={plan.kas ? formatRp(plan.kas) : ''} onChange={onChangePlan('kas')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" /></td>
                    <td className="px-4 py-2 text-sm text-right"><input type="text" inputMode="numeric" value={values.kas ? formatRp(values.kas) : ''} onChange={onChange('kas')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" /></td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(values.kas)}</td>
                    {(() => { const v = values.kas - plan.kas; const p = plan.kas ? (v / plan.kas) * 100 : null; return (
                      <>
                        <td className={`px-4 py-2 text-sm text-right ${v < 0 ? 'text-red-700 bg-red-50' : ''}`}>{v >= 0 ? formatRp(v) : `(${formatRp(Math.abs(v))})`}</td>
                        <td className="px-4 py-2 text-sm text-right">{p === null ? '#DIV/0!' : `${p.toFixed(2)}%`}</td>
                      </>
                    ); })()}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">Bank</td>
                    <td className="px-4 py-2 text-sm text-right"><input type="text" inputMode="numeric" value={plan.bank ? formatRp(plan.bank) : ''} onChange={onChangePlan('bank')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" /></td>
                    <td className="px-4 py-2 text-sm text-right"><input type="text" inputMode="numeric" value={values.bank ? formatRp(values.bank) : ''} onChange={onChange('bank')} placeholder="Rp 0" className="w-40 text-right px-2 py-1 border rounded-md" /></td>
                    <td className="px-4 py-2 text-sm text-right">{formatRp(values.bank)}</td>
                    {(() => { const v = values.bank - plan.bank; const p = plan.bank ? (v / plan.bank) * 100 : null; return (
                      <>
                        <td className={`px-4 py-2 text-sm text-right ${v < 0 ? 'text-red-700 bg-red-50' : ''}`}>{v >= 0 ? formatRp(v) : `(${formatRp(Math.abs(v))})`}</td>
                        <td className="px-4 py-2 text-sm text-right">{p === null ? '#DIV/0!' : `${p.toFixed(2)}%`}</td>
                      </>
                    ); })()}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900 font-semibold">Total Biaya</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">{formatRp(totalBiayaPlanExcel)}</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">{formatRp(totalBiayaActualExcel)}</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">{formatRp(totalBiayaActualExcel)}</td>
                    {(() => { const v = totalBiayaActualExcel - totalBiayaPlanExcel; const p = totalBiayaPlanExcel ? (v / totalBiayaPlanExcel) * 100 : null; return (
                      <>
                        <td className={`px-4 py-2 text-sm text-right font-semibold ${v < 0 ? 'text-red-700 bg-red-50' : ''}`}>{v >= 0 ? formatRp(v) : `(${formatRp(Math.abs(v))})`}</td>
                        <td className="px-4 py-2 text-sm text-right font-semibold">{p === null ? '#DIV/0!' : `${p.toFixed(2)}%`}</td>
                      </>
                    ); })()}
                  </tr>
                  <tr className={labaActualExcel >= 0 ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="px-4 py-2 text-sm text-gray-900 font-bold">Laba / Rugi</td>
                    <td className="px-4 py-2 text-sm text-right font-bold">{formatRp(labaPlanExcel)}</td>
                    <td className={`px-4 py-2 text-sm text-right font-bold ${labaActualExcel >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatRp(labaActualExcel)}</td>
                    <td className={`px-4 py-2 text-sm text-right font-bold ${labaAFExcel >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatRp(labaAFExcel)}</td>
                    {(() => { const v = labaActualExcel - labaPlanExcel; const p = labaPlanExcel ? (v / labaPlanExcel) * 100 : null; return (
                      <>
                        <td className={`px-4 py-2 text-sm text-right font-bold ${v < 0 ? 'text-red-700 bg-red-50' : ''}`}>{v >= 0 ? formatRp(v) : `(${formatRp(Math.abs(v))})`}</td>
                        <td className="px-4 py-2 text-sm text-right font-bold">{p === null ? '#DIV/0!' : `${p.toFixed(2)}%`}</td>
                      </>
                    ); })()}
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
