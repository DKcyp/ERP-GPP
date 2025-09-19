import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Clock,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Modal from "./Modal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface JurnalDetail {
  coa: string;
  namaCoa: string;
  keterangan: string;
  debit: number;
  kredit: number;
}

interface JurnalEntry {
  id: string;
  noJurnal: string;
  tanggal: string; // yyyy-mm-dd
  user: string;
  keterangan: string;
  details: JurnalDetail[];
}

const JurnalManualDashboard: React.FC = () => {
  const today = new Date();

  const [data, setData] = useState<JurnalEntry[]>([
    {
      id: "JM-001",
      noJurnal: "JM-2025-09-001",
      tanggal: "2025-09-01",
      user: "accounting",
      keterangan: "Jurnal penyesuaian awal bulan",
      details: [
        {
          coa: "1101",
          namaCoa: "Kas",
          keterangan: "Saldo awal kas",
          debit: 1000000,
          kredit: 0,
        },
        {
          coa: "3101",
          namaCoa: "Modal",
          keterangan: "Modal",
          debit: 0,
          kredit: 1000000,
        },
      ],
    },
  ]);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showEntries, setShowEntries] = useState("10");

  const filteredData = useMemo(() => {
    return data.filter((entry) => {
      const matchesSearch =
        entry.noJurnal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.user.toLowerCase().includes(searchQuery.toLowerCase());
      const entryDate = new Date(entry.tanggal);
      const matchesDate =
        (!startDate || entryDate >= startDate) &&
        (!endDate || entryDate <= endDate);
      return matchesSearch && matchesDate;
    });
  }, [data, searchQuery, startDate, endDate]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    noJurnal: string;
    tanggal: string;
    user: string;
    keterangan: string;
    details: JurnalDetail[];
  }>({
    noJurnal: "",
    tanggal: today.toISOString().slice(0, 10),
    user: "accounting",
    keterangan: "",
    details: [{ coa: "", namaCoa: "", keterangan: "", debit: 0, kredit: 0 }],
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<JurnalEntry | null>(null);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      noJurnal: "",
      tanggal: today.toISOString().slice(0, 10),
      user: "accounting",
      keterangan: "",
      details: [{ coa: "", namaCoa: "", keterangan: "", debit: 0, kredit: 0 }],
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (entry: JurnalEntry) => {
    setEditingId(entry.id);
    setForm({
      noJurnal: entry.noJurnal,
      tanggal: entry.tanggal,
      user: entry.user,
      keterangan: entry.keterangan,
      details: entry.details.map((d) => ({ ...d })),
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.noJurnal || !form.tanggal) {
      alert("No Jurnal dan Tanggal wajib diisi");
      return;
    }
    const totalDebit = form.details.reduce(
      (s, d) => s + (Number(d.debit) || 0),
      0
    );
    const totalKredit = form.details.reduce(
      (s, d) => s + (Number(d.kredit) || 0),
      0
    );
    if (totalDebit !== totalKredit) {
      alert("Total Debit dan Kredit harus seimbang");
      return;
    }

    if (editingId) {
      setData((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? { ...it, ...form, details: form.details.map((d) => ({ ...d })) }
            : it
        )
      );
    } else {
      const newItem: JurnalEntry = {
        id: `${Date.now()}`,
        noJurnal: form.noJurnal,
        tanggal: form.tanggal,
        user: form.user,
        keterangan: form.keterangan,
        details: form.details.map((d) => ({ ...d })),
      };
      setData((prev) => [newItem, ...prev]);
    }
    setIsFormOpen(false);
  };

  const requestDelete = (entry: JurnalEntry) => {
    setItemToDelete(entry);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData((prev) => prev.filter((d) => d.id !== itemToDelete.id));
      setItemToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const ns = new Set(prev);
      if (ns.has(id)) ns.delete(id);
      else ns.add(id);
      return ns;
    });
  };

  const handleExport = (type: string) => {
    alert(`Export ${type}`);
  };

  // Pagination (client-side)
  const total = filteredData.length;
  const pageSize = Number(showEntries);
  const pageData = filteredData.slice(0, pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                JURNAL MANUAL
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Accounting
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Jurnal Manual</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Jurnal
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Cari nomor jurnal, keterangan, user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode Jurnal
              </label>
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="relative flex-1">
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah Jurnal
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => handleExport("Excel")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> Excel
              </button>
              <button
                onClick={() => handleExport("CSV")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> CSV
              </button>
              <button
                onClick={() => handleExport("PDF")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Jurnal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keterangan
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detail
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageData.map((entry) => (
                  <React.Fragment key={entry.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.noJurnal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.keterangan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => toggleExpand(entry.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {expandedRows.has(entry.id) ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(entry)}
                            className="px-2 py-1 text-xs rounded-md bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 inline-flex items-center gap-1"
                          >
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => requestDelete(entry)}
                            className="px-2 py-1 text-xs rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 inline-flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows.has(entry.id) && (
                      <tr>
                        <td colSpan={6} className="p-4 bg-gray-50">
                          <div className="ml-8 border-l-2 border-blue-200 pl-4">
                            <h5 className="text-md font-semibold text-gray-800 mb-2">
                              Detail Jurnal:
                            </h5>
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                    COA
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                    Nama COA
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                    Keterangan
                                  </th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">
                                    Debit
                                  </th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">
                                    Kredit
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {entry.details.map((d, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {d.coa}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {d.namaCoa}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                      {d.keterangan}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                      {d.debit > 0
                                        ? `Rp ${d.debit.toLocaleString(
                                            "id-ID"
                                          )}`
                                        : "-"}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                      {d.kredit > 0
                                        ? `Rp ${d.kredit.toLocaleString(
                                            "id-ID"
                                          )}`
                                        : "-"}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="font-bold bg-gray-50">
                                  <td
                                    colSpan={3}
                                    className="px-4 py-2 text-right text-sm text-gray-900"
                                  >
                                    Total
                                  </td>
                                  <td className="px-4 py-2 text-right text-sm text-gray-900">
                                    Rp{" "}
                                    {entry.details
                                      .reduce((s, d) => s + d.debit, 0)
                                      .toLocaleString("id-ID")}
                                  </td>
                                  <td className="px-4 py-2 text-right text-sm text-gray-900">
                                    Rp{" "}
                                    {entry.details
                                      .reduce((s, d) => s + d.kredit, 0)
                                      .toLocaleString("id-ID")}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-sm text-gray-700">
            Showing 1 to {Math.min(pageSize, total)} of {total} entries
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? "Edit Jurnal" : "Tambah Jurnal"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No Jurnal
              </label>
              <input
                type="text"
                value={form.noJurnal}
                onChange={(e) =>
                  setForm((f) => ({ ...f, noJurnal: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tanggal: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <input
                type="text"
                value={form.user}
                onChange={(e) =>
                  setForm((f) => ({ ...f, user: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keterangan
              </label>
              <input
                type="text"
                value={form.keterangan}
                onChange={(e) =>
                  setForm((f) => ({ ...f, keterangan: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Detail Lines */}
          <div className="border rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800 text-sm">
                Detail Jurnal
              </h4>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    details: [
                      ...f.details,
                      { coa: "", namaCoa: "", keterangan: "", debit: 0, kredit: 0 },
                    ],
                  }))
                }
                className="px-2 py-1 text-xs rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
              >
                + Tambah Baris
              </button>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      COA
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Nama COA
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Keterangan
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Debit
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Kredit
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                      Hapus
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {form.details.map((d, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={d.coa}
                          onChange={(e) =>
                            setForm((f) => {
                              const details = [...f.details];
                              details[idx] = {
                                ...details[idx],
                                coa: e.target.value,
                              };
                              return { ...f, details };
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={d.namaCoa}
                          onChange={(e) =>
                            setForm((f) => {
                              const details = [...f.details];
                              details[idx] = {
                                ...details[idx],
                                namaCoa: e.target.value,
                              };
                              return { ...f, details };
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={d.keterangan}
                          onChange={(e) =>
                            setForm((f) => {
                              const details = [...f.details];
                              details[idx] = {
                                ...details[idx],
                                keterangan: e.target.value,
                              };
                              return { ...f, details };
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={d.debit}
                          onChange={(e) =>
                            setForm((f) => {
                              const details = [...f.details];
                              details[idx] = {
                                ...details[idx],
                                debit: Number(e.target.value),
                              };
                              return { ...f, details };
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 text-right"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={d.kredit}
                          onChange={(e) =>
                            setForm((f) => {
                              const details = [...f.details];
                              details[idx] = {
                                ...details[idx],
                                kredit: Number(e.target.value),
                              };
                              return { ...f, details };
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              details: f.details.filter((_, i) => i !== idx),
                            }))
                          }
                          className="px-2 py-1 text-xs rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end gap-6 mt-3 text-sm">
              <div className="text-gray-600">
                Total Debit:{" "}
                <span className="font-semibold">
                  Rp{" "}
                  {form.details
                    .reduce((s, d) => s + (Number(d.debit) || 0), 0)
                    .toLocaleString("id-ID")}
                </span>
              </div>
              <div className="text-gray-600">
                Total Kredit:{" "}
                <span className="font-semibold">
                  Rp{" "}
                  {form.details
                    .reduce((s, d) => s + (Number(d.kredit) || 0), 0)
                    .toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.noJurnal}
      />
    </div>
  );
};

export default JurnalManualDashboard;
