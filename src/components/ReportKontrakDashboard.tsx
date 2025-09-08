import React, { useMemo, useState } from 'react';
import { Clock, Search, FileSpreadsheet, FileText } from 'lucide-react';

interface SalesOrderItem {
  soNumber: string;
  tanggalMOB: string;
  tanggalDemob?: string;
  nilai: number;
  status: 'Open' | 'Closed';
}

interface KontrakItem {
  id: string;
  nomorKontrak: string;
  namaClient: string;
  tglKontrak: string;
  nilaiKontrak: number;
  salesOrders: SalesOrderItem[];
}

const currency = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const sampleData: KontrakItem[] = [
  {
    id: 'KTR-001',
    nomorKontrak: 'KTR/001/IX/2025',
    namaClient: 'PT Nusantara Jaya',
    tglKontrak: '2025-08-18',
    nilaiKontrak: 175000000,
    salesOrders: [
      { soNumber: 'SO-2025-0001', tanggalMOB: '2025-08-20', tanggalDemob: '2025-09-05', nilai: 75000000, status: 'Open' },
      { soNumber: 'SO-2025-0003', tanggalMOB: '2025-08-29', tanggalDemob: '2025-09-12', nilai: 100000000, status: 'Closed' },
    ],
  },
  {
    id: 'KTR-002',
    nomorKontrak: 'KTR/002/IX/2025',
    namaClient: 'PT Samudra Teknik',
    tglKontrak: '2025-08-21',
    nilaiKontrak: 98000000,
    salesOrders: [
      { soNumber: 'SO-2025-0005', tanggalMOB: '2025-08-25', tanggalDemob: '2025-09-03', nilai: 98000000, status: 'Closed' },
    ],
  },
  {
    id: 'KTR-003',
    nomorKontrak: 'KTR/003/X/2025',
    namaClient: 'PT Bumi Sentosa',
    tglKontrak: '2025-10-05',
    nilaiKontrak: 200000000,
    salesOrders: [
      { soNumber: 'SO-2025-0010', tanggalMOB: '2025-10-10', tanggalDemob: '2025-10-25', nilai: 80000000, status: 'Open' },
      { soNumber: 'SO-2025-0015', tanggalMOB: '2025-10-15', tanggalDemob: '2025-10-29', nilai: 40000000, status: 'Closed' },
    ],
  },
];

