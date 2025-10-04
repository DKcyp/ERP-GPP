import React, { useMemo, useState } from "react";
import {
  Search,
  Clock,
  FileSpreadsheet,
  FileText,
  Download,
  AlertTriangle,
  Plus,
  X,
  Save,
} from "lucide-react";
import TNAHistoryModal from "./TNAHistoryModal";
import { HistoryTNA } from "./TNAHistoryModal";

interface KPIItem {
  kpi: string;
  indikator: string;
  nilai: number; // 0 - 100
}

interface PegawaiKPI {
  id: string;
  nama: string;
  jabatan: string;
  departemen: string;
  kpis: KPIItem[];
}

// FORCE UPDATE - Mixed dataset with both high and low values for testing
const initialDataForceUpdate: PegawaiKPI[] = [
  {
    id: "EMP-001",
    nama: "Budi Santoso",
    jabatan: "Staff HR",
    departemen: "HRD",
    kpis: [
      { kpi: "Komunikasi", indikator: "Presentasi", nilai: 90 },
      { kpi: "Kepemimpinan", indikator: "Delegasi", nilai: 72 },
      { kpi: "Kedisiplinan", indikator: "Kehadiran", nilai: 90 },
    ],
  },
  {
    id: "EMP-002",
    nama: "Siti Mawar",
    jabatan: "Teknisi",
    departemen: "Operational",
    kpis: [
      { kpi: "Keselamatan Kerja", indikator: "APD", nilai: 35 },
      { kpi: "Prosedur", indikator: "SOP Pelaksanaan", nilai: 42 },
      { kpi: "Produktivitas", indikator: "Output Harian", nilai: 28 },
    ],
  },
  {
    id: "EMP-003",
    nama: "Joko Susilo",
    jabatan: "Marketing Officer",
    departemen: "Marketing",
    kpis: [
      { kpi: "Negosiasi", indikator: "Handling Objection", nilai: 38 },
      { kpi: "Penjualan", indikator: "Closing Rate", nilai: 25 },
    ],
  },
  {
    id: "EMP-004",
    nama: "Andi Pratama",
    jabatan: "Senior Developer",
    departemen: "IT",
    kpis: [
      { kpi: "Technical Skills", indikator: "Code Quality", nilai: 85 },
      { kpi: "Problem Solving", indikator: "Bug Resolution", nilai: 78 },
      { kpi: "Teamwork", indikator: "Collaboration", nilai: 82 },
    ],
  },
  {
    id: "EMP-005",
    nama: "Maya Sari",
    jabatan: "Finance Manager",
    departemen: "Finance",
    kpis: [
      { kpi: "Financial Analysis", indikator: "Report Accuracy", nilai: 88 },
      { kpi: "Leadership", indikator: "Team Management", nilai: 45 },
      { kpi: "Strategic Planning", indikator: "Budget Planning", nilai: 92 },
    ],
  },
  {
    id: "EMP-006",
    nama: "Rudi Hartono",
    jabatan: "Quality Manager",
    departemen: "QHSE",
    kpis: [
      { kpi: "Quality Control", indikator: "Process Improvement", nilai: 95 },
      { kpi: "Safety Management", indikator: "Incident Prevention", nilai: 87 },
      { kpi: "Audit Skills", indikator: "Compliance Check", nilai: 91 },
    ],
  },
];

