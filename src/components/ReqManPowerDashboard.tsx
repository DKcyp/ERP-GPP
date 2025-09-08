import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  FileSpreadsheet,
  FileText,
  File,
  Edit,
  Trash2,
  Plus,
  ArrowUp,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ReqManPowerModal, { ReqManPowerFormData } from "./ReqManPowerModal";

interface ReqManPowerRow extends ReqManPowerFormData {
  id: string;
  no: number;
}

const ReqManPowerDashboard: React.FC = () => {
  const [searchDept, setSearchDept] = useState("");
  const [searchPosisi, setSearchPosisi] = useState("");
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof ReqManPowerRow | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readOnlyModal, setReadOnlyModal] = useState(false);
  const [initialModalData, setInitialModalData] = useState<Partial<ReqManPowerFormData> | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ReqManPowerRow | null>(null);

  const [rows, setRows] = useState<ReqManPowerRow[]>([
    {
      id: "1",
      no: 1,
      departemen: "HRD",
      posisi: "Staff Recruitment",
      tanggalReq: "2025-03-01",
      kualifikasi: "D3/S1 Psikologi, pengalaman 1-2 tahun",
      approvalDireksi: "Pending",
      approvalHead: "Approved",
    },
    {
      id: "2",
      no: 2,
      departemen: "Operasional",
      posisi: "Teknisi Lapangan",
      tanggalReq: "2025-03-05",
      kualifikasi: "SMK, siap dinas luar kota",
      approvalDireksi: "Approved",
      approvalHead: "Approved",
    },
  ]);

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = () => setCurrentPage(1);

  const filtered = useMemo(() => {
    return rows.filter((r) =>
      r.departemen.toLowerCase().includes(searchDept.toLowerCase()) &&
      r.posisi.toLowerCase().includes(searchPosisi.toLowerCase())
    );
  }, [rows, searchDept, searchPosisi]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    if (!sortField) return data;
    return data.sort((a, b) => {
      const av = a[sortField]!;
      const bv = b[sortField]!;
      if (sortDirection === "asc") return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });
  }, [filtered, sortDirection, sortField]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sorted.slice(startIndex, endIndex);

  const handleSort = (field: keyof ReqManPowerRow) => {
    if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const openAdd = () => {
    setReadOnlyModal(false);
    setInitialModalData(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: ReqManPowerRow) => {
    setReadOnlyModal(false);
    setInitialModalData({ ...item });
    setIsModalOpen(true);
  };

  const openView = (item: ReqManPowerRow) => {
    setReadOnlyModal(true);
    setInitialModalData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (data: ReqManPowerFormData) => {
    if (initialModalData && (initialModalData as any).id) {
      // edit
      setRows((prev) =>
        prev.map((r) => (r.id === (initialModalData as any).id ? { ...r, ...data } : r))
      );
    } else {
      // create
      setRows((prev) => [
        {
          id: `${prev.length + 1}`,
          no: prev.length + 1,
          ...data,
        },
        ...prev.map((p) => ({ ...p, no: p.no + 1 })),
      ]);
    }
    setIsModalOpen(false);
    setInitialModalData(null);
  };

  const handleDeleteClick = (item: ReqManPowerRow) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setRows((prev) => prev.filter((r) => r.id !== itemToDelete.id).map((r, idx) => ({ ...r, no: idx + 1 })));
    setItemToDelete(null);
    setDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">REQ MAN POWER</h1>

          {/* Search & Filters */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Departemen</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchDept}
                    onChange={(e) => setSearchDept(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="HRD / Operasional / Finance"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Posisi</label>
                <input
                  type="text"
                  value={searchPosisi}
                  onChange={(e) => setSearchPosisi(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Supervisor / Staff / Teknisi"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={openAdd}
                className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" /> Tambah
              </button>

              <div className="flex gap-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Export Excel</span>
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
                  <File className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Show entries */}
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("no")}>
                    <div className="flex items-center space-x-1">
                      <span>No</span>
                      {sortField === "no" && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Departemen</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Posisi (Tgl Req)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Kualifikasi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Approval Direksi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Approval Head Dept</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"} ${
                      animateRows ? "animate-in fade-in slide-in-from-bottom-2" : "opacity-0"
                    }`}
                    style={{
                      animationDelay: animateRows ? `${index * 80}ms` : "0ms",
                      animationFillMode: "forwards",
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{item.no}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.departemen}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.posisi} ({new Date(item.tanggalReq).toLocaleDateString("id-ID")})</td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                      <div className="truncate" title={item.kualifikasi}>{item.kualifikasi}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.approvalDireksi === "Approved" ? "bg-green-100 text-green-800" :
                        item.approvalDireksi === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {item.approvalDireksi}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.approvalHead === "Approved" ? "bg-green-100 text-green-800" :
                        item.approvalHead === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {item.approvalHead}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 hover:scale-110"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-all duration-200 hover:scale-110"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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
                Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                    currentPage === 1 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  1
                </button>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Modals */}
      <ReqManPowerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => handleSave({ ...(initialModalData as any), ...data } as ReqManPowerFormData)}
        initialData={initialModalData}
        readOnly={readOnlyModal}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.posisi}
      />
    </div>
  );
};

export default ReqManPowerDashboard;
