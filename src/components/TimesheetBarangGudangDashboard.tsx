import React, { useState } from "react";
import {
  Clock,
  Search,
  FileText,
  FileBarChart,
  FileSpreadsheet,
  Eye,
  CalendarDays,
  Plus,
} from "lucide-react";
import TimesheetBarangPegawaiModal, {
  TimesheetFormData,
} from "./TimesheetBarangPegawaiModal";

type Row = {
  no: number;
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  tanggalPenyerahan: string;
  status: string;
  mob?: string;
  demob?: string;
};

const TimesheetBarangGudangDashboard: React.FC = () => {
  const [rows] = useState<Row[]>([
    {
      no: 1,
      noSO: "SO001",
      noSOTurunan: "SO001.12",
      namaProyek: "Pembangunan Gedung A",
      tanggalPenyerahan: "10-03-2025",
      status: "Pending",
      mob: "01-03-2025",
      demob: "10-03-2025",
    },
    {
      no: 2,
      noSO: "SO002",
      noSOTurunan: "SO002.05",
      namaProyek: "Renovasi Kantor B",
      tanggalPenyerahan: "15-03-2025",
      status: "Belum Diproses",
      mob: "03-03-2025",
      demob: "15-03-2025",
    },
    {
      no: 3,
      noSO: "SO003",
      noSOTurunan: "SO003.07",
      namaProyek: "Pengadaan Infrastruktur",
      tanggalPenyerahan: "20-03-2025",
      status: "Barang Diterima",
      mob: "05-03-2025",
      demob: "20-03-2025",
    },
    {
      no: 4,
      noSO: "SO004",
      noSOTurunan: "SO004.07",
      namaProyek: "Pengadaan Infrastruktur",
      tanggalPenyerahan: "20-02-2025",
      status: "-",
      mob: "",
      demob: "",
    },
    {
      no: 5,
      noSO: "SO005",
      noSOTurunan: "SO005.57",
      namaProyek: "Pengadaan Infrastruktur",
      tanggalPenyerahan: "20-02-2025",
      status: "-",
      mob: "",
      demob: "",
    },
  ]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] =
    useState<Partial<TimesheetFormData> | null>(null);

  const openCreate = () => {
    setInitialData({
      noSO: "",
      noSOTurunan: "",
      namaProyek: "",
      mob: "",
      demob: "",
      pegawai: [],
      barang: [],
    });
    setIsModalOpen(true);
  };

  const openDetail = (r: Row) => {
    setInitialData({
      noSO: r.noSO,
      noSOTurunan: r.noSOTurunan,
      namaProyek: r.namaProyek,
      mob: r.mob || "",
      demob: r.demob || "",
      pegawai: [],
      barang: [],
    });
    setIsModalOpen(true);
  };

  // (status badge not used in this view)

  const getActionButton = (r: Row) => {
    return (
      <button
        onClick={() => openDetail(r)}
        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-xs shadow-md"
      >
        <Eye className="h-4 w-4" />
        <span>Detail</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                TIMESHEET BARANG
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Gudang
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Pengembalian Barang
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Timesheet Barang
                </span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="relative">
              <label
                htmlFor="noSO"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cari No SO
              </label>
              <input
                type="text"
                id="noSO"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="SO001"
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label
                htmlFor="noSOTurunan"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cari No SO Turunan
              </label>
              <input
                type="text"
                id="noSOTurunan"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="SO001.12"
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label
                htmlFor="namaProyek"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cari Nama Proyek
              </label>
              <input
                type="text"
                id="namaProyek"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Proyek A"
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih Status--</option>
                <option>Pending</option>
                <option>Belum Diproses</option>
                <option>Barang Diterima</option>
              </select>
            </div>
          </div>

          {/* Periode and Search Button */}
          <div className="flex items-end space-x-4 mb-6">
            <div className="relative flex-1">
              <label
                htmlFor="periodeStart"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Periode
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative w-1/2">
                  <input
                    type="date"
                    id="periodeStart"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    defaultValue="2025-03-03"
                  />
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <span className="text-gray-500">s.d</span>
                <div className="relative w-1/2">
                  <input
                    type="date"
                    id="periodeEnd"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    defaultValue="2025-03-03"
                  />
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md">
              Search
            </button>
          </div>

          {/* Tools */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm shadow-md">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md">
                <FileText className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm shadow-md">
                <FileBarChart className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Show</span>
                <select className="border border-gray-300 rounded-md px-2 py-1">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span>entries</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search:"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No SO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No SO Turunan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Proyek
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MOB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DEMOB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.noSO}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.noSOTurunan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.namaProyek}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.mob}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.demob}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {getActionButton(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing 1 to {rows.length} of {rows.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm">
                Previous
              </button>
              <button className="px-4 py-2 border border-blue-500 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500 flex justify-between items-center">
        <span>2023 © Mazer</span>
        <span>
          Crafted with <span className="text-red-500">❤️</span> by Saugi
        </span>
      </footer>
      {/* Modal */}
      {isModalOpen && (
        <TimesheetBarangPegawaiModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(_data: TimesheetFormData) => {
            // Integrate save to list if needed later
            setIsModalOpen(false);
          }}
          initialData={initialData}
          showOnlyBarang
        />
      )}
    </div>
  );
};

export default TimesheetBarangGudangDashboard;
