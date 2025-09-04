import React, { useMemo, useState } from "react";
import {
  Search,
  Clock,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Plus,
  X,
} from "lucide-react";

interface CutiListRecord {
  id: string;
  nama: string;
  jabatan: string;
  departemen: string;
  jenisCuti: "Tahunan" | "Sakit" | "Melahirkan" | "Izin" | "Lainnya";
  tanggalMulai: string; // ISO
  tanggalSelesai: string; // ISO
  alasan: string;
  status: "Pending" | "Disetujui" | "Ditolak";
}

const initialListData: CutiListRecord[] = [
  {
    id: "CUTI-REQ-021",
    nama: "Budi Santoso",
    jabatan: "Staff HR",
    departemen: "HRD",
    jenisCuti: "Tahunan",
    tanggalMulai: "2025-09-10",
    tanggalSelesai: "2025-09-12",
    alasan: "Urusan keluarga",
    status: "Disetujui",
  },
  {
    id: "CUTI-REQ-022",
    nama: "Siti Mawar",
    jabatan: "Teknisi",
    departemen: "Operational",
    jenisCuti: "Sakit",
    tanggalMulai: "2025-09-03",
    tanggalSelesai: "2025-09-04",
    alasan: "Sakit demam",
    status: "Pending",
  },
  // Extra dummy to trigger alert (exceed per-employee limit)
  {
    id: "CUTI-REQ-023",
    nama: "Budi Santoso",
    jabatan: "Staff HR",
    departemen: "HRD",
    jenisCuti: "Izin",
    tanggalMulai: "2025-09-20",
    tanggalSelesai: "2025-09-20",
    alasan: "Keperluan pribadi",
    status: "Pending",
  },
];

const PegawaiListCutiDashboard: React.FC = () => {
  const [rows, setRows] = useState<CutiListRecord[]>(initialListData);
  const [showEntries, setShowEntries] = useState(10);
  const [filters, setFilters] = useState({
    nama: "",
    departemen: "",
    jenisCuti: "",
    status: "",
    tglAwal: "",
    tglAkhir: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    jabatan: "",
    departemen: "",
    jenisCuti: "" as CutiListRecord["jenisCuti"] | "",
    tanggalMulai: "",
    tanggalSelesai: "",
    alasan: "",
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchNama = filters.nama
        ? r.nama.toLowerCase().includes(filters.nama.toLowerCase())
        : true;
      const matchDept = filters.departemen
        ? r.departemen === filters.departemen
        : true;
      const matchJenis = filters.jenisCuti
        ? r.jenisCuti === (filters.jenisCuti as CutiListRecord["jenisCuti"])
        : true;
      const matchStatus = filters.status
        ? r.status === (filters.status as CutiListRecord["status"])
        : true;
      const startOk = filters.tglAwal
        ? new Date(r.tanggalMulai) >= new Date(filters.tglAwal)
        : true;
      const endOk = filters.tglAkhir
        ? new Date(r.tanggalSelesai) <= new Date(filters.tglAkhir)
        : true;
      return (
        matchNama && matchDept && matchJenis && matchStatus && startOk && endOk
      );
    });
  }, [rows, filters]);

  // Group filtered data per employee (by name). If there might be duplicate names,
  // we could key by `${nama}|${departemen}` to be safer.
  const grouped = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string;
        nama: string;
        departemen: string;
        jabatan?: string;
        total: number;
        pending: number;
        disetujui: number;
        ditolak: number;
        details: CutiListRecord[];
      }
    >();

    for (const r of filtered) {
      const key = `${r.nama}|${r.departemen}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          nama: r.nama,
          departemen: r.departemen,
          jabatan: r.jabatan,
          total: 0,
          pending: 0,
          disetujui: 0,
          ditolak: 0,
          details: [],
        });
      }
      const g = map.get(key)!;
      g.total += 1;
      if (r.status === "Pending") g.pending += 1;
      else if (r.status === "Disetujui") g.disetujui += 1;
      else g.ditolak += 1;
      g.details.push(r);
    }
    return Array.from(map.values());
  }, [filtered]);

  const LIMIT_PER_EMPLOYEE = 1;
  const exceededGroups = useMemo(
    () => grouped.filter((g) => g.total > LIMIT_PER_EMPLOYEE),
    [grouped]
  );
  const pagedGroups = useMemo(
    () => grouped.slice(0, showEntries),
    [grouped, showEntries]
  );

  const toggleExpand = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveForm = () => {
    if (
      !form.nama ||
      !form.jabatan ||
      !form.departemen ||
      !form.jenisCuti ||
      !form.tanggalMulai ||
      !form.tanggalSelesai
    )
      return;
    const newItem: CutiListRecord = {
      id: `CUTI-REQ-${String(rows.length + 21).padStart(3, "0")}`,
      nama: form.nama,
      jabatan: form.jabatan,
      departemen: form.departemen,
      jenisCuti: form.jenisCuti as CutiListRecord["jenisCuti"],
      tanggalMulai: form.tanggalMulai,
      tanggalSelesai: form.tanggalSelesai,
      alasan: form.alasan,
      status: "Pending",
    };
    setRows((prev) => [newItem, ...prev]);
    setIsModalOpen(false);
    setForm({
      nama: "",
      jabatan: "",
      departemen: "",
      jenisCuti: "",
      tanggalMulai: "",
      tanggalSelesai: "",
      alasan: "",
    });
  };

  const approve = (id: string) => {
    setRows((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "Disetujui" } : x))
    );
  };

  const reject = (id: string) => {
    const reason = prompt("Alasan penolakan (opsional):") || "";
    console.log("Reject reason:", reason);
    setRows((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "Ditolak" } : x))
    );
  };

  const statusBadge = (s: CutiListRecord["status"]) => {
    const map: Record<CutiListRecord["status"], string> = {
      Pending: "bg-yellow-500 text-white",
      Disetujui: "bg-green-500 text-white",
      Ditolak: "bg-red-500 text-white",
    };
    return (
      <span
        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${map[s]}`}
      >
        {s}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LIST CUTI PEGAWAI
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Pegawai
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">List Cuti</span>
              </nav>
            </div>
            {/* Modal Tambah */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-gray-200">
                  <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold">Tambah Data Cuti</h3>
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-gray-100 rounded-md"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama
                      </label>
                      <input
                        name="nama"
                        value={form.nama}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="Nama pegawai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jabatan
                      </label>
                      <input
                        name="jabatan"
                        value={form.jabatan}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="Jabatan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departemen
                      </label>
                      <select
                        name="departemen"
                        value={form.departemen}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="">Pilih departemen</option>
                        <option value="HRD">HRD</option>
                        <option value="Pengadaan">Pengadaan</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operational">Operational</option>
                        <option value="Gudang">Gudang</option>
                        <option value="QHSE">QHSE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jenis Cuti
                      </label>
                      <select
                        name="jenisCuti"
                        value={form.jenisCuti}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="">Pilih jenis</option>
                        <option value="Tahunan">Tahunan</option>
                        <option value="Sakit">Sakit</option>
                        <option value="Melahirkan">Melahirkan</option>
                        <option value="Izin">Izin</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Mulai
                      </label>
                      <input
                        type="date"
                        name="tanggalMulai"
                        value={form.tanggalMulai}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Selesai
                      </label>
                      <input
                        type="date"
                        name="tanggalSelesai"
                        value={form.tanggalSelesai}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alasan
                      </label>
                      <textarea
                        name="alasan"
                        value={form.alasan}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        rows={3}
                        placeholder="Alasan cuti"
                      />
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t flex justify-end gap-3">
                    <button onClick={closeModal} className="px-4 py-2 border rounded-lg">
                      Batal
                    </button>
                    <button onClick={saveForm} className="px-4 py-2 bg-primary text-white rounded-lg">
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={openModal}
                className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-blue-600 text-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                name="nama"
                value={filters.nama}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari nama..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departemen
              </label>
              <select
                name="departemen"
                value={filters.departemen}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              >
                <option value="">Semua</option>
                <option value="HRD">HRD</option>
                <option value="Pengadaan">Pengadaan</option>
                <option value="Marketing">Marketing</option>
                <option value="Operational">Operational</option>
                <option value="Gudang">Gudang</option>
                <option value="QHSE">QHSE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Cuti
              </label>
              <select
                name="jenisCuti"
                value={filters.jenisCuti}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              >
                <option value="">Semua</option>
                <option value="Tahunan">Tahunan</option>
                <option value="Sakit">Sakit</option>
                <option value="Melahirkan">Melahirkan</option>
                <option value="Izin">Izin</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              >
                <option value="">Semua</option>
                <option value="Pending">Pending</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai ≥
              </label>
              <input
                type="date"
                name="tglAwal"
                value={filters.tglAwal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai ≤
              </label>
              <input
                type="date"
                name="tglAkhir"
                value={filters.tglAkhir}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm flex items-center justify-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Table (Grouped per Pegawai) */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            {exceededGroups.length > 0 && (
              <div className="px-4 pt-4">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  <span className="font-semibold">Peringatan:</span>
                  <span>
                    Pegawai berikut melebihi batas pengajuan cuti (
                    {LIMIT_PER_EMPLOYEE}): {exceededGroups.map((g) => g.nama).join(", ")}
                  </span>
                </div>
              </div>
            )}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1"
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 text-xs">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Export Excel</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 text-xs">
                  <FileText className="h-4 w-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departemen
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cuti
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disetujui
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ditolak
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedGroups.map((g) => {
                  const isOpen = !!expanded[g.key];
                  const overLimit = g.total > LIMIT_PER_EMPLOYEE;
                  return (
                    <React.Fragment key={g.key}>
                      <tr
                        className={`transition-colors cursor-pointer ${
                          overLimit ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"
                        }`}
                        onClick={() => toggleExpand(g.key)}
                      >
                        <td className="px-4 py-3 align-middle">
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {g.nama}
                          {overLimit && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 align-middle">
                              Limit terlampaui
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {g.departemen}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                            {g.total}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                            {g.pending}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            {g.disetujui}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                            {g.ditolak}
                          </span>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={7} className="bg-gray-50">
                            <div className="px-6 py-4">
                              <div className="text-xs text-gray-500 mb-2">
                                Detail Cuti {g.nama}
                              </div>
                              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="min-w-full">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jenis
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Periode
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Alasan
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {g.details.map((r) => (
                                      <tr key={r.id} className="hover:bg-white">
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {r.id}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                          {r.jenisCuti}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{`${r.tanggalMulai} - ${r.tanggalSelesai}`}</td>
                                        <td
                                          className="px-4 py-2 text-sm text-gray-700 max-w-xs truncate"
                                          title={r.alasan}
                                        >
                                          {r.alasan || "-"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                          {statusBadge(r.status)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                          <div className="flex items-center space-x-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                approve(r.id);
                                              }}
                                              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                              title="Approve"
                                            >
                                              <ThumbsUp className="h-4 w-4" />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                reject(r.id);
                                              }}
                                              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                              title="Reject"
                                            >
                                              <ThumbsDown className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            <div className="p-4 flex justify-between items-center text-sm text-gray-600">
              <span>
                Showing 1 to {Math.min(grouped.length, showEntries)} of{" "}
                {grouped.length} employees
              </span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 border border-primary bg-primary text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
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

export default PegawaiListCutiDashboard;
