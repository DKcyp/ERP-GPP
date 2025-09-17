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
    pendapatanKontrak: 0,
    hppInduk: 0,
    tunjanganTimesheetTeknisi: 0,
    gaji: 0,
    purchaseRequest: 0,
    purchaseOrder: 0,
    kas: 0,
    bank: 0,
  });

  const totalBiaya = useMemo(() => {
    return (
      values.hppInduk +
      values.tunjanganTimesheetTeknisi +
      values.gaji +
      values.purchaseRequest +
      values.purchaseOrder +
      values.kas +
      values.bank
    );
  }, [values]);

  const labaRugi = useMemo(() => values.pendapatanKontrak - totalBiaya, [values, totalBiaya]);

  const onChange = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: parseNumber(e.target.value) }));
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
              <table className="min-w-[800px] w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Uraian</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Pendapatan Kontrak (Kontrak Deal)</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={values.pendapatanKontrak ? formatRp(values.pendapatanKontrak) : ''}
                        onChange={onChange('pendapatanKontrak')}
                        placeholder="Rp 0"
                        className="w-48 text-right px-2 py-1 border rounded-md"
                      />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900 font-medium">HPP Induk</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={values.hppInduk ? formatRp(values.hppInduk) : ''} onChange={onChange('hppInduk')} placeholder="Rp 0" className="w-48 text-right px-2 py-1 border rounded-md" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Tunjangan / Timesheet Teknisi</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={values.tunjanganTimesheetTeknisi ? formatRp(values.tunjanganTimesheetTeknisi) : ''} onChange={onChange('tunjanganTimesheetTeknisi')} placeholder="Rp 0" className="w-48 text-right px-2 py-1 border rounded-md" />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">Gaji</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={values.gaji ? formatRp(values.gaji) : ''} onChange={onChange('gaji')} placeholder="Rp 0" className="w-48 text-right px-2 py-1 border rounded-md" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Purchase Request</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={values.purchaseRequest ? formatRp(values.purchaseRequest) : ''} onChange={onChange('purchaseRequest')} placeholder="Rp 0" className="w-48 text-right px-2 py-1 border rounded-md" />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">Purchase Order</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={values.purchaseOrder ? formatRp(values.purchaseOrder) : ''} onChange={onChange('purchaseOrder')} placeholder="Rp 0" className="w-48 text-right px-2 py-1 border rounded-md" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Kas</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={values.kas ? formatRp(values.kas) : ''} onChange={onChange('kas')} placeholder="Rp 0" className="w-48 text-right px-2 py-1 border rounded-md" />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">Bank</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <input type="text" inputMode="numeric" value={values.bank ? formatRp(values.bank) : ''} onChange={onChange('bank')} placeholder="Rp 0" className="w-48 text-right px-2 py-1 border rounded-md" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900 font-semibold">Total Biaya</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">{formatRp(totalBiaya)}</td>
                  </tr>
                  <tr className={labaRugi >= 0 ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="px-4 py-2 text-sm text-gray-900 font-bold">Laba / Rugi</td>
                    <td className={`px-4 py-2 text-sm text-right font-bold ${labaRugi >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatRp(labaRugi)}</td>
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
