import React, { useMemo, useState } from "react";
import { Search, Clock, FileSpreadsheet, FileText, Download, Paperclip, X, Plus } from "lucide-react";

interface TrainingRequest {
  id: string;
  nama: string;
  jabatan: string;
  departemen: string;
  kebutuhanTraining: string;
  attachmentUrl?: string; // optional, highlight if missing
}

const initialData: TrainingRequest[] = [
  {
    id: "TRN-001",
    nama: "Budi Santoso",
    jabatan: "Staff HR",
    departemen: "HRD",
    kebutuhanTraining: "Leadership & Communication",
    attachmentUrl: "#",
  },
  {
    id: "TRN-002",
    nama: "Siti Mawar",
    jabatan: "Teknisi",
    departemen: "Operational",
    kebutuhanTraining: "Keselamatan Kerja (K3)",
    // missing attachment -> will be highlighted
  },
];

const HRDTrainingListDashboard: React.FC = () => {
  const [rows] = useState<TrainingRequest[]>(initialData);
  const [showEntries, setShowEntries] = useState(10);
  const [filters, setFilters] = useState({
    nama: "",
    departemen: "",
    jabatan: "",
    kebutuhanTraining: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchNama = filters.nama
        ? r.nama.toLowerCase().includes(filters.nama.toLowerCase())
        : true;
      const matchDept = filters.departemen
        ? r.departemen === filters.departemen
        : true;
      const matchJabatan = filters.jabatan
        ? r.jabatan.toLowerCase().includes(filters.jabatan.toLowerCase())
        : true;
      const matchNeed = filters.kebutuhanTraining
        ? r.kebutuhanTraining
            .toLowerCase()
            .includes(filters.kebutuhanTraining.toLowerCase())
        : true;
      return matchNama && matchDept && matchJabatan && matchNeed;
    });
  }, [rows, filters]);

  const paged = useMemo(
    () => filtered.slice(0, showEntries),
    [filtered, showEntries]
  );

  const handleExport = (type: string) => {
    alert(`Exporting ${type} (dummy)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LIST TRAINING
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  HRD
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">List Training</span>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-blue-600 text-xs"
                onClick={() => alert("Tambah List Training (dummy)")}
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                name="nama"
                value={filters.nama}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari nama..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
              <select
                name="departemen"
                value={filters.departemen}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              >
                <option value="">Semua</option>
                <option value="HRD">HRD</option>
                <option value="Pengadaan">Pengadaan</option>
                <option value="Marketing">Marketing</option>
                <option value="Operational">Operational</option>
                <option value="Gudang">Gudang</option>
                <option value="QHSE">QHSE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
              <input
                name="jabatan"
                value={filters.jabatan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari jabatan..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Training yang dibutuhkan</label>
              <input
                name="kebutuhanTraining"
                value={filters.kebutuhanTraining}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                placeholder="Cari kebutuhan training..."
              />
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm flex items-center justify-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          <div className="p-0 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                className="border border-gray-300 rounded-md px-2 py-1"
                value={showEntries}
                onChange={(e) => setShowEntries(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 text-xs"
                onClick={() => handleExport("Excel")}
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 text-xs"
                onClick={() => handleExport("CSV")}
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 text-xs"
                onClick={() => handleExport("PDF")}
              >
                <FileText className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training yang dibutuhkan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paged.map((r) => {
                  const missingAttachment = !r.attachmentUrl;
                  return (
                    <tr
                      key={r.id}
                      className={
                        missingAttachment
                          ? "bg-yellow-50 hover:bg-yellow-100 transition-colors"
                          : "hover:bg-gray-50 transition-colors"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.jabatan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.departemen}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.kebutuhanTraining}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        {r.attachmentUrl ? (
                          <a
                            href={r.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center hover:text-blue-800"
                          >
                            <Paperclip className="h-4 w-4 mr-1" /> Lihat Lampiran
                          </a>
                        ) : (
                          <span className="text-gray-400 inline-flex items-center">
                            <Paperclip className="h-4 w-4 mr-1" /> Tidak ada
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Footer: simple pagination placeholder */}
          <div className="p-4 flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing 1 to {Math.min(filtered.length, showEntries)} of {filtered.length} entries
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 border border-primary bg-primary text-white rounded-md">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDTrainingListDashboard;
