import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, Trash2, Download, Settings, Calendar, Filter, PlusCircle, Pencil, Upload } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface AlatUkurItem {
  id: string;
  equipmentName: string;
  spec: string;
  merk: string;
  type: string;
  serialNumber: string;
  calibrationDate: string;
  validationDate: string;
  vendorCalibration: string;
  notes: string;
  status: 'QC PASSED' | 'QC FAILED' | 'QUARANTINE';
  position: string;
  detailLocation: string;
  daysUntilExpiry?: number;
  isExpiringSoon?: boolean;
}

const QHSEDaftarAlatUkurDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPosition, setFilterPosition] = useState<string>('');
  const [filterMerk, setFilterMerk] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterSpec, setFilterSpec] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AlatUkurItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<AlatUkurItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [formData, setFormData] = useState<Partial<AlatUkurItem>>({});

  // Function to calculate days until expiry
  const calculateDaysUntilExpiry = (validationDate: string): number => {
    if (!validationDate) return 0;
    
    // Parse date in format "DD MMM YY" (e.g., "20 Jan 25")
    const today = new Date();
    const [day, month, year] = validationDate.split(' ');
    const monthMap: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
    const expiryDate = new Date(fullYear, monthMap[month], parseInt(day));
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Sample data with user-specified Spec values for testing and inspection methods
  const [alatUkurData, setAlatUkurData] = useState<AlatUkurItem[]>([
    {
      id: '1',
      equipmentName: 'MT Equipment',
      spec: 'MT',
      merk: 'Magnaflux',
      type: 'Y-7',
      serialNumber: 'MT001',
      calibrationDate: '20 Jan 25',
      validationDate: '20 Jan 26',
      vendorCalibration: 'PT Kalibrasi Indonesia',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '2',
      equipmentName: 'PT Penetrant Kit',
      spec: 'PT',
      merk: 'Sherwin',
      type: 'SKL-SP2',
      serialNumber: 'PT001',
      calibrationDate: '15 Jan 25',
      validationDate: '15 Jan 26',
      vendorCalibration: 'PT Sucofindo',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '3',
      equipmentName: 'RT X-Ray Machine',
      spec: 'RT',
      merk: 'Yxlon',
      type: 'Y.TU 320-D03',
      serialNumber: 'RT001',
      calibrationDate: '23 Jan 25',
      validationDate: '23 Jan 26',
      vendorCalibration: 'PT Sucofindo',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '4',
      equipmentName: 'UT Thickness Gauge',
      spec: 'UT',
      merk: 'GE',
      type: 'DM5E',
      serialNumber: 'UT001',
      calibrationDate: '10 Feb 25',
      validationDate: '10 Feb 26',
      vendorCalibration: 'PT Kalibrasi Indonesia',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '5',
      equipmentName: 'Multi NDT Equipment',
      spec: 'All',
      merk: 'Olympus',
      type: 'OmniScan MX2',
      serialNumber: 'ALL001',
      calibrationDate: '04 Jan 25',
      validationDate: '04 Jan 26',
      vendorCalibration: 'PT Sucofindo',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '6',
      equipmentName: 'Load Testing Machine',
      spec: 'Load Test',
      merk: 'Instron',
      type: '5982',
      serialNumber: 'LT001',
      calibrationDate: '12 Dec 24',
      validationDate: '11 Dec 25',
      vendorCalibration: 'PT Kalibrasi Mandiri',
      notes: '',
      status: 'QC PASSED',
      position: 'MEDCO',
      detailLocation: ''
    },
    {
      id: '7',
      equipmentName: 'Hardness Tester MH6-24F',
      spec: 'MH6-24F',
      merk: 'Mitutoyo',
      type: 'HM-124',
      serialNumber: 'MH001',
      calibrationDate: '15 Jan 25',
      validationDate: '15 Jan 26',
      vendorCalibration: 'PT Sucofindo',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '8',
      equipmentName: 'Intron Testing Machine',
      spec: 'Intron MH 20-30',
      merk: 'Instron',
      type: 'MH 20-30',
      serialNumber: 'INT001',
      calibrationDate: '05 Jan 25',
      validationDate: '15 Jan 26',
      vendorCalibration: 'PT Sucofindo',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '9',
      equipmentName: 'PMI Analyzer',
      spec: 'PMI',
      merk: 'Olympus',
      type: 'Vanta Element',
      serialNumber: 'PMI001',
      calibrationDate: '01 Nov 24',
      validationDate: '31 Oct 25',
      vendorCalibration: 'PT Kalibrasi Mandiri',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '10',
      equipmentName: 'Drop Cell Tester',
      spec: 'Drop Cell',
      merk: 'Lansmont',
      type: 'PDT-176E',
      serialNumber: 'DC001',
      calibrationDate: '25 Sep 24',
      validationDate: '24 Sep 25',
      vendorCalibration: 'PT Kalibrasi Mandiri',
      notes: '',
      status: 'QC PASSED',
      position: 'MEDCO',
      detailLocation: 'SUBAN'
    },
    {
      id: '11',
      equipmentName: 'RFIT Equipment',
      spec: 'RFIT',
      merk: 'Zetec',
      type: 'MIZ-85',
      serialNumber: 'RF001',
      calibrationDate: '19 Aug 25',
      validationDate: '18 Aug 26',
      vendorCalibration: 'PT Sucofindo',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '12',
      equipmentName: 'Eddy Current Tester',
      spec: 'Eddy Curent',
      merk: 'Olympus',
      type: 'Nortec 600',
      serialNumber: 'EC001',
      calibrationDate: '19 Sep 24',
      validationDate: '19 Sep 25',
      vendorCalibration: 'PT Kalibrasi Indonesia',
      notes: '',
      status: 'QC PASSED',
      position: 'PHE ONWJ',
      detailLocation: 'UT BRAVO'
    },
    {
      id: '13',
      equipmentName: 'Boroscope Camera',
      spec: 'Boroscope',
      merk: 'Olympus',
      type: 'IPLEX NX',
      serialNumber: 'BS001',
      calibrationDate: '19 Aug 25',
      validationDate: '19 Aug 26',
      vendorCalibration: 'PT Sucofindo',
      notes: '',
      status: 'QC PASSED',
      position: 'PHE ONWJ',
      detailLocation: 'AWPI ZULU'
    },
    {
      id: '14',
      equipmentName: 'Hardness Tester',
      spec: 'Hardness',
      merk: 'Mitutoyo',
      type: 'HV-120',
      serialNumber: 'HD001',
      calibrationDate: '11 Dec 24',
      validationDate: '10 Oct 25',
      vendorCalibration: 'PT Kalibrasi Indonesia',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '15',
      equipmentName: 'Infrared Thermograph',
      spec: 'Infrared Thermograph',
      merk: 'FLIR',
      type: 'E75',
      serialNumber: 'IR001',
      calibrationDate: '15 Jan 25',
      validationDate: '15 Jan 26',
      vendorCalibration: 'PT Sucofindo',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '16',
      equipmentName: 'Painting Equipment',
      spec: 'Painting',
      merk: 'Graco',
      type: 'Ultra Max II 1595',
      serialNumber: 'PT001',
      calibrationDate: '10 Feb 25',
      validationDate: '09 Feb 26',
      vendorCalibration: 'PT Kalibrasi Indonesia',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    },
    {
      id: '17',
      equipmentName: 'Hydrotest Equipment',
      spec: 'Hydrotest / Leaktest',
      merk: 'Haskel',
      type: 'DSF-122',
      serialNumber: 'HT001',
      calibrationDate: '05 Mar 25',
      validationDate: '05 Mar 26',
      vendorCalibration: 'PT Kalibrasi Mandiri',
      notes: '',
      status: 'QC PASSED',
      position: 'MEDCO',
      detailLocation: ''
    },
    {
      id: '18',
      equipmentName: 'Hydrostatic Tester',
      spec: 'Hydrotest',
      merk: 'Rice Lake',
      type: 'HT-5000',
      serialNumber: 'HY001',
      calibrationDate: '20 Mar 25',
      validationDate: '20 Mar 26',
      vendorCalibration: 'PT Sucofindo',
      notes: '',
      status: 'QC PASSED',
      position: 'PHE ONWJ',
      detailLocation: ''
    }
  ]);

  // Initialize expiry calculations on component mount
  useEffect(() => {
    setAlatUkurData(prevData => 
      prevData.map(item => {
        const daysUntilExpiry = calculateDaysUntilExpiry(item.validationDate);
        return {
          ...item,
          daysUntilExpiry,
          isExpiringSoon: daysUntilExpiry <= 60
        };
      })
    );
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAlat = alatUkurData.length;
    const qcPassed = alatUkurData.filter(item => item.status === 'QC PASSED').length;
    const qcFailed = alatUkurData.filter(item => item.status === 'QC FAILED').length;
    const quarantine = alatUkurData.filter(item => item.status === 'QUARANTINE').length;
    const expiringSoon = alatUkurData.filter(item => item.daysUntilExpiry && item.daysUntilExpiry <= 60).length;
    const needsCalibration = alatUkurData.filter(item => (item.daysUntilExpiry || 0) <= 60).length;

    return {
      totalAlat,
      qcPassed,
      qcFailed,
      quarantine,
      expiringSoon,
      needsCalibration
    };
  }, [alatUkurData]);

  // Filter data
  const filteredData = useMemo(() => {
    return alatUkurData.filter(item => {
      const matchesSearch = 
        item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.calibrationDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.validationDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.detailLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendorCalibration.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || item.status === filterStatus;
      const matchesPosition = !filterPosition || item.position === filterPosition;
      const matchesMerk = !filterMerk || item.merk === filterMerk;
      const matchesType = !filterType || item.type === filterType;
      const matchesSpec = !filterSpec || item.spec === filterSpec;

      return matchesSearch && matchesStatus && matchesPosition && matchesMerk && matchesType && matchesSpec;
    });
  }, [alatUkurData, searchTerm, filterStatus, filterPosition, filterMerk, filterType, filterSpec]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'QC PASSED': return `${baseClasses} bg-green-100 text-green-800`;
      case 'QC FAILED': return `${baseClasses} bg-red-100 text-red-800`;
      case 'QUARANTINE': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getExpiryBadge = (daysUntilExpiry: number) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    if (daysUntilExpiry <= 0) {
      return `${baseClasses} bg-red-100 text-red-800`;
    } else if (daysUntilExpiry <= 30) {
      return `${baseClasses} bg-orange-100 text-orange-800`;
    } else if (daysUntilExpiry <= 60) {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
  };

  const formatExpiryText = (daysUntilExpiry: number) => {
    if (daysUntilExpiry <= 0) {
      return 'Expired';
    } else if (daysUntilExpiry <= 30) {
      return `${daysUntilExpiry} hari lagi`;
    } else if (daysUntilExpiry <= 60) {
      return `${daysUntilExpiry} hari lagi`;
    } else {
      return `${daysUntilExpiry} hari lagi`;
    }
  };

  // CRUD Functions
  const openAddModal = () => {
    setFormData({
      equipmentName: '',
      spec: '',
      merk: '',
      type: '',
      serialNumber: '',
      calibrationDate: '',
      validationDate: '',
      vendorCalibration: 'PT Kalibrasi Indonesia',
      notes: '',
      status: 'QC PASSED',
      position: '',
      detailLocation: ''
    });
    setModalMode('add');
    setShowAddModal(true);
  };

  const openEditModal = (item: AlatUkurItem) => {
    setFormData(item);
    setEditingItem(item);
    setModalMode('edit');
    setShowAddModal(true);
  };

  const openViewModal = (item: AlatUkurItem) => {
    setFormData(item);
    setEditingItem(item);
    setModalMode('view');
    setShowAddModal(true);
  };

  const handleInputChange = (field: keyof AlatUkurItem, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      const newId = (Math.max(...alatUkurData.map(item => parseInt(item.id))) + 1).toString();
      const newItem: AlatUkurItem = {
        ...formData as AlatUkurItem,
        id: newId
      };
      
      // Calculate expiry days
      if (newItem.validationDate) {
        const today = new Date();
        const expiryDate = new Date(newItem.validationDate);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        newItem.daysUntilExpiry = diffDays;
        newItem.isExpiringSoon = diffDays <= 60;
      }
      
      setAlatUkurData(prev => [...prev, newItem]);
    } else if (modalMode === 'edit' && editingItem) {
      const updatedItem = { ...formData as AlatUkurItem, id: editingItem.id };
      
      // Calculate expiry days
      if (updatedItem.validationDate) {
        const today = new Date();
        const expiryDate = new Date(updatedItem.validationDate);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        updatedItem.daysUntilExpiry = diffDays;
        updatedItem.isExpiringSoon = diffDays <= 60;
      }
      
      setAlatUkurData(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
    }
    
    setShowAddModal(false);
    setEditingItem(null);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setFormData({});
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 mb-6">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-8 w-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                  MONITORING DAFTAR ALAT UKUR
                </h1>
              </div>
              <nav className="text-sm text-gray-600">
                <span>Dashboard</span> <span className="mx-2">›</span>
                <span>QHSE</span> <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring Daftar Alat Ukur</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alat</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAlat}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">QC Passed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.qcPassed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Settings className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">QC Failed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.qcFailed}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Settings className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quarantine</p>
              <p className="text-2xl font-bold text-gray-900">{stats.quarantine}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Settings className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Calibration</p>
              <p className="text-2xl font-bold text-gray-900">{stats.needsCalibration}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari serial number, tanggal kalibrasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>

            <div className="flex gap-2">
              {/* Export Buttons */}
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="h-4 w-4" />
                Excel
              </button>
              
              {/* Add Button */}
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Add Equipment
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Semua Status</option>
                    <option value="QC PASSED">QC PASSED</option>
                    <option value="QC FAILED">QC FAILED</option>
                    <option value="QUARANTINE">QUARANTINE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
                  <select
                    value={filterPosition}
                    onChange={(e) => setFilterPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Semua Posisi</option>
                    <option value="Warehouse Jakarta">Warehouse Jakarta</option>
                    <option value="MEDCO">MEDCO</option>
                    <option value="PHE ONWJ">PHE ONWJ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Merk</label>
                  <select
                    value={filterMerk}
                    onChange={(e) => setFilterMerk(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Semua Merk</option>
                    <option value="Fluke">Fluke</option>
                    <option value="Ashcroft">Ashcroft</option>
                    <option value="Omega">Omega</option>
                    <option value="Endress+Hauser">Endress+Hauser</option>
                    <option value="GE">GE</option>
                    <option value="SKF">SKF</option>
                    <option value="Norbar">Norbar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Semua Type</option>
                    <option value="87V">87V</option>
                    <option value="MP 9938">MP 9938</option>
                    <option value="MP 9941">MP 9941</option>
                    <option value="RTD">RTD</option>
                    <option value="MP 2428">MP 2428</option>
                    <option value="PMV/B13">PMV/B13</option>
                    <option value="DM5E">DM5E</option>
                    <option value="CMVA65">CMVA65</option>
                    <option value="TTi 1000">TTi 1000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spec</label>
                  <select
                    value={filterSpec}
                    onChange={(e) => setFilterSpec(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Semua Spec</option>
                    <option value="MT">MT</option>
                    <option value="PT">PT</option>
                    <option value="RT">RT</option>
                    <option value="UT">UT</option>
                    <option value="All">All</option>
                    <option value="Load Test">Load Test</option>
                    <option value="MH6-24F">MH6-24F</option>
                    <option value="Intron MH 20-30">Intron MH 20-30</option>
                    <option value="PMI">PMI</option>
                    <option value="Drop Cell">Drop Cell</option>
                    <option value="RFIT">RFIT</option>
                    <option value="Eddy Curent">Eddy Curent</option>
                    <option value="Boroscope">Boroscope</option>
                    <option value="Hardness">Hardness</option>
                    <option value="Infrared Thermograph">Infrared Thermograph</option>
                    <option value="Painting">Painting</option>
                    <option value="Hydrotest / Leaktest">Hydrotest / Leaktest</option>
                    <option value="Hydrotest">Hydrotest</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterStatus('');
                      setFilterPosition('');
                      setFilterMerk('');
                      setFilterType('');
                      setFilterSpec('');
                    }}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Data Table */}
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spec</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calibration Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validation Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Calibration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* Nomor Urut */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index+1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.equipmentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.spec}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.merk}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.serialNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.calibrationDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.validationDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vendorCalibration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(item.status)}>{item.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.daysUntilExpiry !== undefined && (
                        <span className={getExpiryBadge(item.daysUntilExpiry)}>
                          {formatExpiryText(item.daysUntilExpiry)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.detailLocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="text-orange-600 hover:text-orange-900"
                          title="Upload Certificate"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteItem(item)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <ConfirmDeleteModal
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => {
            setAlatUkurData(prev => prev.filter(item => item.id !== deleteItem.id));
            setDeleteItem(null);
          }}
          title="Hapus Alat Ukur"
          message={`Apakah Anda yakin ingin menghapus alat ukur "${deleteItem.serialNumber}"?`}
        />
      )}

      {/* Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalMode === 'add' ? 'Add New Equipment' : modalMode === 'edit' ? 'Edit Equipment' : 'View Equipment'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
                    <input
                      type="text"
                      value={formData.equipmentName || ''}
                      onChange={(e) => handleInputChange('equipmentName', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="Digital Multimeter"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spec</label>
                    <select
                      value={formData.spec || ''}
                      onChange={(e) => handleInputChange('spec', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Pilih Spec</option>
                      <option value="MT">MT</option>
                      <option value="PT">PT</option>
                      <option value="RT">RT</option>
                      <option value="UT">UT</option>
                      <option value="All">All</option>
                      <option value="Load Test">Load Test</option>
                      <option value="MH6-24F">MH6-24F</option>
                      <option value="Intron MH 20-30">Intron MH 20-30</option>
                      <option value="PMI">PMI</option>
                      <option value="Drop Cell">Drop Cell</option>
                      <option value="RFIT">RFIT</option>
                      <option value="Eddy Curent">Eddy Curent</option>
                      <option value="Boroscope">Boroscope</option>
                      <option value="Hardness">Hardness</option>
                      <option value="Infrared Thermograph">Infrared Thermograph</option>
                      <option value="Painting">Painting</option>
                      <option value="Hydrotest / Leaktest">Hydrotest / Leaktest</option>
                      <option value="Hydrotest">Hydrotest</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merk</label>
                    <input
                      type="text"
                      value={formData.merk || ''}
                      onChange={(e) => handleInputChange('merk', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="Fluke"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <input
                      type="text"
                      value={formData.type || ''}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="87V"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                    <input
                      type="text"
                      value={formData.serialNumber || ''}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="44540"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calibration Date</label>
                    <input
                      type="text"
                      value={formData.calibrationDate || ''}
                      onChange={(e) => handleInputChange('calibrationDate', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="20 Jan 25"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Validation Date</label>
                    <input
                      type="text"
                      value={formData.validationDate || ''}
                      onChange={(e) => handleInputChange('validationDate', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="20 Jan 26"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Calibration</label>
                    <input
                      type="text"
                      value={formData.vendorCalibration || ''}
                      onChange={(e) => handleInputChange('vendorCalibration', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="PT Kalibrasi Indonesia"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status || 'QC PASSED'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="QC PASSED">QC PASSED</option>
                      <option value="QC FAILED">QC FAILED</option>
                      <option value="QUARANTINE">QUARANTINE</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <select
                      value={formData.position || ''}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Pilih Posisi</option>
                      <option value="Warehouse Jakarta">Warehouse Jakarta</option>
                      <option value="MEDCO">MEDCO</option>
                      <option value="PHE ONWJ">PHE ONWJ</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detail Location</label>
                    <input
                      type="text"
                      value={formData.detailLocation || ''}
                      onChange={(e) => handleInputChange('detailLocation', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder=""
                    />
                  </div>
                  

                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {modalMode !== 'view' && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {modalMode === 'add' ? 'Add Equipment' : 'Update Equipment'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEDaftarAlatUkurDashboard;
