import React, { useMemo, useState } from 'react';
import { ChevronDown, Search, Filter, Printer, FileDown } from 'lucide-react';

interface PRItem {
  id: number;
  tanggalPR: string;
  noPR: string;
  noSO: string;
  departemen: string;
  keterangan: string;
  statusPR: 'Approve' | 'Rejected' | 'Pending';
  statusPO: 'PO' | '-';
  noPO: string;
  statusDO: 'Delivered' | 'Received' | 'BA' | '-';
}

const initialData: PRItem[] = [
  { id: 1,  tanggalPR: '07-02-2025', noPR: 'PR001', noSO: 'SO001.22', noPO: 'PO-001', departemen: 'HRD',         keterangan: 'Jasa Pelatihan Karyawan',         statusPR: 'Approve',  statusPO: 'PO', statusDO: 'Delivered' },
  { id: 2,  tanggalPR: '08-02-2025', noPR: 'PR002', noSO: 'SO002.12', noPO: '-',      departemen: 'Finance',     keterangan: 'Pembelian Software Akuntansi',    statusPR: 'Pending',  statusPO: '-',  statusDO: '-' },
  { id: 3,  tanggalPR: '09-02-2025', noPR: 'PR003', noSO: 'SO003.33', noPO: '-',      departemen: 'HRD',         keterangan: 'Jasa Pelatihan Karyawan',         statusPR: 'Pending',  statusPO: '-',  statusDO: 'BA' },
  { id: 4,  tanggalPR: '10-02-2025', noPR: 'PR004', noSO: 'SO004.90', noPO: 'PO-002', departemen: 'Operasional', keterangan: 'Pembelian Alat Tulis Kantor',   statusPR: 'Approve',  statusPO: 'PO', statusDO: 'Received' },
  { id: 5,  tanggalPR: '11-02-2025', noPR: 'PR005', noSO: 'SO005.55', noPO: '-',      departemen: 'Operasional', keterangan: 'Pembelian Alat Tulis Kantor',   statusPR: 'Rejected', statusPO: '-',  statusDO: '-' },
  { id: 6,  tanggalPR: '12-02-2025', noPR: 'PR006', noSO: 'SO006.10', noPO: '-',      departemen: 'Operasional', keterangan: 'Pembelian Safety Shoes',        statusPR: 'Rejected', statusPO: '-',  statusDO: '-' },
  { id: 7,  tanggalPR: '13-02-2025', noPR: 'PR007', noSO: 'SO007.21', noPO: '-',      departemen: 'Procurement', keterangan: 'Pembelian Laptop',               statusPR: 'Pending',  statusPO: '-',  statusDO: '-' },
  { id: 8,  tanggalPR: '14-02-2025', noPR: 'PR008', noSO: 'SO008.08', noPO: '-',      departemen: 'IT',          keterangan: 'Langganan Software',            statusPR: 'Pending',  statusPO: '-',  statusDO: '-' },
  // tambahan dummy data
  { id: 9,  tanggalPR: '15-02-2025', noPR: 'PR009', noSO: 'SO009.10', noPO: 'PO-003', departemen: 'Marketing',    keterangan: 'Material Promosi',              statusPR: 'Approve',  statusPO: 'PO', statusDO: 'Delivered' },
  { id: 10, tanggalPR: '16-02-2025', noPR: 'PR010', noSO: 'SO010.42', noPO: 'PO-004', departemen: 'GA',           keterangan: 'Perawatan Kendaraan',           statusPR: 'Approve',  statusPO: 'PO', statusDO: 'Received' },
  { id: 11, tanggalPR: '17-02-2025', noPR: 'PR011', noSO: 'SO011.77', noPO: '-',      departemen: 'QHSE',        keterangan: 'APD Proyek',                    statusPR: 'Pending',  statusPO: '-',  statusDO: 'BA' },
  { id: 12, tanggalPR: '18-02-2025', noPR: 'PR012', noSO: 'SO012.05', noPO: '-',      departemen: 'IT',          keterangan: 'Pembelian Lisensi Software',    statusPR: 'Pending',  statusPO: '-',  statusDO: '-' },
  { id: 13, tanggalPR: '19-02-2025', noPR: 'PR013', noSO: 'SO013.33', noPO: 'PO-005', departemen: 'Finance',     keterangan: 'Perlengkapan Arsip',           statusPR: 'Approve',  statusPO: 'PO', statusDO: 'BA' },
  { id: 14, tanggalPR: '20-02-2025', noPR: 'PR014', noSO: 'SO014.66', noPO: '-',      departemen: 'Operasional', keterangan: 'Bahan Bakar Cadangan',          statusPR: 'Rejected', statusPO: '-',  statusDO: '-' },
  { id: 15, tanggalPR: '21-02-2025', noPR: 'PR015', noSO: 'SO015.12', noPO: 'PO-006', departemen: 'HRD',         keterangan: 'Pelatihan K3',                  statusPR: 'Approve',  statusPO: 'PO', statusDO: 'Delivered' },
  { id: 16, tanggalPR: '22-02-2025', noPR: 'PR016', noSO: 'SO016.88', noPO: 'PO-007', departemen: 'Procurement', keterangan: 'Rak Gudang',                    statusPR: 'Approve',  statusPO: 'PO', statusDO: 'Received' },
  { id: 17, tanggalPR: '23-02-2025', noPR: 'PR017', noSO: 'SO017.90', noPO: '-',      departemen: 'GA',          keterangan: 'ATK Bulanan',                    statusPR: 'Pending',  statusPO: '-',  statusDO: '-' },
  { id: 18, tanggalPR: '24-02-2025', noPR: 'PR018', noSO: 'SO018.44', noPO: '-',      departemen: 'Marketing',   keterangan: 'Souvenir Pelanggan',            statusPR: 'Pending',  statusPO: '-',  statusDO: 'BA' },
  { id: 19, tanggalPR: '25-02-2025', noPR: 'PR019', noSO: 'SO019.71', noPO: 'PO-008', departemen: 'QHSE',        keterangan: 'Perlengkapan Audit Internal',  statusPR: 'Approve',  statusPO: 'PO', statusDO: 'Delivered' },
  { id: 20, tanggalPR: '26-02-2025', noPR: 'PR020', noSO: 'SO020.39', noPO: 'PO-009', departemen: 'IT',          keterangan: 'Peningkatan Kapasitas Server', statusPR: 'Approve',  statusPO: 'PO', statusDO: 'BA' },
];

