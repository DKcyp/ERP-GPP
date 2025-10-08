import React, { useMemo, useState } from "react";
import {
  Clock,
  File,
  FileSpreadsheet,
  FileText,
  Plus,
  ArrowUp,
  Check,
  X,
  Eye,
} from "lucide-react";
import TimesheetBarangPegawaiModal, {
  TimesheetFormData,
} from "./TimesheetBarangPegawaiModal";

interface RowData {
  id: string;
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  nilaiTimesheet: string;
  mob: string; // DD-MM-YYYY
  demob: string; // DD-MM-YYYY
}

interface PegawaiData {
  id: string;
  no: string;
  tanggal: string;
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  namaPegawai: string;
  kualifikasi: string[];
  mob: string;
  demob: string;
  durasi: string;
  zona: string;
  nilaiTimesheet: string;
  statusApproval: string;
  rejectReason?: string; // New field for rejection reason
}

const sampleRows: RowData[] = [
  {
    id: "1",
    noSO: "SO001",
    noSOTurunan: "SO001.01",
    namaProyek: "Proyek A",
    nilaiTimesheet: "Rp 12.000.000",
    mob: "01-09-2025",
    demob: "10-09-2025",
  },
  {
    id: "2",
    noSO: "SO002",
    noSOTurunan: "SO002.02",
    namaProyek: "Proyek B",
    nilaiTimesheet: "Rp 8.500.000",
    mob: "03-09-2025",
    demob: "15-09-2025",
  },
];

const samplePegawaiData: PegawaiData[] = [
  {
    id: "1",
    no: "001",
    tanggal: "15-09-2025",
    noSO: "SO001",
    noSOTurunan: "SO001.01",
    namaProyek: "Proyek A",
    namaPegawai: "John Doe",
    kualifikasi: ["Engineer", "Project Manager"],
    mob: "01-09-2025",
    demob: "10-09-2025",
    durasi: "9 hari",
    zona: "Jakarta",
    nilaiTimesheet: "Rp 12.000.000",
    statusApproval: "Approved",
  },
  {
    id: "2",
    no: "002",
    tanggal: "15-09-2025",
    noSO: "SO002",
    noSOTurunan: "SO002.02",
    namaProyek: "Proyek B",
    namaPegawai: "Jane Smith",
    kualifikasi: ["Senior Engineer"],
    mob: "03-09-2025",
    demob: "15-09-2025",
    durasi: "12 hari",
    zona: "Surabaya",
    nilaiTimesheet: "Rp 8.500.000",
    statusApproval: "Pending",
  },
  {
    id: "3",
    no: "003",
    tanggal: "15-09-2025",
    noSO: "SO003",
    noSOTurunan: "SO003.01",
    namaProyek: "Proyek C",
    namaPegawai: "Bob Wilson",
    kualifikasi: ["Technician", "Safety Officer"],
    mob: "05-09-2025",
    demob: "20-09-2025",
    durasi: "15 hari",
    zona: "Bandung",
    nilaiTimesheet: "Rp 15.000.000",
    statusApproval: "Rejected",
  },
];

interface TimesheetBarangPegawaiDashboardProps {
  role?: string;
}

const TimesheetBarangPegawaiDashboard: React.FC<
  TimesheetBarangPegawaiDashboardProps
