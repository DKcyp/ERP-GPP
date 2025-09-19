import React, { useMemo, useState } from 'react';
import { GraduationCap, Search, PlusCircle, Download, Pencil, Trash2, AlertTriangle, Bell, Eye, CheckCircle, Clock, XCircle, User, Building, ExternalLink, ChevronRight, ArrowLeft } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface TrainingDetail {
  id: string;
  namaSertifikat: string;
  noSertifikat: string;
  vendor: string;
  tanggalTerbit: string;
  tanggalExpired: string;
  validitas: 'Valid' | 'Mendekati Expired' | 'Expired';
  approval: 'Pending' | 'Approved' | 'Rejected';
  status: 'Pengajuan' | 'Proses' | 'Selesai';
  documentSertifikat?: string;
  daysUntilExpiry?: number;
  isExpiringSoon?: boolean;
}

interface PersonnelData {
  id: string;
  namaPersonil: string;
  jabatan: string;
  divisi: string;
  totalTraining: number;
  validTraining: number;
  expiredTraining: number;
  hrdSyncStatus: 'Synced' | 'Pending' | 'Failed';
  trainings: TrainingDetail[];
}

const QHSEKompetensiPersonilDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterValiditas, setFilterValiditas] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPersonnelModal, setShowAddPersonnelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TrainingDetail | null>(null);
  const [viewingItem, setViewingItem] = useState<TrainingDetail | null>(null);
  const [deleteItem, setDeleteItem] = useState<TrainingDetail | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelData | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [formData, setFormData] = useState<Partial<TrainingDetail>>({});
  const [personnelFormData, setPersonnelFormData] = useState<Partial<PersonnelData>>({});

  // Sample personnel data with training details
  const [personnelData, setPersonnelData] = useState<PersonnelData[]>([
    {
      id: '1',
      namaPersonil: 'John Doe',
      jabatan: 'Safety Officer',
      divisi: 'QHSE',
      totalTraining: 3,
      validTraining: 2,
      expiredTraining: 1,
      hrdSyncStatus: 'Synced',
      trainings: [
        {
          id: '1-1',
          namaSertifikat: 'Basic Safety Training',
          noSertifikat: 'BST-2024-001',
          vendor: 'PT Safety Indonesia',
          tanggalTerbit: '2024-01-15',
          tanggalExpired: '2025-01-15',
          validitas: 'Valid',
          approval: 'Approved',
          status: 'Selesai',
          documentSertifikat: 'cert_basic_safety_john.pdf',
          daysUntilExpiry: 120,
          isExpiringSoon: false
        },
        {
          id: '1-2',
          namaSertifikat: 'Fire Safety Certification',
          noSertifikat: 'FSC-2024-002',
          vendor: 'Fire Safety Institute',
          tanggalTerbit: '2024-02-10',
          tanggalExpired: '2025-02-10',
          validitas: 'Valid',
          approval: 'Approved',
          status: 'Selesai',
          documentSertifikat: 'cert_fire_safety_john.pdf',
          daysUntilExpiry: 145,
          isExpiringSoon: false
        },
        {
          id: '1-3',
          namaSertifikat: 'First Aid Training',
          noSertifikat: 'FAT-2023-003',
          vendor: 'Medical Training Center',
          tanggalTerbit: '2023-06-10',
          tanggalExpired: '2024-06-10',
          validitas: 'Expired',
          approval: 'Approved',
          status: 'Selesai',
          documentSertifikat: 'cert_first_aid_john.pdf',
          daysUntilExpiry: -90,
          isExpiringSoon: false
        }
      ]
    },
    {
      id: '2',
      namaPersonil: 'Jane Smith',
      jabatan: 'HSE Supervisor',
      divisi: 'QHSE',
      totalTraining: 2,
      validTraining: 1,
      expiredTraining: 0,
      hrdSyncStatus: 'Synced',
      trainings: [
        {
          id: '2-1',
          namaSertifikat: 'Confined Space Entry',
          noSertifikat: 'CSE-2024-004',
          vendor: 'Industrial Safety Corp',
          tanggalTerbit: '2024-02-28',
          tanggalExpired: '2025-02-28',
          validitas: 'Valid',
          approval: 'Approved',
          status: 'Selesai',
          documentSertifikat: 'cert_confined_space_jane.pdf',
          daysUntilExpiry: 160,
          isExpiringSoon: false
        },
        {
          id: '2-2',
          namaSertifikat: 'Working at Height',
          noSertifikat: 'WAH-2024-005',
          vendor: 'Height Safety Training',
          tanggalTerbit: '2024-03-15',
          tanggalExpired: '2024-12-15',
          validitas: 'Mendekati Expired',
          approval: 'Pending',
          status: 'Proses',
          documentSertifikat: 'cert_height_jane.pdf',
          daysUntilExpiry: 30,
          isExpiringSoon: true
        }
      ]
    },
    {
      id: '3',
      namaPersonil: 'Bob Johnson',
      jabatan: 'Field Inspector',
      divisi: 'Operations',
      totalTraining: 1,
      validTraining: 0,
      expiredTraining: 1,
      hrdSyncStatus: 'Pending',
      trainings: [
        {
          id: '3-1',
          namaSertifikat: 'NDT Level II',
          noSertifikat: 'NDT-2023-006',
          vendor: 'NDT Training Institute',
          tanggalTerbit: '2023-05-20',
          tanggalExpired: '2024-05-20',
          validitas: 'Expired',
          approval: 'Pending',
          status: 'Pengajuan',
          documentSertifikat: 'cert_ndt_bob.pdf',
          daysUntilExpiry: -120,
          isExpiringSoon: false
        }
      ]
    },
    {
      id: '4',
      namaPersonil: 'Alice Brown',
      jabatan: 'Safety Coordinator',
      divisi: 'QHSE',
      totalTraining: 4,
      validTraining: 3,
      expiredTraining: 0,
      hrdSyncStatus: 'Failed',
      trainings: [
        {
          id: '4-1',
          namaSertifikat: 'IOSH Managing Safely',
          noSertifikat: 'IOSH-2024-007',
          vendor: 'IOSH Training Provider',
          tanggalTerbit: '2024-01-10',
          tanggalExpired: '2027-01-10',
          validitas: 'Valid',
          approval: 'Approved',
          status: 'Selesai',
          documentSertifikat: 'cert_iosh_alice.pdf',
          daysUntilExpiry: 1095,
          isExpiringSoon: false
        },
        {
          id: '4-2',
          namaSertifikat: 'Risk Assessment',
          noSertifikat: 'RA-2024-008',
          vendor: 'Risk Management Institute',
          tanggalTerbit: '2024-02-15',
          tanggalExpired: '2025-02-15',
          validitas: 'Valid',
          approval: 'Approved',
          status: 'Selesai',
          documentSertifikat: 'cert_risk_alice.pdf',
          daysUntilExpiry: 150,
          isExpiringSoon: false
        },
        {
          id: '4-3',
          namaSertifikat: 'Emergency Response',
          noSertifikat: 'ER-2024-009',
          vendor: 'Emergency Training Center',
          tanggalTerbit: '2024-03-01',
          tanggalExpired: '2025-03-01',
          validitas: 'Valid',
          approval: 'Approved',
          status: 'Selesai',
          documentSertifikat: 'cert_emergency_alice.pdf',
          daysUntilExpiry: 165,
          isExpiringSoon: false
        },
        {
          id: '4-4',
          namaSertifikat: 'Incident Investigation',
          noSertifikat: 'II-2024-010',
          vendor: 'Investigation Training Ltd',
          tanggalTerbit: '2024-04-01',
          tanggalExpired: '2024-11-01',
          validitas: 'Mendekati Expired',
          approval: 'Pending',
          status: 'Proses',
          documentSertifikat: 'cert_investigation_alice.pdf',
          daysUntilExpiry: 15,
          isExpiringSoon: true
        }
      ]
    }
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPersonil = personnelData.length;
    const validCertificates = personnelData.reduce((acc, personil) => acc + personil.trainings.filter(training => training.validitas === 'Valid').length, 0);
    const mendekatiExpired = personnelData.reduce((acc, personil) => acc + personil.trainings.filter(training => training.validitas === 'Mendekati Expired').length, 0);
    const expired = personnelData.reduce((acc, personil) => acc + personil.trainings.filter(training => training.validitas === 'Expired').length, 0);
    const needsApproval = personnelData.reduce((acc, personil) => acc + personil.trainings.filter(training => training.approval === 'Pending').length, 0);
    const hrdSyncPending = personnelData.filter(personil => personil.hrdSyncStatus === 'Pending' || personil.hrdSyncStatus === 'Failed').length;
    const completed = personnelData.reduce((acc, personil) => acc + personil.trainings.filter(training => training.status === 'Selesai').length, 0);

    return {
      totalPersonil,
      validCertificates,
      mendekatiExpired,
      expired,
      needsApproval,
      hrdSyncPending,
      completed
    };
  }, [personnelData]);

  // Filter personnel data
  const filteredPersonnelData = useMemo(() => {
    return personnelData.filter(personil => {
      const matchesSearch = personil.namaPersonil.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           personil.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           personil.divisi.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by training status if specified
      const matchesStatus = !filterStatus || personil.trainings.some(training => training.status === filterStatus);
      
      // Filter by training validitas if specified
      const matchesValiditas = !filterValiditas || personil.trainings.some(training => training.validitas === filterValiditas);

      return matchesSearch && matchesStatus && matchesValiditas;
    });
  }, [personnelData, searchTerm, filterStatus, filterValiditas]);

  const getStatusBadge = (status: string, type: 'validitas' | 'approval' | 'proses' | 'sync') => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    if (type === 'validitas') {
      switch (status) {
        case 'Valid': return `${baseClasses} bg-green-100 text-green-800`;
        case 'Mendekati Expired': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'Expired': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    } else if (type === 'approval') {
      switch (status) {
        case 'Approved': return `${baseClasses} bg-green-100 text-green-800`;
        case 'Pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'Rejected': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    } else if (type === 'sync') {
      switch (status) {
        case 'Synced': return `${baseClasses} bg-green-100 text-green-800`;
        case 'Pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'Failed': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    } else {
      switch (status) {
        case 'Selesai': return `${baseClasses} bg-green-100 text-green-800`;
        case 'Proses': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'Pengajuan': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }
  };

  const getExpiryBadge = (daysUntilExpiry: number) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    if (daysUntilExpiry <= 0) {
      return `${baseClasses} bg-red-100 text-red-800`;
    } else if (daysUntilExpiry <= 30) {
      return `${baseClasses} bg-orange-100 text-orange-800`;
    } else if (daysUntilExpiry <= 90) {
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
    } else if (daysUntilExpiry <= 90) {
      return `${daysUntilExpiry} hari lagi`;
    } else {
      return `${daysUntilExpiry} hari lagi`;
    }
  };

  // CRUD Functions for Personnel
  const handleAddPersonnel = () => {
    setPersonnelFormData({
      namaPersonil: '',
      jabatan: '',
      divisi: '',
      totalTraining: 0,
      validTraining: 0,
      expiredTraining: 0,
      hrdSyncStatus: 'Pending',
      trainings: []
    });
    setShowAddPersonnelModal(true);
  };

  const handleSavePersonnel = () => {
    if (personnelFormData.namaPersonil && personnelFormData.jabatan && personnelFormData.divisi) {
      const newPersonnel: PersonnelData = {
        id: Date.now().toString(),
        namaPersonil: personnelFormData.namaPersonil,
        jabatan: personnelFormData.jabatan,
        divisi: personnelFormData.divisi,
        totalTraining: 0,
        validTraining: 0,
        expiredTraining: 0,
        hrdSyncStatus: personnelFormData.hrdSyncStatus || 'Pending',
        trainings: []
      };
      
      setPersonnelData(prev => [...prev, newPersonnel]);
      setShowAddPersonnelModal(false);
      setPersonnelFormData({});
    }
  };

  // CRUD Functions for Training
  const handleAddTraining = () => {
    if (!selectedPersonnel) return;
    
    setFormData({
      namaSertifikat: '',
      noSertifikat: '',
      vendor: '',
      tanggalTerbit: '',
      tanggalExpired: '',
      validitas: 'Valid',
      approval: 'Pending',
      status: 'Pengajuan',
      documentSertifikat: '',
      daysUntilExpiry: 0,
      isExpiringSoon: false
    });
    setShowAddModal(true);
  };

  const handleEditTraining = (training: TrainingDetail) => {
    setFormData(training);
    setEditingItem(training);
    setShowEditModal(true);
  };

  const handleViewTraining = (training: TrainingDetail) => {
    setViewingItem(training);
    setShowViewModal(true);
  };

  const handleSaveTraining = () => {
    if (!selectedPersonnel || !formData.namaSertifikat) return;

    const calculateDaysUntilExpiry = (expiredDate: string) => {
      const today = new Date();
      const expiry = new Date(expiredDate);
      const diffTime = expiry.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysUntilExpiry = formData.tanggalExpired ? calculateDaysUntilExpiry(formData.tanggalExpired) : 0;
    const validitas: 'Valid' | 'Mendekati Expired' | 'Expired' = 
      daysUntilExpiry <= 0 ? 'Expired' : 
      daysUntilExpiry <= 30 ? 'Mendekati Expired' : 'Valid';

    if (editingItem) {
      // Update existing training
      const updatedTraining: TrainingDetail = {
        ...editingItem,
        ...formData,
        validitas,
        daysUntilExpiry,
        isExpiringSoon: daysUntilExpiry <= 30 && daysUntilExpiry > 0
      } as TrainingDetail;

      const updatedPersonnel = {
        ...selectedPersonnel,
        trainings: selectedPersonnel.trainings.map(t => t.id === editingItem.id ? updatedTraining : t)
      };

      // Recalculate personnel statistics
      updatedPersonnel.validTraining = updatedPersonnel.trainings.filter(t => t.validitas === 'Valid').length;
      updatedPersonnel.expiredTraining = updatedPersonnel.trainings.filter(t => t.validitas === 'Expired').length;

      setPersonnelData(prev => prev.map(p => p.id === selectedPersonnel.id ? updatedPersonnel : p));
      setSelectedPersonnel(updatedPersonnel);
      setShowEditModal(false);
    } else {
      // Add new training
      const newTraining: TrainingDetail = {
        id: Date.now().toString(),
        ...formData,
        validitas,
        daysUntilExpiry,
        isExpiringSoon: daysUntilExpiry <= 30 && daysUntilExpiry > 0
      } as TrainingDetail;

      const updatedPersonnel = {
        ...selectedPersonnel,
        trainings: [...selectedPersonnel.trainings, newTraining],
        totalTraining: selectedPersonnel.totalTraining + 1
      };

      // Recalculate personnel statistics
      updatedPersonnel.validTraining = updatedPersonnel.trainings.filter(t => t.validitas === 'Valid').length;
      updatedPersonnel.expiredTraining = updatedPersonnel.trainings.filter(t => t.validitas === 'Expired').length;

      setPersonnelData(prev => prev.map(p => p.id === selectedPersonnel.id ? updatedPersonnel : p));
      setSelectedPersonnel(updatedPersonnel);
      setShowAddModal(false);
    }

    setFormData({});
    setEditingItem(null);
  };

  const handleInputChange = (field: keyof TrainingDetail, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonnelInputChange = (field: keyof PersonnelData, value: string) => {
    setPersonnelFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Kompetensi Personil</h1>
        </div>
        <p className="text-gray-600">Monitoring dan manajemen kompetensi personil dengan integrasi HRD dan approval workflow</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Personil</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPersonil}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valid Certificates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.validCertificates}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mendekati Expired</p>
              <p className="text-2xl font-bold text-gray-900">{stats.mendekatiExpired}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Need Approval</p>
              <p className="text-2xl font-bold text-gray-900">{stats.needsApproval}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">HRD Sync Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.hrdSyncPending}</p>
            </div>
            <ExternalLink className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-teal-500" />
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari nama personil..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Eye className="h-4 w-4" />
                Filter
              </button>
              <button
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Sync dengan HRD"
              >
                <ExternalLink className="h-4 w-4" />
                Sync HRD
              </button>
              <button
                onClick={!showDetailView ? handleAddPersonnel : handleAddTraining}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                {!showDetailView ? 'Tambah Personil' : 'Tambah Training'}
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Proses</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Status</option>
                  <option value="Pengajuan">Pengajuan</option>
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validitas Sertifikat</label>
                <select
                  value={filterValiditas}
                  onChange={(e) => setFilterValiditas(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Validitas</option>
                  <option value="Valid">Valid</option>
                  <option value="Mendekati Expired">Mendekati Expired</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterStatus('');
                    setFilterValiditas('');
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Personnel List or Detail View */}
        <div className="p-4">
          {!showDetailView ? (
            // Personnel List View
            <div className="space-y-4">
              {filteredPersonnelData.map((personil) => (
                <div key={personil.id} className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <User className="h-10 w-10 text-blue-500 bg-blue-100 rounded-full p-2" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{personil.namaPersonil}</h3>
                          <p className="text-sm text-gray-600">{personil.jabatan} - {personil.divisi}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">Total Training: {personil.totalTraining}</span>
                            <span className="text-xs text-green-600">Valid: {personil.validTraining}</span>
                            <span className="text-xs text-red-600">Expired: {personil.expiredTraining}</span>
                            <span className={getStatusBadge(personil.hrdSyncStatus, 'sync')}>{personil.hrdSyncStatus}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPersonnel(personil);
                          setShowDetailView(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                        Detail Training
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Training Detail View
            <div>
              {/* Back Button */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    setShowDetailView(false);
                    setSelectedPersonnel(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Daftar Personil
                </button>
              </div>

              {/* Personnel Info */}
              {selectedPersonnel && (
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                      <User className="h-12 w-12 text-blue-500 bg-blue-100 rounded-full p-3" />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedPersonnel.namaPersonil}</h2>
                        <p className="text-gray-600">{selectedPersonnel.jabatan} - {selectedPersonnel.divisi}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">Total: {selectedPersonnel.totalTraining} Training</span>
                          <span className={getStatusBadge(selectedPersonnel.hrdSyncStatus, 'sync')}>{selectedPersonnel.hrdSyncStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Training Details Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Sertifikat</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Sertifikat</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Terbit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Expired</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validitas</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedPersonnel.trainings.map((training) => (
                          <tr key={training.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{training.namaSertifikat}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{training.noSertifikat}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{training.vendor}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{training.tanggalTerbit}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{training.tanggalExpired}</div>
                              <div className="flex items-center gap-1">
                                <span className={getExpiryBadge(training.daysUntilExpiry || 0)}>
                                  {formatExpiryText(training.daysUntilExpiry || 0)}
                                </span>
                                {training.isExpiringSoon && <Bell className="h-4 w-4 text-orange-500" />}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getStatusBadge(training.validitas, 'validitas')}>{training.validitas}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getStatusBadge(training.approval, 'approval')}>{training.approval}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getStatusBadge(training.status, 'proses')}>{training.status}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEditTraining(training)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleViewTraining(training)}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                  title="View"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteItem(training)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <ConfirmDeleteModal
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => {
            if (selectedPersonnel && deleteItem) {
              const updatedPersonnel = {
                ...selectedPersonnel,
                trainings: selectedPersonnel.trainings.filter(t => t.id !== deleteItem.id),
                totalTraining: selectedPersonnel.totalTraining - 1
              };
              
              // Recalculate statistics
              updatedPersonnel.validTraining = updatedPersonnel.trainings.filter(t => t.validitas === 'Valid').length;
              updatedPersonnel.expiredTraining = updatedPersonnel.trainings.filter(t => t.validitas === 'Expired').length;
              
              setPersonnelData(prev => prev.map(p => p.id === selectedPersonnel.id ? updatedPersonnel : p));
              setSelectedPersonnel(updatedPersonnel);
              setDeleteItem(null);
            }
          }}
          itemName={deleteItem.namaSertifikat}
        />
      )}

      {/* Add Personnel Modal */}
      {showAddPersonnelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Tambah Personil Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Personil</label>
                <input
                  type="text"
                  value={personnelFormData.namaPersonil || ''}
                  onChange={(e) => handlePersonnelInputChange('namaPersonil', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama personil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                <input
                  type="text"
                  value={personnelFormData.jabatan || ''}
                  onChange={(e) => handlePersonnelInputChange('jabatan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan jabatan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                <input
                  type="text"
                  value={personnelFormData.divisi || ''}
                  onChange={(e) => handlePersonnelInputChange('divisi', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan divisi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status HRD Sync</label>
                <select
                  value={personnelFormData.hrdSyncStatus || 'Pending'}
                  onChange={(e) => handlePersonnelInputChange('hrdSyncStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Synced">Synced</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddPersonnelModal(false);
                  setPersonnelFormData({});
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSavePersonnel}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Training Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Tambah Training Baru</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sertifikat</label>
                <input
                  type="text"
                  value={formData.namaSertifikat || ''}
                  onChange={(e) => handleInputChange('namaSertifikat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama sertifikat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Sertifikat</label>
                <input
                  type="text"
                  value={formData.noSertifikat || ''}
                  onChange={(e) => handleInputChange('noSertifikat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor sertifikat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <input
                  type="text"
                  value={formData.vendor || ''}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan vendor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Terbit</label>
                <input
                  type="date"
                  value={formData.tanggalTerbit || ''}
                  onChange={(e) => handleInputChange('tanggalTerbit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Expired</label>
                <input
                  type="date"
                  value={formData.tanggalExpired || ''}
                  onChange={(e) => handleInputChange('tanggalExpired', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status || 'Pengajuan'}
                  onChange={(e) => handleInputChange('status', e.target.value as 'Pengajuan' | 'Proses' | 'Selesai')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pengajuan">Pengajuan</option>
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approval</label>
                <select
                  value={formData.approval || 'Pending'}
                  onChange={(e) => handleInputChange('approval', e.target.value as 'Pending' | 'Approved' | 'Rejected')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dokumen Sertifikat</label>
                <input
                  type="text"
                  value={formData.documentSertifikat || ''}
                  onChange={(e) => handleInputChange('documentSertifikat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="URL atau path dokumen sertifikat"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({});
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveTraining}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Training Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Training</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sertifikat</label>
                <input
                  type="text"
                  value={formData.namaSertifikat || ''}
                  onChange={(e) => handleInputChange('namaSertifikat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama sertifikat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Sertifikat</label>
                <input
                  type="text"
                  value={formData.noSertifikat || ''}
                  onChange={(e) => handleInputChange('noSertifikat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor sertifikat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <input
                  type="text"
                  value={formData.vendor || ''}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan vendor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Terbit</label>
                <input
                  type="date"
                  value={formData.tanggalTerbit || ''}
                  onChange={(e) => handleInputChange('tanggalTerbit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Expired</label>
                <input
                  type="date"
                  value={formData.tanggalExpired || ''}
                  onChange={(e) => handleInputChange('tanggalExpired', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status || 'Pengajuan'}
                  onChange={(e) => handleInputChange('status', e.target.value as 'Pengajuan' | 'Proses' | 'Selesai')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pengajuan">Pengajuan</option>
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approval</label>
                <select
                  value={formData.approval || 'Pending'}
                  onChange={(e) => handleInputChange('approval', e.target.value as 'Pending' | 'Approved' | 'Rejected')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dokumen Sertifikat</label>
                <input
                  type="text"
                  value={formData.documentSertifikat || ''}
                  onChange={(e) => handleInputChange('documentSertifikat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="URL atau path dokumen sertifikat"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setFormData({});
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveTraining}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Training Modal */}
      {showViewModal && viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Detail Training</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sertifikat</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  {viewingItem.namaSertifikat}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Sertifikat</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  {viewingItem.noSertifikat}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  {viewingItem.vendor}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Terbit</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  {viewingItem.tanggalTerbit}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Expired</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  {viewingItem.tanggalExpired}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validitas</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  <span className={getStatusBadge(viewingItem.validitas, 'validitas')}>
                    {viewingItem.validitas}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  <span className={getStatusBadge(viewingItem.status, 'proses')}>
                    {viewingItem.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approval</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  <span className={getStatusBadge(viewingItem.approval, 'approval')}>
                    {viewingItem.approval}
                  </span>
                </div>
              </div>
              {viewingItem.documentSertifikat && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dokumen Sertifikat</label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    <a href={viewingItem.documentSertifikat} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {viewingItem.documentSertifikat}
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewingItem(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEKompetensiPersonilDashboard;
