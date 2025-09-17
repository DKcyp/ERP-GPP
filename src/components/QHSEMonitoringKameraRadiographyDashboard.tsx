import React, { useState, useEffect } from "react";
import {
  Camera,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Upload,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Package,
  Atom,
  Bell,
  Download,
  RefreshCw,
  MapPin,
  Users,
  Gauge,
  TestTube,
  Trash2,
  FileUp,
  SortAsc,
  SortDesc,
} from "lucide-react";

interface MonitoringKameraData {
  id: string;
  no: number;
  kamera: string;
  isotop: string;
  personil: string[];
  validSIB: string;
  dosimeterSaku: string;
  validCertDosimeter: string;
  surveymeter: string;
  validCertSurveymeter: string;
  ujiUsapKamera: string;
  serumberW1: number;
  serumberW2: number;
  serumberW3: number;
  serumberW4: number;
  lokasiPemanfaatan: string;
  posisiKamera: string;
  dedicated: string;
}

const QHSEMonitoringKameraRadiographyDashboard: React.FC = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringKameraData[]>([
    {
      id: "1",
      no: 1,
      kamera: "S5055",
      isotop: "AZ562",
      personil: ["OR", "AR", "PPR"],
      validSIB: "2024-12-31",
      dosimeterSaku: "DS001",
      validCertDosimeter: "2024-11-15",
      surveymeter: "SM001",
      validCertSurveymeter: "2024-10-30",
      ujiUsapKamera: "2024-03-15",
      serumberW1: 15.2,
      serumberW2: 14.8,
      serumberW3: 15.5,
      serumberW4: 15.1,
      lokasiPemanfaatan: "Office GBP",
      posisiKamera: "PHE ONWJ",
      dedicated: "Medco EP",
    },
    {
      id: "2",
      no: 2,
      kamera: "S5056",
      isotop: "AZ563",
      personil: ["OR", "AR"],
      validSIB: "2024-04-15",
      dosimeterSaku: "DS002",
      validCertDosimeter: "2024-04-20",
      surveymeter: "SM002",
      validCertSurveymeter: "2024-05-10",
      ujiUsapKamera: "2024-02-28",
      serumberW1: 16.1,
      serumberW2: 15.9,
      serumberW3: 16.3,
      serumberW4: 16.0,
      lokasiPemanfaatan: "Medco E&P",
      posisiKamera: "Medco Field",
      dedicated: "Medco EP",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("All");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get expiry status with color coding
  const getExpiryStatus = (date: string) => {
    const expDate = new Date(date);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "expired", color: "bg-red-500 text-white", days: Math.abs(diffDays) };
    } else if (diffDays <= 30) {
      return { status: "expiring", color: "bg-yellow-500 text-white", days: diffDays };
    } else if (diffDays <= 60) {
      return { status: "warning", color: "bg-orange-500 text-white", days: diffDays };
    } else {
      return { status: "valid", color: "bg-green-500 text-white", days: diffDays };
    }
  };

  // Filter and search data
  const filteredData = monitoringData.filter((item) => {
    const matchesSearch = 
      item.kamera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isotop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.personil.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.lokasiPemanfaatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.posisiKamera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dedicated.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLokasi = filterLokasi === "All" || item.lokasiPemanfaatan === filterLokasi;
    
    return matchesSearch && matchesLokasi;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let aValue: any = a[sortColumn as keyof MonitoringKameraData];
    let bValue: any = b[sortColumn as keyof MonitoringKameraData];
    
    if (Array.isArray(aValue)) aValue = aValue.join(", ");
    if (Array.isArray(bValue)) bValue = bValue.join(", ");
    
    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = {
    total: monitoringData.length,
    valid: monitoringData.filter(item => 
      getExpiryStatus(item.validSIB).status === "valid" &&
      getExpiryStatus(item.validCertDosimeter).status === "valid" &&
      getExpiryStatus(item.validCertSurveymeter).status === "valid"
    ).length,
    expiring: monitoringData.filter(item => 
      getExpiryStatus(item.validSIB).status === "expiring" ||
      getExpiryStatus(item.validCertDosimeter).status === "expiring" ||
      getExpiryStatus(item.validCertSurveymeter).status === "expiring"
    ).length,
    expired: monitoringData.filter(item => 
      getExpiryStatus(item.validSIB).status === "expired" ||
      getExpiryStatus(item.validCertDosimeter).status === "expired" ||
      getExpiryStatus(item.validCertSurveymeter).status === "expired"
    ).length,
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Get unique locations for filter
  const uniqueLocations = Array.from(new Set(monitoringData.map(item => item.lokasiPemanfaatan)));

  // Export functions
  const exportToExcel = () => {
    // Implementation for Excel export
    console.log("Exporting to Excel...");
  };

  const exportToPDF = () => {
    // Implementation for PDF export
    console.log("Exporting to PDF...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              Monitoring Kamera Radiography – Tahun 2025
            </h1>
            <p className="text-xl text-blue-100">
              PT. Gamma Buana Persada | Dept. QHSE
            </p>
            <div className="flex items-center justify-center space-x-3 text-sm text-blue-100 mt-4">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Kamera</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Camera className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valid</p>
                <p className="text-2xl font-bold text-gray-900">{stats.valid}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expiring}</p>
              </div>
              <Bell className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Cari Kamera, Isotop, Personil, Lokasi..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterLokasi}
                  onChange={(e) => setFilterLokasi(e.target.value)}
                >
                  <option value="All">Semua Lokasi</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Data
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <FileUp className="h-4 w-4" />
                  Upload
                </button>
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("no")}>
                    <div className="flex items-center gap-1">
                      No
                      {sortColumn === "no" && (
                        sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("kamera")}>
                    <div className="flex items-center gap-1">
                      Kamera
                      {sortColumn === "kamera" && (
                        sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("isotop")}>
                    <div className="flex items-center gap-1">
                      Isotop
                      {sortColumn === "isotop" && (
                        sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Personil
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Valid SIB
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Dosimeter Saku
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Valid Cert Dosimeter
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Surveymeter
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Valid Cert Surveymeter
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Uji Usap Kamera
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Serumber (Curi per Minggu)
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Lokasi Pemanfaatan
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Posisi Kamera
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Dedicated
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.no}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {item.kamera}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.isotop}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {item.personil.map((person, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {person}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getExpiryStatus(item.validSIB).color}`}>
                        {new Date(item.validSIB).toLocaleDateString('id-ID')}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.dosimeterSaku}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getExpiryStatus(item.validCertDosimeter).color}`}>
                        {new Date(item.validCertDosimeter).toLocaleDateString('id-ID')}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.surveymeter}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getExpiryStatus(item.validCertSurveymeter).color}`}>
                        {new Date(item.validCertSurveymeter).toLocaleDateString('id-ID')}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.ujiUsapKamera).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div className="bg-gray-100 px-1 py-1 rounded">
                          <div className="text-gray-600">W1</div>
                          <div className="font-medium">{item.serumberW1}</div>
                        </div>
                        <div className="bg-gray-100 px-1 py-1 rounded">
                          <div className="text-gray-600">W2</div>
                          <div className="font-medium">{item.serumberW2}</div>
                        </div>
                        <div className="bg-gray-100 px-1 py-1 rounded">
                          <div className="text-gray-600">W3</div>
                          <div className="font-medium">{item.serumberW3}</div>
                        </div>
                        <div className="bg-gray-100 px-1 py-1 rounded">
                          <div className="text-gray-600">W4</div>
                          <div className="font-medium">{item.serumberW4}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {item.lokasiPemanfaatan}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.posisiKamera}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {item.dedicated}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, sortedData.length)}
                  </span>{" "}
                  of <span className="font-medium">{sortedData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === index + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QHSEMonitoringKameraRadiographyDashboard;
