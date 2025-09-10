import React, { useEffect, useRef } from "react";
import { Phone, Megaphone, Clock, Search, Target } from "lucide-react";

const MarketingMainDashboard: React.FC = () => {
  // Minimal PNotify-like notifier without external dependency
  const pnotify = (
    title: string,
    text: string,
    type: "success" | "info" | "warning" | "error" = "info"
  ) => {
    const containerId = "pnotify-container";
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.style.position = "fixed";
      // Position bottom-right as requested
      container.style.bottom = "1rem";
      container.style.right = "1rem";
      container.style.zIndex = "9999";
      container.style.display = "flex";
      container.style.flexDirection = "column-reverse"; // latest at bottom
      container.style.gap = "8px";
      document.body.appendChild(container);
    }
    const note = document.createElement("div");
    note.style.padding = "10px 14px";
    note.style.borderRadius = "10px";
    note.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    note.style.color = "#0f172a";
    note.style.background =
      type === "success"
        ? "#bbf7d0"
        : type === "warning"
        ? "#fde68a"
        : type === "error"
        ? "#fecaca"
        : "#e5edff";
    note.style.border = "1px solid rgba(0,0,0,0.05)";
    note.style.maxWidth = "360px";

    const titleEl = document.createElement("div");
    titleEl.style.fontWeight = "700";
    titleEl.style.fontSize = "0.9rem";
    titleEl.style.marginBottom = "2px";
    titleEl.textContent = title;

    const textEl = document.createElement("div");
    textEl.style.fontSize = "0.85rem";
    textEl.textContent = text;

    note.appendChild(titleEl);
    note.appendChild(textEl);
    container.appendChild(note);
    setTimeout(() => {
      note.style.opacity = "0";
      note.style.transition = "opacity 300ms ease";
      setTimeout(() => note.remove(), 320);
    }, 3000);
  };

  // Expose a PNotify-like API locally (without bringing external lib)
  const PNotify = {
    info: ({ title = "", text = "" }: { title?: string; text?: string }) =>
      pnotify(title, text, "info"),
    success: ({ title = "", text = "" }: { title?: string; text?: string }) =>
      pnotify(title, text, "success"),
    warning: ({ title = "", text = "" }: { title?: string; text?: string }) =>
      pnotify(title, text, "warning"),
    error: ({ title = "", text = "" }: { title?: string; text?: string }) =>
      pnotify(title, text, "error"),
  };

  // Show notifications (matching previous alerts) when dashboard first opens
  const didNotifyRef = useRef(false);
  useEffect(() => {
    if (didNotifyRef.current) return; // guard for React.StrictMode double-invoke
    didNotifyRef.current = true;
    const msgs = [
      {
        title: "Reminder Follow Up",
        text: "CV Sejahtera harus segera di follow up sebelum deadline prospect",
      },
      {
        title: "Reminder Follow Up",
        text: "PT Makmur Jaya harus segera di follow up sebelum deadline prospect",
      },
      {
        title: "Reminder Follow Up",
        text: "PT Maju jaya harus segera di follow up sebelum deadline prospect",
      },
    ];
    msgs.forEach((m, i) =>
      setTimeout(() => PNotify.info({ title: m.title, text: m.text }), i * 500)
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8 relative">
          {" "}
          {/* Added relative positioning */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MARKETING DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Marketing
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Dashboard</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
          {/* Notifications now use PNotify-style toasts via pnotify() when needed */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 gap-6">
        {/* KPI Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Suspect */}
          <div
            className="flex items-center space-x-4 p-5 rounded-xl bg-slate-700 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            role="button"
            tabIndex={0}
            onClick={() => {
              const path = "/marketing/suspect/dashboard";
              try {
                window.location.hash = path;
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event("popstate"));
                window.dispatchEvent(new Event("hashchange"));
              } catch (e) {}
              PNotify.success({
                title: "Navigasi",
                text: "Membuka halaman Suspect",
              });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const path = "/marketing/suspect/dashboard";
                window.location.hash = path;
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event("popstate"));
                window.dispatchEvent(new Event("hashchange"));
              }
            }}
          >
            <div className="p-3 bg-slate-800 rounded-xl">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium">Total Suspect</p>
              <p className="text-2xl font-bold">1,000</p>
            </div>
          </div>
          {/* Total Prospect */}
          <div
            className="flex items-center space-x-4 p-5 rounded-xl bg-amber-500 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
            role="button"
            tabIndex={0}
            onClick={() => {
              const path = "/marketing/prospect/dashboard";
              try {
                window.location.hash = path;
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event("popstate"));
                window.dispatchEvent(new Event("hashchange"));
              } catch (e) {}
              PNotify.success({
                title: "Navigasi",
                text: "Membuka halaman Prospect",
              });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const path = "/marketing/prospect/dashboard";
                window.location.hash = path;
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event("popstate"));
                window.dispatchEvent(new Event("hashchange"));
              }
            }}
          >
            <div className="p-3 bg-amber-600 rounded-xl">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium">Total Prospect</p>
              <p className="text-2xl font-bold">100</p>
            </div>
          </div>
          {/* Penawaran On Call */}
          <div
            className="flex items-center space-x-4 p-5 rounded-xl bg-red-500 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
            role="button"
            tabIndex={0}
            onClick={() => {
              const path = "/marketing/penawaran/on-call";
              try {
                window.location.hash = path;
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event("popstate"));
                window.dispatchEvent(new Event("hashchange"));
              } catch (e) {}
              PNotify.success({
                title: "Navigasi",
                text: "Membuka Penawaran On Call",
              });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const path = "/marketing/penawaran/on-call";
                window.location.hash = path;
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event("popstate"));
                window.dispatchEvent(new Event("hashchange"));
              }
            }}
          >
            <div className="p-3 bg-red-600 rounded-xl">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium">Penawaran On Call</p>
              <p className="text-2xl font-bold">48</p>
            </div>
          </div>
          {/* Penawaran Tender */}
          <div
            className="flex items-center space-x-4 p-5 rounded-xl bg-cyan-500 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
            role="button"
            tabIndex={0}
            onClick={() => {
              const path = "/marketing/penawaran/tender";
              try {
                window.location.hash = path;
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event("popstate"));
                window.dispatchEvent(new Event("hashchange"));
              } catch (e) {}
              PNotify.success({
                title: "Navigasi",
                text: "Membuka Penawaran Tender",
              });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const path = "/marketing/penawaran/tender";
                window.location.hash = path;
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event("popstate"));
                window.dispatchEvent(new Event("hashchange"));
              }
            }}
          >
            <div className="p-3 bg-cyan-600 rounded-xl">
              <Megaphone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium">Penawaran Tender</p>
              <p className="text-2xl font-bold">22</p>
            </div>
          </div>
          {/* Monitoring Actual VS Target */}
          <div
            className="flex items-center space-x-4 p-5 rounded-xl bg-indigo-500 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
            role="button"
            tabIndex={0}
            onClick={() => {
              const path = "/marketing/monitoring/actual-vs-target";
              try {
                window.location.hash = path;
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event("popstate"));
                window.dispatchEvent(new Event("hashchange"));
              } catch (e) {}
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const path = "/marketing/monitoring/actual-vs-target";
                window.location.hash = path;
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event("popstate"));
                window.dispatchEvent(new Event("hashchange"));
              }
            }}
          >
            <div className="p-3 bg-indigo-600 rounded-xl">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium">Monitoring Actual VS Target</p>
              <p className="text-2xl font-bold">2,000</p>
            </div>
          </div>
        </div>

        {/* Monitoring Kontrak - same style as Kontrol Kontrak */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Monitoring Kontrak
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama Client
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tanggal Awal
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tanggal Akhir
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nilai Kontrak
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                  >
                    Sudah Ditagihkan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                  >
                    Sisa Penagihan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                  >
                    Estimasi Penagihan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                  >
                    Delay Penagihan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  {
                    no: 1,
                    client: "PT. Jakarta Tank Terminal",
                    awal: "01-01-2025",
                    akhir: "01-06-2025",
                    nilai: "Rp. 200.000.000",
                    ditagih: "Rp. 150.000.000",
                    sisa: "Rp. 50.000.000",
                    estimasi: "Rp. 40.000.000",
                    delay: "150 Hari",
                  },
                  {
                    no: 2,
                    client: "PT. Surabaya Shipping Lines",
                    awal: "15-02-2025",
                    akhir: "15-08-2025",
                    nilai: "Rp. 500.000.000",
                    ditagih: "Rp. 300.000.000",
                    sisa: "Rp. 200.000.000",
                    estimasi: "Rp. 60.000.000",
                    delay: "180 Hari",
                  },
                  {
                    no: 3,
                    client: "PT. Bandung Logistics",
                    awal: "01-03-2025",
                    akhir: "01-09-2025",
                    nilai: "Rp. 300.000.000",
                    ditagih: "Rp. 200.000.000",
                    sisa: "Rp. 100.000.000",
                    estimasi: "Rp. 45.000.000",
                    delay: "180 Hari",
                  },
                  {
                    no: 4,
                    client: "PT. Medan Cargo Express",
                    awal: "10-04-2025",
                    akhir: "10-10-2025",
                    nilai: "Rp. 700.000.000",
                    ditagih: "Rp. 500.000.000",
                    sisa: "Rp. 200.000.000",
                    estimasi: "Rp. 30.000.000",
                    delay: "180 Hari",
                  },
                  {
                    no: 5,
                    client: "PT. Semarang Port Services",
                    awal: "01-05-2025",
                    akhir: "01-11-2025",
                    nilai: "Rp. 600.000.000",
                    ditagih: "Rp. 400.000.000",
                    sisa: "Rp. 200.000.000",
                    estimasi: "Rp. 50.000.000",
                    delay: "180 Hari",
                  },
                  {
                    no: 6,
                    client: "PT. Makassar Marine",
                    awal: "05-05-2025",
                    akhir: "05-11-2025",
                    nilai: "Rp. 250.000.000",
                    ditagih: "Rp. 100.000.000",
                    sisa: "Rp. 150.000.000",
                    estimasi: "Rp. 30.000.000",
                    delay: "120 Hari",
                  },
                  {
                    no: 7,
                    client: "PT. Balikpapan Oil",
                    awal: "12-05-2025",
                    akhir: "12-11-2025",
                    nilai: "Rp. 350.000.000",
                    ditagih: "Rp. 200.000.000",
                    sisa: "Rp. 150.000.000",
                    estimasi: "Rp. 40.000.000",
                    delay: "90 Hari",
                  },
                  {
                    no: 8,
                    client: "PT. Batam Terminal",
                    awal: "20-05-2025",
                    akhir: "20-11-2025",
                    nilai: "Rp. 150.000.000",
                    ditagih: "Rp. 80.000.000",
                    sisa: "Rp. 70.000.000",
                    estimasi: "Rp. 25.000.000",
                    delay: "60 Hari",
                  },
                  {
                    no: 9,
                    client: "PT. Samarinda Coal",
                    awal: "25-05-2025",
                    akhir: "25-11-2025",
                    nilai: "Rp. 900.000.000",
                    ditagih: "Rp. 600.000.000",
                    sisa: "Rp. 300.000.000",
                    estimasi: "Rp. 70.000.000",
                    delay: "45 Hari",
                  },
                  {
                    no: 10,
                    client: "PT. Banjarmasin Port",
                    awal: "28-05-2025",
                    akhir: "28-11-2025",
                    nilai: "Rp. 400.000.000",
                    ditagih: "Rp. 250.000.000",
                    sisa: "Rp. 150.000.000",
                    estimasi: "Rp. 35.000.000",
                    delay: "30 Hari",
                  },
                ].map((row) => (
                  <tr key={row.no}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.awal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.akhir}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.nilai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.ditagih}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.sisa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.estimasi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.delay}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {(() => {
                  const rows = [
                    {
                      nilai: "Rp. 200.000.000",
                      ditagih: "Rp. 150.000.000",
                      sisa: "Rp. 50.000.000",
                      estimasi: "Rp. 40.000.000",
                    },
                    {
                      nilai: "Rp. 500.000.000",
                      ditagih: "Rp. 300.000.000",
                      sisa: "Rp. 200.000.000",
                      estimasi: "Rp. 60.000.000",
                    },
                    {
                      nilai: "Rp. 300.000.000",
                      ditagih: "Rp. 200.000.000",
                      sisa: "Rp. 100.000.000",
                      estimasi: "Rp. 45.000.000",
                    },
                    {
                      nilai: "Rp. 700.000.000",
                      ditagih: "Rp. 500.000.000",
                      sisa: "Rp. 200.000.000",
                      estimasi: "Rp. 30.000.000",
                    },
                    {
                      nilai: "Rp. 600.000.000",
                      ditagih: "Rp. 400.000.000",
                      sisa: "Rp. 200.000.000",
                      estimasi: "Rp. 50.000.000",
                    },
                    {
                      nilai: "Rp. 250.000.000",
                      ditagih: "Rp. 100.000.000",
                      sisa: "Rp. 150.000.000",
                      estimasi: "Rp. 30.000.000",
                    },
                    {
                      nilai: "Rp. 350.000.000",
                      ditagih: "Rp. 200.000.000",
                      sisa: "Rp. 150.000.000",
                      estimasi: "Rp. 40.000.000",
                    },
                    {
                      nilai: "Rp. 150.000.000",
                      ditagih: "Rp. 80.000.000",
                      sisa: "Rp. 70.000.000",
                      estimasi: "Rp. 25.000.000",
                    },
                    {
                      nilai: "Rp. 900.000.000",
                      ditagih: "Rp. 600.000.000",
                      sisa: "Rp. 300.000.000",
                      estimasi: "Rp. 70.000.000",
                    },
                    {
                      nilai: "Rp. 400.000.000",
                      ditagih: "Rp. 250.000.000",
                      sisa: "Rp. 150.000.000",
                      estimasi: "Rp. 35.000.000",
                    },
                  ];
                  const toNumber = (s: string) =>
                    parseInt(s.replace(/[^0-9]/g, "")) || 0;
                  const toRupiah = (n: number) =>
                    "Rp. " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  const totalNilai = rows.reduce(
                    (a, r) => a + toNumber(r.nilai),
                    0
                  );
                  const totalTagih = rows.reduce(
                    (a, r) => a + toNumber(r.ditagih),
                    0
                  );
                  const totalSisa = rows.reduce(
                    (a, r) => a + toNumber(r.sisa),
                    0
                  );
                  const totalEstimasi = rows.reduce(
                    (a, r) => a + toNumber(r.estimasi),
                    0
                  );
                  return (
                    <tr className="bg-gray-50 font-semibold">
                      <td
                        className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap"
                        colSpan={4}
                      >
                        Total
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {toRupiah(totalNilai)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {toRupiah(totalTagih)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {toRupiah(totalSisa)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {toRupiah(totalEstimasi)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap"></td>
                    </tr>
                  );
                })()}
              </tfoot>
            </table>
          </div>
        </div>

        {/* Rangking Sales Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Rangking Sales
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama Sales
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Deal
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Nilai Kontrak
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  {
                    no: 1,
                    nama: "Sales Engineer",
                    totalDeal: 30,
                    totalNilai: "Rp. 8.000.000.000",
                  },
                  {
                    no: 2,
                    nama: "Customer Success Manager",
                    totalDeal: 15,
                    totalNilai: "Rp. 5.000.000.000",
                  },
                  {
                    no: 3,
                    nama: "Account Manager",
                    totalDeal: 10,
                    totalNilai: "Rp. 2.000.000.000",
                  },
                  {
                    no: 4,
                    nama: "Sales Executive",
                    totalDeal: 9,
                    totalNilai: "Rp. 1.800.000.000",
                  },
                  {
                    no: 5,
                    nama: "Business Dev.",
                    totalDeal: 7,
                    totalNilai: "Rp. 1.200.000.000",
                  },
                ].map((s) => (
                  <tr key={s.no}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {s.no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {s.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {s.totalDeal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {s.totalNilai}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingMainDashboard;
