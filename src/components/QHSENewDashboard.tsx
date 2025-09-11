import React, { useEffect, useRef, useState } from "react";
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  Users,
  CalendarCheck,
  Bell,
  X,
} from "lucide-react";

const QHSENewDashboard: React.FC = () => {
  const today = new Date();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Helper: days remaining until a date (YYYY-MM-DD)
  const daysUntil = (dateStr: string) => {
    const target = new Date(dateStr + "T00:00:00");
    const ms = target.getTime() - today.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  };

  // Sample data and alert building per rules
  type AlertItem = {
    id: string;
    title: string;
    message: string;
    severity: "warning" | "critical";
    link?: string;
  };

  const sampleLegalitas = [
    { id: "leg-1", name: "Sertifikat ISO 9001", validUntil: "2025-11-15" },
    { id: "leg-2", name: "SIUP", validUntil: "2025-10-10" },
  ];

  const sampleRadiography = {
    kamera: [
      { id: "cam-1", name: "Kamera A", activityCi: 28 },
      { id: "cam-2", name: "Kamera B", activityCi: 35 }, // > 30 Ci -> alert
    ],
    sibPersonnel: [
      { id: "sib-1", name: "Andi", validUntil: "2025-10-05" }, // < 90 hari
    ],
    dosimeterSaku: [
      { id: "dsk-1", name: "Batch 001", validUntil: "2025-10-20" }, // < 60 hari
    ],
    surveymeter: [
      { id: "svm-1", name: "SM-Alpha", validUntil: "2025-11-01" }, // < 60 hari
    ],
    tldBadge: [
      { id: "tld-1", name: "TLD Q3", validUntil: "2025-09-25" }, // < 30 hari
    ],
    ujiUsap: [
      { id: "uji-1", name: "Uji Usap September", validUntil: "2025-10-30" }, // < 60 hari
    ],
    kontrakSib: [
      { id: "kon-1", name: "Kontrak SIB PT X", validUntil: "2025-11-10" }, // < 60 hari
    ],
  };

  const sampleAlatUkur = [
    {
      id: "au-1",
      kategori: "Ultrasonic",
      name: "UT-01",
      validUntil: "2025-11-20",
    }, // < 60 hari
  ];

  const samplePersonnel = {
    trainingMatrix: [
      { id: "tr-1", name: "Welding Safety", expired: true }, // expired
    ],
    mcu: [
      { id: "mcu-1", name: "Budi Santoso", validUntil: "2025-10-18" }, // < 60 hari
    ],
  };

  const alerts: AlertItem[] = [];

  // Legalitas Perusahaan (< 90 hari)
  sampleLegalitas.forEach((s) => {
    const d = daysUntil(s.validUntil);
    if (d < 90) {
      alerts.push({
        id: s.id,
        title: "Legalitas Perusahaan (90 Hari)",
        message: `${s.name} akan berakhir dalam ${d} hari`,
        severity: d < 30 ? "critical" : "warning",
        link: "/qhse/legalitas-perusahaan",
      });
    }
  });

  // Radiography rules
  sampleRadiography.kamera.forEach((k) => {
    if (k.activityCi > 30) {
      alerts.push({
        id: k.id,
        title: "Radiography - Posisi Kamera",
        message: `${k.name}: aktivitas ${k.activityCi} Ci (>30 Ci)`,
        severity: "critical",
        link: "/qhse/radiography/monitoring-kamera-radiography",
      });
    }
  });
  sampleRadiography.sibPersonnel.forEach((p) => {
    const d = daysUntil(p.validUntil);
    if (d < 90)
      alerts.push({
        id: p.id,
        title: "Radiography - SIB Personnel (90 Hari)",
        message: `${p.name}: sisa ${d} hari`,
        severity: d < 30 ? "critical" : "warning",
        link: "/qhse/radiography/sib-personnel-radiasi",
      });
  });
  sampleRadiography.dosimeterSaku.forEach((i) => {
    const d = daysUntil(i.validUntil);
    if (d < 60)
      alerts.push({
        id: i.id,
        title: "Radiography - Dosimeter Saku (60 Hari)",
        message: `${i.name}: sisa ${d} hari`,
        severity: d < 30 ? "critical" : "warning",
        link: "/qhse/radiography/dosimeter-saku",
      });
  });
  sampleRadiography.surveymeter.forEach((i) => {
    const d = daysUntil(i.validUntil);
    if (d < 60)
      alerts.push({
        id: i.id,
        title: "Radiography - Surveymeter (60 Hari)",
        message: `${i.name}: sisa ${d} hari`,
        severity: d < 30 ? "critical" : "warning",
        link: "/qhse/radiography/surveymeter",
      });
  });
  sampleRadiography.tldBadge.forEach((i) => {
    const d = daysUntil(i.validUntil);
    if (d < 30)
      alerts.push({
        id: i.id,
        title: "Radiography - TLD Badge (30 Hari)",
        message: `${i.name}: sisa ${d} hari`,
        severity: d < 15 ? "critical" : "warning",
        link: "/qhse/radiography/tld-badge",
      });
  });
  sampleRadiography.ujiUsap.forEach((i) => {
    const d = daysUntil(i.validUntil);
    if (d < 60)
      alerts.push({
        id: i.id,
        title: "Radiography - Uji Usap (60 Hari)",
        message: `${i.name}: sisa ${d} hari`,
        severity: d < 30 ? "critical" : "warning",
        link: "/qhse/radiography/uji-usap-kamera",
      });
  });
  sampleRadiography.kontrakSib.forEach((i) => {
    const d = daysUntil(i.validUntil);
    if (d < 60)
      alerts.push({
        id: i.id,
        title: "Radiography - Kontrak SIB (60 Hari)",
        message: `${i.name}: sisa ${d} hari`,
        severity: d < 30 ? "critical" : "warning",
        link: "/qhse/radiography/kontrak-sib",
      });
  });

  // Monitoring Daftar Alat Ukur (<60 hari)
  sampleAlatUkur.forEach((it) => {
    const d = daysUntil(it.validUntil);
    if (d < 60)
      alerts.push({
        id: it.id,
        title: `Alat Ukur - ${it.kategori} (60 Hari)`,
        message: `${it.name}: sisa ${d} hari`,
        severity: d < 30 ? "critical" : "warning",
        link: "/qhse/monitoring-daftar-alat-ukur",
      });
  });

  // Monitoring Personnel
  samplePersonnel.trainingMatrix.forEach((t) => {
    if (t.expired)
      alerts.push({
        id: t.id,
        title: "Personnel - Training Matrix",
        message: `${t.name}: certificate expired`,
        severity: "critical",
        link: "/qhse/monitoring-personnel/training-matrix",
      });
  });
  samplePersonnel.mcu.forEach((p) => {
    const d = daysUntil(p.validUntil);
    if (d < 60)
      alerts.push({
        id: p.id,
        title: "Personnel - MCU (60 Hari)",
        message: `${p.name}: sisa ${d} hari`,
        severity: d < 30 ? "critical" : "warning",
        link: "/qhse/monitoring-personnel/mcu",
      });
  });

  // Local dismiss state for individual alerts
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.id));
  const dismiss = (id: string) =>
    setDismissed((prev) => new Set([...prev, id]));

  // Draggable position state (persist to localStorage)
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>({
    top: 80,
    left: 0,
  });
  const storageKey = "qhse_alert_panel_pos";

  useEffect(() => {
    // Restore saved position or set default to top-right
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { top: number; left: number };
        setPos(parsed);
        return;
      }
    } catch {}
    // Default place: near top-right
    const width = panelRef.current?.offsetWidth ?? 384; // w-96 ~ 384px
    const padding = 24; // ~ right-6
    const left = Math.max(12, window.innerWidth - width - padding);
    setPos({ top: 80, left });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(pos));
    } catch {}
  }, [pos]);

  // Drag handlers
  const dragState = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    origTop: number;
    origLeft: number;
  }>({ dragging: false, startX: 0, startY: 0, origTop: 0, origLeft: 0 });

  const beginDrag = (clientX: number, clientY: number) => {
    dragState.current = {
      dragging: true,
      startX: clientX,
      startY: clientY,
      origTop: pos.top,
      origLeft: pos.left,
    };
  };

  const onMove = (clientX: number, clientY: number) => {
    if (!dragState.current.dragging) return;
    const dx = clientX - dragState.current.startX;
    const dy = clientY - dragState.current.startY;
    const panelW = panelRef.current?.offsetWidth ?? 380;
    const panelH = panelRef.current?.offsetHeight ?? 200;
    const margin = 8;
    let nextLeft = dragState.current.origLeft + dx;
    let nextTop = dragState.current.origTop + dy;
    // clamp to viewport
    nextLeft = Math.max(
      margin,
      Math.min(window.innerWidth - panelW - margin, nextLeft)
    );
    nextTop = Math.max(
      margin,
      Math.min(window.innerHeight - panelH - margin, nextTop)
    );
    setPos({ top: nextTop, left: nextLeft });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const handleMouseUp = () => {
      dragState.current.dragging = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0])
        onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => {
      dragState.current.dragging = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove as any);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                QHSE DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  QHSE
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Dashboard</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Alerts Panel (Draggable) */}
      <div
        ref={panelRef}
        className="fixed z-50 w-96 max-w-[90vw]"
        style={{ top: pos.top, left: pos.left }}
      >
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div
            className="px-4 py-3 flex items-center justify-between border-b bg-gray-50 cursor-move select-none"
            onMouseDown={(e) => beginDrag(e.clientX, e.clientY)}
            onTouchStart={(e) => {
              const t = e.touches[0];
              if (t) beginDrag(t.clientX, t.clientY);
            }}
          >
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <Bell className="h-4 w-4 text-blue-600" />
              Alerts
              <span className="ml-2 text-xs text-gray-500">
                {visibleAlerts.length} items
              </span>
            </div>
            <button
              className="p-1 hover:bg-gray-200 rounded"
              title="Dismiss"
              onClick={() => {
                /* optional: hide panel */
              }}
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="max-h-96 overflow-auto divide-y">
            {visibleAlerts.length === 0 && (
              <div className="p-4 text-sm text-gray-500">
                Tidak ada alert saat ini
              </div>
            )}
            {visibleAlerts.map((a) => (
              <div
                key={a.id}
                className={`${
                  a.severity === "critical" ? "bg-red-500" : "bg-green-500"
                } text-white rounded-xl mx-3 my-3 p-4 shadow flex items-center justify-between`}
              >
                <div className="pr-3">
                  <div className="font-semibold text-sm">{a.message}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={a.link || "#"}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-white/90 hover:bg-white text-gray-800 rounded-md shadow"
                  >
                    Kerjakan
                  </a>
                  <button
                    onClick={() => dismiss(a.id)}
                    className="text-white/90 hover:text-white text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Izin Perusahaan (Current Year)
                </p>
                <p className="text-3xl font-bold text-gray-900">48</p>
                <p className="text-sm text-green-600 font-medium">
                  +7% dari bulan lalu
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Perizinan Mendekati Expired
                </p>
                <p className="text-3xl font-bold text-gray-900">5</p>
                <p className="text-sm text-red-600 font-medium">
                  +2 dari bulan lalu
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Pegawai Belum MCU
                </p>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-green-600 font-medium">
                  -3 dari bulan lalu
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <CalendarCheck className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Audit Bulan Ini
                </p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <p className="text-sm text-green-600 font-medium">
                  Sesuai target
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Overview Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Compliance Status Overview
          </h3>
          <div className="h-64 flex items-end justify-center space-x-4">
            {[
              { category: "Compliant", value: 90, color: "bg-green-500" },
              { category: "Warning", value: 15, color: "bg-yellow-500" },
              { category: "Critical", value: 5, color: "bg-red-500" },
            ].map((item, index) => (
              <div
                key={item.category}
                className="flex flex-col items-center space-y-2"
              >
                <div
                  className={`w-20 ${item.color} rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80`}
                  style={{ height: `${item.value * 2.5}px` }}
                ></div>
                <span className="text-sm text-gray-600 font-medium text-center">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent QHSE Activities */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Recent QHSE Activities
          </h3>
          <div className="space-y-4">
            {[
              {
                action: 'Perizinan Alat "Forklift A" diperbarui',
                detail: "Berlaku hingga 2025-12-31",
                time: "3 hours ago",
                type: "success",
              },
              {
                action: 'MCU Pegawai "Budi Santoso" akan expired',
                detail: "Masa berlaku sisa 45 hari",
                time: "Yesterday",
                type: "warning",
              },
              {
                action: "Audit Internal Q3 selesai",
                detail: "Ditemukan 2 minor non-conformity",
                time: "2 days ago",
                type: "info",
              },
              {
                action: 'Program "Safety First" direalisasikan',
                detail: "Partisipasi 95% karyawan",
                time: "3 days ago",
                type: "success",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "info"
                      ? "bg-blue-500"
                      : activity.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600">{activity.detail}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QHSENewDashboard;
