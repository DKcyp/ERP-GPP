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
import { initialLeaveQuotas, LeaveQuota } from "./MasterCutiDashboard"; // Corrected import

interface CutiListRecord {
  id: string;
  nama: string;
  jabatan: string;
  departemen: string;
  jenisCuti:
    | "Cuti tahunan"
    | "Cuti potong"
    | "Cuti Project"
    | "Cuti Sakit"
    | "Cuti istimewa"
    | "Cuti Khusus";
  tanggalMulai: string; // ISO
  tanggalSelesai: string; // ISO
  keterangan: string;
  attachment?: string; // Optional field for attachment (e.g., surat dokter)
  status: "Pending" | "Disetujui" | "Ditolak";
}

interface Employee {
  nama: string;
  jabatan: string;
  departemen: string;
  tanggalMulaiKerja: string; // YYYY-MM-DD
  leaveQuotaId?: string; // Optional: Link to a LeaveQuota entry
}

const initialListData: CutiListRecord[] = [
  {
    id: "CUTI-REQ-021",
    nama: "Budi Santoso",
    jabatan: "Staff HR",
    departemen: "HRD",
    jenisCuti: "Cuti tahunan",
    tanggalMulai: "2025-09-10",
    tanggalSelesai: "2025-09-12",
    keterangan: "Urusan keluarga",
    status: "Disetujui",
  },
  {
    id: "CUTI-REQ-022",
    nama: "Siti Mawar",
    jabatan: "Teknisi",
    departemen: "Operational",
    jenisCuti: "Cuti Sakit",
    tanggalMulai: "2025-09-03",
    tanggalSelesai: "2025-09-04",
    keterangan: "Sakit demam dan butuh istirahat",
    attachment: "surat_dokter_siti.pdf",
    status: "Pending",
  },
  // Extra dummy to trigger alert (exceed per-employee limit)
  {
    id: "CUTI-REQ-023",
    nama: "Budi Santoso",
    jabatan: "Staff HR",
    departemen: "HRD",
    jenisCuti: "Cuti istimewa",
    tanggalMulai: "2025-09-20",
    tanggalSelesai: "2025-09-20",
    keterangan: "Keperluan pribadi yang mendesak",
    status: "Pending",
  },
  {
    id: "CUTI-REQ-024",
    nama: "Agus Dharma",
    jabatan: "Manager",
    departemen: "Marketing",
    jenisCuti: "Cuti Project",
    tanggalMulai: "2025-10-01",
    tanggalSelesai: "2025-10-05",
    keterangan: "Menghadiri pameran dagang di Surabaya",
    status: "Disetujui",
  },
  {
    id: "CUTI-REQ-025",
    nama: "Siti Mawar",
    jabatan: "Teknisi",
    departemen: "Operational",
    jenisCuti: "Cuti Khusus",
    tanggalMulai: "2025-10-15",
    tanggalSelesai: "2025-10-15",
    keterangan: "Pernikahan adik",
    status: "Pending",
  },
];

const initialEmployeeData: Employee[] = [
  {
    nama: "Budi Santoso",
    jabatan: "Staff HR",
    departemen: "HRD",
    tanggalMulaiKerja: "2024-01-15", // More than 1 year
    leaveQuotaId: "LQ-001",
  },
  {
    nama: "Siti Mawar",
    jabatan: "Teknisi",
    departemen: "Operational",
    tanggalMulaiKerja: "2025-03-01", // Less than 1 year
    leaveQuotaId: "LQ-002",
  },
  {
    nama: "Agus Dharma",
    jabatan: "Manager",
    departemen: "Marketing",
    tanggalMulaiKerja: "2023-05-20", // More than 1 year
    leaveQuotaId: "LQ-003",
  },
];

