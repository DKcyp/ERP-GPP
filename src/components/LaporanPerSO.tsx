import React, { useState } from "react";
import {
  Search,
  Printer,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileDown,
} from "lucide-react";

interface LaporanPerSOProps {
  // Add any props here if needed
}

type StatusType =
  | "Draft"
  | "Approved"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "On Hold"
  | "Selesai"
  | "On Progress";

interface DetailPekerjaan {
  pekerjaan: string;
  biaya: number;
  progress: number;
  lampiran: string[];
}

interface SalesOrderItem {
  noSo: string;
  tanggal: string;
  customer: string;
  project: string;
  nilaiKontrak: number;
  nilaiTagihan: number;
  status: StatusType;
  details: DetailPekerjaan[];
}

// Sample data
const initialSalesOrderData: SalesOrderItem[] = [
  {
    noSo: "SO/2023/001",
    tanggal: "2023-10-01",
    customer: "PT ABC",
    project: "Pembangunan Jalan Tol",
    nilaiKontrak: 1000000000,
    nilaiTagihan: 250000000,
    status: "In Progress",
    details: [
      {
        pekerjaan: "Galian Tanah",
        biaya: 500000000,
        progress: 50,
        lampiran: ["/files/surat-jalan.pdf", "/files/berita-acara.pdf"],
      },
      {
        pekerjaan: "Pondasi",
        biaya: 300000000,
        progress: 30,
        lampiran: ["/files/pondasi.pdf"],
      },
      {
        pekerjaan: "Pekerjaan Beton",
        biaya: 200000000,
        progress: 20,
        lampiran: [],
      },
    ],
  },
  {
    noSo: "SO/2023/002",
    tanggal: "2023-10-15",
    customer: "PT XYZ",
    project: "Pembangunan Jembatan",
    nilaiKontrak: 2000000000,
    nilaiTagihan: 500000000,
    status: "Completed",
    details: [
      {
        pekerjaan: "Pondasi Jembatan",
        biaya: 1000000000,
        progress: 100,
        lampiran: ["/files/pondasi-jembatan.pdf"],
      },
      {
        pekerjaan: "Struktur Baja",
        biaya: 800000000,
        progress: 100,
        lampiran: ["/files/struktur-baja.pdf"],
      },
      {
        pekerjaan: "Pengecatan",
        biaya: 200000000,
        progress: 100,
        lampiran: [],
      },
    ],
  },
  {
    noSo: "SO/2023/003",
    tanggal: "2023-11-01",
    customer: "PT DEF",
    project: "Pembangunan Gedung",
    nilaiKontrak: 5000000000,
    nilaiTagihan: 1000000000,
    status: "In Progress",
    details: [
      {
        pekerjaan: "Pondasi",
        biaya: 1000000000,
        progress: 80,
        lampiran: ["/files/pondasi-gedung.pdf"],
      },
      {
        pekerjaan: "Struktur",
        biaya: 3000000000,
        progress: 60,
        lampiran: ["/files/struktur-gedung.pdf"],
      },
      {
        pekerjaan: "Arsitektur",
        biaya: 1000000000,
        progress: 20,
        lampiran: [],
      },
    ],
  },
  {
    noSo: "SO/2023/004",
    tanggal: "2023-11-15",
    customer: "PT GHI",
    project: "Pembangunan Jalan",
    nilaiKontrak: 3000000000,
    nilaiTagihan: 1500000000,
    status: "On Hold",
    details: [
      {
        pekerjaan: "Pekerjaan Tanah",
        biaya: 1500000000,
        progress: 100,
        lampiran: ["/files/pekerjaan-tanah.pdf"],
      },
      {
        pekerjaan: "Pondasi",
        biaya: 1000000000,
        progress: 30,
        lampiran: ["/files/pondasi-jalan.pdf"],
      },
      {
        pekerjaan: "Marka Jalan",
        biaya: 150000000,
        progress: 0,
        lampiran: [],
      },
    ],
  },
];

interface PeriodeType {
  startDate: string;
  endDate: string;
}

