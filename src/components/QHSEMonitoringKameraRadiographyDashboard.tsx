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

interface PersonilData {
  nama: string;
  validSIB: string;
  endKontrak: string;
  keterangan: "BARU" | "PERPANJANG" | "OFF";
  dosimeterSaku: string;
  validCertDosimeter: string;
  surveymeter: string;
  validCertSurveymeter: string;
  tld: string;
}

interface MonitoringKameraData {
  id: string;
  no: number;
  kamera: string;
  isotop: string;
  personil: PersonilData[];
  ujiUsapKamera: string;
  serumberW1: number;
  serumberW2: number;
  serumberW3: number;
  serumberW4: number;
  lokasiPemanfaatan: string[];
  posisiKamera: string;
  posisiColor: string;
  dedicated: string;
}

const QHSEMonitoringKameraRadiographyDashboard: React.FC = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringKameraData[]>([
    {
      id: "1",
      no: 1,
      kamera: "S5055",
      isotop: "AZ562",
      personil: [
        {
          nama: "OR YULI ANTONI",
          validSIB: "2024-12-31",
          endKontrak: "2024-11-30",
          keterangan: "PERPANJANG",
          dosimeterSaku: "DS001",
          validCertDosimeter: "2024-11-15",
          surveymeter: "SM001",
          validCertSurveymeter: "2024-10-30",
          tld: "TLD001",
        },
        {
          nama: "AR SUTOPO BIMA VICTOR",
          validSIB: "2024-06-15",
          endKontrak: "2024-05-20",
          keterangan: "OFF",
          dosimeterSaku: "DS002",
          validCertDosimeter: "2024-04-20",
          surveymeter: "SM002",
          validCertSurveymeter: "2024-03-10",
          tld: "TLD002",
        },
        {
          nama: "PPR EKA SURYA FACHRIZA",
          validSIB: "2025-01-15",
          endKontrak: "2024-12-31",
          keterangan: "BARU",
          dosimeterSaku: "DS003",
          validCertDosimeter: "2024-12-01",
          surveymeter: "SM003",
          validCertSurveymeter: "2024-11-15",
          tld: "TLD003",
        },
      ],
      ujiUsapKamera: "2024-03-15",
      serumberW1: 15.2,
      serumberW2: 14.8,
      serumberW3: 15.5,
      serumberW4: 15.1,
      lokasiPemanfaatan: [
        "Office GBP, Medco E&P Rimau, MEDCO",
        "Lemukutan, Medco E&P Tarakan, Medco",
        "E&P Sangatta, MEDCO Sanga Sanga"
      ],
      posisiKamera: "PHE ONWJ",
      posisiColor: "bg-blue-600 text-white",
      dedicated: "Medco EP",
    },
    {
      id: "2",
      no: 2,
      kamera: "AZ563",
      isotop: "AZ563",
      personil: [
        {
          nama: "OR SLAMET PARYANTO",
          validSIB: "2024-04-15",
          endKontrak: "2024-03-30",
          keterangan: "OFF",
          dosimeterSaku: "DS004",
          validCertDosimeter: "2024-02-20",
          surveymeter: "SM004",
          validCertSurveymeter: "2024-01-10",
          tld: "TLD004",
        },
        {
          nama: "AR AHMAD",
          validSIB: "2024-08-20",
          endKontrak: "2024-07-15",
          keterangan: "PERPANJANG",
          dosimeterSaku: "DS005",
          validCertDosimeter: "2024-06-30",
          surveymeter: "SM005",
          validCertSurveymeter: "2024-05-25",
          tld: "TLD005",
        },
      ],
      ujiUsapKamera: "2024-02-28",
      serumberW1: 16.1,
      serumberW2: 15.9,
      serumberW3: 16.3,
      serumberW4: 16.0,
      lokasiPemanfaatan: [
        "Office GBP, Medco E&P Tarakan, Medco",
        "E&P Sangatta, PHE ONWJ, Medco Suka",
        "Makmur E&P Saka, Asam-asam"
      ],
      posisiKamera: "MEDCO EPG",
      posisiColor: "bg-green-600 text-white",
      dedicated: "Medco EP",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get expiry status with color coding
  const getExpiryStatus = (date: string) => {
    const expDate = new Date(date);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "expired", color: "bg-red-500 text-white", textColor: "text-red-600" };
    } else if (diffDays <= 30) {
      return { status: "expiring", color: "bg-yellow-500 text-black", textColor: "text-yellow-600" };
    } else {
      return { status: "valid", color: "bg-green-500 text-white", textColor: "text-green-600" };
    }
  };

  // Get keterangan color
  const getKeteranganColor = (keterangan: string) => {
    switch (keterangan) {
      case "BARU": return "text-blue-600 font-semibold";
      case "PERPANJANG": return "text-green-600 font-semibold";
      case "OFF": return "text-red-600 font-semibold";
      default: return "text-gray-600";
    }
  };

  // Create table rows with multi-row structure
  const createTableRows = () => {
    const rows: JSX.Element[] = [];
    monitoringData.forEach((kamera) => {
      kamera.personil.forEach((person, personIndex) => {
        const isFirstRow = personIndex === 0;
        const rowSpan = kamera.personil.length;
        
        rows.push(
          <tr key={`${kamera.id}-${personIndex}`} className="hover:bg-gray-50 border-b border-gray-200">
            {/* No - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center text-sm font-medium border-r border-gray-300 bg-gray-50">
                {kamera.no}
              </td>
            )}
            
            {/* Kamera - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center text-sm font-medium border-r border-gray-300 bg-blue-50">
                {kamera.kamera}
              </td>
            )}
            
            {/* Isotop - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center text-sm font-medium border-r border-gray-300 bg-blue-50">
                {kamera.isotop}
              </td>
            )}
            
            {/* Personil - individual for each person */}
            <td className="px-2 py-2 text-sm border-r border-gray-300">
              {person.nama}
            </td>
            
            {/* Valid SIB - individual with color coding */}
            <td className={`px-2 py-2 text-center text-xs font-medium border-r border-gray-300 ${getExpiryStatus(person.validSIB).color}`}>
              {new Date(person.validSIB).toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </td>
            
            {/* End Kontrak - individual with color coding */}
            <td className={`px-2 py-2 text-center text-xs font-medium border-r border-gray-300 ${getExpiryStatus(person.endKontrak).color}`}>
              {new Date(person.endKontrak).toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </td>
            
            {/* Keterangan - individual with status color */}
            <td className={`px-2 py-2 text-center text-xs font-bold border-r border-gray-300 ${getKeteranganColor(person.keterangan)}`}>
              {person.keterangan}
            </td>
            
            {/* Dosimeter Saku - individual */}
            <td className="px-2 py-2 text-center text-sm border-r border-gray-300">
              {person.dosimeterSaku}
            </td>
            
            {/* Valid Cert Dosimeter - individual with color coding */}
            <td className={`px-2 py-2 text-center text-xs font-medium border-r border-gray-300 ${getExpiryStatus(person.validCertDosimeter).color}`}>
              {new Date(person.validCertDosimeter).toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </td>
            
            {/* Surveymeter - individual */}
            <td className="px-2 py-2 text-center text-sm border-r border-gray-300">
              {person.surveymeter}
            </td>
            
            {/* Valid Cert Surveymeter - individual with color coding */}
            <td className={`px-2 py-2 text-center text-xs font-medium border-r border-gray-300 ${getExpiryStatus(person.validCertSurveymeter).color}`}>
              {new Date(person.validCertSurveymeter).toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </td>
            
            {/* TLD - individual */}
            <td className="px-2 py-2 text-center text-sm border-r border-gray-300">
              {person.tld}
            </td>
            
            {/* Uji Usap Kamera - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center text-xs border-r border-gray-300">
                {new Date(kamera.ujiUsapKamera).toLocaleDateString('id-ID', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })}
              </td>
            )}
            
            {/* W1 - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center text-sm border-r border-gray-300">
                {kamera.serumberW1}
              </td>
            )}
            
            {/* W2 - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center text-sm border-r border-gray-300">
                {kamera.serumberW2}
              </td>
            )}
            
            {/* W3 - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center text-sm border-r border-gray-300">
                {kamera.serumberW3}
              </td>
            )}
            
            {/* W4 - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center text-sm border-r border-gray-300">
                {kamera.serumberW4}
              </td>
            )}
            
            {/* Lokasi Pemanfaatan - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-xs border-r border-gray-300 max-w-xs">
                <div className="space-y-1">
                  {kamera.lokasiPemanfaatan.map((lokasi, idx) => (
                    <div key={idx} className="text-gray-700">
                      {lokasi}
                    </div>
                  ))}
                </div>
              </td>
            )}
            
            {/* Posisi Kamera - merged for all personnel with colored block */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center border-r border-gray-300">
                <span className={`px-2 py-1 rounded text-xs font-medium ${kamera.posisiColor}`}>
                  {kamera.posisiKamera}
                </span>
              </td>
            )}
            
            {/* Dedicated - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center text-sm">
                {kamera.dedicated}
              </td>
            )}
          </tr>
        );
      });
    });
    return rows;
  };

  // Statistics
  const totalPersonil = monitoringData.reduce((sum, kamera) => sum + kamera.personil.length, 0);
  const validPersonil = monitoringData.reduce((sum, kamera) => 
    sum + kamera.personil.filter(p => 
      getExpiryStatus(p.validSIB).status === "valid" &&
      getExpiryStatus(p.endKontrak).status === "valid"
    ).length, 0
  );
  const expiringPersonil = monitoringData.reduce((sum, kamera) => 
    sum + kamera.personil.filter(p => 
      getExpiryStatus(p.validSIB).status === "expiring" ||
      getExpiryStatus(p.endKontrak).status === "expiring"
    ).length, 0
  );
  const expiredPersonil = monitoringData.reduce((sum, kamera) => 
    sum + kamera.personil.filter(p => 
      getExpiryStatus(p.validSIB).status === "expired" ||
      getExpiryStatus(p.endKontrak).status === "expired"
    ).length, 0
  );

  const stats = {
    total: monitoringData.length,
    totalPersonil,
    valid: validPersonil,
    expiring: expiringPersonil,
    expired: expiredPersonil,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Kamera</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Camera className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Personil</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPersonil}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
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
              </div>

              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Data
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  Upload
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Excel
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    NO
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    KAMERA
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    ISOTOP
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    PERSONIL
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    VALID SIB
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    END<br/>KONTRAK
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    KETERANGAN
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    DOSIMETER<br/>SAKU
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    VALID CERT
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    SURVEYMETER
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    VALID CERT
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    TLD
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    UJI USAP<br/>KAMERA
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    W1
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    W2
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    W3
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    W4
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    LOKASI<br/>PEMANFAATAN
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-500">
                    POSISI<br/>KAMERA
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                    DEDICATED
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {createTableRows()}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Catatan Proses:</p>
              <ul className="space-y-1 text-xs">
                <li>• Proses pengajuan refill isotop baru sedang berlangsung</li>
                <li>• Perpanjangan kontrak personil OR dan AR dalam tahap approval</li>
                <li>• Kalibrasi surveymeter dijadwalkan minggu depan</li>
                <li>• Update sertifikat TLD menunggu hasil dari laboratorium</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QHSEMonitoringKameraRadiographyDashboard;