const PegawaiListCutiDashboard: React.FC = () => {
  const [rows, setRows] = useState<CutiListRecord[]>(initialListData);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployeeData); // eslint-disable-line @typescript-eslint/no-unused-vars
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
    keterangan: "", // Renamed from 'alasan'
    attachment: "", // New field
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
  const ANNUAL_LEAVE_ENTITLEMENT = 12; // 12 days of annual leave after 1 year of service
  const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000; // Rough calculation for 1 year

  const grouped = useMemo(() => {
    const employeeMap = new Map<string, Employee>();
    employees.forEach((emp) => {
      employeeMap.set(`${emp.nama}|${emp.departemen}`, emp);
    });

    const leaveQuotaMap = new Map<string, LeaveQuota>();
    initialLeaveQuotas.forEach((quota) => {
      leaveQuotaMap.set(quota.id, quota);
    });

    const map = new Map<
      string,
      {
        key: string;
        nama: string;
        departemen: string;
        jabatan?: string;
        tahunan: number;
        potong: number; // New field for Cuti potong
        project: number; // New field for Cuti Project
        sakit: number; // New field for Cuti Sakit
        istimewa: number; // New field for Cuti Istimewa
        khusus: number; // New field for Cuti Khusus
        total: number;
        pending: number;
        disetujui: number;
        ditolak: number;
        sisa: number; // This will now represent sisa cuti tahunan (relative to limitTahunan)
        details: CutiListRecord[];
        // New limit fields for display
        limitTahunan: number;
        limitPotong: number;
        limitProject: number;
        limitSakit: number;
        limitIstimewa: number;
        limitKhusus: number;
      }
    >();

    // Initialize annual leave entitlement based on employment date AND master quota
    employeeMap.forEach((emp, key) => {
      const quota: LeaveQuota | undefined = emp.leaveQuotaId
        ? leaveQuotaMap.get(emp.leaveQuotaId)
        : undefined;

      const startDate = new Date(emp.tanggalMulaiKerja);
      const now = new Date();
      const yearsOfService =
        (now.getTime() - startDate.getTime()) / ONE_YEAR_IN_MS;

      // Annual leave entitlement from master or calculated based on service
      const initialAnnualLeaveLimit =
        quota?.limitTahunan ??
        (yearsOfService >= 1 ? ANNUAL_LEAVE_ENTITLEMENT : 0);

      map.set(key, {
        key,
        nama: emp.nama,
        departemen: emp.departemen,
        jabatan: emp.jabatan,
        tahunan: 0,
        potong: 0,
        project: 0,
        sakit: 0,
        istimewa: 0,
        khusus: 0,
        total: 0,
        pending: 0,
        disetujui: 0,
        ditolak: 0,
        sisa: initialAnnualLeaveLimit, // Initial sisa is the limit
        details: [],
        limitTahunan: initialAnnualLeaveLimit,
        limitPotong: quota?.limitPotong ?? 0,
        limitProject: quota?.limitProject ?? 0,
        limitSakit: quota?.limitSakit ?? 0,
        limitIstimewa: quota?.limitIstimewa ?? 0,
        limitKhusus: quota?.limitKhusus ?? 0,
      });
    });

    for (const r of filtered) {
      const key = `${r.nama}|${r.departemen}`;
      if (!map.has(key)) {
        // If a leave record exists for an employee not in initialEmployeeData, add them with default 0 limits
        map.set(key, {
          key,
          nama: r.nama,
          departemen: r.departemen,
          jabatan: r.jabatan,
          tahunan: 0,
          potong: 0,
          project: 0,
          sakit: 0,
          istimewa: 0,
          khusus: 0,
          total: 0,
          pending: 0,
          disetujui: 0,
          ditolak: 0,
          sisa: 0, // No initial leave if not in employee list, and no master quota found
          details: [],
          limitTahunan: 0,
          limitPotong: 0,
          limitProject: 0,
          limitSakit: 0,
          limitIstimewa: 0,
          limitKhusus: 0,
        });
      }
      const g = map.get(key)!;

      // Only count approved leaves
      if (r.status === "Disetujui") {
        if (r.jenisCuti === "Cuti tahunan") {
          g.tahunan += 1;
          g.sisa -= 1; // Deduct approved annual leave from entitlement
        } else if (r.jenisCuti === "Cuti potong") {
          g.potong += 1;
        } else if (r.jenisCuti === "Cuti Project") {
          g.project += 1;
        } else if (r.jenisCuti === "Cuti Sakit") {
          g.sakit += 1;
        } else if (r.jenisCuti === "Cuti istimewa") {
          g.istimewa += 1;
        } else if (r.jenisCuti === "Cuti Khusus") {
          g.khusus += 1;
        }
      }

      g.total += 1;
      if (r.status === "Pending") g.pending += 1;
      else if (r.status === "Disetujui") g.disetujui += 1;
      else g.ditolak += 1;
      g.details.push(r);
    }

    const arr = Array.from(map.values());
    // Ensure sisa doesn't go below 0 (for annual leave)
    for (const g of arr) {
      g.sisa = Math.max(0, g.sisa);
    }
    return arr;
  }, [filtered, employees]);

  // No longer a single LIMIT_PER_EMPLOYEE, checking individual limits
  const exceededGroups = useMemo(
    () =>
      grouped.filter((g) => {
        return (
          (g.tahunan > g.limitTahunan && g.limitTahunan > 0) ||
          (g.potong > g.limitPotong && g.limitPotong > 0) ||
          (g.project > g.limitProject && g.limitProject > 0) ||
          (g.sakit > g.limitSakit && g.limitSakit > 0) ||
          (g.istimewa > g.limitIstimewa && g.limitIstimewa > 0) ||
          (g.khusus > g.limitKhusus && g.limitKhusus > 0)
        );
      }),
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

    let finalJenisCuti = form.jenisCuti;
    let finalKeterangan = form.keterangan;
    let finalAttachment = form.attachment;

    // Logic for "Cuti Sakit" attachment
    if (form.jenisCuti === "Cuti Sakit" && !form.attachment) {
      finalJenisCuti = "Cuti tahunan"; // Default to Cuti tahunan if no attachment for Cuti Sakit
      finalKeterangan =
        "Cuti Sakit (tanpa surat dokter, dikonversi ke Cuti tahunan): " +
        form.keterangan;
    }

    const newItem: CutiListRecord = {
      id: `CUTI-REQ-${String(rows.length + 21).padStart(3, "0")}`,
      nama: form.nama,
      jabatan: form.jabatan,
      departemen: form.departemen,
      jenisCuti: finalJenisCuti as CutiListRecord["jenisCuti"],
      tanggalMulai: form.tanggalMulai,
      tanggalSelesai: form.tanggalSelesai,
      keterangan: finalKeterangan, // Renamed from 'alasan'
      attachment: finalAttachment, // New field
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
      keterangan: "", // Renamed from 'alasan'
      attachment: "", // New field
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
                        <option value="Cuti tahunan">Cuti tahunan</option>
                        <option value="Cuti potong">Cuti potong</option>
                        <option value="Cuti Project">Cuti Project</option>
                        <option value="Cuti Sakit">Cuti Sakit</option>
                        <option value="Cuti istimewa">Cuti istimewa</option>
                        <option value="Cuti Khusus">Cuti Khusus</option>
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
                        Keterangan
                      </label>
                      <textarea
                        name="keterangan"
                        value={form.keterangan}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        rows={3}
                        placeholder="Keterangan cuti"
                      />
                    </div>
                    {form.jenisCuti === "Cuti Sakit" && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Attachment (Surat Dokter)
                        </label>
                        <input
                          type="file"
                          name="attachment"
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              attachment: e.target.files?.[0]?.name || "",
                            }))
                          }
                          className="w-full px-3 py-2 border rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Wajib diisi jika Jenis Cuti adalah 'Cuti Sakit', jika
                          tidak akan terinput sebagai Cuti tahunan.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="px-6 py-4 border-t flex justify-end gap-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Batal
                    </button>
                    <button
                      onClick={saveForm}
                      className="px-4 py-2 bg-primary text-white rounded-lg"
                    >
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
                <option value="Cuti tahunan">Cuti tahunan</option>
                <option value="Cuti potong">Cuti potong</option>
                <option value="Cuti Project">Cuti Project</option>
                <option value="Cuti Sakit">Cuti Sakit</option>
                <option value="Cuti istimewa">Cuti istimewa</option>
                <option value="Cuti Khusus">Cuti Khusus</option>
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
                    Pegawai berikut melebihi batas pengajuan cuti:{" "}
                    {exceededGroups.map((g) => g.nama).join(", ")}
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
                    Cuti Tahunan
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuti Potong
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuti Project
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuti Sakit
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuti Istimewa
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuti Khusus
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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sisa Cuti Tahunan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedGroups.map((g) => {
                  const isOpen = !!expanded[g.key];
                  return (
                    <React.Fragment key={g.key}>
                      <tr
                        className={`transition-colors cursor-pointer ${
                          isOpen ? "bg-gray-50" : "hover:bg-gray-50"
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {g.departemen}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                            {g.tahunan} / {g.limitTahunan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                            {g.potong} / {g.limitPotong}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                            {g.project} / {g.limitProject}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                            {g.sakit} / {g.limitSakit}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">
                            {g.istimewa} / {g.limitIstimewa}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
                            {g.khusus} / {g.limitKhusus}
                          </span>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                            {g.sisa} / {g.limitTahunan}
                          </span>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={15} className="bg-gray-50">
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
                                        Keterangan
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Attachment
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
                                          title={r.keterangan}
                                        >
                                          {r.keterangan || "-"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                          {r.attachment ? (
                                            <a
                                              href={`/path/to/attachments/${r.attachment}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:underline"
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              View File
                                            </a>
                                          ) : (
                                            "-"
                                          )}
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
