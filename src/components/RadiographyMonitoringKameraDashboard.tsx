import React, { useMemo, useState } from "react";
import {
  Clock,
  Download,
  Edit2,
  MapPin,
  PlusCircle,
  Search,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type Kamera = {
  id: string;
  serialNumber: string;
  isotopPerWeek: string; // Monthly summary text
  lokasi: string;
  posisiKameraCi: number; // for reminder check (> 30 Ci)
};

type DetailRow = {
  no: string;
  personil: string;
  validSbs: string;
  endKontral: string;
  status: string;
  dosimetSaku: string;
  surveyMeter: string;
  surveyMeterValidCert: string;
  ujiUsapKamera: string;
  w1: string;
  w2: string;
  w3: string;
  w4: string;
  lokasiPemanfaatan: string;
  posisiKamera: string[];
};

const initialData: Kamera[] = [
  {
    id: "KAM-001",
    serialNumber: "S5055",
    isotopPerWeek: "AZ562",
    lokasi: "Workshop A",
    posisiKameraCi: 28,
  },
  {
    id: "KAM-002",
    serialNumber: "D12499",
    isotopPerWeek: "AZ091",
    lokasi: "Field Site 1",
    posisiKameraCi: 33,
  },
];

const RadiographyMonitoringKameraDashboard: React.FC = () => {
  const [data, setData] = useState<Kamera[]>(initialData);
  const [searchSN, setSearchSN] = useState("");
  const [lokasiFilter, setLokasiFilter] = useState("");
  const [showEntries, setShowEntries] = useState("10");

  // modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Kamera | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Kamera | null>(null);

  // detail modal state
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Kamera | null>(null);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth());
  // details data: kameraId -> monthIndex -> rows
  const [details, setDetails] = useState<
    Record<string, Record<number, DetailRow[]>>
  >({});

  const openDetail = (row: Kamera) => {
    setSelected(row);
    setDetailOpen(true);
  };

  const getMonthRows = (kameraId: string, monthIndex: number): DetailRow[] => {
    return details[kameraId]?.[monthIndex] ?? [];
  };

  const setMonthRows = (
    kameraId: string,
    monthIndex: number,
    rows: DetailRow[]
  ) => {
    setDetails((prev) => ({
      ...prev,
      [kameraId]: {
        ...(prev[kameraId] ?? {}),
        [monthIndex]: rows,
      },
    }));
  };

  const addDetailRow = () => {
    if (!selected) return;
    const rows = getMonthRows(selected.id, activeMonth);
    const newRow: DetailRow = {
      no: String(rows.length + 1),
      personil: "",
      validSbs: "",
      endKontral: "",
      status: "",
      dosimetSaku: "",
      surveyMeter: "",
      surveyMeterValidCert: "",
      ujiUsapKamera: "",
      w1: "",
      w2: "",
      w3: "",
      w4: "",
      lokasiPemanfaatan: "",
      posisiKamera: [],
    };
    setMonthRows(selected.id, activeMonth, [...rows, newRow]);
  };

  const updateDetailCell = (
    rowIndex: number,
    field: keyof DetailRow,
    value: string | string[]
  ) => {
    if (!selected) return;
    const rows = getMonthRows(selected.id, activeMonth);
    const updated = rows.map((r, i) =>
      i === rowIndex ? { ...r, [field]: value } : r
    );
    setMonthRows(selected.id, activeMonth, updated);
  };

  const removeDetailRow = (rowIndex: number) => {
    if (!selected) return;
    const rows = getMonthRows(selected.id, activeMonth);
    const updated = rows
      .filter((_, i) => i !== rowIndex)
      .map((r, i) => ({ ...r, no: String(i + 1) }));
    setMonthRows(selected.id, activeMonth, updated);
  };

  const lokasiOptions = useMemo(() => {
    const s = new Set<string>();
    data.forEach((d) => s.add(d.lokasi));
    return Array.from(s);
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((d) => {
      const matchSN = d.serialNumber
        .toLowerCase()
        .includes(searchSN.toLowerCase());
      const matchLok = !lokasiFilter || d.lokasi === lokasiFilter;
      return matchSN && matchLok;
    });
  }, [data, searchSN, lokasiFilter]);

  const handleExport = (type: string) => {
    alert(`Export ${type} (dummy)`);
  };

  const openAdd = () => {
    setEditing({
      id: "",
      serialNumber: "",
      isotopPerWeek: "",
      lokasi: "",
      posisiKameraCi: 0,
    });
    setIsFormOpen(true);
  };
  const openEdit = (row: Kamera) => {
    setEditing({ ...row });
    setIsFormOpen(true);
  };
  const saveForm = () => {
    if (!editing) return;
    if (editing.id) {
      setData((prev) => prev.map((p) => (p.id === editing.id ? editing : p)));
    } else {
      const newRow = {
        ...editing,
        id: `KAM-${String(Math.floor(Math.random() * 900) + 100)}`,
      };
      setData((prev) => [newRow, ...prev]);
    }
    setIsFormOpen(false);
    setEditing(null);
  };
  const cancelForm = () => {
    setIsFormOpen(false);
    setEditing(null);
  };

  const askDelete = (row: Kamera) => {
    setDeleting(row);
    setIsDeleteOpen(true);
  };
  const confirmDelete = () => {
    if (deleting) setData((prev) => prev.filter((p) => p.id !== deleting.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MONITORING KAMERA RADIOGRAPHY
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  QHSE
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Radiography</span>
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
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Serial Number Kamera
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan serial number..."
                  value={searchSN}
                  onChange={(e) => setSearchSN(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Lokasi
              </label>
              <div className="relative">
                <select
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={lokasiFilter}
                  onChange={(e) => setLokasiFilter(e.target.value)}
                >
                  <option value="">Semua lokasi</option>
                  {lokasiOptions.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="lg:col-span-2 flex items-end justify-end space-x-3">
              <button
                onClick={openAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Tambah Kamera
              </button>
              <button
                onClick={() => {
                  /* Search executed by controlled inputs */
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Search className="h-5 w-5 mr-2" /> Cari Data
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
                    Kamera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Isotop
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row) => {
                  const danger = row.posisiKameraCi > 30;
                  return (
                    <tr
                      key={row.id}
                      className={
                        (danger ? "bg-red-50 " : "") +
                        "hover:bg-gray-50 transition-colors"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.serialNumber}
                        {danger && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> &gt; 30
                            Ci
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {row.isotopPerWeek}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                        <button
                          onClick={() => openDetail(row)}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 text-xs"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isFormOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {editing.id ? "Edit Kamera" : "Tambah Kamera"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number Kamera
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={editing.serialNumber}
                  onChange={(e) =>
                    setEditing((p) =>
                      p ? { ...p, serialNumber: e.target.value } : p
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Isotop per Week (Monthly)
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={editing.isotopPerWeek}
                  onChange={(e) =>
                    setEditing((p) =>
                      p ? { ...p, isotopPerWeek: e.target.value } : p
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi Pemanfaatan
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={editing.lokasi}
                  onChange={(e) =>
                    setEditing((p) =>
                      p ? { ...p, lokasi: e.target.value } : p
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posisi Kamera (Ci)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={editing.posisiKameraCi}
                  onChange={(e) =>
                    setEditing((p) =>
                      p ? { ...p, posisiKameraCi: Number(e.target.value) } : p
                    )
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={cancelForm}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Batal
              </button>
              <button
                onClick={saveForm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm inline-flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Detail Kamera: {selected.serialNumber}
                </h2>
                <p className="text-sm text-gray-500">
                  Isotop: {selected.isotopPerWeek} • Lokasi: {selected.lokasi}
                </p>
              </div>
              <button
                onClick={() => setDetailOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              {/* Tabs */}
              <div className="flex overflow-x-auto gap-2 pb-2">
                {months.map((m, idx) => (
                  <button
                    key={m}
                    onClick={() => setActiveMonth(idx)}
                    className={
                      (idx === activeMonth
                        ? "bg-blue-600 text-white "
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 ") +
                      "px-3 py-1.5 rounded-full text-sm whitespace-nowrap"
                    }
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Flexible input table */}
              <div className="mt-4 border rounded-xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Personil
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valid SBS
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End Kontral
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dosimet Saku
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SurveyMeter
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valid Cert
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uji Usap Kamera
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          W1
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          W2
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          W3
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          W4
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lokasi Pemanfaatan
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posisi Kamera
                        </th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getMonthRows(selected.id, activeMonth).map((r, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 text-sm text-gray-700 w-16">
                            {r.no}
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-40 border rounded px-2 py-1 text-sm"
                              value={r.personil}
                              onChange={(e) =>
                                updateDetailCell(
                                  idx,
                                  "personil",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-32 border rounded px-2 py-1 text-sm"
                              value={r.validSbs}
                              onChange={(e) =>
                                updateDetailCell(
                                  idx,
                                  "validSbs",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-32 border rounded px-2 py-1 text-sm"
                              value={r.endKontral}
                              onChange={(e) =>
                                updateDetailCell(
                                  idx,
                                  "endKontral",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-28 border rounded px-2 py-1 text-sm"
                              value={r.status}
                              onChange={(e) =>
                                updateDetailCell(idx, "status", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-32 border rounded px-2 py-1 text-sm"
                              value={r.dosimetSaku}
                              onChange={(e) =>
                                updateDetailCell(
                                  idx,
                                  "dosimetSaku",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-32 border rounded px-2 py-1 text-sm"
                              value={r.surveyMeter}
                              onChange={(e) =>
                                updateDetailCell(
                                  idx,
                                  "surveyMeter",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-28 border rounded px-2 py-1 text-sm"
                              value={r.surveyMeterValidCert}
                              onChange={(e) =>
                                updateDetailCell(
                                  idx,
                                  "surveyMeterValidCert",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-36 border rounded px-2 py-1 text-sm"
                              value={r.ujiUsapKamera}
                              onChange={(e) =>
                                updateDetailCell(
                                  idx,
                                  "ujiUsapKamera",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-16 border rounded px-2 py-1 text-sm"
                              value={r.w1}
                              onChange={(e) =>
                                updateDetailCell(idx, "w1", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-16 border rounded px-2 py-1 text-sm"
                              value={r.w2}
                              onChange={(e) =>
                                updateDetailCell(idx, "w2", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-16 border rounded px-2 py-1 text-sm"
                              value={r.w3}
                              onChange={(e) =>
                                updateDetailCell(idx, "w3", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-16 border rounded px-2 py-1 text-sm"
                              value={r.w4}
                              onChange={(e) =>
                                updateDetailCell(idx, "w4", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-48 border rounded px-2 py-1 text-sm"
                              value={r.lokasiPemanfaatan}
                              onChange={(e) =>
                                updateDetailCell(
                                  idx,
                                  "lokasiPemanfaatan",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <div className="relative">
                              <select
                                multiple
                                className="w-48 border rounded px-2 py-1 text-sm h-20 focus:ring-blue-500 focus:border-blue-500"
                                value={r.posisiKamera}
                                onChange={(e) => {
                                  const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                                  updateDetailCell(
                                    idx,
                                    "posisiKamera",
                                    selectedValues
                                  );
                                }}
                              >
                                <option value="PHE ONWJ">PHE ONWJ</option>
                                <option value="MEDCO EPG">MEDCO EPG</option>
                                <option value="OFFICE">OFFICE</option>
                                <option value="PROJECT">PROJECT</option>
                                <option value="CORRIDOR">CORRIDOR</option>
                                <option value="FIELD SITE">FIELD SITE</option>
                              </select>
                              <div className="text-xs text-gray-500 mt-1">
                                {r.posisiKamera.length > 0 ? `${r.posisiKamera.length} dipilih` : 'Pilih posisi'}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              onClick={() => removeDetailRow(idx)}
                              className="px-2 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 border-t bg-gray-50 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Bulan: {months[activeMonth]}
                  </div>
                  <button
                    onClick={addDetailRow}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" /> Tambah Baris
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={deleting?.serialNumber}
        title="Konfirmasi Hapus Kamera"
        message="Apakah Anda yakin ingin menghapus data kamera ini?"
      />
    </div>
  );
};

export default RadiographyMonitoringKameraDashboard;
