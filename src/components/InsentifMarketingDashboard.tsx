import React, { useMemo, useState } from "react";
import { Search, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

interface InsentifItem {
  id: string;
  soNumber: string;
  client: string;
  invoiceValue: number; // in rupiah
  margin: number; // percent
  jobDesc: string;
  yearOfContract: number;
  typeContract: string; // On Call / Tender / etc
  paymentDate: string; // ISO yyyy-mm-dd
  commission: number; // in rupiah
  remarks: string;
  approval: "Menunggu" | "Approve" | "Reject";
  periodPembayaran: string; // e.g., "Jan 2025", or "2025-01"
}

const currency = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const getApprovalBadge = (s: InsentifItem["approval"]) => {
  switch (s) {
    case "Approve":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Reject":
      return "bg-rose-100 text-rose-800 border-rose-200";
    default:
      return "bg-amber-100 text-amber-800 border-amber-200";
  }
};

const InsentifMarketingDashboard: React.FC = () => {
  const [qSO, setQSO] = useState("");
  const [qClient, setQClient] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const data: InsentifItem[] = useMemo(
    () => [
      {
        id: "1",
        soNumber: "SO001",
        client: "Client A",
        invoiceValue: 25000000,
        margin: 12,
        jobDesc: "Maintenance Server",
        yearOfContract: 2025,
        typeContract: "On Call",
        paymentDate: "2025-01-31",
        commission: 1250000,
        remarks: "Pembayaran termin 1",
        approval: "Menunggu",
        periodPembayaran: "Jan 2025",
      },
      {
        id: "2",
        soNumber: "SO023",
        client: "Client B",
        invoiceValue: 50000000,
        margin: 10,
        jobDesc: "Network Setup",
        yearOfContract: 2025,
        typeContract: "Tender",
        paymentDate: "2025-02-15",
        commission: 2500000,
        remarks: "Full payment",
        approval: "Approve",
        periodPembayaran: "Feb 2025",
      },
    ],
    []
  );

  const filtered = data.filter((row) => {
    const okSO = row.soNumber.toLowerCase().includes(qSO.toLowerCase());
    const okClient = row.client.toLowerCase().includes(qClient.toLowerCase());
    const t = new Date(row.paymentDate).getTime();
    const f = dateFrom ? new Date(dateFrom).getTime() : -Infinity;
    const to = dateTo ? new Date(dateTo).getTime() : Infinity;
    const okDate = t >= f && t <= to;
    return okSO && okClient && okDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-wide mb-2">INSENTIF</h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">Insentif</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filters - small */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700">Cari SO Number</label>
              <div className="relative">
                <input
                  value={qSO}
                  onChange={(e) => setQSO(e.target.value)}
                  className="w-full pl-2 pr-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="SOxxx"
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Cari Client</label>
              <div className="relative">
                <input
                  value={qClient}
                  onChange={(e) => setQClient(e.target.value)}
                  className="w-full pl-2 pr-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nama client"
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Payment Date Dari</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pr-8 pl-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Payment Date Sampai</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pr-8 pl-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 py-2 text-left">SO Number</th>
                <th className="px-2 py-2 text-left">Client</th>
                <th className="px-2 py-2 text-left">Invoice Value</th>
                <th className="px-2 py-2 text-left">Margin</th>
                <th className="px-2 py-2 text-left">Job Desc</th>
                <th className="px-2 py-2 text-left">Year of Contract</th>
                <th className="px-2 py-2 text-left">Type Contract</th>
                <th className="px-2 py-2 text-left">Payment Date</th>
                <th className="px-2 py-2 text-left">Commision</th>
                <th className="px-2 py-2 text-left">Remarks</th>
                <th className="px-2 py-2 text-left">Approval Insentive Marketing</th>
                <th className="px-2 py-2 text-left">Period pembayaran Insentif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                  <td className="px-2 py-2 font-medium text-gray-900">{row.soNumber}</td>
                  <td className="px-2 py-2 text-gray-800">{row.client}</td>
                  <td className="px-2 py-2 text-gray-800">{currency(row.invoiceValue)}</td>
                  <td className="px-2 py-2 text-gray-800">{row.margin}%</td>
                  <td className="px-2 py-2 text-gray-800">{row.jobDesc}</td>
                  <td className="px-2 py-2 text-gray-800">{row.yearOfContract}</td>
                  <td className="px-2 py-2 text-gray-800">{row.typeContract}</td>
                  <td className="px-2 py-2 text-gray-800">{new Date(row.paymentDate).toLocaleDateString("id-ID")}</td>
                  <td className="px-2 py-2 text-gray-800">{currency(row.commission)}</td>
                  <td className="px-2 py-2 text-gray-800">{row.remarks}</td>
                  <td className="px-2 py-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getApprovalBadge(row.approval)}`}>
                      {row.approval}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-gray-800">{row.periodPembayaran}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-2 py-6 text-center text-gray-500">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InsentifMarketingDashboard;
