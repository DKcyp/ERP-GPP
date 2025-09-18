import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Eye, Trash2, Download, Settings, Calendar, Filter, PlusCircle, Pencil, Upload } from 'lucide-react';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AlatUkurItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<AlatUkurItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [formData, setFormData] = useState<Partial<AlatUkurItem>>({});

  // Sample data matching the image
  const [alatUkurData, setAlatUkurData] = useState<AlatUkurItem[]>([
    {
      id: '1',
      equipmentName: 'Digital Multimeter',
      spec: 'AC/DC Voltage 1000V',
      merk: 'Fluke',
      type: '87V',
      serialNumber: '44540',
      calibrationDate: '20 Jan 25',
      validationDate: '20 Jan 26',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: ''
    },
    {
      id: '2',
      equipmentName: 'Pressure Gauge',
      spec: '0-100 PSI',
      merk: 'Ashcroft',
      type: 'MP 9938',
      serialNumber: 'MP 9938',
      calibrationDate: '15 Jan 25',
      validationDate: '15 Jan 26',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: ''
    },
    {
      id: '3',
      equipmentName: 'Pressure Gauge',
      spec: '0-150 PSI',
      merk: 'Ashcroft',
      type: 'MP 9941',
      serialNumber: 'MP 9941',
      calibrationDate: '23 Jan 25',
      validationDate: '23 Jan 26',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: ''
    },
    {
      id: '4',
      equipmentName: 'Temperature Sensor',
      spec: '-50°C to 200°C',
      merk: 'Omega',
      type: 'RTD',
      serialNumber: '10901',
      calibrationDate: '',
      validationDate: '',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: ''
    },
    {
      id: '5',
      equipmentName: 'Pressure Gauge',
      spec: '0-200 PSI',
      merk: 'Ashcroft',
      type: 'MP 2428',
      serialNumber: 'MP 2428',
      calibrationDate: '04 Jan 25',
      validationDate: '04 Jan 26',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: ''
    },
    {
      id: '6',
      equipmentName: 'Flow Meter',
      spec: '0-100 GPM',
      merk: 'Endress+Hauser',
      type: 'PMV/B13',
      serialNumber: 'PMV/B13 (NA)',
      calibrationDate: '12 Dec 24',
      validationDate: '11 Dec 25',
      notes: '',
      status: 'QC PASSED',
      position: 'MEDCO',
      detailLocation: ''
    },
    {
      id: '7',
      equipmentName: 'Ultrasonic Thickness Gauge',
      spec: '0.5-300mm',
      merk: 'GE',
      type: 'DM5E',
      serialNumber: '18026 (GBP-02)',
      calibrationDate: '15 Jan 25',
      validationDate: '15 Jan 26',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: ''
    },
    {
      id: '8',
      equipmentName: 'Ultrasonic Thickness Gauge',
      spec: '0.5-300mm',
      merk: 'GE',
      type: 'DM5E',
      serialNumber: '18025 (GBP-03)',
      calibrationDate: '05 Jan 25',
      validationDate: '05 Jan 26',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: ''
    },
    {
      id: '9',
      equipmentName: 'Ultrasonic Thickness Gauge',
      spec: '0.5-300mm',
      merk: 'GE',
      type: 'DM5E',
      serialNumber: '18030 (GBP-04)',
      calibrationDate: '01 Nov 24',
      validationDate: '31 Oct 25',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: ''
    },
    {
      id: '10',
      equipmentName: 'Ultrasonic Thickness Gauge',
      spec: '0.5-300mm',
      merk: 'GE',
      type: 'DM5E',
      serialNumber: '18039 (GBP-05)',
      calibrationDate: '25 Sep 24',
      validationDate: '24 Sep 25',
      notes: '',
      status: 'QC PASSED',
      position: 'MEDCO',
      detailLocation: 'SUBAN'
    },
    {
      id: '11',
      equipmentName: 'Vibration Meter',
      spec: '10Hz-10kHz',
      merk: 'SKF',
      type: 'CMVA65',
      serialNumber: '1062',
      calibrationDate: '19 Aug 25',
      validationDate: '18 Aug 26',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: ''
    },
    {
      id: '12',
      equipmentName: 'Torque Wrench',
      spec: '50-500 Nm',
      merk: 'Norbar',
      type: 'TTi 1000',
      serialNumber: '4601',
      calibrationDate: '19 Sep 24',
      validationDate: '19 Sep 25',
      notes: '',
      status: 'QC PASSED',
      position: 'PHE ONWJ',
      detailLocation: 'UT BRAVO'
    },
    {
      id: '13',
      equipmentName: 'Torque Wrench',
      spec: '50-500 Nm',
      merk: 'Norbar',
      type: 'TTi 1000',
      serialNumber: '4603',
      calibrationDate: '19 Aug 25',
      validationDate: '19 Aug 26',
      notes: '',
      status: 'QC PASSED',
      position: 'PHE ONWJ',
      detailLocation: 'AWPI ZULU'
    },
    {
      id: '14',
      equipmentName: 'Torque Wrench',
      spec: '50-500 Nm',
      merk: 'Norbar',
      type: 'TTi 1000',
      serialNumber: '4604',
      calibrationDate: '11 Dec 24',
      validationDate: '10 Oct 25',
      notes: '',
      status: 'QC PASSED',
      position: '',
      detailLocation: ''
    },
    {
      id: '15',
      equipmentName: 'Digital Multimeter',
      spec: '1000V AC/DC',
      merk: 'Fluke',
      type: '87V',
      serialNumber: '4843',
      calibrationDate: '15 Jan 25',
      validationDate: '15 Jan 26',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: ''
    },
    {
      id: '16',
      equipmentName: 'Digital Multimeter',
      spec: '1000V AC/DC',
      merk: 'Fluke',
      type: '87V',
      serialNumber: '4844',
      calibrationDate: '10 Feb 25',
      validationDate: '09 Feb 26',
      notes: '',
      status: 'QC PASSED',
      position: 'Warehouse Jakarta',
      detailLocation: ''
    }
  ]);

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
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.calibrationDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.validationDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.detailLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pic.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || item.status === filterStatus;
      const matchesPosition = !filterPosition || item.position === filterPosition;

      return matchesSearch && matchesStatus && matchesPosition;
    });
  }, [alatUkurData, searchTerm, filterStatus, filterPosition]);

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.notes}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(item.status)}>{item.status}</span>
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
                    <input
                      type="text"
                      value={formData.spec || ''}
                      onChange={(e) => handleInputChange('spec', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="1000V AC/DC"
                    />
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
{/*                   
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <input
                      type="text"
                      value={formData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder=""
                    />
                  </div> */}
                  
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
