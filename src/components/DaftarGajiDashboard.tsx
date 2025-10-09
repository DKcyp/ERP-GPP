import React, { useState, useEffect } from 'react';
import GajiModal, { GajiRow } from './GajiModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Search, 
  Plus, 
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

const DaftarGajiDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<PeriodPayroll | null>(null);
  const [showStagesModal, setShowStagesModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PeriodPayroll | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  type PeriodPayroll = {
    id: string;
    no: number;
    periode: string; // YYYY-MM
    totalTunjanganProyek: string; // formatted Rp
    gapokTeknisi: string; // formatted Rp
    totalTahap1: string; // formatted Rp
    totalTahap2: string; // formatted Rp
    totalTahap3: string; // formatted Rp
    total: string; // formatted Rp
    rows: GajiRow[];
  };

  const [periods, setPeriods] = useState<PeriodPayroll[]>([
    { 
      id: '1', 
      no: 1, 
      periode: '2025-08',
      totalTunjanganProyek: 'Rp 3.500.000',
      gapokTeknisi: 'Rp 5.000.000',
      totalTahap1: 'Rp 4.200.000',
      totalTahap2: 'Rp 4.200.000',
      totalTahap3: 'Rp 400.000',
      total: 'Rp 12.500.000', 
      rows: [
        {
          namaPegawai: 'Ahmad Fauzi',
          noSO: 'SO001',
          totalIncome: 'Rp 5.000.000',
          totalDeduct: 'Rp 500.000',
          potonganLain: 'Rp 100.000',
          gajiBersih: 'Rp 4.400.000',
          tahap1: 'Rp 2.200.000',
          tahap2: 'Rp 2.200.000',
          tahap3: 'Rp 0',
          outstanding: 'Rp 0'
        },
        {
          namaPegawai: 'Siti Nurhaliza',
          noSO: 'SO002',
          totalIncome: 'Rp 4.500.000',
          totalDeduct: 'Rp 450.000',
          potonganLain: 'Rp 50.000',
          gajiBersih: 'Rp 4.000.000',
          tahap1: 'Rp 2.000.000',
          tahap2: 'Rp 2.000.000',
          tahap3: 'Rp 0',
          outstanding: 'Rp 0'
        }
      ]
    },
    { 
      id: '2', 
      no: 2, 
      periode: '2025-07',
      totalTunjanganProyek: 'Rp 3.200.000',
      gapokTeknisi: 'Rp 4.800.000',
      totalTahap1: 'Rp 2.125.000',
      totalTahap2: 'Rp 2.125.000',
      totalTahap3: 'Rp 4.250.000',
      total: 'Rp 11.300.000', 
      rows: [
        {
          namaPegawai: 'Budi Santoso',
          noSO: 'SO003',
          totalIncome: 'Rp 4.800.000',
          totalDeduct: 'Rp 480.000',
          potonganLain: 'Rp 70.000',
          gajiBersih: 'Rp 4.250.000',
          tahap1: 'Rp 2.125.000',
          tahap2: 'Rp 2.125.000',
          tahap3: 'Rp 0',
          outstanding: 'Rp 0'
        }
      ]
    },
    { 
      id: '3', 
      no: 3, 
      periode: '2025-06',
      totalTunjanganProyek: 'Rp 2.950.000',
      gapokTeknisi: 'Rp 4.200.000',
      totalTahap1: 'Rp 1.850.000',
      totalTahap2: 'Rp 1.850.000',
      totalTahap3: 'Rp 3.700.000',
      total: 'Rp 10.950.000', 
      rows: [
        {
          namaPegawai: 'Rina Setiawati',
          noSO: 'SO004',
          totalIncome: 'Rp 4.200.000',
          totalDeduct: 'Rp 420.000',
          potonganLain: 'Rp 80.000',
          gajiBersih: 'Rp 3.700.000',
          tahap1: 'Rp 1.850.000',
          tahap2: 'Rp 1.850.000',
          tahap3: 'Rp 0',
          outstanding: 'Rp 0'
        }
      ]
    },
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const toNumber = (rp: string) => parseFloat(rp.replace(/[^\d]/g, '')) || 0;
  const formatRp = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const handleAddGaji = ({ period, rows }: { period: string; rows: GajiRow[] }) => {
    const totalVal = rows.reduce((sum, r) => {
      const bersih = toNumber(r.gajiBersih) || Math.max(toNumber(r.totalIncome) - toNumber(r.totalDeduct) - toNumber(r.potonganLain), 0);
      return sum + bersih;
    }, 0);
    const sumTunjangan = rows.reduce((s, r) => s + (toNumber(r.totalTunjanganProyek || '0')), 0);
    const sumGapok = rows.reduce((s, r) => s + (toNumber(r.gapokTeknisi || '0')), 0);
    const sumTahap1 = rows.reduce((s, r) => s + (toNumber(r.tahap1 || '0')), 0);
    const sumTahap2 = rows.reduce((s, r) => s + (toNumber(r.tahap2 || '0')), 0);
    const sumTahap3 = rows.reduce((s, r) => s + (toNumber(r.tahap3 || '0')), 0);
    const newItem: PeriodPayroll = {
      id: (periods.length + 1).toString(),
      no: periods.length + 1,
      periode: period, // store YYYY-MM
      totalTunjanganProyek: formatRp(sumTunjangan),
      gapokTeknisi: formatRp(sumGapok),
      totalTahap1: formatRp(sumTahap1),
      totalTahap2: formatRp(sumTahap2),
      totalTahap3: formatRp(sumTahap3),
      total: formatRp(totalVal),
      rows,
    };
    setPeriods(prev => [newItem, ...prev.map(p => ({ ...p, no: p.no + 1 }))]);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (item: PeriodPayroll) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setPeriods(prev => prev.filter(p => p.id !== itemToDelete.id).map((p, i) => ({ ...p, no: i + 1 })));
    setItemToDelete(null);
  };

  // Filter data based on search criteria
  const filteredData = periods.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.periode.toLowerCase().includes(searchLower) ||
      item.total.toLowerCase().includes(searchLower)
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    let av: number | string = '';
    let bv: number | string = '';
    if (sortField === 'no') {
      av = a.no; bv = b.no;
    } else if (sortField === 'periode') {
      av = a.periode; bv = b.periode;
    } else if (sortField === 'total') {
      av = toNumber(a.total); bv = toNumber(b.total);
    } else if (sortField === 'totalTunjanganProyek') {
      av = toNumber(a.totalTunjanganProyek); bv = toNumber(b.totalTunjanganProyek);
    } else if (sortField === 'gapokTeknisi') {
      av = toNumber(a.gapokTeknisi); bv = toNumber(b.gapokTeknisi);
    } else if (sortField === 'totalTahap1') {
      av = toNumber(a.totalTahap1); bv = toNumber(b.totalTahap1);
    } else if (sortField === 'totalTahap2') {
      av = toNumber(a.totalTahap2); bv = toNumber(b.totalTahap2);
    } else if (sortField === 'totalTahap3') {
      av = toNumber(a.totalTahap3); bv = toNumber(b.totalTahap3);
    }

    if (typeof av === 'string' && typeof bv === 'string') {
      const res = av.localeCompare(bv);
      return sortDirection === 'asc' ? res : -res;
    } else {
      const res = (av as number) - (bv as number);
      return sortDirection === 'asc' ? res : -res;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const openAddEmpty = () => {
    setSelectedForEdit(null);
    setShowStagesModal(false);
    setIsModalOpen(true);
  };

  const openPrefilled = (item: PeriodPayroll) => {
    setSelectedForEdit(item);
    setShowStagesModal(false);
    setIsModalOpen(true);
  };

  const openDetailWithStages = (item: PeriodPayroll) => {
    setSelectedForEdit(item);
    setShowStagesModal(true);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Daftar Gaji
            </h1>
            <button 
              onClick={openAddEmpty}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Controls Section */}
        <div className="flex items-center justify-between">
          {/* Show entries control */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('no')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No</span>
                      {sortField === 'no' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('periode')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Periode</span>
                      {sortField === 'periode' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('totalTunjanganProyek')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Total Tunjangan Proyek</span>
                      {sortField === 'totalTunjanganProyek' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('gapokTeknisi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Gapok Teknisi</span>
                      {sortField === 'gapokTeknisi' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('totalTahap1')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Total Tahap 1</span>
                      {sortField === 'totalTahap1' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('totalTahap2')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Total Tahap 2</span>
                      {sortField === 'totalTahap2' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('totalTahap3')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Total Tahap 3</span>
                      {sortField === 'totalTahap3' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Total</span>
                      {sortField === 'total' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr 
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ 
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{item.no}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {new Date(item.periode + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">{item.totalTunjanganProyek}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">{item.gapokTeknisi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">{item.totalTahap1}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">{item.totalTahap2}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">{item.totalTahap3}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">{item.total}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3 text-sm">
                        <button
                          onClick={() => openDetailWithStages(item)}
                          className="text-sky-600 hover:underline"
                          title="Detail"
                        >
                          Detail
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => {/* proses action */}}
                          className="text-emerald-600 hover:underline"
                          title="Proses"
                        >
                          Proses
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => openPrefilled(item)}
                          className="text-amber-600 hover:underline"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-600 hover:underline"
                          title="Hapus"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={() => handlePageChange(1)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    currentPage === 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  1
                </button>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gaji Modal */}
      <GajiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddGaji}
        initialPeriod={selectedForEdit?.periode}
        initialRows={selectedForEdit?.rows}
        showStages={showStagesModal}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete ? new Date(itemToDelete.periode + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : undefined}
      />
    </div>
  );
};

export default DaftarGajiDashboard;