> = ({ role }) => {
  const [rows, setRows] = useState<RowData[]>(sampleRows);
  const [pegawaiData, setPegawaiData] =
    useState<PegawaiData[]>(samplePegawaiData);
  const [search, setSearch] = useState("");
  const [selectedPegawai, setSelectedPegawai] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<TimesheetFormData | null>(null);
  const [animateRows, setAnimateRows] = useState(false);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [mobFrom, setMobFrom] = useState<string>("");
  const [mobTo, setMobTo] = useState<string>("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PegawaiData | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "">("");
  const [rejectReason, setRejectReason] = useState<string>(""); // New state for rejection reason
  const [demobFrom, setDemobFrom] = useState<string>("");
  const [demobTo, setDemobTo] = useState<string>("");

  const parseDdMmYyyy = (s: string): number | null => {
    if (!s) return null;
    // input like DD-MM-YYYY
    const [dd, mm, yyyy] = s.split("-").map((v) => parseInt(v, 10));
    if (!dd || !mm || !yyyy) return null;
    const d = new Date(yyyy, mm - 1, dd);
    return isNaN(d.getTime()) ? null : d.getTime();
  };

  const currentPegawaiData = useMemo(() => {
    const s = search.toLowerCase();
    let filtered = pegawaiData.filter(
      (p) =>
        (p.noSO.toLowerCase().includes(s) ||
          p.noSOTurunan.toLowerCase().includes(s) ||
          p.namaProyek.toLowerCase().includes(s) ||
          p.namaPegawai.toLowerCase().includes(s)) &&
        (selectedPegawai === "" || p.namaPegawai === selectedPegawai)
    );

    // Apply MOB/DEMOB date range filters
    const mf = mobFrom
      ? parseDdMmYyyy(
          new Date(mobFrom)
            .toLocaleDateString("id-ID")
            .split("/")
            .reverse()
            .join("-")
        )
      : null;
    const mt = mobTo
      ? parseDdMmYyyy(
          new Date(mobTo)
            .toLocaleDateString("id-ID")
            .split("/")
            .reverse()
            .join("-")
        )
      : null;
    const df = demobFrom
      ? parseDdMmYyyy(
          new Date(demobFrom)
            .toLocaleDateString("id-ID")
            .split("/")
            .reverse()
            .join("-")
        )
      : null;
    const dt = demobTo
      ? parseDdMmYyyy(
          new Date(demobTo)
            .toLocaleDateString("id-ID")
            .split("/")
            .reverse()
            .join("-")
        )
      : null;

    if (mf || mt) {
      filtered = filtered.filter((p) => {
        const pmob = parseDdMmYyyy(p.mob);
        if (pmob === null) return false;
        if (mf && pmob < mf) return false;
        if (mt && pmob > mt) return false;
        return true;
      });
    }
    if (df || dt) {
      filtered = filtered.filter((p) => {
        const pdemob = parseDdMmYyyy(p.demob);
        if (pdemob === null) return false;
        if (df && pdemob < df) return false;
        if (dt && pdemob > dt) return false;
        return true;
      });
    }

    // Apply sorting if sortField is set
    if (sortField) {
      filtered = filtered.sort((a, b) => {
        let aValue = a[sortField as keyof PegawaiData];
        let bValue = b[sortField as keyof PegawaiData];

        // Ensure both values are strings for comparison, handling null/undefined
        const stringA = String(aValue ?? "").toLowerCase();
        const stringB = String(bValue ?? "").toLowerCase();

        if (stringA < stringB) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (stringA > stringB) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [
    pegawaiData,
    search,
    selectedPegawai,
    sortField,
    sortDirection,
    mobFrom,
    mobTo,
    demobFrom,
    demobTo,
  ]);

  // Get unique employee names for filter dropdown
  const uniquePegawaiNames = useMemo(() => {
    const names = pegawaiData.map((p) => p.namaPegawai);
    return [...new Set(names)].sort();
  }, [pegawaiData]);

  const getStatusColorPegawai = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Trigger animation when component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDetailClick = (item: PegawaiData) => {
    // Helper function to convert DD-MM-YYYY to yyyy-MM-dd
    const convertDateFormat = (dateStr: string): string => {
      if (!dateStr || dateStr === "-") return "";
      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`;
    };

    // Convert PegawaiData to TimesheetFormData for modal
    const formData: TimesheetFormData = {
      noSO: item.noSO,
      noSOTurunan: item.noSOTurunan,
      namaProyek: item.namaProyek,
      nilaiTimesheet: item.nilaiTimesheet,
      mob: convertDateFormat(item.mob),
      demob: convertDateFormat(item.demob),
      pegawai: [
        {
          id: item.id,
          nama: item.namaPegawai,
          kualifikasi: item.kualifikasi.join(", "),
          zona: item.zona,
          hargaAkhir: item.nilaiTimesheet,
          rate: 0,
          startKerja: convertDateFormat(item.mob),
          finishKerja: convertDateFormat(item.demob),
          overtime: 0,
          file: null,
        },
      ],
      barang: [],
    };
    setEditingData(formData);
    setIsModalOpen(true);
  };

  const handleSave = (data: TimesheetFormData) => {
    const fmt = (iso: string) => {
      if (!iso) return "";
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    };
    const newRow: RowData = {
      id: (rows.length + 1).toString(),
      noSO: data.noSO,
      noSOTurunan: data.noSOTurunan,
      namaProyek: data.namaProyek,
      nilaiTimesheet: data.nilaiTimesheet || "Rp 0",
      mob: fmt(data.mob),
      demob: fmt(data.demob),
    };
    setRows((prev) => [newRow, ...prev]);
  };

  const handleApprove = (item: PegawaiData) => {
    setSelectedItem(item);
    setActionType("approve");
    setIsConfirmModalOpen(true);
  };

  const handleReject = (item: PegawaiData) => {
    setSelectedItem(item);
    setActionType("reject");
    setRejectReason(""); // Clear previous reject reason
    setIsConfirmModalOpen(true);
  };

  const confirmAction = () => {
    if (selectedItem && actionType) {
      setPegawaiData((prevData) =>
        prevData.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                statusApproval:
                  actionType === "approve" ? "Approved" : "Rejected",
                rejectReason:
                  actionType === "reject" ? rejectReason : undefined,
              }
            : item
        )
      );
      closeConfirmModal();
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedItem(null);
    setActionType("");
    setRejectReason(""); // Clear reject reason on close
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                TIMESHEET PEGAWAI
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Operational
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  TimeSheet
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Pegawai</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
          {/* Search and actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 text-xs">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="No SO / SO Turunan / Proyek"
                className="w-full pl-2 pr-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Filter Pegawai
              </label>
              <select
                value={selectedPegawai}
                onChange={(e) => setSelectedPegawai(e.target.value)}
                className="w-full pl-2 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs bg-white"
              >
                <option value="">Semua Pegawai</option>
                {uniquePegawaiNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode MOB
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={mobFrom}
                  onChange={(e) => setMobFrom(e.target.value)}
                  className="w-full pl-2 pr-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <span className="text-gray-500">s.d</span>
                <input
                  type="date"
                  value={mobTo}
                  onChange={(e) => setMobTo(e.target.value)}
                  className="w-full pl-2 pr-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
              </div>
            </div>
            <div className="flex items-end justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Timesheet</span>
              </button>
            </div>
          </div>

          {/* Demob Range */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2 text-xs">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode DEMOB
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={demobFrom}
                  onChange={(e) => setDemobFrom(e.target.value)}
                  className="w-full pl-2 pr-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <span className="text-gray-500">s.d</span>
                <input
                  type="date"
                  value={demobTo}
                  onChange={(e) => setDemobTo(e.target.value)}
                  className="w-full pl-2 pr-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
              </div>
            </div>
            <div className="hidden md:block" />
            <div className="hidden md:block" />
            <div className="hidden md:block" />
          </div>

          {/* Quick Export Bar */}
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
            <div className="flex space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-1.5">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-1.5">
                <File className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-1.5">
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
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
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("tanggal")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal</span>
                      {sortField === "tanggal" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("noSO")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No SO</span>
                      {sortField === "noSO" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    No SO Turunan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Nama Proyek
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Nama Pegawai
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Kualifikasi
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    MOB
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    DEMOB
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Durasi
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Zona
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Nilai Timesheet
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Status Approval
                  </th>
                  {role !== "procon" && (
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPegawaiData.map((item, index) => (
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
                      animationDelay: animateRows ? `${index * 100}ms` : "0ms",
                      animationFillMode: "forwards",
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.no}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.tanggal}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.noSO}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.noSOTurunan}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.namaProyek}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.namaPegawai}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="space-y-1">
                        {item.kualifikasi.map((kual, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-1"
                          >
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>{kual}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.mob}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.demob}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.durasi}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.zona}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.nilaiTimesheet}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColorPegawai(
                          item.statusApproval
                        )}`}
                      >
                        {item.statusApproval}
                      </span>
                    </td>
                    {role !== "procon" && (
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDetailClick(item)}
                            className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-xs">Detail</span>
                          </button>
                          {item.statusApproval === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(item)}
                                className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(item)}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TimesheetBarangPegawaiModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingData(null);
        }}
        onSave={handleSave}
        initialData={editingData}
      />

      {isConfirmModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-4">
              Confirm {actionType === "approve" ? "Approval" : "Rejection"}
            </h3>
            <p className="mb-6">
              Are you sure you want to {actionType} timesheet for{" "}
              <span className="font-semibold">{selectedItem.namaPegawai}</span>{" "}
              (SO:
              <span className="font-semibold">{selectedItem.noSO}</span>)?
            </p>
            {actionType === "reject" && (
              <div className="mb-4">
                <label
                  htmlFor="rejectReason"
                  className="block text-sm font-medium text-gray-700 text-left mb-1"
                >
                  Reason for Rejection:
                </label>
                <textarea
                  id="rejectReason"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                ></textarea>
              </div>
            )}
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg font-medium ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                Yes, {actionType === "approve" ? "Approve" : "Reject"}
              </button>
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimesheetBarangPegawaiDashboard;
