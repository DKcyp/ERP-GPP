import React, { useEffect, useRef } from "react";
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  Users,
  CalendarCheck,
  Award,
  TrendingUp,
  Camera,
  Wrench,
  UserCheck,
  FileText,
  Activity,
  Eye,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
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

  // Minimal PNotify-like notifier for bottom-right alerts
  const pnotify = (
    title: string,
    text: string,
    type: "success" | "info" | "warning" | "error" = "info",
    link?: string
  ) => {
    const containerId = "qhse-alert-container";
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.style.position = "fixed";
      container.style.bottom = "1rem";
      container.style.right = "1rem";
      container.style.zIndex = "9999";
      container.style.display = "flex";
      container.style.flexDirection = "column-reverse";
      container.style.gap = "8px";
      document.body.appendChild(container);
    }

    const note = document.createElement("div");
    note.style.padding = "12px 16px";
    note.style.borderRadius = "12px";
    note.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    note.style.color = "#ffffff";
    note.style.background =
      type === "success"
        ? "#10b981"
        : type === "warning"
        ? "#f59e0b"
        : type === "error"
        ? "#ef4444"
        : "#3b82f6";
    note.style.border = "1px solid rgba(255,255,255,0.2)";
    note.style.maxWidth = "360px";
    note.style.minWidth = "280px";
    note.style.cursor = "pointer";

    const titleEl = document.createElement("div");
    titleEl.style.fontWeight = "600";
    titleEl.style.fontSize = "0.9rem";
    titleEl.style.marginBottom = "4px";
    titleEl.textContent = title;

    const textEl = document.createElement("div");
    textEl.style.fontSize = "0.85rem";
    textEl.style.opacity = "0.9";
    textEl.textContent = text;

    const actionContainer = document.createElement("div");
    actionContainer.style.display = "flex";
    actionContainer.style.justifyContent = "space-between";
    actionContainer.style.alignItems = "center";
    actionContainer.style.marginTop = "8px";

    if (link) {
      const actionBtn = document.createElement("button");
      actionBtn.textContent = "Kerjakan";
      actionBtn.style.background = "rgba(255,255,255,0.2)";
      actionBtn.style.color = "#ffffff";
      actionBtn.style.border = "1px solid rgba(255,255,255,0.3)";
      actionBtn.style.borderRadius = "6px";
      actionBtn.style.padding = "4px 12px";
      actionBtn.style.fontSize = "0.8rem";
      actionBtn.style.cursor = "pointer";
      actionBtn.onclick = () => {
        window.location.href = link;
      };
      actionContainer.appendChild(actionBtn);
    }

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.background = "none";
    closeBtn.style.border = "none";
    closeBtn.style.color = "rgba(255,255,255,0.8)";
    closeBtn.style.fontSize = "1.2rem";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.padding = "0 4px";
    closeBtn.onclick = () => {
      note.style.opacity = "0";
      note.style.transition = "opacity 300ms ease";
      setTimeout(() => note.remove(), 320);
    };
    actionContainer.appendChild(closeBtn);

    note.appendChild(titleEl);
    note.appendChild(textEl);
    note.appendChild(actionContainer);
    container.appendChild(note);

    setTimeout(() => {
      note.style.opacity = "0";
      note.style.transition = "opacity 300ms ease";
      setTimeout(() => note.remove(), 320);
    }, 5000);
  };

  // Show alerts when component mounts using bottom-right notifications
  const didNotifyRef = useRef(false);
  useEffect(() => {
    if (didNotifyRef.current) return;
    didNotifyRef.current = true;

    // Show alerts with delay for better UX
    alerts.slice(0, 5).forEach((alert, index) => {
      setTimeout(() => {
        pnotify(
          alert.title,
          alert.message,
          alert.severity === "critical" ? "error" : "warning",
          alert.link
        );
      }, index * 800);
    });
  }, [alerts, pnotify]);

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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { title: "Kompetensi Perusahaan", icon: Award, color: "bg-blue-500", href: "#kompetensi" },
            { title: "QHSE Performance", icon: TrendingUp, color: "bg-green-500", href: "#performance" },
            { title: "Monitoring Kamera Radiography", icon: Camera, color: "bg-purple-500", href: "#radiography" },
            { title: "Monitoring Daftar Alat Ukur", icon: Wrench, color: "bg-orange-500", href: "#alat-ukur" },
            { title: "Monitoring Personil", icon: UserCheck, color: "bg-indigo-500", href: "#personil" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-4 ${item.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                  {item.title}
                </h3>
              </div>
            </a>
          ))}
        </div>

        {/* 1. Kompetensi Perusahaan */}
        <div id="kompetensi" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">1. Kompetensi Perusahaan</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "ISO 9001:2015", status: "Active", validUntil: "2025-12-31", type: "success" },
              { title: "ISO 14001:2015", status: "Active", validUntil: "2025-11-30", type: "success" },
              { title: "ISO 45001:2018", status: "Active", validUntil: "2025-10-15", type: "warning" },
              { title: "SIUP", status: "Active", validUntil: "2026-03-20", type: "success" },
              { title: "TDP", status: "Active", validUntil: "2025-09-30", type: "critical" },
              { title: "NPWP", status: "Active", validUntil: "2026-01-15", type: "success" },
            ].map((cert, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                  <div className={`flex items-center space-x-1 ${
                    cert.type === 'success' ? 'text-green-600' : 
                    cert.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {cert.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                     cert.type === 'warning' ? <AlertCircle className="h-4 w-4" /> :
                     <XCircle className="h-4 w-4" />}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Status: {cert.status}</p>
                <p className="text-sm text-gray-600">Berlaku hingga: {cert.validUntil}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. QHSE Performance */}
        <div id="performance" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">2. QHSE Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { title: "Safety Performance", value: "98.5%", change: "+2.1%", icon: ShieldCheck, color: "green" },
              { title: "Environmental Compliance", value: "96.2%", change: "+1.5%", icon: Activity, color: "blue" },
              { title: "Quality Score", value: "94.8%", change: "+0.8%", icon: CheckCircle, color: "purple" },
              { title: "Health Index", value: "97.1%", change: "+1.2%", icon: Users, color: "orange" },
            ].map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 bg-${metric.color}-100 rounded-lg`}>
                    <metric.icon className={`h-5 w-5 text-${metric.color}-600`} />
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">{metric.title}</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} dari bulan lalu
                </p>
              </div>
            ))}
          </div>

          {/* Performance Chart */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Monthly Performance Trend</h4>
            <div className="h-48 flex items-end justify-center space-x-3">
              {[
                { month: "Jan", safety: 95, quality: 92, env: 94 },
                { month: "Feb", safety: 96, quality: 93, env: 95 },
                { month: "Mar", safety: 97, quality: 94, env: 96 },
                { month: "Apr", safety: 98, quality: 95, env: 96 },
              ].map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-1">
                    <div className="w-4 bg-green-500 rounded-t" style={{ height: `${data.safety * 1.5}px` }}></div>
                    <div className="w-4 bg-purple-500 rounded-t" style={{ height: `${data.quality * 1.5}px` }}></div>
                    <div className="w-4 bg-blue-500 rounded-t" style={{ height: `${data.env * 1.5}px` }}></div>
                  </div>
                  <span className="text-xs text-gray-600">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Safety</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-sm text-gray-600">Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Environment</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Monitoring Kamera Radiography */}
        <div id="radiography" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Camera className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">3. Monitoring Kamera Radiography</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Status Kamera</h4>
              {[
                { name: "Kamera RT-001", activity: "28 Ci", status: "Normal", location: "Site A" },
                { name: "Kamera RT-002", activity: "35 Ci", status: "High", location: "Site B" },
                { name: "Kamera RT-003", activity: "22 Ci", status: "Normal", location: "Site C" },
                { name: "Kamera RT-004", activity: "31 Ci", status: "High", location: "Site D" },
              ].map((camera, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{camera.name}</h5>
                    <p className="text-sm text-gray-600">Lokasi: {camera.location}</p>
                    <p className="text-sm text-gray-600">Aktivitas: {camera.activity}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    camera.status === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {camera.status}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Monitoring Equipment</h4>
              {[
                { item: "Dosimeter Saku", count: 15, expired: 2, nextExpiry: "2025-10-20" },
                { item: "Survey Meter", count: 8, expired: 0, nextExpiry: "2025-11-01" },
                { item: "TLD Badge", count: 25, expired: 1, nextExpiry: "2025-09-25" },
                { item: "Film Badge", count: 12, expired: 0, nextExpiry: "2025-10-30" },
              ].map((equipment, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{equipment.item}</h5>
                    <span className="text-sm text-gray-600">Total: {equipment.count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${equipment.expired > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      Expired: {equipment.expired}
                    </span>
                    <span className="text-gray-600">Next: {equipment.nextExpiry}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Monitoring Daftar Alat Ukur */}
        <div id="alat-ukur" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Wrench className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">4. Monitoring Daftar Alat Ukur</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { category: "Ultrasonic", total: 12, calibrated: 10, expired: 2 },
              { category: "Magnetic Particle", total: 8, calibrated: 7, expired: 1 },
              { category: "Penetrant Testing", total: 15, calibrated: 14, expired: 1 },
            ].map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">{category.category}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Alat:</span>
                    <span className="font-medium">{category.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Terkalibrasi:</span>
                    <span className="font-medium text-green-600">{category.calibrated}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expired:</span>
                    <span className="font-medium text-red-600">{category.expired}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Alat Ukur Mendekati Expired</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Nama Alat</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Kategori</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Serial Number</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Expired Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { name: "UT-001", category: "Ultrasonic", serial: "UT2024001", expired: "2025-10-15", days: 9 },
                    { name: "MP-003", category: "Magnetic Particle", serial: "MP2024003", expired: "2025-10-20", days: 14 },
                    { name: "PT-007", category: "Penetrant Testing", serial: "PT2024007", expired: "2025-11-01", days: 26 },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-gray-600">{item.category}</td>
                      <td className="px-4 py-3 text-gray-600">{item.serial}</td>
                      <td className="px-4 py-3 text-gray-600">{item.expired}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.days <= 15 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.days} hari lagi
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 5. Monitoring Personil */}
        <div id="personil" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <UserCheck className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">5. Monitoring Personil</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Status MCU Personil</h4>
                <div className="space-y-3">
                  {[
                    { name: "Andi Pratama", position: "RT Level II", mcuDate: "2024-05-15", nextMcu: "2025-05-15", status: "Valid" },
                    { name: "Budi Santoso", position: "RT Level III", mcuDate: "2024-02-10", nextMcu: "2025-02-10", status: "Expired Soon" },
                    { name: "Citra Dewi", position: "UT Level II", mcuDate: "2024-08-20", nextMcu: "2025-08-20", status: "Valid" },
                  ].map((person, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">{person.name}</h5>
                        <p className="text-sm text-gray-600">{person.position}</p>
                        <p className="text-sm text-gray-600">Next MCU: {person.nextMcu}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        person.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {person.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Training Matrix Status</h4>
                <div className="space-y-3">
                  {[
                    { training: "Basic Safety Training", completed: 45, total: 50, percentage: 90 },
                    { training: "RT Level II Certification", completed: 12, total: 15, percentage: 80 },
                    { training: "Emergency Response", completed: 48, total: 50, percentage: 96 },
                    { training: "Environmental Awareness", completed: 42, total: 50, percentage: 84 },
                  ].map((training, index) => (
                    <div key={index} className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 text-sm">{training.training}</h5>
                        <span className="text-sm text-gray-600">{training.completed}/{training.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${training.percentage >= 90 ? 'bg-green-500' : training.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${training.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{training.percentage}% completed</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QHSENewDashboard;
