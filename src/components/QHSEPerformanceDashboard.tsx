import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Shield,
  PlusCircle,
  Download,
  Pencil,
  Trash2,
  TrendingUp,
  Users,
  ExternalLink,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useAuth } from "../context/AuthContext";

interface PerformanceItem {
  id: string;
  bulan: string; // e.g., "Januari"
  tahun: number; // e.g., 2025
  lagging: string; // text/score
  leading: string; // text/score
  document?: string; // url or filename
}

interface LaggingIndicators {
  fatality: number;
  rwc: number;
  fac: number;
  mtc: number;
  lwdc: number;
  propertyDamage: number;
  environment: number;
  motorVehicleAccident: number;
  occupationalIllness: number;
  nearMiss: number;
}

interface SimpleIndicator {
  id: string;
  name: string;
  description: string;
  value?: number; // Added to store numeric performance for indicators
}

interface KPIItem {
  id: string;
  kpiName: string;
  category: string;
  responsible: string;
  target: number;
  actual: number;
}

interface TargetItem {
  id: string;
  description: string;
  target: number;
  targetYTD: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  last12MthTotal: number;
  jumlahHariHilang?: number;
  category: "LAGGING" | "LEADING";
}

const BULAN_OPTIONS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const TAHUN_OPTIONS = (() => {
  const now = new Date().getFullYear();
  const arr: number[] = [];
  for (let t = now - 3; t <= now + 1; t++) arr.push(t);
  return arr;
})();

const initialData: PerformanceItem[] = [
  {
    id: "1",
    bulan: "Januari",
    tahun: 2025,
    lagging: "0 incident",
    leading: "5 toolbox meeting",
    document: "qhse-perf-jan25.pdf",
  },
  {
    id: "2",
    bulan: "Februari",
    tahun: 2025,
    lagging: "1 incident",
    leading: "4 toolbox meeting",
    document: undefined,
  },
];

const initialKPIData: KPIItem[] = [
  {
    id: "1",
    kpiName: "KPI 1",
    category: "Category 1",
    responsible: "John Doe",
    target: 100,
    actual: 80,
  },
  {
    id: "2",
    kpiName: "KPI 2",
    category: "Category 2",
    responsible: "Jane Doe",
    target: 200,
    actual: 150,
  },
];

const initialTargetData: TargetItem[] = [
  {
    id: "1",
    description: "Target 1",
    target: 100,
    targetYTD: 100,
    jan: 10,
    feb: 20,
    mar: 30,
    apr: 40,
    may: 50,
    jun: 60,
    jul: 70,
    aug: 80,
    sep: 90,
    oct: 100,
    nov: 110,
    dec: 120,
    last12MthTotal: 1200,
    jumlahHariHilang: 10,
    category: "LAGGING",
  },
  {
    id: "2",
    description: "Target 2",
    target: 200,
    targetYTD: 200,
    jan: 20,
    feb: 40,
    mar: 60,
    apr: 80,
    may: 100,
    jun: 120,
    jul: 140,
    aug: 160,
    sep: 180,
    oct: 200,
    nov: 220,
    dec: 240,
    last12MthTotal: 2400,
    jumlahHariHilang: 20,
    category: "LEADING",
  },
];

// Default indicator lists for each card so every row is editable/deletable
const defaultLaggingList: SimpleIndicator[] = [
  { id: "lag-1", name: "Fatality", description: "", value: 0 },
  {
    id: "lag-2",
    name: "Restricted Work Case (RWC)",
    description: "",
    value: 0,
  },
  { id: "lag-3", name: "First Aid Case (FAC)", description: "", value: 0 },
  {
    id: "lag-4",
    name: "Medical Treatment Case (MTC)",
    description: "",
    value: 0,
  },
  { id: "lag-5", name: "Lost Work Day Case (LWDC)", description: "", value: 0 },
  { id: "lag-6", name: "Property Damage", description: "", value: 0 },
  { id: "lag-7", name: "Environment", description: "", value: 0 },
  { id: "lag-8", name: "Motor Vehicle Accident", description: "", value: 0 },
  { id: "lag-9", name: "Occupational Illness", description: "", value: 0 },
  { id: "lag-10", name: "Near Miss", description: "", value: 0 },
];