const LaporanPerSO: React.FC<LaporanPerSOProps> = () => {
  const [salesOrderData] = useState<SalesOrderItem[]>(initialSalesOrderData);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [periode, setPeriode] = useState<PeriodeType>({
    startDate: "",
    endDate: "",
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching with:", { searchTerm, statusFilter, periode });
    // In a real app, you would filter the data or make an API call here
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Toggle row expansion
  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Get status badge color
  const getStatusBadgeColor = (status: StatusType) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Approved":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
      case "On Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "On Hold":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            LAPORAN PER SALES ORDER
          </h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end"
          >
            {/* Search Input - Nomor SO */}
            <div>
              <label
                htmlFor="noSo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nomor SO
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noSo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cari nomor SO..."
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Nama Customer */}
            <div>
              <label
                htmlFor="customer"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Customer
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="customer"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cari nama customer..."
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 bg-cyan-400 text-white rounded-r-md hover:bg-cyan-500"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Status SO */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status SO
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="Draft">Draft</option>
                <option value="Approved">Approved</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Periode */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periode
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="date"
                    value={periode.startDate}
                    onChange={(e) =>
                      setPeriode({ ...periode, startDate: e.target.value })
                    }
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={periode.endDate}
                    onChange={(e) =>
                      setPeriode({ ...periode, endDate: e.target.value })
                    }
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    min={periode.startDate}
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </span>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-4 flex justify-end">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-sm"
              >
                Tampilkan Data
              </button>
            </div>
          </form>
        </div>

        {/* Report Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Daftar Sales Order
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Printer size={16} />
                <span>Cetak</span>
              </button>
              <button className="flex items-center gap-2 text-sm px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                <FileDown size={16} />
                <span>Export Excel</span>
              </button>
              <button className="flex items-center gap-2 text-sm px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                <FileDown size={16} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Sales Order Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th scope="col" className="px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3">
                    No. SO
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Nilai Kontrak
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Biaya
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Margin
                  </th>
                  <th scope="col" className="px-6 py-3 min-w-[140px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesOrderData.map((item) => {
                  const revenue = Number(item.nilaiTagihan) || 0;
                  const biaya = Array.isArray(item.details)
                    ? item.details.reduce(
                        (sum, d) => sum + (Number(d.biaya) || 0),
                        0
                      )
                    : 0;
                  const margin = revenue - biaya;
                  const marginPct = revenue > 0 ? (margin / revenue) * 100 : 0;
                  return (
                    <React.Fragment key={item.noSo}>
                      <tr
                        className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleRow(item.noSo)}
                      >
                        <td className="px-6 py-4">
                          {expandedRow === item.noSo ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.noSo}
                        </td>
                        <td className="px-6 py-4">{item.customer}</td>
                        <td className="px-6 py-4">{item.project}</td>
                        <td className="px-6 py-4 text-right">
                          {formatCurrency(item.nilaiKontrak)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {formatCurrency(revenue)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {formatCurrency(biaya)}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold">
                          <span
                            className={
                              margin >= 0 ? "text-green-600" : "text-red-600"
                            }
                          >
                            {formatCurrency(margin)}
                          </span>
                        </td>
                        <td className="px-6 py-4 min-w-[140px]">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                      {/* Expanded Row */}
                      {expandedRow === item.noSo && (
                        <tr className="bg-gray-50">
                          <td colSpan={9} className="px-6 py-4">
                            <div className="pl-6 border-l-4 border-blue-400">
                              <h4 className="font-semibold text-gray-800 mb-3">
                                Detail Pekerjaan
                              </h4>
                              <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left">
                                        Pekerjaan
                                      </th>
                                      <th className="px-4 py-2 text-right">
                                        Biaya
                                      </th>
                                      <th className="px-4 py-2">Progress</th>
                                      <th className="px-4 py-2">Lampiran</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.details?.map((detail, idx) => (
                                      <tr
                                        key={idx}
                                        className="border-t border-gray-200"
                                      >
                                        <td className="px-4 py-3">
                                          {detail.pekerjaan}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                          {formatCurrency(detail.biaya)}
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                              className={`h-2.5 rounded-full ${
                                                detail.progress === 100
                                                  ? "bg-green-600"
                                                  : "bg-blue-600"
                                              }`}
                                              style={{
                                                width: `${detail.progress}%`,
                                              }}
                                            ></div>
                                          </div>
                                          <span className="text-sm text-gray-600">
                                            {detail.progress}%
                                          </span>
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="flex flex-wrap gap-1">
                                            {detail.lampiran.length > 0 ? (
                                              detail.lampiran.map(
                                                (file, fileIdx) => (
                                                  <span
                                                    key={fileIdx}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                  >
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    {file}
                                                  </span>
                                                )
                                              )
                                            ) : (
                                              <span className="text-gray-500 text-sm">
                                                Tidak ada lampiran
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <h5 className="text-sm font-medium text-blue-800">
                                    Total Nilai Kontrak
                                  </h5>
                                  <p className="text-xl font-bold text-blue-600">
                                    {formatCurrency(item.nilaiKontrak)}
                                  </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <h5 className="text-sm font-medium text-green-800">
                                    Total Revenue
                                  </h5>
                                  <p className="text-xl font-bold text-green-600">
                                    {formatCurrency(revenue)}
                                  </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h5 className="text-sm font-medium text-purple-800">
                                    Total Biaya
                                  </h5>
                                  <p className="text-xl font-bold text-purple-600">
                                    {formatCurrency(biaya)}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">
                                    Margin
                                  </span>
                                  <span
                                    className={`text-xl font-bold ${
                                      margin >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {formatCurrency(margin)} (
                                    {marginPct.toFixed(2)}%)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Menampilkan <span className="font-medium">1</span> sampai{" "}
              <span className="font-medium">3</span> dari{" "}
              <span className="font-medium">3</span> data
            </div>
            <div className="flex">
              <button className="px-3 py-1 border border-gray-300 rounded-l-md bg-white text-gray-700 hover:bg-gray-50">
                Sebelumnya
              </button>
              <button className="px-3 py-1 border-t border-b border-gray-300 bg-blue-50 text-blue-600 font-medium">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-r-md bg-white text-gray-700 hover:bg-gray-50">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanPerSO;
