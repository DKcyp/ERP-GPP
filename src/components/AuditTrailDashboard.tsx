import React, { useState } from "react";
import {
  Calendar,
  User,
  Search,
  FileDown,
  ChevronsUpDown,
  Clock,
  ShieldCheck,
  FilePlus,
  FilePen,
  Trash2,
} from "lucide-react";

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  type: "approve" | "create" | "update" | "delete" | "login";
}

const dummyLogs: AuditLog[] = [
  {
    id: 1,
    timestamp: "2025-09-24 10:25:17",
    user: "Jokowi",
    action: "Menyetujui (approve) stock opname #SO-2025-09-001",
    module: "Stock Opname",
    type: "approve",
  },
  {
    id: 2,
    timestamp: "2025-09-24 09:58:41",
    user: "Siti",
    action: "Menambahkan barang baru: Helm Safety (BRG001)",
    module: "Master Barang",
    type: "create",
  },
  {
    id: 3,
    timestamp: "2025-09-24 09:15:22",
    user: "Budi",
    action: "Login ke sistem dari IP 192.168.1.10",
    module: "Autentikasi",
    type: "login",
  },
  {
    id: 4,
    timestamp: "2025-09-23 16:45:05",
    user: "Jokowi",
    action: "Mengubah data COA: Kas Besar (1101)",
    module: "Master COA",
    type: "update",
  },
  {
    id: 5,
    timestamp: "2025-09-23 15:12:30",
    user: "Ani",
    action: "Menghapus satuan barang: Lusin",
    module: "Satuan Barang",
    type: "delete",
  },
  {
    id: 6,
    timestamp: "2025-09-23 14:30:00",
    user: "Siti",
    action: "Menyetujui permintaan pembelian #PO-2025-09-015",
    module: "Pembelian",
    type: "approve",
  },
  {
    id: 7,
    timestamp: "2025-09-23 11:05:18",
    user: "Budi",
    action: "Menambahkan pengguna baru: staffgudang",
    module: "Manajemen Pengguna",
    type: "create",
  },
];

const getActionIcon = (type: AuditLog["type"]) => {
  switch (type) {
    case "approve":
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case "create":
      return <FilePlus className="h-5 w-5 text-blue-500" />;
    case "update":
      return <FilePen className="h-5 w-5 text-yellow-500" />;
    case "delete":
      return <Trash2 className="h-5 w-5 text-red-500" />;
    case "login":
      return <Clock className="h-5 w-5 text-gray-500" />;
    default:
      return null;
  }
};

const AuditTrailDashboard: React.FC = () => {
  const [logs] = useState<AuditLog[]>(dummyLogs);
  const [filters, setFilters] = useState({
    search: "",
    user: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp.split(" ")[0]);
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

    return (
      (log.user.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.module.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.user === "" || log.user === filters.user) &&
      (!dateFrom || logDate >= dateFrom) &&
      (!dateTo || logDate <= dateTo)
    );
  });

  const uniqueUsers = Array.from(new Set(logs.map((log) => log.user)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                AUDIT TRAIL
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  General
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Audit Trail</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Real-time log stream</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="relative">
              <label htmlFor="search" className="sr-only">
                Cari Aktivitas
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                placeholder="Cari aktivitas..."
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label htmlFor="user" className="sr-only">
                Filter Pengguna
              </label>
              <select
                id="user"
                name="user"
                value={filters.user}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white appearance-none pr-10"
              >
                <option value="">-- Semua Pengguna --</option>
                {uniqueUsers.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
              <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label htmlFor="dateFrom" className="sr-only">
                Tanggal Mulai
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label htmlFor="dateTo" className="sr-only">
                Tanggal Selesai
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center mb-6">
            <button className="flex items-center px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200">
              <FileDown className="h-5 w-5 mr-2" /> Export All
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Timestamp <ChevronsUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Pengguna <ChevronsUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktivitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Module <ChevronsUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center h-full">
                        {getActionIcon(log.type)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {log.user}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-800">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {log.module}
                      </span>
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

export default AuditTrailDashboard;
