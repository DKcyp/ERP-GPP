import React, { useEffect, useMemo, useState } from "react";
import { Search, FileSpreadsheet, FileText, ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";

interface Row {
  id: string;
  no: number;
  noPR: string;
  tanggalPR: string;
  statusPR: "Selesai" | "Proses" | "Ditolak";
  noPO: string;
  tanggalPO: string;
  statusPO: "Selesai" | "Proses" | "";
  noDO: string;
  tanggalDO: string;
  statusDO: "Dikirim" | "Diterima" | "";
  vendor: string;
  nilai: string;
  pic: string;
}

const mockRows: Row[] = [
  {
    id: "1",
    no: 1,
    noPR: "PR-2025-001",
    tanggalPR: "10-01-2025",
    statusPR: "Selesai",
    noPO: "PO-2025-001",
    tanggalPO: "15-01-2025",
    statusPO: "Selesai",
    noDO: "DO-2025-001",
    tanggalDO: "20-01-2025",
    statusDO: "Dikirim",
    vendor: "PT Sinar Abadi",
    nilai: "Rp 250.000.000",
    pic: "Budi",
  },
  {
    id: "2",
    no: 2,
    noPR: "PR-2025-002",
    tanggalPR: "01-02-2025",
    statusPR: "Proses",
    noPO: "",
    tanggalPO: "",
    statusPO: "",
    noDO: "",
    tanggalDO: "",
    statusDO: "",
    vendor: "CV Mitra Jaya",
    nilai: "Rp 80.000.000",
    pic: "Andi",
  },
];

const ManagementMonitoringPembelianDashboard: React.FC = () => {
  const [searchNoPR, setSearchNoPR] = useState("");
  const [searchVendor, setSearchVendor] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [animateRows, setAnimateRows] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return mockRows.filter((r) => {
      const matchesNoPR = r.noPR.toLowerCase().includes(searchNoPR.toLowerCase());
      const matchesVendor = r.vendor.toLowerCase().includes(searchVendor.toLowerCase());
      const itemDate = r.tanggalPR.split("-").reverse().join("-");
      const matchesFrom = dateFrom ? itemDate >= dateFrom : true;
      const matchesTo = dateTo ? itemDate <= dateTo : true;
      return matchesNoPR && matchesVendor && matchesFrom && matchesTo;
    });
  }, [searchNoPR, searchVendor, dateFrom, dateTo]);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentData = filtered.slice(startIndex, endIndex);

  const renderStatus = (status: string) => {
    let color = "bg-gray-400";
    if (status === "Selesai" || status === "Dikirim" || status === "Diterima") color = "bg-green-500";
    if (status === "Proses") color = "bg-yellow-500";
    if (status === "Ditolak") color = "bg-red-500";
    return <span className={`px-2 py-1 text-white text-xs rounded-full ${color}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-sm">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-wide mb-1">MANAGEMENT MONITORING PEMBELIAN</h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Management</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring Pembelian</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <input type="text" value={searchNoPR} onChange={(e) => setSearchNoPR(e.target.value)} placeholder="Cari No. PR..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="text" value={searchVendor} onChange={(e) => setSearchVendor(e.target.value)} placeholder="Cari Vendor..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex justify-end space-x-2">
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm"><FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel</button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm"><FileText className="h-3.5 w-3.5" /> Export PDF</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No PR</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Tanggal PR</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Status PR</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No PO</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Tanggal PO</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Status PO</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No DO</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Tanggal DO</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Status DO</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Vendor</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nilai</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">PIC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((r, index) => (
                  <tr key={r.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-3 py-2">{startIndex + index + 1}</td>
                    <td className="px-3 py-2 font-medium text-gray-900">{r.noPR}</td>
                    <td className="px-3 py-2">{r.tanggalPR}</td>
                    <td className="px-3 py-2">{renderStatus(r.statusPR)}</td>
                    <td className="px-3 py-2">{r.noPO}</td>
                    <td className="px-3 py-2">{r.tanggalPO}</td>
                    <td className="px-3 py-2">{r.statusPO ? renderStatus(r.statusPO) : ''}</td>
                    <td className="px-3 py-2">{r.noDO}</td>
                    <td className="px-3 py-2">{r.tanggalDO}</td>
                    <td className="px-3 py-2">{r.statusDO ? renderStatus(r.statusDO) : ''}</td>
                    <td className="px-3 py-2">{r.vendor}</td>
                    <td className="px-3 py-2">{r.nilai}</td>
                    <td className="px-3 py-2">{r.pic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-700">Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} results</div>
              <div className="flex items-center space-x-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 text-gray-400 hover:text-gray-600"><ChevronLeft className="h-3.5 w-3.5" /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`px-2.5 py-1.5 text-xs font-medium rounded-md ${page === p ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 text-gray-400 hover:text-gray-600"><ChevronRight className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementMonitoringPembelianDashboard;
