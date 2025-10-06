import React from "react";
import { Clock, ArrowDownRight, ArrowUpRight } from "lucide-react";

const FinanceDashboard: React.FC = () => {
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return amount
      .toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      })
      .replace("Rp", "");
  };

  // KPI sample totals (mock)
  const totals = {
    bankAvailable: 8_450_000_000,
    cash: 1_275_000_000,
    receivables: 5_930_000_000,
    payables: 4_120_000_000,
  };

  // Cashflow 6 months mock data (percent scales visually in chart)
  const cashflowMonthly = [
    { month: "Mar", in: 68, out: 40 },
    { month: "Apr", in: 72, out: 55 },
    { month: "Mei", in: 80, out: 63 },
    { month: "Jun", in: 65, out: 49 },
    { month: "Jul", in: 78, out: 66 },
    { month: "Agu", in: 86, out: 71 },
  ];

  // Mapping Pembayaran (mock per hari)
  type Status = "Received" | "Waiting" | "-";
  const statusBadge = (s: Status) => (
    <span
      className={
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium " +
        (s === "Received"
          ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200"
          : s === "Waiting"
          ? "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-200"
          : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200")
      }
    >
      {s}
    </span>
  );

  // Cash Out status uses Paid/Unpaid
  type StatusOut = "Paid" | "Unpaid";
  const statusBadgeOut = (s: StatusOut) => (
    <span
      className={
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium " +
        (s === "Paid"
          ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200"
          : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200")
      }
    >
      {s}
    </span>
  );

  const paymentIn: Array<{
    namaCustomer: string;
    nominal: number;
    jadwal: string;
    status: Status;
  }>[] = [
    [
      {
        namaCustomer: "PT Sinar Jaya",
        nominal: 250_000_000,
        jadwal: "2025-09-12",
        status: "Received",
      },
      {
        namaCustomer: "PT Panca Abadi",
        nominal: 175_000_000,
        jadwal: "2025-09-12",
        status: "Waiting",
      },
      {
        namaCustomer: "CV Maju Sejahtera",
        nominal: 95_000_000,
        jadwal: "2025-09-12",
        status: "Received",
      },
    ],
    [
      {
        namaCustomer: "PT Mitra Karya",
        nominal: 300_000_000,
        jadwal: "2025-09-13",
        status: "Waiting",
      },
      {
        namaCustomer: "PT Nusantara",
        nominal: 120_000_000,
        jadwal: "2025-09-13",
        status: "Received",
      },
    ],
  ];
  const paymentOut: Array<{
    namaPembiayaan: string;
    nominal: number;
    jadwal: string;
    status: StatusOut;
  }>[] = [
    [
      {
        namaPembiayaan: "Gaji Karyawan",
        nominal: 400_000_000,
        jadwal: "2025-09-12",
        status: "Paid",
      },
      {
        namaPembiayaan: "Vendor A",
        nominal: 210_000_000,
        jadwal: "2025-09-12",
        status: "Unpaid",
      },
    ],
    [
      {
        namaPembiayaan: "Sewa Kantor",
        nominal: 150_000_000,
        jadwal: "2025-09-13",
        status: "Paid",
      },
      {
        namaPembiayaan: "BBM Operasional",
        nominal: 60_000_000,
        jadwal: "2025-09-13",
        status: "Unpaid",
      },
    ],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                FINANCE DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Finance
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <p className="text-sm text-gray-500 mb-1">
              Total Saldo Bank Dapat Digunakan
            </p>
            <p className="text-3xl font-bold text-gray-900">
              Rp {formatCurrency(totals.bankAvailable)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <p className="text-sm text-gray-500 mb-1">Total Saldo Kas</p>
            <p className="text-3xl font-bold text-gray-900">
              Rp {formatCurrency(totals.cash)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <p className="text-sm text-gray-500 mb-1">Total Piutang</p>
            <p className="text-3xl font-bold text-gray-900">
              Rp {formatCurrency(totals.receivables)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <p className="text-sm text-gray-500 mb-1">Total Hutang</p>
            <p className="text-3xl font-bold text-gray-900">
              Rp {formatCurrency(totals.payables)}
            </p>
          </div>
        </div>

        {/* Cashflow Chart (6 bulan) */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Cashflow (6 Bulan)
            </h3>
            <div className="flex justify-end space-x-4 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
                <span>Masuk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-pink-400 rounded-sm"></div>
                <span>Keluar</span>
              </div>
            </div>
            <div className="relative h-80">
              {/* Y-axis grid lines */}
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(
                (value, index) => (
                  <div
                    key={index}
                    className={`absolute left-0 right-0 border-t border-gray-200 ${
                      index === 0 ? "bottom-0" : ""
                    }`}
                    style={{ bottom: `${value}%`, height: "1px" }}
                  >
                    <span className="absolute -left-8 text-xs text-gray-500 -translate-y-1/2">
                      {value}
                    </span>
                  </div>
                )
              )}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end h-full pt-8">
                {cashflowMonthly.map((data, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center h-full justify-end"
                  >
                    <div className="flex h-full items-end space-x-1 px-2">
                      <div
                        className="w-6 bg-blue-400 rounded-t-md transition-all duration-700 ease-out hover:opacity-80"
                        style={{ height: `${data.in}%` }}
                      ></div>
                      <div
                        className="w-6 bg-pink-400 rounded-t-md transition-all duration-700 ease-out hover:opacity-80"
                        style={{ height: `${data.out}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mapping Cashflow (detail per minggu) */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Mapping Cashflow
          </h3>
          
          {/* Summary Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-700">Total Cash In</span>
                <span className="text-lg font-bold text-green-900">
                  Rp {formatCurrency(paymentIn.flat().reduce((sum, item) => sum + item.nominal, 0))}
                </span>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-700">Total Cash Out</span>
                <span className="text-lg font-bold text-red-900">
                  Rp {formatCurrency(paymentOut.flat().reduce((sum, item) => sum + item.nominal, 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Headers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                Cash In (per Minggu)
              </h4>
              <span className="text-xs text-gray-500">
                Minggu ini: {new Date().toLocaleDateString("id-ID")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                Cash Out (per Minggu)
              </h4>
              <span className="text-xs text-gray-500">
                Minggu ini: {new Date().toLocaleDateString("id-ID")}
              </span>
            </div>
          </div>

          {/* Synchronized Week Tables */}
          {Array.from({ length: Math.max(paymentIn.length, paymentOut.length) }).map((_, idx) => {
            const inRows = paymentIn[idx] || [];
            const outRows = paymentOut[idx] || [];
            const inTotal = inRows.reduce((sum, item) => sum + item.nominal, 0);
            const outTotal = outRows.reduce((sum, item) => sum + item.nominal, 0);

            return (
              <div key={idx} className="mb-6">
                {/* Week Headers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
                  <div className="text-xs text-gray-500">
                    Minggu ke-{idx + 1}
                  </div>
                  <div className="text-xs text-gray-500">
                    Minggu ke-{idx + 1}
                  </div>
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cash In Table */}
                  <div className="overflow-x-auto border border-gray-100 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-100 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-gray-600 w-1/3">
                            Nama Customer
                          </th>
                          <th className="px-3 py-2 text-right text-gray-600 w-1/4">
                            Nominal
                          </th>
                          <th className="px-3 py-2 text-center text-gray-600 w-1/4">
                            Jadwal Penerimaan
                          </th>
                          <th className="px-3 py-2 text-center text-gray-600 w-1/6">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {inRows.length > 0 ? (
                          inRows.map((r, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-gray-900 text-left">
                                {r.namaCustomer}
                              </td>
                              <td className="px-3 py-2 text-right text-gray-900 font-semibold">
                                Rp {formatCurrency(r.nominal)}
                              </td>
                              <td className="px-3 py-2 text-center text-gray-700">
                                {new Date(r.jadwal).toLocaleDateString("id-ID")}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {statusBadge(r.status)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-3 py-4 text-center text-gray-500 italic">
                              Tidak ada data untuk minggu ini
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-green-50">
                        <tr>
                          <td className="px-3 py-2 text-left font-semibold text-green-800">
                            Total Nominal
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-green-900">
                            Rp {formatCurrency(inTotal)}
                          </td>
                          <td className="px-3 py-2"></td>
                          <td className="px-3 py-2"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Cash Out Table */}
                  <div className="overflow-x-auto border border-gray-100 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-100 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-gray-600 w-1/3">
                            Nama Pembiayaan
                          </th>
                          <th className="px-3 py-2 text-right text-gray-600 w-1/4">
                            Nominal
                          </th>
                          <th className="px-3 py-2 text-center text-gray-600 w-1/4">
                            Jadwal Pembayaran
                          </th>
                          <th className="px-3 py-2 text-center text-gray-600 w-1/6">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {outRows.length > 0 ? (
                          outRows.map((r, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-gray-900 text-left">
                                {r.namaPembiayaan}
                              </td>
                              <td className="px-3 py-2 text-right text-gray-900 font-semibold">
                                Rp {formatCurrency(r.nominal)}
                              </td>
                              <td className="px-3 py-2 text-center text-gray-700">
                                {new Date(r.jadwal).toLocaleDateString("id-ID")}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {statusBadgeOut(r.status)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-3 py-4 text-center text-gray-500 italic">
                              Tidak ada data untuk minggu ini
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-red-50">
                        <tr>
                          <td className="px-3 py-2 text-left font-semibold text-red-800">
                            Total Nominal
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-red-900">
                            Rp {formatCurrency(outTotal)}
                          </td>
                          <td className="px-3 py-2"></td>
                          <td className="px-3 py-2"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
