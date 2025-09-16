import React, { useMemo, useState } from 'react';
import { ChevronDown, Search, Filter, Printer, FileDown } from 'lucide-react';

interface PRItem {
  id: number;
  tanggalPR: string;
  noPR: string;
  noSO: string;
  departemen: string;
  keterangan: string;
  statusPR: 'Approve' | 'Rejected';
  statusPO: 'PO' | '-';
}

const initialData: PRItem[] = [
  { id: 1, tanggalPR: '07-02-2025', noPR: 'PR001', noSO: 'SO001.22', departemen: 'HRD', keterangan: 'Jasa Pelatihan Karyawan', statusPR: 'Approve', statusPO: 'PO' },
  { id: 2, tanggalPR: '08-02-2025', noPR: 'PR002', noSO: 'SO002.12', departemen: 'Finance', keterangan: 'Pembelian Software Akuntansi', statusPR: 'Approve', statusPO: '-' },
  { id: 3, tanggalPR: '09-02-2025', noPR: 'PR003', noSO: 'SO003.33', departemen: 'HRD', keterangan: 'Jasa Pelatihan Karyawan', statusPR: 'Approve', statusPO: '-' },
  { id: 4, tanggalPR: '10-02-2025', noPR: 'PR004', noSO: 'SO004.90', departemen: 'Operasional', keterangan: 'Pembelian Alat Tulis Kantor', statusPR: 'Approve', statusPO: 'PO' },
  { id: 5, tanggalPR: '11-02-2025', noPR: 'PR005', noSO: 'SO005.55', departemen: 'Operasional', keterangan: 'Pembelian Alat Tulis Kantor', statusPR: 'Rejected', statusPO: '-' },
  { id: 6, tanggalPR: '12-02-2025', noPR: 'PR006', noSO: 'SO006.10', departemen: 'Operasional', keterangan: 'Pembelian Safety Shoes', statusPR: 'Rejected', statusPO: '-' },
];

const ListPRDashboard: React.FC = () => {
  const [filterStatusPR, setFilterStatusPR] = useState<'Semua' | 'Approve' | 'Rejected'>('Semua');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const data = useMemo(() => {
    const filtered = initialData.filter((d) => filterStatusPR === 'Semua' || d.statusPR === filterStatusPR);
    if (!search.trim()) return filtered;
    const s = search.toLowerCase();
    return filtered.filter((d) =>
      d.noPR.toLowerCase().includes(s) ||
      d.noSO.toLowerCase().includes(s) ||
      d.departemen.toLowerCase().includes(s) ||
      d.keterangan.toLowerCase().includes(s)
    );
  }, [filterStatusPR, search]);

  const handleExportCSV = () => {
    const headers = ['Tanggal PR','No PR','No SO','Departemen','Keterangan','Status PR','Status PO'];
    const rows = data.map((r) => [r.tanggalPR, r.noPR, r.noSO, r.departemen, r.keterangan, r.statusPR, r.statusPO]);
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
    a.download = `list-pr-${fileSuffix}.csv`;
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
    const header = `<h1>List PR - ${filterStatusPR === 'Semua' ? 'All' : filterStatusPR}</h1>`;
    const table = `
      <table>
        <thead>
          <tr>
            <th>No</th><th>Tanggal PR</th><th>No PR</th><th>No SO</th><th>Departemen</th><th>Keterangan</th><th>Status PR</th><th>Status PO</th>
          </tr>
        </thead>
        <tbody>
          ${data.slice(0, pageSize).map((r) => `
            <tr>
              <td>${r.id}</td>
              <td>${r.tanggalPR}</td>
              <td>${r.noPR}</td>
              <td>${r.noSO}</td>
              <td>${r.departemen}</td>
              <td>${r.keterangan}</td>
              <td>${r.statusPR}</td>
              <td>${r.statusPO}</td>
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">LIST PR</h1>
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
                  onChange={(e) => setFilterStatusPR(e.target.value as 'Semua' | 'Approve' | 'Rejected')}
                  className="block w-44 appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Approve">Approved</option>
                  <option value="Rejected">Rejected</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No SO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status PR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status PO</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.slice(0, pageSize).map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.id}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.tanggalPR}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.noPR}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.noSO}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.departemen}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.keterangan}</td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          row.statusPR === 'Approve' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
            <div>
              Menampilkan {Math.min(pageSize, data.length)} dari {data.length} PR {filterStatusPR === 'Semua' ? 'All' : (filterStatusPR === 'Approve' ? 'Approved' : 'Rejected')}
            </div>
            <div className="space-x-2">
              <button className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 border rounded-md bg-blue-600 text-white hover:bg-blue-700">1</button>
              <button className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPRDashboard;
