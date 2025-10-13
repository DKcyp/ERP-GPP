import React, { useState } from 'react';
import {
  Search, Plus, Edit, Eye, Trash2,
  Download, ChevronLeft, ChevronRight,
  X, Save, AlertCircle,
  Clock, User,
  XCircle, AlertTriangle,
  Home,
  FileText,
  RefreshCw
} from 'lucide-react';

interface PersonilData {
  [x: string]: string | number | readonly string[] | undefined;
  nama: string;
  validSIB: string;
  endKontrak: string;
  dosimeterSaku: string;
  validCertDosimeter: string;
  surveymeter: string;
  validCertSurveymeter: string;
  tld: string;
}

interface ProgressDetail {
  mainStatus: "Pengajuan" | "Pelimbahan" | "Penghentian" | "Permohonan Ijin Baru" | "Izin Transport" | "Loading ISOTOP";
  subStatus: string;
  completed: boolean;
}

interface MonitoringKameraData {
  id: string;
  no: number;
  kamera: string;
  isotop: string;
  ktun: string;
  personil: PersonilData[];
  ujiUsapKamera: string;
  serumberW1: number;
  serumberW2: number;
  serumberW3: number;
  serumberW4: number;
  lokasiPemanfaatan: string[];
  posisiKamera: string;
  posisiKameraCustom?: string;
  posisiColor: string;
  progress: ProgressDetail;
}

