import React, { useEffect, useState } from 'react';
import {
  Search,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  Save
} from 'lucide-react';

interface ProconSalesOrder {
  id: string;
  no: number;
  date: string;
  soNo: string;
  client: string;
  equipmentScopeLocation: string;
  equipmentReceived: string;
  scopeOfWork: string;
  manPower: string;
  location: string;
  periodByHour: string;
  duration: string;
  periodByReportTo: string;
  reported: string;
  dueDate: string;
  delaySubmitReport: string;
  reportReceived: string;
  dueDateFinance: string;
  delaySubmitToFinance: string;
  piAmount: string;
  keterangan: string;
  piNo: string;
  remarkProjectControl: string;
  invoiceNo: string;
  invoiceAmount: string;
  invoiceAmountPpn: string;
  dueDatePayment: string;
  paidDate: string;
  delayPayment: string;
  remarkFinance: string;
  status: string;
  lir: string;
  yearSheet: string;
  statusPekerjaan: string;
  statusAR: string;
  statusAP: string;
  remark: string;
  logDataPak: string;
  logMekanik: string;
}

const ProconSalesOrderDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchNomorKontrak, setSearchNomorKontrak] = useState('');
  const [searchClient, setSearchClient] = useState('');
  const [selectedJenisPekerjaan, setSelectedJenisPekerjaan] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [jenisPekerjaanDropdownOpen, setJenisPekerjaanDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState<string>('');
  // CRUD Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProconSalesOrder | null>(null);
  const [formData, setFormData] = useState<Partial<ProconSalesOrder>>({});

  // Sample data matching the Excel structure
  const [salesOrders, setSalesOrders] = useState<ProconSalesOrder[]>([
    // Red rows - Critical/Overdue status
    {
      id: '1',
      no: 1,
      date: '01-Jan-25',
      soNo: 'SO-2025-001',
      client: 'PT PERTAMINA HULU ENERGI ONWJ',
      equipmentScopeLocation: 'ONSHORE',
      equipmentReceived: 'COMPLETE',
      scopeOfWork: 'STAT',
      manPower: '4',
      location: 'KARAWANG',
      periodByHour: '8',
      duration: '1 DAY',
      periodByReportTo: '01-Jan-25',
      reported: 'YES',
      dueDate: '02-Jan-25',
      delaySubmitReport: '15',
      reportReceived: '17-Jan-25',
      dueDateFinance: '03-Jan-25',
      delaySubmitToFinance: '14',
      piAmount: '15,000,000',
      keterangan: 'OVERDUE',
      piNo: 'PI-2025-001',
      remarkProjectControl: 'CRITICAL DELAY',
      invoiceNo: 'INV-2025-001',
      invoiceAmount: '15,000,000',
      invoiceAmountPpn: '16,650,000',
      dueDatePayment: '31-Jan-25',
      paidDate: '',
      delayPayment: '25',
      remarkFinance: 'OVERDUE PAYMENT',
      status: 'OVERDUE',
      lir: 'NO',
      yearSheet: '2025',
      statusPekerjaan: 'OVERDUE',
      statusAR: 'OVERDUE',
      statusAP: 'OVERDUE',
      remark: 'CRITICAL - IMMEDIATE ACTION REQUIRED',
      logDataPak: 'DELAYED',
      logMekanik: 'DELAYED'
    },
    {
      id: '2',
      no: 2,
      date: '05-Jan-25',
      soNo: 'SO-2025-002',
      client: 'MEDCO E&P ONSHORE NORTH JAVA',
      equipmentScopeLocation: 'ONSHORE',
      equipmentReceived: 'PARTIAL',
      scopeOfWork: 'NDT INSPECTION',
      manPower: '6',
      location: 'TUBAN',
      periodByHour: '16',
      duration: '2 DAYS',
      periodByReportTo: '07-Jan-25',
      reported: 'NO',
      dueDate: '08-Jan-25',
      delaySubmitReport: '12',
      reportReceived: '',
      dueDateFinance: '09-Jan-25',
      delaySubmitToFinance: '11',
      piAmount: '25,000,000',
      keterangan: 'CRITICAL',
      piNo: 'PI-2025-002',
      remarkProjectControl: 'EQUIPMENT MISSING',
      invoiceNo: '',
      invoiceAmount: '',
      invoiceAmountPpn: '',
      dueDatePayment: '',
      paidDate: '',
      delayPayment: '0',
      remarkFinance: 'NOT INVOICED',
      status: 'CRITICAL',
      lir: 'NO',
      yearSheet: '2025',
      statusPekerjaan: 'CRITICAL',
      statusAR: 'NOT STARTED',
      statusAP: 'NOT STARTED',
      remark: 'URGENT - EQUIPMENT REQUIRED',
      logDataPak: 'PENDING',
      logMekanik: 'PENDING'
    },
    // White/Light rows - Normal/Completed status
    {
      id: '3',
      no: 3,
      date: '10-Jan-25',
      soNo: 'SO-2025-003',
      client: 'MEDCO E&P ONSHORE NORTH JAVA',
      equipmentScopeLocation: 'OFFSHORE',
      equipmentReceived: 'COMPLETE',
      scopeOfWork: 'ULTRASONIC INSPECTION',
      manPower: '8',
      location: 'OFFSHORE PLATFORM',
      periodByHour: '24',
      duration: '3 DAYS',
      periodByReportTo: '13-Jan-25',
      reported: 'YES',
      dueDate: '14-Jan-25',
      delaySubmitReport: '0',
      reportReceived: '14-Jan-25',
      dueDateFinance: '15-Jan-25',
      delaySubmitToFinance: '0',
      piAmount: '45,000,000',
      keterangan: 'COMPLETED',
      piNo: 'PI-2025-003',
      remarkProjectControl: 'ON SCHEDULE',
      invoiceNo: 'INV-2025-003',
      invoiceAmount: '45,000,000',
      invoiceAmountPpn: '49,950,000',
      dueDatePayment: '28-Feb-25',
      paidDate: '25-Feb-25',
      delayPayment: '0',
      remarkFinance: 'PAID ON TIME',
      status: 'COMPLETED',
      lir: 'YES',
      yearSheet: '2025',
      statusPekerjaan: 'SELESAI',
      statusAR: 'LUNAS',
      statusAP: 'PAID',
      remark: 'EXCELLENT PERFORMANCE',
      logDataPak: 'COMPLETE',
      logMekanik: 'COMPLETE'
    },
    {
      id: '4',
      no: 4,
      date: '12-Jan-25',
      soNo: 'SO-2025-004',
      client: 'PT PERTAMINA HULU ENERGI ONWJ',
      equipmentScopeLocation: 'ONSHORE',
      equipmentReceived: 'COMPLETE',
      scopeOfWork: 'RADIOGRAPHIC INSPECTION',
      manPower: '4',
      location: 'GRESIK',
      periodByHour: '12',
      duration: '1.5 DAYS',
      periodByReportTo: '14-Jan-25',
      reported: 'YES',
      dueDate: '15-Jan-25',
      delaySubmitReport: '0',
      reportReceived: '15-Jan-25',
      dueDateFinance: '16-Jan-25',
      delaySubmitToFinance: '0',
      piAmount: '18,000,000',
      keterangan: 'COMPLETED',
      piNo: 'PI-2025-004',
      remarkProjectControl: 'GOOD PERFORMANCE',
      invoiceNo: 'INV-2025-004',
      invoiceAmount: '18,000,000',
      invoiceAmountPpn: '19,980,000',
      dueDatePayment: '28-Feb-25',
      paidDate: '20-Feb-25',
      delayPayment: '0',
      remarkFinance: 'PAID',
      status: 'COMPLETED',
      lir: 'YES',
      yearSheet: '2025',
      statusPekerjaan: 'SELESAI',
      statusAR: 'LUNAS',
      statusAP: 'PAID',
      remark: 'GOOD QUALITY WORK',
      logDataPak: 'COMPLETE',
      logMekanik: 'COMPLETE'
    },
    // Pink/Salmon rows - Warning/Attention status
    {
      id: '5',
      no: 5,
      date: '15-Jan-25',
      soNo: 'SO-2025-005',
      client: 'ENI MUARA BAKAU B.V.',
      equipmentScopeLocation: 'OFFSHORE',
      equipmentReceived: 'COMPLETE',
      scopeOfWork: 'STAT',
      manPower: '6',
      location: 'MUARA BAKAU',
      periodByHour: '48',
      duration: '6 DAYS',
      periodByReportTo: '21-Jan-25',
      reported: 'YES',
      dueDate: '22-Jan-25',
      delaySubmitReport: '3',
      reportReceived: '25-Jan-25',
      dueDateFinance: '23-Jan-25',
      delaySubmitToFinance: '2',
      piAmount: '75,000,000',
      keterangan: 'MINOR DELAY',
      piNo: 'PI-2025-005',
      remarkProjectControl: 'SLIGHT DELAY',
      invoiceNo: 'INV-2025-005',
      invoiceAmount: '75,000,000',
      invoiceAmountPpn: '83,250,000',
      dueDatePayment: '31-Mar-25',
      paidDate: '',
      delayPayment: '5',
      remarkFinance: 'PAYMENT PENDING',
      status: 'WARNING',
      lir: 'PARTIAL',
      yearSheet: '2025',
      statusPekerjaan: 'WARNING',
      statusAR: 'OUTSTANDING',
      statusAP: 'PENDING',
      remark: 'MINOR DELAYS - MONITORING REQUIRED',
      logDataPak: 'PARTIAL',
      logMekanik: 'PARTIAL'
    },
    // Blue rows - In Progress status
    {
      id: '6',
      no: 6,
      date: '18-Jan-25',
      soNo: 'SO-2025-006',
      client: 'MEDCO E&P ONSHORE NORTH JAVA',
      equipmentScopeLocation: 'ONSHORE',
      equipmentReceived: 'COMPLETE',
      scopeOfWork: 'MAGNETIC PARTICLE INSPECTION',
      manPower: '5',
      location: 'SURABAYA',
      periodByHour: '20',
      duration: '2.5 DAYS',
      periodByReportTo: '21-Jan-25',
      reported: 'PARTIAL',
      dueDate: '22-Jan-25',
      delaySubmitReport: '0',
      reportReceived: '',
      dueDateFinance: '23-Jan-25',
      delaySubmitToFinance: '0',
      piAmount: '32,000,000',
      keterangan: 'IN PROGRESS',
      piNo: 'PI-2025-006',
      remarkProjectControl: 'ON TRACK',
      invoiceNo: '',
      invoiceAmount: '',
      invoiceAmountPpn: '',
      dueDatePayment: '',
      paidDate: '',
      delayPayment: '0',
      remarkFinance: 'AWAITING COMPLETION',
      status: 'IN PROGRESS',
      lir: 'PARTIAL',
      yearSheet: '2025',
      statusPekerjaan: 'PROGRESS',
      statusAR: 'NOT STARTED',
      statusAP: 'NOT STARTED',
      remark: 'WORK IN PROGRESS - ON SCHEDULE',
      logDataPak: 'PROGRESS',
      logMekanik: 'PROGRESS'
    },
    // Green rows - Good/Excellent status
    {
      id: '7',
      no: 7,
      date: '20-Jan-25',
      soNo: 'SO-2025-007',
      client: 'PT PERTAMINA HULU ENERGI ONWJ',
      equipmentScopeLocation: 'OFFSHORE',
      equipmentReceived: 'COMPLETE',
      scopeOfWork: 'COMPREHENSIVE INSPECTION',
      manPower: '10',
      location: 'OFFSHORE RIG',
      periodByHour: '72',
      duration: '9 DAYS',
      periodByReportTo: '29-Jan-25',
      reported: 'YES',
      dueDate: '30-Jan-25',
      delaySubmitReport: '-2',
      reportReceived: '28-Jan-25',
      dueDateFinance: '31-Jan-25',
      delaySubmitToFinance: '-3',
      piAmount: '95,000,000',
      keterangan: 'EXCELLENT',
      piNo: 'PI-2025-007',
      remarkProjectControl: 'AHEAD OF SCHEDULE',
      invoiceNo: 'INV-2025-007',
      invoiceAmount: '95,000,000',
      invoiceAmountPpn: '105,450,000',
      dueDatePayment: '31-Mar-25',
      paidDate: '25-Mar-25',
      delayPayment: '-6',
      remarkFinance: 'EARLY PAYMENT',
      status: 'EXCELLENT',
      lir: 'YES',
      yearSheet: '2025',
      statusPekerjaan: 'EXCELLENT',
      statusAR: 'LUNAS',
      statusAP: 'PAID',
      remark: 'OUTSTANDING PERFORMANCE - AHEAD OF SCHEDULE',
      logDataPak: 'EXCELLENT',
      logMekanik: 'EXCELLENT'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const getJenisPekerjaanColor = (jenis: string) => {
    switch (jenis) {
      case 'On Call': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Tender': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const jenisPekerjaanOptions = ['On Call', 'Tender'];

  // Filtered data
  const filteredData = salesOrders.filter(item => {
    const matchesNoSO = item.soNo.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesNomorKontrak = item.piNo.toLowerCase().includes(searchNomorKontrak.toLowerCase());
    const matchesClient = item.client.toLowerCase().includes(searchClient.toLowerCase());
    const matchesJenisPekerjaan = selectedJenisPekerjaan ? item.statusPekerjaan === selectedJenisPekerjaan : true;

    // Date filtering
    const itemDate = new Date(item.date.split('-').reverse().join('-'));
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDate = (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);

    return matchesNoSO && matchesNomorKontrak && matchesClient && matchesJenisPekerjaan && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (totalPages === 0) return;
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleGoToPage = () => {
    if (!goToPageInput) return;
    const parsed = parseInt(goToPageInput, 10);
    if (!isNaN(parsed)) {
      handlePageChange(parsed);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  // Helper function to get row color based on status
  const getRowColor = (item: ProconSalesOrder) => {
    // Red rows - Critical/Overdue status
    if (item.status === 'OVERDUE' || item.status === 'CRITICAL' || 
        item.keterangan === 'OVERDUE' || item.keterangan === 'CRITICAL') {
      return 'bg-red-100 hover:bg-red-200';
    }
    // Pink/Salmon rows - Warning/Attention status  
    if (item.status === 'WARNING' || item.keterangan === 'MINOR DELAY') {
      return 'bg-pink-100 hover:bg-pink-200';
    }
    // Blue rows - In Progress status
    if (item.status === 'IN PROGRESS' || item.keterangan === 'IN PROGRESS') {
      return 'bg-blue-100 hover:bg-blue-200';
    }
    // Green rows - Excellent/Good status
    if (item.status === 'EXCELLENT' || item.keterangan === 'EXCELLENT') {
      return 'bg-green-100 hover:bg-green-200';
    }
    // White/Light rows - Normal/Completed status (default)
    return 'bg-white hover:bg-gray-50';
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IN PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'INVOICED':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'OVERDUE':
        return 'bg-red-200 text-red-800 border-red-300';
      case 'CRITICAL':
        return 'bg-red-300 text-red-800 border-red-400';
      case 'WARNING':
        return 'bg-pink-200 text-pink-800 border-pink-300';
      case 'EXCELLENT':
        return 'bg-green-200 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // CRUD Functions
  const handleAdd = () => {
    setFormData({
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
      yearSheet: '2025',
      status: 'IN PROGRESS',
      keterangan: 'IN PROGRESS',
      statusPekerjaan: 'PROGRESS',
      statusAR: 'NOT STARTED',
      statusAP: 'NOT STARTED',
      lir: 'NO',
      reported: 'NO',
      equipmentReceived: 'PARTIAL',
      equipmentScopeLocation: 'ONSHORE',
      delaySubmitReport: '0',
      delaySubmitToFinance: '0',
      delayPayment: '0',
      logDataPak: 'PENDING',
      logMekanik: 'PENDING'
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (item: ProconSalesOrder) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setIsEditModalOpen(true);
  };

  const handleView = (item: ProconSalesOrder) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleDelete = (item: ProconSalesOrder) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSave = () => {
    if (isAddModalOpen) {
      const newId = (salesOrders.length + 1).toString();
      const newNo = salesOrders.length + 1;
      const newSoNo = `SO-2025-${String(newNo).padStart(3, '0')}`;
      const newPiNo = `PI-2025-${String(newNo).padStart(3, '0')}`;
      
      const newItem: ProconSalesOrder = {
        ...formData as ProconSalesOrder,
        id: newId,
        no: newNo,
        soNo: newSoNo,
        piNo: newPiNo
      };
      
      setSalesOrders(prev => [newItem, ...prev]);
      setIsAddModalOpen(false);
    } else if (isEditModalOpen && selectedItem) {
      setSalesOrders(prev => 
        prev.map(item => 
          item.id === selectedItem.id ? { ...formData as ProconSalesOrder, id: selectedItem.id, no: selectedItem.no } : item
        )
      );
      setIsEditModalOpen(false);
    }
    setFormData({});
    setSelectedItem(null);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setSalesOrders(prev => prev.filter(item => item.id !== selectedItem.id));
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleInputChange = (field: keyof ProconSalesOrder, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                  DAFTAR SALES ORDER
                </h1>
                <nav className="text-sm text-gray-600">
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">Procon</span>
                  <span className="mx-2">›</span>
                  <span className="text-blue-600 font-semibold">Sales Order</span>
                </nav>
              </div>
              <div className="flex items-center justify-end gap-3 text-sm">
                <Clock className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
              </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter Panel (same as Marketing) */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Cari No SO */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari No SO</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNoSO}
                  onChange={(e) => setSearchNoSO(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Cari No SO..."
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cari Nomor Kontrak */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari Nomor Kontrak</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNomorKontrak}
                  onChange={(e) => setSearchNomorKontrak(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Cari Nomor Kontrak..."
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Pilih Jenis Pekerjaan Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Pilih Jenis Pekerjaan</label>
              <div className="relative">
                <button
                  onClick={() => setJenisPekerjaanDropdownOpen(!jenisPekerjaanDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-xs"
                >
                  <span className={selectedJenisPekerjaan ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedJenisPekerjaan || 'Pilih jenis pekerjaan...'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${jenisPekerjaanDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {jenisPekerjaanDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedJenisPekerjaan('');
                        setJenisPekerjaanDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-xs"
                    >
                      Semua Jenis Pekerjaan
                    </button>
                    {jenisPekerjaanOptions.map((jenis) => (
                      <button
                        key={jenis}
                        onClick={() => {
                          setSelectedJenisPekerjaan(jenis);
                          setJenisPekerjaanDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2 text-xs"
                      >
                        <span className={`w-3 h-3 rounded-full ${jenis === 'On Call' ? 'bg-cyan-500' : 'bg-red-500'}`}></span>
                        <span>{jenis}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cari Client */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari Client</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Cari Client..."
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Dari */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Periode Dari</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Sampai */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Periode Sampai</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-1 flex items-end">
              <button 
                onClick={handleSearch}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center justify-center space-x-2 text-xs"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Note: intentionally removed Add button and actions for Procon (read-only) */}
          <div className="flex justify-end space-x-2 mt-6">
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-xs">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-2 text-xs">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-yellow-400 border-b border-gray-200 sticky top-0">
                {/* First row - Main headers */}
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[50px]" rowSpan={2}>NO</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]" rowSpan={2}>DATE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>SO NO</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[200px]" rowSpan={2}>CLIENT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]" rowSpan={2}>QUO/PO/WO/RO/SPK/CONTRACT NO</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>PO/KONTRAK RECEIVED</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[150px]" rowSpan={2}>SCOPE OF WORK</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]" rowSpan={2}>MAN POWER</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]" rowSpan={2}>LOCATION</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300" colSpan={3}>PERIOD BY EMAIL</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300" colSpan={3}>PERIOD BY REPORT & TS</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]" rowSpan={2}>REPORTED</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]" rowSpan={2}>DUE DATE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>DELAY SUBMIT REPORT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>REPORT RECEIVED</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>DUE DATE FINANCE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]" rowSpan={2}>DELAY SUBMIT TO FINANCE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]" rowSpan={2}>PI AMOUNT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>KETERANGAN</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>PI NO</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[150px]" rowSpan={2}>REMARK PROJECT CONTROL</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>INVOICE NO</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]" rowSpan={2}>INVOICE AMOUNT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]" rowSpan={2}>INVOICE AMOUNT PPN 11%</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>DUE DATE PAYMENT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]" rowSpan={2}>PAID DATE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>DELAY PAYMENT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]" rowSpan={2}>REMARK FINANCE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>STATUS</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[60px]" rowSpan={2}>L/R</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]" rowSpan={2}>ACTIONS</th>
                </tr>
                {/* Second row - Sub headers */}
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[50px]">MOB</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[60px]">DEMOB</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">DURATION</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[50px]">MOB</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[60px]">DEMOB</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">DURATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${getRowColor(item)} ${
                      animateRows ? 'animate-pulse' : ''
                    } transition-colors duration-200`}
                  >
                    <td className="px-2 py-3 border border-gray-300 text-center">
                      <span className="font-bold text-gray-900 text-xs">{item.no}</span>
                    </td>
                    <td className="px-2 py-3 font-medium text-gray-900 text-xs border border-gray-300 text-center whitespace-nowrap">{item.date}</td>
                    <td className="px-2 py-3 font-bold text-blue-600 text-xs border border-gray-300 text-center whitespace-nowrap">{item.soNo}</td>
                    <td className="px-2 py-3 text-gray-700 text-xs border border-gray-300 font-medium">{item.client}</td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.equipmentScopeLocation === 'OFFSHORE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.equipmentScopeLocation}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.equipmentReceived === 'COMPLETE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.equipmentReceived}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-700 text-xs border border-gray-300 font-medium">{item.scopeOfWork}</td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center font-bold">{item.manPower}</td>
                    <td className="px-2 py-3 text-gray-700 text-xs border border-gray-300">{item.location}</td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center font-medium">{item.periodByHour}</td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center font-medium">{item.duration}</td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">{item.periodByReportTo}</td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.reported === 'YES' ? 'text-green-600 bg-green-100' : 
                        item.reported === 'NO' ? 'text-red-600 bg-red-100' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.reported}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">{item.dueDate}</td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`font-bold ${
                        parseInt(item.delaySubmitReport) > 0 ? 'text-red-600 bg-red-100 px-2 py-1 rounded-full' : 
                        parseInt(item.delaySubmitReport) < 0 ? 'text-green-600 bg-green-100 px-2 py-1 rounded-full' : 'text-gray-600'
                      }`}>
                        {item.delaySubmitReport}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">{item.reportReceived}</td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">{item.dueDateFinance}</td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`font-bold ${
                        parseInt(item.delaySubmitToFinance) > 0 ? 'text-red-600 bg-red-100 px-2 py-1 rounded-full' : 
                        parseInt(item.delaySubmitToFinance) < 0 ? 'text-green-600 bg-green-100 px-2 py-1 rounded-full' : 'text-gray-600'
                      }`}>
                        {item.delaySubmitToFinance}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-900 text-xs border border-gray-300 font-bold text-right">
                      {item.piAmount && `Rp ${item.piAmount}`}
                    </td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.keterangan)}`}>
                        {item.keterangan}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-blue-600 text-xs border border-gray-300 font-medium text-center">{item.piNo}</td>
                    <td className="px-2 py-3 text-gray-700 text-xs border border-gray-300">{item.remarkProjectControl}</td>
                    <td className="px-2 py-3 text-blue-600 text-xs border border-gray-300 font-medium text-center">{item.invoiceNo}</td>
                    <td className="px-2 py-3 text-gray-900 text-xs border border-gray-300 font-bold text-right">
                      {item.invoiceAmount && `Rp ${item.invoiceAmount}`}
                    </td>
                    <td className="px-2 py-3 text-gray-900 text-xs border border-gray-300 font-bold text-right">
                      {item.invoiceAmountPpn && `Rp ${item.invoiceAmountPpn}`}
                    </td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">{item.dueDatePayment}</td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center whitespace-nowrap">{item.paidDate}</td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`font-bold ${
                        parseInt(item.delayPayment) > 0 ? 'text-red-600 bg-red-100 px-2 py-1 rounded-full' : 
                        parseInt(item.delayPayment) < 0 ? 'text-green-600 bg-green-100 px-2 py-1 rounded-full' : 'text-gray-600'
                      }`}>
                        {item.delayPayment}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-700 text-xs border border-gray-300">{item.remarkFinance}</td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`font-bold px-2 py-1 rounded-full ${
                        item.lir === 'YES' ? 'text-green-600 bg-green-100' : 
                        item.lir === 'NO' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'
                      }`}>
                        {item.lir}
                      </span>
                    </td>
                    {/* L/R Column */}
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center font-bold">{item.yearSheet}</td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.statusPekerjaan)}`}>
                        {item.statusPekerjaan}
                      </span>
                    </td>
                    <td></td>
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => handleView(item)}
                          className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
                          title="View"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => handleEdit(item)}
                          className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs"
                          title="Edit"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item)}
                          className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer controls */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center flex-wrap gap-2 text-xs text-gray-700">
                <span>
                  Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
                </span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <label className="flex items-center gap-2">
                  <span className="text-gray-600">Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-200 rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || totalPages === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || totalPages === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow shadow-blue-600/20'
                        : 'text-gray-700 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 text-xs">
                <span className="text-gray-600">Go to page:</span>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, totalPages)}
                  value={goToPageInput}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleGoToPage(); } }}
                  className="w-16 px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleGoToPage}
                  className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs disabled:opacity-50"
                  disabled={totalPages === 0}
                >
                  Go
                </button>
                <span className="text-gray-500">/ {Math.max(1, totalPages)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Sales Order</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input
                  type="text"
                  value={formData.client || ''}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Scope Location</label>
                <select
                  value={formData.equipmentScopeLocation || ''}
                  onChange={(e) => handleInputChange('equipmentScopeLocation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  <option value="ONSHORE">ONSHORE</option>
                  <option value="OFFSHORE">OFFSHORE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Received</label>
                <select
                  value={formData.equipmentReceived || ''}
                  onChange={(e) => handleInputChange('equipmentReceived', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="COMPLETE">COMPLETE</option>
                  <option value="PARTIAL">PARTIAL</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Scope of Work</label>
                <textarea
                  value={formData.scopeOfWork || ''}
                  onChange={(e) => handleInputChange('scopeOfWork', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Man Power</label>
                <input
                  type="text"
                  value={formData.manPower || ''}
                  onChange={(e) => handleInputChange('manPower', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Sales Order</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input
                  type="text"
                  value={formData.client || ''}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Scope Location</label>
                <select
                  value={formData.equipmentScopeLocation || ''}
                  onChange={(e) => handleInputChange('equipmentScopeLocation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  <option value="ONSHORE">ONSHORE</option>
                  <option value="OFFSHORE">OFFSHORE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Received</label>
                <select
                  value={formData.equipmentReceived || ''}
                  onChange={(e) => handleInputChange('equipmentReceived', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="COMPLETE">COMPLETE</option>
                  <option value="PARTIAL">PARTIAL</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Scope of Work</label>
                <textarea
                  value={formData.scopeOfWork || ''}
                  onChange={(e) => handleInputChange('scopeOfWork', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Man Power</label>
                <input
                  type="text"
                  value={formData.manPower || ''}
                  onChange={(e) => handleInputChange('manPower', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Update</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">View Sales Order</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SO Number</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedItem.soNo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedItem.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedItem.client}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Scope Location</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedItem.equipmentScopeLocation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Received</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedItem.equipmentReceived}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Man Power</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedItem.manPower}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Scope of Work</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedItem.scopeOfWork}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedItem.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedItem.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PI Amount</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedItem.piAmount}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Confirm Delete</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete Sales Order <strong>{selectedItem.soNo}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProconSalesOrderDashboard;
