import React, { useMemo, useState } from "react";
import { PlusCircle, Download, Pencil, Trash2, Search, Clock, Percent, Eye } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import KPIDetailModal from "./KPIDetailModal";
import MasterPresentaseModal from "./MasterPresentaseModal";

interface KPIRecord {
  id: string;
  nama: string;
  posisi: string;
  atasan: string;
  departemen: string;
  masaKerja: string;
  kpi: { month: string; value: number; healthyWeek: number }[];
}

const GeneralMasterKPIDashboard: React.FC = () => {
  // Sample data with new structure
  const initialData: KPIRecord[] = [
    {
      id: "KPI001",
      nama: "Budi Santoso",
      posisi: "Staff HR",
      atasan: "Maya Sari",
      departemen: "HRD",
      masaKerja: "2 Tahun 3 Bulan",
      kpi: [
        { month: "Januari", value: 85, healthyWeek: 90 },
        { month: "Februari", value: 78, healthyWeek: 85 },
        { month: "Maret", value: 92, healthyWeek: 88 },
      ],
    },
    {
      id: "KPI002",
      nama: "Siti Mawar",
      posisi: "Teknisi",
      atasan: "Rudi Hartono",
      departemen: "Operational",
      masaKerja: "1 Tahun 8 Bulan",
      kpi: [
        { month: "Januari", value: 75, healthyWeek: 80 },
        { month: "Februari", value: 82, healthyWeek: 85 },
        { month: "Maret", value: 88, healthyWeek: 90 },
      ],
    },
    {
      id: "KPI003",
      nama: "Joko Susilo",
      posisi: "Marketing Officer",
      atasan: "Andi Pratama",
      departemen: "Marketing",
      masaKerja: "3 Tahun 1 Bulan",
      kpi: [
        { month: "Januari", value: 90, healthyWeek: 95 },
        { month: "Februari", value: 87, healthyWeek: 88 },
        { month: "Maret", value: 93, healthyWeek: 92 },
      ],
    },
  ];

  const [data, setData] = useState<KPIRecord[]>(initialData);
  
  // Filters
  const [searchNama, setSearchNama] = useState("");
  const [searchPosisi, setSearchPosisi] = useState("");
  const [searchDepartemen, setSearchDepartemen] = useState("");
  const [showEntries, setShowEntries] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPresentaseModal, setShowPresentaseModal] = useState(false);
  
  const [editRecordData, setEditRecordData] = useState<KPIRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KPIRecord | null>(null);
  const [kpiDetailTarget, setKpiDetailTarget] = useState<KPIRecord | null>(null);

  // Filtered data
  const filtered = useMemo(() => {
    return data.filter((d) => {
      const matchNama = !searchNama || d.nama.toLowerCase().includes(searchNama.toLowerCase());
      const matchPosisi = !searchPosisi || d.posisi.toLowerCase().includes(searchPosisi.toLowerCase());
      const matchDepartemen = !searchDepartemen || d.departemen.toLowerCase().includes(searchDepartemen.toLowerCase());
      return matchNama && matchPosisi && matchDepartemen;
    });
  }, [data, searchNama, searchPosisi, searchDepartemen]);

  // Pagination
  const pageSize = parseInt(showEntries, 10);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Handlers
  const openAddModal = () => setShowAddModal(true);
  const openEditModal = (item: KPIRecord) => {
    setEditRecordData(item);
    setShowEditModal(true);
  };
  const openDetailModal = (item: KPIRecord) => {
    setKpiDetailTarget(item);
    setShowDetailModal(true);
  };
  const openPresentaseModal = () => setShowPresentaseModal(true);
  const askDelete = (item: KPIRecord) => {
    setDeleteTarget(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setData((prev) => prev.filter((it) => it.id !== deleteTarget.id));
      setDeleteTarget(null);
      setShowDeleteModal(false);
    }
  };

  const handleSaveKpiDetails = (kpiId: string, updatedKpi: { month: string; value: number; healthyWeek: number }[]) => {
    setData((prev) =>
      prev.map((rec) =>
        rec.id === kpiId ? { ...rec, kpi: updatedKpi } : rec
      )
    );
    setShowDetailModal(false);
  };

  const handleExport = (type: string) => {
    alert(`Exporting ${type} (dummy)`);
  };

  const rowClass = (index: number) => 
    index % 2 === 0 ? "bg-white" : "bg-gray-50";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MASTER KPI PEGAWAI
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  HRD
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master KPI</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                value={searchNama}
                onChange={(e) => setSearchNama(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari nama..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posisi
              </label>
              <input
                value={searchPosisi}
                onChange={(e) => setSearchPosisi(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari posisi..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departemen
              </label>
              <input
                value={searchDepartemen}
                onChange={(e) => setSearchDepartemen(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari departemen..."
              />
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm flex items-center justify-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Table controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                className="border border-gray-300 rounded-md px-2 py-1"
                value={showEntries}
                onChange={(e) => {
                  setShowEntries(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 text-xs"
                onClick={openAddModal}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Tambah</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 text-xs"
                onClick={openPresentaseModal}
              >
                <Percent className="h-4 w-4" />
                <span>Master Presentase</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 text-xs"
                onClick={() => handleExport("Excel")}
              >
                <Download className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 text-xs"
                onClick={() => handleExport("CSV")}
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 text-xs"
                onClick={() => handleExport("PDF")}
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atasan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departemen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masa Kerja
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KPI
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paged.map((rec, index) => (
                  <tr key={rec.id} className={`${rowClass(index)} hover:bg-blue-50 transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rec.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {rec.posisi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {rec.atasan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {rec.departemen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {rec.masaKerja}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {rec.kpi.length} bulan
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openDetailModal(rec)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 text-xs font-medium transition-colors"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Detail
                        </button>
                        <button
                          onClick={() => openEditModal(rec)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 text-xs font-medium transition-colors"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => askDelete(rec)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 text-xs font-medium transition-colors"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
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
          <div className="p-4 flex justify-between items-center text-sm text-gray-600 border-t border-gray-200">
            <span>
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={deleteTarget ? `Hapus ${deleteTarget.nama}` : ""}
        message={deleteTarget ? `Apakah Anda yakin ingin menghapus data KPI ${deleteTarget.nama}?` : ""}
      />

      <KPIDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        data={kpiDetailTarget}
        onSave={handleSaveKpiDetails}
      />

      <MasterPresentaseModal
        isOpen={showPresentaseModal}
        onClose={() => setShowPresentaseModal(false)}
      />

      {/* Add/Edit Modal - Simple placeholder */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {showAddModal ? "Tambah KPI Pegawai" : "Edit KPI Pegawai"}
            </h3>
            <p className="text-gray-600 mb-4">
              Form untuk {showAddModal ? "menambah" : "mengedit"} data KPI pegawai akan ditambahkan di sini.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditRecordData(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralMasterKPIDashboard;
