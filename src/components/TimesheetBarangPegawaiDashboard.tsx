import React, { useMemo, useState } from "react";
import { Clock, File, FileSpreadsheet, FileText, Plus } from "lucide-react";
import TimesheetBarangPegawaiModal, { TimesheetFormData } from "./TimesheetBarangPegawaiModal";

interface RowData {
  id: string;
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  nilaiTimesheet: string;
  mob: string; // DD-MM-YYYY
  demob: string; // DD-MM-YYYY
}

const sampleRows: RowData[] = [
  {
    id: "1",
    noSO: "SO001",
    noSOTurunan: "SO001.01",
    namaProyek: "Proyek A",
    nilaiTimesheet: "Rp 12.000.000",
    mob: "01-09-2025",
    demob: "10-09-2025",
  },
  {
    id: "2",
    noSO: "SO002",
    noSOTurunan: "SO002.02",
    namaProyek: "Proyek B",
    nilaiTimesheet: "Rp 8.500.000",
    mob: "03-09-2025",
    demob: "15-09-2025",
  },
];

const TimesheetBarangPegawaiDashboard: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>(sampleRows);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.noSO.toLowerCase().includes(s) ||
        r.noSOTurunan.toLowerCase().includes(s) ||
        r.namaProyek.toLowerCase().includes(s)
    );
  }, [rows, search]);

  const handleSave = (data: TimesheetFormData) => {
    const fmt = (iso: string) => {
      if (!iso) return "";
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    };
    const newRow: RowData = {
      id: (rows.length + 1).toString(),
      noSO: data.noSO,
      noSOTurunan: data.noSOTurunan,
      namaProyek: data.namaProyek,
      nilaiTimesheet: data.nilaiTimesheet || "Rp 0",
      mob: fmt(data.mob),
      demob: fmt(data.demob),
    };
    setRows((prev) => [newRow, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                TIMESHEET BARANG/PEGAWAI
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Operational</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">TimeSheet</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Barang/Pegawai</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
          {/* Search and actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="No SO / SO Turunan / Proyek"
                className="w-full pl-2 pr-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
              />
            </div>
            <div />
            <div className="flex items-end justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Timesheet</span>
              </button>
            </div>
          </div>

          {/* Quick Export Bar */}
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
            <div className="flex space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-1.5">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-1.5">
                <File className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-1.5">
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 text-xs">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">No SO</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">No SO Turunan</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">Nama Proyek</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">Nilai Timesheet</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">MOB</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">DEMOB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((item, idx) => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-2 py-2 text-xs text-gray-900 font-medium">{item.noSO}</td>
                    <td className="px-2 py-2 text-xs text-gray-900">{item.noSOTurunan}</td>
                    <td className="px-2 py-2 text-xs text-gray-900">{item.namaProyek}</td>
                    <td className="px-2 py-2 text-xs text-gray-900">{item.nilaiTimesheet}</td>
                    <td className="px-2 py-2 text-xs text-gray-600">{item.mob}</td>
                    <td className="px-2 py-2 text-xs text-gray-600">{item.demob}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TimesheetBarangPegawaiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default TimesheetBarangPegawaiDashboard;
