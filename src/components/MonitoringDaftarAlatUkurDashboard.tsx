import React, { useMemo, useState } from "react";
import {
  Clock,
  Download,
  PlusCircle,
  Search,
  Calendar,
  Tag,
  MapPin,
  AlertTriangle,
  X,
} from "lucide-react";

// Types
type AlatUkur = {
  id: string;
  serialNumber: string;
  namaBarang: string;
  jenisBarang: string; // dropdown value
  masaBerlaku: string; // ISO date string
  posisiBarang: string;
  kategori: SubKategoriKey;
};

const SUB_KATEGORI = [
  { key: "mpt", label: "Magnetic Particle Testing" },
  { key: "pt", label: "Penetrant Particle Testing" },
  { key: "rt", label: "Radiography Testing" },
  { key: "ut", label: "Ultrasonic Testing" },
  { key: "painting", label: "Painting" },
  { key: "hydrotest", label: "Hydrotest" },
  { key: "lainnya", label: "Inspeksi Lainnya" },
  { key: "equipment", label: "Equipment Lainnya (APAR, P3K, dll.)" },
] as const;

type SubKategoriKey = (typeof SUB_KATEGORI)[number]["key"];

const initialData: AlatUkur[] = [
  {
    id: "1",
    serialNumber: "SN-001",
    namaBarang: "Surveymeter X100",
    jenisBarang: "Instrument",
    masaBerlaku: new Date(Date.now() + 30 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10),
    posisiBarang: "Warehouse A",
    kategori: "rt",
  },
  {
    id: "2",
    serialNumber: "SN-002",
    namaBarang: "Gauge UT-500",
    jenisBarang: "Instrument",
    masaBerlaku: new Date(Date.now() + 90 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10),
    posisiBarang: "Workshop",
    kategori: "ut",
  },
  {
    id: "3",
    serialNumber: "SN-003",
    namaBarang: "APAR 3KG",
    jenisBarang: "Safety",
    masaBerlaku: new Date(Date.now() + 50 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10),
    posisiBarang: "Office Lantai 2",
    kategori: "equipment",
  },
  // Contoh untuk setiap tab/subkategori
  {
    id: "4",
    serialNumber: "SN-MPT-001",
    namaBarang: "Yoke MPT-200",
    jenisBarang: "Instrument",
    masaBerlaku: new Date(Date.now() + 45 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10),
    posisiBarang: "Warehouse B",
    kategori: "mpt",
  },
  {
    id: "5",
    serialNumber: "SN-PT-001",
    namaBarang: "Kit Penetrant A",
    jenisBarang: "Consumable",
    masaBerlaku: new Date(Date.now() + 20 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10),
    posisiBarang: "Gudang Kimia",
    kategori: "pt",
  },
  {
    id: "6",
    serialNumber: "SN-PNT-001",
    namaBarang: "Paint Gauge 300",
    jenisBarang: "Instrument",
    masaBerlaku: new Date(Date.now() + 70 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10),
    posisiBarang: "Workshop Painting",
    kategori: "painting",
  },
  {
    id: "7",
    serialNumber: "SN-HYD-001",
    namaBarang: "Hydro Pump H1",
    jenisBarang: "Equipment",
    masaBerlaku: new Date(Date.now() + 10 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10),
    posisiBarang: "Yard",
    kategori: "hydrotest",
  },
  {
    id: "8",
    serialNumber: "SN-LNY-001",
    namaBarang: "Tangga Inspeksi",
    jenisBarang: "Equipment",
    masaBerlaku: new Date(Date.now() + 58 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10),
    posisiBarang: "Office Belakang",
    kategori: "lainnya",
  },
];

