import React, { useState } from "react";
import {
  TestTube,
  Search,
  Plus,
  Edit,
  Eye,
  Upload,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Camera,
  Atom,
  FileText,
  Download,
  Bell,
} from "lucide-react";

interface UjiUsapKamera {
  id: string;
  noUjiUsap: string;
  snKamera: string;
  noKamera: string;
  snIsotop: string;
  jenisIsotop: string;
  tanggalUji: string;
  hasilUji: "Lolos" | "Tidak Lolos" | "Pending";
  kondisiKamera: "Baik" | "Perlu Perbaikan" | "Rusak";
  nilaiRadiasi: string;
  batasAman: string;
  teknisiUji: string;
  sertifikatUji: string;
  masaBerlakuSertifikat: string;
  statusDokumen: "Lengkap" | "Kurang" | "Pending";
  catatanUji: string;
  rekomendasiTindakan: string;
  nextUji: string;
  penanggungJawab: string;
}

const QHSEUjiUsapKameraDashboard: React.FC = () => {
  const [ujiUsapData, setUjiUsapData] = useState<UjiUsapKamera[]>([
    {
      id: "1",
      noUjiUsap: "UU-001/2024",
      snKamera: "SN123456789",
      noKamera: "KR-001",
      snIsotop: "ISO-IR192-001",
      jenisIsotop: "Iridium-192",
      tanggalUji: "2024-03-15",
      hasilUji: "Lolos",
      kondisiKamera: "Baik",
      nilaiRadiasi: "0.5 mR/h",
      batasAman: "2.0 mR/h",
      teknisiUji: "Ahmad Radiologi",
      sertifikatUji: "CERT-UU-001.pdf",
      masaBerlakuSertifikat: "2024-09-15",
      statusDokumen: "Lengkap",
      catatanUji: "Hasil uji dalam batas normal, kondisi kamera baik",
      rekomendasiTindakan: "Lanjutkan penggunaan normal",
      nextUji: "2024-06-15",
      penanggungJawab: "Budi Supervisor",
    },
    {
      id: "2",
      noUjiUsap: "UU-002/2024",
      snKamera: "SN987654321",
      noKamera: "KR-002",
      snIsotop: "ISO-CO60-002",
      jenisIsotop: "Cobalt-60",
      tanggalUji: "2024-03-10",
      hasilUji: "Tidak Lolos",
      kondisiKamera: "Perlu Perbaikan",
      nilaiRadiasi: "3.2 mR/h",
      batasAman: "2.0 mR/h",
      teknisiUji: "Sari Teknisi",
      sertifikatUji: "CERT-UU-002.pdf",
      masaBerlakuSertifikat: "2024-09-10",
      statusDokumen: "Lengkap",
      catatanUji: "Nilai radiasi melebihi batas aman, perlu perbaikan segera",
      rekomendasiTindakan: "Stop penggunaan, lakukan perbaikan dan uji ulang",
      nextUji: "2024-04-10",
      penanggungJawab: "Andi Supervisor",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterHasil, setFilterHasil] = useState("All");
  const [filterKondisi, setFilterKondisi] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data
  const filteredData = ujiUsapData.filter((item) => {
    const matchesSearch = 
      item.noUjiUsap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.snKamera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noKamera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.snIsotop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teknisiUji.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHasil = filterHasil === "All" || item.hasilUji === filterHasil;
    const matchesKondisi = filterKondisi === "All" || item.kondisiKamera === filterKondisi;
    
    return matchesSearch && matchesHasil && matchesKondisi;
  });

  // Statistics
  const stats = {
    total: ujiUsapData.length,
    lolos: ujiUsapData.filter(u => u.hasilUji === "Lolos").length,
    tidakLolos: ujiUsapData.filter(u => u.hasilUji === "Tidak Lolos").length,
    expiringSoon: ujiUsapData.filter(u => {
      const expDate = new Date(u.masaBerlakuSertifikat);
      const today = new Date();
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length,
  };

  const getHasilColor = (hasil: string) => {
    switch (hasil) {
      case "Lolos": return "text-green-600 bg-green-100";
      case "Tidak Lolos": return "text-red-600 bg-red-100";
      case "Pending": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getKondisiColor = (kondisi: string) => {
    switch (kondisi) {
      case "Baik": return "text-green-600 bg-green-100";
      case "Perlu Perbaikan": return "text-yellow-600 bg-yellow-100";
      case "Rusak": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const isExpiringSoon = (date: string) => {
    const expDate = new Date(date);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TestTube className="h-8 w-8 text-purple-600" />
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                  UJI USAP KAMERA RADIOGRAPHY
                </h1>
              </div>
              <nav className="text-sm text-gray-600">
                <span>QHSE</span> <span className="mx-2">›</span>
                <span>RADIOGRAPHY</span> <span className="mx-2">›</span>
                <span className="text-purple-600 font-medium">Uji Usap Kamera</span>
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Uji Usap</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <TestTube className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lolos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lolos}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tidak Lolos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tidakLolos}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cert Expiring</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-500" />
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
                    placeholder="Cari uji usap, kamera, isotop..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filterHasil}
                  onChange={(e) => setFilterHasil(e.target.value)}
                >
                  <option value="All">Semua Hasil</option>
                  <option value="Lolos">Lolos</option>
                  <option value="Tidak Lolos">Tidak Lolos</option>
                  <option value="Pending">Pending</option>
                </select>

                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filterKondisi}
                  onChange={(e) => setFilterKondisi(e.target.value)}
                >
                  <option value="All">Semua Kondisi</option>
                  <option value="Baik">Baik</option>
                  <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                  <option value="Rusak">Rusak</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Uji Usap
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uji Usap & Kamera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hasil & Kondisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai Radiasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sertifikat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teknisi & PJ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((uji) => (
                  <tr key={uji.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <TestTube className="h-5 w-5 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{uji.noUjiUsap}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Camera className="h-3 w-3" />
                            {uji.noKamera} (SN: {uji.snKamera})
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Atom className="h-3 w-3" />
                            {uji.snIsotop} ({uji.jenisIsotop})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHasilColor(uji.hasilUji)}`}>
                          {uji.hasilUji}
                        </span>
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKondisiColor(uji.kondisiKamera)}`}>
                          {uji.kondisiKamera}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className={`font-medium ${parseFloat(uji.nilaiRadiasi) > parseFloat(uji.batasAman) ? 'text-red-600' : 'text-green-600'}`}>
                          {uji.nilaiRadiasi}
                        </div>
                        <div className="text-xs text-gray-500">Batas: {uji.batasAman}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {uji.sertifikatUji}
                        </div>
                        <div className={`text-xs flex items-center gap-1 ${isExpiringSoon(uji.masaBerlakuSertifikat) ? 'text-orange-600' : 'text-gray-500'}`}>
                          <Calendar className="h-3 w-3" />
                          {new Date(uji.masaBerlakuSertifikat).toLocaleDateString('id-ID')}
                          {isExpiringSoon(uji.masaBerlakuSertifikat) && (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{uji.teknisiUji}</div>
                      <div className="text-sm text-gray-500">{uji.penanggungJawab}</div>
                      <div className="text-xs text-gray-500">
                        Next: {new Date(uji.nextUji).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900">
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
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

export default QHSEUjiUsapKameraDashboard;
