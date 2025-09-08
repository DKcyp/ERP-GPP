import React, { useEffect, useState } from 'react';
import {
  Search,
  FileSpreadsheet,
  FileText,
  File,
  Eye,
  Calendar,
  Clock,
  ChevronDown,
  ArrowUp,
  FilePlus
} from 'lucide-react';
import EntryHPPIndukModal from './EntryHPPIndukModal';

interface HPPIndukRow {
  id: string;
  no: number;
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  estimasiHPP: string;
  mob: string;
  demob: string;
  status: 'Open' | 'Close' | 'Pending';
}

const ProconHPPIndukDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchNamaProject, setSearchNamaProject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof HPPIndukRow | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [showEntryModal, setShowEntryModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<HPPIndukRow | null>(null);

  const [rows] = useState<HPPIndukRow[]>([
    { id: '1', no: 1, noSO: 'SO001', noSOTurunan: 'SO001.1', namaProyek: 'Proyek PHE ONWJ', estimasiHPP: 'Rp 150.000.000', mob: '01-01-2025', demob: '31-01-2025', status: 'Open' },
    { id: '2', no: 2, noSO: 'SO002', noSOTurunan: 'SO002.1', namaProyek: 'Proyek MEDCO', estimasiHPP: 'Rp 200.000.000', mob: '15-01-2025', demob: '15-02-2025', status: 'Close' },
    { id: '3', no: 3, noSO: 'SO003', noSOTurunan: 'SO003.1', namaProyek: 'Proyek Infrastruktur A', estimasiHPP: 'Rp 300.000.000', mob: '01-02-2025', demob: '28-02-2025', status: 'Pending' },
    { id: '4', no: 4, noSO: 'SO004', noSOTurunan: 'SO004.1', namaProyek: 'Proyek Konstruksi B', estimasiHPP: 'Rp 250.000.000', mob: '10-02-2025', demob: '10-03-2025', status: 'Open' },
  ]);

  const statusOptions = ['Open', 'Close', 'Pending'];

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof HPPIndukRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => (
    status === 'Open' ? 'bg-green-100 text-green-800 border-green-200' :
    status === 'Close' ? 'bg-red-100 text-red-800 border-red-200' :
    'bg-yellow-100 text-yellow-800 border-yellow-200'
  );

  const filtered = rows.filter(r =>
    r.noSO.toLowerCase().includes(searchNoSO.toLowerCase()) &&
    r.namaProyek.toLowerCase().includes(searchNamaProject.toLowerCase()) &&
    (selectedStatus ? r.status === selectedStatus : true)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const av = a[sortField];
    const bv = b[sortField];
    if (av === bv) return 0;
    if (sortDirection === 'asc') return av > (bv as any) ? 1 : -1;
    return av < (bv as any) ? 1 : -1;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const current = sorted.slice(startIndex, endIndex);

  const toDateInput = (ddmmyyyy: string) => {
    const parts = ddmmyyyy.split('-');
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      if (dd && mm && yyyy) return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HPP Project</h1>
              <div className="text-sm text-gray-600">Procon › HPP Project</div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Cari No SO</label>
              <div className="flex gap-2">
                <input value={searchNoSO} onChange={(e) => setSearchNoSO(e.target.value)} className="flex-1 px-3 py-2 border rounded-md text-sm" placeholder="SO001" />
                <button onClick={() => setCurrentPage(1)} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Cari Nama Project</label>
              <div className="flex gap-2">
                <input value={searchNamaProject} onChange={(e) => setSearchNamaProject(e.target.value)} className="flex-1 px-3 py-2 border rounded-md text-sm" placeholder="Proyek Medco" />
                <button onClick={() => setCurrentPage(1)} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pilih Status</label>
              <div className="relative">
                <button onClick={() => setStatusDropdownOpen(!statusDropdownOpen)} className="w-full px-3 py-2 border rounded-md text-left flex items-center justify-between">
                  <span className={selectedStatus ? 'text-gray-900' : 'text-gray-500'}>{selectedStatus || '--Pilih Status--'}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {statusDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow">
                    <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => { setSelectedStatus(''); setStatusDropdownOpen(false); }}>--Pilih Status--</button>
                    {statusOptions.map(s => (
                      <button key={s} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => { setSelectedStatus(s); setStatusDropdownOpen(false); }}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Periode</label>
              <div className="flex items-center gap-2">
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="flex-1 px-3 py-2 border rounded-md text-sm" />
                <span className="text-sm text-gray-500">s.d</span>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="flex-1 px-3 py-2 border rounded-md text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Export bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Show</span>
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-2 py-1 border rounded">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex gap-2">
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1">
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1">
              <File className="h-4 w-4" />
              Export CSV
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('noSO')}>
                    <div className="flex items-center gap-1">No SO {sortField === 'noSO' && (<ArrowUp className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />)}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('noSOTurunan')}>
                    <div className="flex items-center gap-1">No SO Turunan {sortField === 'noSOTurunan' && (<ArrowUp className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />)}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('namaProyek')}>
                    <div className="flex items-center gap-1">Nama Proyek {sortField === 'namaProyek' && (<ArrowUp className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />)}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estimasi HPP</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">MOB</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">DEMOB</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {current.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`} style={{ animationDelay: animateRows ? `${index * 80}ms` : '0ms', animationFillMode: 'forwards' }}>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.noSO}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.noSOTurunan}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaProyek}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.estimasiHPP}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.mob}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.demob}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item.status)}`}>{item.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {/* Entry HPP Induk */}
                        <button onClick={() => { setSelectedRow(item); setShowEntryModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Entry HPP Induk">
                          <FilePlus className="h-4 w-4" />
                        </button>
                        {/* View */}
                        <button onClick={() => { setSelectedRow(item); /* could open a read-only view modal */ }} className="p-1.5 text-gray-600 hover:bg-gray-50 rounded" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t">
            <div className="flex items-center justify-between text-sm text-gray-700">
              <div>
                Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-white rounded disabled:opacity-50">Previous</button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) page = i + 1;
                    else if (currentPage <= 3) page = i + 1;
                    else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                    else page = currentPage - 2 + i;
                    return (
                      <button key={page} onClick={() => setCurrentPage(page)} className={`px-2 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>{page}</button>
                    );
                  })}
                </div>
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-white rounded disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entry HPP Induk Modal (reusing existing component) */}
      <EntryHPPIndukModal
        isOpen={showEntryModal}
        onClose={() => setShowEntryModal(false)}
        mode={'create'}
        readOnly={false}
        initialData={selectedRow ? {
          noKontrak: '',
          durasiFrom: toDateInput(selectedRow.mob),
          durasiTo: toDateInput(selectedRow.demob),
          namaClient: '',
          lokasiPekerjaan: '',
          namaProject: selectedRow.namaProyek,
          jenisPekerjaan: '',
          estimasiNilaiKontrak: selectedRow.estimasiHPP,
        } : undefined}
      />
    </div>
  );
};

export default ProconHPPIndukDashboard;
