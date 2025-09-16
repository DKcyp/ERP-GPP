import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Download,
  Pencil,
  Trash2,
  Calendar,
  FileText,
  Printer,
  Clock,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface DosisCard {
  id: string;
  personil: string;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
  dosisValue: number; // in mSv
  maxLimit: number; // in mSv
  dateRecorded: string;
  recordedBy: string;
  status: "Normal" | "Warning" | "Critical";
  keterangan?: string;
}

interface ModalState {
  open: boolean;
  mode: "add" | "edit";
  data?: Partial<DosisCard> & { id?: string };
}

const initialData: DosisCard[] = [
  {
    id: "1",
    personil: "Ahmad Rizki",
    quarter: "Q1",
    year: 2024,
    dosisValue: 2.5,
    maxLimit: 20.0,
    dateRecorded: "2024-03-31",
    recordedBy: "QHSE Officer",
    status: "Normal",
    keterangan: "Quarterly radiation dose monitoring",
  },
  {
    id: "2",
    personil: "Sari Dewi",
    quarter: "Q2",
    year: 2024,
    dosisValue: 15.2,
    maxLimit: 20.0,
    dateRecorded: "2024-06-30",
    recordedBy: "QHSE Officer",
    status: "Warning",
    keterangan: "Approaching dose limit",
  },
];

const DosisCardDashboard: React.FC = () => {
  const [rows, setRows] = useState<DosisCard[]>(initialData);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("");
  const [showEntries, setShowEntries] = useState("10");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalState>({ open: false, mode: "add" });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchSearch = r.personil.toLowerCase().includes(search.toLowerCase());
      const matchYear = !selectedYear || r.year.toString() === selectedYear;
      const matchQuarter = !selectedQuarter || r.quarter === selectedQuarter;
      return matchSearch && matchYear && matchQuarter;
    });
  }, [rows, search, selectedYear, selectedQuarter]);

  const perPage = Math.max(1, parseInt(showEntries, 10));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const resetModal = () =>
    setModal({ open: false, mode: "add", data: undefined });

  const onSubmit = () => {
    if (!modal.data) return;
    const { id, personil, quarter, year, dosisValue, maxLimit, dateRecorded, recordedBy, keterangan } =
      modal.data as DosisCard;

    if (!personil || !quarter || !year || dosisValue === undefined || !dateRecorded) return;

    // Determine status based on dose value
    const status: DosisCard["status"] = 
      dosisValue >= maxLimit * 0.9 ? "Critical" :
      dosisValue >= maxLimit * 0.7 ? "Warning" : "Normal";

    if (modal.mode === "add") {
      const newItem: DosisCard = {
        id: String(Date.now()),
        personil,
        quarter,
        year,
        dosisValue,
        maxLimit: maxLimit || 20.0,
        dateRecorded,
        recordedBy: recordedBy || "QHSE Officer",
        status,
        keterangan,
      };
      setRows((prev) => [newItem, ...prev]);
    } else if (modal.mode === "edit" && id) {
      setRows((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, personil, quarter, year, dosisValue, maxLimit: maxLimit || 20.0, dateRecorded, recordedBy: recordedBy || "QHSE Officer", status, keterangan }
            : p
        )
      );
    }
    resetModal();
  };

  const openAdd = () =>
    setModal({
      open: true,
      mode: "add",
      data: {
        personil: "",
        quarter: "Q1",
        year: new Date().getFullYear(),
        dosisValue: 0,
        maxLimit: 20.0,
        dateRecorded: "",
        recordedBy: "QHSE Officer",
        keterangan: "",
      },
    });

  const openEdit = (r: DosisCard) =>
    setModal({ open: true, mode: "edit", data: { ...r } });

  const confirmDelete = () => {
    if (confirmId) setRows((prev) => prev.filter((p) => p.id !== confirmId));
    setConfirmId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: DosisCard["status"]) => {
    switch (status) {
      case "Normal": return "bg-green-50 text-green-700 border-green-200";
      case "Warning": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Critical": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                  Dosis Card
                </h1>
                <nav className="text-sm text-gray-600">
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">
                    QHSE
                  </span>
                  <span className="mx-2">›</span>
                  <span className="text-blue-600 font-medium">Dosis Card</span>
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
          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Personil
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama personil..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Years</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quarter
                </label>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Quarters</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Show Entries
                </label>
                <select
                  value={showEntries}
                  onChange={(e) => setShowEntries(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={openAdd}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Entry
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={showEntries}
                  onChange={(e) => setShowEntries(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  <Printer className="h-5 w-5 mr-2" /> Print
                </button>
                <button
                  onClick={() => alert("Export Excel")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <Download className="h-5 w-5 mr-2" /> Excel
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personil</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quarter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosis (mSv)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Limit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Recorded</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paged.map((r: DosisCard) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {r.personil}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {r.quarter}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {r.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.dosisValue >= r.maxLimit * 0.9 ? 'bg-red-100 text-red-800' :
                          r.dosisValue >= r.maxLimit * 0.7 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {r.dosisValue} mSv
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {r.maxLimit} mSv
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(r.dateRecorded).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(r)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setConfirmId(r.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-red-700 hover:bg-red-50 transition-colors"
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
            <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-600">
              <div>
                Showing {(page - 1) * perPage + 1} to{" "}
                {Math.min(page * perPage, filtered.length)} of {filtered.length}{" "}
                entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={resetModal} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg p-5">
            <h2 className="text-lg font-semibold mb-4">
              {modal.mode === "add" ? "Add Dosis Entry" : "Edit Dosis Entry"}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Personil</label>
                <input
                  type="text"
                  value={modal.data?.personil ?? ""}
                  onChange={(e) =>
                    setModal((m) => ({
                      ...m,
                      data: { ...m.data, personil: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Quarter</label>
                  <select
                    value={modal.data?.quarter ?? "Q1"}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, quarter: e.target.value as any },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Year</label>
                  <input
                    type="number"
                    value={modal.data?.year ?? new Date().getFullYear()}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, year: parseInt(e.target.value) },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Dosis Value (mSv)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={modal.data?.dosisValue ?? 0}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, dosisValue: parseFloat(e.target.value) },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Limit (mSv)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={modal.data?.maxLimit ?? 20.0}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, maxLimit: parseFloat(e.target.value) },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date Recorded</label>
                  <input
                    type="date"
                    value={modal.data?.dateRecorded ?? ""}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, dateRecorded: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Recorded By</label>
                  <input
                    type="text"
                    value={modal.data?.recordedBy ?? "QHSE Officer"}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        data: { ...m.data, recordedBy: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Keterangan</label>
                <textarea
                  rows={3}
                  value={modal.data?.keterangan ?? ""}
                  onChange={(e) =>
                    setModal((m) => ({
                      ...m,
                      data: { ...m.data, keterangan: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={resetModal}
                className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this dosis entry?"
        itemName={
          confirmId ? rows.find((x) => x.id === confirmId)?.personil : undefined
        }
      />
    </>
  );
};

export default DosisCardDashboard;