const StatusBadge: React.FC<{ status: SalesOrderItem['status'] }> = ({ status }) => {
  const color = {
    Open: 'bg-blue-100 text-blue-700',
    Closed: 'bg-green-100 text-green-700',
  }[status];
  return <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${color}`}>{status}</span>;
};

const ReportKontrakDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(''); // input value YYYY-MM
  const [selectedClient, setSelectedClient] = useState('');
  const [appliedMonth, setAppliedMonth] = useState('');
  const [appliedClient, setAppliedClient] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<KontrakItem | null>(null);

  const data = sampleData; // TODO: Replace with API data when available

  const clientOptions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((d) => set.add(d.namaClient));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((d) => {
      const matchMonth = appliedMonth
        ? d.tglKontrak.slice(0, 7) === appliedMonth
        : true;
      const matchClient = appliedClient
        ? d.namaClient === appliedClient
        : true;
      return matchMonth && matchClient;
    });
  }, [data, appliedMonth, appliedClient]);

  const handleSearch = () => {
    setAppliedMonth(selectedMonth);
    setAppliedClient(selectedClient);
  };

  const openDetail = (item: KontrakItem) => {
    setSelected(item);
    setDetailOpen(true);
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'No Kontrak',
      'Client',
      'Tanggal',
      'Nilai Kontrak',
      'Digunakan',
      'Sisa',
      'Total SO',
    ];
    const rows = filtered.map((row) => {
      const used = row.salesOrders.reduce((sum, so) => sum + (so.nilai || 0), 0);
      const remain = Math.max(0, row.nilaiKontrak - used);
      return [
        row.id,
        row.nomorKontrak,
        row.namaClient,
        row.tglKontrak,
        row.nilaiKontrak,
        used,
        remain,
        row.salesOrders.length,
      ];
    });
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report_kontrak.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const rowsHtml = filtered
      .map((row) => {
        const used = row.salesOrders.reduce((sum, so) => sum + (so.nilai || 0), 0);
        const remain = Math.max(0, row.nilaiKontrak - used);
        return `
          <tr>
            <td style="padding:6px 8px;border:1px solid #e5e7eb;">${row.id}</td>
            <td style="padding:6px 8px;border:1px solid #e5e7eb;">${row.nomorKontrak}</td>
            <td style="padding:6px 8px;border:1px solid #e5e7eb;">${row.namaClient}</td>
            <td style="padding:6px 8px;border:1px solid #e5e7eb;">${row.tglKontrak}</td>
            <td style="padding:6px 8px;border:1px solid #e5e7eb;">${row.nilaiKontrak.toLocaleString('id-ID')}</td>
            <td style="padding:6px 8px;border:1px solid #e5e7eb;">${used.toLocaleString('id-ID')}</td>
            <td style="padding:6px 8px;border:1px solid #e5e7eb;">${remain.toLocaleString('id-ID')}</td>
            <td style="padding:6px 8px;border:1px solid #e5e7eb;">${row.salesOrders.length}</td>
          </tr>`;
      })
      .join('');
    win.document.write(`
      <html>
      <head>
        <title>Report Kontrak</title>
        <meta charset="utf-8" />
        <style>
          body{ font-family: Arial, sans-serif; padding: 20px; }
          h1{ font-size: 18px; margin-bottom: 12px; }
          table{ border-collapse: collapse; width: 100%; font-size: 12px; }
          th{ background:#f9fafb; text-align:left; padding:6px 8px; border:1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <h1>Report Kontrak</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>No Kontrak</th>
              <th>Client</th>
              <th>Tanggal</th>
              <th>Nilai Kontrak</th>
              <th>Digunakan</th>
              <th>Sisa</th>
              <th>Total SO</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <script>window.print();</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                REPORT KONTRAK
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Report Kontrak</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
        {/* Filter/Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="flex items-center gap-2">
              <div className="space-y-1 w-full">
                <label className="block text-xs text-gray-600">Bulan</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="space-y-1 w-full">
                <label className="block text-xs text-gray-600">Client</label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Semua Client</option>
                  {clientOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleSearch}
                className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-200 flex items-center gap-2 text-xs"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
              <button
                onClick={exportToCSV}
                className="px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 transition-all duration-200 flex items-center gap-2 text-xs"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={exportToPDF}
                className="px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 transition-all duration-200 flex items-center gap-2 text-xs"
              >
                <FileText className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">No. Kontrak</th>
              <th className="text-left px-4 py-2">Client</th>
              <th className="text-left px-4 py-2">Tanggal</th>
              <th className="text-right px-4 py-2">Nilai Kontrak</th>
              <th className="text-right px-4 py-2">Digunakan</th>
              <th className="text-right px-4 py-2">Sisa</th>
              <th className="text-center px-4 py-2">Total SO</th>
              <th className="text-center px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const used = row.salesOrders.reduce((sum, so) => sum + (so.nilai || 0), 0);
              const remain = Math.max(0, row.nilaiKontrak - used);
              return (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-2">{row.id}</td>
                <td className="px-4 py-2">{row.nomorKontrak}</td>
                <td className="px-4 py-2">{row.namaClient}</td>
                <td className="px-4 py-2">{row.tglKontrak}</td>
                <td className="px-4 py-2 text-right">{currency(row.nilaiKontrak)}</td>
                <td className="px-4 py-2 text-right">{currency(used)}</td>
                <td className={`px-4 py-2 text-right ${remain === 0 ? 'text-red-600 font-semibold' : ''}`}>{currency(remain)}</td>
                <td className="px-4 py-2 text-center">{row.salesOrders.length}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded-md text-[11px] hover:bg-blue-700"
                    onClick={() => openDetail(row)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-gray-500">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        {detailOpen && selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg border border-gray-200">
            <div className="p-3 border-b flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Detail Sales Order</h2>
                <p className="text-[11px] text-gray-500">
                  Kontrak {selected.nomorKontrak} - {selected.namaClient}
                </p>
              </div>
              <button
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                onClick={() => setDetailOpen(false)}
              >Tutup</button>
            </div>

            <div className="p-3">
              <div className="overflow-auto border border-gray-200 rounded-lg">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-3 py-2">No. SO</th>
                      <th className="text-left px-3 py-2">Tanggal MOB</th>
                      <th className="text-left px-3 py-2">Tanggal Demob</th>
                      <th className="text-right px-3 py-2">Nilai</th>
                      <th className="text-left px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const sorted = [...selected.salesOrders].sort((a, b) => a.tanggalMOB.localeCompare(b.tanggalMOB));
                      const lastIdx = sorted.length - 1;
                      let prevDisplayDemob: string | undefined = undefined;
                      return sorted.map((so, idx) => {
                        // derive display MOB from previous row's displayed Demob when available
                        const baseMOB = so.tanggalMOB;
                        const displayMOB = idx === 0 ? baseMOB : (prevDisplayDemob || baseMOB);
                        // ensure Demob is not earlier than MOB; if missing, use MOB
                        let displayDemob = so.tanggalDemob && so.tanggalDemob >= displayMOB ? so.tanggalDemob : displayMOB;
                        prevDisplayDemob = displayDemob;
                        const displayStatus: 'Open' | 'Closed' = idx === lastIdx ? 'Open' : 'Closed';
                        return (
                          <tr key={so.soNumber} className="border-t">
                            <td className="px-3 py-2">{so.soNumber}</td>
                            <td className="px-3 py-2">{displayMOB}</td>
                            <td className="px-3 py-2">{displayDemob || '-'}</td>
                            <td className="px-3 py-2 text-right">{currency(so.nilai)}</td>
                            <td className="px-3 py-2"><StatusBadge status={displayStatus} /></td>
                          </tr>
                        );
                      });
                    })()}
                    {selected.salesOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-gray-500">Belum ada Sales Order</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ReportKontrakDashboard;
