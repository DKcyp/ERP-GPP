import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ChevronUp,
  ChevronDown,
  Users,
  Calendar,
  MapPin,
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';

// Interface untuk data monitoring personnel QHSE
interface PersonnelMonitoring {
  id: number;
  no: number;
  tanggal: string;
  nomorReport: string;
  nomorSO: string;
  namaPersonel: string;
  lokasiKerja: string;
  aktivitasQHSE: string;
  status: 'Aktif' | 'Training' | 'Cuti' | 'Selesai Project';
  keterangan: string;
  periode: string; // Format: "YYYY-MM" untuk grouping
}

// Sample data monitoring personnel QHSE
const samplePersonnelData: PersonnelMonitoring[] = [
  // Januari 2025
  {
    id: 1,
    no: 1,
    tanggal: "2025-01-04",
    nomorReport: "001-00/GBP/UT/I/2025",
    nomorSO: "110-2024",
    namaPersonel: "Teguh, Didik",
    lokasiKerja: "Cilegon",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PT. Bakrie Metal Industri",
    periode: "2025-01"
  },
  {
    id: 2,
    no: 2,
    tanggal: "2025-01-06",
    nomorReport: "002-00/GBP/UT/I/2025",
    nomorSO: "134-2024",
    namaPersonel: "Aditya Padila",
    lokasiKerja: "Cilegon",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PT. Fumira",
    periode: "2025-01"
  },
  {
    id: 3,
    no: 3,
    tanggal: "2025-01-08",
    nomorReport: "003-00/GBP/UT/I/2025",
    nomorSO: "110-2024",
    namaPersonel: "Aditya Padila",
    lokasiKerja: "Cilegon",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PT. Bakrie Metal Industri",
    periode: "2025-01"
  },
  {
    id: 4,
    no: 4,
    tanggal: "2025-01-08",
    nomorReport: "004-00/GBP/UT/I/2025",
    nomorSO: "002-2025",
    namaPersonel: "Andri DM, Tuda, Dedy Budiman (Tim 1)",
    lokasiKerja: "Campaign Riser - Bravo",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PHE ONWJ (Oncall)",
    periode: "2025-01"
  },
  {
    id: 5,
    no: 5,
    tanggal: "2025-01-08",
    nomorReport: "005-00/GBP/UT/I/2025",
    nomorSO: "002-2025",
    namaPersonel: "Ahmad Fauzi, Irfan, Yosi (Tim 2)",
    lokasiKerja: "Campaign Riser - Bravo",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PHE ONWJ (Oncall)",
    periode: "2025-01"
  },
  {
    id: 6,
    no: 6,
    tanggal: "2025-01-20",
    nomorReport: "006-00/GBP/UT/I/2025",
    nomorSO: "110-2024",
    namaPersonel: "Riski Mafidona",
    lokasiKerja: "Cilegon",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PT. Bakrie Metal Industri",
    periode: "2025-01"
  },
  {
    id: 7,
    no: 7,
    tanggal: "2025-01-24",
    nomorReport: "007-00/GBP/UT/I/2025",
    nomorSO: "115-2024",
    namaPersonel: "Riski Sulaib",
    lokasiKerja: "PH 3",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PT. Freyssinet Total Technology",
    periode: "2025-01"
  },
  {
    id: 8,
    no: 8,
    tanggal: "2025-01-27",
    nomorReport: "008-00/GBP/UT/I/2025",
    nomorSO: "078-2024",
    namaPersonel: "Riski Mafidona",
    lokasiKerja: "Madura",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "HCML",
    periode: "2025-01"
  },
  // Februari 2025
  {
    id: 9,
    no: 9,
    tanggal: "2025-02-03",
    nomorReport: "009-00/GBP/UT/II/2025",
    nomorSO: "110-2024",
    namaPersonel: "Olga Mahsa",
    lokasiKerja: "Cilegon",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PT. Bakrie Metal Industri",
    periode: "2025-02"
  },
  {
    id: 10,
    no: 10,
    tanggal: "2025-02-03",
    nomorReport: "010-00/GBP/UT/II/2025",
    nomorSO: "010-2025",
    namaPersonel: "Olga Mahsa",
    lokasiKerja: "Mangga Besar",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "CV. Tawakkal Indo Buana Mas",
    periode: "2025-02"
  },
  {
    id: 11,
    no: 11,
    tanggal: "2025-02-10",
    nomorReport: "011-00/GBP/UT/II/2025",
    nomorSO: "013-2025",
    namaPersonel: "Edi Kusnaedi",
    lokasiKerja: "ENGINEERING PLO RISER boat dock",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PHE ONWJ (Oncall)",
    periode: "2025-02"
  },
  {
    id: 12,
    no: 12,
    tanggal: "2025-02-12",
    nomorReport: "012-00/GBP/UT/II/2025",
    nomorSO: "015-2025",
    namaPersonel: "Arhisma",
    lokasiKerja: "Mothballed under MMP",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Training",
    keterangan: "PHE ONWJ (Oncall)",
    periode: "2025-02"
  },
  // Maret 2025
  {
    id: 13,
    no: 13,
    tanggal: "2025-03-14",
    nomorReport: "013-00/GBP/UT/III/2025",
    nomorSO: "016-2025",
    namaPersonel: "Hikmatui Ulum",
    lokasiKerja: "PH 2",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PT. Freyssinet",
    periode: "2025-03"
  },
  {
    id: 14,
    no: 14,
    tanggal: "2025-03-14",
    nomorReport: "014-00/GBP/UT/III/2025",
    nomorSO: "051-2020-643",
    namaPersonel: "Helmi, Agus Paryanto",
    lokasiKerja: "RBI PAPA",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PHE ONWJ",
    periode: "2025-03"
  },
  {
    id: 15,
    no: 15,
    tanggal: "2025-03-21",
    nomorReport: "015-00/GBP/UT/III/2025",
    nomorSO: "132-2024",
    namaPersonel: "Rahardiansyah, Riski Mafidona",
    lokasiKerja: "Riau, Kab. Meranti Offshore",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "ONCALL",
    periode: "2025-03"
  },
  {
    id: 16,
    no: 16,
    tanggal: "2025-03-21",
    nomorReport: "016-00/GBP/UT/III/2025",
    nomorSO: "132-2024",
    namaPersonel: "Rahardiansyah, Riski Mafidona (UT Painting)",
    lokasiKerja: "Riau, Kab. Meranti Offshore",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Selesai Project",
    keterangan: "ONCALL",
    periode: "2025-03"
  },
  // April 2025
  {
    id: 17,
    no: 17,
    tanggal: "2025-04-14",
    nomorReport: "017-00/GBP/UT/III/2025",
    nomorSO: "051-2020-647",
    namaPersonel: "Helmi",
    lokasiKerja: "PAPA",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PHE ONWJ",
    periode: "2025-04"
  },
  {
    id: 18,
    no: 18,
    tanggal: "2025-04-20",
    nomorReport: "018-00/GBP/UT/III/2025",
    nomorSO: "029-2025",
    namaPersonel: "Edi Kusnaedi",
    lokasiKerja: "PT. Applus",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "ONCALL",
    periode: "2025-04"
  },
  {
    id: 19,
    no: 19,
    tanggal: "2025-04-21",
    nomorReport: "019-00/GBP/UT/III/2025",
    nomorSO: "029-2025",
    namaPersonel: "Ahmad Hidayat, Dede Syahroni, Hikmatui Ulum",
    lokasiKerja: "BELANAK",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Training",
    keterangan: "MEDCO",
    periode: "2025-04"
  },
  {
    id: 20,
    no: 20,
    tanggal: "2025-04-25",
    nomorReport: "020-00/GBP/UT/III/2025",
    nomorSO: "029-2025",
    namaPersonel: "Suhartono",
    lokasiKerja: "PT. FUMIRA",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "ONCALL",
    periode: "2025-04"
  },
  // Mei 2025
  {
    id: 21,
    no: 21,
    tanggal: "2025-05-04",
    nomorReport: "021-00/GBP/UT/IV/2025",
    nomorSO: "051-2020-650",
    namaPersonel: "Suhartono",
    lokasiKerja: "CRANE UNIFORM",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PHE ONWJ",
    periode: "2025-05"
  },
  {
    id: 22,
    no: 22,
    tanggal: "2025-05-10",
    nomorReport: "022-00/GBP/UT/IV/2025",
    nomorSO: "035-2025",
    namaPersonel: "Rio S. Jujum",
    lokasiKerja: "Madura",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "HCML",
    periode: "2025-05"
  },
  {
    id: 23,
    no: 23,
    tanggal: "2025-05-11",
    nomorReport: "023-00/GBP/UT/IV/2025",
    nomorSO: "032-2025",
    namaPersonel: "Yudha, Aditya Padila, Helmi",
    lokasiKerja: "MGI",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "PHE ONWJ",
    periode: "2025-05"
  },
  {
    id: 24,
    no: 24,
    tanggal: "2025-05-25",
    nomorReport: "024-00/GBP/UT/IV/2025",
    nomorSO: "050-2024-194",
    namaPersonel: "Suriyansyah",
    lokasiKerja: "GRISSIK",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Selesai Project",
    keterangan: "MEDCO",
    periode: "2025-05"
  },
  {
    id: 25,
    no: 25,
    tanggal: "2025-05-29",
    nomorReport: "025-00/GBP/UT/IV/2025",
    nomorSO: "049-2025",
    namaPersonel: "Yudha, Dimas",
    lokasiKerja: "North Belut",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "MEDCO NATUNA",
    periode: "2025-05"
  },
  {
    id: 26,
    no: 26,
    tanggal: "2025-05-09",
    nomorReport: "026-00/GBP/UT/V/2025",
    nomorSO: "049-2025",
    namaPersonel: "Ahmad Hidayat, Akbar Suaib, Tedi H",
    lokasiKerja: "North Belut",
    aktivitasQHSE: "Ultrasonic Testing",
    status: "Aktif",
    keterangan: "MEDCO NATUNA",
    periode: "2025-05"
  }
];

