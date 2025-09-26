import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  TrendingDown,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  RefreshCw,
} from "lucide-react";

interface StockItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  satuan: string;
  stokAwal: number;
  masuk: number;
  keluar: number;
  stokAkhir: number;
  stokMinimal: number;
  lokasi: string;
  serialNumber: string;
  lastUpdate: string;
  status: "Normal" | "Low Stock" | "Critical" | "Out of Stock";
}

interface StockMovement {
  id: string;
  tanggal: string;
  kodeBarang: string;
  namaBarang: string;
  jenis: "Masuk" | "Keluar" | "Adjustment";
  referensi: string;
  qty: number;
  saldo: number;
  keterangan: string;
}

const KartuStockDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "detail">("overview");

  // Data dummy untuk kartu stock
  const stockData: StockItem[] = [
    {
      id: "1",
      kodeBarang: "BRG-001",
      namaBarang: "Besi Beton 12mm",
      kategori: "Material Konstruksi",
      satuan: "Batang",
      stokAwal: 500,
      masuk: 200,
      keluar: 150,
      stokAkhir: 550,
      stokMinimal: 100,
      lokasi: "Gudang A-01",
      serialNumber: "SN-BSI-001",
      lastUpdate: "2025-01-20 14:30",
      status: "Normal",
    },
    {
      id: "2",
      kodeBarang: "BRG-002",
      namaBarang: "Semen Portland 50kg",
      kategori: "Material Konstruksi",
      satuan: "Sak",
      stokAwal: 200,
      masuk: 100,
      keluar: 250,
      stokAkhir: 50,
      stokMinimal: 75,
      lokasi: "Gudang A-02",
      serialNumber: "SN-SMN-002",
      lastUpdate: "2025-01-20 13:15",
      status: "Low Stock",
    },
    {
      id: "3",
      kodeBarang: "BRG-003",
      namaBarang: "Cat Tembok Putih 25kg",
      kategori: "Material Finishing",
      satuan: "Kaleng",
      stokAwal: 80,
      masuk: 50,
      keluar: 120,
      stokAkhir: 10,
      stokMinimal: 20,
      lokasi: "Gudang B-01",
      serialNumber: "SN-CAT-003",
      lastUpdate: "2025-01-20 12:45",
      status: "Critical",
    },
    {
      id: "4",
      kodeBarang: "BRG-004",
      namaBarang: "Pipa PVC 4 inch",
      kategori: "Material Plumbing",
      satuan: "Batang",
      stokAwal: 150,
      masuk: 0,
      keluar: 150,
      stokAkhir: 0,
      stokMinimal: 25,
      lokasi: "Gudang C-01",
      serialNumber: "SN-PVC-004",
      lastUpdate: "2025-01-20 11:20",
      status: "Out of Stock",
    },
  ];

  // Data pergerakan stock
  const stockMovements: StockMovement[] = [
    {
      id: "1",
      tanggal: "2025-01-20",
      kodeBarang: "BRG-001",
      namaBarang: "Besi Beton 12mm",
      jenis: "Masuk",
      referensi: "PO-2025-001",
      qty: 200,
      saldo: 550,
      keterangan: "Pembelian dari Supplier A",
    },
    {
      id: "2",
      tanggal: "2025-01-20",
      kodeBarang: "BRG-001",
      namaBarang: "Besi Beton 12mm",
      jenis: "Keluar",
      referensi: "SO-2025-001",
      qty: 150,
      saldo: 350,
      keterangan: "Pengiriman ke Proyek Gedung A",
    },
    {
      id: "3",
      tanggal: "2025-01-19",
      kodeBarang: "BRG-002",
      namaBarang: "Semen Portland 50kg",
      jenis: "Keluar",
      referensi: "SO-2025-002",
      qty: 100,
      saldo: 50,
      keterangan: "Pengiriman ke Proyek Renovasi",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Normal":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Low Stock":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "Critical":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "Out of Stock":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Critical":
        return "bg-orange-100 text-orange-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredData = stockData.filter((item) => {
    const matchesSearch =
      item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.kategori === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = stockData.length;
  const lowStockItems = stockData.filter(
    (item) => item.status === "Low Stock" || item.status === "Critical"
  ).length;
  const outOfStockItems = stockData.filter(
    (item) => item.status === "Out of Stock"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Kartu Stock Barang
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Gudang
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Kartu Stock</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Item</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Plus className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+3 item</span>
              <span className="text-gray-500 ml-1">minggu ini</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">
                  {lowStockItems}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-orange-600">Perlu perhatian</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {outOfStockItems}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <Minus className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-600">Segera restock</span>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari barang..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Semua Kategori</option>
                <option value="Material Konstruksi">Material Konstruksi</option>
                <option value="Material Finishing">Material Finishing</option>
                <option value="Material Plumbing">Material Plumbing</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="Normal">Normal</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Critical">Critical</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Stock Barang
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok Awal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masuk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keluar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok Akhir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.namaBarang}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.kodeBarang} • {item.serialNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.kategori}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.lokasi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.stokAwal} {item.satuan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-green-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        {item.masuk} {item.satuan}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-red-600">
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                        {item.keluar} {item.satuan}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.stokAkhir} {item.satuan}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {item.stokMinimal}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{item.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        onClick={() => {
                          setSelectedItem(item.id);
                          setViewMode("detail");
                        }}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Movement Detail Modal */}
        {viewMode === "detail" && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">
                  Detail Pergerakan Stock
                </h3>
                <button
                  onClick={() => setViewMode("overview")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Jenis
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Referensi
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Saldo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Keterangan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stockMovements.map((movement) => (
                        <tr key={movement.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {movement.tanggal}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                movement.jenis === "Masuk"
                                  ? "bg-green-100 text-green-800"
                                  : movement.jenis === "Keluar"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {movement.jenis}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {movement.referensi}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {movement.qty}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {movement.saldo}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {movement.keterangan}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KartuStockDashboard;