const QHSEMonitoringKameraRadiographyDashboard: React.FC = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringKameraData[]>([
    {
      id: "1",
      no: 1,
      kamera: "S5055",
      isotop: "AZ562",
      ktun: "KTUN001",
      personil: [
        {
          nama: "OR YULI ANTONI",
          validSIB: "2024-12-31",
          endKontrak: "2024-11-30",
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
      progress: {
        mainStatus: "Pengajuan",
        subStatus: "PR",
        completed: false
      },
    },
    {
      id: "2",
      no: 2,
      kamera: "AZ563",
      isotop: "AZ563",
      ktun: "KTUN002",
      personil: [
        {
          nama: "OR SLAMET PARYANTO",
          validSIB: "2024-04-15",
          endKontrak: "2024-03-30",
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
      progress: {
        mainStatus: "Pelimbahan",
        subStatus: "Izin Transport",
        completed: true
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedData, setSelectedData] = useState<MonitoringKameraData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  
  // Progress update modal states
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressUpdateData, setProgressUpdateData] = useState<MonitoringKameraData | null>(null);
  const [newProgress, setNewProgress] = useState<ProgressDetail>({
    mainStatus: "Pengajuan",
    subStatus: "",
    completed: false
  });

  const subStatusOptions: Record<string, string[]> = {
    Pengajuan: ["PR", "PO", "Pembayaran DP", "Pelunasan"],
    Pelimbahan: ["Izin Transport", "Billing", "PR", "PO", "Pembayaran"],
    Penghentian: [
      "Pengembalian ISOTOP ke importir",
      "Permohonan ke Bapeten",
      "Billing",
      "PR",
      "PO",
      "Pembayaran"
    ],
    "Permohonan Izin Baru": [
      "Terima dokumen vendor",
      "Permohonan ke Bapeten",
      "Billing",
      "PR",
      "PO",
      "Pembayaran"
    ],
    "Izin Transport": ["-"],
    "Loading ISOTOP": ["-"]
  };

  // Form states
  const [formData, setFormData] = useState<MonitoringKameraData>({
    id: "",
    no: 0,
    kamera: "",
    isotop: "",
    ktun: "",
    personil: [{
      nama: "",
      validSIB: "",
      endKontrak: "",
      dosimeterSaku: "",
      validCertDosimeter: "",
      surveymeter: "",
      validCertSurveymeter: "",
      tld: "",
    }],
    ujiUsapKamera: "",
    serumberW1: 0,
    serumberW2: 0,
    serumberW3: 0,
    serumberW4: 0,
    lokasiPemanfaatan: [""],
    posisiKamera: "",
    posisiKameraCustom: "",
    posisiColor: "bg-blue-600 text-white",
    progress: {
      mainStatus: "Pengajuan",
      subStatus: "PR",
      completed: false
    },
  });

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
    filteredData.forEach((kamera) => {
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
            
            {/* Ktun - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center text-sm font-medium border-r border-gray-300 bg-yellow-50">
                {kamera.ktun}
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
            
            {/* Progress - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center text-sm">
                <div className="space-y-1">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    kamera.progress.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {kamera.progress.mainStatus}
                  </div>
                  <div className="text-xs text-gray-600">
                    {kamera.progress.subStatus}
                  </div>
                </div>
              </td>
            )}
            
            {/* Actions - merged for all personnel */}
            {isFirstRow && (
              <td rowSpan={rowSpan} className="px-2 py-2 text-center">
                <div className="flex justify-center gap-1">
                  <button
                    onClick={() => openViewModal(kamera)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(kamera)}
                    className="text-green-600 hover:text-green-800 p-1"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openProgressModal(kamera)}
                    className="text-orange-600 hover:text-orange-800 p-1"
                    title="Update Progress"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(kamera.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            )}
          </tr>
        );
      });
    });
    return rows;
  };

  // Modal handlers
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      id: "",
      no: monitoringData.length + 1,
      kamera: "",
      isotop: "",
      ktun: "",
      personil: [{
        nama: "",
        validSIB: "",
        endKontrak: "",
        dosimeterSaku: "",
        validCertDosimeter: "",
        surveymeter: "",
        validCertSurveymeter: "",
        tld: "",
      }],
      ujiUsapKamera: "",
      serumberW1: 0,
      serumberW2: 0,
      serumberW3: 0,
      serumberW4: 0,
      lokasiPemanfaatan: [""],
      posisiKamera: "",
      posisiKameraCustom: "",
      posisiColor: "bg-blue-600 text-white",
      progress: {
        mainStatus: "Pengajuan",
        subStatus: "PR",
        completed: false
      },
    });
    setShowModal(true);
  };

  const openEditModal = (data: MonitoringKameraData) => {
    setModalMode('edit');
    setSelectedData(data);
    setFormData({ ...data });
    setShowModal(true);
  };

  const openViewModal = (data: MonitoringKameraData) => {
    setModalMode('view');
    setSelectedData(data);
    setFormData({ ...data });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedData(null);
  };

  // Progress update handlers
  const openProgressModal = (data: MonitoringKameraData) => {
    setProgressUpdateData(data);
    setNewProgress({ ...data.progress });
    setShowProgressModal(true);
  };

  const closeProgressModal = () => {
    setShowProgressModal(false);
    setProgressUpdateData(null);
    setNewProgress({
      mainStatus: "Pengajuan",
      subStatus: "",
      completed: false
    });
  };

  const handleProgressUpdate = () => {
    if (progressUpdateData) {
      setMonitoringData(monitoringData.map(item => 
        item.id === progressUpdateData.id 
          ? { ...item, progress: newProgress }
          : item
      ));
      closeProgressModal();
    }
  };

  // CRUD operations
  const handleSave = () => {
    if (modalMode === 'add') {
      const newData = {
        ...formData,
        id: Date.now().toString(),
      };
      setMonitoringData([...monitoringData, newData]);
    } else if (modalMode === 'edit') {
      setMonitoringData(monitoringData.map(item => 
        item.id === formData.id ? formData : item
      ));
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setMonitoringData(monitoringData.filter(item => item.id !== deleteId));
    setShowDeleteConfirm(false);
    setDeleteId("");
  };

  // Form handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePersonilChange = (index: number, field: string, value: any) => {
    const updatedPersonil = [...formData.personil];
    updatedPersonil[index] = { ...updatedPersonil[index], [field]: value };
    setFormData({ ...formData, personil: updatedPersonil });
  };

  // Handle sub-status change
  const handleSubStatusChange = (subStatus: string) => {
    setFormData({
      ...formData,
      progress: {
        ...formData.progress,
        subStatus: subStatus
      }
    });
  };

  const handleMainStatusChange = (value: string) => {
    setFormData({
      ...formData,
      progress: {
        ...formData.progress,
        mainStatus: value,
        subStatus: "", // reset sub status setiap ganti main status
      },
    });
  };

  const addPersonil = () => {
    setFormData({
      ...formData,
      personil: [...formData.personil, {
        nama: "",
        validSIB: "",
        endKontrak: "",
        dosimeterSaku: "",
        validCertDosimeter: "",
        surveymeter: "",
        validCertSurveymeter: "",
        tld: "",
      }]
    });
  };

  const removePersonil = (index: number) => {
    if (formData.personil.length > 1) {
      const updatedPersonil = formData.personil.filter((_, i) => i !== index);
      setFormData({ ...formData, personil: updatedPersonil });
    }
  };

  // Filtered data based on search term and status filter
  const filteredData = monitoringData.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.kamera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isotop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ktun.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.personil.some(p => p.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.lokasiPemanfaatan.some(l => l.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.posisiKamera.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "" || item.progress.mainStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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
     <div className="bg-gradient-to-r from-purple-50 to-white border-b border-gray-100">
             <div className="max-w-7xl mx-auto px-6 py-8">
               <div className="flex items-center justify-between">
                 <div>
                   <div className="flex items-center gap-3 mb-2">
                     <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                     Monitoring Kamera Radiography
                     </h1>
                   </div>
                   <nav className="text-sm text-gray-600">
                     <span>QHSE</span> <span className="mx-2">›</span>
                     <span>RADIOGRAPHY</span> <span className="mx-2">›</span>
                     <span className="text-blue-600 font-medium">Monitoring Kamera Radiography</span>
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
                <div className="w-full sm:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Semua Status</option>
                    <option value="Pengajuan">Pengajuan</option>
                    <option value="Pelimbahan">Pelimbahan</option>
                    <option value="Penghentian">Penghentian</option>
                    <option value="Permohonan Ijin Baru">Permohonan Ijin Baru</option>
                    <option value="Izin Transport">Izin Transport</option>
                    <option value="Loading ISOTOP">Loading ISOTOP</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={openAddModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Data
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
                    KTUN
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
                    PROGRESS
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                    ACTIONS
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

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'add' ? 'Tambah Data Kamera' : 
                   modalMode === 'edit' ? 'Edit Data Kamera' : 'Detail Data Kamera'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No Urut
                    </label>
                    <input
                      type="number"
                      value={formData.no}
                      onChange={(e) => handleInputChange('no', parseInt(e.target.value))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kamera
                    </label>
                    <input
                      type="text"
                      value={formData.kamera}
                      onChange={(e) => handleInputChange('kamera', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Isotop
                    </label>
                    <input
                      type="text"
                      value={formData.isotop}
                      onChange={(e) => handleInputChange('isotop', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ktun
                    </label>
                    <input
                      type="text"
                      value={formData.ktun}
                      onChange={(e) => handleInputChange('ktun', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Uji Usap Kamera
                    </label>
                    <input
                      type="date"
                      value={formData.ujiUsapKamera}
                      onChange={(e) => handleInputChange('ujiUsapKamera', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Serumber Data */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Data Serumber (Weekly)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">W1</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.serumberW1}
                        onChange={(e) => handleInputChange('serumberW1', parseFloat(e.target.value))}
                        disabled={modalMode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">W2</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.serumberW2}
                        onChange={(e) => handleInputChange('serumberW2', parseFloat(e.target.value))}
                        disabled={modalMode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">W3</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.serumberW3}
                        onChange={(e) => handleInputChange('serumberW3', parseFloat(e.target.value))}
                        disabled={modalMode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">W4</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.serumberW4}
                        onChange={(e) => handleInputChange('serumberW4', parseFloat(e.target.value))}
                        disabled={modalMode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Position & Dedicated */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posisi Kamera
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "PHE ONWJ",
                        "MEDCO EPG",
                        "OFFICE",
                        "PROJECT",
                        "Lain-lain",
                      ].map((opt) => {
                        const colors: Record<string, string> = {
                          "PHE ONWJ": "bg-blue-600 text-white",
                          "MEDCO EPG": "bg-green-600 text-white",
                          OFFICE: "bg-gray-600 text-white",
                          PROJECT: "bg-purple-600 text-white",
                          "Lain-lain": "bg-orange-600 text-white",
                        };
                        const selected = formData.posisiKamera === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                posisiKamera: opt,
                                posisiColor: colors[opt] || "bg-blue-600 text-white",
                                posisiKameraCustom:
                                  opt !== "Lain-lain" ? "" : prev.posisiKameraCustom || "",
                              }));
                            }}
                            className={`px-3 py-1 rounded-md text-sm border transition ${
                              selected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Posisi Input - shown when "Lain-lain" is selected */}
                  {formData.posisiKamera === "Lain-lain" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Posisi Lainnya
                      </label>
                      <input
                        type="text"
                        value={formData.posisiKameraCustom || ""}
                        onChange={(e) =>
                          handleInputChange("posisiKameraCustom", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan posisi kamera lainnya"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Progress Status
                    </label>
                   <select
  value={formData.progress.mainStatus}
  onChange={(e) => handleMainStatusChange(e.target.value)}
  disabled={modalMode === "view"}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 mb-2"
>
  <option value="Pengajuan">Pengajuan</option>
  <option value="Pelimbahan">Pelimbahan</option>
  <option value="Penghentian">Penghentian</option>
  <option value="Permohonan Izin Baru">Permohonan Izin Baru</option>
  <option value="Izin Transport">Izin Transport</option>
  <option value="Loading ISOTOP">Loading ISOTOP</option>
</select>

{/* Sub Status Select */}
<select
  value={formData.progress.subStatus || ""}
  onChange={(e) => handleSubStatusChange(e.target.value)}
  disabled={modalMode === "view"}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">-- Pilih Sub Status --</option>
  {(subStatusOptions[formData.progress.mainStatus] || []).map((opt) => (
    <option key={opt} value={opt}>
      {opt}
    </option>
  ))}
</select>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.progress.completed}
                        onChange={(e) => handleInputChange('progress', {
                          ...formData.progress,
                          completed: e.target.checked
                        })}
                        disabled={modalMode === 'view'}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Completed</span>
                    </label>
                  </div>
                </div>

                {/* Lokasi Pemanfaatan */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-900">Lokasi Pemanfaatan</h4>
                    {modalMode !== 'view' && (
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          lokasiPemanfaatan: [...formData.lokasiPemanfaatan, ""]
                        })}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Tambah Lokasi
                      </button>
                    )}
                  </div>
                  
                  {formData.lokasiPemanfaatan.map((lokasi, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={lokasi}
                        onChange={(e) => {
                          const updatedLokasi = [...formData.lokasiPemanfaatan];
                          updatedLokasi[index] = e.target.value;
                          setFormData({ ...formData, lokasiPemanfaatan: updatedLokasi });
                        }}
                        disabled={modalMode === 'view'}
                        placeholder={`Lokasi ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                      {modalMode !== 'view' && formData.lokasiPemanfaatan.length > 1 && (
                        <button
                          onClick={() => {
                            const updatedLokasi = formData.lokasiPemanfaatan.filter((_, i) => i !== index);
                            setFormData({ ...formData, lokasiPemanfaatan: updatedLokasi });
                          }}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Personil Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Data Personil</h4>
                    {modalMode !== 'view' && (
                      <button
                        onClick={addPersonil}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Tambah Personil
                      </button>
                    )}
                  </div>
                  
                  {formData.personil.map((person, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-700">Personil {index + 1}</h5>
                        {modalMode !== 'view' && formData.personil.length > 1 && (
                          <button
                            onClick={() => removePersonil(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Personil
                          </label>
                          <input
                            type="text"
                            value={person.nama}
                            onChange={(e) => handlePersonilChange(index, 'nama', e.target.value)}
                            disabled={modalMode === 'view'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valid SIB
                          </label>
                          <input
                            type="date"
                            value={person.validSIB}
                            onChange={(e) => handlePersonilChange(index, 'validSIB', e.target.value)}
                            disabled={modalMode === 'view'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Kontrak
                          </label>
                          <input
                            type="date"
                            value={person.endKontrak}
                            onChange={(e) => handlePersonilChange(index, 'endKontrak', e.target.value)}
                            disabled={modalMode === 'view'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Keterangan
                          </label>
                          <select
                            value={person.keterangan}
                            onChange={(e) => handlePersonilChange(index, 'keterangan', e.target.value)}
                            disabled={modalMode === 'view'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          >
                            <option value="BARU">BARU</option>
                            <option value="PERPANJANG">PERPANJANG</option>
                            <option value="OFF">OFF</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dosimeter Saku
                          </label>
                          <input
                            type="text"
                            value={person.dosimeterSaku}
                            onChange={(e) => handlePersonilChange(index, 'dosimeterSaku', e.target.value)}
                            disabled={modalMode === 'view'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valid Cert Dosimeter
                          </label>
                          <input
                            type="date"
                            value={person.validCertDosimeter}
                            onChange={(e) => handlePersonilChange(index, 'validCertDosimeter', e.target.value)}
                            disabled={modalMode === 'view'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Surveymeter
                          </label>
                          <input
                            type="text"
                            value={person.surveymeter}
                            onChange={(e) => handlePersonilChange(index, 'surveymeter', e.target.value)}
                            disabled={modalMode === 'view'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valid Cert Surveymeter
                          </label>
                          <input
                            type="date"
                            value={person.validCertSurveymeter}
                            onChange={(e) => handlePersonilChange(index, 'validCertSurveymeter', e.target.value)}
                            disabled={modalMode === 'view'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            TLD
                          </label>
                          <input
                            type="text"
                            value={person.tld}
                            onChange={(e) => handlePersonilChange(index, 'tld', e.target.value)}
                            disabled={modalMode === 'view'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  {modalMode === 'view' ? 'Tutup' : 'Batal'}
                </button>
                {modalMode !== 'view' && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {modalMode === 'add' ? 'Simpan' : 'Update'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Konfirmasi Hapus
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Apakah Anda yakin ingin menghapus data kamera ini? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Update Modal */}
        {showProgressModal && progressUpdateData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Update Progress Status
                </h3>
                <button
                  onClick={closeProgressModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Current Status Display */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Status:</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Kamera:</span> {progressUpdateData.kamera}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Main Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        progressUpdateData.progress.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {progressUpdateData.progress.mainStatus}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Sub Status:</span> {progressUpdateData.progress.subStatus}
                    </div>
                  </div>
                </div>

                {/* New Status Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Status
                    </label>
                    <select
  value={formData.progress.mainStatus}
  onChange={(e) => handleMainStatusChange(e.target.value)}
  disabled={modalMode === "view"}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 mb-2"
>
  <option value="Pengajuan">Pengajuan</option>
  <option value="Pelimbahan">Pelimbahan</option>
  <option value="Penghentian">Penghentian</option>
  <option value="Permohonan Izin Baru">Permohonan Izin Baru</option>
  <option value="Izin Transport">Izin Transport</option>
  <option value="Loading ISOTOP">Loading ISOTOP</option>
</select>

{/* Sub Status Select */}
<select
  value={formData.progress.subStatus || ""}
  onChange={(e) => handleSubStatusChange(e.target.value)}
  disabled={modalMode === "view"}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">-- Pilih Sub Status --</option>
  {(subStatusOptions[formData.progress.mainStatus] || []).map((opt) => (
    <option key={opt} value={opt}>
      {opt}
    </option>
  ))}
</select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="completed"
                      checked={newProgress.completed}
                      onChange={(e) => setNewProgress({
                        ...newProgress,
                        completed: e.target.checked
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
                      Mark as Completed
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={closeProgressModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleProgressUpdate}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Update Progress
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QHSEMonitoringKameraRadiographyDashboard;