const QHSEMonitoringPersonnelReportDashboard: React.FC = () => {
  const [personnelData, setPersonnelData] = useState<PersonnelMonitoring[]>(samplePersonnelData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLokasi, setFilterLokasi] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeriode, setFilterPeriode] = useState('');
  const [sortField, setSortField] = useState<keyof PersonnelMonitoring>('tanggal');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelMonitoring | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<PersonnelMonitoring>>({
    tanggal: '',
    nomorReport: '',
    nomorSO: '',
    namaPersonel: '',
    lokasiKerja: '',
    aktivitasQHSE: '',
    status: 'Aktif',
    keterangan: '',
    periode: ''
  });

  // Format tanggal ke format Indonesia
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-100 border-green-200';
      case 'Training':
        return 'bg-yellow-100 border-yellow-200';
      case 'Cuti':
        return 'bg-blue-100 border-blue-200';
      case 'Selesai Project':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-500 text-white';
      case 'Training':
        return 'bg-yellow-500 text-white';
      case 'Cuti':
        return 'bg-blue-500 text-white';
      case 'Selesai Project':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Get unique values for filters
  const uniqueLokasi = useMemo(() => [...new Set(personnelData.map(item => item.lokasiKerja))], [personnelData]);
  const uniqueStatus = useMemo(() => [...new Set(personnelData.map(item => item.status))], [personnelData]);
  const uniquePeriode = useMemo(() => [...new Set(personnelData.map(item => item.periode))].sort().reverse(), [personnelData]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = personnelData.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.namaPersonel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lokasiKerja.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.aktivitasQHSE.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nomorReport.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLokasi = filterLokasi === '' || item.lokasiKerja === filterLokasi;
      const matchesStatus = filterStatus === '' || item.status === filterStatus;
      const matchesPeriode = filterPeriode === '' || item.periode === filterPeriode;
      
      return matchesSearch && matchesLokasi && matchesStatus && matchesPeriode;
    });

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [personnelData, searchTerm, filterLokasi, filterStatus, filterPeriode, sortField, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Statistics
  const statistics = useMemo(() => {
    const total = filteredData.length;
    const aktif = filteredData.filter(item => item.status === 'Aktif').length;
    const training = filteredData.filter(item => item.status === 'Training').length;
    const selesai = filteredData.filter(item => item.status === 'Selesai Project').length;
    
    return { total, aktif, training, selesai };
  }, [filteredData]);

  // CRUD Functions
  const openAddModal = () => {
    setFormData({
      tanggal: '',
      nomorReport: '',
      nomorSO: '',
      namaPersonel: '',
      lokasiKerja: '',
      aktivitasQHSE: '',
      status: 'Aktif',
      keterangan: '',
      periode: ''
    });
    setModalMode('add');
    setShowModal(true);
  };

  const openEditModal = (personnel: PersonnelMonitoring) => {
    setFormData(personnel);
    setSelectedPersonnel(personnel);
    setModalMode('edit');
    setShowModal(true);
  };

  const openViewModal = (personnel: PersonnelMonitoring) => {
    setFormData(personnel);
    setSelectedPersonnel(personnel);
    setModalMode('view');
    setShowModal(true);
  };

  const handleInputChange = (field: keyof PersonnelMonitoring, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate periode from tanggal
      if (field === 'tanggal' && value) {
        const date = new Date(value);
        updated.periode = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      
      return updated;
    });
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      const newId = Math.max(...personnelData.map(p => p.id)) + 1;
      const newNo = personnelData.length + 1;
      const newPersonnel: PersonnelMonitoring = {
        ...formData as PersonnelMonitoring,
        id: newId,
        no: newNo
      };
      setPersonnelData(prev => [...prev, newPersonnel]);
    } else if (modalMode === 'edit' && selectedPersonnel) {
      setPersonnelData(prev => 
        prev.map(p => p.id === selectedPersonnel.id ? { ...formData as PersonnelMonitoring, id: selectedPersonnel.id } : p)
      );
    }
    setShowModal(false);
  };

  const handleDelete = (personnel: PersonnelMonitoring) => {
    setSelectedPersonnel(personnel);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedPersonnel) {
      setPersonnelData(prev => prev.filter(p => p.id !== selectedPersonnel.id));
      setShowDeleteConfirm(false);
      setSelectedPersonnel(null);
    }
  };

  const handleSort = (field: keyof PersonnelMonitoring) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* <HardHat className="h-8 w-8 text-blue-600" /> */}
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                  REPORT – MONITORING PERSONNEL QHSE
                </h1>
              </div>
              <nav className="text-sm text-gray-600">
                <span>Dashboard</span> <span className="mx-2">›</span>
                <span>QHSE</span> <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring Personnel QHSE</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari personel, lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Filter Lokasi */}
              <select
                value={filterLokasi}
                onChange={(e) => setFilterLokasi(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Semua Lokasi</option>
                {uniqueLokasi.map(lokasi => (
                  <option key={lokasi} value={lokasi}>{lokasi}</option>
                ))}
              </select>

              {/* Filter Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Semua Status</option>
                {uniqueStatus.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {/* Filter Periode */}
              <select
                value={filterPeriode}
                onChange={(e) => setFilterPeriode(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Semua Periode</option>
                {uniquePeriode.map(periode => (
                  <option key={periode} value={periode}>
                    {formatDate(periode + '-01').split(' ').slice(1).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              {/* Export Buttons */}
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="h-4 w-4" />
                Excel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Download className="h-4 w-4" />
                PDF
              </button>
              
              {/* Add Button */}
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Report
              </button>
            </div>
          </div>
        </div>


        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-white-500 text-dark">
                <tr>
                  <th className="px-4 py-3 border border-gray-400 text-left font-semibold">
                    <button onClick={() => handleSort('no')} className="flex items-center gap-1 hover:text-orange-100">
                      No
                      {sortField === 'no' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 border border-gray-400 text-left font-semibold">
                    <button onClick={() => handleSort('tanggal')} className="flex items-center gap-1 hover:text-orange-100">
                      Tanggal
                      {sortField === 'tanggal' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 border border-gray-400 text-left font-semibold">Nomor Report</th>
                  <th className="px-4 py-3 border border-gray-400 text-left font-semibold">Nomor SO/Project</th>
                  <th className="px-4 py-3 border border-gray-400 text-left font-semibold">Nama Personel</th>
                  <th className="px-4 py-3 border border-gray-400 text-left font-semibold">Lokasi Kerja</th>
                  <th className="px-4 py-3 border border-gray-400 text-left font-semibold">Aktivitas/Tugas QHSE</th>
                  <th className="px-4 py-3 border border-gray-400 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 border border-gray-400 text-left font-semibold">Keterangan</th>
                  <th className="px-4 py-3 border border-gray-400 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index, arr) => {
                  const showMonth = index === 0 || item.periode !== arr[index - 1]?.periode;
                  const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

                  return (
                    <React.Fragment key={item.id}>
                      {showMonth && (
                        <tr>
                          <td colSpan={10} className="bg-orange-300 text-center font-bold border border-gray-400 py-2 text-orange-900">
                            {formatDate(item.periode + '-01').split(' ').slice(1).join(' ')}
                          </td>
                        </tr>
                      )}
                      <tr className={`${rowClass} ${getStatusColor(item.status)} hover:bg-orange-50 transition-colors`}>
                        <td className="px-4 py-3 border border-gray-300 text-center font-medium">{item.no}</td>
                        <td className="px-4 py-3 border border-gray-300">{formatDate(item.tanggal)}</td>
                        <td className="px-4 py-3 border border-gray-300 font-mono text-xs">{item.nomorReport}</td>
                        <td className="px-4 py-3 border border-gray-300">{item.nomorSO}</td>
                        <td className="px-4 py-3 border border-gray-300 font-medium">{item.namaPersonel}</td>
                        <td className="px-4 py-3 border border-gray-300">{item.lokasiKerja}</td>
                        <td className="px-4 py-3 border border-gray-300">{item.aktivitasQHSE}</td>
                        <td className="px-4 py-3 border border-gray-300">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 border border-gray-300">{item.keterangan}</td>
                        <td className="px-4 py-3 border border-gray-300">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openViewModal(item)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
              </span>
              
              <div className="flex gap-1 ml-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <span className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
                  {currentPage}
                </span>
                <button
                  disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                  onClick={() => setCurrentPage(Math.ceil(filteredData.length / itemsPerPage))}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'add' ? 'Add New Report' : modalMode === 'edit' ? 'Edit Report' : 'View Report'}
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={formData.tanggal || ''}
                      onChange={(e) => handleInputChange('tanggal', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Report</label>
                    <input
                      type="text"
                      value={formData.nomorReport || ''}
                      onChange={(e) => handleInputChange('nomorReport', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="001-00/GBP/UT/I/2025"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor SO/Project</label>
                    <input
                      type="text"
                      value={formData.nomorSO || ''}
                      onChange={(e) => handleInputChange('nomorSO', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="110-2024"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status || 'Aktif'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Training">Training</option>
                      <option value="Cuti">Cuti</option>
                      <option value="Selesai Project">Selesai Project</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Personel</label>
                  <input
                    type="text"
                    value={formData.namaPersonel || ''}
                    onChange={(e) => handleInputChange('namaPersonel', e.target.value)}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Nama lengkap personel"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Kerja</label>
                  <input
                    type="text"
                    value={formData.lokasiKerja || ''}
                    onChange={(e) => handleInputChange('lokasiKerja', e.target.value)}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Lokasi tempat kerja"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aktivitas/Tugas QHSE</label>
                  <input
                    type="text"
                    value={formData.aktivitasQHSE || ''}
                    onChange={(e) => handleInputChange('aktivitasQHSE', e.target.value)}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Jenis aktivitas QHSE"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea
                    value={formData.keterangan || ''}
                    onChange={(e) => handleInputChange('keterangan', e.target.value)}
                    disabled={modalMode === 'view'}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Keterangan tambahan"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    {modalMode === 'add' ? 'Add Report' : 'Update Report'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedPersonnel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the report for <strong>{selectedPersonnel.namaPersonel}</strong>? 
                  This action cannot be undone.
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QHSEMonitoringPersonnelReportDashboard;