const defaultLeadingList: SimpleIndicator[] = [
  { id: "lead-1", name: "HSE Audit (Internal)", description: "", value: 0 },
  { id: "lead-2", name: "HSE Audit (Eksternal)", description: "", value: 0 },
  { id: "lead-3", name: "Medical Check Up", description: "", value: 0 },
  { id: "lead-4", name: "PPE Inspection", description: "", value: 0 },
  {
    id: "lead-5",
    name: "Fire Extinguisher Inspection",
    description: "",
    value: 0,
  },
  { id: "lead-6", name: "First Aid Inspection", description: "", value: 0 },
  { id: "lead-7", name: "HSE Meeting", description: "", value: 0 },
  { id: "lead-8", name: "HSE Induction", description: "", value: 0 },
  { id: "lead-9", name: "Management Visit", description: "", value: 0 },
  { id: "lead-10", name: "Vehicle Inspection", description: "", value: 0 },
  { id: "lead-11", name: "Emergency Drill", description: "", value: 0 },
  { id: "lead-12", name: "Hazard Observation", description: "", value: 0 },
  { id: "lead-13", name: "Healthy Week", description: "", value: 0 },
  { id: "lead-14", name: "HSE Bulletin", description: "", value: 0 },
];

const defaultManhoursList: SimpleIndicator[] = [
  { id: "mh-1", name: "Office", description: "", value: 0 },
  { id: "mh-2", name: "PHE ONWJ", description: "", value: 0 },
  { id: "mh-3", name: "Medco Corridor", description: "", value: 0 },
  { id: "mh-4", name: "PHM", description: "", value: 0 },
  { id: "mh-5", name: "Medco Indonesia (SSB)", description: "", value: 0 },
  { id: "mh-6", name: "ENI Muara Bakau", description: "", value: 0 },
  { id: "mh-7", name: "PHE OSES", description: "", value: 0 },
  { id: "mh-8", name: "Plus Kolam Tambahan", description: "", value: 0 },
];

