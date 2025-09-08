import React, { useState } from "react";
import { Phone, Megaphone, FileText, ArrowRight, Clock } from "lucide-react";
import Alert from "./Alert";
import { AlertItem } from "../types";

const MarketingMainDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      message:
        "CV Sejahtera harus segera di follow up sebelum deadline prospect",
      type: "info",
      actionText: "Follow Up",
      onAction: () => console.log("Follow up CV Sejahtera"),
    },
    {
      id: "2",
      message:
        "PT Makmur Jaya harus segera di follow up sebelum deadline prospect",
      type: "info",
      actionText: "Follow Up",
      onAction: () => console.log("Follow up PT Makmur Jaya"),
    },
    {
      id: "3",
      message:
        "PT Maju jaya harus segera di follow up sebelum deadline prospect",
      type: "info",
      actionText: "Follow Up",
      onAction: () => console.log("Follow up PT Maju Jaya"),
    },
  ]);

  const handleCloseAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

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
          {/* Alerts container */}
          <div className="absolute top-8 right-6 z-50 space-y-3 w-72">
            {alerts.map((alert) => (
              <Alert
                key={alert.id}
                id={alert.id}
                message={alert.message}
                type={alert.type}
                actionText={alert.actionText}
                onActionClick={() => {
                  alert.onAction();
                  handleCloseAlert(alert.id);
                }}
                onCloseClick={() => handleCloseAlert(alert.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nilai Penjualan Section */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Nilai Penjualan
          </h3>
          <div className="space-y-4">
            {/* Card 1: On Call */}
            <div
              className="flex items-center space-x-4 p-4 rounded-xl bg-red-500 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
              role="button"
              tabIndex={0}
              onClick={() => {
                const path = "/marketing/penawaran/on-call";
                try {
                  // Try hash-based navigation first
                  window.location.hash = path;
                  // Also pushState for pathname-based routers
                  window.history.pushState({}, "", path);
                  // Dispatch common navigation events some shells listen for
                  window.dispatchEvent(new Event("popstate"));
                  window.dispatchEvent(new Event("hashchange"));
                } catch (e) {
                  // no-op
                }
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
                <p className="text-sm font-medium">On Call</p>
                <p className="text-xl font-bold">13.439.481</p>
              </div>
            </div>
            {/* Card 2: Tender */}
            <div
              className="flex items-center space-x-4 p-4 rounded-xl bg-cyan-500 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
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
                <p className="text-sm font-medium">Tender</p>
                <p className="text-xl font-bold">13.439.481</p>
              </div>
            </div>
            {/* Card 3: Kontrak On Call New */}
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-green-500 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-green-600 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">Kontrak On Call New</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
            {/* Card 4: Kontrak On Call Existing */}
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-indigo-500 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-indigo-600 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">Kontrak On Call Existing</p>
                <p className="text-xl font-bold">30</p>
              </div>
            </div>
          </div>
        </div>

        {/* Proses Penawaran Kontrak Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Proses Penawaran Kontrak
          </h3>
          <div className="space-y-4">
            {/* Process Item 1 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-800">
                  Suspect
                </span>
                <span className="text-gray-600 text-sm">(1000)</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-500" />
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-800">
                  Prospect
                </span>
                <span className="text-gray-600 text-sm">(100)</span>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                Suspect to Prospect 10%
              </span>
            </div>
            {/* Process Item 2 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-800">
                  Prospect
                </span>
                <span className="text-gray-600 text-sm">(100)</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-500" />
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-800">SO</span>
                <span className="text-gray-600 text-sm">(10)</span>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-white">
                Prospect to SO 10%
              </span>
            </div>
            {/* Process Item 3 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-800">
                  Suspect
                </span>
                <span className="text-gray-600 text-sm">(1000)</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-500" />
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-800">SO</span>
                <span className="text-gray-600 text-sm">(10)</span>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                Suspect to SO 1%
              </span>
            </div>
          </div>
        </div>

        {/* Kontrol Kontrak Section */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Kontrol Kontrak
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    1
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    PT. Jakarta Tank Terminal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    01-01-2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    01-06-2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 200.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 150.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 50.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 40.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    150 Hari
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    2
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    PT. Surabaya Shipping Lines
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    15-02-2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    15-08-2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 500.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 300.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 200.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 60.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    180 Hari
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    3
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    PT. Bandung Logistics
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    01-03-2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    01-09-2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 300.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 200.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 100.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 45.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    180 Hari
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    4
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    PT. Medan Cargo Express
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    10-04-2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    10-10-2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 700.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 500.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 200.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 30.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    180 Hari
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    5
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    PT. Semarang Port Services
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    01-05-2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    01-11-2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 600.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 400.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 200.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp. 50.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    180 Hari
                  </td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    colSpan={4}
                  >
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp. 2.300.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp. 1.550.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp. 750.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp. 225.000.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Rangking Sales Section */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    1
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Sales Engineer
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    30
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    8.000.000
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Customer success manager
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    5.000.000
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    3
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Account manager
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    10
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    2.000.000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingMainDashboard;