const historyTNAData: HistoryTNA[] = [
  {
    id: "HIST-001",
    nama: "Ahmad Rizki",
    jabatan: "Staff Marketing",
    departemen: "Marketing",
    kpi: "Komunikasi",
    indikator: "Presentasi",
    nilaiSebelum: 45,
    nilaiSesudah: 78,
    tanggalTraining: "15-12-2024",
    statusTraining: "Completed",
    trainer: "Dr. Sari Wijaya",
    rekomendasiTraining: "Public Speaking & Presentation",
  },
  {
    id: "HIST-002",
    nama: "Lisa Permata",
    jabatan: "Teknisi",
    departemen: "Operational",
    kpi: "Keselamatan Kerja",
    indikator: "APD",
    nilaiSebelum: 38,
    nilaiSesudah: 85,
    tanggalTraining: "20-12-2024",
    statusTraining: "Completed",
    trainer: "Bpk. Hendra Saputra",
    rekomendasiTraining: "Pelatihan K3 & APD",
  },
  {
    id: "HIST-003",
    nama: "Doni Pratama",
    jabatan: "Marketing Officer",
    departemen: "Marketing",
    kpi: "Negosiasi",
    indikator: "Handling Objection",
    nilaiSebelum: 52,
    nilaiSesudah: 0,
    tanggalTraining: "10-01-2025",
    statusTraining: "In Progress",
    trainer: "Ibu Ratna Sari",
    rekomendasiTraining: "Negotiation & Objection Handling",
  },
  {
    id: "HIST-004",
    nama: "Eka Putri",
    jabatan: "Finance Staff",
    departemen: "Finance",
    kpi: "Analisis Keuangan",
    indikator: "Report Accuracy",
    nilaiSebelum: 41,
    nilaiSesudah: 0,
    tanggalTraining: "25-01-2025",
    statusTraining: "Cancelled",
    trainer: "Bpk. Agus Santoso",
    rekomendasiTraining: "Financial Analysis & Reporting",
  },
  {
    id: "HIST-005",
    nama: "Rini Handayani",
    jabatan: "Quality Inspector",
    departemen: "QHSE",
    kpi: "Quality Control",
    indikator: "Process Improvement",
    nilaiSebelum: 55,
    nilaiSesudah: 89,
    tanggalTraining: "05-01-2025",
    statusTraining: "Completed",
    trainer: "Dr. Bambang Sutrisno",
    rekomendasiTraining: "Quality Management & Process Improvement",
  },
  {
    id: "HIST-006",
    nama: "Fajar Nugroho",
    jabatan: "IT Support",
    departemen: "IT",
    kpi: "Technical Skills",
    indikator: "Problem Solving",
    nilaiSebelum: 42,
    nilaiSesudah: 76,
    tanggalTraining: "08-01-2025",
    statusTraining: "Completed",
    trainer: "Bpk. Andi Wijaya",
    rekomendasiTraining: "Technical Problem Solving & Troubleshooting",
  },
  {
    id: "HIST-007",
    nama: "Sinta Dewi",
    jabatan: "Admin HRD",
    departemen: "HRD",
    kpi: "Administrasi",
    indikator: "Document Management",
    nilaiSebelum: 48,
    nilaiSesudah: 0,
    tanggalTraining: "15-01-2025",
    statusTraining: "In Progress",
    trainer: "Ibu Maya Sari",
    rekomendasiTraining: "Document Management & Administrative Skills",
  },
];

// Simple suggestion engine based on KPI/Indikator keyword
const suggestTraining = (kpi: string, indikator: string): string => {
  const key = `${kpi} ${indikator}`.toLowerCase();
  if (key.includes("keselamatan") || key.includes("apd"))
    return "Pelatihan K3 & APD";
  if (key.includes("presentasi")) return "Public Speaking & Presentation";
  if (key.includes("delegasi")) return "Leadership: Delegation Skills";
  if (key.includes("sop")) return "Pelatihan SOP & Kepatuhan";
  if (key.includes("output") || key.includes("produkt"))
    return "Time Management & Productivity";
  if (key.includes("negosiasi") || key.includes("objection"))
    return "Negotiation & Objection Handling";
  return "Pelatihan Pengembangan Kompetensi Terkait";
};

const LOW_THRESHOLD_DEFAULT = 60;

const HRDTNADashboard: React.FC = () => {
  const [rows, setRows] = useState<PegawaiKPI[]>(initialDataForceUpdate);
  const [showEntries, setShowEntries] = useState(10);
  const [filters, setFilters] = useState({
    nama: "",
    departemen: "",
    kpi: "",
    indikator: "",
    minNilai: "",
    maxNilai: "",
    threshold: String(LOW_THRESHOLD_DEFAULT),
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    departemen: "",
    kpi: "",
    indikator: "",
    nilai: "",
    rekomendasiTraining: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Training confirmation modal states
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [selectedTrainingItem, setSelectedTrainingItem] = useState<any>(null);

  // History TNA states
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData] = useState<HistoryTNA[]>(historyTNAData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  // Modal handlers
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nama.trim()) newErrors.nama = "Nama harus diisi";
    if (!formData.jabatan.trim()) newErrors.jabatan = "Jabatan harus diisi";
    if (!formData.departemen.trim())
      newErrors.departemen = "Departemen harus diisi";
    if (!formData.kpi.trim()) newErrors.kpi = "KPI harus diisi";
    if (!formData.indikator.trim())
      newErrors.indikator = "Indikator harus diisi";
    if (!formData.nilai.trim()) {
      newErrors.nilai = "Nilai harus diisi";
    } else {
      const nilaiNum = parseInt(formData.nilai);
      if (isNaN(nilaiNum) || nilaiNum < 0 || nilaiNum > 100) {
        newErrors.nilai = "Nilai harus berupa angka antara 0-100";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if employee already exists
    const existingEmployee = rows.find(
      (emp) => emp.nama.toLowerCase() === formData.nama.toLowerCase()
    );

    if (existingEmployee) {
      // Add KPI to existing employee
      const newKPI: KPIItem = {
        kpi: formData.kpi,
        indikator: formData.indikator,
        nilai: parseInt(formData.nilai),
      };

      const updatedRows = rows.map((emp) =>
        emp.id === existingEmployee.id
          ? { ...emp, kpis: [...emp.kpis, newKPI] }
          : emp
      );
      setRows(updatedRows);
    } else {
      // Create new employee
      const newEmployee: PegawaiKPI = {
        id: `EMP-${String(rows.length + 1).padStart(3, "0")}`,
        nama: formData.nama,
        jabatan: formData.jabatan,
        departemen: formData.departemen,
        kpis: [
          {
            kpi: formData.kpi,
            indikator: formData.indikator,
            nilai: parseInt(formData.nilai),
          },
        ],
      };
      setRows([...rows, newEmployee]);
    }

    // Reset form and close modal
    setFormData({
      nama: "",
      jabatan: "",
      departemen: "",
      kpi: "",
      indikator: "",
      nilai: "",
      rekomendasiTraining: "",
    });
    setErrors({});
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setFormData({
      nama: "",
      jabatan: "",
      departemen: "",
      kpi: "",
      indikator: "",
      nilai: "",
      rekomendasiTraining: "",
    });
    setErrors({});
    setIsModalOpen(false);
  };

  const handleLanjutkanTraining = (item: any) => {
    setSelectedTrainingItem(item);
    setIsTrainingModalOpen(true);
  };

  const confirmTraining = () => {
    if (selectedTrainingItem) {
      // Here you can add logic to:
      // 1. Navigate to training page
      // 2. Create training record
      // 3. Send notification
      alert(`Training berhasil dimulai untuk ${selectedTrainingItem.nama}!`);
      console.log("Training confirmed for:", selectedTrainingItem);
    }
    setIsTrainingModalOpen(false);
    setSelectedTrainingItem(null);
  };

  const cancelTraining = () => {
    setIsTrainingModalOpen(false);
    setSelectedTrainingItem(null);
  };

  // Flattened rows: one line per low indicator per employee
  const flattened = useMemo(
    () =>
      rows.flatMap((p) =>
        p.kpis.map((k) => ({
          pegawaiId: p.id,
          nama: p.nama,
          jabatan: p.jabatan,
          departemen: p.departemen,
          kpi: k.kpi,
          indikator: k.indikator,
          nilai: k.nilai,
        }))
      ),
    [rows]
  );

  const openHistoryModal = () => {
    setShowHistoryModal(true);
  };

  const threshold = Number(filters.threshold || LOW_THRESHOLD_DEFAULT);

  const filtered = useMemo(() => {
    return flattened.filter((r) => {
      const matchNama = filters.nama
        ? r.nama.toLowerCase().includes(filters.nama.toLowerCase())
        : true;
      const matchDept = filters.departemen
        ? r.departemen.toLowerCase().includes(filters.departemen.toLowerCase())
        : true;
      const matchKPI = filters.kpi
        ? r.kpi.toLowerCase().includes(filters.kpi.toLowerCase())
        : true;
      const matchInd = filters.indikator
        ? r.indikator.toLowerCase().includes(filters.indikator.toLowerCase())
        : true;
      const matchMin = filters.minNilai
        ? r.nilai >= Number(filters.minNilai)
        : true;
      const matchMax = filters.maxNilai
        ? r.nilai <= Number(filters.maxNilai)
        : true;
      return (
        matchNama && matchDept && matchKPI && matchInd && matchMin && matchMax
      );
    });
  }, [flattened, filters]);

  const paged = useMemo(
    () => filtered.slice(0, showEntries),
    [filtered, showEntries]
  );

  const handleExport = (type: string) => {
    alert(`Exporting ${type} (dummy)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                TRAINING NEED ANALYSIS (TNA)
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  HRD
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">TNA</span>
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
                KPI
              </label>
              <input
                name="kpi"
                value={filters.kpi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari KPI..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Indikator
              </label>
              <input
                name="indikator"
                value={filters.indikator}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari indikator..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nilai Minimum
              </label>
              <input
                type="number"
                name="minNilai"
                value={filters.minNilai}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="cth: 40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nilai Maksimum
              </label>
              <input
                type="number"
                name="maxNilai"
                value={filters.maxNilai}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="cth: 60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ambang Rendah (Threshold)
              </label>
              <input
                type="number"
                name="threshold"
                value={filters.threshold}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="default 60"
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
          <div className="p-0 flex justify-between items-center">
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
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 text-xs"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 text-xs"
                onClick={openHistoryModal}
              >
                <Clock className="h-4 w-4" />
                <span>History</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 text-xs"
                onClick={() => handleExport("Excel")}
              >
                <FileSpreadsheet className="h-4 w-4" />
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
                <FileText className="h-4 w-4" />
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
                    Jabatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departemen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KPI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Indikator
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rekomendasi Training
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paged.map((r) => {
                  const low = r.nilai < threshold;
                  return (
                    <tr
                      key={`${r.pegawaiId}-${r.kpi}-${r.indikator}`}
                      className={
                        low
                          ? "bg-red-50 hover:bg-red-100 transition-colors"
                          : "hover:bg-gray-50 transition-colors"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {r.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {r.jabatan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {r.departemen}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {r.kpi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {r.indikator}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            low
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {r.nilai}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center gap-2">
                        {low && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <span>{suggestTraining(r.kpi, r.indikator)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {r.nilai > 70 ? (
                          <button
                            onClick={() => handleLanjutkanTraining(r)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg font-medium transition-colors flex items-center space-x-1 mx-auto"
                          >
                            <span>Lanjutkan ke Training</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            Nilai terlalu rendah
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Footer: simple pagination placeholder */}
          <div className="p-4 flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing 1 to {Math.min(filtered.length, showEntries)} of{" "}
              {filtered.length} entries
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">
                Tambah Data KPI Pegawai
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Nama */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleFormChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.nama
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200"
                        }`}
                        placeholder="Masukkan nama pegawai"
                      />
                      {errors.nama && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.nama}
                        </p>
                      )}
                    </div>

                    {/* Jabatan */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jabatan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="jabatan"
                        value={formData.jabatan}
                        onChange={handleFormChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.jabatan
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200"
                        }`}
                        placeholder="Masukkan jabatan"
                      />
                      {errors.jabatan && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.jabatan}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Departemen */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departemen <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="departemen"
                      value={formData.departemen}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.departemen
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    >
                      <option value="">Pilih Departemen</option>
                      <option value="HRD">HRD</option>
                      <option value="Operational">Operational</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="IT">IT</option>
                      <option value="QHSE">QHSE</option>
                    </select>
                    {errors.departemen && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.departemen}
                      </p>
                    )}
                  </div>

                  {/* KPI & Indikator */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* KPI */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        KPI <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="kpi"
                        value={formData.kpi}
                        onChange={handleFormChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.kpi
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200"
                        }`}
                        placeholder="Contoh: Komunikasi"
                      />
                      {errors.kpi && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.kpi}
                        </p>
                      )}
                    </div>

                    {/* Indikator */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Indikator <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="indikator"
                        value={formData.indikator}
                        onChange={handleFormChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.indikator
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200"
                        }`}
                        placeholder="Contoh: Presentasi"
                      />
                      {errors.indikator && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.indikator}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Nilai */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nilai (0-100) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="nilai"
                      value={formData.nilai}
                      onChange={handleFormChange}
                      min="0"
                      max="100"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.nilai
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                      placeholder="Masukkan nilai 0-100"
                    />
                    {errors.nilai && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nilai}
                      </p>
                    )}
                  </div>

                  {/* Rekomendasi Training */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rekomendasi Training
                    </label>
                    <input
                      type="text"
                      name="rekomendasiTraining"
                      value={formData.rekomendasiTraining}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Contoh: Pelatihan K3 & APD"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Simpan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Training Confirmation Modal */}
      {isTrainingModalOpen && selectedTrainingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Konfirmasi Training
              </h3>

              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  Apakah Anda yakin ingin melanjutkan ke training untuk:
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="font-medium">Nama:</span>{" "}
                      {selectedTrainingItem.nama}
                    </div>
                    <div>
                      <span className="font-medium">Jabatan:</span>{" "}
                      {selectedTrainingItem.jabatan}
                    </div>
                    <div>
                      <span className="font-medium">Departemen:</span>{" "}
                      {selectedTrainingItem.departemen}
                    </div>
                    <div>
                      <span className="font-medium">KPI:</span>{" "}
                      {selectedTrainingItem.kpi}
                    </div>
                    <div>
                      <span className="font-medium">Indikator:</span>{" "}
                      {selectedTrainingItem.indikator}
                    </div>
                    <div>
                      <span className="font-medium">Nilai:</span>
                      <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {selectedTrainingItem.nilai}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  Training akan dimulai dan notifikasi akan dikirim kepada
                  pegawai yang bersangkutan.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={cancelTraining}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmTraining}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Lanjutkan Training
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TNA History Modal */}
      <TNAHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        historyData={historyData}
      />
    </div>
  );
};

export default HRDTNADashboard;
