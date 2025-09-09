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
  Paperclip,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import MonitoringKontrakPegawaiModal, {
  MonitoringKontrakFormData,
} from "./MonitoringKontrakPegawaiModal";

interface Row extends MonitoringKontrakFormData {
  id: string;
  no: number;
}

const isExpiringWithin3Months = (endDate: string) => {
  if (!endDate) return false;
  const end = new Date(endDate);
  const now = new Date();
  const threeMonthsLater = new Date(
    now.getFullYear(),
    now.getMonth() + 3,
    now.getDate()
  );
  return end <= threeMonthsLater;
};

const fmt = (d: string) => (d ? new Date(d).toLocaleDateString("id-ID") : "-");

const MonitoringKontrakPegawaiDashboard: React.FC = () => {
  const [q, setQ] = useState("");
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Row | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialModalData, setInitialModalData] =
    useState<Partial<MonitoringKontrakFormData> | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Row | null>(null);

  const [rows, setRows] = useState<Row[]>([
    {
      id: "1",
      no: 1,
      namaKaryawan: "Ahmad Fauzi",
      startDate: "2024-12-01",
      endDate: "2025-11-30",
      attachmentKontrak: null,
    },
    {
      id: "2",
      no: 2,
      namaKaryawan: "Budi Santoso",
      startDate: "2025-02-01",
      endDate: "2025-10-15",
      attachmentKontrak: null,
    },
    {
      id: "3",
      no: 3,
      namaKaryawan: "Rina Setiawati",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      attachmentKontrak: null,
    },
  ]);

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 80);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.namaKaryawan.toLowerCase().includes(s) ||
        r.startDate.includes(s) ||
        r.endDate.includes(s)
    );
  }, [rows, q]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    if (!sortField) return data;
    return data.sort((a, b) => {
      const av: any = a[sortField]!;
      const bv: any = b[sortField]!;
      if (sortDirection === "asc") return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });
  }, [filtered, sortDirection, sortField]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sorted.slice(startIndex, endIndex);

  const handleSort = (field: keyof Row) => {
    if (sortField === field)
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const openAdd = () => {
    setInitialModalData(null);
    setIsModalOpen(true);
  };
  const openEdit = (item: Row) => {
    setInitialModalData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (data: MonitoringKontrakFormData) => {
    if (initialModalData && (initialModalData as any).id) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === (initialModalData as any).id ? { ...r, ...data } : r
        )
      );
    } else {
      setRows((prev) => [
        { id: `${prev.length + 1}`, no: prev.length + 1, ...data },
        ...prev.map((p) => ({ ...p, no: p.no + 1 })),
      ]);
    }
    setIsModalOpen(false);
    setInitialModalData(null);
  };

  const handleDeleteClick = (item: Row) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setRows((prev) =>
      prev
        .filter((r) => r.id !== itemToDelete.id)
        .map((r, i) => ({ ...r, no: i + 1 }))
    );
    setItemToDelete(null);
    setDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Monitoring Kontrak Pegawai
          </h1>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Nama / tanggal"
                  />
                  <button className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1">
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-end justify-end">
                <button
                  onClick={openAdd}
                  className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" /> Tambah
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
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

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
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

        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("no")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No</span>
                      {sortField === "no" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Data Karyawan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Start
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    End
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Attachment
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => {
                  const expiring = isExpiringWithin3Months(item.endDate);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      } ${
                        animateRows
                          ? "animate-in fade-in slide-in-from-bottom-2"
                          : "opacity-0"
                      }`}
                      style={{
                        animationDelay: animateRows ? `${index * 80}ms` : "0ms",
                        animationFillMode: "forwards",
                      }}
                    >
                      <td
                        className={`px-4 py-3 text-sm ${
                          expiring
                            ? "text-red-600 font-semibold"
                            : "text-gray-900"
                        }`}
                      >
                        {item.no}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          expiring ? "text-red-600" : "text-gray-900"
                        }`}
                      >
                        {item.namaKaryawan}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          expiring ? "text-red-600" : "text-gray-900"
                        }`}
                      >
                        {fmt(item.startDate)}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          expiring ? "text-red-600" : "text-gray-900"
                        }`}
                      >
                        {fmt(item.endDate)}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-600">
                        {item.attachmentKontrak ? (
                          <span
                            className="inline-flex items-center gap-1 underline cursor-pointer"
                            title={item.attachmentKontrak.name}
                          >
                            <Paperclip className="h-4 w-4" />
                            {item.attachmentKontrak.name}
                          </span>
                        ) : (
                          "-"
                        )}
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
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filtered.length)} of {filtered.length}{" "}
                entries
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
                    currentPage === 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
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

      <MonitoringKontrakPegawaiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) =>
          handleSave({
            ...(initialModalData as any),
            ...data,
          } as MonitoringKontrakFormData)
        }
        initialData={initialModalData}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaKaryawan}
      />
    </div>
  );
};

export default MonitoringKontrakPegawaiDashboard;
