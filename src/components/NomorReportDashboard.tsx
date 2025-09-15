import React, { useMemo, useState } from "react";
import {
  Search,
  PlusCircle,
  Download,
  Clock,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface ReportRecord {
  personil: string; // Nama Personil
  tanggalPermintaan: string; // ISO date
  nomorReport: string; // Nomor Report
  noSO: string; // No SO
  namaProject: string; // Nama Project
  lokasiKerja: string; // Lokasi Kerja
  namaInspector: string; // Nama Inspector
}

// (optional) constants for filter dropdowns can be added later if needed

const sampleData: ReportRecord[] = [
  {
    personil: "Andi Wijaya",
    tanggalPermintaan: "2025-09-01",
    nomorReport: "NR-001/IX/2025",
    noSO: "SO-1001",
    namaProject: "Shutdown Valve A",
    lokasiKerja: "Plant 1",
    namaInspector: "Budi",
  },
  {
    personil: "Citra Lestari",
    tanggalPermintaan: "2025-08-28",
    nomorReport: "NR-045/VIII/2025",
    noSO: "SO-1002",
    namaProject: "Welding Pipe B",
    lokasiKerja: "Workshop",
    namaInspector: "Citra",
  },
  {
    personil: "Dewi Puspita",
    tanggalPermintaan: "2025-08-15",
    nomorReport: "NR-210/VIII/2025",
    noSO: "SO-1003",
    namaProject: "Tank Inspection",
    lokasiKerja: "Field Site 2",
    namaInspector: "Andi",
  },
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const NomorReportDashboard: React.FC = () => {
  const [searchNomor, setSearchNomor] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [showEntries, setShowEntries] = useState<string>("10");

  // Data & UI state
  const [data, setData] = useState<ReportRecord[]>(sampleData);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ReportRecord | null>(null);
  const [form, setForm] = useState<ReportRecord>({
    personil: "",
    tanggalPermintaan: "",
    nomorReport: "",
    noSO: "",
    namaProject: "",
    lokasiKerja: "",
    namaInspector: "",
  });

  // New modal fields (as per design)
  const soOptions = ["SO-1001", "SO-1002", "SO-1003"];
  const jenisPekerjaanOptions = ["Inspeksi", "Welding", "Maintenance"];
  const pegawaiOptions = ["Pegawai A", "Pegawai B", "Pegawai C", "Pegawai D"];
  type PegawaiRow = {
    nama: string;
    kualifikasi: "Senior" | "Middle" | "Junior";
    gaji: string;
  };
  const [soInduk, setSoInduk] = useState<string>("");
  const [jenisPekerjaan, setJenisPekerjaan] = useState<string>("");
  const [tanggalMOB, setTanggalMOB] = useState<string>("");
  const [tanggalDemob, setTanggalDemob] = useState<string>("");
  const [nomorKontrak, setNomorKontrak] = useState<string>("");
  const [qtyBekerja, setQtyBekerja] = useState<number>(0);
  const [keterangan, setKeterangan] = useState<string>("");
  const [pegawaiRows, setPegawaiRows] = useState<PegawaiRow[]>([
    { nama: "Pegawai A", kualifikasi: "Senior", gaji: "Rp 10.000.000" },
    { nama: "Pegawai B", kualifikasi: "Middle", gaji: "Rp 7.500.000" },
    { nama: "Pegawai C", kualifikasi: "Junior", gaji: "Rp 5.000.000" },
  ]);

  const toNumber = (rp: string) => parseFloat(rp.replace(/[^\d]/g, "")) || 0;
  const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
  const handleGajiChange = (idx: number, value: string) => {
    const numeric = value.replace(/[^\d]/g, "");
    const formatted = numeric ? formatRp(parseInt(numeric, 10)) : "";
    setPegawaiRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, gaji: formatted } : r))
    );
  };
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ReportRecord | null>(null);

  const filtered = useMemo(() => {
    return data.filter((row) => {
      const byNomor = row.nomorReport
        .toLowerCase()
        .includes(searchNomor.toLowerCase());
      const byProject = filterProject
        ? row.namaProject === filterProject
        : true;
      return byNomor && byProject;
    });
  }, [searchNomor, filterProject, data]);

  const displayed = useMemo(() => {
    const limit = parseInt(showEntries, 10);
    return filtered.slice(0, isNaN(limit) ? filtered.length : limit);
  }, [filtered, showEntries]);

  const handleSearch = () =>
    alert(`Cari: ${searchNomor || "-"} | Project: ${filterProject || "Semua"}`);
  // Add/Edit/Delete handlers
  const openAdd = () => {
    setEditing(null);
    setForm({
      personil: "",
      tanggalPermintaan: "",
      nomorReport: "",
      noSO: "",
      namaProject: "",
      lokasiKerja: "",
      namaInspector: "",
    });
    // reset new modal fields
    setSoInduk("");
    setJenisPekerjaan("");
    setTanggalMOB("");
    setTanggalDemob("");
    setNomorKontrak("");
    setQtyBekerja(0);
    setKeterangan("");
    setPegawaiRows([
      { nama: "Pegawai A", kualifikasi: "Senior", gaji: "Rp 10.000.000" },
      { nama: "Pegawai B", kualifikasi: "Middle", gaji: "Rp 7.500.000" },
      { nama: "Pegawai C", kualifikasi: "Junior", gaji: "Rp 5.000.000" },
    ]);
    setShowForm(true);
  };

  const openEdit = (row: ReportRecord) => {
    setEditing(row);
    setForm(row);
    // basic mapping back to modal fields (best-effort)
    setSoInduk(row.noSO || "");
    setJenisPekerjaan(row.namaProject || "");
    setTanggalMOB(row.tanggalPermintaan || "");
    setNomorKontrak(row.nomorReport || "");
    setKeterangan("");
    setQtyBekerja(pegawaiRows.length);
    setShowForm(true);
  };

  // No auto-number generation in this version; nomorReport is free input

  const saveForm = () => {
    // Map new modal fields to existing list schema (non-breaking)
    const firstPegawai = pegawaiRows[0]?.nama || "-";
    const payload: ReportRecord = {
      personil: firstPegawai,
      tanggalPermintaan: tanggalMOB, // use MOB as request date
      nomorReport: nomorKontrak.trim(), // map contract number to report number
      noSO: soInduk.trim(),
      namaProject: jenisPekerjaan.trim(),
      lokasiKerja: form.lokasiKerja.trim(),
      namaInspector: firstPegawai,
    };
    if (!payload.noSO || !payload.nomorReport) {
      alert("SO Induk dan Nomor Kontrak wajib diisi");
      return;
    }
    if (
      payload.tanggalPermintaan &&
      isNaN(new Date(payload.tanggalPermintaan).getTime())
    ) {
      alert("Format tanggal tidak valid");
      return;
    }
    if (editing) {
      setData((prev) => prev.map((r) => (r === editing ? payload : r)));
    } else {
      setData((prev) => [payload, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const askDelete = (row: ReportRecord) => {
    setDeleteTarget(row);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((r) => r !== deleteTarget));
    setShowDelete(false);
    setDeleteTarget(null);
  };
  const handleExport = (type: string) => alert(`Export ${type}`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                REPORT
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Monitoring Personnel
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Report</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Report
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan report..."
                  value={searchNomor}
                  onChange={(e) => setSearchNomor(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Project
              </label>
              <div className="relative">
                <input
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Filter Nama Project..."
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                />
              </div>
            </div>

            {/* keep grid balance */}
            <div className="hidden lg:block" />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Report
            </button>
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Controls */}
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

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Personil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Permintaan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No SO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi Kerja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Inspector
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayed.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.personil}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(row.tanggalPermintaan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.nomorReport}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.noSO}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.namaProject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.lokasiKerja}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.namaInspector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => openEdit(row)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => askDelete(row)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">
                  {editing ? "Edit Report" : "Tambah Report"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Top form - 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SO Induk */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SO Turunan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={soInduk}
                      onChange={(e) => setSoInduk(e.target.value)}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pilih SO Induk</option>
                      {soOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Jenis Pekerjaan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Pekerjaan
                    </label>
                    <select
                      value={jenisPekerjaan}
                      onChange={(e) => setJenisPekerjaan(e.target.value)}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pilih Jenis Pekerjaan</option>
                      {jenisPekerjaanOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tanggal MOB */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal MOB
                    </label>
                    <input
                      type="date"
                      value={tanggalMOB}
                      onChange={(e) => setTanggalMOB(e.target.value)}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Nomor Kontrak */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Kontrak <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nomorKontrak}
                      onChange={(e) => setNomorKontrak(e.target.value)}
                      placeholder="Masukkan nomor kontrak"
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Tanggal Demob */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Demob
                    </label>
                    <input
                      type="date"
                      value={tanggalDemob}
                      onChange={(e) => setTanggalDemob(e.target.value)}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Jumlah Qty yang Bekerja */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Qty yang Bekerja
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={qtyBekerja}
                      onChange={(e) => setQtyBekerja(Number(e.target.value))}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Lokasi Kerja */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Kerja</label>
                  <input
                    type="text"
                    value={form.lokasiKerja}
                    onChange={(e) => setForm({ ...form, lokasiKerja: e.target.value })}
                    placeholder="Masukkan lokasi kerja..."
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan
                  </label>
                  <textarea
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Masukkan keterangan..."
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 h-24"
                  />
                </div>

                {/* Pegawai Table */}
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    Pegawai
                  </div>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama Pegawai
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kualifikasi
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gaji
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {pegawaiRows.map((r, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2">
                              <select
                                value={r.nama}
                                onChange={(e) =>
                                  setPegawaiRows((prev) =>
                                    prev.map((p, i) =>
                                      i === idx
                                        ? { ...p, nama: e.target.value }
                                        : p
                                    )
                                  )
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                              >
                                {pegawaiOptions.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <select
                                value={r.kualifikasi}
                                onChange={(e) =>
                                  setPegawaiRows((prev) =>
                                    prev.map((p, i) =>
                                      i === idx
                                        ? {
                                            ...p,
                                            kualifikasi: e.target
                                              .value as PegawaiRow["kualifikasi"],
                                          }
                                        : p
                                    )
                                  )
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="Senior">Senior</option>
                                <option value="Middle">Middle</option>
                                <option value="Junior">Junior</option>
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                inputMode="numeric"
                                value={r.gaji}
                                onChange={(e) =>
                                  handleGajiChange(idx, e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Rp 0"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={saveForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus */}
        <ConfirmDeleteModal
          isOpen={showDelete}
          title="Hapus Report?"
          message={
            deleteTarget
              ? `Apakah Anda yakin ingin menghapus Report ${deleteTarget.nomorReport} (Personil: ${deleteTarget.personil})?`
              : ""
          }
          onClose={() => setShowDelete(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

export default NomorReportDashboard;