const QHSEPerformanceDashboard: React.FC = () => {
  // table state
  const [rows, setRows] = useState<PerformanceItem[]>(initialData);
  const [kpis, setKpis] = useState<KPIItem[]>(initialKPIData);
  const [targets, setTargets] = useState<TargetItem[]>(initialTargetData);

  // filters
  const [bulan, setBulan] = useState<string>("");
  const [tahun, setTahun] = useState<string>("");

  // modal state
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [form, setForm] = useState<
    Partial<
      PerformanceItem & { laggingIndicators: LaggingIndicators; notes: string }
    >
  >({});
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // KPI and Target modal states
  const [showKPIModal, setShowKPIModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [kpiMode, setKpiMode] = useState<"add" | "edit" | "view">("add");
  const [targetMode, setTargetMode] = useState<"add" | "edit" | "view">("add");
  const [selectedKPI, setSelectedKPI] = useState<KPIItem | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<TargetItem | null>(null);
  const [kpiForm, setKpiForm] = useState<Partial<KPIItem>>({});
  const [targetForm, setTargetForm] = useState<Partial<TargetItem>>({});
  const { user } = useAuth();

  // Simple Indicator modal state
  const [showIndicatorModal, setShowIndicatorModal] = useState(false);
  const [indicatorContext, setIndicatorContext] = useState<
    "lagging" | "leading" | "training" | "manhours" | null
  >(null);
  const [indicatorForm, setIndicatorForm] = useState<{
    name: string;
    description: string;
    value?: number;
  }>({ name: "", description: "", value: 0 });
  const [indicatorMode, setIndicatorMode] = useState<"add" | "edit">("add");
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string | null>(
    null
  );

  // Per-card indicator lists
  const [laggingList, setLaggingList] =
    useState<SimpleIndicator[]>(defaultLaggingList);
  const [leadingList, setLeadingList] =
    useState<SimpleIndicator[]>(defaultLeadingList);
  const [manhoursList, setManhoursList] =
    useState<SimpleIndicator[]>(defaultManhoursList);

  // Confirm delete state for indicators
  const [indicatorConfirm, setIndicatorConfirm] = useState<{
    open: boolean;
    ctx: "lagging" | "leading" | "training" | "manhours" | null;
    id: string | null;
    name?: string;
  }>({ open: false, ctx: null, id: null });

  const openIndicatorAdd = (
    ctx: "lagging" | "leading" | "training" | "manhours"
  ) => {
    setIndicatorMode("add");
    setSelectedIndicatorId(null);
    setIndicatorContext(ctx);
    setIndicatorForm({ name: "", description: "", value: 0 });
    setShowIndicatorModal(true);
  };

  const openIndicatorEdit = (
    ctx: "lagging" | "leading" | "training" | "manhours",
    item: SimpleIndicator
  ) => {
    setIndicatorMode("edit");
    setSelectedIndicatorId(item.id);
    setIndicatorContext(ctx);
    setIndicatorForm({
      name: item.name,
      description: item.description,
      value: item.value,
    });
    setShowIndicatorModal(true);
  };

  const openIndicatorDelete = (
    ctx: "lagging" | "leading" | "training" | "manhours",
    item: SimpleIndicator
  ) => {
    setIndicatorConfirm({ open: true, ctx, id: item.id, name: item.name });
  };

  const saveIndicator = () => {
    if (!indicatorContext) return;
    const payload: SimpleIndicator = {
      id: selectedIndicatorId ?? String(Date.now()),
      name: indicatorForm.name.trim(),
      description: indicatorForm.description.trim(),
      value: indicatorForm.value,
    };
    if (!payload.name) return;

    const upsert = (
      setList: React.Dispatch<React.SetStateAction<SimpleIndicator[]>>
    ) => {
      setList((prev) => {
        if (indicatorMode === "add") return [payload, ...prev];
        return prev.map((it) => (it.id === payload.id ? payload : it));
      });
    };

    switch (indicatorContext) {
      case "lagging":
        upsert(setLaggingList);
        break;
      case "leading":
        upsert(setLeadingList);
        break;
      case "training":
        // upsert(setTrainingList); // Removed as per edit hint
        break;
      case "manhours":
        upsert(setManhoursList);
        break;
    }

    setShowIndicatorModal(false);
  };

  const confirmDeleteIndicator = () => {
    if (
      !indicatorConfirm.open ||
      !indicatorConfirm.ctx ||
      !indicatorConfirm.id
    ) {
      setIndicatorConfirm({ open: false, ctx: null, id: null });
      return;
    }
    const id = indicatorConfirm.id;
    switch (indicatorConfirm.ctx) {
      case "lagging":
        setLaggingList((prev) => prev.filter((it) => it.id !== id));
        break;
      case "leading":
        setLeadingList((prev) => prev.filter((it) => it.id !== id));
        break;
      case "training":
        // setTrainingList(prev => prev.filter(it => it.id !== id)); // Removed as per edit hint
        break;
      case "manhours":
        setManhoursList((prev) => prev.filter((it) => it.id !== id));
        break;
    }
    setIndicatorConfirm({ open: false, ctx: null, id: null });
  };

  const getIndicatorModalTitle = () => {
    const prefix = indicatorMode === "edit" ? "Edit" : "Tambah";
    switch (indicatorContext) {
      case "lagging":
        return `${prefix} Indikator Lagging`;
      case "leading":
        return `${prefix} Indikator Leading`;
      case "training":
        return `${prefix} Safety Training`;
      case "manhours":
        return `${prefix} Manhours Worker`;
      default:
        return `${prefix} Indikator`;
    }
  };

  // Filter functions
  const filteredKPIs = useMemo(() => {
    return kpis.filter(
      (kpi) =>
        kpi.kpiName.toLowerCase().includes(bulan.toLowerCase()) ||
        kpi.category.toLowerCase().includes(bulan.toLowerCase()) ||
        kpi.responsible.toLowerCase().includes(bulan.toLowerCase())
    );
  }, [kpis]);

  const filteredTargets = useMemo(() => {
    return targets.filter(
      (target) =>
        target.description.toLowerCase().includes(bulan.toLowerCase()) ||
        target.category.toLowerCase().includes(bulan.toLowerCase())
    );
  }, [targets]);

  const openAdd = () => {
    setMode("add");
    setForm({
      bulan: "",
      tahun: new Date().getFullYear(),
      laggingIndicators: {
        fatality: 0,
        rwc: 0,
        fac: 0,
        mtc: 0,
        lwdc: 0,
        propertyDamage: 0,
        environment: 0,
        motorVehicleAccident: 0,
        occupationalIllness: 0,
        nearMiss: 0,
      },
      notes: "",
    });
    setShowForm(true);
  };

  const saveForm = () => {
    if (!form.bulan || !form.tahun || !form.laggingIndicators) return;
    if (mode === "add") {
      const newItem: PerformanceItem = {
        id: String(Date.now()),
        bulan: form.bulan as string,
        tahun: Number(form.tahun),
        lagging: "",
        leading: "",
        document: "",
      };
      setRows((prev) => [newItem, ...prev]);
    } else if (mode === "edit" && form.id) {
      setRows((prev) =>
        prev.map((p) =>
          p.id === form.id
            ? {
                id: form.id as string,
                bulan: form.bulan as string,
                tahun: Number(form.tahun),
                lagging: "",
                leading: "",
                document: "",
              }
            : p
        )
      );
    }
    setShowForm(false);
  };

  const confirmDelete = () => {
    if (confirmId) setRows((prev) => prev.filter((p) => p.id !== confirmId));
    setConfirmId(null);
  };

  const openKPIAdd = () => {
    setKpiMode("add");
    setKpiForm({});
    setShowKPIModal(true);
  };

  const openKPIEdit = (kpi: KPIItem) => {
    setKpiMode("edit");
    setKpiForm(kpi);
    setSelectedKPI(kpi);
    setShowKPIModal(true);
  };

  const saveKPIForm = () => {
    if (kpiMode === "add") {
      const newKPI: KPIItem = {
        id: String(Date.now()),
        kpiName: kpiForm.kpiName as string,
        category: kpiForm.category as string,
        responsible: kpiForm.responsible as string,
        target: kpiForm.target as number,
        actual: kpiForm.actual as number,
      };
      setKpis((prev) => [newKPI, ...prev]);
    } else if (kpiMode === "edit" && selectedKPI) {
      setKpis((prev) =>
        prev.map((p) =>
          p.id === selectedKPI.id
            ? {
                id: selectedKPI.id,
                kpiName: kpiForm.kpiName as string,
                category: kpiForm.category as string,
                responsible: kpiForm.responsible as string,
                target: kpiForm.target as number,
                actual: kpiForm.actual as number,
              }
            : p
        )
      );
    }
    setShowKPIModal(false);
  };

  const openTargetAdd = () => {
    setTargetMode("add");
    setTargetForm({});
    setShowTargetModal(true);
  };

  const openTargetEdit = (target: TargetItem) => {
    setTargetMode("edit");
    setTargetForm(target);
    setSelectedTarget(target);
    setShowTargetModal(true);
  };

  const saveTargetForm = () => {
    if (targetMode === "add") {
      const newTarget: TargetItem = {
        id: String(Date.now()),
        description: targetForm.description as string,
        target: targetForm.target as number,
        targetYTD: targetForm.targetYTD as number,
        jan: targetForm.jan as number,
        feb: targetForm.feb as number,
        mar: targetForm.mar as number,
        apr: targetForm.apr as number,
        may: targetForm.may as number,
        jun: targetForm.jun as number,
        jul: targetForm.jul as number,
        aug: targetForm.aug as number,
        sep: targetForm.sep as number,
        oct: targetForm.oct as number,
        nov: targetForm.nov as number,
        dec: targetForm.dec as number,
        last12MthTotal: targetForm.last12MthTotal as number,
        jumlahHariHilang: targetForm.jumlahHariHilang as number | undefined,
        category: targetForm.category as "LAGGING" | "LEADING",
      };
      setTargets((prev) => [newTarget, ...prev]);
    } else if (targetMode === "edit" && selectedTarget) {
      setTargets((prev) =>
        prev.map((p) =>
          p.id === selectedTarget.id
            ? {
                id: selectedTarget.id,
                description: targetForm.description as string,
                target: targetForm.target as number,
                targetYTD: targetForm.targetYTD as number,
                jan: targetForm.jan as number,
                feb: targetForm.feb as number,
                mar: targetForm.mar as number,
                apr: targetForm.apr as number,
                may: targetForm.may as number,
                jun: targetForm.jun as number,
                jul: targetForm.jul as number,
                aug: targetForm.aug as number,
                sep: targetForm.sep as number,
                oct: targetForm.oct as number,
                nov: targetForm.nov as number,
                dec: targetForm.dec as number,
                last12MthTotal: targetForm.last12MthTotal as number,
                jumlahHariHilang: targetForm.jumlahHariHilang as
                  | number
                  | undefined,
                category: targetForm.category as "LAGGING" | "LEADING",
              }
            : p
        )
      );
    }
    setShowTargetModal(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Headere */}
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                  QHSE PERFORMANCE
                </h1>
                <nav className="text-sm text-gray-600">
                  <span>Dashboard</span> <span className="mx-2">›</span>{" "}
                  <span>QHSE</span> <span className="mx-2">›</span>{" "}
                  <span className="text-blue-600">Performance</span>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={openAdd}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Tambah Data
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Menu Pencarian
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulan
                </label>
                <select
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Semua Bulan</option>
                  {BULAN_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun
                </label>
                <select
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Semua Tahun</option>
                  {TAHUN_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Performance Data Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Lagging Indicators Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Lagging Indicators
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Monitoring & Input Manual
                  </span>
                  {user?.role === "qhse" && (
                    <button
                      onClick={() => openIndicatorAdd("lagging")}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-sm"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Tambah
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {laggingList.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {item.value}
                      </span>
                      {user?.role === "qhse" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openIndicatorEdit("lagging", item)}
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </button>
                          <button
                            onClick={() => openIndicatorDelete("lagging", item)}
                            className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leading Indicators Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Leading Indicators
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Monitoring & Input Manual
                  </span>
                  {user?.role === "qhse" && (
                    <button
                      onClick={() => openIndicatorAdd("leading")}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-sm"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Tambah
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {leadingList.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {item.value}
                      </span>
                      {user?.role === "qhse" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openIndicatorEdit("leading", item)}
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </button>
                          <button
                            onClick={() => openIndicatorDelete("leading", item)}
                            className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manhours Worker Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Manhours Worker
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Link dengan Absen
                  </span>
                  {user?.role === "qhse" && (
                    <button
                      onClick={() => openIndicatorAdd("manhours")}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-sm"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Tambah
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {manhoursList.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {item.value}
                      </span>
                      {user?.role === "qhse" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openIndicatorEdit("manhours", item)}
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </button>
                          <button
                            onClick={() =>
                              openIndicatorDelete("manhours", item)
                            }
                            className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KPI Management Tab */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                KPI Management
              </h3>
              <button
                onClick={openKPIAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Tambah KPI
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  KPI Name
                </span>
                <span className="text-sm text-gray-600">Target</span>
              </div>
              {filteredKPIs.map((kpi) => (
                <div
                  key={kpi.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {kpi.kpiName}
                  </span>
                  <span className="text-sm text-gray-600">{kpi.target}</span>
                  <button
                    onClick={() => openKPIEdit(kpi)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Target Management Tab */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Target Management
              </h3>
              <button
                onClick={openTargetAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Tambah Target
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Description
                </span>
                <span className="text-sm text-gray-600">Target</span>
              </div>
              {filteredTargets.map((target) => (
                <div
                  key={target.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {target.description}
                  </span>
                  <span className="text-sm text-gray-600">{target.target}</span>
                  <button
                    onClick={() => openTargetEdit(target)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowForm(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-6">
              {mode === "add"
                ? "Tambah Data QHSE Performance"
                : "Edit Data QHSE Performance"}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bulan
                  </label>
                  <select
                    value={form.bulan || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, bulan: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Pilih Bulan</option>
                    {BULAN_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun
                  </label>
                  <select
                    value={form.tahun?.toString() || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tahun: Number(e.target.value) }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Pilih Tahun</option>
                    {TAHUN_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lagging Indicators */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Lagging Indicators
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fatality
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.fatality || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          laggingIndicators: {
                            ...(f.laggingIndicators as LaggingIndicators),
                            fatality: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restricted Work Case (RWC)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.rwc || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          laggingIndicators: {
                            ...(f.laggingIndicators as LaggingIndicators),
                            rwc: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Aid Case (FAC)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.fac || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          laggingIndicators: {
                            ...(f.laggingIndicators as LaggingIndicators),
                            fac: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medical Treatment Case (MTC)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.mtc || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          laggingIndicators: {
                            ...(f.laggingIndicators as LaggingIndicators),
                            mtc: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lost Work Day Case (LWDC)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.lwdc || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          laggingIndicators: {
                            ...(f.laggingIndicators as LaggingIndicators),
                            lwdc: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Damage
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.propertyDamage || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          laggingIndicators: {
                            ...(f.laggingIndicators as LaggingIndicators),
                            propertyDamage: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Environment
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.environment || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          laggingIndicators: {
                            ...(f.laggingIndicators as LaggingIndicators),
                            environment: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motor Vehicle Accident
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.motorVehicleAccident || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          laggingIndicators: {
                            ...(f.laggingIndicators as LaggingIndicators),
                            motorVehicleAccident: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Occupational Illness
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.occupationalIllness || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          laggingIndicators: {
                            ...(f.laggingIndicators as LaggingIndicators),
                            occupationalIllness: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Near Miss
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.nearMiss || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          laggingIndicators: {
                            ...(f.laggingIndicators as LaggingIndicators),
                            nearMiss: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (opsional)
                </label>
                <textarea
                  value={form.notes || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="Catatan tambahan untuk data performance ini..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveForm}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indicator Simple Modal */}
      {showIndicatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowIndicatorModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-6">
              {getIndicatorModalTitle()}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Indikator
                </label>
                <input
                  type="text"
                  value={indicatorForm.name}
                  onChange={(e) =>
                    setIndicatorForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Masukkan nama indikator"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nilai (opsional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={indicatorForm.value || ""}
                  onChange={(e) =>
                    setIndicatorForm((f) => ({
                      ...f,
                      value: Number(e.target.value),
                    }))
                  }
                  placeholder="Masukkan nilai performa (cth: 0, 5, 10)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  value={indicatorForm.description}
                  onChange={(e) =>
                    setIndicatorForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Masukkan keterangan"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowIndicatorModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveIndicator}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Modal */}
      {showKPIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowKPIModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-6">
              {kpiMode === "add" ? "Tambah KPI" : "Edit KPI"}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KPI Name
                  </label>
                  <input
                    type="text"
                    value={kpiForm.kpiName || ""}
                    onChange={(e) =>
                      setKpiForm((f) => ({ ...f, kpiName: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={kpiForm.category || ""}
                    onChange={(e) =>
                      setKpiForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Target */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target
                </label>
                <input
                  type="number"
                  min="0"
                  value={kpiForm.target || 0}
                  onChange={(e) =>
                    setKpiForm((f) => ({
                      ...f,
                      target: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowKPIModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveKPIForm}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Target Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowTargetModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-6">
              {targetMode === "add" ? "Tambah Target" : "Edit Target"}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={targetForm.description || ""}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.target || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        target: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Target YTD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target YTD
                </label>
                <input
                  type="number"
                  min="0"
                  value={targetForm.targetYTD || 0}
                  onChange={(e) =>
                    setTargetForm((f) => ({
                      ...f,
                      targetYTD: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Monthly Targets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jan
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.jan || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        jan: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feb
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.feb || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        feb: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mar
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.mar || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        mar: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apr
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.apr || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        apr: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    May
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.may || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        may: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jun
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.jun || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        jun: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jul
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.jul || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        jul: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aug
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.aug || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        aug: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sep
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.sep || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        sep: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Oct
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.oct || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        oct: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nov
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.nov || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        nov: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dec
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetForm.dec || 0}
                    onChange={(e) =>
                      setTargetForm((f) => ({
                        ...f,
                        dec: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Last 12 Month Total */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last 12 Month Total
                </label>
                <input
                  type="number"
                  min="0"
                  value={targetForm.last12MthTotal || 0}
                  onChange={(e) =>
                    setTargetForm((f) => ({
                      ...f,
                      last12MthTotal: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Jumlah Hari Hilang */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Hari Hilang
                </label>
                <input
                  type="number"
                  min="0"
                  value={targetForm.jumlahHariHilang || 0}
                  onChange={(e) =>
                    setTargetForm((f) => ({
                      ...f,
                      jumlahHariHilang: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={targetForm.category || ""}
                  onChange={(e) =>
                    setTargetForm((f) => ({
                      ...f,
                      category: e.target.value as "LAGGING" | "LEADING",
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Pilih Category</option>
                  <option value="LAGGING">LAGGING</option>
                  <option value="LEADING">LEADING</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowTargetModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveTargetForm}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus data performance ini?"
        itemName={
          confirmId
            ? (() => {
                const i = rows.find((r) => r.id === confirmId);
                return i ? `${i.bulan} ${i.tahun}` : undefined;
              })()
            : undefined
        }
      />

      {/* Confirm Delete Modal - Indicator */}
      <ConfirmDeleteModal
        isOpen={indicatorConfirm.open}
        onClose={() =>
          setIndicatorConfirm({ open: false, ctx: null, id: null })
        }
        onConfirm={confirmDeleteIndicator}
        title="Konfirmasi Hapus Indikator"
        message="Apakah Anda yakin ingin menghapus indikator ini?"
        itemName={indicatorConfirm.name}
      />
    </>
  );
};

export default QHSEPerformanceDashboard;
