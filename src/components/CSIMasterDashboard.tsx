import React, { useEffect, useState } from "react";
import {
  File,
  FileSpreadsheet,
  FileText,
  Search,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
} from "lucide-react";

interface CSIRecord {
  id: string;
  no: number;
  customer: string;
  proyek: string;
  tanggal: string; // DD-MM-YYYY
  skor: number; // 0-100
  status: "Aktif" | "Nonaktif";
}

type QuestionType = "scale" | "text";

interface CSIQuestionRow {
  id: string;
  pertanyaan: string;
  tipe: QuestionType;
  bobot?: number; // optional weight 0-100
  required: boolean;
}

interface CSITemplate {
  id: string;
  namaForm: string;
  deskripsi?: string;
  pertanyaan: CSIQuestionRow[];
  createdAt: string; // ISO date
}

const CSIMasterDashboard: React.FC = () => {
  const [animateRows, setAnimateRows] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchProyek, setSearchProyek] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // Detail modal state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailTemplate, setDetailTemplate] = useState<CSITemplate | null>(
    null
  );
  const [detailIdentity, setDetailIdentity] = useState({
    customer: "",
    proyek: "",
    tanggal: "",
    penilai: "",
  });
  const [detailAnswers, setDetailAnswers] = useState<
    Record<string, string | number>
  >({});

  const [data] = useState<CSIRecord[]>([
    {
      id: "1",
      no: 1,
      customer: "Medco",
      proyek: "Pipeline A",
      tanggal: "12-01-2025",
      skor: 86,
      status: "Aktif",
    },
    {
      id: "2",
      no: 2,
      customer: "Pertamina",
      proyek: "Shutdown B",
      tanggal: "20-01-2025",
      skor: 91,
      status: "Aktif",
    },
    {
      id: "3",
      no: 3,
      customer: "Chevron",
      proyek: "Inspection C",
      tanggal: "05-02-2025",
      skor: 78,
      status: "Nonaktif",
    },
  ]);

  // State for CSI Template builder
  const [templates, setTemplates] = useState<CSITemplate[]>([
    {
      id: crypto.randomUUID(),
      namaForm: "Form Penilaian A",
      deskripsi: "Template contoh penilaian kepuasan pelanggan",
      pertanyaan: [
        {
          id: crypto.randomUUID(),
          pertanyaan: "Kualitas Pekerjaan",
          tipe: "scale",
          bobot: 20,
          required: true,
        },
        {
          id: crypto.randomUUID(),
          pertanyaan: "Ketepatan Waktu",
          tipe: "scale",
          bobot: 20,
          required: true,
        },
        {
          id: crypto.randomUUID(),
          pertanyaan: "Komunikasi & Respons",
          tipe: "scale",
          bobot: 20,
          required: true,
        },
        {
          id: crypto.randomUUID(),
          pertanyaan: "Kepatuhan K3/QHSE",
          tipe: "scale",
          bobot: 20,
          required: false,
        },
        {
          id: crypto.randomUUID(),
          pertanyaan: "Harga & Nilai",
          tipe: "scale",
          bobot: 20,
          required: false,
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ]);
  const [namaForm, setNamaForm] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [rows, setRows] = useState<CSIQuestionRow[]>([
    {
      id: crypto.randomUUID(),
      pertanyaan: "Kualitas Pekerjaan",
      tipe: "scale",
      bobot: 20,
      required: true,
    },
    {
      id: crypto.randomUUID(),
      pertanyaan: "Ketepatan Waktu",
      tipe: "scale",
      bobot: 20,
      required: true,
    },
  ]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    null
  );

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        pertanyaan: "",
        tipe: "scale",
        bobot: 0,
        required: false,
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const moveRow = (index: number, dir: -1 | 1) => {
    setRows((prev) => {
      const next = [...prev];
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= next.length) return prev;
      const [item] = next.splice(index, 1);
      next.splice(newIndex, 0, item);
      return next;
    });
  };

  const updateRow = (id: string, patch: Partial<CSIQuestionRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const resetBuilder = () => {
    setNamaForm("");
    setDeskripsi("");
    setRows([
      {
        id: crypto.randomUUID(),
        pertanyaan: "",
        tipe: "scale",
        bobot: 0,
        required: false,
      },
    ]);
    setEditingTemplateId(null);
  };

  const saveTemplate = () => {
    if (!namaForm.trim()) {
      alert("Nama Form wajib diisi");
      return;
    }
    if (editingTemplateId) {
      // Update existing template
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplateId
            ? { ...t, namaForm, deskripsi, pertanyaan: rows }
            : t
        )
      );
    } else {
      // Create new template
      const tpl: CSITemplate = {
        id: crypto.randomUUID(),
        namaForm,
        deskripsi,
        pertanyaan: rows,
        createdAt: new Date().toISOString(),
      };
      setTemplates((prev) => [{ ...tpl }, ...prev]);
    }
    setIsTemplateModalOpen(false);
    resetBuilder();
  };

  const openCreateModal = () => {
    resetBuilder();
    setIsTemplateModalOpen(true);
  };

  const openEditModal = (tpl: CSITemplate) => {
    setEditingTemplateId(tpl.id);
    setNamaForm(tpl.namaForm);
    setDeskripsi(tpl.deskripsi || "");
    setRows(tpl.pertanyaan.map((p) => ({ ...p })));
    setIsTemplateModalOpen(true);
  };

  const openDetailModal = (tpl: CSITemplate) => {
    setDetailTemplate(tpl);
    // initialize default answers
    const init: Record<string, string | number> = {};
    tpl.pertanyaan.forEach((q) => {
      init[q.id] = q.tipe === "scale" ? 3 : "";
    });
    setDetailAnswers(init);
    setDetailIdentity({ customer: "", proyek: "", tanggal: "", penilai: "" });
    setIsDetailOpen(true);
  };

  const deleteTemplate = (id: string) => {
    if (confirm("Hapus template ini?")) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (editingTemplateId === id) resetBuilder();
    }
  };

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const filtered = data.filter((r) => {
    const m1 = r.customer.toLowerCase().includes(searchCustomer.toLowerCase());
    const m2 = r.proyek.toLowerCase().includes(searchProyek.toLowerCase());
    const inRange = (() => {
      if (!dateFrom && !dateTo) return true;
      const [d, m, y] = r.tanggal.split("-").map((v) => parseInt(v, 10));
      const t = new Date(y, m - 1, d).getTime();
      let ok = true;
      if (dateFrom) ok = ok && t >= new Date(dateFrom).getTime();
      if (dateTo) ok = ok && t <= new Date(dateTo).getTime();
      return ok;
    })();
    return m1 && m2 && inRange;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filtered.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearch = () => setCurrentPage(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Master CSI</h1>

          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Customer
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchCustomer}
                    onChange={(e) => setSearchCustomer(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Cari customer"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Proyek
                </label>
                <input
                  type="text"
                  value={searchProyek}
                  onChange={(e) => setSearchProyek(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Cari proyek"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar for Template actions */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Template Form CSI
            </h2>
            <button
              onClick={openCreateModal}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Tambah Template
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
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
          <div className="flex space-x-2">
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

        {/* Tabel daftar template yang sudah dibuat */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800">
              Daftar Template CSI
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Nama Form
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Jumlah Pertanyaan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Dibuat
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {templates.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Belum ada template. Silakan klik "Tambah Template" di
                      atas.
                    </td>
                  </tr>
                )}

                {/* Modal: Detail/Preview & Jawaban */}
                {isDetailOpen && detailTemplate && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                      className="absolute inset-0 bg-black/40"
                      onClick={() => setIsDetailOpen(false)}
                    />
                    <div className="relative bg-white w-full max-w-5xl rounded-lg shadow-lg border border-gray-200">
                      <div className="px-6 py-4 border-b flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Detail Form: {detailTemplate.namaForm}
                        </h3>
                        <button
                          onClick={() => setIsDetailOpen(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                        {detailTemplate.deskripsi && (
                          <p className="text-sm text-gray-600">
                            {detailTemplate.deskripsi}
                          </p>
                        )}

                        {/* Identitas */}
                        <div className="bg-gray-50 rounded-md border p-4">
                          <h4 className="font-medium text-gray-800 mb-3">
                            Identitas
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Customer
                              </label>
                              <input
                                type="text"
                                value={detailIdentity.customer}
                                onChange={(e) =>
                                  setDetailIdentity((prev) => ({
                                    ...prev,
                                    customer: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                                placeholder="Nama Customer"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Proyek
                              </label>
                              <input
                                type="text"
                                value={detailIdentity.proyek}
                                onChange={(e) =>
                                  setDetailIdentity((prev) => ({
                                    ...prev,
                                    proyek: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                                placeholder="Nama Proyek"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Tanggal
                              </label>
                              <input
                                type="date"
                                value={detailIdentity.tanggal}
                                onChange={(e) =>
                                  setDetailIdentity((prev) => ({
                                    ...prev,
                                    tanggal: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Nama Penilai
                              </label>
                              <input
                                type="text"
                                value={detailIdentity.penilai}
                                onChange={(e) =>
                                  setDetailIdentity((prev) => ({
                                    ...prev,
                                    penilai: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                                placeholder="Nama Penilai"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Pertanyaan & Jawaban */}
                        <div className="bg-white rounded-lg border p-4">
                          <h4 className="font-medium text-gray-800 mb-3">
                            Pertanyaan
                          </h4>
                          <div className="space-y-4">
                            {detailTemplate.pertanyaan.map((q, idx) => (
                              <div
                                key={q.id}
                                className="grid grid-cols-1 md:grid-cols-2 items-start gap-4"
                              >
                                <label className="text-sm text-gray-800">
                                  {idx + 1}. {q.pertanyaan}
                                </label>
                                {q.tipe === "scale" ? (
                                  <select
                                    value={(detailAnswers[q.id] as number) ?? 3}
                                    onChange={(e) =>
                                      setDetailAnswers((prev) => ({
                                        ...prev,
                                        [q.id]: Number(e.target.value),
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                                  >
                                    <option value={1}>
                                      1 - Sangat Tidak Puas
                                    </option>
                                    <option value={2}>2 - Tidak Puas</option>
                                    <option value={3}>3 - Cukup</option>
                                    <option value={4}>4 - Puas</option>
                                    <option value={5}>5 - Sangat Puas</option>
                                  </select>
                                ) : (
                                  <textarea
                                    value={
                                      (detailAnswers[q.id] as string) ?? ""
                                    }
                                    onChange={(e) =>
                                      setDetailAnswers((prev) => ({
                                        ...prev,
                                        [q.id]: e.target.value,
                                      }))
                                    }
                                    className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                                    placeholder="Jawaban"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setIsDetailOpen(false)}
                          className="px-4 py-2 rounded-md text-sm border"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {templates.map((tpl, i) => (
                  <tr
                    key={tpl.id}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                  >
                    <td className="px-4 py-3 text-gray-900">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {tpl.namaForm}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {tpl.pertanyaan.length}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(tpl.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openDetailModal(tpl)}
                          className="px-2 py-1 text-gray-700 hover:bg-gray-50 rounded text-xs"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => openEditModal(tpl)}
                          className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTemplate(tpl.id)}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
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
        </div>

        {/* Modal: Buat/Edit Template */}
        {isTemplateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsTemplateModalOpen(false)}
            />
            <div className="relative bg-white w-full max-w-5xl rounded-lg shadow-lg border border-gray-200">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingTemplateId ? "Edit" : "Buat"} Form Penilaian
                  (Template)
                </h3>
                <button
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Form
                    </label>
                    <input
                      type="text"
                      value={namaForm}
                      onChange={(e) => setNamaForm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                      placeholder="Contoh: Form Penilaian A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Deskripsi (opsional)
                    </label>
                    <input
                      type="text"
                      value={deskripsi}
                      onChange={(e) => setDeskripsi(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                      placeholder="Deskripsi singkat"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800">
                    Daftar Pertanyaan
                  </h4>
                  <button
                    onClick={addRow}
                    type="button"
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Tambah Baris
                  </button>
                </div>

                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-3 py-2 text-left">No</th>
                        <th className="px-3 py-2 text-left">Pertanyaan</th>
                        <th className="px-3 py-2 text-left">Tipe</th>
                        <th className="px-3 py-2 text-left">Bobot (%)</th>
                        <th className="px-3 py-2 text-left">Required</th>
                        <th className="px-3 py-2 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {rows.map((r, idx) => (
                        <tr
                          key={r.id}
                          className={`${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-25"
                          }`}
                        >
                          <td className="px-3 py-2 align-top">{idx + 1}</td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={r.pertanyaan}
                              onChange={(e) =>
                                updateRow(r.id, { pertanyaan: e.target.value })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder={`Pertanyaan ${idx + 1}`}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={r.tipe}
                              onChange={(e) =>
                                updateRow(r.id, {
                                  tipe: e.target.value as QuestionType,
                                })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            >
                              <option value="scale">Skala 1-4</option>
                              <option value="text">Isian Teks</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={r.bobot ?? 0}
                              onChange={(e) =>
                                updateRow(r.id, {
                                  bobot: Number(e.target.value),
                                })
                              }
                              className="w-28 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={r.required}
                              onChange={(e) =>
                                updateRow(r.id, { required: e.target.checked })
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveRow(idx, -1)}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                                title="Pindah ke atas"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveRow(idx, 1)}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                                title="Pindah ke bawah"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeRow(r.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Hapus baris"
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
              </div>
              <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setIsTemplateModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-md text-sm border"
                >
                  Batal
                </button>
                <button
                  onClick={saveTemplate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />{" "}
                  {editingTemplateId ? "Simpan Perubahan" : "Simpan Template"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabel histori/referensi hasil (tetap dari sample data) */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto"></div>

          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {currentData.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(endIndex, filtered.length)} of {filtered.length}{" "}
                entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
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
    </div>
  );
};

export default CSIMasterDashboard;