const ListPRDashboard: React.FC = () => {
  const [filterStatusPR, setFilterStatusPR] = useState<'Semua' | 'Approve' | 'Rejected' | 'Pending'>('Semua');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  // Make items stateful so we can approve/reject
  const [items, setItems] = useState<PRItem[]>(initialData);

  const data = useMemo(() => {
    const filtered = items.filter((d) => filterStatusPR === 'Semua' || d.statusPR === filterStatusPR);
    if (!search.trim()) return filtered;
    const s = search.toLowerCase();
    return filtered.filter((d) =>
      d.noPR.toLowerCase().includes(s) ||
      d.noPO.toLowerCase().includes(s) ||
      d.noSO.toLowerCase().includes(s) ||
      d.departemen.toLowerCase().includes(s) ||
      d.keterangan.toLowerCase().includes(s)
    );
  }, [items, filterStatusPR, search]);

  const handleExportCSV = () => {
    const headers = ['Tanggal PR','No PR','No PO','No SO','Departemen','Keterangan','Status PR','Status PO','Status DO'];
    const rows = data.map((r) => [r.tanggalPR, r.noPR, r.noPO, r.noSO, r.departemen, r.keterangan, r.statusPR, r.statusPO, r.statusDO]);
    const escape = (v: any) => {
      const s = String(v ?? '');
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };
    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileSuffix = filterStatusPR === 'Semua' ? 'all' : filterStatusPR.toLowerCase();
    a.download = `approval-pr-${fileSuffix}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const w = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
    if (!w) return window.print();
    const style = `
      <style>
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; padding: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 12px; text-align: left; }
        th { background: #f9fafb; }
        h1 { font-size: 16px; margin: 0 0 12px; }
      </style>
    `;
    const header = `<h1>Approval PR - ${filterStatusPR === 'Semua' ? 'All' : filterStatusPR}</h1>`;
    const table = `
      <table>
        <thead>
          <tr>
            <th>No</th><th>Tanggal PR</th><th>No PR</th><th>No PO</th><th>No SO</th><th>Departemen</th><th>Keterangan</th><th>Status PR</th><th>Status PO</th><th>Status DO</th>
          </tr>
        </thead>
        <tbody>
          ${data.slice(0, pageSize).map((r) => `
            <tr>
              <td>${r.id}</td>
              <td>${r.tanggalPR}</td>
              <td>${r.noPR}</td>
              <td>${r.noPO}</td>
              <td>${r.noSO}</td>
              <td>${r.departemen}</td>
              <td>${r.keterangan}</td>
              <td>${r.statusPR}</td>
              <td>${r.statusPO}</td>
              <td>${r.statusDO}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    w.document.write(`<html><head><title>Print</title>${style}</head><body>${header}${table}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  const handleApprove = (id: number) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, statusPR: 'Approve' } : it));
  };

  const handleReject = (id: number) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, statusPR: 'Rejected' } : it));
  };

  // Confirm dialog state
  const [confirmState, setConfirmState] = useState<{ open: boolean; id: number | null; type: 'approve' | 'reject' | null }>({ open: false, id: null, type: null });
  const openConfirm = (type: 'approve' | 'reject', id: number) => {
    setConfirmState({ open: true, id, type });
  };
  const closeConfirm = () => setConfirmState({ open: false, id: null, type: null });
  const proceedConfirm = () => {
    if (!confirmState.open || confirmState.id == null || !confirmState.type) return;
    if (confirmState.type === 'approve') handleApprove(confirmState.id);
    if (confirmState.type === 'reject') handleReject(confirmState.id);
    closeConfirm();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">APPROVAL PR</h1>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">
              <Printer className="h-4 w-4" /> Cetak
            </button>
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">
              <FileDown className="h-4 w-4" /> Ekspor
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="ml-auto flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="block w-28 appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              <div className="relative">
                <Search className="h-4 w-4 text-gray-500 absolute left-2 top-2.5" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari PR / SO / Dept / Keterangan"
                  className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={filterStatusPR}
                  onChange={(e) => setFilterStatusPR(e.target.value as 'Semua' | 'Approve' | 'Rejected' | 'Pending')}
                  className="block w-44 appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Approve">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal PR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No PR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No PO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No SO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status PR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status PO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status DO</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.slice(0, pageSize).map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.id}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.tanggalPR}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.noPR}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.noPO}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.noSO}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.departemen}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.keterangan}</td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          row.statusPR === 'Approve'
                            ? 'bg-green-100 text-green-800'
                            : row.statusPR === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {row.statusPR}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          row.statusPO === 'PO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {row.statusPO}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          row.statusDO === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : row.statusDO === 'Received'
                            ? 'bg-blue-100 text-blue-800'
                            : row.statusDO === 'BA'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {row.statusDO}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-right">
                      {(() => {
                        const locked = row.statusPR === 'Approve' || row.statusPR === 'Rejected';
                        return (
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openConfirm('approve', row.id)}
                              className={`px-3 py-1 rounded-md text-white text-xs ${locked ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                              disabled={locked}
                              title={locked ? 'Status sudah ditetapkan' : 'Setujui PR ini'}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openConfirm('reject', row.id)}
                              className={`px-3 py-1 rounded-md text-white text-xs ${locked ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                              disabled={locked}
                              title={locked ? 'Status sudah ditetapkan' : 'Tolak PR ini'}
                            >
                              Reject
                            </button>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
            <div>
              Menampilkan {Math.min(pageSize, data.length)} dari {data.length} PR {filterStatusPR === 'Semua' ? 'All' : (filterStatusPR === 'Approve' ? 'Approved' : filterStatusPR)}
            </div>
            <div className="space-x-2">
              <button className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 border rounded-md bg-blue-600 text-white hover:bg-blue-700">1</button>
              <button className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>
      {/* Confirm Dialog */}
      {confirmState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Konfirmasi</h3>
            </div>
            <div className="px-6 py-4 text-sm text-gray-700">
              {confirmState.type === 'approve' ? (
                <p>Anda yakin ingin <span className="font-semibold text-green-700">Approve</span> PR ini?</p>
              ) : (
                <p>Anda yakin ingin <span className="font-semibold text-red-700">Reject</span> PR ini?</p>
              )}
            </div>
            <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
              <button onClick={closeConfirm} className="px-3 py-1.5 rounded-md border text-gray-700 bg-white hover:bg-gray-50">Batal</button>
              <button onClick={proceedConfirm} className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">Ya, Lanjutkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPRDashboard;