const daysTo = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const MonitoringDaftarAlatUkurDashboard: React.FC = () => {
  // Table state
  const [rows, setRows] = useState<AlatUkur[]>(initialData);
  const [query, setQuery] = useState("");
  const [jenisBarang, setJenisBarang] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeSub, setActiveSub] = useState<SubKategoriKey>("rt");
  const [showEntries, setShowEntries] = useState("10");

  // Modal state
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({
    serialNumber: "",
    namaBarang: "",
    jenisBarang: "",
    masaBerlaku: "",
    posisiBarang: "",
  });

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (r.kategori !== activeSub) return false;
      const q = query.toLowerCase();
      const matchQ = !q || r.namaBarang.toLowerCase().includes(q);
      const matchJenis = !jenisBarang || r.jenisBarang === jenisBarang;
      const date = new Date(r.masaBerlaku);
      const inStart = !startDate || date >= new Date(startDate + "T00:00:00");
      const inEnd = !endDate || date <= new Date(endDate + "T23:59:59");
      return matchQ && matchJenis && inStart && inEnd;
    });
  }, [rows, activeSub, query, jenisBarang, startDate, endDate]);

  const expiringItems = useMemo(() => {
    return filtered
      .filter((r) => daysTo(r.masaBerlaku) <= 60)
      .sort((a, b) => daysTo(a.masaBerlaku) - daysTo(b.masaBerlaku));
  }, [filtered]);

  const handleExport = (fmt: string) => alert(`Export ${fmt} (dummy)`);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleSave = () => {
    // Basic validation
    if (
      !form.serialNumber ||
      !form.namaBarang ||
      !form.jenisBarang ||
      !form.masaBerlaku ||
      !form.posisiBarang
    ) {
      alert("Lengkapi semua field terlebih dahulu.");
      return;
    }
    const newItem: AlatUkur = {
      id: Date.now().toString(),
      serialNumber: form.serialNumber,
      namaBarang: form.namaBarang,
      jenisBarang: form.jenisBarang,
      masaBerlaku: form.masaBerlaku,
      posisiBarang: form.posisiBarang,
      kategori: activeSub,
    };
    setRows((prev) => [newItem, ...prev]);
    setForm({
      serialNumber: "",
      namaBarang: "",
      jenisBarang: "",
      masaBerlaku: "",
      posisiBarang: "",
    });
    setOpenAdd(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MONITORING DAFTAR ALAT UKUR
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  QHSE
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring</span>
              </nav>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expiring Warning */}
      {expiringItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 -mt-4 mb-4">
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-semibold">
                  {expiringItems.length} item akan habis masa berlaku dalam ≤ 60 hari pada tab ini.
                </p>
                <ul className="mt-1 text-sm list-disc pl-5">
                  {expiringItems.slice(0, 5).map((it) => (
                    <li key={it.id}>
                      {it.namaBarang} — {daysTo(it.masaBerlaku)} hari lagi (SN: {it.serialNumber})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Subkategori Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex gap-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
            {SUB_KATEGORI.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSub(s.key)}
                className={
                  "px-3 py-2 rounded-lg text-sm whitespace-nowrap " +
                  (activeSub === s.key
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-50")
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Nama Barang
              </label>
              <div className="relative">
                <input
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nama barang..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode Masa Berlaku
              </label>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons (MCU-style) */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Data
            </button>
            <button
              onClick={() => {}}
              className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
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
          <div className="flex space-x-3">
            <button
              onClick={() => handleExport("Excel")}
              className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button
              onClick={() => handleExport("CSV")}
              className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button
              onClick={() => handleExport("PDF")}
              className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-red-600 hover:bg-red-700"
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
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masa Berlaku Certificate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posisi Barang
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row) => {
                  const sisa = daysTo(row.masaBerlaku);
                  const danger = sisa <= 60; // highlight merah jika <= 60 hari lagi
                  return (
                    <tr
                      key={row.id}
                      className={
                        danger
                          ? "bg-red-50 hover:bg-red-100 transition-colors"
                          : "hover:bg-gray-50 transition-colors"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {row.namaBarang}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="inline-flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(row.masaBerlaku).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                        {danger && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {sisa} hari
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="inline-flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {row.posisiBarang}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Add Modal */}
        {openAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={handleCloseAdd}
            />
            <div className="relative bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold">Tambah Data Alat Ukur</h3>
                <button
                  onClick={handleCloseAdd}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serial Number
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={form.serialNumber}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, serialNumber: e.target.value }))
                      }
                      placeholder="SN-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Barang
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={form.namaBarang}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, namaBarang: e.target.value }))
                      }
                      placeholder="Nama alat ukur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posisi Barang
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={form.posisiBarang}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, posisiBarang: e.target.value }))
                      }
                      placeholder="Lokasi alat"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Masa Berlaku Sertifikat
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={form.masaBerlaku}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, masaBerlaku: e.target.value }))
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subkategori
                    </label>
                    <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700">
                      {SUB_KATEGORI.find((s) => s.key === activeSub)?.label}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                <button
                  onClick={handleCloseAdd}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringDaftarAlatUkurDashboard;
