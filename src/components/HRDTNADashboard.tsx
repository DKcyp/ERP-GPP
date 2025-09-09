import React, { useMemo, useState } from "react";
import {
  Search,
  Clock,
  FileSpreadsheet,
  FileText,
  Download,
  AlertTriangle,
} from "lucide-react";

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

// Dummy dataset: we will derive low-score indicators (e.g., < 60)
const initialData: PegawaiKPI[] = [
  {
    id: "EMP-001",
    nama: "Budi Santoso",
    jabatan: "Staff HR",
    departemen: "HRD",
    kpis: [
      { kpi: "Komunikasi", indikator: "Presentasi", nilai: 58 },
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
      { kpi: "Keselamatan Kerja", indikator: "APD", nilai: 55 },
      { kpi: "Prosedur", indikator: "SOP Pelaksanaan", nilai: 62 },
      { kpi: "Produktivitas", indikator: "Output Harian", nilai: 48 },
    ],
  },
  {
    id: "EMP-003",
    nama: "Joko Susilo",
    jabatan: "Marketing Officer",
    departemen: "Marketing",
    kpis: [
      { kpi: "Negosiasi", indikator: "Handling Objection", nilai: 59 },
      { kpi: "Penjualan", indikator: "Closing Rate", nilai: 65 },
    ],
  },
];

// Simple suggestion engine based on KPI/Indikator keyword
const suggestTraining = (kpi: string, indikator: string): string => {
  const key = `${kpi} ${indikator}`.toLowerCase();
  if (key.includes("keselamatan") || key.includes("apd")) return "Pelatihan K3 & APD";
  if (key.includes("presentasi")) return "Public Speaking & Presentation";
  if (key.includes("delegasi")) return "Leadership: Delegation Skills";
  if (key.includes("sop")) return "Pelatihan SOP & Kepatuhan";
  if (key.includes("output") || key.includes("produkt")) return "Time Management & Productivity";
  if (key.includes("negosiasi") || key.includes("objection")) return "Negotiation & Objection Handling";
  return "Pelatihan Pengembangan Kompetensi Terkait";
};

const LOW_THRESHOLD_DEFAULT = 60;

const HRDTNADashboard: React.FC = () => {
  const [rows] = useState<PegawaiKPI[]>(initialData);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
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

  const threshold = Number(filters.threshold || LOW_THRESHOLD_DEFAULT);

  const filtered = useMemo(() => {
    return flattened.filter((r) => {
      const lowEnough = r.nilai < threshold; // Only focus on low performers
      const matchNama = filters.nama
        ? r.nama.toLowerCase().includes(filters.nama.toLowerCase())
        : true;
      const matchDept = filters.departemen
        ? r.departemen === filters.departemen
        : true;
      const matchKPI = filters.kpi
        ? r.kpi.toLowerCase().includes(filters.kpi.toLowerCase())
        : true;
      const matchInd = filters.indikator
        ? r.indikator.toLowerCase().includes(filters.indikator.toLowerCase())
        : true;
      const matchMin = filters.minNilai ? r.nilai >= Number(filters.minNilai) : true;
      const matchMax = filters.maxNilai ? r.nilai <= Number(filters.maxNilai) : true;
      return (
        lowEnough && matchNama && matchDept && matchKPI && matchInd && matchMin && matchMax
      );
    });
  }, [flattened, filters, threshold]);

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
                <span className="hover:text-blue-600 cursor-pointer transition-colors">HRD</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                name="nama"
                value={filters.nama}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari nama..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">KPI</label>
              <input
                name="kpi"
                value={filters.kpi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari KPI..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Indikator</label>
              <input
                name="indikator"
                value={filters.indikator}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari indikator..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Minimum</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Maksimum</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Ambang Rendah (Threshold)</label>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KPI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indikator</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rekomendasi Training</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.jabatan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.departemen}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.kpi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.indikator}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          low ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {r.nilai}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center gap-2">
                        {low && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <span>{suggestTraining(r.kpi, r.indikator)}</span>
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
              Showing 1 to {Math.min(filtered.length, showEntries)} of {filtered.length} entries
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 border border-primary bg-primary text-white rounded-md">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDTNADashboard;
