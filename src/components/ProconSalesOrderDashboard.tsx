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
  ChevronsRight
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

  // Sample data matching the Excel structure
  const [salesOrders] = useState<ProconSalesOrder[]>([
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
            <div className="flex items-center space-x-3 text-sm text-gray-500">
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
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[50px]">NO</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">DATE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">SO NO</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[200px]">CLIENT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]">EQUIPMENT/SCOPE/LOCATION</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">EQUIPMENT RECEIVED</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[150px]">SCOPE OF WORK</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">MAN POWER</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]">LOCATION</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">PERIOD BY HOUR</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">DURATION</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]">PERIOD BY REPORT TO</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">REPORTED</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">DUE DATE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">DELAY SUBMIT REPORT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">REPORT RECEIVED</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">DUE DATE FINANCE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]">DELAY SUBMIT TO FINANCE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]">PI AMOUNT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">KETERANGAN</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">PI NO</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[150px]">REMARK PROJECT CONTROL</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">INVOICE NO</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]">INVOICE AMOUNT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]">INVOICE AMOUNT PPN 11%</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">DUE DATE PAYMENT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">PAID DATE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">DELAY PAYMENT</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[120px]">REMARK FINANCE</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">STATUS</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[60px]">LIR</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">YEAR SHEET</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">STATUS PEKERJAAN</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">STATUS AR</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[80px]">STATUS AP</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[200px]">REMARK</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">LOG DATA PAK</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-black border border-gray-300 min-w-[100px]">LOG MEKANIK</th>
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
                        item.reported === 'YES' ? 'bg-green-100 text-green-800' : 
                        item.reported === 'NO' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
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
                    <td className="px-2 py-3 text-gray-600 text-xs border border-gray-300 text-center font-bold">{item.yearSheet}</td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.statusPekerjaan)}`}>
                        {item.statusPekerjaan}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.statusAR)}`}>
                        {item.statusAR}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.statusAP)}`}>
                        {item.statusAP}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-gray-700 text-xs border border-gray-300 font-medium">{item.remark}</td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`font-bold px-2 py-1 rounded-full ${
                        item.logDataPak === 'COMPLETE' || item.logDataPak === 'EXCELLENT' ? 'text-green-600 bg-green-100' : 
                        item.logDataPak === 'DELAYED' || item.logDataPak === 'PENDING' ? 'text-red-600 bg-red-100' : 
                        'text-yellow-600 bg-yellow-100'
                      }`}>
                        {item.logDataPak}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-xs border border-gray-300 text-center">
                      <span className={`font-bold px-2 py-1 rounded-full ${
                        item.logMekanik === 'COMPLETE' || item.logMekanik === 'EXCELLENT' ? 'text-green-600 bg-green-100' : 
                        item.logMekanik === 'DELAYED' || item.logMekanik === 'PENDING' ? 'text-red-600 bg-red-100' : 
                        'text-yellow-600 bg-yellow-100'
                      }`}>
                        {item.logMekanik}
                      </span>
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
    </div>
  );
};

export default ProconSalesOrderDashboard;
