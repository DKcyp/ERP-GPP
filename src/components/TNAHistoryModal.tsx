import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

export interface HistoryTNA {
  id: string;
  nama: string;
  jabatan: string;
  departemen: string;
  kpi: string;
  indikator: string;
  nilaiSebelum: number;
  nilaiSesudah: number;
  tanggalTraining: string;
  statusTraining: "Completed" | "In Progress" | "Cancelled";
  trainer: string;
  rekomendasiTraining: string;
}

interface TNAHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyData: HistoryTNA[];
}

const TNAHistoryModal: React.FC<TNAHistoryModalProps> = ({
  isOpen,
  onClose,
  historyData,
}) => {
  const [showHistoryEntries, setShowHistoryEntries] = useState(5);
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [historyFilterType, setHistoryFilterType] = useState("all");

  // Filter data based on search and filter
  const filteredHistory = useMemo(() => {
    return historyData.filter((item) => {
      const matchesSearch =
        item.nama.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
        item.kpi.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
        item.trainer.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
        item.departemen.toLowerCase().includes(historySearchTerm.toLowerCase());

      const matchesFilter =
        historyFilterType === "all" ||
        item.statusTraining.toLowerCase() === historyFilterType.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [historyData, historySearchTerm, historyFilterType]);

  const pagedHistory = useMemo(
    () => filteredHistory.slice(0, showHistoryEntries),
    [filteredHistory, showHistoryEntries]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            📋 History Training TNA
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="p-6 flex items-center justify-between bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari history..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                value={historySearchTerm}
                onChange={(e) => setHistorySearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={historyFilterType}
              onChange={(e) => setHistoryFilterType(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="completed">Completed</option>
              <option value="in progress">In Progress</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={showHistoryEntries}
              onChange={(e) => setShowHistoryEntries(Number(e.target.value))}
            >
              <option value={5}>5 entries</option>
              <option value={10}>10 entries</option>
              <option value={25}>25 entries</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-grow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jabatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departemen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KPI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Indikator
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nilai Sebelum
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nilai Sesudah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Training
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trainer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rekomendasi Training
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagedHistory.map((item, index) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.jabatan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.departemen}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.kpi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.indikator}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                      {item.nilaiSebelum}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {item.nilaiSesudah > 0 ? (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                        {item.nilaiSesudah}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Belum selesai
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.tanggalTraining}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.statusTraining
                      )}`}
                    >
                      {item.statusTraining}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.trainer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.rekomendasiTraining}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <span>
              Showing {pagedHistory.length} of {filteredHistory.length} history
              entries
            </span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-full"></div>
                <span className="text-xs">
                  Completed (
                  {
                    historyData.filter((h) => h.statusTraining === "Completed")
                      .length
                  }
                  )
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-full"></div>
                <span className="text-xs">
                  In Progress (
                  {
                    historyData.filter(
                      (h) => h.statusTraining === "In Progress"
                    ).length
                  }
                  )
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded-full"></div>
                <span className="text-xs">
                  Cancelled (
                  {
                    historyData.filter((h) => h.statusTraining === "Cancelled")
                      .length
                  }
                  )
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleDateString("id-ID")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TNAHistoryModal;
